

// ─── Config ───────────────────────────────────────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://<project-ref>.functions.supabase.co/beautyhub-api'
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const headers = () => ({
  'Content-Type': 'application/json',
  ...(ANON_KEY ? { Authorization: `Bearer ${ANON_KEY}` } : {}),
})

// ─── API Response Types ───────────────────────────────────────────────────────
export interface ApiProduct {
  id: string
  name: string
  price: number
  original_price?: number | null
  image_urls: string[]
  thumbnail_url?: string | null
  category_id: string
  rating: number
  review_count: number
  stock_quantity: number
  description: string
  in_stock: boolean
}

export interface ApiCategory {
  id: string
  name: string
  slug: string
  image: string
}

export interface ApiOrder {
  id: string
  order_number: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  tracking_number?: string | null
  estimated_delivery?: string | null
  items: ApiOrderItem[]
  total: number
}

export interface ApiOrderItem {
  product_id: string
  name: string
  price: number
  quantity: number
}

export interface ShippingAddress {
  full_name: string
  email: string
  phone: string
  address: string
  city: string
  postal_code: string
}

export interface CreateOrderPayload {
  items: { product_id: string; quantity: number }[]
  shipping_address: ShippingAddress
  payment_method?: 'mpesa' | 'card' | 'cash' | 'pesapal'
}

export interface CreateOrderResponse {
  id: string
  order_number: string
  user_id: string | null
  items: ApiOrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  shipping_address: ShippingAddress
  payment_method: string
  status: string
  created_at: string
}

export interface CheckoutInitiatePayload {
  order_number: string
  phone_number: string
}

export interface CheckoutInitiateResponse {
  checkout_id: string
  order_number: string
  amount: number
  currency: string
  phone_number: string
  mpesa_request_id: string
  status: string
  expires_at: string
}

export interface CheckoutConfirmPayload {
  checkout_id: string
  transaction_id: string
  status?: 'completed' | 'failed'
}

export interface CheckoutConfirmResponse {
  order_number: string
  payment_status: string
  transaction_id: string
  amount: number
  currency: string
  timestamp: string
}

export interface PaginatedProducts {
  data: ApiProduct[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// ─── Internal fetch helper ────────────────────────────────────────────────────
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers(), ...(options?.headers ?? {}) },
  })

  const json = await res.json()

  if (!res.ok || json.status === 'error') {
    throw new Error(json.message ?? `API error ${res.status}`)
  }

  return json as T
}

// ─── Products ─────────────────────────────────────────────────────────────────

/**
 * GET /products
 * Paginated product listing with optional filters.
 */
export async function getProducts(filters?: {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'rating'
  page?: number
  limit?: number
}): Promise<ApiProduct[]> {
  const params = new URLSearchParams()
  if (filters?.category)  params.set('category', filters.category)
  if (filters?.minPrice !== undefined) params.set('minPrice', String(filters.minPrice))
  if (filters?.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice))
  if (filters?.sortBy)    params.set('sortBy', filters.sortBy)
  if (filters?.page)      params.set('page', String(filters.page))
  if (filters?.limit)     params.set('limit', String(filters.limit))

  const qs = params.toString()
  const result = await apiFetch<PaginatedProducts>(`/products${qs ? `?${qs}` : ''}`)
  return result.data
}

/**
 * GET /products (with full pagination metadata)
 */
export async function getProductsPaginated(filters?: {
  category?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'rating'
  page?: number
  limit?: number
}): Promise<PaginatedProducts> {
  const params = new URLSearchParams()
  if (filters?.category)  params.set('category', filters.category)
  if (filters?.minPrice !== undefined) params.set('minPrice', String(filters.minPrice))
  if (filters?.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice))
  if (filters?.sortBy)    params.set('sortBy', filters.sortBy)
  if (filters?.page)      params.set('page', String(filters.page ?? 1))
  if (filters?.limit)     params.set('limit', String(filters.limit ?? 300))

  const qs = params.toString()
  return apiFetch<PaginatedProducts>(`/products${qs ? `?${qs}` : ''}`)
}

/**
 * GET /products/:id
 */
export async function getProductById(id: string): Promise<ApiProduct | null> {
  try {
    return await apiFetch<ApiProduct>(`/products/${id}`)
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes('not found')) return null
    throw e
  }
}

// ─── Search ───────────────────────────────────────────────────────────────────

/**
 * GET /search?query=...
 */
export async function searchProducts(
  query: string,
  options?: { category?: string; limit?: number }
): Promise<ApiProduct[]> {
  const params = new URLSearchParams({ query })
  if (options?.category) params.set('category', options.category)
  if (options?.limit)    params.set('limit', String(options.limit))

  const result = await apiFetch<{ status: string; data: ApiProduct[]; total: number }>(
    `/search?${params.toString()}`
  )
  return result.data
}

// ─── Categories ───────────────────────────────────────────────────────────────

/**
 * GET /categories
 */
export async function getCategories(): Promise<ApiCategory[]> {
  const result = await apiFetch<{ status: string; data: ApiCategory[] }>('/categories')
  return result.data
}

/**
 * GET /categories/:slug/products
 */
export async function getCategoryProducts(
  slug: string,
  options?: { sortBy?: string; limit?: number }
): Promise<ApiProduct[]> {
  const params = new URLSearchParams()
  if (options?.sortBy) params.set('sortBy', options.sortBy)
  if (options?.limit)  params.set('limit', String(options.limit))

  const qs = params.toString()
  const result = await apiFetch<{ status: string; data: ApiProduct[] }>(
    `/categories/${slug}/products${qs ? `?${qs}` : ''}`
  )
  return result.data
}

/**
 * Helper — find category by slug via GET /categories (no dedicated endpoint)
 */
export async function getCategoryBySlug(slug: string): Promise<ApiCategory | null> {
  const categories = await getCategories()
  return categories.find((c) => c.slug === slug) ?? null
}

// ─── Orders ───────────────────────────────────────────────────────────────────

/**
 * POST /orders
 */
export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  const result = await apiFetch<{ status: string; data: CreateOrderResponse }>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return result.data
}

/**
 * GET /orders/:orderNumber
 */
export async function getOrder(orderNumber: string): Promise<ApiOrder | null> {
  try {
    const result = await apiFetch<{ status: string; data: ApiOrder }>(
      `/orders/${orderNumber}`
    )
    return result.data
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes('not found')) return null
    throw e
  }
}

// ─── Checkout ─────────────────────────────────────────────────────────────────

/**
 * POST /checkout/initiate
 * Triggers M-Pesa STK push (or placeholder) for a given order.
 */
export async function initiateCheckout(
  payload: CheckoutInitiatePayload
): Promise<CheckoutInitiateResponse> {
  const result = await apiFetch<{ status: string; data: CheckoutInitiateResponse }>(
    '/checkout/initiate',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  )
  return result.data
}

/**
 * POST /checkout/confirm
 * Confirms payment and marks order as processing.
 */
export async function confirmCheckout(
  payload: CheckoutConfirmPayload
): Promise<CheckoutConfirmResponse> {
  const result = await apiFetch<{ status: string; data: CheckoutConfirmResponse }>(
    '/checkout/confirm',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  )
  return result.data
}
