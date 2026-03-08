/**
 * OG Image Generation
 * 
 * Generate dynamic Open Graph images for social sharing.
 * Uses @vercel/og (edge runtime) for fast image generation.
 * 
 * @see OG_IMAGE_PATTERN.md for usage examples
 */

import { ImageResponse } from 'next/og';

export interface OGImageOptions {
  /**
   * Image title (main text)
   */
  title: string;
  
  /**
   * Subtitle or description
   */
  description?: string;
  
  /**
   * Brand name or site name
   */
  siteName?: string;
  
  /**
   * Logo URL or base64
   */
  logo?: string;
  
  /**
   * Background color (hex or gradient)
   */
  background?: string;
  
  /**
   * Text color
   */
  textColor?: string;
  
  /**
   * Custom template
   */
  template?: 'default' | 'minimal' | 'gradient' | 'blog' | 'product';
  
  /**
   * Image width (default 1200)
   */
  width?: number;
  
  /**
   * Image height (default 630)
   */
  height?: number;
  
  /**
   * Additional metadata (author, date, category, etc.)
   */
  metadata?: Record<string, string>;
}

/**
 * Generate OG image (returns ImageResponse for API route)
 * 
 * @example
 * ```tsx
 * // app/api/og/route.tsx
 * import { generateOGImage } from '@/lib/og-image/generator';
 * 
 * export async function GET(req: Request) {
 *   const { searchParams } = new URL(req.url);
 *   const title = searchParams.get('title') || 'Default Title';
 *   
 *   return generateOGImage({ title });
 * }
 * ```
 */
export async function generateOGImage(
  options: OGImageOptions
): Promise<ImageResponse> {
  const {
    title,
    description,
    siteName = 'YourSite',
    logo,
    background = '#0f172a',
    textColor = '#ffffff',
    template = 'default',
    width = 1200,
    height = 630,
    metadata = {},
  } = options;
  
  // Select template
  let content: React.ReactElement;
  
  switch (template) {
    case 'minimal':
      content = (
        <MinimalTemplate
          title={title}
          siteName={siteName}
          background={background}
          textColor={textColor}
        />
      );
      break;
      
    case 'gradient':
      content = (
        <GradientTemplate
          title={title}
          description={description}
          siteName={siteName}
          logo={logo}
        />
      );
      break;
      
    case 'blog':
      content = (
        <BlogTemplate
          title={title}
          description={description}
          siteName={siteName}
          author={metadata.author}
          date={metadata.date}
          category={metadata.category}
        />
      );
      break;
      
    case 'product':
      content = (
        <ProductTemplate
          title={title}
          description={description}
          price={metadata.price}
          logo={logo}
          background={background}
        />
      );
      break;
      
    default:
      content = (
        <DefaultTemplate
          title={title}
          description={description}
          siteName={siteName}
          logo={logo}
          background={background}
          textColor={textColor}
        />
      );
  }
  
  return new ImageResponse(content, {
    width,
    height,
  });
}

/**
 * Default template
 */
function DefaultTemplate({
  title,
  description,
  siteName,
  logo,
  background,
  textColor,
}: {
  title: string;
  description?: string;
  siteName: string;
  logo?: string;
  background: string;
  textColor: string;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: background,
        padding: '80px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {logo && (
        <img
          src={logo}
          alt="Logo"
          width={120}
          height={120}
          style={{ marginBottom: '40px' }}
        />
      )}
      
      <h1
        style={{
          fontSize: '72px',
          fontWeight: 'bold',
          color: textColor,
          textAlign: 'center',
          margin: 0,
          lineHeight: 1.2,
          maxWidth: '900px',
        }}
      >
        {title}
      </h1>
      
      {description && (
        <p
          style={{
            fontSize: '32px',
            color: textColor,
            opacity: 0.8,
            textAlign: 'center',
            margin: '20px 0 0 0',
            maxWidth: '800px',
          }}
        >
          {description}
        </p>
      )}
      
      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          fontSize: '24px',
          color: textColor,
          opacity: 0.6,
        }}
      >
        {siteName}
      </div>
    </div>
  );
}

/**
 * Minimal template
 */
function MinimalTemplate({
  title,
  siteName,
  background,
  textColor,
}: {
  title: string;
  siteName: string;
  background: string;
  textColor: string;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: background,
        padding: '80px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ fontSize: '28px', color: textColor, opacity: 0.8 }}>
        {siteName}
      </div>
      
      <h1
        style={{
          fontSize: '90px',
          fontWeight: 'bold',
          color: textColor,
          margin: 0,
          lineHeight: 1.1,
        }}
      >
        {title}
      </h1>
    </div>
  );
}

