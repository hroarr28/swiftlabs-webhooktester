# OG Image Pattern

Generate beautiful, dynamic Open Graph images for social sharing (Twitter, Facebook, LinkedIn, etc.).

## Quick Start

### 1. Install Dependencies

```bash
npm install next@latest  # @vercel/og is built into Next.js 13+
```

### 2. Create OG Image API Route

Already included: `app/api/og/route.tsx`

### 3. Use in Page Metadata

```typescript
// app/blog/[slug]/page.tsx
import { getOGImageUrl } from '@/lib/og-image/generator';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  
  const ogImage = getOGImageUrl(process.env.NEXT_PUBLIC_BASE_URL!, {
    title: post.title,
    description: post.excerpt,
    template: 'blog',
    metadata: {
      author: post.author,
      date: post.date,
      category: post.category,
    },
  });
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}
```

## Templates

### 1. Default Template

Clean, centered layout with optional logo.

```typescript
const ogImage = getOGImageUrl('https://yoursite.com', {
  title: 'Your Amazing Product',
  description: 'The best solution for your needs',
  template: 'default',
  siteName: 'YourSite',
  background: '#0f172a',
  textColor: '#ffffff',
});
```

**Preview:**
- Logo at top (optional)
- Large centered title
- Description below
- Site name at bottom

### 2. Minimal Template

Bold, modern design with just title and site name.

```typescript
const ogImage = getOGImageUrl('https://yoursite.com', {
  title: 'Big Bold Statement',
  template: 'minimal',
  siteName: 'YourSite',
  background: '#1e293b',
  textColor: '#f1f5f9',
});
```

**Preview:**
- Site name top-left
- Huge title bottom-left
- Lots of whitespace

### 3. Gradient Template

Eye-catching gradient background.

```typescript
const ogImage = getOGImageUrl('https://yoursite.com', {
  title: 'Launch Your SaaS',
  description: 'Ship faster with our starter kit',
  template: 'gradient',
  siteName: 'SaasKit',
});
```

**Preview:**
- Purple gradient background (667eea → 764ba2)
- Centered white text
- Clean and modern

### 4. Blog Template

Perfect for blog posts and articles.

```typescript
const ogImage = getOGImageUrl('https://yoursite.com', {
  title: 'How to Build a SaaS in 2024',
  description: 'A comprehensive guide to launching your SaaS product',
  template: 'blog',
  siteName: 'YourBlog',
  metadata: {
    author: 'Jane Doe',
    date: 'March 7, 2026',
    category: 'Tutorial',
  },
});
```

**Preview:**
- White background
- Category badge top-left
- Large title
- Subtitle
- Author and date bottom-left
- Site name bottom-right

### 5. Product Template

Showcase products with pricing.

```typescript
const ogImage = getOGImageUrl('https://yoursite.com', {
  title: 'Premium Plan',
  description: 'Everything you need to scale',
  template: 'product',
  metadata: {
    price: '£49/month',
  },
  background: '#1e40af',
});
```

**Preview:**
- Product image/logo at top
- Title and description
- Price in green
- Dark background

## Real-World Examples

### Homepage OG Image

```typescript
// app/page.tsx
export const metadata = {
  openGraph: {
    images: [
      getOGImageUrl(process.env.NEXT_PUBLIC_BASE_URL!, {
        title: 'YourSite - Best SaaS Starter Kit',
        description: 'Ship your SaaS in days, not months',
        template: 'gradient',
        siteName: 'YourSite',
      }),
    ],
  },
};
```

### Blog Post OG Image

```typescript
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await db.posts.findUnique({ where: { slug: params.slug } });
  
  return {
    openGraph: {
      images: [
        getOGImageUrl(process.env.NEXT_PUBLIC_BASE_URL!, {
          title: post.title,
          description: post.excerpt,
          template: 'blog',
          metadata: {
            author: post.author.name,
            date: new Date(post.publishedAt).toLocaleDateString('en-GB'),
            category: post.category,
          },
        }),
      ],
    },
  };
}
```

### Product Page OG Image

```typescript
// app/products/[id]/page.tsx
export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  
  return {
    openGraph: {
      images: [
        getOGImageUrl(process.env.NEXT_PUBLIC_BASE_URL!, {
          title: product.name,
          description: product.description,
          template: 'product',
          metadata: {
            price: `£${product.price}`,
          },
          logo: product.imageUrl,
        }),
      ],
    },
  };
}
```

### Pricing Page OG Image

```typescript
// app/pricing/page.tsx
export const metadata = {
  openGraph: {
    images: [
      getOGImageUrl(process.env.NEXT_PUBLIC_BASE_URL!, {
        title: 'Simple, Transparent Pricing',
        description: 'Choose the plan that fits your needs',
        template: 'minimal',
        background: '#0ea5e9',
      }),
    ],
  },
};
```

### Documentation Page OG Image

```typescript
// app/docs/[...slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string[] } }) {
  const doc = await getDoc(params.slug.join('/'));
  
  return {
    openGraph: {
      images: [
        getOGImageUrl(process.env.NEXT_PUBLIC_BASE_URL!, {
          title: doc.title,
          description: 'Learn how to use our platform',
          template: 'default',
          siteName: 'YourSite Docs',
          background: '#18181b',
        }),
      ],
    },
  };
}
```

## Custom Backgrounds

### Solid Colors

```typescript
{
  background: '#3b82f6', // Hex color
}
```

### Gradients (CSS-style)

```typescript
{
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}
```

