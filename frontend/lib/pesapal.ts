// PesaPal API v3 helper — server-side only (used in API routes)

const PESAPAL_BASE_URL = 'https://pay.pesapal.com/v3'

function getCredentials() {
  const key = process.env.PESAPAL_CONSUMER_KEY
  const secret = process.env.PESAPAL_CONSUMER_SECRET
  if (!key || !secret) throw new Error('PesaPal credentials not configured')
  return { key, secret }
}

// ─── In-memory caches (shared within one serverless instance) ─────────────────
let _tokenCache: { token: string; expiresAt: number } | null = null
let _ipnIdCache: string | null = null

// ─── Auth ─────────────────────────────────────────────────────────────────────
export async function getPesaPalToken(): Promise<string> {
  if (_tokenCache && Date.now() < _tokenCache.expiresAt) {
    return _tokenCache.token
  }

  const { key, secret } = getCredentials()

  const res = await fetch(`${PESAPAL_BASE_URL}/api/Auth/RequestToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ consumer_key: key, consumer_secret: secret }),
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`PesaPal auth failed: ${txt}`)
  }

  const data = await res.json()
  // Tokens expire in ~5 min; cache for 4 min
  _tokenCache = { token: data.token, expiresAt: Date.now() + 4 * 60 * 1000 }
  return data.token
}

// ─── IPN Registration ─────────────────────────────────────────────────────────
export async function getOrRegisterIpnId(ipnUrl: string): Promise<string> {
  if (_ipnIdCache) return _ipnIdCache

  const token = await getPesaPalToken()

  const res = await fetch(`${PESAPAL_BASE_URL}/api/URLSetup/RegisterIPN`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url: ipnUrl, ipn_notification_type: 'GET' }),
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`PesaPal IPN registration failed: ${txt}`)
  }

  const data = await res.json()
  _ipnIdCache = data.ipn_id as string
  return _ipnIdCache!
}

// ─── Submit Order ─────────────────────────────────────────────────────────────
export interface PesaPalOrderParams {
  orderNumber: string
  amount: number
  description: string
  callbackUrl: string
  ipnId: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface PesaPalOrderResult {
  order_tracking_id: string
  merchant_reference: string
  redirect_url: string
}

export async function submitPesaPalOrder(
  params: PesaPalOrderParams
): Promise<PesaPalOrderResult> {
  const token = await getPesaPalToken()

  const res = await fetch(
    `${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: params.orderNumber,
        currency: 'KES',
        amount: params.amount,
        description: params.description,
        callback_url: params.callbackUrl,
        notification_id: params.ipnId,
        billing_address: {
          email_address: params.email,
          phone_number: params.phone,
          first_name: params.firstName,
          last_name: params.lastName,
        },
      }),
    }
  )

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`PesaPal order submission failed: ${txt}`)
  }

  return (await res.json()) as PesaPalOrderResult
}

// ─── Transaction Status ───────────────────────────────────────────────────────
export interface PesaPalTransactionStatus {
  payment_method: string
  amount: number
  created_date: string
  confirmation_code: string
  payment_status_description: string // "Completed" | "Failed" | "Invalid" | "Reversed"
  description: string
  message: string
  payment_account: string
  call_back_url: string
  status_code: number
  merchant_reference: string
  payment_status_code: string
  currency: string
  error: { error_type: string | null; code: string | null; message: string | null }
  status: string
}

export async function getPesaPalTransactionStatus(
  orderTrackingId: string
): Promise<PesaPalTransactionStatus> {
  const token = await getPesaPalToken()

  const res = await fetch(
    `${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${encodeURIComponent(orderTrackingId)}`,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`PesaPal status check failed: ${txt}`)
  }

  return (await res.json()) as PesaPalTransactionStatus
}
