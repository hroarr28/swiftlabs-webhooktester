'use client';

import { useState } from 'react';
import { ForwardingRules } from './forwarding-rules';
import Link from 'next/link';

interface ForwardingRule {
  id: string;
  target_url: string;
  is_active: boolean;
  filter_method?: string;
  total_forwards: number;
  last_forwarded_at?: string;
  created_at: string;
}

interface ForwardingRulesWrapperProps {
  endpointId: string;
  initialRules: ForwardingRule[];
  isPro: boolean;
}

export function ForwardingRulesWrapper({
  endpointId,
  initialRules,
  isPro,
}: ForwardingRulesWrapperProps) {
  const [rules, setRules] = useState<ForwardingRule[]>(initialRules);

  const refreshRules = async () => {
    const response = await fetch(`/api/forwarding-rules?endpoint_id=${endpointId}`);
    if (response.ok) {
      const data = await response.json();
      setRules(data.rules);
    }
  };

  if (!isPro) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Forwarding Rules</h3>
          <p className="text-sm text-zinc-500">
            Forward incoming webhooks to your development server or other endpoints
          </p>
        </div>
        <div className="p-8 border border-dashed border-zinc-700 rounded-lg text-center">
          <div className="max-w-md mx-auto">
            <h4 className="text-lg font-semibold mb-2">Pro Feature</h4>
            <p className="text-sm text-zinc-500 mb-4">
              Upgrade to Pro to automatically forward webhooks to your local development server or
              other endpoints. Perfect for testing integrations without exposing your localhost.
            </p>
            <Link
              href="/pricing"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ForwardingRules
      endpointId={endpointId}
      rules={rules}
      onRulesChange={refreshRules}
    />
  );
}
