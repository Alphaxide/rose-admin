import { NextRequest, NextResponse } from 'next/server'
import { getOrRegisterIpnId, submitPesaPalOrder } from '@/lib/pesapal'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderNumber, amount, customerName, customerEmail, customerPhone } = body

    if (!orderNumber || !amount) {
      return NextResponse.json({ error: 'orderNumber and amount are required' }, { status: 400 })
    }

    // Derive app URL from the incoming request — no env var needed
    const { origin, host, protocol } = new URL(request.url)
    const appUrl = origin || `${protocol}//${host}`

    const ipnUrl = `${appUrl}/api/pesapal/ipn`
    const callbackUrl = `${appUrl}/payment-callback`

    const ipnId = await getOrRegisterIpnId(ipnUrl)

    const nameParts = (customerName || 'Customer').split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || firstName

    const result = await submitPesaPalOrder({
      orderNumber,
      amount: Number(amount),
      description: `BeautyByRose Order #${orderNumber}`,
      callbackUrl,
      ipnId,
      firstName,
      lastName,
      email: customerEmail || '',
      phone: customerPhone || '',
    })

    return NextResponse.json({
      redirect_url: result.redirect_url,
      order_tracking_id: result.order_tracking_id,
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'PesaPal initiation failed'
    console.error('[pesapal/initiate]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
