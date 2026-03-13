'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  User, Package, LogOut, Edit2, Phone, Mail,
  Loader2, ChevronRight, MapPin, Calendar, Eye, EyeOff,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// ── API ────────────────────────────────────────────────────────────────────────
const API_URL  = 'https://nlsyuzhycuojnjdrykkg.supabase.co/functions/v1/acc-task'
const ANON_KEY = 'sb_publishable_z2IhNVEauBE0KSv6HS3F_g_yXTcrTfJ'

async function call(action: string, payload: Record<string, unknown> = {}) {
  const res = await fetch(API_URL, {
    method : 'POST',
    headers: {
      'Content-Type' : 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
      'apikey'       : ANON_KEY,
    },
    body: JSON.stringify({ action, ...payload }),
  })
  const data = await res.json()
  console.log(`[account] ${action}`, res.status, data)
  if (!data.ok) throw new Error(data.error ?? `HTTP ${res.status}`)
  return data.data
}

// ── Types ──────────────────────────────────────────────────────────────────────
interface UserProfile {
  id         : number
  email      : string
  phone      : string | null
  full_name  : string | null
  created_at : string
  updated_at : string
}

interface Order {
  id                : number
  order_number      : string
  subtotal          : number
  tax               : number
  shipping          : number
  total             : number
  status            : string
  payment_method    : string
  tracking_number   : string | null
  estimated_delivery: string | null
  ship_full_name    : string
  ship_email        : string
  ship_phone        : string
  ship_address      : string
  ship_city         : string
  created_at        : string
}

interface OrderDetail extends Order {
  ship_postal: string
  items: { id: number; product_id: number; name: string; price: number; quantity: number }[]
}

// ── LocalStorage key ───────────────────────────────────────────────────────────
const LS_KEY = 'beautybyrose_user'

// ── Exported helpers for use in checkout / other pages ────────────────────────
export function getCachedUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? (JSON.parse(raw) as UserProfile) : null
  } catch { return null }
}

// ── Status badge ───────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  pending    : 'bg-yellow-100 text-yellow-700 border-yellow-200',
  processing : 'bg-blue-100   text-blue-700   border-blue-200',
  shipped    : 'bg-purple-100 text-purple-700 border-purple-200',
  delivered  : 'bg-green-100  text-green-700  border-green-200',
  cancelled  : 'bg-red-100    text-red-700    border-red-200',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[status] ?? 'bg-muted text-muted-foreground border-border'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// ── Shared input style ─────────────────────────────────────────────────────────
const inputCls =
  'w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground'

// ─────────────────────────────────────────────────────────────────────────────
// AUTH VIEWS
// ─────────────────────────────────────────────────────────────────────────────

