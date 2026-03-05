import { NextRequest, NextResponse } from 'next/server'
import { customers, orders } from '@/lib/mock-data'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const customerId = parseInt(params.id)
  const customer = customers.find(c => c.id === customerId)
  
  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
  }

  const customerOrders = orders.filter(o => o.userId === customerId)

  return NextResponse.json({ ...customer, orders: customerOrders })
}
