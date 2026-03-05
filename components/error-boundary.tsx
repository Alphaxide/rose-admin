'use client'

import { useEffect } from 'react'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[v0] Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2">Something went wrong</h1>
        <p className="text-muted-foreground text-center mb-2">
          {error.message || 'An unexpected error occurred while loading this page.'}
        </p>
        
        <div className="bg-muted p-4 rounded-lg mb-6 max-h-40 overflow-auto">
          <p className="text-xs text-muted-foreground font-mono whitespace-pre-wrap break-words">
            {error.digest && `Error ID: ${error.digest}`}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/admin"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </div>
    </div>
  )
}
