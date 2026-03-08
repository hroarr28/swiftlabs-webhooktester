# Blog Article Generator

**Real-world implementation from Uptime Monitor (production pattern).**

Create SEO-optimized blog content with a clean, scalable structure.

## Architecture

### Simple Markdown Files (Recommended)

All articles live in `/content/blog/` as individual markdown files. Dynamic routing handles rendering.

**Structure:**
```
content/
  blog/
    website-downtime-costs-calculator.md
    slack-uptime-alerts-setup-guide.md
    best-free-uptime-monitoring-tools-2026.md

app/
  blog/
    page.tsx              # Blog listing page
    [slug]/
      page.tsx            # Dynamic article page (renders markdown)
```

**Why this approach:**
- ✅ Simple: All articles in one directory
- ✅ Scalable: No nested folders, easy to find files
- ✅ SEO-friendly: Dynamic metadata per article
- ✅ Fast: Next.js static generation
- ✅ Git-friendly: Easy diffs, version control

## Quick Start

### 1. Create an Article

Create `/content/blog/your-article-slug.md`:

```markdown
# Your Article Title

**Published:** March 2026  
**Category:** Guides  
**Reading time:** 8 minutes

---

Your compelling introduction goes here. Hook the reader in the first paragraph.

---

## First Section

Content goes here with proper markdown formatting.

### Subsection

More content...

---

## Second Section

...
```

### 2. Article Metadata (Top of File)

Every article starts with:
- `# Title` - H1 heading (used for SEO title)
- `**Published:**` - Month and year
- `**Category:**` - Group articles by topic
- `**Reading time:**` - Estimated minutes to read
- `---` separator

### 3. Blog Listing Auto-Updates

The blog listing page (`/blog/page.tsx`) automatically scans `/content/blog/` and shows all articles with excerpts.

## Categories

Use these consistently across all articles:

- `Guides` - How-to articles, step-by-step instructions
- `Business Impact` - ROI, costs, decision-making content
- `Technical` - Developer-focused, implementation details
- `Comparisons` - "X vs Y", alternative reviews
- `Case Studies` - Real examples, success stories
- `News` - Product updates, announcements

## Real-World Article Structure (From Uptime Monitor)

### Complete Example

```markdown
# Website Downtime Costs: The Real Impact on Revenue (2026)

**Published:** March 2026  
**Category:** Business Impact  
**Reading time:** 11 minutes

---

Every minute your website is down, you're losing money. But how much, exactly?

For Amazon, **one minute of downtime costs $220,000**. For Facebook, it's $90,000 per minute.

In this guide, we'll break down the true cost of website downtime and show you how to calculate your own potential losses.

---

## The Hidden Cost of Downtime

Website downtime doesn't just mean "the site is offline." The real damage extends far beyond:

### 1. Direct Revenue Loss

The most obvious cost: **lost sales**. Every customer who can't access your site is a potential sale lost.

**E-commerce example:**
- Average order value: £50
- Conversion rate: 2%
- Traffic: 10,000 visitors/day (417 per hour)
- **Revenue per hour:** £417

**One hour of downtime = £417 lost revenue**

---

### 2. Customer Churn and Lifetime Value Loss

This is where downtime gets expensive:

- **68% of consumers won't return** after a negative experience
- **39% of users will stop using a service** after just one outage

**SaaS churn calculation:**
- Average LTV: £500 per customer
- Customers affected: 100
- Churn rate after outage: 5%
- **Total churn cost:** £2,500

---

## How to Calculate Your Downtime Cost

Use this formula:

```
Hourly Revenue Loss = (Annual Revenue ÷ 8,760 hours) × Uptime %
```

**Example:**
- Annual revenue: £100,000
- Target uptime: 99.9%
- Acceptable downtime: 8.76 hours/year
- **Cost per hour of downtime:** £11.42

---

## Why Uptime Monitoring Matters

Uptime monitoring doesn't just detect outages — it **prevents revenue loss**.

**Benefits:**
1. **Instant alerts** - Know within 60 seconds when your site goes down
2. **Root cause data** - Understand what failed and why
3. **Historical trends** - Spot patterns before they become outages
4. **Response time tracking** - Catch performance degradation early

[Try Uptime Monitor Free →](#)

---

## Key Takeaways

- Every minute of downtime has a measurable cost
- Churn and SEO damage are often more expensive than immediate lost sales
- Uptime monitoring is one of the best ROI investments you can make
- 99.9% uptime should be the minimum for any commercial website

**Next Steps:**
1. Calculate your hourly revenue
2. Estimate your downtime risk
3. Set up uptime monitoring
4. Configure instant alerts
```

