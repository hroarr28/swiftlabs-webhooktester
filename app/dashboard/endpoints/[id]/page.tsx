import { notFound, redirect } from 'next/navigation';
import { getEndpoint } from '@/lib/actions/endpoints';
import { getRequests, getRequestStats } from '@/lib/actions/requests';
import { getForwardingRules, getUserSubscription } from '@/lib/actions/forwarding';
import { CopyButton } from '@/components/copy-button';
import { RequestsList } from '@/components/requests-list';
import { EndpointSettings } from '@/components/endpoint-settings';
import { ForwardingRulesWrapper } from '@/components/forwarding-rules-wrapper';
import { getEndpointUrl } from '@/lib/utils/endpoints';

export const metadata = {
  title: 'Endpoint Details',
};

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function EndpointDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const search = await searchParams;
  const methodFilter = search.method;

  const { endpoint, error } = await getEndpoint(id);

  if (error || !endpoint) {
    notFound();
  }

  const endpointUrl = getEndpointUrl(endpoint.slug);

  // Get requests for this endpoint
  const { requests = [], total = 0 } = await getRequests({
    endpointId: endpoint.id,
    method: methodFilter,
    limit: 50,
  });

  // Get stats
  const { stats } = await getRequestStats(endpoint.id);

  // Get forwarding rules and subscription
  const { rules = [] } = await getForwardingRules(endpoint.id);
  const { subscription } = await getUserSubscription();
  const isPro = subscription?.plan === 'pro';

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                {endpoint.name}
              </h1>
              {endpoint.is_active ? (
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-950 dark:text-green-200">
                  Active
                </span>
              ) : (
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  Inactive
                </span>
              )}
            </div>
            {endpoint.description && (
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">{endpoint.description}</p>
            )}
          </div>
          <EndpointSettings endpoint={endpoint} />
        </div>

        {/* Webhook URL */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Webhook URL
          </label>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 rounded-lg border border-zinc-300 bg-zinc-100 px-4 py-3 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
              {endpointUrl}
            </code>
            <CopyButton text={endpointUrl} />
          </div>
          <p className="mt-2 text-sm text-zinc-500">
            Use this URL in your webhook provider (Stripe, GitHub, etc.)
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Requests</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                {stats.total.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Last 24 Hours</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                {stats.recentCount24h.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Avg Size</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                {(stats.avgSizeBytes / 1024).toFixed(1)} KB
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Methods</p>
              <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-white">
                {Object.keys(stats.methods).join(', ')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Forwarding Rules */}
      <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <ForwardingRulesWrapper
          endpointId={endpoint.id}
          initialRules={rules}
          isPro={isPro}
        />
      </div>

      {/* Requests List */}
      <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Recent Requests
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {total} total request{total === 1 ? '' : 's'}
          </p>
        </div>
        <RequestsList requests={requests} endpointId={endpoint.id} />
      </div>
    </div>
  );
}
