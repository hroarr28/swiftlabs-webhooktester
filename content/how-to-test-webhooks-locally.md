# How to Test Webhooks Locally: Complete Developer Guide (2026)

Webhooks are great in production. In development, they're a nightmare. Your local server isn't publicly accessible, webhook providers can't reach `localhost:3000`, and you end up deploying half-finished code to a staging server just to test a single callback.

This guide shows you how to test webhooks locally without deploying, using tunnels, mock servers, and webhook inspectors.

## The Problem with Testing Webhooks Locally

Webhook providers (Stripe, GitHub, Twilio, Shopify) send HTTP POST requests to a URL you configure. That URL must be publicly accessible over HTTPS. Your local development server isn't:

```
❌ http://localhost:3000/webhooks/stripe (not reachable from the internet)
✅ https://yourdomain.com/webhooks/stripe (reachable, but requires deployment)
```

**Options for local webhook testing:**

1. **Reverse tunnels** (ngrok, Cloudflare Tunnel) — expose localhost to the internet
2. **Webhook forwarding** (Stripe CLI, Svix Play) — provider-specific tools that forward webhooks
3. **Mock webhook requests** (Postman, curl) — send fake webhook payloads manually
4. **Webhook replay** (Webhook Tester, RequestBin) — capture real webhooks, replay locally

Let's explore each approach.

---

## Method 1: Reverse Tunnels (ngrok, Cloudflare Tunnel)

**Best for:** Testing against real webhook providers (Stripe, GitHub, Twilio)

### Using ngrok

ngrok creates a secure tunnel from a public URL to your local server.

**Step 1: Install ngrok**

```bash
# macOS
brew install ngrok

# Linux
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok

# Windows
choco install ngrok
```

**Step 2: Start your local server**

```bash
# Example: Express.js server
node server.js
# Server running on http://localhost:3000
```

**Step 3: Expose localhost with ngrok**

```bash
ngrok http 3000
```

ngrok output:

```
Forwarding  https://a1b2c3d4.ngrok.io -> http://localhost:3000
```

**Step 4: Configure your webhook provider**

In Stripe dashboard (or GitHub, Shopify, etc.), configure the webhook URL:

```
https://a1b2c3d4.ngrok.io/webhooks/stripe
```

**Step 5: Test**

Trigger an event in your webhook provider (e.g., create a test payment in Stripe). The webhook hits your local server.

**Pros:**
- Works with all webhook providers
- HTTPS included (no certificate setup)
- See requests in ngrok's web UI (`http://localhost:4040`)

**Cons:**
- Free URLs change every time you restart ngrok (e.g., `https://a1b2c3d4.ngrok.io` → `https://z9y8x7w6.ngrok.io`)
- Paid plan (£8/month) required for permanent custom domains

---

### Using Cloudflare Tunnel

Cloudflare Tunnel (formerly Argo Tunnel) is a free alternative to ngrok.

**Step 1: Install Cloudflare Tunnel**

```bash
# macOS
brew install cloudflare/cloudflare/cloudflared

# Linux
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Windows
choco install cloudflared
```

**Step 2: Start a tunnel**

```bash
cloudflared tunnel --url http://localhost:3000
```

Output:

```
Your quick tunnel is available at:
https://abc-def-123.trycloudflare.com
```

**Step 3: Configure webhook provider**

Use the Cloudflare URL as your webhook endpoint:

```
https://abc-def-123.trycloudflare.com/webhooks/github
```

**Pros:**
- 100% free (no paid tier required)
- HTTPS included
- No account signup required

**Cons:**
- Random URLs (like free ngrok)
- No web UI for inspecting requests (use your server logs)

---

## Method 2: Provider-Specific Webhook Forwarders

Some webhook providers offer CLI tools that forward webhooks to localhost.

### Stripe CLI

Stripe CLI forwards Stripe webhooks to your local server.

**Step 1: Install Stripe CLI**

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Linux
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_linux_amd64.tar.gz
tar -xvf stripe_linux_amd64.tar.gz
sudo mv stripe /usr/local/bin/

# Windows
choco install stripe-cli
```

**Step 2: Login**

```bash
stripe login
```

**Step 3: Forward webhooks**

```bash
stripe listen --forward-to localhost:3000/webhooks/stripe
```

Output:

```
Ready! Your webhook signing secret is whsec_abc123...
> charge.succeeded [evt_1A2B3C4D]
```

**Step 4: Trigger test events**

```bash
# In another terminal, trigger a test webhook:
stripe trigger payment_intent.succeeded
```

The webhook is sent to `http://localhost:3000/webhooks/stripe`.

