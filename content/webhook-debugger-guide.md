# Webhook Debugger Guide: How to Debug Webhook Issues (2026)

Webhooks fail silently. Your payment provider sends a callback to your server, your server crashes, and the payment provider marks it as "delivered." You don't find out until a customer complains their subscription didn't activate.

This guide shows you how to debug webhook issues using webhook debuggers, logs, and inspection tools.

## What is a Webhook Debugger?

A webhook debugger captures HTTP requests sent to a unique URL, then displays:

- **Request body** (JSON, form data, XML)
- **Headers** (Content-Type, signatures, custom headers)
- **Metadata** (timestamp, IP address, HTTP method)

You use a debugger to:

1. **Inspect webhook payloads** from providers (Stripe, GitHub, Shopify) without writing code
2. **Test webhook handlers** by replaying captured requests to your local server
3. **Debug webhook failures** by comparing expected vs actual payloads

---

## Common Webhook Issues (and How to Debug Them)

### 1. "Webhook Not Received"

**Symptom:** Your webhook provider says "Webhook delivered," but your server never received it.

**Possible causes:**

- **Firewall blocking requests** — your server only accepts requests from known IPs
- **Wrong URL configured** — provider is sending to `https://yoursite.com/webhook` but your route is `/webhooks/stripe`
- **Server crashed** — your server was down when the webhook was sent
- **DNS issue** — your domain doesn't resolve correctly

**How to debug:**

Use a webhook debugger to confirm the provider is actually sending requests.

**Step 1: Create a temporary webhook endpoint**

