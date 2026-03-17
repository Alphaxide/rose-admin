import { NextRequest, NextResponse } from 'next/server'
import { getPesaPalTransactionStatus } from '@/lib/pesapal'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderTrackingId = searchParams.get('orderTrackingId')

  if (!orderTrackingId) {
    return NextResponse.json({ error: 'orderTrackingId is required' }, { status: 400 })
  }

  try {
    const status = await getPesaPalTransactionStatus(orderTrackingId)
    return NextResponse.json(status)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Status check failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
