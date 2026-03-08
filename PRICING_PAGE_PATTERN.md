# Pricing Page Pattern

**When to use:** Every SaaS product needs a pricing page that converts free users to paid subscribers.

**Problem:** Unclear pricing tiers, hidden costs, and vague feature lists confuse users and kill conversions.

**Solution:** Three-tier pricing (Free, Starter, Pro) with clear usage limits, transparent overage pricing, and specific feature lists.

---

## Pattern

### Structure

```
Free Tier (£0/month)
↓
Starter Tier (£8-15/month) [MOST POPULAR]
↓
Pro Tier (£20-30/month)
```

**Why three tiers:**
- Free tier: Captures developers who want to test before committing
- Starter tier: Sweet spot for small teams and side projects (90% of revenue)
- Pro tier: Anchors pricing, makes Starter look reasonable

**Why "Most Popular" badge on Starter:**
- Social proof nudges users toward the paid tier
- Shows the recommended choice for most users
- Makes decision easier (reduces choice paralysis)

---

## Pricing Tier Guidelines

### Free Tier

**Purpose:** Let users validate the product before paying

**Typical limits:**
- 100-500 units/month (API calls, screenshots, monitors)
- 1-3 resources (projects, sites, documents)
- Basic features only
- Community support

**Example (Screenshot API):**
```
Free - £0/month
✓ 100 screenshots/month
✓ PNG, JPEG, PDF formats
✓ Custom viewport sizes
✓ Full-page screenshots
✓ 30-second timeout
✓ Basic support
```

**Rules:**
- Must be useful enough to validate the product
- Must hit limits quickly enough to encourage upgrade
- Never show "Limited" or "Restricted" (negative framing)
- Always show what's included, not what's missing

---

### Starter Tier (Most Popular)

**Purpose:** Where 90% of revenue comes from

**Typical pricing:** £8-15/month

**Typical limits:**
- 10,000-50,000 units/month
- 5-20 resources
- All core features
- Priority support
- Usage analytics
- Overage billing

**Example (Screenshot API):**
```
Starter - £10/month [MOST POPULAR]
✓ 20,000 screenshots/month
✓ £0.001 per extra screenshot
✓ All Free features
✓ Priority support
✓ Usage analytics
✓ Multiple API keys
```

**Rules:**
- Price should be "coffee budget" (£8-15/month)
- Include usage-based overage pricing (prevents bill shock)
- Show exact overage rate upfront (£0.001 per unit)
- Include at least one "premium" feature (analytics, priority support)

---

### Pro Tier

**Purpose:** Anchor pricing, serve power users

**Typical pricing:** £20-30/month

**Typical limits:**
- 100,000-500,000 units/month
- Unlimited or high resource count
- All features
- Dedicated support
- SLA guarantee
- Volume discounts on overages

**Example (Screenshot API):**
```
Pro - £25/month
✓ 100,000 screenshots/month
✓ £0.0005 per extra screenshot
✓ All Starter features
✓ 60-second timeout (vs 30s)
✓ Dedicated support
✓ 99.9% SLA uptime
```

**Rules:**
- 2-3x price of Starter tier
- 5-10x usage limits
- Include genuine "enterprise" features (SLA, dedicated support)
- Half the overage rate of Starter (reward volume)

---

## Feature List Rules

1. **Start with usage limits (bold):**
   ```
   ✓ 20,000 screenshots/month
   ```

2. **Show overage pricing immediately after:**
   ```
   ✓ £0.001 per extra screenshot
   ```

3. **List features from most to least valuable:**
   ```
   ✓ Priority support (high value)
   ✓ Multiple API keys (nice to have)
   ```

4. **Use checkmarks (✓), not bullets:**
   - Visual consistency
   - Positive framing ("you get this")

5. **Be specific, not vague:**
   - ✅ "60-second timeout"
   - ❌ "Longer timeouts"

6. **Show what's included, not excluded:**
   - ✅ "All Free features"
   - ❌ "Everything in Free plus..."

---

## FAQ Section

**Required questions:**

1. **What happens if I exceed my monthly quota?**
   - Free: API returns 403 error
   - Paid: Charged overage rate, no service interruption

2. **Do unused [units] roll over?**
   - No, quotas reset monthly (prevents complexity)

3. **Can I cancel anytime?**
   - Yes, access until end of billing period

4. **Do you store [user data]?**
   - Product-specific privacy answer

5. **What are the rate limits?**
   - Specific number (60 requests/minute)

6. **Can I get a refund?**
   - 14-day money-back guarantee

**Why these questions:**
- Pre-empt objections before checkout
- Build trust with transparent answers
- Reduce support burden

---

## Pricing Page Checklist

- [ ] Three tiers: Free, Starter (Most Popular), Pro
- [ ] Free tier is useful enough to validate product
- [ ] Starter tier priced £8-15/month (coffee budget)
- [ ] Pro tier 2-3x Starter price, 5-10x usage
- [ ] Usage limits shown first (bold) in feature list
- [ ] Overage pricing transparent and upfront
- [ ] CTA buttons: "Start Free" (Free), "Start 14-Day Trial" (Starter/Pro)
- [ ] FAQ answers common objections (quota, refund, cancellation)
- [ ] No hidden fees or surprises
- [ ] No "Contact Sales" option (kills self-serve conversion)

