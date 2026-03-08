# Landing Page Copy Pattern

**When to use:** Every SaaS product needs a landing page that converts visitors to signups.

**Problem:** Generic, feature-list copy doesn't convert. Developers skip fluffy marketing speak.

**Solution:** Write copy that speaks to specific outcomes, not features. Use developer language, not marketing buzzwords.

---

## Pattern

### Hero Section

**Structure:**
```
[Main headline - outcome focused]
[Subheadline - what they get, how fast]
[Primary CTA] [Secondary CTA]
[Social proof or free tier messaging]
```

**Good:**
```
The Fastest Screenshot API
For Developers Who Ship Fast

One API call, instant screenshots. PNG, JPEG, or PDF. 
100 free screenshots/month • No credit card • 60s integration
```

**Bad:**
```
Website Screenshot API
Simple. Fast. Reliable.

Capture perfect screenshots with ease.
Try it free!
```

**Why:** "Fastest" is specific. "For developers who ship fast" signals the target audience immediately. "60s integration" is a measurable promise. "Simple. Fast. Reliable." is generic and forgettable.

---

### Features Section

**Structure:**
```
[Feature name - specific metric or benefit]
[Description - technical detail + outcome]
```

**Good:**
```
Under 3s Response Time
Average screenshot delivered in 2.4 seconds. Puppeteer-powered, Vercel Edge-deployed.

Zero Data Retention
Screenshots generated and served in memory. Never written to disk. GDPR-compliant by design.
```

**Bad:**
```
Lightning Fast
Average response time under 3 seconds. Optimized infrastructure.

Secure & Private
Your screenshots are never stored. Deleted immediately after delivery.
```

**Why:** "Under 3s" is a measurable claim. "2.4 seconds" adds credibility. "Puppeteer-powered, Vercel Edge" gives technical confidence. "Lightning fast" is meaningless marketing speak.

---

### Use Cases Section

**Structure:**
```
[Use case name - outcome focused]
[Description - specific workflow + benefit]
```

**Good:**
```
Visual Regression Testing
Compare screenshots pre/post-deploy. Catch CSS bugs in CI/CD pipelines.

Auto-Generated Docs
Embed live screenshots in docs. Always up-to-date, zero manual maintenance.
```

**Bad:**
```
Testing & QA
Automated visual regression testing across different viewports.

Documentation
Generate screenshots for user guides, tutorials, and help docs.
```

**Why:** "Catch CSS bugs in CI/CD" is a specific problem solved. "Zero manual maintenance" is a clear time-saving benefit. Generic descriptions don't trigger the "I need this" response.

---

### Final CTA Section

**Structure:**
```
[Action-oriented headline with time promise]
[Free tier details + key benefits]
[CTA button with specific action]
```

**Good:**
```
Ship your first screenshot in 60 seconds
100 screenshots/month free forever • No credit card • Cancel anytime
[Get Your API Key]
```

**Bad:**
```
Ready to start capturing screenshots?
Get 100 screenshots free every month. No credit card required.
[Start Free Trial]
```

**Why:** "Ship your first screenshot in 60 seconds" is an outcome, not a question. "Get Your API Key" tells you exactly what happens next. "Start Free Trial" is vague.

---

## Copy Rules

1. **Specific > Generic**
   - ✅ "Under 3s response time"
   - ❌ "Lightning fast"

2. **Outcomes > Features**
   - ✅ "Catch CSS bugs in CI/CD pipelines"
   - ❌ "Visual regression testing"

3. **Technical > Marketing**
   - ✅ "Puppeteer-powered, Vercel Edge-deployed"
   - ❌ "Optimized infrastructure"

4. **Time Promises > Vague CTAs**
   - ✅ "Ship your first screenshot in 60 seconds"
   - ❌ "Get started today"

5. **Metrics > Superlatives**
   - ✅ "100 screenshots/month free forever"
   - ❌ "Generous free tier"

6. **Developer Language**
   - Use: API, CLI, CI/CD, deployment, pipeline, codebase
   - Avoid: Solutions, platform, ecosystem, seamless, innovative

---

## Implementation Checklist

- [ ] Hero headline states the specific outcome (not what the product is)
- [ ] Subheadline includes a measurable benefit or time promise
- [ ] Primary CTA button states the next action ("Get Your API Key", not "Start Free Trial")
- [ ] Features include specific metrics (seconds, bytes, percentage)
- [ ] Features include technical implementation details (Puppeteer, Vercel, PostgreSQL)
- [ ] Use cases describe specific workflows, not generic categories
- [ ] Final CTA includes a time promise ("Ship in 60 seconds", "Deploy in 5 minutes")
- [ ] Free tier messaging is specific ("100/month free", not "generous free tier")
- [ ] No marketing buzzwords (seamless, innovative, cutting-edge, revolutionary)
- [ ] No questions in headlines ("Ready to start?" → "Ship your first X in 60 seconds")

---

## A/B Testing Tips

Test these variants to find what converts best for your audience:

1. **Hero headline:**
   - Outcome-focused: "Ship your first X in 60 seconds"
   - Speed-focused: "The Fastest X API"
   - Audience-focused: "X for Developers Who Ship Fast"

2. **CTA button text:**
   - Action: "Get Your API Key"
   - Outcome: "Start Shipping"
   - Time: "Try It Now (60s setup)"

3. **Social proof:**
   - Metrics: "100k+ screenshots served"
   - Users: "Used by 500+ developers"
   - Trust: "Trusted by teams at Stripe, Vercel, Linear"

---

## Example Before/After

**Before:**
```
Website Screenshot API
Simple. Fast. Reliable.

Capture perfect screenshots of any webpage with a single HTTP request.
Start Free Trial
```

**After:**
```
The Fastest Screenshot API
For Developers Who Ship Fast

One API call, instant screenshots. PNG, JPEG, or PDF.
100 screenshots/month free • No credit card • 60s integration
Get Your API Key
```

**Conversion lift:** 40-60% improvement expected (based on similar changes to Uptime Monitor, Invoice Pilot).

---

## When to Break These Rules

- **Consumer products:** Can be more playful, less technical
- **Design tools:** Visual examples > technical specs
- **Non-developer audience:** Use less jargon, more outcomes

For SwiftLabs (B2B developer tools), always default to technical, specific, outcome-focused copy.
