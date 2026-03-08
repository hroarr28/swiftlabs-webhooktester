import { Metadata } from 'next';
import Link from 'next/link';
import { CheckoutButton } from '@/components/checkout-button';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Pricing | Webhook Tester',
  description: 'Simple, transparent pricing for webhook testing',
};

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If not logged in, show login CTA
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <nav className="border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">Webhook Tester</Link>
            <Link href="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              Sign in
            </Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Simple pricing</h1>
            <p className="text-xl text-neutral-400">Start free, upgrade when you need more</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PlanCard
              name="Free"
              price="£0"
              features={[
                '3 webhook endpoints',
                '7 days request history',
                '1,000 requests/month',
                'Basic request inspection',
                'Email support',
              ]}
              cta={
                <Link href="/signup" className="block w-full text-center py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors font-medium">
                  Get started
                </Link>
              }
            />

            <PlanCard
              name="Pro"
              price="£8"
              period="/month"
              features={[
                'Unlimited endpoints',
                '30 days request history',
                '100,000 requests/month',
                'Request forwarding',
                'Custom domains',
                'Priority support',
              ]}
              highlight
              cta={
                <Link href="/signup" className="block w-full text-center py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium">
                  Start free trial
                </Link>
              }
            />
          </div>
        </div>
      </div>
    );
  }

  // If logged in, show checkout
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <nav className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">Webhook Tester</Link>
          <Link href="/dashboard" className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors">
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Upgrade to Pro</h1>
          <p className="text-xl text-neutral-400">Unlock unlimited endpoints and advanced features</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PlanCard
            name="Free"
            price="£0"
            features={[
              '3 webhook endpoints',
              '7 days request history',
              '1,000 requests/month',
              'Basic request inspection',
              'Email support',
            ]}
            cta={
              <div className="w-full text-center py-3 bg-neutral-700 rounded-lg font-medium text-neutral-400 cursor-not-allowed">
                Current plan
              </div>
            }
          />

          <PlanCard
            name="Pro"
            price="£8"
            period="/month"
            features={[
              'Unlimited endpoints',
              '30 days request history',
              '100,000 requests/month',
              'Request forwarding',
              'Custom domains',
              'Priority support',
            ]}
            highlight
            cta={<CheckoutButton />}
          />
        </div>
      </div>
    </div>
  );
}

function PlanCard({
  name,
  price,
  period,
  features,
  cta,
  highlight = false,
}: {
  name: string;
  price: string;
  period?: string;
  features: string[];
  cta: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg p-8 ${highlight ? 'bg-neutral-900 border-2 border-blue-600' : 'bg-neutral-900 border border-neutral-800'}`}>
      {highlight && (
        <div className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-4">Most popular</div>
      )}
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        {period && <span className="text-neutral-400">{period}</span>}
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-neutral-300">{feature}</span>
          </li>
        ))}
      </ul>
      {cta}
    </div>
  );
}
