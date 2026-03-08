import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Webhook Tester',
  description: 'Privacy policy for Webhook Tester',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <nav className="border-b border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-xl font-bold">Webhook Tester</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-invert prose-neutral max-w-none">
          <p className="text-neutral-400 mb-6">Last updated: March 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-neutral-300 mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-neutral-300 space-y-2">
              <li>Email address (for account creation and authentication)</li>
              <li>Webhook endpoint data (URLs, names, descriptions)</li>
              <li>Incoming webhook requests (headers, body, metadata)</li>
              <li>Payment information (processed securely through Stripe)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="text-neutral-300 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-neutral-300 space-y-2">
              <li>Provide, maintain, and improve the Service</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyse trends, usage, and activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Data Storage and Security</h2>
            <p className="text-neutral-300 mb-4">
              Your data is stored securely using industry-standard practices:
            </p>
            <ul className="list-disc pl-6 text-neutral-300 space-y-2">
              <li>All data is encrypted in transit using HTTPS/TLS</li>
              <li>Database access is restricted and authenticated</li>
              <li>We use Supabase for secure data storage (EU region)</li>
              <li>Payment processing is handled by Stripe (PCI DSS compliant)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Retention</h2>
            <p className="text-neutral-300 mb-4">
              Webhook request data is automatically deleted based on your plan:
            </p>
            <ul className="list-disc pl-6 text-neutral-300 space-y-2">
              <li>Free plan: 7 days</li>
              <li>Pro plan: 30 days</li>
            </ul>
            <p className="text-neutral-300 mb-4 mt-4">
              Account data (email, endpoints) is retained until you delete your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Sharing</h2>
            <p className="text-neutral-300 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-neutral-300 space-y-2">
              <li>With service providers who help us operate the Service (Supabase, Stripe, Vercel)</li>
              <li>To comply with legal obligations or respond to lawful requests</li>
              <li>To protect our rights, privacy, safety, or property</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
            <p className="text-neutral-300 mb-4">
              We use essential cookies to maintain your session and provide the Service. We do not use third-party tracking or analytics cookies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p className="text-neutral-300 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-neutral-300 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Export your data</li>
              <li>Withdraw consent for data processing</li>
            </ul>
            <p className="text-neutral-300 mb-4 mt-4">
              To exercise these rights, contact us at{' '}
              <a href="mailto:hello@swiftlabs.dev" className="text-blue-500 hover:text-blue-400">
                hello@swiftlabs.dev
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. GDPR Compliance</h2>
            <p className="text-neutral-300 mb-4">
              If you are in the European Economic Area (EEA), you have certain data protection rights under GDPR. We process your data on the following legal bases:
            </p>
            <ul className="list-disc pl-6 text-neutral-300 space-y-2">
              <li>Contract performance (to provide the Service)</li>
              <li>Legitimate interests (to improve and secure the Service)</li>
              <li>Legal compliance (to meet regulatory requirements)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
            <p className="text-neutral-300 mb-4">
              Our Service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
            <p className="text-neutral-300 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
            <p className="text-neutral-300">
              If you have any questions about this Privacy Policy, please contact us at:{' '}
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
