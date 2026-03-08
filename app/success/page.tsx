import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Success | Webhook Tester',
  description: 'Payment successful',
};

export default async function SuccessPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-4">Welcome to Pro!</h1>
        <p className="text-neutral-400 mb-8">
          Your subscription is now active. You have access to unlimited endpoints, 30-day request history, and all Pro features.
        </p>

        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
