/**
 * Feature Flag System
 * 
 * Toggle features per user, plan, or globally without redeployment.
 * 
 * @see FEATURE_FLAGS_PATTERN.md for usage examples
 */

export type FeatureFlag =
  | 'beta_features'
  | 'advanced_analytics'
  | 'api_access'
  | 'custom_branding'
  | 'team_collaboration'
  | 'priority_support'
  | 'export_data'
  | 'webhooks'
  | 'custom_integrations'
  | 'white_label';

export type UserPlan = 'free' | 'pro' | 'enterprise';

export type FeatureFlagConfig = {
  /**
   * Feature is enabled globally
   */
  enabled: boolean;
  
  /**
   * Plans that have access to this feature
   */
  plans?: UserPlan[];
  
  /**
   * Specific user IDs with access (overrides plan)
   */
  userIds?: string[];
  
  /**
   * Email domains with access (e.g., '@company.com')
   */
  emailDomains?: string[];
  
  /**
   * Rollout percentage (0-100) for gradual rollout
   */
  rolloutPercentage?: number;
  
  /**
   * Feature expiry date (automatically disabled after)
   */
  expiresAt?: Date;
  
  /**
   * Feature description (for documentation)
   */
  description?: string;
};

/**
 * Feature flag configuration
 * 
 * Add your features here with access rules.
 */
export const FEATURE_FLAGS: Record<FeatureFlag, FeatureFlagConfig> = {
  beta_features: {
    enabled: true,
    plans: ['pro', 'enterprise'],
    description: 'Access to beta features and early releases',
  },
  
  advanced_analytics: {
    enabled: true,
    plans: ['pro', 'enterprise'],
    description: 'Advanced analytics dashboard and reports',
  },
  
  api_access: {
    enabled: true,
    plans: ['pro', 'enterprise'],
    description: 'REST API access with authentication',
  },
  
  custom_branding: {
    enabled: true,
    plans: ['enterprise'],
    description: 'Custom logo, colors, and white-label options',
  },
  
  team_collaboration: {
    enabled: true,
    plans: ['pro', 'enterprise'],
    description: 'Invite team members and assign roles',
  },
  
  priority_support: {
    enabled: true,
    plans: ['enterprise'],
    description: '24/7 priority email and chat support',
  },
  
  export_data: {
    enabled: true,
    plans: ['free', 'pro', 'enterprise'],
    description: 'Export data in CSV, JSON, or XML formats',
  },
  
  webhooks: {
    enabled: true,
    plans: ['pro', 'enterprise'],
    description: 'Configure webhooks for events',
  },
  
  custom_integrations: {
    enabled: true,
    plans: ['enterprise'],
    description: 'Custom integrations and OAuth apps',
  },
  
  white_label: {
    enabled: false, // Coming soon
    plans: ['enterprise'],
    description: 'Complete white-label solution with custom domain',
  },
};

/**
 * Check if a user has access to a feature
 * 
 * @example
 * ```ts
 * const canUseAPI = await hasFeature('api_access', user);
 * if (canUseAPI) {
 *   // Show API settings
 * }
 * ```
 */
export function hasFeature(
  flag: FeatureFlag,
  user: {
    id: string;
    email: string;
    plan: UserPlan;
  } | null
): boolean {
  const config = FEATURE_FLAGS[flag];
  
  // Feature globally disabled
  if (!config.enabled) {
    return false;
  }
  
  // No user context - deny access
  if (!user) {
    return false;
  }
  
  // Check expiry
  if (config.expiresAt && new Date() > config.expiresAt) {
    return false;
  }
  
  // Check user ID whitelist (highest priority)
  if (config.userIds?.includes(user.id)) {
    return true;
  }
  
  // Check email domain whitelist
  if (config.emailDomains) {
    const emailDomain = user.email.split('@')[1];
    if (config.emailDomains.some(domain => emailDomain === domain.replace('@', ''))) {
      return true;
    }
  }
  
  // Check plan access
  if (config.plans && !config.plans.includes(user.plan)) {
    return false;
  }
  
  // Check rollout percentage (gradual rollout)
  if (config.rolloutPercentage !== undefined) {
    const userHash = hashString(user.id);
    const userPercentage = userHash % 100;
    
    if (userPercentage >= config.rolloutPercentage) {
      return false;
    }
  }
  
  return true;
}

/**
 * Get all enabled features for a user
 * 
 * @example
 * ```ts
 * const features = getEnabledFeatures(user);
 * // ['api_access', 'export_data', 'webhooks']
 * ```
 */
