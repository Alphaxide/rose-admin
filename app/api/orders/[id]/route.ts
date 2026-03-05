import { NextRequest, NextResponse } from 'next/server'
import { orders, customers } from '@/lib/mock-data'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const orderId = parseInt(params.id)
  const order = orders.find(o => o.id === orderId)
  
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const customer = customers.find(c => c.id === order.userId)

  return NextResponse.json({ ...order, customer })
}
