# Webhook Tester Deployment Guide

## ✅ Completed Steps

1. **GitHub repo created:** https://github.com/hroarr28/swiftlabs-webhooktester
2. **Code pushed to main branch** — All commits synced

---

## 🚀 Next Steps (Manual)

### 1. Deploy to Vercel

**Option A: Vercel Dashboard (Recommended)**
1. Visit https://vercel.com/new
2. Import from GitHub: `hroarr28/swiftlabs-webhooktester`
3. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
4. Add environment variables (see below)
5. Deploy

**Option B: Vercel CLI**
```bash
cd ~/projects/swiftlabs/projects/webhooktester
vercel login  # Authenticate once
vercel --prod
```

---

### 2. Environment Variables (Production)

Add these in Vercel dashboard → Project Settings → Environment Variables:

**Copy values from `.env.local` in this repo** (SwiftLabs shared credentials)

```env
# Supabase (SwiftLabs shared project - ref: ijejglwvvufgbgpwouus)
NEXT_PUBLIC_SUPABASE_URL=<from .env.local>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from .env.local>
SUPABASE_SERVICE_ROLE_KEY=<from .env.local>

# Stripe (SwiftLabs shared, TEST MODE)
STRIPE_SECRET_KEY=<from .env.local>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<from .env.local>
STRIPE_PRICE_ID=<from .env.local>
STRIPE_WEBHOOK_SECRET=<from .env.local>

# Site
NEXT_PUBLIC_SITE_URL=[YOUR VERCEL URL - e.g. https://webhooktester-xxxx.vercel.app]
```

**Note:** Update `NEXT_PUBLIC_SITE_URL` with the actual Vercel deployment URL after first deploy.

---

### 3. Configure Stripe Webhook

1. Visit https://dashboard.stripe.com/test/webhooks
2. Click **Add endpoint**
3. Set **Endpoint URL:** `https://[your-vercel-url]/api/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add to Vercel environment variables:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```
8. Redeploy to apply the new env var

---

### 4. Test Production Deployment

**End-to-end flow:**
1. Visit production URL
2. Sign up for free account
3. Create webhook endpoint
4. Send test webhook via curl:
   ```bash
   curl -X POST https://[your-endpoint-url] \
     -H "Content-Type: application/json" \
     -d '{"test": "data"}'
   ```
5. Verify webhook appears in dashboard
6. Upgrade to Pro (use test card: `4242 4242 4242 4242`)
7. Add forwarding rule
8. Test forwarding works

**Expected results:**
- ✅ Webhooks received and displayed
- ✅ Stripe checkout redirects correctly
- ✅ Subscription status updates
- ✅ Pro features unlock after payment
- ✅ Forwarding rules work

---

### 5. Switch to Live Mode (After Testing)

**⚠️ IMPORTANT: Do this ONLY after Tom approves**

1. Get live Stripe keys from dashboard (toggle **View test data** → **Live mode**)
2. Update environment variables in Vercel:
   - `STRIPE_SECRET_KEY` → live key (starts with `sk_live_`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → live key (starts with `pk_live_`)
   - `STRIPE_PRICE_ID` → create live price in Stripe dashboard
   - `STRIPE_WEBHOOK_SECRET` → create new webhook endpoint for live mode
3. Redeploy

---

## 📊 Post-Deployment

After successful deployment:

1. **Update product queue:**
   ```bash
   # Mark as shipped in product-queue.json
   ```

2. **Log to dashboard:**
   ```bash
   node ~/projects/swiftlabs/scripts/log-activity.mjs deploy builder webhooktester "Deployed to production at [URL]"
   ```

3. **Add to SwiftLabs dashboard** (in `~/projects/swiftlabs/dashboard/`)

4. **Message Tom:**
   ```
   🚀 Webhook Tester deployed to production!
   
   URL: [production URL]
   Status: Test mode (Stripe test keys)
   
   Next steps:
   - Test end-to-end flow
   - Switch to live Stripe keys when ready
   - Start SEO content creation
   ```

---

## 🐛 Troubleshooting

**Build fails on Vercel:**
- Check build logs for TypeScript errors
- Verify all environment variables are set
- Check Node.js version (should be 18+)

**Stripe webhook not working:**
- Verify webhook URL is correct
- Check webhook signing secret matches env var
- Test webhook manually in Stripe dashboard

**Database errors:**
- Verify Supabase keys are correct
- Check RLS policies are deployed
- Ensure user is authenticated

**Forwarding not working:**
- Check user has Pro subscription
- Verify target URL is reachable
- Check forwarding rule is enabled
