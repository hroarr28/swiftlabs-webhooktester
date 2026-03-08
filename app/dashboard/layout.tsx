import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowRightOnRectangleIcon, PlusIcon } from '@heroicons/react/24/outline';
import { ManageSubscriptionButton } from '@/components/manage-subscription-button';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  // Check subscription status
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  const isPro = subscription?.plan === 'pro';

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Top Navigation */}
      <nav className="border-b border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex items-center gap-2">
                <span className="text-lg font-semibold text-white">Webhook Tester</span>
              </Link>
              <div className="hidden md:flex md:gap-4">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-neutral-300 hover:text-white"
                >
                  Endpoints
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isPro ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">PRO</span>
                  <ManageSubscriptionButton />
                </div>
              ) : (
                <Link
                  href="/pricing"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium text-white"
                >
                  Upgrade to Pro
                </Link>
              )}
              <Link
                href="/dashboard/new"
                className="flex items-center gap-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 px-4 py-2 text-sm font-medium text-white"
              >
                <PlusIcon className="h-4 w-4" />
                <span>New Endpoint</span>
              </Link>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <span>{user.email}</span>
              </div>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  title="Sign out"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
