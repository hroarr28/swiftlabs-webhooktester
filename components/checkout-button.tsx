'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export function CheckoutButton() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
      });

      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      toast.error('Failed to create checkout session');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
    >
      {loading ? 'Loading...' : 'Upgrade to Pro'}
    </button>
  );
}
