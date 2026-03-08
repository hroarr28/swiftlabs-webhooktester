'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Endpoint, updateEndpoint, deleteEndpoint } from '@/lib/actions/endpoints';
import { toast } from 'sonner';
import { Cog6ToothIcon, TrashIcon } from '@heroicons/react/24/outline';

interface EndpointSettingsProps {
  endpoint: Endpoint;
}

export function EndpointSettings({ endpoint }: EndpointSettingsProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggleActive = async () => {
    setLoading(true);
    const result = await updateEndpoint({
      id: endpoint.id,
      is_active: !endpoint.is_active,
    });

    if (result.success) {
      toast.success(endpoint.is_active ? 'Endpoint deactivated' : 'Endpoint activated');
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to update endpoint');
    }
    setLoading(false);
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this endpoint? All requests will be lost.')) {
      return;
    }

    setLoading(true);
    const result = await deleteEndpoint(endpoint.id);

    if (result.success) {
      toast.success('Endpoint deleted');
      router.push('/dashboard');
    } else {
      toast.error(result.error || 'Failed to delete endpoint');
    }
    setLoading(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="rounded-lg border border-zinc-300 bg-white p-2 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
      >
        <Cog6ToothIcon className="h-5 w-5" />
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-12 z-20 w-56 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            <div className="p-2">
              <button
                onClick={handleToggleActive}
                disabled={loading}
                className="w-full rounded-lg px-4 py-2 text-left text-sm text-zinc-900 hover:bg-zinc-100 disabled:opacity-50 dark:text-white dark:hover:bg-zinc-800"
              >
                {endpoint.is_active ? 'Deactivate' : 'Activate'} Endpoint
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950"
              >
                <TrashIcon className="h-4 w-4" />
                <span>Delete Endpoint</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
