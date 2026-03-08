# Feature Flags Pattern

Control feature access by plan, user, or rollout percentage without code changes.

## Quick Start

### Check if User Has Feature

```typescript
import { hasFeature } from '@/lib/feature-flags/flags';

const user = await getCurrentUser();

if (hasFeature('api_access', user)) {
  // Show API settings
}
```

### Server-Side Feature Gate

```typescript
// app/api/webhook/route.ts
import { requireFeature } from '@/lib/feature-flags/flags';

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  
  // Throws error if user doesn't have access
  requireFeature('webhooks', user);
  
  // Webhook logic...
}
```

### Client-Side Conditional Rendering

```typescript
// app/dashboard/page.tsx
import { hasFeature } from '@/lib/feature-flags/flags';
import { getCurrentUser } from '@/lib/auth';

export default async function Dashboard() {
  const user = await getCurrentUser();
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      {hasFeature('advanced_analytics', user) && (
        <AnalyticsDashboard />
      )}
      
      {!hasFeature('advanced_analytics', user) && (
        <UpgradePrompt feature="advanced_analytics" />
      )}
    </div>
  );
}
```

## Defining Features

### Add New Feature Flag

```typescript
// lib/feature-flags/flags.ts

export type FeatureFlag =
  | 'api_access'
  | 'webhooks'
  | 'your_new_feature'; // Add here

export const FEATURE_FLAGS: Record<FeatureFlag, FeatureFlagConfig> = {
  your_new_feature: {
    enabled: true,
    plans: ['pro', 'enterprise'],
    description: 'What this feature does',
  },
};
```

### Feature Configuration Options

```typescript
{
  // Required: globally enable/disable
  enabled: true,
  
  // Optional: which plans have access
  plans: ['pro', 'enterprise'],
  
  // Optional: specific user IDs (override plan)
  userIds: ['user_123', 'user_456'],
  
  // Optional: email domain access (@company.com)
  emailDomains: ['@yourcompany.com', '@partner.com'],
  
  // Optional: gradual rollout (0-100%)
  rolloutPercentage: 50, // 50% of users
  
  // Optional: auto-disable after date
  expiresAt: new Date('2026-12-31'),
  
  // Optional: documentation
  description: 'Feature description for reference',
}
```

## Real-World Examples

### Plan-Based Access

```typescript
// Free tier: Basic features only
// Pro tier: Advanced features
// Enterprise tier: Everything

export const FEATURE_FLAGS: Record<FeatureFlag, FeatureFlagConfig> = {
  export_data: {
    enabled: true,
    plans: ['free', 'pro', 'enterprise'], // Everyone
  },
  
  api_access: {
    enabled: true,
    plans: ['pro', 'enterprise'], // Paid plans only
  },
  
  custom_branding: {
    enabled: true,
    plans: ['enterprise'], // Enterprise only
  },
};
```

### Beta Feature Rollout

```typescript
// Gradually roll out new feature to 20% of users
new_ai_assistant: {
  enabled: true,
  rolloutPercentage: 20, // 20% of all users
  description: 'AI-powered assistant (beta)',
},
```

### Early Access for Specific Users

```typescript
// Give early access to specific users (beta testers, VIPs)
experimental_ui: {
  enabled: true,
  userIds: [
    'user_abc123', // Beta tester 1
    'user_def456', // Beta tester 2
  ],
  description: 'New dashboard UI (experimental)',
},
```

### Company-Wide Access

```typescript
// Grant access to all users from specific companies
team_features: {
  enabled: true,
  emailDomains: [
    '@partner-company.com',
    '@beta-tester.org',
  ],
  description: 'Team collaboration features',
},
```

### Time-Limited Feature

```typescript
// Black Friday promotion: temporary enterprise features
black_friday_bonus: {
  enabled: true,
  plans: ['pro'],
  expiresAt: new Date('2026-11-30'), // Auto-disable Dec 1
  description: 'Temporary enterprise features for Black Friday',
},
```

## Usage Patterns

### API Route Protection

```typescript
// app/api/advanced/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireFeature } from '@/lib/feature-flags/flags';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  
  try {
    requireFeature('api_access', user);
  } catch (error) {
    if (error instanceof FeatureAccessError) {
      return NextResponse.json(
        {
          error: 'Upgrade Required',
          message: error.message,
          feature: error.flag,
          currentPlan: error.userPlan,
        },
        { status: 403 }
      );
    }
    throw error;
  }
  
  // API logic...
  return NextResponse.json({ data: 'success' });
}
```

### Upgrade Prompt Component

```typescript
// components/upgrade-prompt.tsx
'use client';

import { getPlanUpgradeSuggestion } from '@/lib/feature-flags/flags';
import type { FeatureFlag, UserPlan } from '@/lib/feature-flags/flags';

export function UpgradePrompt({
  feature,
  currentPlan,
}: {
  feature: FeatureFlag;
  currentPlan: UserPlan;
}) {
  const suggestion = getPlanUpgradeSuggestion(feature, currentPlan);
  
  if (!suggestion.requiredPlan) {
    return null; // User already has access
  }
  
  return (
    <div className="border-2 border-blue-500 rounded-lg p-6 bg-blue-50">
      <h3 className="text-xl font-bold mb-2">Upgrade to Unlock</h3>
      <p className="text-gray-700 mb-4">
        This feature requires the <strong>{suggestion.requiredPlan}</strong> plan.
      </p>
      <a
        href="/pricing"
        className="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        View Pricing
      </a>
    </div>
  );
}
```

