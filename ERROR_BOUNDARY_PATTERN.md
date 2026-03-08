# Error Boundary Pattern

Graceful error handling with fallback UIs for better user experience.

## What's Included

### 1. React Error Boundary Component
`components/error-boundary.tsx`

Reusable error boundary with:
- Default fallback UI
- Compact fallback for small components
- Page-level fallback
- Error logging
- Development error details
- Production error tracking hooks

### 2. Next.js Error Pages
`app/error.tsx` - Catches errors in routes
`app/global-error.tsx` - Catches errors in root layout

## Quick Start

### Wrap Components

```tsx
import { ErrorBoundary } from '@/components/error-boundary'

export default function Page() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  )
}
```

### Custom Fallback

```tsx
<ErrorBoundary
  fallback={
    <div>
      <h2>Something went wrong</h2>
      <button onClick={() => window.location.reload()}>Reload</button>
    </div>
  }
>
  <YourComponent />
</ErrorBoundary>
```

### Error Callback

```tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    console.error('Caught error:', error)
    // Send to error tracking service
  }}
>
  <YourComponent />
</ErrorBoundary>
```

## When to Use Error Boundaries

### ✅ Good Use Cases

1. **Third-party components** - Unstable libraries
2. **Complex features** - User-generated content rendering
3. **External data** - API responses with unknown structure
4. **Experimental features** - New functionality being tested
5. **Route segments** - Isolate errors to specific pages

### ❌ Don't Use For

1. **Event handlers** - Use try/catch instead
2. **Async code** - Use .catch() or async/await with try/catch
3. **Server-side rendering** - Use error.tsx in Next.js
4. **Error boundaries themselves** - Infinite loop risk

## Error Boundary Levels

### 1. Component Level (Smallest Scope)

```tsx
import { ErrorBoundary, CompactErrorFallback } from '@/components/error-boundary'

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* If chart fails, only this section breaks */}
      <ErrorBoundary fallback={<CompactErrorFallback />}>
        <Chart data={data} />
      </ErrorBoundary>
      
      {/* Table still works even if chart fails */}
      <ErrorBoundary fallback={<CompactErrorFallback />}>
        <Table data={data} />
      </ErrorBoundary>
    </div>
  )
}
```

### 2. Feature Level (Medium Scope)

```tsx
function Profile() {
  return (
    <ErrorBoundary>
      <ProfileHeader />
      <ProfileStats />
      <ProfileActivity />
    </ErrorBoundary>
  )
}
```

### 3. Page Level (Large Scope)

```tsx
// app/dashboard/page.tsx
import { ErrorBoundary, PageErrorFallback } from '@/components/error-boundary'

export default function DashboardPage() {
  return (
    <ErrorBoundary fallback={<PageErrorFallback />}>
      <Dashboard />
    </ErrorBoundary>
  )
}
```

### 4. Route Level (Next.js)

```tsx
// app/dashboard/error.tsx
'use client'

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Dashboard Error</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

## Common Patterns

### Retry Logic

```tsx
'use client'

import { ErrorBoundary } from '@/components/error-boundary'
import { useState } from 'react'

function DataFetcher() {
  const [key, setKey] = useState(0)
  
  return (
    <ErrorBoundary
      key={key} // Remount on key change
      fallback={
        <div>
          <p>Failed to load data</p>
          <button onClick={() => setKey(k => k + 1)}>Retry</button>
        </div>
      }
    >
      <DataComponent />
    </ErrorBoundary>
  )
}
```

### Multiple Fallbacks

```tsx
function App() {
  return (
    <ErrorBoundary fallback={<PageErrorFallback />}>
      <Layout>
        <ErrorBoundary fallback={<CompactErrorFallback />}>
          <Sidebar />
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<CompactErrorFallback />}>
          <Content />
        </ErrorBoundary>
      </Layout>
    </ErrorBoundary>
  )
}
```

### Conditional Error Boundaries

```tsx
function Feature({ isExperimental }) {
  if (isExperimental) {
    return (
      <ErrorBoundary>
        <ExperimentalFeature />
      </ErrorBoundary>
    )
  }
  
  return <StableFeature />
}
```

## Error Tracking Integration

### Sentry

```bash
npm install @sentry/nextjs
```

```tsx
// components/error-boundary.tsx
import * as Sentry from '@sentry/nextjs'

export class ErrorBoundary extends Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      })
    }
  }
}
```

### Custom Error Service

```tsx
// lib/error-tracking.ts
export function trackError(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/errors', {
      method: 'POST',
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
      }),
    })
  }
}

// Use in error boundary
componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  trackError(error, { componentStack: errorInfo.componentStack })
}
```

## Next.js Error Handling

### Route-Level Errors

```tsx
// app/dashboard/error.tsx
'use client'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Dashboard Error</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### Nested Errors

```tsx
// app/error.tsx - catches app-level errors
// app/dashboard/error.tsx - catches dashboard errors
// app/dashboard/settings/error.tsx - catches settings errors

// Most specific error boundary wins
```

### Loading States vs Error States

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <Skeleton />
}

// app/dashboard/error.tsx
export default function Error({ error, reset }) {
  return <ErrorFallback error={error} reset={reset} />
}

// app/dashboard/page.tsx
export default async function Page() {
  const data = await fetchData() // Suspense + Error boundary handle this
  return <Dashboard data={data} />
}
```

## Testing Error Boundaries

### Trigger Errors in Development

```tsx
function BuggyComponent() {
  const [shouldThrow, setShouldThrow] = useState(false)
  
  if (shouldThrow) {
    throw new Error('Test error!')
  }
  
  return <button onClick={() => setShouldThrow(true)}>Break me</button>
}