---

## Overage Pricing Strategy

**When to use:** Products with variable usage (API calls, screenshots, storage)

**How to price overages:**

1. **Calculate cost per unit:**
   ```
   Infrastructure cost: £0.0005/unit
   Margin target: 50%
   Overage price: £0.001/unit
   ```

2. **Tier discounts (reward volume):**
   ```
   Starter: £0.001/unit
   Pro: £0.0005/unit (50% discount)
   ```

3. **Show overage pricing upfront:**
   ```
   ✓ £0.001 per extra screenshot
   ```

**Why overage pricing:**
- Converts users who hit Free tier limits
- Prevents bill shock (predictable cost)
- Encourages upgrade to higher tier (better overage rate)
- Captures value from power users without manual intervention

---

## A/B Testing Opportunities

1. **Starter tier price:**
   - £8/month vs £10/month vs £12/month
   - Test: "Most Popular" badge vs no badge

2. **Free tier limits:**
   - 50 units vs 100 units vs 200 units
   - Test conversion rate vs upgrade rate

3. **CTA button text:**
   - "Start Free Trial" vs "Try Starter" vs "Start 14-Day Trial"
   - "Get Started" vs "Sign Up" vs "Create Account"

4. **Billing period:**
   - Monthly only vs monthly + annual (20% discount)

---

## When to Add Enterprise Tier

**Add Enterprise when:**
- 5+ customers need >500k units/month
- Custom SLAs required (99.99% uptime)
- SOC 2 / ISO compliance needed
- White-label or on-premise requests

**Enterprise structure:**
```
Enterprise - Custom Pricing
✓ Custom usage limits
✓ Dedicated account manager
✓ 99.99% SLA uptime
✓ SOC 2 compliance
✓ Priority feature requests
[Contact Sales]
```

**Warning:** "Contact Sales" kills self-serve conversions. Only add Enterprise tier when you have sales capacity to handle inbound leads.

For SwiftLabs (indie products), avoid "Contact Sales" until you have 100+ paid subscribers and inbound demand for Enterprise features.

---

## Example Full Pricing Page

See: Screenshot API (`/pricing`), Uptime Monitor (`/pricing`), Invoice Pilot (`/pricing`)

**Key elements:**
1. Hero section: "Simple, transparent pricing"
2. Three-tier pricing cards (side by side)
3. FAQ section (6-8 questions)
4. Final CTA: "Still have questions? [Contact Support]"

**Layout:**
```
┌─────────────────────────────────────┐
│  Simple, transparent pricing        │
│  Subheadline with free tier promise│
└─────────────────────────────────────┘

┌─────────┬──────────────┬─────────┐
│  Free   │  Starter ⭐  │   Pro   │
│  £0     │     £10      │   £25   │
│         │              │         │
│ Feature │   Feature    │ Feature │
│ Feature │   Feature    │ Feature │
│ Feature │   Feature    │ Feature │
│         │              │         │
│  [CTA]  │    [CTA]     │  [CTA]  │
└─────────┴──────────────┴─────────┘

┌─────────────────────────────────────┐
│  Frequently Asked Questions         │
│  Q: What happens if I exceed quota? │
│  A: [Answer]                        │
│  ...                                │
└─────────────────────────────────────┘
```

---

## Conversion Optimization

**Typical conversion rates:**
- Landing page → Sign up (Free): 3-8%
- Free → Starter: 5-10% (after 30 days)
- Starter → Pro: 2-5%

**To improve conversion:**
1. Show pricing on landing page (reduces friction)
2. 14-day free trial on paid tiers (remove risk)
3. Annual billing option with 20% discount (increase LTV)
4. Social proof on pricing page ("Used by 500+ developers")

**To improve upgrade rate:**
- Email when user hits 80% of Free tier quota
- Show usage dashboard with "Upgrade to get more" CTA
- In-app upgrade prompt when quota exceeded

---

## Stripe Configuration

**Required Stripe products:**
1. Starter Monthly (£10/month recurring)
2. Pro Monthly (£25/month recurring)
3. (Optional) Starter Annual (£96/year = 20% discount)
4. (Optional) Pro Annual (£240/year = 20% discount)

**Metered billing for overages:**
```javascript
// Stripe Price object
{
  unit_amount_decimal: '0.001', // £0.001 per unit
  recurring: { usage_type: 'metered' }
}
```

**Implementation:**
- Use Stripe Customer Portal for self-serve upgrades/downgrades
- Log usage to Stripe Billing Meter API
- Monthly invoicing with overage line items

---

## Key Takeaways

1. **Three tiers:** Free, Starter (Most Popular), Pro
2. **Transparent pricing:** Show overage rates upfront
3. **Specific limits:** "100 screenshots/month", not "generous quota"
4. **No surprises:** FAQ answers all objections
5. **Self-serve:** No "Contact Sales" until you have sales capacity
6. **Free tier:** Useful enough to validate, limited enough to upgrade
7. **Starter tier:** Coffee budget pricing (£8-15/month), 90% of revenue
8. **Pro tier:** Anchor pricing, power users, enterprise features

For SwiftLabs products, this pattern has generated £0 MRR so far (Stripe in test mode), but is validated by competitor pricing research (UptimeRobot, ApiFlash, ScreenshotOne all use similar structures).