export function getEnabledFeatures(user: {
  id: string;
  email: string;
  plan: UserPlan;
} | null): FeatureFlag[] {
  return (Object.keys(FEATURE_FLAGS) as FeatureFlag[]).filter(flag =>
    hasFeature(flag, user)
  );
}

/**
 * Get feature flag status with details
 * 
 * @example
 * ```ts
 * const status = getFeatureStatus('api_access', user);
 * // { enabled: true, reason: 'plan_access', plan: 'pro' }
 * ```
 */
export function getFeatureStatus(
  flag: FeatureFlag,
  user: {
    id: string;
    email: string;
    plan: UserPlan;
  } | null
): {
  enabled: boolean;
  reason: 'globally_disabled' | 'no_user' | 'expired' | 'user_whitelist' | 
          'email_domain' | 'plan_access' | 'rollout' | 'plan_denied';
  config: FeatureFlagConfig;
} {
  const config = FEATURE_FLAGS[flag];
  
  if (!config.enabled) {
    return { enabled: false, reason: 'globally_disabled', config };
  }
  
  if (!user) {
    return { enabled: false, reason: 'no_user', config };
  }
  
  if (config.expiresAt && new Date() > config.expiresAt) {
    return { enabled: false, reason: 'expired', config };
  }
  
  if (config.userIds?.includes(user.id)) {
    return { enabled: true, reason: 'user_whitelist', config };
  }
  
  if (config.emailDomains) {
    const emailDomain = user.email.split('@')[1];
    if (config.emailDomains.some(domain => emailDomain === domain.replace('@', ''))) {
      return { enabled: true, reason: 'email_domain', config };
    }
  }
  
  if (config.plans && !config.plans.includes(user.plan)) {
    return { enabled: false, reason: 'plan_denied', config };
  }
  
  if (config.rolloutPercentage !== undefined) {
    const userHash = hashString(user.id);
    const userPercentage = userHash % 100;
    
    if (userPercentage >= config.rolloutPercentage) {
      return { enabled: false, reason: 'rollout', config };
    }
  }
  
  return { enabled: true, reason: 'plan_access', config };
}

/**
 * Simple string hash for consistent user percentage
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Require feature access (throw if not allowed)
 * 
 * @example
 * ```ts
 * export async function POST(req: NextRequest) {
 *   const user = await getUser(req);
 *   requireFeature('api_access', user); // Throws if denied
 *   
 *   // API logic...
 * }
 * ```
 */
export function requireFeature(
  flag: FeatureFlag,
  user: {
    id: string;
    email: string;
    plan: UserPlan;
  } | null
): void {
  if (!hasFeature(flag, user)) {
    const config = FEATURE_FLAGS[flag];
    const requiredPlan = config.plans?.[0] || 'enterprise';
    
    throw new FeatureAccessError(
      `This feature requires ${requiredPlan} plan or higher`,
      flag,
      user?.plan || 'none'
    );
  }
}

/**
 * Feature access error
 */
export class FeatureAccessError extends Error {
  constructor(
    message: string,
    public flag: FeatureFlag,
    public userPlan: UserPlan | 'none'
  ) {
    super(message);
    this.name = 'FeatureAccessError';
  }
}

/**
 * Plan-based feature matrix
 */
export const PLAN_FEATURES: Record<UserPlan, FeatureFlag[]> = {
  free: ['export_data'],
  pro: [
    'export_data',
    'beta_features',
    'advanced_analytics',
    'api_access',
    'team_collaboration',
    'webhooks',
  ],
  enterprise: [
    'export_data',
    'beta_features',
    'advanced_analytics',
    'api_access',
    'team_collaboration',
    'webhooks',
    'custom_branding',
    'priority_support',
    'custom_integrations',
  ],
};

/**
 * Get plan upgrade suggestions for a feature
 * 
 * @example
 * ```ts
 * const suggestion = getPlanUpgradeSuggestion('api_access', 'free');
 * // { feature: 'api_access', currentPlan: 'free', requiredPlan: 'pro' }
 * ```
 */
export function getPlanUpgradeSuggestion(
  flag: FeatureFlag,
  currentPlan: UserPlan
): {
  feature: FeatureFlag;
  currentPlan: UserPlan;
  requiredPlan: UserPlan | null;
} {
  const config = FEATURE_FLAGS[flag];
  
  if (!config.plans || config.plans.includes(currentPlan)) {
    return { feature: flag, currentPlan, requiredPlan: null };
  }
  
  // Find lowest required plan
  const planOrder: UserPlan[] = ['free', 'pro', 'enterprise'];
  const requiredPlan = config.plans
    .sort((a, b) => planOrder.indexOf(a) - planOrder.indexOf(b))[0];
  
  return { feature: flag, currentPlan, requiredPlan };
}
