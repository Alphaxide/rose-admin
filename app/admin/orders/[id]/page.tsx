'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle, Package } from 'lucide-react'

interface OrderDetail {
  id: number
  orderNumber: string
  userId: number
  customerName: string
  customerEmail: string
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: Array<{
    id: number
    orderId: number
    productId: number
    name: string
    price: number
    quantity: number
  }>
  createdAt: string
  customer?: {
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
    createdAt: string
  }
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch order')
        const data = await response.json()
        setOrder(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-muted rounded animate-pulse" />
        <div className="h-96 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <p>{error || 'Order not found'}</p>
        </div>
      </Card>
    )
  }

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
        {/* Order Header */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Order #{order.orderNumber}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(order.createdAt).toLocaleDateString()} at{' '}
                {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <Badge className={`${statusColors[order.status] || 'bg-gray-100'}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>

          {/* Customer Info */}
          <div className="border-t border-border pt-6">
            <h3 className="font-semibold mb-3">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{order.customerEmail}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t border-border mt-6 pt-6">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Order Summary Sidebar */}
        <div className="space-y-4">
          {/* Summary Card */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border font-semibold text-lg">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Customer Details Card */}
          {order.customer && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Delivery Address</h3>
              <div className="space-y-2 text-sm">
                <p className="font-semibold">{order.customer.fullName}</p>
                <p className="text-muted-foreground">{order.customer.address}</p>
                <p className="text-muted-foreground">
                  {order.customer.city}, {order.customer.state} {order.customer.zipCode}
                </p>
                <p className="text-muted-foreground">{order.customer.phone}</p>
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <Button className="w-full" variant="outline">
              Print Invoice
            </Button>
            <Button className="w-full" variant="outline">
              Mark as Shipped
            </Button>
            <Button className="w-full" variant="destructive">
              Cancel Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
