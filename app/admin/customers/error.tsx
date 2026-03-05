'use client'

import { useEffect } from 'react'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CustomersError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[v0] Customers Error:', error)
  }, [error])

  return (
    <div className="flex-1 p-8">
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-red-100 p-2 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold">Failed to Load Customers</h1>
        </div>

        <p className="text-muted-foreground mb-4">
          {error.message || 'There was an error loading the customers. Please try again.'}
        </p>

        <div className="flex gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
