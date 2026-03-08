import { NewEndpointForm } from '@/components/new-endpoint-form';

export const metadata = {
  title: 'New Endpoint',
};

export default function NewEndpointPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Create Webhook Endpoint
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Set up a new endpoint to start receiving webhooks.
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <NewEndpointForm />
      </div>

      {/* Quick Guide */}
      <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100">
          What happens next?
        </h3>
        <ol className="mt-3 space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li className="flex items-start gap-2">
            <span className="font-semibold">1.</span>
            <span>You'll get a unique webhook URL</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold">2.</span>
            <span>Configure it in your webhook provider (Stripe, GitHub, etc.)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold">3.</span>
            <span>Watch requests arrive in real-time</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold">4.</span>
            <span>
              Optionally set up forwarding to send webhooks to your local development server
            </span>
          </li>
        </ol>
      </div>
    </div>
  );
}