### Settings Page with Feature Gates

```typescript
// app/settings/page.tsx
import { hasFeature } from '@/lib/feature-flags/flags';
import { getCurrentUser } from '@/lib/auth';

export default async function SettingsPage() {
  const user = await getCurrentUser();
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      {/* Always visible */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Account</h2>
        <AccountSettings user={user} />
      </section>
      
      {/* Pro+ only */}
      {hasFeature('api_access', user) && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">API Access</h2>
          <APISettings user={user} />
        </section>
      )}
      
      {/* Enterprise only */}
      {hasFeature('custom_branding', user) && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Branding</h2>
          <BrandingSettings user={user} />
        </section>
      )}
      
      {/* Show upgrade prompts for locked features */}
      {!hasFeature('api_access', user) && (
        <UpgradePrompt feature="api_access" currentPlan={user.plan} />
      )}
    </div>
  );
}
```

### Feature List for Pricing Page

```typescript
// app/pricing/page.tsx
import { PLAN_FEATURES } from '@/lib/feature-flags/flags';

export default function PricingPage() {
  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Free Plan */}
      <div className="border rounded-lg p-6">
        <h2 className="text-2xl font-bold">Free</h2>
        <p className="text-3xl font-bold my-4">£0/month</p>
        <ul className="space-y-2">
          {PLAN_FEATURES.free.map(feature => (
            <li key={feature} className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              {featureName(feature)}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Pro Plan */}
      <div className="border-2 border-blue-500 rounded-lg p-6">
        <h2 className="text-2xl font-bold">Pro</h2>
        <p className="text-3xl font-bold my-4">£10/month</p>
        <ul className="space-y-2">
          {PLAN_FEATURES.pro.map(feature => (
            <li key={feature} className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              {featureName(feature)}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Enterprise Plan */}
      <div className="border rounded-lg p-6">
        <h2 className="text-2xl font-bold">Enterprise</h2>
        <p className="text-3xl font-bold my-4">Custom</p>
        <ul className="space-y-2">
          {PLAN_FEATURES.enterprise.map(feature => (
            <li key={feature} className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              {featureName(feature)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function featureName(flag: string): string {
  return flag.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
```

### Navigation Menu with Feature Gates

```typescript
// components/nav.tsx
import { hasFeature } from '@/lib/feature-flags/flags';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';

export async function Nav() {
  const user = await getCurrentUser();
  
  return (
    <nav className="flex gap-4">
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/data">Data</Link>
      
      {hasFeature('api_access', user) && (
        <Link href="/api">API</Link>
      )}
      
      {hasFeature('team_collaboration', user) && (
        <Link href="/team">Team</Link>
      )}
      
      {hasFeature('advanced_analytics', user) && (
        <Link href="/analytics">Analytics</Link>
      )}
    </nav>
  );
}
```

## Advanced Patterns

### Gradual Feature Rollout

```typescript
// Start with 10% rollout, increase gradually
new_editor: {
  enabled: true,
  rolloutPercentage: 10, // Week 1: 10%
  // Week 2: increase to 25%
  // Week 3: increase to 50%
  // Week 4: increase to 100%
  description: 'New WYSIWYG editor',
},
```

Users are consistently included/excluded based on their user ID hash.

### A/B Testing

```typescript
// Split users 50/50 for A/B test
ab_test_new_onboarding: {
  enabled: true,
  rolloutPercentage: 50,
  description: 'Test new onboarding flow',
},
```

```typescript
// In your component
const user = await getCurrentUser();
const useNewOnboarding = hasFeature('ab_test_new_onboarding', user);

if (useNewOnboarding) {
  return <NewOnboardingFlow />;
} else {
  return <OldOnboardingFlow />;
}
```

### Feature Announcement Banner

```typescript
// components/feature-announcement.tsx
import { hasFeature, getFeatureStatus } from '@/lib/feature-flags/flags';

export function FeatureAnnouncement({ user }) {
  const hasAccess = hasFeature('beta_features', user);
  const status = getFeatureStatus('beta_features', user);
  
  if (!hasAccess && status.reason === 'plan_denied') {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
        <p className="font-semibold">New Beta Features Available!</p>
        <p>Upgrade to Pro to access early releases and beta features.</p>
        <a href="/pricing" className="text-blue-600 underline">
          View Plans
        </a>
      </div>
    );
  }
  
  return null;
}
```

### Admin Feature Override