/**
 * Gradient template
 */
function GradientTemplate({
  title,
  description,
  siteName,
  logo,
}: {
  title: string;
  description?: string;
  siteName: string;
  logo?: string;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {logo && (
        <img
          src={logo}
          alt="Logo"
          width={100}
          height={100}
          style={{ marginBottom: '30px' }}
        />
      )}
      
      <h1
        style={{
          fontSize: '70px',
          fontWeight: 'bold',
          color: '#ffffff',
          textAlign: 'center',
          margin: 0,
          lineHeight: 1.2,
          maxWidth: '900px',
        }}
      >
        {title}
      </h1>
      
      {description && (
        <p
          style={{
            fontSize: '30px',
            color: '#ffffff',
            opacity: 0.9,
            textAlign: 'center',
            margin: '20px 0 0 0',
            maxWidth: '800px',
          }}
        >
          {description}
        </p>
      )}
      
      <div
        style={{
          position: 'absolute',
          bottom: '50px',
          fontSize: '24px',
          color: '#ffffff',
          opacity: 0.7,
        }}
      >
        {siteName}
      </div>
    </div>
  );
}

/**
 * Blog post template
 */
function BlogTemplate({
  title,
  description,
  siteName,
  author,
  date,
  category,
}: {
  title: string;
  description?: string;
  siteName: string;
  author?: string;
  date?: string;
  category?: string;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: '80px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {category && (
        <div
          style={{
            fontSize: '20px',
            color: '#3b82f6',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            letterSpacing: '2px',
            marginBottom: '20px',
          }}
        >
          {category}
        </div>
      )}
      
      <h1
        style={{
          fontSize: '64px',
          fontWeight: 'bold',
          color: '#0f172a',
          margin: 0,
          lineHeight: 1.1,
          marginBottom: '30px',
          maxWidth: '900px',
        }}
      >
        {title}
      </h1>
      
      {description && (
        <p
          style={{
            fontSize: '28px',
            color: '#64748b',
            margin: 0,
            lineHeight: 1.4,
            maxWidth: '800px',
          }}
        >
          {description}
        </p>
      )}
      
      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          left: '80px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {author && (
          <div style={{ fontSize: '22px', color: '#0f172a' }}>
            By {author}
          </div>
        )}
        {date && (
          <div style={{ fontSize: '20px', color: '#94a3b8' }}>
            {date}
          </div>
        )}
      </div>
      
      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          right: '80px',
          fontSize: '24px',
          color: '#64748b',
        }}
      >
        {siteName}
      </div>
    </div>
  );
}

/**
 * Product template
 */
function ProductTemplate({
  title,
  description,
  price,
  logo,
  background,
}: {
  title: string;
  description?: string;
  price?: string;
  logo?: string;
  background?: string;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: background || '#0f172a',
        padding: '80px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {logo && (
        <img
          src={logo}
          alt="Product"
          width={200}
          height={200}
          style={{ marginBottom: '40px', borderRadius: '20px' }}
        />
      )}
      
      <h1
        style={{
          fontSize: '64px',
          fontWeight: 'bold',
          color: '#ffffff',
          textAlign: 'center',
          margin: 0,
          lineHeight: 1.2,
          maxWidth: '800px',
        }}
      >
        {title}
      </h1>
      
      {description && (
        <p
          style={{
            fontSize: '28px',
            color: '#ffffff',
            opacity: 0.8,
            textAlign: 'center',
            margin: '20px 0',
            maxWidth: '700px',
          }}
        >
          {description}
        </p>
      )}
      
      {price && (
        <div
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#10b981',
            marginTop: '30px',
          }}
        >
          {price}
        </div>
      )}
    </div>
  );
}

/**
 * Get OG image URL for a page
 * 
 * @example
 * ```ts
 * const ogImageUrl = getOGImageUrl({
 *   title: 'My Blog Post',
 *   description: 'This is an amazing post',
 *   template: 'blog',
 * });
 * ```
 */
export function getOGImageUrl(
  baseUrl: string,
  options: Omit<OGImageOptions, 'width' | 'height'>
): string {
  const params = new URLSearchParams();
  
  params.set('title', options.title);
  
  if (options.description) params.set('description', options.description);
  if (options.siteName) params.set('siteName', options.siteName);
  if (options.logo) params.set('logo', options.logo);
  if (options.background) params.set('background', options.background);
  if (options.textColor) params.set('textColor', options.textColor);
  if (options.template) params.set('template', options.template);
  
  if (options.metadata) {
    Object.entries(options.metadata).forEach(([key, value]) => {
      params.set(key, value);
    });
  }
  
  return `${baseUrl}/api/og?${params.toString()}`;
}
