import { NextRequest, NextResponse } from 'next/server'
import { mockCustomers, mockOrders } from '@/lib/mock-data'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const customerId = parseInt(params.id)
  const customer = mockCustomers.find(c => c.id === customerId)
  
  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
  }

  const customerOrders = mockOrders.filter(o => o.userId === customerId)

  return NextResponse.json({ ...customer, orders: customerOrders })
}
