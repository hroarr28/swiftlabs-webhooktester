import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/24/outline';

export const metadata = {
  title: 'Webhook Tester — Test, inspect, and debug webhooks instantly',
  description:
    'Receive webhooks, inspect requests, replay payloads, and forward to localhost. Real-time testing, 30-day history, custom domains. Free tier available.',
  openGraph: {
    title: 'Webhook Tester — Test, inspect, and debug webhooks instantly',
    description:
      'Receive webhooks, inspect requests, replay payloads, and forward to localhost. Real-time testing, 30-day history, custom domains. Free tier available.',
    url: 'https://webhooktester.swiftlabs.dev',
    siteName: 'Webhook Tester',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Webhook Tester — Test, inspect, and debug webhooks instantly',
    description:
      'Receive webhooks, inspect requests, replay payloads, and forward to localhost.',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      {/* Navigation */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500" />
              <span className="text-lg font-semibold">Webhook Tester</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
            Test webhooks without
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              the headache
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Instant webhook URLs. Real-time inspection. Request forwarding to localhost.
            Debug Stripe, GitHub, Twilio webhooks and more — without deploying a thing.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
            >
              Start Testing Free
            </Link>
            <Link
              href="#features"
              className="rounded-lg border border-zinc-300 px-6 py-3 text-base font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
            >
              See How It Works
            </Link>
          </div>
          <p className="mt-4 text-sm text-zinc-500">
            Free tier: 3 endpoints, 7-day history • Pro: £8/month
          </p>
        </div>

        {/* Demo Screenshot */}
        <div className="mt-16 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
          </div>
          <div className="p-8">
            <div className="space-y-4 text-left font-mono text-sm">
              <div className="text-zinc-600 dark:text-zinc-400">
                <span className="text-blue-600 dark:text-blue-400">POST</span> https://webhooktester.swiftlabs.dev/api/w/abc123xyz
              </div>
              <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
                <pre className="text-zinc-900 dark:text-zinc-100">
                  {JSON.stringify(
                    {
                      event: 'payment.success',
                      amount: 2500,
                      customer_id: 'cus_123',
                      timestamp: '2026-03-08T05:48:00Z',
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckIcon className="h-5 w-5" />
                <span>Request captured • Forwarded to localhost:3000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Everything you need to debug webhooks
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            No more ngrok tunnels. No more blind debugging. See exactly what's being sent.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: 'Instant Endpoints',
              description:
                'Generate webhook URLs in seconds. No configuration. Copy, paste, test.',
              icon: '⚡',
            },
            {
              name: 'Real-Time Inspection',
              description:
                'See every header, query param, and body field the moment it arrives.',
              icon: '🔍',
            },
            {
              name: 'Request Forwarding',
              description:
                'Forward webhooks to localhost or staging. Test integrations locally.',
              icon: '🔄',
            },
            {
              name: '30-Day History',
              description:
                'Pro plan keeps all requests for 30 days. Never lose critical debugging data.',
              icon: '📅',
            },
            {
              name: 'Filter & Search',
              description:
                'Filter by HTTP method, timestamp, headers. Find what you need instantly.',
              icon: '🎯',
            },
            {
              name: 'Custom Domains',
              description:
                'Pro users can use branded webhook URLs: webhooks.yourcompany.com',
              icon: '🌐',
            },
          ].map((feature) => (
            <div
              key={feature.name}
              className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="text-4xl">{feature.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
                {feature.name}
              </h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="border-y border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Perfect for developers who work with
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {['Stripe', 'GitHub', 'Twilio', 'Shopify', 'Slack', 'SendGrid', 'Mailgun', 'PayPal'].map(
              (service) => (
                <div
                  key={service}
                  className="rounded-lg border border-zinc-200 bg-white p-4 text-center font-medium text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                >
                  {service}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Simple, honest pricing
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Free Plan */}
          <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Free</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Perfect for side projects and testing
            </p>
            <div className="mt-6">
              <span className="text-4xl font-bold text-zinc-900 dark:text-white">£0</span>
              <span className="text-zinc-600 dark:text-zinc-400">/month</span>
            </div>
            <ul className="mt-8 space-y-4">
              {[
                '3 webhook endpoints',
                'Unlimited requests',
                '7-day request history',
                'Request filtering',
                'Basic forwarding',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <CheckIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-zinc-900 dark:text-white">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard"
              className="mt-8 block w-full rounded-lg border border-zinc-300 bg-white py-3 text-center font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
            >
              Start Free
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="rounded-xl border-2 border-blue-600 bg-white p-8 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Pro</h3>
              <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white">
                Popular
              </span>
            </div>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              For teams and production apps
            </p>
            <div className="mt-6">
              <span className="text-4xl font-bold text-zinc-900 dark:text-white">£8</span>
              <span className="text-zinc-600 dark:text-zinc-400">/month</span>
            </div>
            <ul className="mt-8 space-y-4">
              {[
                'Unlimited endpoints',
                'Unlimited requests',
                '30-day request history',
                'Advanced filtering',
                'Custom domains',
                'Request forwarding rules',
                'Priority support',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <CheckIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-zinc-900 dark:text-white">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard"
              className="mt-8 block w-full rounded-lg bg-blue-600 py-3 text-center font-medium text-white hover:bg-blue-700"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Frequently asked questions
            </h2>
          </div>

          <dl className="mt-12 space-y-8">
            {[
              {
                q: 'How does request forwarding work?',
                a: 'Set a target URL (like http://localhost:3000/webhook) and we\'ll forward all incoming requests in real-time. Perfect for testing webhooks against your local development server.',
              },
              {
                q: 'Can I use this for production webhooks?',
                a: 'Absolutely. Pro plan includes 30-day history, custom domains, and advanced filtering — perfect for production monitoring and debugging.',
              },
              {
                q: 'What happens to old requests?',
                a: 'Free plan keeps requests for 7 days. Pro plan keeps them for 30 days. After that, they\'re automatically deleted.',
              },
              {
                q: 'Do you support custom domains?',
                a: 'Yes! Pro users can configure custom domains (webhooks.yourcompany.com) for branded webhook URLs.',
              },
              {
                q: 'Is there a request limit?',
                a: 'No. Both free and pro plans support unlimited webhook requests.',
              },
            ].map((faq) => (
              <div key={faq.q}>
                <dt className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {faq.q}
                </dt>
                <dd className="mt-2 text-zinc-600 dark:text-zinc-400">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 p-12 text-center">
          <h2 className="text-3xl font-bold text-white">
            Stop debugging webhooks blindly
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Create your first webhook endpoint in 30 seconds. No credit card required.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-medium text-blue-600 hover:bg-blue-50"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              © 2026 SwiftLabs. Built for developers who ship.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/terms"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