### Article Structure Breakdown

**1. Title (H1)**
- Clear, specific, includes year/timeframe
- Includes benefit/outcome ("The Real Impact on Revenue")
- SEO keyword in title ("Website Downtime Costs")

**2. Metadata Block**
```markdown
**Published:** March 2026  
**Category:** Business Impact  
**Reading time:** 11 minutes
```
- Published month/year (not specific date - content stays fresh longer)
- Category helps with site navigation
- Reading time sets expectations

**3. Separator**
```markdown
---
```
- Horizontal rule separates metadata from content
- Visual clarity

**4. Hook Paragraph**
- Start with a compelling stat or question
- Make it personal ("your website")
- Preview what the article will cover

**5. Sections with H2 Headings**
```markdown
## Section Title
```
- Clear hierarchy (H2 for main sections, H3 for subsections)
- Descriptive section titles (not "Introduction" - be specific)
- Each section has a clear purpose

**6. Data and Examples**
- Real numbers build credibility
- Calculations show methodology
- Bold key numbers for scanning
- Use examples from different industries

**7. Actionable Takeaways**
```markdown
## Key Takeaways

- Bullet point 1
- Bullet point 2
```
- Summarize the main points
- Make them scannable (bold the key phrase)

**8. Call to Action**
```markdown
[Try Uptime Monitor Free →](#)
```
- Link to your product naturally
- Use action-oriented text
- Place CTAs where they make sense (not just at the end)

## SEO Best Practices (From 15k Words of Uptime Monitor Content)

### 1. Title Optimization

**Good titles:**
- "Website Downtime Costs: The Real Impact on Revenue (2026)"
- "Slack Uptime Alerts: Complete Setup Guide (2026)"
- "Best Free Uptime Monitoring Tools Compared (2026)"

**Why they work:**
- Include primary keyword ("Website Downtime Costs", "Uptime Monitoring Tools")
- Add value proposition ("Real Impact on Revenue", "Complete Setup Guide")
- Include year for freshness signal (update annually)
- 50-60 characters for Google title display

**Avoid:**
- Generic titles: "Downtime Is Bad" ❌
- Clickbait: "You Won't Believe What Downtime Costs!" ❌
- Too long: Over 70 characters gets truncated ❌

### 2. Content Length and Depth

**From Uptime Monitor SEO results:**
- Articles: 5 articles
- Total words: 15,500 words
- Average: 3,100 words per article
- Range: 2,400 - 3,800 words

**Why long-form works:**
- Google favours comprehensive content
- More keywords = more ranking opportunities
- More backlink targets (specific sections)
- Higher time-on-page signals quality

**Structure long articles:**
- Break into clear sections with H2 headings
- Use H3 subsections for scanability
- Add tables, code blocks, calculations
- Include internal links to other articles

### 3. Keyword Targeting

**Primary keyword:** In title, first paragraph, 3-5 times throughout  
**Secondary keywords:** In H2 headings, naturally throughout  
**Long-tail keywords:** Answer specific questions (H3 subsections)

**Example from "Website Downtime Costs":**
- Primary: "website downtime costs"
- Secondary: "cost of downtime", "downtime calculator", "revenue loss"
- Long-tail: "how to calculate downtime cost", "downtime churn rate"

### 4. Internal Linking Strategy

**From Uptime Monitor blog:**
- Each article links to 2-4 other articles
- Link to product pages naturally
- Use descriptive anchor text (not "click here")
- Link within context (not forced)

**Example:**
```markdown
## Related Topics

- Learn how to [set up Slack alerts for downtime](#) in 5 minutes
- See our [comparison of uptime monitoring tools](#) for alternatives
- Read about [calculating your ROI on monitoring](#)
```

### 5. Formatting for Readability

**Use these elements generously:**
- **Bold** for key numbers and takeaways
- `Code blocks` for technical content
- Tables for comparisons
- Bullet lists for scanability
- Horizontal rules (`---`) to separate sections
- Short paragraphs (2-4 sentences max)

