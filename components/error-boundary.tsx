'use client'

/**
 * React Error Boundary
 * 
 * Catches JavaScript errors in the component tree and displays a fallback UI.
 * 
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */

import React, { Component, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console
    console.error('Error boundary caught error:', error, errorInfo)

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, Rollbar
      // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } })
    }
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return <DefaultErrorFallback error={this.state.error} reset={() => this.setState({ hasError: false, error: null })} />
    }

    return this.props.children
  }
}

/**
 * Default fallback UI
 */
function DefaultErrorFallback({ error, reset }: { error: Error | null; reset: () => void }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="text-muted-foreground">
            We're sorry, but something unexpected happened. Please try again.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="text-left">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
              Error details (dev only)
            </summary>
            <pre className="mt-2 text-xs bg-muted p-4 rounded-lg overflow-auto max-h-40">
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 border border-gray-300 bg-white text-black rounded-md hover:bg-gray-50 transition-colors"
          >
            Reload page
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Compact error fallback for smaller components
 */
export function CompactErrorFallback({ error, reset }: { error: Error | null; reset: () => void }) {
  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium">Failed to load this section</p>
          {process.env.NODE_ENV === 'development' && error && (
            <p className="text-xs text-muted-foreground">{error.message}</p>
          )}
          <button
            onClick={reset}
            className="px-3 py-1.5 text-sm border border-gray-300 bg-white text-black rounded-md hover:bg-gray-50 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Page-level error fallback
 */
export function PageErrorFallback({ error, reset }: { error: Error | null; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold">Oops!</h1>
          <h2 className="text-xl text-muted-foreground">
            We encountered an unexpected error
          </h2>
          <p className="text-sm text-muted-foreground">
            Don't worry, our team has been notified and we're working on a fix.
            In the meantime, you can try refreshing the page or going back home.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="text-left">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
              Error details (dev only)
            </summary>
            <pre className="mt-2 text-xs bg-muted p-4 rounded-lg overflow-auto max-h-60">
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={reset}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 border border-gray-300 bg-white text-black rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reload page
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="px-6 py-3 bg-transparent text-black rounded-lg hover:bg-gray-100 transition-colors"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  )
}
