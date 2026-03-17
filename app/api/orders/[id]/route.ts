import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select(`
      id,
      order_number,
      user_id,
      ship_full_name,
      ship_email,
      ship_phone,
      ship_address,
      ship_city,
      ship_postal,
      subtotal,
      tax,
      shipping,
      total,
      status,
      payment_method,
      payment_status,
      pesapal_tracking_id,
      tracking_number,
      estimated_delivery,
      created_at,
      order_items (
        id,
        order_id,
        product_id,
        name,
        price,
        quantity
      ),
      users (
        id,
        email,
        full_name,
        phone
      )
    `)
    .eq('id', parseInt(id))
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  // Map snake_case → camelCase for the frontend
  const result = {
    id: order.id,
    orderNumber: order.order_number,
    userId: order.user_id,
    customerName: order.ship_full_name ?? '',
    customerEmail: order.ship_email ?? '',
    shipPhone: order.ship_phone ?? '',
    shipAddress: order.ship_address ?? '',
    shipCity: order.ship_city ?? '',
    shipPostal: order.ship_postal ?? '',
    subtotal: order.subtotal,
    tax: order.tax,
    shipping: order.shipping,
    total: order.total,
    status: order.status,
    paymentMethod: order.payment_method ?? '',
    paymentStatus: (order as Record<string, unknown>).payment_status as string ?? 'pending',
    pesapalTrackingId: (order as Record<string, unknown>).pesapal_tracking_id as string ?? null,
    trackingNumber: order.tracking_number ?? '',
    estimatedDelivery: order.estimated_delivery ?? null,
    createdAt: order.created_at,
    items: (order.order_items ?? []).map((i: Record<string, unknown>) => ({
      id: i.id,
      orderId: i.order_id,
      productId: i.product_id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
    customer: order.users
      ? (() => {
          const u = order.users as unknown as { id: unknown; email: unknown; full_name: unknown; phone: unknown }
          return { id: u.id, email: u.email, fullName: u.full_name ?? '', phone: u.phone ?? '' }
        })()
      : null,
  }

  return NextResponse.json(result)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { status, trackingNumber } = body

  const updates: Record<string, unknown> = {}
  if (status !== undefined) updates.status = status
  if (trackingNumber !== undefined) updates.tracking_number = trackingNumber

  const { data, error } = await supabaseAdmin
    .from('orders')
    .update(updates)
    .eq('id', parseInt(id))
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
