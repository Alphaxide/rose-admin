'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, XCircle, Clock, Loader2, ShoppingBag, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

type PaymentState = 'checking' | 'completed' | 'pending' | 'failed'

interface StatusInfo {
  payment_status_description: string
  amount: number
  currency: string
  confirmation_code: string
  merchant_reference: string
  payment_method: string
}

// Poll every 10 seconds for up to 5 minutes (30 attempts)
const POLL_INTERVAL_MS = 10_000
const MAX_ATTEMPTS = 30

function PaymentCallbackContent() {
  const searchParams = useSearchParams()
  const orderTrackingId = searchParams.get('OrderTrackingId')
  const orderMerchantReference = searchParams.get('OrderMerchantReference')

  const [state, setState] = useState<PaymentState>('checking')
  const [statusInfo, setStatusInfo] = useState<StatusInfo | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(POLL_INTERVAL_MS / 1000)

  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const attemptRef = useRef(0)

  function clearTimers() {
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
  }

  async function checkStatus(): Promise<boolean> {
    if (!orderTrackingId) return false
    try {
      const res = await fetch(
        `/api/pesapal/status?orderTrackingId=${encodeURIComponent(orderTrackingId)}`
      )
      if (!res.ok) throw new Error('Failed to retrieve payment status')
      const data: StatusInfo = await res.json()
      setStatusInfo(data)

      const desc = (data.payment_status_description ?? '').toLowerCase()
      if (desc === 'completed') {
        setState('completed')
        return true
      }
      if (desc === 'failed' || desc === 'invalid' || desc === 'reversed') {
        setState('failed')
        return true
      }
      // still pending — keep polling
      setState('pending')
      return false
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not verify payment')
      setState('failed')
      return true // stop polling on network errors
    }
  }

  function startCountdown() {
    setSecondsLeft(POLL_INTERVAL_MS / 1000)
    if (countdownRef.current) clearInterval(countdownRef.current)
    countdownRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current)
          return 0
        }
        return s - 1
      })
    }, 1000)
  }

  function schedulePoll() {
    attemptRef.current += 1
    setAttempts(attemptRef.current)

    if (attemptRef.current > MAX_ATTEMPTS) {
      setState('pending') // timed out — show pending, stop polling
      setErrorMsg('Payment verification timed out after 5 minutes. Your order is saved — check back later.')
      return
    }

    startCountdown()
    pollTimerRef.current = setTimeout(async () => {
      const done = await checkStatus()
      if (!done) schedulePoll()
    }, POLL_INTERVAL_MS)
  }

  useEffect(() => {
    if (!orderTrackingId) {
      setState('failed')
      setErrorMsg('No payment tracking ID found. Please contact support.')
      return
    }

    // First check immediately, then start polling if still pending
    ;(async () => {
      const done = await checkStatus()
      if (!done) schedulePoll()
    })()

    return () => clearTimers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderTrackingId])

  const timeElapsed = Math.min(attempts * (POLL_INTERVAL_MS / 1000), 300)
  const progressPct = Math.min((timeElapsed / 300) * 100, 100)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border p-8 text-center shadow-sm">

            {/* ── Checking / polling ── */}
            {(state === 'checking' || (state === 'pending' && attempts <= MAX_ATTEMPTS && !errorMsg)) && (
              <>
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <Clock className="w-10 h-10 text-amber-500" />
                  {state === 'checking' && (
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Verifying Payment</h1>
                <p className="text-muted-foreground mb-6">
                  {state === 'checking'
                    ? 'Checking your payment status…'
                    : `Waiting for payment confirmation… (checking every 10s)`}
                </p>

                {orderMerchantReference && (
                  <div className="bg-muted rounded-xl px-4 py-3 mb-5 text-sm text-left border border-border space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order #</span>
                      <span className="font-mono font-bold text-foreground">{orderMerchantReference}</span>
                    </div>
                    {attempts > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Time elapsed</span>
                        <span className="text-foreground">{timeElapsed}s / 5 min</span>
                      </div>
                    )}
                    {attempts > 0 && secondsLeft > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Next check</span>
                        <span className="text-foreground flex items-center gap-1">
                          <RefreshCw className="w-3 h-3 animate-spin" /> {secondsLeft}s
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Progress bar — 5-minute window */}
                {attempts > 0 && (
                  <div className="mb-5">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all duration-1000"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Auto-checking for up to 5 minutes
                    </p>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 text-left">
                  <p className="font-semibold mb-1">If you paid via M-Pesa:</p>
                  <p>Complete the M-Pesa STK push on your phone. This page will update automatically once confirmed.</p>
                </div>
              </>
            )}

            {/* ── Completed ── */}
            {state === 'completed' && (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h1>
                <p className="text-muted-foreground mb-6">
                  Your payment has been confirmed. We'll start processing your order right away.
                </p>

                {statusInfo && (
                  <div className="bg-muted rounded-xl p-4 mb-6 text-left text-sm space-y-2 border border-border">
                    <h3 className="font-semibold text-foreground mb-3">Payment Receipt</h3>
                    {orderMerchantReference && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Order #</span>
                        <span className="font-mono font-bold text-foreground">{orderMerchantReference}</span>
                      </div>
                    )}
                    {statusInfo.confirmation_code && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Confirmation</span>
                        <span className="font-mono font-bold text-foreground">{statusInfo.confirmation_code}</span>
                      </div>
                    )}
                    {statusInfo.amount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount Paid</span>
                        <span className="font-semibold text-green-600">
                          {statusInfo.currency} {statusInfo.amount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {statusInfo.payment_method && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Method</span>
                        <span className="text-foreground capitalize">{statusInfo.payment_method}</span>
                      </div>
                    )}
                  </div>
                )}

                <Link href="/">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 py-3 h-auto font-semibold">
                    <ShoppingBag className="w-4 h-4" /> Continue Shopping
                  </Button>
                </Link>
              </>
            )}

            {/* ── Timed-out pending ── */}
            {state === 'pending' && (attempts > MAX_ATTEMPTS || !!errorMsg) && (
              <>
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-10 h-10 text-amber-500" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Still Pending</h1>
                <p className="text-muted-foreground mb-4">
                  {errorMsg || "We couldn't confirm your payment yet, but your order has been saved."}
                </p>
                {orderMerchantReference && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 mb-6 text-left">
                    <p>
                      Order <strong>#{orderMerchantReference}</strong> is saved. Once your payment is
                      confirmed by PesaPal we'll update your order automatically.
                    </p>
                  </div>
                )}
                <Link href="/">
                  <Button variant="outline" className="w-full py-3 h-auto font-semibold">
                    Continue Shopping
                  </Button>
                </Link>
              </>
            )}

            {/* ── Failed ── */}
            {state === 'failed' && (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Payment Failed</h1>
                <p className="text-muted-foreground mb-4">
                  {errorMsg || 'Your payment could not be processed. No charge was made.'}
                </p>
                {orderMerchantReference && (
                  <p className="text-sm text-muted-foreground mb-6">
                    Order <strong className="text-foreground">#{orderMerchantReference}</strong> is saved.
                    You can retry payment or use M-Pesa/WhatsApp to complete manually.
                  </p>
                )}
                <div className="flex flex-col gap-3">
                  <Link href="/checkout">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 h-auto font-semibold">
                      Try Again
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full py-3 h-auto font-semibold">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  )
}
