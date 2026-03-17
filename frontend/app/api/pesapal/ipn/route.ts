// PesaPal IPN (Instant Payment Notification) handler
// PesaPal calls this URL via GET when a payment status changes.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getPesaPalTransactionStatus } from '@/lib/pesapal'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderTrackingId = searchParams.get('OrderTrackingId')
  const orderMerchantReference = searchParams.get('OrderMerchantReference')
  const orderNotificationType = searchParams.get('OrderNotificationType')

  if (!orderTrackingId || !orderMerchantReference) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  try {
    // Fetch transaction status from PesaPal
    const txStatus = await getPesaPalTransactionStatus(orderTrackingId)

    const rawStatus = txStatus.payment_status_description?.toLowerCase() ?? 'pending'
    // Map PesaPal statuses to our internal ones
    const paymentStatus =
      rawStatus === 'completed'
        ? 'completed'
        : rawStatus === 'failed' || rawStatus === 'reversed'
          ? 'failed'
          : rawStatus === 'invalid'
            ? 'failed'
            : 'pending'

    // Update the order in Supabase (needs service role to bypass RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus,
        pesapal_tracking_id: orderTrackingId,
      })
      .eq('order_number', orderMerchantReference)

    // PesaPal expects this exact response shape
    return NextResponse.json({
      orderNotificationType,
      orderTrackingId,
      orderMerchantReference,
      status: 200,
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'IPN processing error'
    console.error('[pesapal/ipn]', msg)
    // Still return 200 so PesaPal doesn't keep retrying for our internal errors
    return NextResponse.json({ error: msg, status: 500 }, { status: 200 })
  }
}
