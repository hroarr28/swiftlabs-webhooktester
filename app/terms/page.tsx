import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Webhook Tester',
  description: 'Terms and conditions for using Webhook Tester',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <nav className="border-b border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-xl font-bold">Webhook Tester</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-invert prose-neutral max-w-none">
          <p className="text-neutral-400 mb-6">Last updated: March 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-neutral-300 mb-4">
              By accessing and using Webhook Tester ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, you should not use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Use of Service</h2>
            <p className="text-neutral-300 mb-4">
              You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc pl-6 text-neutral-300 space-y-2">
              <li>Use the Service in any way that violates any applicable national or international law or regulation</li>
              <li>Transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
              <li>Impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
              <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
              <li>Use the Service to send spam, malicious code, or any form of harmful content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Accounts</h2>
            <p className="text-neutral-300 mb-4">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
            </p>
            <p className="text-neutral-300 mb-4">
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Subscriptions and Billing</h2>
            <p className="text-neutral-300 mb-4">
              Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis (monthly). Billing cycles are set on a monthly basis.
            </p>
            <p className="text-neutral-300 mb-4">
              A valid payment method is required to process the payment for your subscription. You shall provide accurate and complete billing information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Free Plan Limitations</h2>
            <p className="text-neutral-300 mb-4">
              Free plan users are limited to:
            </p>
            <ul className="list-disc pl-6 text-neutral-300 space-y-2">
              <li>3 webhook endpoints</li>
              <li>1,000 requests per month</li>
              <li>7 days of request history</li>
            </ul>
            <p className="text-neutral-300 mb-4 mt-4">
              Exceeding these limits may result in service interruption until the next billing cycle or upgrade to a paid plan.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
            <p className="text-neutral-300 mb-4">
              Webhook request data is retained according to your plan:
            </p>
            <ul className="list-disc pl-6 text-neutral-300 space-y-2">
              <li>Free plan: 7 days</li>
              <li>Pro plan: 30 days</li>
            </ul>
            <p className="text-neutral-300 mb-4 mt-4">
              After this period, data is automatically deleted and cannot be recovered.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
            <p className="text-neutral-300 mb-4">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p className="text-neutral-300 mb-4">
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className="text-neutral-300 mb-4">
              In no event shall Webhook Tester, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
            <p className="text-neutral-300 mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any material changes by posting the new Terms on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact</h2>
            <p className="text-neutral-300">
              If you have any questions about these Terms, please contact us at:{' '}
              <a href="mailto:hello@swiftlabs.dev" className="text-blue-500 hover:text-blue-400">
                hello@swiftlabs.dev
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
