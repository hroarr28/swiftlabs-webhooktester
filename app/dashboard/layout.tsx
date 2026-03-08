import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowRightOnRectangleIcon, PlusIcon } from '@heroicons/react/24/outline';

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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Top Navigation */}
      <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500" />
                <span className="text-lg font-semibold">Webhook Tester</span>
              </Link>
              <div className="hidden md:flex md:gap-4">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                >
                  Endpoints
                </Link>
                <Link
                  href="/dashboard/docs"
                  className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                >
                  Docs
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/new"
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4" />
                <span>New Endpoint</span>
              </Link>
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <span>{user.email}</span>
              </div>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
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