**From Uptime Monitor:**
```markdown
**E-commerce example:**
- Average order value: £50
- Conversion rate: 2%
- **Revenue per hour:** £417
```

Bold makes numbers pop when scanning.

### 6. External Links (Trust Signals)

**Link to authoritative sources:**
- Industry reports (Gartner, Forrester)
- Academic research
- Major news outlets (TechCrunch, Wired)
- Official documentation

**Example:**
```markdown
Research from [Gartner](https://example.com) shows that 68% of consumers won't return after a negative experience.
```

### 7. Update Strategy

**Freshness matters:**
- Include year in title
- Update annually
- Add "Last updated: [date]" for evergreen content
- Refresh stats and examples yearly

### 8. Call-to-Action Placement

**Multiple CTAs throughout:**
- Mid-article: After delivering value
- End of article: Natural next step
- Sidebar/sticky: Non-intrusive
- Table of contents: Link to product features

**Effective CTA copy:**
- "Try Uptime Monitor Free →" (action-oriented)
- "Start Monitoring Your Site →" (benefit-focused)
- "See How It Works →" (low commitment)

**Avoid:**
- "Learn More" (vague)
- "Click Here" (no context)
- "Sign Up Now!" (too pushy)

## Dynamic Blog Page Implementation

### Blog Listing Page (`app/blog/page.tsx`)

```tsx
import fs from 'fs';
import path from 'path';
import Link from 'next/link';

interface Article {
  slug: string;
  title: string;
  published: string;
  category: string;
  readingTime: string;
  excerpt: string;
}

function getArticles(): Article[] {
  const blogDir = path.join(process.cwd(), 'content/blog');
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
  
  return files.map(file => {
    const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
    const lines = content.split('\n');
    
    // Extract metadata from markdown
    const title = lines.find(l => l.startsWith('# '))?.replace('# ', '') || '';
    const published = lines.find(l => l.includes('**Published:**'))?.split('**Published:**')[1]?.trim() || '';
    const category = lines.find(l => l.includes('**Category:**'))?.split('**Category:**')[1]?.trim() || '';
    const readingTime = lines.find(l => l.includes('**Reading time:**'))?.split('**Reading time:**')[1]?.trim() || '';
    
    // First paragraph after separator as excerpt
    const contentStart = lines.findIndex(l => l === '---') + 2;
    const excerpt = lines.slice(contentStart, contentStart + 3).join(' ').substring(0, 160);
    
    return {
      slug: file.replace('.md', ''),
      title,
      published,
      category,
      readingTime,
      excerpt,
    };
  }).sort((a, b) => b.published.localeCompare(a.published));
}

export default function BlogPage() {
  const articles = getArticles();
  
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12">Blog</h1>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles.map(article => (
          <Link 
            key={article.slug} 
            href={`/blog/${article.slug}`}
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <div className="text-sm text-gray-600 mb-2">
              {article.category} • {article.readingTime}
            </div>
            <h2 className="text-2xl font-bold mb-3">{article.title}</h2>
            <p className="text-gray-600 mb-4">{article.excerpt}...</p>
            <div className="text-sm text-gray-500">{article.published}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

### Dynamic Article Page (`app/blog/[slug]/page.tsx`)

```tsx
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';

