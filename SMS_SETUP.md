# Admin SMS setup

The storefront is a static GitHub Pages export, so Twilio credentials must never be placed in the browser bundle. SMS delivery is handled by the Cloudflare Worker in `sms-worker/`.

## 1. Create SMS and bot-protection credentials

1. Create a Twilio account, verify the sender number, and obtain an Account SID, Auth Token, and Twilio SMS-capable sender number. For delivery in India, configure the sender and message template to meet the provider's current DLT/telecom requirements.
2. Create a Cloudflare Turnstile widget for the exact GitHub Pages origin. The site key is public; the secret key stays in the Worker.
3. In `sms-worker/wrangler.toml`, replace `https://YOUR_GITHUB_PAGES_DOMAIN` with the exact deployed origin (scheme and host only; browser `Origin` headers do not contain a path).

## 2. Deploy the Worker

From the repository root:

```sh
cd sms-worker
npx wrangler login
npx wrangler secret put TWILIO_ACCOUNT_SID
npx wrangler secret put TWILIO_AUTH_TOKEN
npx wrangler secret put TWILIO_FROM_NUMBER
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler deploy
```

Enter each secret at the Wrangler prompt. Do not commit credentials or put them in GitHub Pages variables. The Worker sends to admin number `8494868403` (E.164 `+918494868403`) and rejects requests from origins other than `ALLOWED_ORIGIN`. Turnstile verification and Twilio calls both happen server-side.

## 3. Configure the Pages build

In GitHub, open **Settings → Secrets and variables → Actions → Variables** and add:

- `ORDER_SMS_ENDPOINT`: the deployed Worker URL, for example `https://vedha-agro-order-sms.<account>.workers.dev`
- `TURNSTILE_SITE_KEY`: the public Turnstile site key for the Pages domain

The workflow passes these public values at build time. For a local production build, copy `.env.example` to `.env.local` and fill in the same two public values. Keep the Turnstile secret and Twilio credentials only in Cloudflare Worker secrets.

If either public build variable is missing, order checkout remains available; the confirmation clearly reports that admin SMS is not configured. If the Worker or SMS provider fails, the order remains saved and checkout reports the notification failure instead of losing the order.