// Wrap in error boundary to test
<ErrorBoundary>
  <BuggyComponent />
</ErrorBoundary>
```

### Jest Tests

```tsx
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from './error-boundary'

function ThrowError() {
  throw new Error('Test error')
}

test('renders fallback on error', () => {
  // Suppress error output
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  
  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  )
  
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  
  spy.mockRestore()
})
```

## Best Practices

### 1. Granular Boundaries

❌ **Bad:** One boundary for entire app
```tsx
<ErrorBoundary>
  <EntireApp />
</ErrorBoundary>
```

✅ **Good:** Multiple boundaries for isolation
```tsx
<ErrorBoundary>
  <Header />
</ErrorBoundary>

<ErrorBoundary>
  <Sidebar />
</ErrorBoundary>

<ErrorBoundary>
  <Content />
</ErrorBoundary>
```

### 2. Provide Recovery Options

❌ **Bad:** Dead end
```tsx
<div>Error occurred. Refresh the page.</div>
```

✅ **Good:** Actionable fallback
```tsx
<div>
  <p>Failed to load data</p>
  <button onClick={retry}>Retry</button>
  <button onClick={() => router.push('/dashboard')}>Go to dashboard</button>
</div>
```

### 3. Show Helpful Messages

❌ **Bad:** Generic message
```tsx
<p>An error occurred</p>
```

✅ **Good:** Context-aware message
```tsx
<p>Failed to load your projects. This might be a network issue.</p>
```

### 4. Log Errors

```tsx
componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  // Always log
  console.error('Error caught:', error, errorInfo)
  
  // Track in production
  if (process.env.NODE_ENV === 'production') {
    trackError(error, { componentStack: errorInfo.componentStack })
  }
  
  // Call optional handler
  this.props.onError?.(error, errorInfo)
}
```

### 5. Different Fallbacks for Different Contexts

```tsx
// Full-page error
<ErrorBoundary fallback={<PageErrorFallback />}>
  <Page />
</ErrorBoundary>

// Inline error
<ErrorBoundary fallback={<CompactErrorFallback />}>
  <Widget />
</ErrorBoundary>

// Custom error for critical feature
<ErrorBoundary fallback={<PaymentErrorFallback />}>
  <Checkout />
</ErrorBoundary>
```

## Real-World Examples

### Dashboard with Isolated Widgets

```tsx
function Dashboard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ErrorBoundary fallback={<WidgetError />}>
        <RevenueChart />
      </ErrorBoundary>
      
      <ErrorBoundary fallback={<WidgetError />}>
        <UserStats />
      </ErrorBoundary>
      
      <ErrorBoundary fallback={<WidgetError />}>
        <RecentActivity />
      </ErrorBoundary>
      
      <ErrorBoundary fallback={<WidgetError />}>
        <TopProducts />
      </ErrorBoundary>
    </div>
  )
}

function WidgetError() {
  return (
    <div className="border rounded p-4 text-center">
      <p className="text-sm text-muted-foreground">
        Failed to load widget
      </p>
    </div>
  )
}
```

### Form with Error Recovery

```tsx
function ContactForm() {
  const [formKey, setFormKey] = useState(0)
  
  return (
    <ErrorBoundary
      key={formKey}
      fallback={
        <div>
          <p>Form error occurred</p>
          <button onClick={() => setFormKey(k => k + 1)}>
            Reset form
          </button>
        </div>
      }
    >
      <FormContent />
    </ErrorBoundary>
  )
}
```

### Third-Party Widget

```tsx
function App() {
  return (
    <div>
      <MainContent />
      
      {/* Isolate potentially buggy third-party code */}
      <ErrorBoundary
        fallback={<div>Chat widget unavailable</div>}
        onError={(error) => {
          console.warn('Chat widget failed:', error)
          // Continue without chat
        }}
      >
        <ThirdPartyChatWidget />
      </ErrorBoundary>
    </div>
  )
}
```

## Debugging Tips

### 1. Check React DevTools

Error boundaries show up in component tree with "Error" state.

### 2. Use Error Digest

Next.js provides `error.digest` in production for tracking:

```tsx
export default function Error({ error }) {
  return (
    <div>
      <p>Error ID: {error.digest}</p>
      <p>Quote this ID when contacting support</p>
    </div>
  )
}
```

### 3. Development vs Production

```tsx
{process.env.NODE_ENV === 'development' && (
  <details>
    <summary>Error details</summary>
    <pre>{error.stack}</pre>
  </details>
)}
```

## Common Errors and Solutions

### "Error boundaries must be class components"

✅ Use class component or Next.js error.tsx

```tsx
// Class component
export class ErrorBoundary extends Component { }

// Or use Next.js error.tsx (can be function component)
export default function Error({ error, reset }) { }
```

### "Error boundary not catching errors"

Check:
1. Error is in render phase (not event handler)
2. Component is child of error boundary
3. Error boundary is client component ('use client')

### "Infinite error loop"

Don't throw errors in error boundary's fallback UI:

```tsx
// ❌ Bad
function Fallback() {
  throw new Error('Oops') // Infinite loop!
}

// ✅ Good
function Fallback() {
  return <div>Error occurred</div>
}
```

## Resources

- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [Sentry React](https://docs.sentry.io/platforms/javascript/guides/react/)
