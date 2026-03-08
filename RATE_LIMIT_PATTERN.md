# Rate Limiting Pattern

Protect your API routes from abuse with flexible, easy-to-use rate limiting.

## Quick Start

### Basic API Route Protection

```typescript
// app/api/hello/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/middleware/rate-limit';

const limiter = rateLimiters.standard; // 60 requests/minute

export async function GET(req: NextRequest) {
  const rateLimitResult = limiter(req);
  if (rateLimitResult) return rateLimitResult;
  
  return NextResponse.json({ message: 'Hello World' });
}
```

### Custom Rate Limit

```typescript
import { rateLimit } from '@/lib/middleware/rate-limit';

// 5 requests per 10 seconds
const strictLimiter = rateLimit({
  limit: 5,
  window: 10000,
  message: 'Slow down! Too many requests.',
});

export async function POST(req: NextRequest) {
  const rateLimitResult = strictLimiter(req);
  if (rateLimitResult) return rateLimitResult;
  
  // Your logic here
}
```

## Predefined Limiters

```typescript
import { rateLimiters } from '@/lib/middleware/rate-limit';

// Strict: 10/minute - auth endpoints, password reset, sensitive operations
rateLimiters.strict

// Standard: 60/minute - general API endpoints
rateLimiters.standard

// Generous: 300/minute - public endpoints, webhooks
rateLimiters.generous

// Per-user: 100/hour per authenticated user
rateLimiters.perUser
```

## Real-World Examples

### Authentication Endpoints

```typescript
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/middleware/rate-limit';

export async function POST(req: NextRequest) {
  // Strict rate limit to prevent brute force attacks
  const rateLimitResult = rateLimiters.strict(req);
  if (rateLimitResult) return rateLimitResult;
  
  const { email, password } = await req.json();
  
  // Authentication logic...
  return NextResponse.json({ success: true });
}
```

### Password Reset

```typescript
// app/api/auth/reset-password/route.ts
import { rateLimit } from '@/lib/middleware/rate-limit';

// Very strict: 3 attempts per 10 minutes
const resetLimiter = rateLimit({
  limit: 3,
  window: 600000,
  message: 'Too many password reset attempts. Please try again in 10 minutes.',
});

export async function POST(req: NextRequest) {
  const rateLimitResult = resetLimiter(req);
  if (rateLimitResult) return rateLimitResult;
  
  // Send password reset email...
}
```

### Per-User API Limits

```typescript
// app/api/user/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/middleware/rate-limit';
import { getServerSession } from 'next-auth';

// 20 updates per hour per user
const userLimiter = rateLimit({
  limit: 20,
  window: 3600000,
  identifier: (req) => {
    // Extract user ID from session
    const userId = req.headers.get('x-user-id');
    return userId || 'anonymous';
  },
});

export async function PATCH(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Add user ID to headers for rate limiter
  req.headers.set('x-user-id', session.user.id);
  
  const rateLimitResult = userLimiter(req);
  if (rateLimitResult) return rateLimitResult;
  
  // Update user settings...
}
```

### API Key-Based Limiting

```typescript
// app/api/external/webhook/route.ts
import { rateLimit } from '@/lib/middleware/rate-limit';

const apiKeyLimiter = rateLimit({
  limit: 1000,
  window: 3600000, // 1000 requests per hour per API key
  identifier: (req) => {
    const apiKey = req.headers.get('x-api-key');
    return apiKey || 'no-key';
  },
});

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  if (!apiKey) {
    return NextResponse.json({ error: 'API key required' }, { status: 401 });
  }
  
  const rateLimitResult = apiKeyLimiter(req);
  if (rateLimitResult) return rateLimitResult;
  
  // Process webhook...
}
```

### Global Middleware Protection

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit';