Go to [Webhook Tester](https://webhooktester.com), [webhook.site](https://webhook.site), or [RequestBin](https://requestbin.com) and create an endpoint. You'll get a URL like:

```
https://webhooktester.com/ep/abc123
```

**Step 2: Configure your webhook provider**

In Stripe, GitHub, or your provider's dashboard, change the webhook URL temporarily to the debugger URL:

```
Old: https://yoursite.com/webhooks/stripe
New: https://webhooktester.com/ep/abc123
```

**Step 3: Trigger a test webhook**

Create a test event (e.g., a test payment in Stripe).

**Step 4: Check the debugger**

If the webhook appears in the debugger:
- ✅ Provider is sending webhooks correctly
- ❌ Your server has an issue (firewall, DNS, route mismatch, crash)

If the webhook does NOT appear:
- ❌ Provider isn't sending webhooks (check provider settings, event filters)

---

### 2. "Webhook Returns 404"

**Symptom:** Webhook provider logs show "404 Not Found."

**Cause:** Your webhook URL doesn't match your server route.

**Example:**

Webhook URL configured: `https://yoursite.com/webhooks/stripe`  
Server route: `app.post('/webhook', ...)`  

Result: 404 (route mismatch)

**How to debug:**

**Step 1: Capture the webhook with a debugger**

Configure your provider to send to a webhook debugger URL:

```
https://webhooktester.com/ep/abc123
```

**Step 2: Inspect the request path**

Webhook debuggers show the exact path the provider is hitting:

```
POST /webhooks/stripe
Host: webhooktester.com
```

**Step 3: Match your server route**

If the provider is hitting `/webhooks/stripe`, your server must have:

```javascript
app.post('/webhooks/stripe', (req, res) => {
  // Handle webhook
});
```

Not:

```javascript
app.post('/webhook', (req, res) => {  // ❌ Wrong path
  // Handle webhook
});
```

---

### 3. "Signature Validation Failed"

**Symptom:** Your server returns HTTP 400 with "Invalid signature."

**Cause:** Webhook providers sign requests with HMAC-SHA256 or similar. Your server calculates a signature from the request body and compares it to the `X-Signature` header. If they don't match, the request is rejected.

**Common signature mismatch causes:**

1. **Wrong secret key** — you're using the wrong signing secret from your provider
2. **Body parsing issue** — Express.js parsed the body as JSON, but signature validation requires the raw body
3. **Extra whitespace** — provider sent `{"event":"test"}` but your server received `{ "event": "test" }` (extra spaces break signatures)

**How to debug:**

**Step 1: Capture the webhook**

Use a webhook debugger to capture a real request from your provider. You'll see:

```
Headers:
X-Stripe-Signature: t=1678901234,v1=abc123def456...

Body:
{"id":"evt_1A2B3C4D","type":"payment_intent.succeeded",...}
```

**Step 2: Extract the signature and body**

From the debugger, copy:
- The `X-Stripe-Signature` header (or equivalent)
- The raw request body (exactly as sent, no formatting)

**Step 3: Validate locally**

Write a script to validate the signature:

```javascript
const crypto = require('crypto');

const secret = 'whsec_YOUR_SIGNING_SECRET';
const payload = '{"id":"evt_1A2B3C4D","type":"payment_intent.succeeded",...}';  // Exact body from debugger
const signature = 'abc123def456...';  // v1= part from X-Stripe-Signature header

const hmac = crypto.createHmac('sha256', secret);
hmac.update(payload);
const calculated = hmac.digest('hex');

console.log('Received signature:', signature);
console.log('Calculated signature:', calculated);
console.log('Match:', signature === calculated);
```

If they don't match:
- ✅ Your signing secret is wrong → check provider dashboard for the correct secret
- ✅ Your body is different → use `express.raw()` instead of `express.json()`

**Fix for Stripe (Express.js):**

```javascript
// ❌ Wrong: express.json() parses the body, breaking signatures
app.use(express.json());
app.post('/webhooks/stripe', (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_...');  // ❌ Fails
});

// ✅ Right: Use express.raw() for webhook routes
app.post('/webhooks/stripe', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_...');  // ✅ Works
  res.json({received: true});
});
```

---

### 4. "Webhook Delivered, But Nothing Happened"

**Symptom:** Webhook provider says "200 OK," but your database wasn't updated, email wasn't sent, or user account wasn't activated.

**Cause:** Your webhook handler returned HTTP 200 before actually processing the event.

**Bad example:**

```javascript
app.post('/webhooks/stripe', async (req, res) => {
  res.json({received: true});  // ❌ Return 200 immediately
  
  // Process webhook (might fail, but Stripe thinks it succeeded)
  await updateDatabase(req.body);
  await sendEmail(req.body);
});
```

If `updateDatabase()` or `sendEmail()` throws an error, Stripe doesn't know — it already received HTTP 200.

**How to debug:**

**Step 1: Add logging**

Log every step of your webhook handler:

```javascript
app.post('/webhooks/stripe', async (req, res) => {
  console.log('Webhook received:', req.body.type);
  
  try {
    console.log('Updating database...');
    await updateDatabase(req.body);
    console.log('Database updated');
    
    console.log('Sending email...');
    await sendEmail(req.body);
    console.log('Email sent');
    
    res.json({received: true});  // ✅ Return 200 only after processing
  } catch (err) {
    console.error('Webhook processing failed:', err);
    res.status(500).json({error: err.message});  // ❌ Return 500 so provider retries
  }
});
```

**Step 2: Replay the webhook**

Use a webhook debugger to capture and replay the webhook to your local server. Watch your logs to see where it fails.

---

### 5. "Duplicate Webhooks"

**Symptom:** The same webhook is processed twice (or more), causing duplicate charges, duplicate emails, or database conflicts.

**Causes:**

1. **Provider retries** — webhook provider retries if your server takes too long to respond (>5 seconds)
2. **Network retries** — load balancer or proxy retries the request
3. **Provider bug** — some providers (rarely) send duplicate events

**How to debug:**

**Step 1: Check webhook IDs**

Most providers include a unique ID in the webhook payload:

```json
{
  "id": "evt_1A2B3C4D",  // Stripe event ID
  "type": "payment_intent.succeeded",
  "data": { ... }
}
```

**Step 2: Make your handler idempotent**

Before processing, check if you've already processed this event:

```javascript
app.post('/webhooks/stripe', async (req, res) => {
  const eventId = req.body.id;
  
  // Check if already processed
  const existing = await db.webhookEvents.findOne({ eventId });
  if (existing) {
    console.log(`Event ${eventId} already processed, skipping`);
    return res.json({received: true});  // ✅ Return 200 but don't process again
  }
  
  // Process the webhook
  await processPayment(req.body);
  
  // Mark as processed
  await db.webhookEvents.insert({ eventId, processedAt: new Date() });
  
  res.json({received: true});
});
```

**Step 3: Replay a webhook twice**

Use a webhook debugger to replay the same webhook twice. Your handler should:
1. Process it the first time
2. Skip it the second time (log: "already processed")

---

### 6. "Webhook Payload Doesn't Match Documentation"

**Symptom:** Provider docs say `req.body.data.amount` exists, but your server logs show `req.body.amount` (different structure).

**Cause:** Provider changed their webhook format, or you're testing with an old cached example.

**How to debug:**

**Step 1: Capture a real webhook**

Use a webhook debugger to capture a recent webhook from your provider. Don't trust old examples or docs — inspect the actual payload.

**Step 2: Compare to docs**

Compare the captured payload to the provider's documentation. If they differ, the docs are outdated.

**Step 3: Log the full payload**

Add logging to your webhook handler:

```javascript
app.post('/webhooks/stripe', (req, res) => {
  console.log('Full webhook payload:', JSON.stringify(req.body, null, 2));
  
  // Process webhook
  const amount = req.body.data?.object?.amount;
  console.log('Amount:', amount);
});
```

Trigger a test webhook and check your logs.

---

## Webhook Debugger Tools Compared

| Tool | URL Expiration | Request History | Replay | Signature Inspection | Pricing |
|------|----------------|-----------------|--------|----------------------|---------|
| **webhook.site** | 48 hours | 50 requests | ✅ Yes | ✅ Yes | Free / £8/month |
| **RequestBin** | 24 hours | 20 requests | ✅ Yes | ✅ Yes | Free / £10/month |
| **Webhook Tester** | 30 days (free) / permanent (paid) | 100 requests | ✅ Yes | ✅ Yes | Free / £8/month |
| **Hookbin** | 48 hours | 100 requests | ❌ No | ✅ Yes | Free only |
| **Beeceptor** | 24 hours | 50 requests | ✅ Yes | ✅ Yes | Free / £12/month |

---

## Full Debugging Workflow

**Scenario:** Your Stripe webhook handler is failing, and you don't know why.

### Step 1: Capture the webhook

1. Go to [Webhook Tester](https://webhooktester.com)
2. Create an endpoint → get URL like `https://webhooktester.com/ep/abc123`
3. Configure Stripe to send webhooks to that URL
4. Trigger a test payment

### Step 2: Inspect the request

Webhook Tester shows:

```
POST /ep/abc123
Headers:
  Content-Type: application/json
  Stripe-Signature: t=1678901234,v1=abc123...

Body:
{
  "id": "evt_1A2B3C4D",
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

### Step 3: Replay to localhost

1. Start your local server: `node server.js` (runs on `http://localhost:3000`)
2. In Webhook Tester, click "Replay"
3. Configure replay URL: `http://localhost:3000/webhooks/stripe`
4. Click "Send"

### Step 4: Check your logs

Your server logs:

```
Webhook received: payment_intent.succeeded
Updating database...
Database updated
Sending email...
Email sent
```

If it fails, you'll see:

```
Webhook received: payment_intent.succeeded
Updating database...
Error: Database connection failed
```

### Step 5: Fix and replay again

Fix the error (e.g., restart your database), then replay the same webhook from Webhook Tester. No need to trigger a new payment — just replay the captured request.

---

## Advanced Debugging: Webhook Replay with Signatures

**Problem:** You want to replay a webhook to localhost, but your handler validates signatures. Replaying changes the timestamp, breaking the signature.

**Solution:** Temporarily disable signature validation for local testing.

**Example (Stripe):**

```javascript
app.post('/webhooks/stripe', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;
  
  if (process.env.NODE_ENV === 'production') {
    // ✅ Validate signature in production
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_...');
    } catch (err) {
      console.error('Signature validation failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    // ⚠️ Skip validation in development (for replay testing)
    event = JSON.parse(req.body);
  }
  
  // Process event
  console.log('Received event:', event.type);
  res.json({received: true});
});
```

Now you can replay webhooks to localhost without signature errors.

---

## Webhook Monitoring Best Practices

### 1. Log All Webhook Receipts

Even if processing succeeds, log every webhook:

```javascript
await db.webhookLogs.insert({
  eventId: req.body.id,
  eventType: req.body.type,
  receivedAt: new Date(),
  status: 'processed'
});
```

This helps debug "why didn't this webhook trigger?" issues.

### 2. Set Up Alerts for Webhook Failures

If a webhook fails, alert your team:

```javascript
app.post('/webhooks/stripe', async (req, res) => {
  try {
    await processWebhook(req.body);
    res.json({received: true});
  } catch (err) {
    console.error('Webhook failed:', err);
    
    // Alert team (Slack, PagerDuty, email)
    await sendSlackAlert(`🚨 Webhook failed: ${req.body.type} - ${err.message}`);
    
    res.status(500).json({error: err.message});
  }
});
```

### 3. Test Webhook Retries

Most providers retry failed webhooks (e.g., Stripe retries up to 3 times over 3 days). Test this:

1. Configure your webhook handler to return HTTP 500
2. Trigger a test webhook
3. Check your provider's logs to see retry attempts
4. Fix your handler to return 200
5. Wait for the next retry (or manually retry from provider dashboard)

---

## Need a Webhook Debugger?

[Webhook Tester](https://webhooktester.com) gives you permanent webhook URLs that capture every request, then let you replay them to localhost:

1. Sign up (free, no credit card)
2. Create an endpoint → get a permanent URL
3. Configure your webhook provider to send to that URL
4. Inspect requests in real-time (headers, body, signatures)
5. Replay to `http://localhost:3000` with one click

**Pricing:** £8/month for unlimited requests and custom domains. Free tier includes 30-day URLs and 100 requests per endpoint.

[Try Webhook Tester →](https://webhooktester.com)

---

## Summary

**Webhook not received?** → Use a debugger to confirm provider is sending  
**Signature validation fails?** → Capture real webhook, validate signature manually  
**Handler returns 200 but nothing happens?** → Add logging, return 200 only after processing  
**Duplicate webhooks?** → Make handler idempotent (check event ID)  
**Payload doesn't match docs?** → Capture real webhook, don't trust old examples

Debugging webhooks is easier with a webhook debugger. Capture real requests, inspect payloads, and replay to localhost until your handler works.
