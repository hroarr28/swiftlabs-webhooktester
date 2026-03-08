'use client';

import { useState } from 'react';
import { PlusIcon, TrashIcon, PlayIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

interface ForwardingRule {
  id: string;
  target_url: string;
  is_active: boolean;
  filter_method?: string;
  total_forwards: number;
  last_forwarded_at?: string;
  created_at: string;
}

interface ForwardingRulesProps {
  endpointId: string;
  rules: ForwardingRule[];
  onRulesChange: () => void;
}

export function ForwardingRules({ endpointId, rules, onRulesChange }: ForwardingRulesProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newRule, setNewRule] = useState({
    targetUrl: '',
    method: '',
  });

  const addRule = async () => {
    if (!newRule.targetUrl) {
      toast.error('Target URL is required');
      return;
    }

    // Validate URL format
    try {
      new URL(newRule.targetUrl);
    } catch {
      toast.error('Invalid URL format');
      return;
    }

    const response = await fetch('/api/forwarding-rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint_id: endpointId,
        target_url: newRule.targetUrl,
        filter_method: newRule.method || null,
      }),
    });

    if (response.ok) {
      toast.success('Forwarding rule added');
      setNewRule({ targetUrl: '', method: '' });
      setIsAdding(false);
      onRulesChange();
    } else {
      const error = await response.json();
      toast.error(error.error || 'Failed to add rule');
    }
  };

  const deleteRule = async (ruleId: string) => {
    const response = await fetch(`/api/forwarding-rules?id=${ruleId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      toast.success('Forwarding rule deleted');
      onRulesChange();
    } else {
      toast.error('Failed to delete rule');
    }
  };

  const toggleRule = async (ruleId: string, isActive: boolean) => {
    const response = await fetch('/api/forwarding-rules', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: ruleId, is_active: !isActive }),
    });

    if (response.ok) {
      toast.success(isActive ? 'Rule disabled' : 'Rule enabled');
      onRulesChange();
    } else {
      toast.error('Failed to update rule');
    }
  };

  const testRule = async (targetUrl: string) => {
    toast.info('Sending test webhook...');
    
    const response = await fetch('/api/test-forward', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_url: targetUrl }),
    });

    if (response.ok) {
      toast.success('Test webhook sent successfully');
    } else {
      toast.error('Test webhook failed - check target URL');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Forwarding Rules</h3>
          <p className="text-sm text-zinc-500">
            Forward incoming webhooks to your development server or other endpoints
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Rule
        </button>
      </div>

      {/* Add new rule form */}
      {isAdding && (
        <div className="p-4 border border-zinc-700 rounded-lg bg-zinc-800/50 space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Target URL</label>
            <input
              type="url"
              value={newRule.targetUrl}
              onChange={(e) => setNewRule({ ...newRule, targetUrl: e.target.value })}
              placeholder="https://your-server.com/webhook"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Webhooks will be forwarded to this URL
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Filter by Method (Optional)
            </label>
            <select
              value={newRule.method}
              onChange={(e) => setNewRule({ ...newRule, method: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All methods</option>
              <option value="GET">GET only</option>
              <option value="POST">POST only</option>
              <option value="PUT">PUT only</option>
              <option value="DELETE">DELETE only</option>
              <option value="PATCH">PATCH only</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={addRule}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save Rule
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewRule({ targetUrl: '', method: '' });
              }}
              className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Existing rules */}
      {rules.length === 0 ? (
        <div className="p-8 border border-dashed border-zinc-700 rounded-lg text-center text-zinc-500">
          No forwarding rules configured
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="p-4 border border-zinc-700 rounded-lg bg-zinc-800/30 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <code className="text-sm font-mono text-blue-400">
                    {rule.target_url}
                  </code>
                  {rule.filter_method && (
                    <span className="px-2 py-1 text-xs bg-zinc-700 rounded">
                      {rule.filter_method} only
                    </span>
                  )}
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      rule.is_active
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-zinc-700 text-zinc-400'
                    }`}
                  >
                    {rule.is_active ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <div className="text-sm text-zinc-500 mt-1">
                  {rule.total_forwards} forwards
                  {rule.last_forwarded_at && (
                    <span>
                      {' · Last: '}
                      {new Date(rule.last_forwarded_at).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => testRule(rule.target_url)}
                  className="p-2 hover:bg-zinc-700 rounded-lg"
                  title="Test this rule"
                >
                  <PlayIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => toggleRule(rule.id, rule.is_active)}
                  className={`px-3 py-1 text-sm rounded ${
                    rule.is_active
                      ? 'bg-zinc-700 hover:bg-zinc-600'
                      : 'bg-green-900/30 hover:bg-green-900/50 text-green-400'
                  }`}
                >
                  {rule.is_active ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="p-2 hover:bg-red-900/30 rounded-lg text-red-400"
                  title="Delete rule"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
