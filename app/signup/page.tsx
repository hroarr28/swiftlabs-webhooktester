import { Metadata } from 'next';
import Link from 'next/link';
import { SignupForm } from '@/components/signup-form';

export const metadata: Metadata = {
  title: 'Sign Up | Webhook Tester',
  description: 'Create your Webhook Tester account',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-2xl font-bold text-white">Webhook Tester</h1>
          </Link>
          <h2 className="text-xl font-semibold text-white mb-2">Create account</h2>
          <p className="text-neutral-400">Start testing webhooks in seconds</p>
        </div>

        <div className="bg-neutral-900 rounded-lg p-8 border border-neutral-800">
          <SignupForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-400">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-500 hover:text-blue-400 font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-neutral-500">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-neutral-400 hover:text-neutral-300 underline">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-neutral-400 hover:text-neutral-300 underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
