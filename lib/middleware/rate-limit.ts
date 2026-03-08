/**
 * Rate Limiting Middleware for API Routes
 * 
 * Simple in-memory rate limiting for API routes. For production at scale,
 * consider Redis-backed solutions (Upstash, Vercel KV).
 * 
 * @see RATE_LIMIT_PATTERN.md for usage examples
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   */
  limit: number;
  
  /**
   * Time window in milliseconds
   */
  window: number;
  
  /**
   * Custom error message
   */
  message?: string;
  
  /**
   * Custom identifier function (default: uses IP address)
   */
  identifier?: (req: NextRequest) => string;
}

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// In-memory store (resets on server restart)
// For production with multiple instances, use Redis
const store = new Map<string, RateLimitStore>();

/**
 * Get client identifier from request
 */
function getIdentifier(req: NextRequest, customIdentifier?: (req: NextRequest) => string): string {
  if (customIdentifier) {
    return customIdentifier(req);
  }
  
  // Try to get IP from various headers (common proxy setups)
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const cfConnectingIp = req.headers.get('cf-connecting-ip'); // Cloudflare
  
  return forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown';
}

/**
 * Clean up expired entries from store (prevent memory leak)
 */
function cleanupStore() {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (value.resetTime < now) {
      store.delete(key);
    }
  }
}

/**
 * Rate limit middleware factory
 * 
 * @example
 * ```ts
 * // 10 requests per minute
 * const limiter = rateLimit({ limit: 10, window: 60000 });
 * 
 * export async function GET(req: NextRequest) {
 *   const rateLimitResult = limiter(req);
 *   if (rateLimitResult) return rateLimitResult;
 *   
 *   // Your API logic here
 *   return NextResponse.json({ data: 'success' });
 * }
 * ```
 */
export function rateLimit(config: RateLimitConfig) {
  const { limit, window, message, identifier } = config;
  
  return function (req: NextRequest): NextResponse | null {
    const id = getIdentifier(req, identifier);
    const now = Date.now();
    
    // Clean up old entries periodically (every 100 requests)
    if (Math.random() < 0.01) {
      cleanupStore();
    }
    
    const current = store.get(id);
    
    if (!current || current.resetTime < now) {
      // First request or window expired
      store.set(id, {
        count: 1,
        resetTime: now + window,
      });
      return null;
    }
    
    if (current.count >= limit) {
      // Rate limit exceeded
      const resetInSeconds = Math.ceil((current.resetTime - now) / 1000);
      
      return NextResponse.json(
        {
          error: message || 'Too many requests',
          retryAfter: resetInSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': resetInSeconds.toString(),
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': current.resetTime.toString(),
          },
        }
      );
    }
    
    // Increment counter
    current.count++;
    
    return null;
  };
}

/**
 * Predefined rate limiters for common use cases
 */
export const rateLimiters = {
  /**
   * Strict: 10 requests per minute (auth endpoints, sensitive operations)
   */
  strict: rateLimit({
    limit: 10,
    window: 60000,
    message: 'Too many requests. Please try again in a minute.',
  }),
  
  /**
   * Standard: 60 requests per minute (general API endpoints)
   */
  standard: rateLimit({
    limit: 60,
    window: 60000,
    message: 'Rate limit exceeded. Please try again shortly.',
  }),
  
  /**
   * Generous: 300 requests per minute (public endpoints, webhooks)
   */
  generous: rateLimit({
    limit: 300,
    window: 60000,
  }),
  
  /**
   * Per-user: 100 requests per hour per authenticated user
   * 
   * @example
   * ```ts
   * const limiter = rateLimiters.perUser;
   * 
   * export async function POST(req: NextRequest) {
   *   const session = await getServerSession();
   *   if (!session?.user?.id) {
   *     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   *   }
   *   
   *   const rateLimitResult = limiter(req);
   *   if (rateLimitResult) return rateLimitResult;
   *   
   *   // Your API logic here
   * }
   * ```
   */
  perUser: rateLimit({
    limit: 100,
    window: 3600000, // 1 hour
    identifier: (req) => {
      // This requires you to add user ID to request context
      // via middleware or session extraction
      const userId = req.headers.get('x-user-id');
      return userId || getIdentifier(req);
    },
  }),
};

/**
 * Utility to check rate limit status without incrementing
 */
export function checkRateLimitStatus(req: NextRequest, config: RateLimitConfig) {
  const id = getIdentifier(req, config.identifier);
  const current = store.get(id);
  const now = Date.now();
  
  if (!current || current.resetTime < now) {
    return {
      limited: false,
      remaining: config.limit,
      resetTime: now + config.window,
    };
  }
  
  return {
    limited: current.count >= config.limit,
    remaining: Math.max(0, config.limit - current.count),
    resetTime: current.resetTime,
  };
}

/**
 * Middleware wrapper for Next.js middleware.ts
 * 
 * @example middleware.ts
 * ```ts
 * import { rateLimitMiddleware } from '@/lib/middleware/rate-limit';
 * 
 * export function middleware(req: NextRequest) {
 *   // Apply rate limiting to all /api routes
 *   if (req.nextUrl.pathname.startsWith('/api')) {
 *     const result = rateLimitMiddleware(req, { limit: 60, window: 60000 });
 *     if (result) return result;
 *   }
 *   
 *   return NextResponse.next();
 * }
 * ```
 */
export function rateLimitMiddleware(req: NextRequest, config: RateLimitConfig): NextResponse | null {
  const limiter = rateLimit(config);
  return limiter(req);
}
