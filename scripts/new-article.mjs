#!/usr/bin/env node

/**
 * Blog Article Generator
 * 
 * Scaffold new blog articles with frontmatter, SEO metadata, and structure.
 * 
 * Usage:
 *   npm run new-article "How to Build a SaaS App"
 *   node scripts/new-article.mjs "How to Build a SaaS App"
 *   node scripts/new-article.mjs "How to Build a SaaS App" --category=tutorials
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Parse arguments
const args = process.argv.slice(2)
const title = args.find((arg) => !arg.startsWith('--'))
const categoryArg = args.find((arg) => arg.startsWith('--category='))
const authorArg = args.find((arg) => arg.startsWith('--author='))
const category = categoryArg ? categoryArg.split('=')[1] : 'general'
const author = authorArg ? authorArg.split('=')[1] : 'Your Name'

if (!title) {
  console.error('❌ Error: Article title is required')
  console.log('\nUsage:')
  console.log('  npm run new-article "Article Title"')
  console.log('  node scripts/new-article.mjs "Article Title" --category=tutorials --author="John Doe"')
  console.log('\nCategories: general, tutorials, guides, case-studies, announcements')
  process.exit(1)
}

// Generate slug from title
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

// Generate excerpt from title
function generateExcerpt(title) {
  return `Learn about ${title.toLowerCase()} in this comprehensive guide. Step-by-step tutorial with code examples and best practices.`
}

// Format date as YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0]
}

const slug = slugify(title)
const date = new Date()
const excerpt = generateExcerpt(title)

// Article template
const articleTemplate = `---
title: "${title}"
excerpt: "${excerpt}"
date: "${formatDate(date)}"
author: "${author}"
category: "${category}"
tags:
  - tag1
  - tag2
  - tag3
image: "/blog/${slug}/cover.jpg"
---

# ${title}

${excerpt}

## Introduction

<!-- Brief introduction to the topic -->

## Main Content

### Section 1

<!-- Content for section 1 -->

### Section 2

<!-- Content for section 2 -->

### Section 3

<!-- Content for section 3 -->

## Key Takeaways

- **Point 1**: Description
- **Point 2**: Description
- **Point 3**: Description

## Conclusion

<!-- Wrap up the article with main points and next steps -->

## Related Articles

- [Related Article 1](#)
- [Related Article 2](#)
- [Related Article 3](#)

---

*Published on ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}*
`

// Next.js page template (MDX)
const pageTemplate = `import { ArticleLayout } from '@/components/blog/article-layout'

export const metadata = {
  title: '${title}',
  description: '${excerpt}',
  openGraph: {
    title: '${title}',
    description: '${excerpt}',
    type: 'article',
    publishedTime: '${date.toISOString()}',
    authors: ['${author}'],
    images: [
      {
        url: '/blog/${slug}/cover.jpg',
        width: 1200,
        height: 630,
        alt: '${title}',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '${title}',
    description: '${excerpt}',
    images: ['/blog/${slug}/cover.jpg'],
  },
}

export default function Article() {
  return (
    <ArticleLayout
      title="${title}"
      excerpt="${excerpt}"
      date="${formatDate(date)}"
      author="${author}"
      category="${category}"
    >
      <p>
        ${excerpt}
      </p>

      <h2>Introduction</h2>
      <p>
        {/* Brief introduction to the topic */}
      </p>

      <h2>Main Content</h2>
      
      <h3>Section 1</h3>
      <p>
        {/* Content for section 1 */}
      </p>

      <h3>Section 2</h3>
      <p>
        {/* Content for section 2 */}
      </p>

      <h3>Section 3</h3>
      <p>
        {/* Content for section 3 */}
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li><strong>Point 1:</strong> Description</li>
        <li><strong>Point 2:</strong> Description</li>
        <li><strong>Point 3:</strong> Description</li>
      </ul>

      <h2>Conclusion</h2>
      <p>
        {/* Wrap up the article with main points and next steps */}
      </p>

      <h2>Related Articles</h2>
      <ul>
        <li><a href="#">Related Article 1</a></li>
        <li><a href="#">Related Article 2</a></li>
        <li><a href="#">Related Article 3</a></li>
      </ul>
    </ArticleLayout>
  )
}
`

// Create directories
const blogDir = join(__dirname, '..', 'app', 'blog')
const articleDir = join(blogDir, slug)
const imagesDir = join(articleDir, 'images')

if (!existsSync(blogDir)) {
  mkdirSync(blogDir, { recursive: true })
}

if (existsSync(articleDir)) {
  console.error(`❌ Error: Article "${slug}" already exists at ${articleDir}`)
  process.exit(1)
}

mkdirSync(articleDir, { recursive: true })
mkdirSync(imagesDir, { recursive: true })

// Write files
const articlePath = join(articleDir, 'article.md')
const pagePath = join(articleDir, 'page.tsx')
const readmePath = join(articleDir, 'README.md')

writeFileSync(articlePath, articleTemplate)
writeFileSync(pagePath, pageTemplate)
writeFileSync(
  readmePath,
  `# ${title}