export async function generateStaticParams() {
  const blogDir = path.join(process.cwd(), 'content/blog');
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
  
  return files.map(file => ({
    slug: file.replace('.md', ''),
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'content/blog', `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return {};
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const title = lines.find(l => l.startsWith('# '))?.replace('# ', '') || '';
  const contentStart = lines.findIndex(l => l === '---') + 2;
  const description = lines.slice(contentStart, contentStart + 2).join(' ').substring(0, 160);
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
    },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'content/blog', `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    notFound();
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  
  return (
    <article className="container mx-auto px-4 py-16 max-w-3xl prose prose-lg">
      <MDXRemote source={content} />
    </article>
  );
}
```

## Writing Process (Learned from 15k Words)

### 1. Research Phase (30 minutes)
- Search Google for primary keyword
- Analyze top 10 results
- Identify gaps (questions they don't answer)
- Note their word counts (aim to exceed top 3 average)
- Check "People Also Ask" for subtopics

### 2. Outline Phase (15 minutes)
- Title with keyword and year
- List 5-8 H2 sections
- Add 2-4 H3 subsections under each H2
- Plan where CTAs will go
- Identify tables, code blocks, examples needed

### 3. Writing Phase (2-3 hours for 3000 words)
- Write sections in order (or easiest-first)
- Include real data and calculations
- Add bold to key numbers/takeaways
- Link to sources
- Keep paragraphs short (mobile-friendly)

### 4. Optimization Phase (30 minutes)
- Check keyword density (1-2% for primary keyword)
- Add internal links (2-4 per article)
- Review headings (descriptive, keyword-rich)
- Add meta description (first 160 chars of intro)
- Proofread for typos

### 5. Publishing Phase (15 minutes)
- Create markdown file in `/content/blog/`
- Test locally (`npm run dev`)
- Check mobile formatting
- Verify all links work
- Push to production

**Total time:** 3.5-4.5 hours per 3000-word article

## Measuring Success

### Metrics to Track

**Organic traffic:**
- Google Search Console
- Track impressions, clicks, CTR, position
- Monitor keyword rankings

**Engagement:**
- Time on page (aim for 3+ minutes)
- Bounce rate (aim for <60%)
- Scroll depth (aim for 50%+ reaching bottom)

**Conversions:**
- CTA clicks
- Signups from blog traffic
- Product page visits from blog

**From Uptime Monitor:**
- 5 articles published
- 15,500 words total
- Target: 1,000+ organic visitors/month within 3 months
- Long-tail keywords rank faster than broad terms
- [Article 2](#)
```

## SEO Best Practices

### Title (50-60 characters)
✅ "How to Build a SaaS App in 2026"
❌ "How to Build a Really Awesome SaaS Application Using Modern Technologies"

### Meta Description (150-160 characters)
✅ "Learn how to build a SaaS app from scratch. Step-by-step guide covering tech stack, architecture, and deployment. Code examples included."
❌ "Guide for building SaaS apps."

### Cover Image (1200×630px)
- Use Open Graph standard size
- Include text overlay with title
- High contrast, readable on social platforms
- File size <200KB (compress with sharp or tinypng)

### URL Structure
✅ `/blog/how-to-build-saas-app`
❌ `/blog/2026/03/07/how-to-build-a-really-awesome-saas-application-123`

### Internal Links
Link to 3-5 related articles for better SEO and user engagement.

## Writing Tips

### Hook Readers Fast
Start with the problem, then promise a solution:
> "Launching a SaaS app is expensive and slow. But what if you could build and ship in 30 days? Here's how."

### Use Short Paragraphs
- 2-3 sentences max
- White space improves readability
- Mobile users skim content

### Add Code Examples
```tsx
// Good: Real, working code
export async function GET() {
  const data = await fetchData()
  return Response.json(data)
}

// Bad: Pseudocode or incomplete snippets
// ... fetch data somehow
// return it
```

### Include Visuals
- Screenshots with annotations
- Architecture diagrams
- Before/after comparisons
- Performance graphs

### End with Action
- Download starter template
- Try free demo
- Read related guide
- Join newsletter

## Image Optimization

### Compress Images
```bash
npm install -g sharp-cli
sharp -i cover.jpg -o cover.jpg --quality 85 --progressive
```

### Generate Responsive Versions
```bash
sharp -i cover.jpg -o cover-1200.jpg --width 1200
sharp -i cover.jpg -o cover-800.jpg --width 800
sharp -i cover.jpg -o cover-400.jpg --width 400
```

### Use Next.js Image Component
```tsx
import Image from 'next/image'

<Image
  src="/blog/my-article/screenshot.png"
  alt="Dashboard showing analytics"
  width={1200}
  height={630}
  quality={85}
/>
```

## Publishing Workflow

### 1. Create Article
```bash
npm run new-article "My Article Title" --category=tutorials
```

### 2. Write Content
- Edit `article.md` with your content
- Add cover image to `images/cover.jpg`
- Add screenshots to `images/`

### 3. Update Page
Sync `page.tsx` with `article.md` content:
- Match section headings
- Add inline images
- Update related articles

### 4. Preview Locally
```bash
npm run dev
# Open http://localhost:3000/blog/my-article-title
```

### 5. SEO Checklist
- [ ] Title 50-60 chars
- [ ] Description 150-160 chars
- [ ] Cover image 1200×630px
- [ ] All images have alt text
- [ ] 3-5 internal links
- [ ] Mobile responsive
- [ ] Fast load (<3s)

### 6. Deploy
```bash
npm run build  # Verify build succeeds
git add .
git commit -m "New article: My Article Title"
git push
```

### 7. Post-Launch
- Share on Twitter, LinkedIn
- Submit to Google Search Console
- Add to newsletter
- Monitor analytics

## Article Layout Component

Create a reusable layout for consistent styling:

```tsx
// components/blog/article-layout.tsx
export function ArticleLayout({
  title,
  excerpt,
  date,
  author,
  category,
  children,
}: {
  title: string
  excerpt: string
  date: string
  author: string
  category: string
  children: React.ReactNode
}) {
  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-12">
        <div className="text-sm text-muted-foreground mb-2">
          {category} · {new Date(date).toLocaleDateString()}
        </div>
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-xl text-muted-foreground">{excerpt}</p>
        <div className="flex items-center gap-3 mt-6">
          <div className="text-sm">
            <div className="font-medium">{author}</div>
            <div className="text-muted-foreground">Author</div>
          </div>
        </div>
      </header>

      <div className="prose prose-lg max-w-none">{children}</div>

      <footer className="mt-12 pt-6 border-t">
        <div className="text-sm text-muted-foreground">
          Published on {new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </footer>
    </article>
  )
}
```

## Example: Complete Article

```tsx
// app/blog/getting-started-nextjs/page.tsx
import { ArticleLayout } from '@/components/blog/article-layout'
import Image from 'next/image'

export const metadata = {
  title: 'Getting Started with Next.js 15',
  description: 'Learn Next.js 15 from scratch. Build a full-stack app with App Router, Server Actions, and Streaming. Beginner-friendly guide with code examples.',
}

export default function Article() {
  return (
    <ArticleLayout
      title="Getting Started with Next.js 15"
      excerpt="Learn Next.js 15 from scratch"
      date="2026-03-07"
      author="Your Name"
      category="tutorials"
    >
      <p>
        Next.js 15 brings massive improvements to React development.
        Here's everything you need to get started.
      </p>

      <h2>Why Next.js?</h2>
      <ul>
        <li>Server-side rendering out of the box</li>
        <li>File-based routing</li>
        <li>Built-in optimization</li>
      </ul>

      <h2>Installation</h2>
      <pre><code>npx create-next-app@latest my-app</code></pre>

      <Image
        src="/blog/getting-started-nextjs/screenshot-install.png"
        alt="Terminal showing Next.js installation"
        width={1200}
        height={630}
      />

      <h2>Your First Page</h2>
      <pre><code>{`export default function Home() {
  return <h1>Hello Next.js!</h1>
}`}</code></pre>

      <h2>Key Takeaways</h2>
      <ul>
        <li><strong>Fast Setup:</strong> Get started in 5 minutes</li>
        <li><strong>Zero Config:</strong> Works out of the box</li>
        <li><strong>Production Ready:</strong> Deploy to Vercel instantly</li>
      </ul>

      <h2>Next Steps</h2>
      <p>
        Ready to build? Check out our{' '}
        <a href="/blog/nextjs-app-router">App Router guide</a> and{' '}
        <a href="/blog/nextjs-server-actions">Server Actions tutorial</a>.
      </p>
    </ArticleLayout>
  )
}
```

## Analytics Integration

Track article performance:

```tsx
// components/blog/article-layout.tsx
'use client'

import { useEffect } from 'react'

export function ArticleLayout({ title, children }) {
  useEffect(() => {
    // Track article view
    if (window.plausible) {
      window.plausible('Article View', { props: { article: title } })
    }
  }, [title])

  return <article>{children}</article>
}
```

## Automated Social Images

Generate Open Graph images programmatically:

```bash
npm install @vercel/og
```

```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from '@vercel/og'

export default async function OG({ params }) {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', background: '#000', width: '100%', height: '100%' }}>
        <h1 style={{ color: '#fff', fontSize: 72 }}>{params.slug}</h1>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

## Real-World Examples

All SwiftLabs products use this pattern:
- **Contract Kit** - Legal templates blog
- **Invoice Pilot** - Invoicing best practices
- **DocForge** - API documentation guides
- **README Writer** - Open-source maintainer tips

Each product has 10-15 SEO articles, all generated with this script.

## Resources

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
