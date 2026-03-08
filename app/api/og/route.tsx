/**
 * Open Graph Image Generation API Route
 * 
 * Generates dynamic OG images based on query parameters.
 * 
 * @example
 * GET /api/og?title=Hello&description=World&template=gradient
 */

import { NextRequest } from 'next/server';
import { generateOGImage } from '@/lib/og-image/generator';

export const runtime = 'edge'; // Required for @vercel/og

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  // Extract parameters
  const title = searchParams.get('title') || 'Welcome';
  const description = searchParams.get('description') || undefined;
  const siteName = searchParams.get('siteName') || 'YourSite';
  const logo = searchParams.get('logo') || undefined;
  const background = searchParams.get('background') || '#0f172a';
  const textColor = searchParams.get('textColor') || '#ffffff';
  const template = (searchParams.get('template') || 'default') as
    | 'default'
    | 'minimal'
    | 'gradient'
    | 'blog'
    | 'product';
  
  // Blog metadata
  const author = searchParams.get('author') || undefined;
  const date = searchParams.get('date') || undefined;
  const category = searchParams.get('category') || undefined;
  
  // Product metadata
  const price = searchParams.get('price') || undefined;
  
  return generateOGImage({
    title,
    description,
    siteName,
    logo,
    background,
    textColor,
    template,
    metadata: {
      author: author || '',
      date: date || '',
      category: category || '',
      price: price || '',
    },
  });
}