**Category:** ${category}
**Author:** ${author}
**Date:** ${formatDate(date)}

## Next Steps

1. Edit \`article.md\` with your content
2. Update \`page.tsx\` to match the content structure
3. Add cover image: \`images/cover.jpg\` (1200×630px)
4. Add screenshots/diagrams to \`images/\`
5. Update tags and related articles
6. Run \`npm run build\` to verify
7. Preview at \`http://localhost:3000/blog/${slug}\`

## SEO Checklist

- [ ] Title is 50-60 characters
- [ ] Meta description is 150-160 characters
- [ ] Cover image is 1200×630px (OG image size)
- [ ] Alt text on all images
- [ ] Internal links to related content
- [ ] External links open in new tab
- [ ] Code examples have syntax highlighting
- [ ] Mobile responsive
- [ ] Fast load time (<3s)

## Publishing

1. Build and test locally
2. Commit to git
3. Push to main
4. Deploy to production
5. Share on social media
6. Add to sitemap
7. Submit to Google Search Console
`
)

// Create placeholder cover image README
writeFileSync(
  join(imagesDir, 'README.md'),
  `# Images for "${title}"

## Cover Image

- **File:** \`cover.jpg\`
- **Size:** 1200×630px (Open Graph standard)
- **Format:** JPG (compressed, <200KB)
- **Description:** ${title}

## Screenshots

Add screenshots and diagrams here. Use descriptive filenames:
- \`screenshot-feature-name.png\`
- \`diagram-architecture.png\`
- \`graph-performance-comparison.png\`

## Image Optimization

\`\`\`bash
# Compress images
npm install -g sharp-cli
sharp -i cover.jpg -o cover-optimized.jpg --quality 85
\`\`\`
`
)

// Success message
console.log('✅ Article created successfully!')
console.log(`\n📁 Location: ${articleDir}`)
console.log(`\n📝 Files created:`)
console.log(`   - article.md (Markdown content)`)
console.log(`   - page.tsx (Next.js page with SEO metadata)`)
console.log(`   - README.md (Publishing checklist)`)
console.log(`   - images/ (Cover image and screenshots)`)
console.log(`\n🚀 Next steps:`)
console.log(`   1. Edit article.md with your content`)
console.log(`   2. Add cover image: images/cover.jpg (1200×630px)`)
console.log(`   3. Update page.tsx to match content structure`)
console.log(`   4. Preview: http://localhost:3000/blog/${slug}`)
console.log(`\n📊 Article details:`)
console.log(`   Title: ${title}`)
console.log(`   Slug: ${slug}`)
console.log(`   Category: ${category}`)
console.log(`   Author: ${author}`)
console.log(`   Date: ${formatDate(date)}`)