export function middleware(req: NextRequest) {
  // Rate limit all /api routes
  if (req.nextUrl.pathname.startsWith('/api')) {
    const result = rateLimitMiddleware(req, {
      limit: 100,
      window: 60000,
    });
    if (result) return result;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

## Rate Limit Headers

All rate-limited responses include helpful headers:

```
HTTP/1.1 429 Too Many Requests
Retry-After: 42
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1709838120000
```

### Reading Headers Client-Side

```typescript
// Client-side fetch
const response = await fetch('/api/data');

if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After');
  const limit = response.headers.get('X-RateLimit-Limit');
  
  console.log(`Rate limited. Try again in ${retryAfter} seconds.`);
  console.log(`Limit: ${limit} requests per window`);
}
```

## Checking Rate Limit Status

```typescript
import { checkRateLimitStatus, rateLimit } from '@/lib/middleware/rate-limit';

const limiter = rateLimit({ limit: 60, window: 60000 });

export async function GET(req: NextRequest) {
  // Check status without incrementing counter
  const status = checkRateLimitStatus(req, { limit: 60, window: 60000 });
  
  console.log({
    limited: status.limited,
    remaining: status.remaining,
    resetTime: new Date(status.resetTime),
  });
  
  // Apply rate limit (increments counter)
  const rateLimitResult = limiter(req);
  if (rateLimitResult) return rateLimitResult;
  
  // Your logic...
}
```

## Production Considerations

### 1. In-Memory Limitations

The default implementation uses in-memory storage, which:
- ✅ Works perfectly for single-instance deployments
- ✅ Zero external dependencies
- ❌ Resets on server restart
- ❌ Doesn't sync across multiple instances (serverless, load-balanced)

### 2. Scaling Beyond In-Memory

For production at scale, migrate to Redis:

**Option A: Upstash Redis (recommended for Vercel)**

```typescript
// lib/middleware/rate-limit-redis.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export function rateLimit(config: RateLimitConfig) {
  return async function (req: NextRequest): Promise<NextResponse | null> {
    const id = getIdentifier(req, config.identifier);
    const key = `rate-limit:${id}`;
    
    const count = await redis.incr(key);
    
    if (count === 1) {
      await redis.expire(key, Math.ceil(config.window / 1000));
    }
    
    if (count > config.limit) {
      const ttl = await redis.ttl(key);
      return NextResponse.json(
        { error: 'Too many requests', retryAfter: ttl },
        {
          status: 429,
          headers: { 'Retry-After': ttl.toString() },
        }
      );
    }
    
    return null;
  };
}
```

**Option B: Vercel KV**

```typescript
import { kv } from '@vercel/kv';

export function rateLimit(config: RateLimitConfig) {
  return async function (req: NextRequest): Promise<NextResponse | null> {
    const id = getIdentifier(req, config.identifier);
    const key = `rate-limit:${id}`;
    
    const count = await kv.incr(key);
    
    if (count === 1) {
      await kv.expire(key, Math.ceil(config.window / 1000));
    }
    
    // Same logic as Upstash...
  };
}
```

### 3. IP Detection Behind Proxies

When deployed behind Cloudflare, Vercel, or other proxies:

```typescript
function getIdentifier(req: NextRequest): string {
  // Priority order:
  // 1. Cloudflare (most reliable)
  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;
  
  // 2. Standard proxy headers
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  
  // 3. Real IP header
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;
  
  // 4. Fallback
  return 'unknown';
}
```

### 4. Tiered Limits by Plan

```typescript
// app/api/data/route.ts
import { getServerSession } from 'next-auth';
import { rateLimit } from '@/lib/middleware/rate-limit';

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  
  // Different limits per plan
  const planLimits = {
    free: { limit: 10, window: 60000 },
    pro: { limit: 100, window: 60000 },
    enterprise: { limit: 1000, window: 60000 },
  };
  
  const userPlan = session?.user?.plan || 'free';
  const config = planLimits[userPlan];
  
  const limiter = rateLimit({
    ...config,
    identifier: () => session?.user?.id || 'anonymous',
  });
  
  const rateLimitResult = limiter(req);
  if (rateLimitResult) return rateLimitResult;
  
  // Your API logic...
}
```

## Testing

### Test Rate Limit in Development

```bash
# Make 10 requests quickly
for i in {1..10}; do
  curl http://localhost:3000/api/hello
done

# 11th request should return 429
curl http://localhost:3000/api/hello
```

### Unit Tests

```typescript
// __tests__/rate-limit.test.ts
import { rateLimit } from '@/lib/middleware/rate-limit';
import { NextRequest } from 'next/server';

describe('Rate Limit', () => {
  it('allows requests under limit', async () => {
    const limiter = rateLimit({ limit: 5, window: 60000 });
    const req = new NextRequest('http://localhost:3000/api/test');
    
    for (let i = 0; i < 5; i++) {
      const result = limiter(req);
      expect(result).toBeNull();
    }
  });
  
  it('blocks requests over limit', async () => {
    const limiter = rateLimit({ limit: 3, window: 60000 });
    const req = new NextRequest('http://localhost:3000/api/test');
    
    // First 3 requests should succeed
    for (let i = 0; i < 3; i++) {
      limiter(req);
    }
    
    // 4th request should be blocked
    const result = limiter(req);
    expect(result?.status).toBe(429);
  });
});
```

## Common Patterns

### Pattern 1: Gradual Backoff

```typescript
const limiter = rateLimit({
  limit: 10,
  window: 60000,
  message: 'Too many requests. Limit increases with paid plans.',
});
```

### Pattern 2: Burst Protection

```typescript
// Allow bursts but limit sustained load
const burstLimiter = rateLimit({ limit: 20, window: 10000 }); // 20/10s
const sustainedLimiter = rateLimit({ limit: 100, window: 60000 }); // 100/min

export async function GET(req: NextRequest) {
  // Check burst limit first
  const burstResult = burstLimiter(req);
  if (burstResult) return burstResult;
  
  // Then check sustained limit
  const sustainedResult = sustainedLimiter(req);
  if (sustainedResult) return sustainedResult;
  
  // Process request...
}
```

### Pattern 3: Separate Limits for Different Actions

```typescript
const readLimiter = rateLimit({ limit: 100, window: 60000 });
const writeLimiter = rateLimit({ limit: 20, window: 60000 });

export async function GET(req: NextRequest) {
  const result = readLimiter(req);
  if (result) return result;
  // Read logic...
}

export async function POST(req: NextRequest) {
  const result = writeLimiter(req);
  if (result) return result;
  // Write logic...
}
```

## Troubleshooting

### Issue: Rate limits not working in development

**Cause:** In-memory store persists across hot reloads  
**Solution:** Restart dev server between tests, or clear store manually:

```typescript
// Add to rate-limit.ts for dev only
if (process.env.NODE_ENV === 'development') {
  store.clear();
}
```

### Issue: All users get same rate limit

**Cause:** IP-based limiting behind proxy without proper headers  
**Solution:** Configure proxy to forward IP headers (X-Forwarded-For, X-Real-IP)

### Issue: Serverless functions have independent limits

**Cause:** In-memory store doesn't sync across function instances  
**Solution:** Migrate to Redis (Upstash or Vercel KV)

## Migration Checklist

When migrating from in-memory to Redis:

- [ ] Install Redis client (`@upstash/redis` or `@vercel/kv`)
- [ ] Add connection credentials to `.env`
- [ ] Update `rateLimit` function to use async Redis calls
- [ ] Test rate limit persistence across deployments
- [ ] Monitor Redis usage/costs
- [ ] Set appropriate TTL values (use `EXPIRE` command)
- [ ] Consider Redis connection pooling for high traffic

## Real-World Pattern: Rate Limit + Quota Enforcement

**From Screenshot API (production pattern):**

Most SaaS APIs need both rate limiting (prevent abuse) and quota enforcement (subscription limits). Here's the combined pattern:

```typescript
// app/api/screenshot/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Simple in-memory rate limiter per user
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string): { 
  success: boolean; 
  limit: number; 
  remaining: number; 
  reset: number 
} {
  const now = Date.now();
  const limit = 60; // 60 requests per minute per user
  const window = 60 * 1000;
  
  const current = rateLimitStore.get(userId);
  
  if (!current || current.resetTime < now) {
    rateLimitStore.set(userId, { count: 1, resetTime: now + window });
    return { success: true, limit, remaining: limit - 1, reset: now + window };
  }
  
  if (current.count >= limit) {
    return { success: false, limit, remaining: 0, reset: current.resetTime };
  }
  
  current.count++;
  return { success: true, limit, remaining: limit - current.count, reset: current.resetTime };
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user (via API key, session, etc.)
    const userId = await authenticateRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // 2. Check rate limit (prevent abuse)
    const { success, limit, remaining, reset } = checkRateLimit(userId);
    
    if (!success) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          limit,
          remaining: 0,
          reset: new Date(reset).toISOString(),
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }
    
    // 3. Check subscription quota (enforce plan limits)
    const supabase = await createClient();
    
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('tier, screenshots_included, screenshots_used')
      .eq('user_id', userId)
      .single();
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription' },
        { status: 403 }
      );
    }
    
    if (subscription.screenshots_used >= subscription.screenshots_included) {
      return NextResponse.json(
        { 
          error: 'Quota exceeded',
          quota: {
            included: subscription.screenshots_included,
            used: subscription.screenshots_used,
            tier: subscription.tier,
          },
          message: 'Upgrade your plan to get more screenshots',
        },
        { status: 403 }
      );
    }
    
    // 4. Process the request
    const result = await processScreenshot(request);
    
    // 5. Track usage
    await supabase.rpc('increment_screenshot_usage', { p_user_id: userId });
    
    // 6. Return result with rate limit headers
    return new NextResponse(result, {
      status: 200,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
        'X-Quota-Included': subscription.screenshots_included.toString(),
        'X-Quota-Used': (subscription.screenshots_used + 1).toString(),
      },
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Request failed' },
      { status: 500 }
    );
  }
}
```

### When to Use This Pattern

**Use combined rate limit + quota when:**
- ✅ Your API consumes resources (compute, storage, API calls)
- ✅ You have tiered pricing with different quotas
- ✅ You need to prevent both abuse AND overage
- ✅ Example: Screenshot API, PDF Generator, Email Sender

**Use rate limit only when:**
- ✅ No resource consumption per request (reads, searches)
- ✅ No subscription tiers or quotas
- ✅ Example: Auth endpoints, public APIs, webhooks

**Use quota only when:**
- ✅ Requests are expensive but not abuse-prone
- ✅ Rate limiting handled by infrastructure (Vercel, Cloudflare)
- ✅ Example: AI API calls, third-party API proxies

## Summary

- ✅ Use `rateLimiters.standard` for most API routes (middleware approach)
- ✅ Use `rateLimiters.strict` for auth/sensitive endpoints
- ✅ Use combined rate limit + quota for resource-intensive APIs
- ✅ In-memory works great for MVP and single-instance deploys
- ✅ Migrate to Redis when scaling to serverless/multi-instance
- ✅ Always return helpful error messages and `Retry-After` headers
- ✅ Include quota info in response headers for client transparency
- ✅ Test rate limits in development before production

**Next Steps:**
1. Apply rate limiting to existing API routes
2. Add quota enforcement if you have tiered pricing
3. Test limits match your expected traffic patterns
4. Monitor 429 and 403 responses in production logs
5. Migrate to Redis when needed (Upstash recommended for Vercel)