Popular gradients:
- **Purple Dream:** `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Sunrise:** `linear-gradient(to right, #fa709a 0%, #fee140 100%)`
- **Ocean:** `linear-gradient(to right, #2e3192 0%, #1bffff 100%)`
- **Sunset:** `linear-gradient(120deg, #f093fb 0%, #f5576c 100%)`

## Custom Logos

### Remote URL

```typescript
{
  logo: 'https://yoursite.com/logo.png',
}
```

### Base64 Embedded

```typescript
{
  logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...',
}
```

### From Supabase Storage

```typescript
const { data } = supabase.storage.from('assets').getPublicUrl('logo.png');

const ogImage = getOGImageUrl(baseUrl, {
  title: 'Welcome',
  logo: data.publicUrl,
});
```

## Testing OG Images

### 1. Browser Preview

Visit the OG image URL directly:

```
http://localhost:3000/api/og?title=Hello&template=gradient
```

### 2. Social Media Debuggers

**Twitter Card Validator:**
https://cards-dev.twitter.com/validator

**Facebook Sharing Debugger:**
https://developers.facebook.com/tools/debug/

**LinkedIn Post Inspector:**
https://www.linkedin.com/post-inspector/

### 3. Meta Tag Checker

Use browser dev tools to inspect `<meta>` tags:

```html
<meta property="og:image" content="https://yoursite.com/api/og?title=..." />
<meta name="twitter:image" content="https://yoursite.com/api/og?title=..." />
```

## Advanced Patterns

### Dynamic Template Selection

```typescript
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug);
  
  // Choose template based on page type
  const template = page.type === 'blog' ? 'blog' :
                   page.type === 'product' ? 'product' :
                   'default';
  
  return {
    openGraph: {
      images: [
        getOGImageUrl(process.env.NEXT_PUBLIC_BASE_URL!, {
          title: page.title,
          description: page.description,
          template,
        }),
      ],
    },
  };
}
```

### User-Generated Content OG Images

```typescript
// app/profiles/[username]/page.tsx
export async function generateMetadata({ params }: { params: { username: string } }) {
  const user = await getUser(params.username);
  
  return {
    openGraph: {
      images: [
        getOGImageUrl(process.env.NEXT_PUBLIC_BASE_URL!, {
          title: user.name,
          description: user.bio,
          template: 'minimal',
          logo: user.avatarUrl,
          background: user.brandColor || '#0f172a',
        }),
      ],
    },
  };
}
```

### Custom Fonts (Advanced)

```typescript
// app/api/og/custom/route.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(req: Request) {
  // Load custom font
  const fontData = await fetch(
    new URL('../../../assets/fonts/Inter-Bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());
  
  return new ImageResponse(
    (
      <div style={{ fontFamily: 'Inter' }}>
        <h1>Custom Font Title</h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
```

## Performance

### Caching

Vercel automatically caches OG images at the edge.

To cache on other platforms, add cache headers:

```typescript
// app/api/og/route.tsx
export async function GET(req: Request) {
  const response = await generateOGImage({ title: 'Hello' });
  
  // Cache for 1 week
  response.headers.set(
    'Cache-Control',
    'public, max-age=604800, immutable'
  );
  
  return response;
}
```

### Static Generation

For pages with static OG images, use `generateStaticParams`:

```typescript
export async function generateStaticParams() {
  const posts = await db.posts.findMany();
  
  return posts.map(post => ({
    slug: post.slug,
  }));
}
```

## Troubleshooting

### Issue: OG Image Not Updating

**Cause:** Social media platforms cache images aggressively  
**Solution:** 
1. Add a cache-busting parameter: `?v=2`
2. Use Facebook/Twitter debugger to force refresh
3. Change the image URL slightly

### Issue: Image Looks Blurry

**Cause:** Wrong dimensions  
**Solution:** Use recommended sizes:
- **Facebook/LinkedIn:** 1200x630 (default)
- **Twitter Large Card:** 1200x600
- **Twitter Summary Card:** 120x120 (not covered here)

### Issue: Fonts Not Loading

**Cause:** Edge runtime restrictions  
**Solution:** 
- Use system fonts: `'system-ui, sans-serif'`
- Or load custom fonts as shown in "Custom Fonts" section

### Issue: Template Not Working

**Cause:** Invalid template name  
**Solution:** Use exact names: `'default' | 'minimal' | 'gradient' | 'blog' | 'product'`

## Migration Checklist

- [ ] Install dependencies (built into Next.js 13+)
- [ ] Copy `lib/og-image/generator.tsx`
- [ ] Copy `app/api/og/route.tsx`
- [ ] Add `NEXT_PUBLIC_BASE_URL` to `.env`
- [ ] Update `app/layout.tsx` with default OG image
- [ ] Add OG images to key pages (homepage, blog, pricing)
- [ ] Test with social media debuggers
- [ ] Verify caching is working

## Summary

- ✅ Use `generateOGImage()` to create dynamic social images
- ✅ Choose from 5 templates: default, minimal, gradient, blog, product
- ✅ Add to page metadata via `generateMetadata()`
- ✅ Test with Twitter/Facebook debuggers
- ✅ Images are automatically cached at the edge
- ✅ Customize colors, logos, backgrounds per page
- ✅ Supports custom fonts (advanced)

**Common Use Cases:**
- Homepage: Gradient template with logo
- Blog posts: Blog template with author/date
- Products: Product template with price
- Landing pages: Minimal template with bold statement
- Documentation: Default template with consistent branding

**Next Steps:**
1. Add OG image to homepage (`app/page.tsx`)
2. Add OG images to blog posts (`app/blog/[slug]/page.tsx`)
3. Test images with social media debuggers
4. Customize templates to match your brand
5. Consider custom fonts if brand guidelines require it
