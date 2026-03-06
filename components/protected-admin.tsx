'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Sidebar } from '@/components/admin/sidebar'

interface ProtectedAdminProps {
  children: React.ReactNode
}

export function ProtectedAdmin({ children }: ProtectedAdminProps) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    setLoading(false)

    if (!isAuthenticated && mounted) {
      router.push('/login')
    }
  }, [isAuthenticated, mounted, router])

  // Show skeleton during initial mount to prevent hydration mismatch
  if (!mounted || loading) {
    return (
      <div className="flex">
        <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col fixed left-0 top-0">
          <div className="p-6 border-b border-sidebar-border">
            <div className="h-8 bg-sidebar-accent rounded w-32 mb-2" />
            <div className="h-3 bg-sidebar-accent rounded w-24" />
          </div>
        </div>
        <main className="ml-64 flex-1 min-h-screen bg-background p-8">
          <div className="space-y-4">
            <div className="h-10 bg-muted rounded w-1/3" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </main>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 min-h-screen bg-background">
        {children}
      </main>
    </div>
  )
}
