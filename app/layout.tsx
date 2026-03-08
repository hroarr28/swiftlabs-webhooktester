import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Webhook Tester — Test and debug webhooks instantly',
    template: '%s | Webhook Tester',
  },
  description:
    'Receive, inspect, and debug webhooks in real-time. Request forwarding, 30-day history, custom domains. Perfect for testing Stripe, GitHub, and any webhook integration.',
  keywords: [
    'webhook tester',
    'webhook debugging',
    'webhook inspector',
    'test webhooks',
    'webhook forwarding',
    'stripe webhook test',
    'github webhook test',
  ],
  authors: [{ name: 'SwiftLabs' }],
  creator: 'SwiftLabs',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://webhooktester.swiftlabs.dev',
    title: 'Webhook Tester — Test and debug webhooks instantly',
    description:
      'Receive, inspect, and debug webhooks in real-time. Request forwarding, 30-day history, custom domains.',
    siteName: 'Webhook Tester',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Webhook Tester — Test and debug webhooks instantly',
    description:
      'Receive, inspect, and debug webhooks in real-time. Request forwarding, 30-day history, custom domains.',
    creator: '@swiftlabs',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
