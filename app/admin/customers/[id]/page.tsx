'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle, ShoppingBag, DollarSign, Calendar } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface CustomerDetail {
  id: number
  email: string
  fullName: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  totalOrders: number
  totalSpent: number
  joinedAt: string
  orders?: Array<{
    id: number
    orderNumber: string
    userId: number
    customerName: string
    customerEmail: string
    subtotal: number
    tax: number
    shipping: number
    total: number
    status: string
    items: Array<{
      id: number
      orderId: number
      productId: number
      name: string
      price: number
      quantity: number
    }>
    createdAt: string
  }>
}

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [customer, setCustomer] = useState<CustomerDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/customers/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch customer')
        const data = await response.json()
        setCustomer(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [params.id])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-muted rounded animate-pulse" />
        <div className="h-96 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  if (error || !customer) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <p>{error || 'Customer not found'}</p>
        </div>
      </Card>
    )
  }

  const initials = customer.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer Profile */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-blue-100 text-blue-900 font-bold text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{customer.fullName}</h2>
              <p className="text-muted-foreground">{customer.email}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t border-border pt-6">
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold break-all">{customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-semibold">{customer.phone}</p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="border-t border-border mt-6 pt-6">
            <h3 className="font-semibold mb-4">Address</h3>
            <div className="space-y-2 text-sm">
              <p>{customer.address}</p>
              <p>
                {customer.city}, {customer.state} {customer.zipCode}
              </p>
            </div>
          </div>

          {/* Order History */}
          {customer.orders && customer.orders.length > 0 && (
            <div className="border-t border-border mt-6 pt-6">
              <h3 className="font-semibold mb-4">Order History</h3>
              <div className="space-y-3">
                {customer.orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() =>
                      router.push(`/admin/orders/${order.id}`)
                    }
                  >
                    <div>
                      <p className="font-semibold">Order #{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.total.toFixed(2)}</p>
                      <Badge
                        variant={
                          order.status === 'delivered' ? 'default' : 'secondary'
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Sidebar Stats */}
        <div className="space-y-4">
          {/* Joined Date */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold">Member Since</h3>
            </div>
            <p className="text-2xl font-bold">
              {new Date(customer.joinedAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {Math.floor(
                (Date.now() - new Date(customer.joinedAt).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{' '}
              days ago
            </p>
          </Card>

          {/* Total Orders */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <ShoppingBag className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold">Total Orders</h3>
            </div>
            <p className="text-2xl font-bold">{customer.totalOrders}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Average: ${(customer.totalSpent / customer.totalOrders).toFixed(2)}
              /order
            </p>
          </Card>

          {/* Total Spent */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold">Total Spent</h3>
            </div>
            <p className="text-2xl font-bold">${customer.totalSpent.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Lifetime value
            </p>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            <Button className="w-full" variant="outline">
              Edit Customer
            </Button>
            <Button className="w-full" variant="outline">
              Send Email
            </Button>
            <Button className="w-full" variant="destructive">
              Deactivate Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
