'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ArrowLeft,
  AlertCircle,
  Package,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  User,
  Loader2,
  Check,
  Calendar,
} from 'lucide-react'

interface OrderDetail {
  id: number
  orderNumber: string
  userId: number
  customerName: string
  customerEmail: string
  shipPhone: string
  shipAddress: string
  shipCity: string
  shipPostal: string
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: string
  trackingNumber: string
  estimatedDelivery: string | null
  createdAt: string
  items: Array<{
    id: number
    orderId: number
    productId: number
    name: string
    price: number
    quantity: number
  }>
  customer?: {
    id: number
    email: string
    fullName: string
    phone: string
  }
}

const STATUS_OPTIONS = [
  { value: 'pending',    label: 'Pending',    color: 'bg-yellow-100 text-yellow-800' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  { value: 'shipped',    label: 'Shipped',    color: 'bg-purple-100 text-purple-800' },
  { value: 'delivered',  label: 'Delivered',  color: 'bg-green-100 text-green-800' },
  { value: 'cancelled',  label: 'Cancelled',  color: 'bg-red-100 text-red-800' },
]

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Editable fields
  const [status, setStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch order')
        const data = await response.json()
        setOrder(data)
        setStatus(data.status)
        setTrackingNumber(data.trackingNumber || '')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  async function handleSave() {
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)
    try {
      const res = await fetch(`/api/orders/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingNumber }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update order')
      setOrder((prev) =>
        prev ? { ...prev, status: status as OrderDetail['status'], trackingNumber } : prev
      )
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-10 bg-muted rounded animate-pulse w-24" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-64 bg-muted rounded animate-pulse" />
            <div className="h-40 bg-muted rounded animate-pulse" />
            <div className="h-40 bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-64 bg-muted rounded animate-pulse" />
            <div className="h-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <p>{error || 'Order not found'}</p>
          </div>
        </Card>
      </div>
    )
  }

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === order.status)
  const phone = order.shipPhone || order.customer?.phone || ''
  const hasAddress = order.shipAddress || order.shipCity || order.shipPostal
  const isDirty =
    status !== order.status || trackingNumber !== (order.trackingNumber || '')

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </button>

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString('en-KE', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}{' '}
            at{' '}
            {new Date(order.createdAt).toLocaleTimeString('en-KE', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <Badge
          className={`${currentStatus?.color} border-0 capitalize text-sm px-3 py-1`}
          variant="outline"
        >
          {order.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Left column ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Order Items */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Order Items ({order.items.length})
            </h3>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × KES {item.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-semibold">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>KES {order.subtotal.toLocaleString()}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>KES {order.tax.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {order.shipping > 0 ? `KES ${order.shipping.toLocaleString()}` : 'Free'}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                <span>Total</span>
                <span>KES {order.total.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Customer Information */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <User className="w-4 h-4" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Full Name</p>
                <p className="font-medium">{order.customerName || order.customer?.fullName || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Email</p>
                <p className="font-medium break-all">{order.customerEmail || order.customer?.email || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone
                </p>
                <p className="font-medium">{phone || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
                  <CreditCard className="w-3 h-3" /> Payment Method
                </p>
                <p className="font-medium capitalize">{order.paymentMethod || '—'}</p>
              </div>
            </div>
          </Card>

          {/* Delivery Location */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Delivery Location
            </h3>
            {hasAddress ? (
              <div className="space-y-1 text-sm">
                {order.shipAddress && (
                  <p className="font-medium">{order.shipAddress}</p>
                )}
                <p className="text-muted-foreground">
                  {[order.shipCity, order.shipPostal].filter(Boolean).join(', ')}
                </p>
                {order.estimatedDelivery && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Estimated delivery:{' '}
                      <span className="font-medium text-foreground">
                        {new Date(order.estimatedDelivery).toLocaleDateString('en-KE', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No delivery address recorded for this order.
              </p>
            )}
          </Card>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-4">

          {/* Update Order */}
          <Card className="p-5">
            <h3 className="font-semibold mb-4">Update Order</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trackingNumber" className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  Tracking Number
                </Label>
                <Input
                  id="trackingNumber"
                  placeholder="e.g. KE123456789"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </div>

              {saveError && (
                <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                  {saveError}
                </p>
              )}

              <Button
                onClick={handleSave}
                disabled={saving || !isDirty}
                className="w-full gap-2"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                ) : saveSuccess ? (
                  <><Check className="w-4 h-4" /> Saved!</>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </Card>

          {/* Order Meta */}
          <Card className="p-5">
            <h3 className="font-semibold mb-3">Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order #</span>
                <span className="font-medium">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              {order.trackingNumber && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tracking</span>
                  <span className="font-medium">{order.trackingNumber}</span>
                </div>
              )}
              {order.estimatedDelivery && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Delivery</span>
                  <span className="font-medium">
                    {new Date(order.estimatedDelivery).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
