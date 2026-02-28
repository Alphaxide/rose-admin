import { mockOrders } from '@/lib/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  let orders = mockOrders

  if (status) {
    orders = orders.filter((o) => o.status === status)
  }

  return Response.json(orders)
}
