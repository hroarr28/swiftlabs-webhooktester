'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createEndpoint } from '@/lib/actions/endpoints';
import { toast } from 'sonner';

export function NewEndpointForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createEndpoint({
        name: formData.name,
        description: formData.description || undefined,
      });

      if (result.success && result.endpoint) {
        toast.success('Endpoint created successfully');
        router.push(`/dashboard/endpoints/${result.endpoint.id}`);
      } else {
        toast.error(result.error || 'Failed to create endpoint');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-zinc-900 dark:text-white"
        >
          Endpoint Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
          placeholder="Production API Webhooks"
          maxLength={255}
        />
        <p className="mt-1.5 text-sm text-zinc-500">
          A friendly name to identify this endpoint
        </p>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-zinc-900 dark:text-white"
        >
          Description (optional)
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
          placeholder="Testing Stripe payment webhooks for the checkout flow"
        />
        <p className="mt-1.5 text-sm text-zinc-500">
          Add notes about what this endpoint is for
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || !formData.name.trim()}
          className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Endpoint'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-zinc-300 bg-white px-6 py-2.5 font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
