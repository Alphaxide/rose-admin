'use client'

import { useEffect, useState } from 'react'
import { StatCard } from '@/components/admin/stat-card'
import { OrdersTable } from '@/components/admin/orders-table'
import { TrendingUp, ShoppingCart, Users, Package, AlertCircle } from 'lucide-react'
import { Order, DashboardStats } from '@/lib/mock-data'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          fetch('/api/dashboard'),
          fetch('/api/orders'),
        ])

        const statsData = await statsRes.json()
        const ordersData = await ordersRes.json()

        setStats(statsData)
        setOrders(ordersData.slice(0, 5))
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg" />
            ))}
          </div>
          <div className="h-96 bg-muted rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Total Revenue"
          value={`KES ${stats?.totalRevenue.toLocaleString()}`}
          icon={TrendingUp}
          trend={12}
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={ShoppingCart}
          trend={8}
        />
        <StatCard
          title="Total Customers"
          value={stats?.totalCustomers || 0}
          icon={Users}
          trend={5}
        />
        <StatCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          icon={Package}
          trend={-2}
        />
        <StatCard
          title="Pending Orders"
          value={stats?.pendingOrders || 0}
          icon={AlertCircle}
          trend={-3}
        />
      </div>

      {/* Recent Orders */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <p className="text-sm text-muted-foreground">Latest 5 orders from your customers</p>
        </div>
        <OrdersTable orders={orders} />
      </div>
    </div>
  )
}
