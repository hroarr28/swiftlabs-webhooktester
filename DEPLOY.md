# Deployment Guide - Webhook Tester

## Pre-Deployment Checklist

- [x] Build passes (`npm run build`)
- [x] TypeScript compiles
- [x] All critical features implemented
- [ ] Supabase migration run
- [ ] Environment variables configured
- [ ] Stripe webhook configured
- [ ] End-to-end testing complete

---

## Step 1: Run Supabase Migration

**Option A: Supabase Dashboard (Easiest)**

1. Go to https://supabase.com/dashboard
2. Open project: https://ylehaohyelejaytpzrbf.supabase.co
3. Navigate to SQL Editor
4. Copy contents of `supabase/migrations/001_webhook_schema.sql`
5. Paste and run
6. Verify tables created in Table Editor

**Option B: Supabase CLI**

```bash
cd ~/projects/swiftlabs/projects/webhooktester

# Link to project (if not already linked)
supabase link --project-ref ylehaohyelejaytpzrbf

# Push migration
supabase db push

# Or run SQL directly
supabase db execute --file supabase/migrations/001_webhook_schema.sql
```

---

## Step 2: Create GitHub Repo

```bash
cd ~/projects/swiftlabs/projects/webhooktester

# Create repo on GitHub (via gh CLI or web)
gh repo create hroarr28/swiftlabs-webhooktester --public

# Add remote
git remote add origin git@github.com:hroarr28/swiftlabs-webhooktester.git

# Push code
git push -u origin main
```

---

## Step 3: Deploy to Vercel

**Option A: Vercel CLI**

```bash
cd ~/projects/swiftlabs/projects/webhooktester

# Login (if not already)
vercel login

# Deploy
vercel --prod
```

**Option B: Vercel Web UI**

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import `hroarr28/swiftlabs-webhooktester`
4. Configure environment variables (see below)
5. Deploy

---

## Step 4: Configure Environment Variables (Vercel)

In Vercel project settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://ylehaohyelejaytpzrbf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[from Supabase project settings]
SUPABASE_SERVICE_ROLE_KEY=[from Supabase project settings]

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[from Stripe dashboard]
STRIPE_SECRET_KEY=[from Stripe dashboard]
STRIPE_PRICE_ID=price_1T8aEaCjlSeC9GYcKMGIqZvO
STRIPE_WEBHOOK_SECRET=[get after creating webhook in Step 5]

NEXT_PUBLIC_SITE_URL=https://webhooktester.dev
```

**To get Supabase keys:**
1. Go to https://supabase.com/dashboard/project/ylehaohyelejaytpzrbf/settings/api
2. Copy "anon public" key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Copy "service_role" key → `SUPABASE_SERVICE_ROLE_KEY`

**To get Stripe keys (TEST MODE first):**
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy "Publishable key" → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Copy "Secret key" → `STRIPE_SECRET_KEY`

---

## Step 5: Configure Stripe Webhook

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. URL: `https://webhooktester.dev/api/webhook`
4. Events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. Copy "Signing secret" → `STRIPE_WEBHOOK_SECRET` in Vercel env vars
7. Redeploy after adding webhook secret

---

## Step 6: Test End-to-End

1. Visit https://webhooktester.dev
2. Sign up for account
3. Verify email
4. Create endpoint
5. Send test webhook: `curl -X POST https://webhooktester.dev/w/[slug] -d '{"test":"data"}'`
6. Check request appears in dashboard
7. Test Stripe checkout (test card: 4242 4242 4242 4242)
8. Verify Pro badge appears
9. Test customer portal

---

## Step 7: Go Live (After Testing)

**Switch Stripe to Live Mode:**

1. Go to https://dashboard.stripe.com/apikeys (live mode)
2. Update Vercel env vars with live keys
3. Go to https://dashboard.stripe.com/webhooks (live mode)
4. Create live webhook endpoint (same URL)
5. Update `STRIPE_WEBHOOK_SECRET` with live webhook secret
6. Redeploy Vercel

**Ask Tom first before switching to live mode!**

---

## Step 8: Configure Domain (Optional)

If using custom domain `webhooktester.dev`:

1. Vercel: Add domain in project settings
2. Update DNS records as instructed by Vercel
3. Wait for DNS propagation
4. Update `NEXT_PUBLIC_SITE_URL` if needed

---

## Step 9: Post-Deployment

- [ ] Update product queue status to `shipped`
- [ ] Add to SwiftLabs dashboard
- [ ] Message Tom with launch URL
- [ ] Monitor for errors in Vercel logs
- [ ] Monitor Stripe webhook deliveries
- [ ] Set up cron job for data cleanup

---

## Troubleshooting

**Build fails on Vercel:**
- Check environment variables are set
- Verify Stripe API version matches installed package
- Check Vercel build logs for specifics

**Auth not working:**
- Verify Supabase URL and anon key are correct
- Check Supabase email auth is enabled
- Verify redirect URLs in Supabase auth settings

**Stripe checkout fails:**
- Verify Stripe keys are in test mode
- Check webhook secret matches Stripe dashboard
- Verify price ID is correct
- Check Vercel function logs

**Webhooks not arriving:**
- Verify endpoint slug is correct in URL
- Check request was sent to correct domain
- Look at Vercel function logs for errors
- Verify database connection working

---

## Monitoring

**Vercel Logs:** https://vercel.com/[project]/logs  
**Stripe Webhooks:** https://dashboard.stripe.com/webhooks  
**Supabase Logs:** https://supabase.com/dashboard/project/ylehaohyelejaytpzrbf/logs/explorer

---

**Status:** Ready to deploy  
**Blockers:** None (Vercel CLI auth resolved by web UI option)  
**Estimated deployment time:** 30-45 minutes