```typescript
// lib/feature-flags/admin.ts
const ADMIN_OVERRIDES: Record<string, FeatureFlag[]> = {
  'admin_user_id_123': ['beta_features', 'experimental_ui'],
};

export function hasFeatureWithAdmin(
  flag: FeatureFlag,
  user: User | null
): boolean {
  if (!user) return false;
  
  // Check admin overrides first
  if (ADMIN_OVERRIDES[user.id]?.includes(flag)) {
    return true;
  }
  
  return hasFeature(flag, user);
}
```

## Testing

### Test Feature Access

```typescript
// __tests__/feature-flags.test.ts
import { hasFeature } from '@/lib/feature-flags/flags';

describe('Feature Flags', () => {
  it('grants access to pro users', () => {
    const user = { id: '123', email: 'user@example.com', plan: 'pro' as const };
    expect(hasFeature('api_access', user)).toBe(true);
  });
  
  it('denies access to free users', () => {
    const user = { id: '123', email: 'user@example.com', plan: 'free' as const };
    expect(hasFeature('api_access', user)).toBe(false);
  });
  
  it('grants access via user ID whitelist', () => {
    // Assuming 'beta_features' has userIds: ['special_user']
    const user = {
      id: 'special_user',
      email: 'user@example.com',
      plan: 'free' as const,
    };
    expect(hasFeature('beta_features', user)).toBe(true);
  });
});
```

### Test API Endpoints

```bash
# Test with free user (should fail)
curl -H "Authorization: Bearer FREE_USER_TOKEN" \
  http://localhost:3000/api/advanced

# Test with pro user (should succeed)
curl -H "Authorization: Bearer PRO_USER_TOKEN" \
  http://localhost:3000/api/advanced
```

## Migration from Hard-Coded Checks

### Before (Hard-Coded)

```typescript
// ❌ Hard to change, requires deployment
if (user.plan === 'pro' || user.plan === 'enterprise') {
  // Show feature
}
```

### After (Feature Flags)

```typescript
// ✅ Controlled centrally, easy to update
if (hasFeature('api_access', user)) {
  // Show feature
}
```

### Migration Checklist

1. **Identify hard-coded plan checks** - Search codebase for `user.plan === 'pro'`
2. **Define feature flags** - Add to `FEATURE_FLAGS` config
3. **Replace checks** - Use `hasFeature()` instead of plan checks
4. **Add upgrade prompts** - Show upgrade CTAs for locked features
5. **Update pricing page** - Use `PLAN_FEATURES` to list features
6. **Test thoroughly** - Verify access for each plan

## Production Considerations

### 1. Database-Backed Flags (for dynamic control)

For flags that need to be toggled without redeployment:

```typescript
// lib/feature-flags/db.ts
import { createClient } from '@/lib/supabase/server';

export async function getFeatureFlagFromDB(
  flag: FeatureFlag
): Promise<FeatureFlagConfig | null> {
  const supabase = await createClient();
  
  const { data } = await supabase
    .from('feature_flags')
    .select('*')
    .eq('name', flag)
    .single();
  
  return data;
}
```

### 2. Caching for Performance

```typescript
import { unstable_cache } from 'next/cache';

export const getCachedFeatureFlags = unstable_cache(
  async () => {
    const supabase = await createClient();
    const { data } = await supabase.from('feature_flags').select('*');
    return data;
  },
  ['feature-flags'],
  { revalidate: 300 } // Cache for 5 minutes
);
```

### 3. Logging Feature Access

```typescript
export function hasFeature(flag: FeatureFlag, user: User | null): boolean {
  const result = // ... check logic
  
  if (process.env.NODE_ENV === 'production') {
    logFeatureAccess({
      flag,
      userId: user?.id,
      granted: result,
      timestamp: new Date(),
    });
  }
  
  return result;
}
```

### 4. Real-Time Flag Updates (Advanced)

```typescript
// Use Supabase realtime for instant flag updates
const supabase = createClient();

supabase
  .channel('feature_flags')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'feature_flags',
  }, (payload) => {
    // Invalidate cache, update UI
    revalidateFeatureFlags();
  })
  .subscribe();
```

## Summary

- ✅ Define features once in `FEATURE_FLAGS` config
- ✅ Use `hasFeature()` for conditional rendering
- ✅ Use `requireFeature()` for API route protection
- ✅ Use `PLAN_FEATURES` for pricing page feature lists
- ✅ Gradual rollouts with `rolloutPercentage`
- ✅ Time-limited features with `expiresAt`
- ✅ User/domain whitelists for early access
- ✅ Consistent UI with upgrade prompts

**Common Workflows:**
- **Launch beta feature**: Set `rolloutPercentage: 10`, increase gradually
- **Enterprise-only feature**: Set `plans: ['enterprise']`
- **Early access**: Add user IDs to `userIds` array
- **Temporary promotion**: Set `expiresAt` for auto-disable
- **A/B test**: Use `rolloutPercentage: 50` and measure metrics

**Next Steps:**
1. Define your product's features in `FEATURE_FLAGS`
2. Replace hard-coded plan checks with `hasFeature()`
3. Add upgrade prompts to locked features
4. Build pricing page from `PLAN_FEATURES`
5. Test with different user plans/scenarios
