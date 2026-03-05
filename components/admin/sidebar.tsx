'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Package, ShoppingCart, Users, Shapes, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

const menuItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', active: 'exact' },
  { href: '/admin/products', icon: Package, label: 'Products', active: 'startsWith' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders', active: 'startsWith' },
  { href: '/admin/customers', icon: Users, label: 'Customers', active: 'startsWith' },
  { href: '/admin/categories', icon: Shapes, label: 'Categories', active: 'startsWith' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-primary">BeautyByRose</h1>
        <p className="text-xs text-sidebar-accent-foreground mt-1">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.active === 'exact' ? pathname === item.href : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        {user && (
          <div className="px-4 py-2">
            <p className="text-xs text-sidebar-foreground opacity-70">Logged in as</p>
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
