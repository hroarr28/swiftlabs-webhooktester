import { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/login-form';

export const metadata: Metadata = {
  title: 'Login | Webhook Tester',
  description: 'Sign in to your Webhook Tester account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-2xl font-bold text-white">Webhook Tester</h1>
          </Link>
          <h2 className="text-xl font-semibold text-white mb-2">Welcome back</h2>
          <p className="text-neutral-400">Sign in to your account</p>
        </div>

        <div className="bg-neutral-900 rounded-lg p-8 border border-neutral-800">
          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-blue-500 hover:text-blue-400 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
