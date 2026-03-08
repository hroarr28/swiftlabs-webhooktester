'use client'

/**
 * Global Error Boundary
 * 
 * Catches errors in the root layout (layout.tsx).
 * Only used when error occurs in the root layout itself.
 * 
 * Note: Must include <html> and <body> tags.
 * Docs: https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-errors-in-root-layouts
 */

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error boundary caught:', error)

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error)
    }
  }, [error])

  return (
    <html>
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div style={{ maxWidth: '32rem', textAlign: 'center' }}>
            <div
              style={{
                fontSize: '4rem',
                marginBottom: '1rem',
              }}
            >
              ⚠️
            </div>

            <h1
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
              }}
            >
              Critical Error
            </h1>

            <p style={{ color: '#666', marginBottom: '2rem' }}>
              A critical error occurred. Please refresh the page or contact support if this
              persists.
            </p>

            {error.digest && (
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#666',
                  fontFamily: 'monospace',
                  marginBottom: '2rem',
                }}
              >
                Error ID: {error.digest}
              </p>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={reset}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Try again
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f5f5f5',
                  color: '#000',
                  border: '1px solid #ddd',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Reload page
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details style={{ marginTop: '2rem', textAlign: 'left' }}>
                <summary
                  style={{
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    color: '#666',
                  }}
                >
                  Error details (development only)
                </summary>
                <pre
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.75rem',
                    backgroundColor: '#f5f5f5',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    overflow: 'auto',
                    maxHeight: '15rem',
                  }}
                >
                  {error.message}
                  {'\n\n'}
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
