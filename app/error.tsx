'use client'

/**
 * Next.js Error Boundary
 * 
 * Catches errors in the app and displays a fallback UI.
 * This file is automatically used by Next.js App Router.
 * 
 * Docs: https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */

import { useEffect } from 'react'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console
    console.error('Error boundary caught:', error)

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry
      // Sentry.captureException(error)
    }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-lg w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold">Something went wrong</h1>
          <p className="text-lg text-muted-foreground">
            We're sorry, but something unexpected happened.
          </p>
          {error.digest && (
            <p className="text-sm text-muted-foreground font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="text-left">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
              Error details (development only)
            </summary>
            <div className="mt-2 space-y-2">
              <div className="text-xs bg-muted p-4 rounded-lg">
                <div className="font-semibold mb-1">Message:</div>
                <div className="text-destructive">{error.message}</div>
              </div>
              {error.stack && (
                <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-60">
                  {error.stack}
                </pre>
              )}
            </div>
          </details>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={reset}
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="inline-flex items-center px-6 py-3 border border-gray-300 bg-white text-black rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Go home
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  )
}
