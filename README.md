# SwiftLabs SaaS Starter

Template for building new SwiftLabs products. Clone this, replace the placeholders, ship.

## Quick Start

1. Copy this template: `cp -r templates/saas-starter products/your-product`
2. `cd products/your-product && npm install`
3. Copy `.env.example` to `.env.local` and fill in your keys
4. Create a Supabase project and run `supabase/migration.sql`
5. Replace all `ProductName` / `TEMPLATE` markers with your product details
6. `npm run dev`

## What's Included

- **Landing page** — Hero, features, pricing, FAQ
- **Auth** — Sign up, log in, forgot/reset password (Supabase)
- **Dashboard shell** — Protected route with user info
- **Stripe** — Checkout, customer portal, webhook handler
- **Middleware** — Route protection (dashboard requires auth)
- **SEO** — Sitemap, robots.txt, meta tags
- **Dark theme** — Zinc colour scale, Inter font

## Production-Tested Patterns

This template includes 9 battle-tested patterns from live SwiftLabs products. All patterns have been validated in production and are ready to use.

### Infrastructure Patterns

| Pattern | Status | Use When | Production Examples |
|---------|--------|----------|---------------------|
| **RATE_LIMIT_PATTERN.md** | ✅ Production-tested | Protecting API endpoints from abuse | Screenshot API (quota enforcement) |
| **ERROR_BOUNDARY_PATTERN.md** | ✅ Production-ready | Graceful error handling in React components | All SwiftLabs products |
| **FEATURE_FLAGS_PATTERN.md** | ✅ Production-tested | Plan-based access control, gradual rollouts | Screenshot API, Uptime Monitor (10 flags each) |
| **FORM_VALIDATION_PATTERN.md** | ✅ Production-tested | Client + server validation with Zod | Screenshot API (15+ schemas) |
| **RESOURCE_CRUD_PATTERN.md** | ⚠️ Template only | Dashboard CRUD operations | Template exists, needs customization per product |

### Content/SEO Patterns

| Pattern | Status | Use When | Production Examples |
|---------|--------|----------|---------------------|
| **BLOG_GENERATOR_PATTERN.md** | ✅ Production-tested | Markdown-based SEO content | Uptime Monitor (5 articles, 15.5k words) |
| **JSX_ARTICLE_PATTERN.md** | ✅ Production-tested | JSX article components with full design control | Schema Spy, Screenshot API, API Mocker (8 articles total) |
| **OG_IMAGE_PATTERN.md** | ✅ Infrastructure ready | Dynamic social preview images | Template included (5 variants), not yet adopted |
| **EXPORT_FORMAT_PATTERN.md** | ✅ Production-ready | CSV/JSON data export features | Ready for use, no production examples yet |
| **PDF_EXPORT_PATTERN.md** | ✅ Production-tested | Generating branded PDF documents | BriefBuilder (custom content briefs) |

### Pattern Usage Notes

**✅ Production-tested** — Used in live products, proven to work, use as-is  
**✅ Production-ready** — Fully implemented, tested, ready to use  
**⚠️ Template only** — Generic template included, needs product-specific customization

**RESOURCE_CRUD_PATTERN.md customization:**
- Rename `lib/actions/resources.ts` to match your domain (e.g., `monitors.ts`, `screenshots.ts`, `briefs.ts`)
- Update types and table references
- Add product-specific fields and validation

**Markdown vs JSX articles:**
- Use **BLOG_GENERATOR_PATTERN.md** (markdown) when: you have non-technical writers, portability matters, or content is simple text with code examples
- Use **JSX_ARTICLE_PATTERN.md** (JSX) when: you need full design control, interactive components, complex layouts, or embedded demos
- **Production pattern:** Most SwiftLabs products now use JSX articles for tighter integration with product design

**Additional Pattern Resources:**
- All patterns include detailed documentation with code examples
- Screenshot API has the most comprehensive implementation (rate limiting, feature flags, form validation)
- BriefBuilder demonstrates advanced PDF export with custom styling
- Uptime Monitor shows complete blog pattern implementation

## Customisation Checklist

- [ ] Update `layout.tsx` metadata (title, description)
- [ ] Update `page.tsx` (hero, features, pricing, FAQ)
- [ ] Update brand colour in `globals.css` (`--color-brand`)
- [ ] Replace "ProductName" in nav/footer
- [ ] Add product-specific tables to `supabase/migration.sql`
- [ ] Create Stripe price ID and wire up checkout
- [ ] Set env vars in Vercel
- [ ] Add Terms and Privacy pages
