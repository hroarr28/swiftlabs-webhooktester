'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  const handleManage = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/create-portal-session', {
        method: 'POST',
      });

      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      toast.error('Failed to open billing portal');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleManage}
      disabled={loading}
      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-800 disabled:cursor-not-allowed rounded-lg transition-colors text-sm"
    >
      {loading ? 'Loading...' : 'Manage subscription'}
    </button>
  );
}