**Pros:**
- No tunnel required
- Works with all Stripe webhook events
- Free (no ngrok subscription needed)

**Cons:**
- Stripe-specific (doesn't work for GitHub, Twilio, etc.)
- Requires Stripe CLI installation

---

### Svix Play

Svix Play forwards webhooks from any provider to localhost.

**Step 1: Install Svix CLI**

```bash
npm install -g svix-cli
```

**Step 2: Start forwarding**

```bash
svix play localhost:3000/webhooks
```

Output:

```
Forwarding webhooks to http://localhost:3000/webhooks
Public URL: https://play.svix.com/abc123
```

**Step 3: Configure webhook provider**

Use the Svix Play URL:

```
https://play.svix.com/abc123
```

**Pros:**
- Works with any webhook provider (not just Stripe)
- Free
- HTTPS included

**Cons:**
- Requires npm installation
- Random URLs (no permanent custom domains)

---

## Method 3: Mock Webhook Requests

**Best for:** Testing webhook handlers without relying on external services

Instead of exposing localhost or using tunnels, send fake webhook payloads manually.

### Using curl

**Step 1: Find a real webhook payload**

Inspect a real webhook from your provider (use webhook.site or RequestBin to capture one):

```json
{
  "id": "evt_1A2B3C4D",
  "object": "event",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_1A2B3C4D",
      "amount": 2000,
      "currency": "gbp",
      "status": "succeeded"
    }
  }
}
```

**Step 2: Send it to localhost**

```bash
curl -X POST http://localhost:3000/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{
    "id": "evt_test123",
    "type": "payment_intent.succeeded",
    "data": {
      "object": {
        "id": "pi_test456",
        "amount": 2000,
        "currency": "gbp",
        "status": "succeeded"
      }
    }
  }'
```

**Pros:**
- No external dependencies
- Fast (no tunnel latency)
- Full control over payload content

**Cons:**
- Manual work (copy-paste payloads)
- No webhook signature validation (unless you mock that too)

---

### Using Postman

Postman is better for repeated testing.

**Step 1: Create a POST request**

URL: `http://localhost:3000/webhooks/stripe`  
Method: `POST`  
Headers: `Content-Type: application/json`  
Body:

```json
{
  "id": "evt_test123",
  "type": "charge.succeeded",
  "data": {
    "object": {
      "id": "ch_test456",
      "amount": 5000,
      "currency": "usd",
      "status": "succeeded"
    }
  }
}
```

**Step 2: Save as a collection**

Save multiple webhook payloads (payment succeeded, payment failed, refund issued) as a Postman collection. Run them with one click.

**Pros:**
- Reusable (save collections for different webhook events)
- GUI-based (easier than curl)
- Can test signature validation (add custom headers)

**Cons:**
- Still manual (not automated)
- No real webhook data (you mock everything)

---

## Method 4: Webhook Replay (Webhook Tester, RequestBin)

**Best for:** Capturing real webhook payloads, then replaying them to localhost

### Using Webhook Tester

**Step 1: Create a webhook endpoint**

Sign up at [Webhook Tester](https://webhooktester.com), create an endpoint, and get a URL like:

```
https://webhooktester.com/ep/abc123
```

**Step 2: Configure webhook provider**

In Stripe, GitHub, or your webhook provider, set the webhook URL to:

```
https://webhooktester.com/ep/abc123
```

**Step 3: Trigger an event**

Create a test payment, push to GitHub, or trigger your webhook event.

**Step 4: Inspect the request**

Webhook Tester shows:
- Full request body (JSON)
- Headers (including signatures)
- Timestamp, IP address, HTTP method

**Step 5: Replay to localhost**

Click "Replay" and configure:

```
Replay to: http://localhost:3000/webhooks/stripe
```

Webhook Tester re-sends the exact same request to your local server.

**Pros:**
- Captures real webhook data (not mocked)
- Preserves signatures and headers
- One-click replay to localhost (no copy-paste)

**Cons:**
- Requires two-step flow (capture → replay)
- Free tier limits replays to 100 requests per endpoint

---

## Comparing All Methods

| Method | Setup Time | Real Webhooks | Free Tier | Best For |
|--------|------------|---------------|-----------|----------|
| **ngrok** | 2 minutes | ✅ Yes | ✅ Yes (random URLs) | Testing against real providers |
| **Cloudflare Tunnel** | 2 minutes | ✅ Yes | ✅ Yes | Free alternative to ngrok |
| **Stripe CLI** | 3 minutes | ✅ Yes (Stripe only) | ✅ Yes | Stripe-specific testing |
| **Svix Play** | 2 minutes | ✅ Yes | ✅ Yes | Multi-provider testing |
| **curl + Postman** | 1 minute | ❌ Mocked | ✅ Yes | Fast iteration without external deps |
| **Webhook Tester** | 2 minutes | ✅ Yes | ✅ Yes | Capturing + replaying real webhooks |

---

## Full Example: Testing Stripe Webhooks Locally

**Scenario:** You're building a SaaS app with Stripe subscriptions. When a customer cancels, Stripe sends a `customer.subscription.deleted` webhook. You need to test this locally.

### Step 1: Set up your webhook handler

```javascript
// server.js
const express = require('express');
const app = express();

app.post('/webhooks/stripe', express.raw({type: 'application/json'}), (req, res) => {
  const event = JSON.parse(req.body);
  
  console.log('Received webhook:', event.type);
  
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    console.log(`Subscription ${subscription.id} was cancelled`);
    
    // Update your database
    // await db.subscriptions.update(subscription.id, { status: 'cancelled' });
  }
  
  res.json({received: true});
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
```

### Step 2: Expose localhost with ngrok

```bash
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://a1b2c3d4.ngrok.io`).

### Step 3: Configure Stripe

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://a1b2c3d4.ngrok.io/webhooks/stripe`
4. Events to send: `customer.subscription.deleted`

### Step 4: Trigger a test webhook

In Stripe Dashboard, click "Send test webhook" and select `customer.subscription.deleted`.

### Step 5: Check your logs

Your server logs:

```
Received webhook: customer.subscription.deleted
Subscription sub_1A2B3C4D was cancelled
```

---

## Troubleshooting Common Issues

### 1. Webhook Provider Returns 404

**Symptom:** Stripe/GitHub says "Webhook failed: 404 Not Found"

**Cause:** Your ngrok URL is correct, but your server route is wrong.

**Fix:**

```javascript
// ❌ Wrong: route doesn't match webhook URL
app.post('/webhook', ...);  // Webhook URL: /webhooks/stripe → 404

// ✅ Right: route matches webhook URL
app.post('/webhooks/stripe', ...);  // Webhook URL: /webhooks/stripe → 200
```

### 2. Signature Validation Fails

**Symptom:** Your server returns 400 because the signature is invalid.

**Cause:** ngrok/tunnel adds extra headers or modifies the request body.

**Fix:**

For Stripe, use `express.raw()` to preserve the raw body:

```javascript
app.post('/webhooks/stripe', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_...');
  // ...
});
```

For GitHub, validate with:

```javascript
const crypto = require('crypto');

const sig = req.headers['x-hub-signature-256'];
const hmac = crypto.createHmac('sha256', 'your_github_secret');
hmac.update(req.body);
const calculated = `sha256=${hmac.digest('hex')}`;

if (sig !== calculated) {
  return res.status(400).send('Invalid signature');
}
```

### 3. ngrok URL Changes Every Restart

**Symptom:** Every time you restart ngrok, the URL changes (e.g., `a1b2c3d4.ngrok.io` → `z9y8x7w6.ngrok.io`), and you have to reconfigure your webhook provider.

**Fix:**

**Option 1:** Use ngrok's paid plan (£8/month) for a permanent custom domain:

```bash
ngrok http 3000 --domain=myapp.ngrok.io
```

**Option 2:** Use Cloudflare Tunnel (free, but still random URLs)

**Option 3:** Use a webhook forwarder like Webhook Tester (capture webhooks with a permanent URL, replay to localhost)

---

## Need a Permanent Webhook URL for Local Testing?

Most tunnels give you random URLs that change every restart. [Webhook Tester](https://webhooktester.com) gives you permanent URLs that work across all your projects:

1. Sign up (free, no credit card)
2. Create an endpoint → get a permanent URL (e.g., `https://webhooktester.com/ep/abc123`)
3. Configure your webhook provider to send to that URL
4. Capture real webhook payloads
5. Replay them to `http://localhost:3000` with one click

**Pricing:** £8/month for unlimited requests and custom domains. Free tier includes 30-day URLs and 100 requests per endpoint.

[Try Webhook Tester →](https://webhooktester.com)

---

## Summary

**Quick local testing:** ngrok or Cloudflare Tunnel  
**Stripe-specific:** Stripe CLI (`stripe listen`)  
**Multi-provider:** Svix Play  
**Mock testing:** curl or Postman  
**Capture + replay:** Webhook Tester

Pick the method that fits your workflow. If you need a permanent webhook URL that captures real payloads and replays them to localhost, try Webhook Tester.