function LoginView({ onSuccess }: { onSuccess: (u: UserProfile) => void }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [view,     setView]     = useState<'login' | 'register'>('login')

  // Re-render as register view in place
  if (view === 'register') {
    return <RegisterView onSuccess={onSuccess} onSwitchToLogin={() => setView('login')} />
  }

  const handleSubmit = async () => {
    setError(null)
    if (!email.trim()) return setError('Please enter your email.')
    if (!password)     return setError('Please enter your password.')
    setLoading(true)
    try {
      const user = await call('login', { email: email.trim().toLowerCase(), password }) as UserProfile
      localStorage.setItem(LS_KEY, JSON.stringify(user))
      onSuccess(user)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-xl border border-border p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your BeautyByRose account</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email address</label>
            <input
              type="email" value={email} placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'} value={password} placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className={inputCls + ' pr-10'}
              />
              <button type="button" onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">⚠ {error}</p>
          )}

          <Button onClick={handleSubmit} disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{' '}
          <button onClick={() => setView('register')} className="text-primary hover:underline font-medium">
            Create one
          </button>
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function RegisterView({
  onSuccess,
  onSwitchToLogin,
}: {
  onSuccess      : (u: UserProfile) => void
  onSwitchToLogin: () => void
}) {
  const [fullName, setFullName] = useState('')
  const [phone,    setPhone]    = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  const handleSubmit = async () => {
    setError(null)
    if (!email.trim())       return setError('Please enter your email.')
    if (!password)           return setError('Please enter a password.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    try {
      const user = await call('register', {
        email     : email.trim().toLowerCase(),
        password,
        full_name : fullName.trim() || undefined,
        phone     : phone.trim()    || undefined,
      }) as UserProfile
      localStorage.setItem(LS_KEY, JSON.stringify(user))
      onSuccess(user)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-xl border border-border p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Create an account</h1>
          <p className="text-sm text-muted-foreground">Join BeautyByRose to track orders and more</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Full Name <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Phone <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="+254 700 000 000" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" className={inputCls} />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'} value={password}
                placeholder="At least 6 characters"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className={inputCls + ' pr-10'}
              />
              <button type="button" onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">⚠ {error}</p>
          )}

          <Button onClick={handleSubmit} disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Account
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-primary hover:underline font-medium">
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDER DETAIL VIEW
// ─────────────────────────────────────────────────────────────────────────────

function OrderDetailView({
  order,
  onBack,
}: {
  order : OrderDetail
  onBack: () => void
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={onBack}
        className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 text-sm font-medium">
        ← Back to Orders
      </button>

      <div className="bg-card rounded-xl border border-border p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Order {order.order_number}</h1>
            <p className="text-sm text-muted-foreground">
              {new Date(order.created_at).toLocaleDateString('en-KE', { dateStyle: 'long' })}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Items */}
        <div>
          <h2 className="font-semibold text-foreground mb-3">Items</h2>
          <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center px-4 py-3 bg-muted/50 text-sm">
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-foreground">
                  KES {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span><span>KES {Number(order.subtotal).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span>{Number(order.shipping) === 0 ? 'FREE' : `KES ${Number(order.shipping).toLocaleString()}`}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>VAT</span><span>KES {Number(order.tax).toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-base text-foreground border-t border-border pt-2">
            <span>Total</span>
            <span className="text-primary">KES {Number(order.total).toLocaleString()}</span>
          </div>
        </div>

        {/* Address */}
        <div>
          <h2 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" /> Delivery Address
          </h2>
          <div className="bg-muted rounded-lg p-4 text-sm space-y-1">
            <p className="font-medium text-foreground">{order.ship_full_name}</p>
            <p className="text-muted-foreground">
              {order.ship_address}, {order.ship_city}
              {order.ship_postal ? ` ${order.ship_postal}` : ''}
            </p>
            <p className="text-muted-foreground">{order.ship_email} · {order.ship_phone}</p>
          </div>
        </div>

        {order.tracking_number && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <p className="font-semibold text-blue-800 mb-1">Tracking Number</p>
            <p className="font-mono text-blue-700">{order.tracking_number}</p>
          </div>
        )}

        {order.estimated_delivery && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            Estimated delivery:{' '}
            <strong className="text-foreground">
              {new Date(order.estimated_delivery).toLocaleDateString('en-KE', { dateStyle: 'long' })}
            </strong>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export default function AccountPage() {
  const [user,          setUser]          = useState<UserProfile | null>(null)
  const [authView,      setAuthView]      = useState<'login' | 'register'>('login')
  const [orders,        setOrders]        = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null)
  const [activeTab,     setActiveTab]     = useState<'profile' | 'orders'>('profile')
  const [isEditing,     setIsEditing]     = useState(false)
  const [pageLoading,   setPageLoading]   = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [orderLoading,  setOrderLoading]  = useState(false)
  const [saveLoading,   setSaveLoading]   = useState(false)
  const [saveError,     setSaveError]     = useState<string | null>(null)
  const [editData,      setEditData]      = useState({ full_name: '', phone: '' })

  // ── Load cached user on mount ───────────────────────────────────────────────
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) { setPageLoading(false); return }

    try {
      const cached = JSON.parse(raw) as UserProfile
      setUser(cached)
      setEditData({ full_name: cached.full_name ?? '', phone: cached.phone ?? '' })

      // Silently refresh from DB
      call('get_profile', { email: cached.email })
        .then((fresh: UserProfile) => {
          setUser(fresh)
          localStorage.setItem(LS_KEY, JSON.stringify(fresh))
        })
        .catch(() => { /* keep cached */ })
    } catch { /* bad cache */ }

    setPageLoading(false)
  }, [])

  // ── Fetch orders ────────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async (email: string) => {
    setOrdersLoading(true)
    try {
      const data = await call('get_orders', { email })
      setOrders(Array.isArray(data) ? data : [])
    } catch { setOrders([]) }
    finally  { setOrdersLoading(false) }
  }, [])

  useEffect(() => {
    if (activeTab === 'orders' && user?.email) fetchOrders(user.email)
  }, [activeTab, user, fetchOrders])

  // ── Open order detail ───────────────────────────────────────────────────────
  const openOrder = async (order_number: string) => {
    setOrderLoading(true)
    try {
      const data = await call('get_order', { order_number })
      setSelectedOrder(data as OrderDetail)
    } catch { /* silent */ }
    finally { setOrderLoading(false) }
  }

  // ── Save profile ────────────────────────────────────────────────────────────
  const saveProfile = async () => {
    if (!user) return
    setSaveLoading(true)
    setSaveError(null)
    try {
      const updated = await call('save_profile', {
        email     : user.email,
        full_name : editData.full_name,
        phone     : editData.phone,
      }) as UserProfile
      setUser(updated)
      localStorage.setItem(LS_KEY, JSON.stringify(updated))
      setIsEditing(false)
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaveLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem(LS_KEY)
    setUser(null)
    setOrders([])
    setSelectedOrder(null)
    setActiveTab('profile')
    setAuthView('login')
  }

  // ── Page loading ────────────────────────────────────────────────────────────
  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    )
  }

  // ── Not signed in → show login or register ──────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          {authView === 'login' ? (
            <LoginView onSuccess={(u) => { setUser(u); setEditData({ full_name: u.full_name ?? '', phone: u.phone ?? '' }) }} />
          ) : (
            <RegisterView
              onSuccess={(u) => { setUser(u); setEditData({ full_name: u.full_name ?? '', phone: u.phone ?? '' }) }}
              onSwitchToLogin={() => setAuthView('login')}
            />
          )}
        </main>
        <Footer />
      </div>
    )
  }

  // Note: LoginView internally handles the switch to RegisterView,
  // but if we land on register from outside (e.g. a link), handle it:
  // authView is only used pre-login so this is fine as-is.

  // ── Order detail ────────────────────────────────────────────────────────────
  if (selectedOrder) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 w-full">
          <OrderDetailView order={selectedOrder} onBack={() => setSelectedOrder(null)} />
        </main>
        <Footer />
      </div>
    )
  }

  // ── Main account dashboard ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 py-8">

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">My Account</h1>
            <p className="text-muted-foreground text-sm">Manage your profile and view your orders</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">

            {/* ── Sidebar ── */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-3">
                    <User className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-base font-bold text-foreground">{user.full_name || user.email}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5 break-all">{user.email}</p>
                </div>
                <nav className="space-y-2 mb-6">
                  {(['profile', 'orders'] as const).map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium text-sm flex items-center gap-2 ${
                        activeTab === tab
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}>
                      {tab === 'profile' ? <User className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
                <Button onClick={logout} variant="outline" className="w-full gap-2 text-sm">
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </div>
            </div>

            {/* ── Content ── */}
            <div className="lg:col-span-3">

              {/* Profile tab */}
              {activeTab === 'profile' && (
                <div className="bg-card rounded-lg border border-border p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Profile Information</h2>
                    {!isEditing && (
                      <button
                        onClick={() => {
                          setIsEditing(true)
                          setEditData({ full_name: user.full_name ?? '', phone: user.phone ?? '' })
                        }}
                        className="flex items-center gap-1.5 text-primary hover:text-primary/80 text-sm font-medium"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                          <input value={editData.full_name}
                            onChange={(e) => setEditData((p) => ({ ...p, full_name: e.target.value }))}
                            className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                          <input type="tel" value={editData.phone} placeholder="+254 700 000 000"
                            onChange={(e) => setEditData((p) => ({ ...p, phone: e.target.value }))}
                            className={inputCls} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                        <input value={user.email} disabled
                          className="w-full px-3 py-2 border border-border rounded-md bg-muted text-muted-foreground text-sm cursor-not-allowed" />
                        <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                      </div>
                      {saveError && <p className="text-sm text-red-600">⚠ {saveError}</p>}
                      <div className="flex gap-3">
                        <Button onClick={saveProfile} disabled={saveLoading}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                          {saveLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                          <p className="font-semibold text-foreground">{user.full_name || '—'}</p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                            <Mail className="w-3.5 h-3.5" /> Email
                          </div>
                          <p className="font-semibold text-foreground break-all">{user.email}</p>
                        </div>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                          <Phone className="w-3.5 h-3.5" /> Phone
                        </div>
                        <p className="font-semibold text-foreground">{user.phone || '—'}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Member Since</p>
                        <p className="font-semibold text-foreground">
                          {new Date(user.created_at).toLocaleDateString('en-KE', { dateStyle: 'long' })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Orders tab */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-20 gap-3">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <p className="text-muted-foreground">Loading orders...</p>
                    </div>
                  ) : orders.length > 0 ? (
                    orders.map((order) => (
                      <div key={order.id}
                        className="bg-card rounded-lg border border-border p-5 hover:border-primary/40 transition-colors cursor-pointer"
                        onClick={() => openOrder(order.order_number)}>
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-foreground">{order.order_number}</h3>
                              <StatusBadge status={order.status} />
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {new Date(order.created_at).toLocaleDateString('en-KE', { dateStyle: 'medium' })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.ship_city} · {order.payment_method?.toUpperCase()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-xl font-bold text-primary">
                              KES {Number(order.total).toLocaleString()}
                            </p>
                            {orderLoading
                              ? <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                              : <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            }
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-card rounded-lg border border-border p-12 text-center">
                      <Package className="w-16 h-16 text-muted mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No orders yet</h3>
                      <p className="text-muted-foreground text-sm mb-6">
                        Your orders will appear here after checkout
                      </p>
                      <Link href="/products">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          Start Shopping
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}