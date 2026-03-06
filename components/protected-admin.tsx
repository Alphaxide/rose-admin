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
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
    
    // Check auth after component mounts
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // While checking auth, show loading state that matches the final render
  if (!isReady || !isAuthenticated) {
    return (
      <div className="flex min-h-screen">
        <aside className="w-64 bg-sidebar border-r border-sidebar-border" />
        <main className="flex-1 bg-background" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 bg-background">
        {children}
      </main>
    </div>
  )
}
