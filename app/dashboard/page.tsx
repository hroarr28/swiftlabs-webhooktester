import Link from 'next/link';
import { getEndpoints } from '@/lib/actions/endpoints';
import { PlusIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { CopyButton } from '@/components/copy-button';

export const metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const { endpoints, error } = await getEndpoints();

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          Failed to load endpoints: {error}
        </div>
      </div>
    );
  }

  const hasEndpoints = endpoints && endpoints.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Your Webhook Endpoints
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            {hasEndpoints
              ? `${endpoints.length} endpoint${endpoints.length === 1 ? '' : 's'} configured`
              : 'Create your first webhook endpoint to get started'}
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          <span>New Endpoint</span>
        </Link>
      </div>

      {/* Empty State */}
      {!hasEndpoints && (
        <div className="mt-12 rounded-xl border-2 border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950">
            <ClipboardDocumentIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
            No webhook endpoints yet
          </h3>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Create your first endpoint to start receiving and testing webhooks.
          </p>
          <Link
            href="/dashboard/new"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Create Endpoint</span>
          </Link>
        </div>
      )}

      {/* Endpoints List */}
      {hasEndpoints && (
        <div className="mt-8 space-y-4">
          {endpoints.map((endpoint) => (
            <Link
              key={endpoint.id}
              href={`/dashboard/endpoints/${endpoint.id}`}
              className="block rounded-lg border border-zinc-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                      {endpoint.name}
                    </h3>
                    {endpoint.is_active ? (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-950 dark:text-green-200">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        Inactive
                      </span>
                    )}
                  </div>
                  {endpoint.description && (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {endpoint.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-2">
                    <code className="flex-1 rounded bg-zinc-100 px-3 py-2 text-sm font-mono text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                      {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/w/
                      {endpoint.slug}
                    </code>
                    <CopyButton
                      text={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/w/${endpoint.slug}`}
                    />
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    Created {new Date(endpoint.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Upgrade CTA (if free plan with 3 endpoints) */}
      {hasEndpoints && endpoints.length >= 3 && (
        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">
            Reached free plan limit
          </h3>
          <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
            Upgrade to Pro for unlimited endpoints, 30-day history, and custom domains.
          </p>
          <Link
            href="/pricing"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Upgrade to Pro
          </Link>
        </div>
      )}
    </div>
  );
}
