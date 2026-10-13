import { readFile } from 'node:fs/promises';
import { afterEach, test } from 'node:test';
import assert from 'node:assert/strict';

const workerSource = await readFile(new URL('./index.js', import.meta.url), 'utf8');
const { default: worker } = await import(`data:text/javascript;base64,${Buffer.from(workerSource).toString('base64')}`);
const originalFetch = globalThis.fetch;
const origin = 'https://vedha.example';
const env = {
  ALLOWED_ORIGIN: origin,
  TWILIO_ACCOUNT_SID: 'AC-test',
  TWILIO_AUTH_TOKEN: 'test-auth-token',
  TWILIO_FROM_NUMBER: '+15005550006',
  TURNSTILE_SECRET_KEY: 'test-turnstile-secret',
};
const order = {
  id: 'ORD-12345678',
  customer: {
    name: 'Test Customer',
    phone: '+919876543210',
    email: 'customer@example.com',
    address: '12 Sample Road',
    city: 'Hubli',
    state: 'Karnataka',
    pincode: '580001',
  },
  items: [{ name: 'VEDHA PRO+ 16L', quantity: 15, unitPrice: 2580 }],
  total: 40635,
};

function request(body = { order, turnstileToken: 'verified-token' }, requestOrigin = origin) {
  return new Request('https://sms.example/send', {
    method: 'POST',
    headers: { Origin: requestOrigin, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test('rejects requests from origins outside the Pages site', async () => {
  const response = await worker.fetch(request(undefined, 'https://attacker.example'), env);
  assert.equal(response.status, 403);
});

test('validates delivery details before contacting SMS providers', async () => {
  globalThis.fetch = async () => {
    throw new Error('providers must not be called for invalid data');
  };
  const response = await worker.fetch(request({
    order: { ...order, customer: { ...order.customer, pincode: '123' } },
    turnstileToken: 'verified-token',
  }), env);
  assert.equal(response.status, 400);
});

test('sends an order SMS only after Turnstile verification', async () => {
  let sentForm;
  globalThis.fetch = async (url, options) => {
    if (String(url).includes('siteverify')) {
      assert.equal(options.body.get('secret'), env.TURNSTILE_SECRET_KEY);
      return Response.json({ success: true });
    }
    sentForm = options.body;
    return Response.json({ sid: 'SM-test' }, { status: 201 });
  };

  const response = await worker.fetch(request(), env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { sent: true });
  assert.equal(sentForm.get('To'), '+918494868403');
  assert.match(sentForm.get('Body'), /ORD-12345678/);
  assert.match(sentForm.get('Body'), /VEDHA PRO\+ 16L x 15/);
  assert.match(sentForm.get('Body'), /customer@example\.com/);
});

test('splits large orders into numbered SMS parts without dropping products', async () => {
  const messages = [];
  globalThis.fetch = async (url, options) => {
    if (String(url).includes('siteverify')) return Response.json({ success: true });
    messages.push(options.body.get('Body'));
    return Response.json({ sid: `SM-${messages.length}` }, { status: 201 });
  };
  const manyItems = Array.from({ length: 50 }, (_, index) => ({
    name: `Product ${index + 1} ${'description '.repeat(7)}`,
    quantity: index + 1,
    unitPrice: 99,
  }));
  const response = await worker.fetch(request({
    turnstileToken: 'verified-token',
    order: { ...order, items: manyItems },
  }), env);

  assert.equal(response.status, 200);
  assert.ok(messages.length > 1);
  assert.ok(messages.every((message) => message.length <= 1_600));
  for (let index = 1; index <= manyItems.length; index += 1) {
    assert.ok(messages.some((message) => message.includes(`Product ${index} `)));
  }
  assert.ok(messages.some((message) => message.includes('Total: INR 40635')));
});

test('reports provider failures without exposing credentials', async () => {
  globalThis.fetch = async (url) => {
    if (String(url).includes('siteverify')) return Response.json({ success: true });
    return Response.json({ message: 'provider failure' }, { status: 500 });
  };

  const response = await worker.fetch(request(), env);
  const body = await response.text();
  assert.equal(response.status, 502);
  assert.doesNotMatch(body, /test-auth-token|test-turnstile-secret/);
});
