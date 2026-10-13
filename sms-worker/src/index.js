const MAX_BODY_BYTES = 12_000;
const MAX_ITEMS = 50;
const MAX_MESSAGE_LENGTH = 1_300;
const ADMIN_PHONE = '+918494868403';

function jsonResponse(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    },
  });
}

function clean(value, maxLength) {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function validOrder(order) {
  if (!order || typeof order !== 'object') return false;
  if (!/^ORD-[A-Z0-9-]{4,40}$/.test(order.id)) return false;
  if (!order.customer || typeof order.customer !== 'object') return false;
  if (!clean(order.customer.name, 100) || clean(order.customer.name, 100).length < 2) return false;
  if (clean(order.customer.phone, 24).replace(/\D/g, '').length < 10) return false;
  if (!/^\S+@\S+\.\S+$/.test(clean(order.customer.email, 254))) return false;
  if (clean(order.customer.address, 240).length < 5) return false;
  if (!clean(order.customer.city, 80) || !clean(order.customer.state, 80)) return false;
  if (!/^\d{6}$/.test(clean(order.customer.pincode, 6))) return false;
  if (!Array.isArray(order.items) || order.items.length === 0 || order.items.length > MAX_ITEMS) return false;
  if (!Number.isFinite(order.total) || order.total < 0 || order.total > 100_000_000) return false;

  return order.items.every((item) =>
    item
    && clean(item.name, 120).length > 0
    && Number.isInteger(item.quantity)
    && item.quantity > 0
    && item.quantity <= 1_000_000
    && Number.isFinite(item.unitPrice)
    && item.unitPrice >= 0
  );
}

async function verifyTurnstile(token, request, secret) {
  const form = new FormData();
  form.set('secret', secret);
  form.set('response', token);
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) form.set('remoteip', ip);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  });
  if (!response.ok) return false;
  const result = await response.json();
  return result.success === true;
}

function makeMessages(order) {
  const items = order.items.map((item) =>
    `- ${clean(item.name, 120)} x ${item.quantity} @ INR ${item.unitPrice}`
  );
  const customer = order.customer;
  const address = [customer.address, customer.city, customer.state, customer.pincode]
    .map((part) => clean(part, 100))
    .filter(Boolean)
    .join(', ');
  const lines = [
    'New Vedha Agro order',
    `Customer: ${clean(customer.name, 100)}`,
    `Phone: ${clean(customer.phone, 24)}`,
    `Email: ${clean(customer.email, 254)}`,
    `Address: ${address}`,
    'Products:',
    ...items,
    `Total: INR ${order.total}`,
  ];

  const chunks = [];
  let currentChunk = [];
  let currentLength = 0;
  for (const line of lines) {
    const nextLength = currentLength + line.length + (currentChunk.length ? 1 : 0);
    if (currentChunk.length && nextLength > MAX_MESSAGE_LENGTH) {
      chunks.push(currentChunk.join('\n'));
      currentChunk = [];
      currentLength = 0;
    }
    currentChunk.push(line);
    currentLength += line.length + (currentChunk.length > 1 ? 1 : 0);
  }
  if (currentChunk.length) chunks.push(currentChunk.join('\n'));

  return chunks.map((chunk, index) =>
    `Order ${order.id} (${index + 1}/${chunks.length})\n${chunk}`
  );
}

const smsWorker = {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') ?? '';
    const allowedOrigin = env.ALLOWED_ORIGIN;
    if (!allowedOrigin || origin !== allowedOrigin) {
      return jsonResponse({ error: 'Origin not allowed' }, 403, allowedOrigin || 'null');
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
          'Vary': 'Origin',
        },
      });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405, allowedOrigin);
    }
    if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_FROM_NUMBER
      || !env.TURNSTILE_SECRET_KEY) {
      return jsonResponse({ error: 'SMS service is not configured' }, 503, allowedOrigin);
    }

    const declaredLength = Number(request.headers.get('Content-Length') ?? 0);
    if (declaredLength > MAX_BODY_BYTES) {
      return jsonResponse({ error: 'Request is too large' }, 413, allowedOrigin);
    }

    let rawBody;
    try {
      rawBody = await request.text();
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400, allowedOrigin);
    }
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return jsonResponse({ error: 'Request is too large' }, 413, allowedOrigin);
    }

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400, allowedOrigin);
    }
    if (!validOrder(body?.order) || typeof body?.turnstileToken !== 'string') {
      return jsonResponse({ error: 'Invalid order details' }, 400, allowedOrigin);
    }

    try {
      const verified = await verifyTurnstile(body.turnstileToken, request, env.TURNSTILE_SECRET_KEY);
      if (!verified) return jsonResponse({ error: 'Security check failed' }, 400, allowedOrigin);

      const accountSid = encodeURIComponent(env.TWILIO_ACCOUNT_SID);
      for (const message of makeMessages(body.order)) {
        const smsResponse = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`)}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              To: ADMIN_PHONE,
              From: env.TWILIO_FROM_NUMBER,
              Body: message,
            }),
          }
        );

        if (!smsResponse.ok) {
          return jsonResponse({ error: 'SMS provider rejected the notification' }, 502, allowedOrigin);
        }
      }
      return jsonResponse({ sent: true }, 200, allowedOrigin);
    } catch {
      return jsonResponse({ error: 'SMS notification could not be sent' }, 502, allowedOrigin);
    }
  },
};

export default smsWorker;
