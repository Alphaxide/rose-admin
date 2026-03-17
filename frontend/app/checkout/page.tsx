'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Check, ShoppingBag, MapPin, Phone, Mail, MessageSquare, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import { createOrder } from '@/lib/api'

type CheckoutStep = 'shipping' | 'review' | 'confirmation'

interface ShippingData {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
}

interface StoreSettings {
  payment_type: 'paybill' | 'till'
  payment_number: string
  phone: string
  whatsapp: string
  email: string
}

const SETTING_DEFAULTS: StoreSettings = {
  payment_type: 'paybill',
  payment_number: '',
  phone: '+254 700 000 000',
  whatsapp: '+254700000000',
  email: 'orders@beautybyrose.co.ke',
}

function Field({
  label, name, type = 'text', placeholder, value, onChange, required, error, onClearError,
}: {
  label: string; name: string; type?: string; placeholder?: string
  value: string; onChange: (v: string) => void; required?: boolean
  error?: string; onClearError?: (n: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => { onChange(e.target.value); onClearError?.(name) }}
        className={`w-full px-3 py-2 border rounded-md bg-background text-foreground text-sm
          focus:outline-none focus:ring-2 focus:ring-primary transition-colors
          ${error ? 'border-red-500 bg-red-50' : 'border-border'}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">⚠ {error}</p>}
    </div>
  )
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping')
  const [isLoading,   setIsLoading]   = useState(false)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [errors,      setErrors]      = useState<Record<string, string>>({})
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(SETTING_DEFAULTS)

  const [shippingData, setShippingData] = useState<ShippingData>({
    fullName: '', email: '', phone: '', address: '', city: '', postalCode: '',
  })
  const [pesapalLoading, setPesapalLoading] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => setStoreSettings({ ...SETTING_DEFAULTS, ...data }))
      .catch(() => {})
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('beautybyrose_user')
      if (!raw) return
      const u = JSON.parse(raw)
      setShippingData((p) => ({
        ...p,
        fullName: u.full_name || p.fullName,
        email:    u.email    || p.email,
        phone:    u.phone    || p.phone,
      }))
    } catch { /* guest — skip */ }
  }, [])

  const shippingFee = 0
  const taxAmount   = 0
  const finalTotal  = totalPrice

  const setField   = (f: keyof ShippingData) => (v: string) => setShippingData((p) => ({ ...p, [f]: v }))
  const clearError = (n: string) => setErrors((p) => ({ ...p, [n]: '' }))

  const validateShipping = (): boolean => {
    const e: Record<string, string> = {}
    if (!shippingData.fullName.trim()) e.fullName = 'Full name is required'
    if (!shippingData.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingData.email)) e.email = 'Invalid email address'
    if (!shippingData.phone.trim()) e.phone = 'Phone is required'
    else if (!/^\+?254[0-9]{9}$|^0[0-9]{9}$/.test(shippingData.phone.replace(/\s/g, '')))
      e.phone = 'Enter a valid Kenyan phone number'
    if (!shippingData.address.trim()) e.address = 'Address is required'
    if (!shippingData.city.trim()) e.city = 'City is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateShipping()) setCurrentStep('review')
  }

  const handlePayWithPesaPal = async () => {
    if (!orderNumber) return
    setPesapalLoading(true)
    try {
      const res = await fetch('/api/pesapal/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          amount: finalTotal,
          customerName: shippingData.fullName,
          customerEmail: shippingData.email,
          customerPhone: shippingData.phone,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to initiate payment')
      window.location.href = data.redirect_url
    } catch (err: unknown) {
      setErrors({ submit: err instanceof Error ? err.message : 'PesaPal payment failed. Try manual payment below.' })
    } finally {
      setPesapalLoading(false)
    }
  }

  const handlePlaceOrder = async () => {
    setIsLoading(true)
    setErrors({})
    try {
      const order = await createOrder({
        items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
        shipping_address: {
          full_name:   shippingData.fullName,
          email:       shippingData.email,
          phone:       shippingData.phone,
          address:     shippingData.address,
          city:        shippingData.city,
          postal_code: shippingData.postalCode,
        },
        payment_method: 'mpesa',
      })
      setOrderNumber(order.order_number)
      clearCart()
      setCurrentStep('confirmation')
    } catch (err: unknown) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to place order. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const subtotal = totalPrice
  const OrderSummary = () => (
    <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
      <h2 className="text-xl font-bold text-foreground mb-5">Order Summary</h2>
      <div className="space-y-3 mb-5 max-h-48 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.product_id} className="flex justify-between text-sm gap-2">
            <span className="text-muted-foreground truncate">
              {item.name} <span className="font-medium text-foreground">×{item.quantity}</span>
            </span>
            <span className="font-medium text-foreground whitespace-nowrap">
              KES {(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      <div className="space-y-2 py-4 border-y border-border mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">KES {subtotal.toLocaleString()}</span>
        </div>
      </div>
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold text-foreground text-lg">Total</span>
        <span className="text-2xl font-bold text-primary">KES {finalTotal.toLocaleString()}</span>
      </div>
    </div>
  )

  if (items.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some products before checking out</p>
            <Link href="/"><Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Back to Shopping</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 py-8">

          <div className="mb-8">
            <Link href="/cart" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Cart
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Checkout</h1>
          </div>

          {currentStep === 'confirmation' && orderNumber ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-card rounded-xl border border-border p-8 text-center" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Order Placed!</h2>
                <p className="text-muted-foreground mb-8">
                  Your order is confirmed. Please complete payment using any method below.
                </p>

                <div className="bg-muted rounded-xl p-5 mb-6 text-left border border-border text-sm space-y-3">
                  <h3 className="font-bold text-foreground">Order Details</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Order Number</span>
                    <span className="font-mono font-bold text-foreground bg-background px-2 py-1 rounded border border-border">{orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="text-foreground">{shippingData.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-foreground text-right">{shippingData.address}, {shippingData.city}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                    <span className="text-foreground">Amount Due</span>
                    <span className="text-primary">KES {finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* PesaPal — primary payment CTA */}
                <div className="mb-6">
                  {errors.submit && (
                    <div className="mb-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">⚠️ {errors.submit}</div>
                  )}
                  <Button
                    onClick={handlePayWithPesaPal}
                    disabled={pesapalLoading}
                    className="w-full py-4 h-auto text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl flex items-center justify-center gap-2 mb-2"
                  >
                    {pesapalLoading
                      ? <><Loader2 className="w-5 h-5 animate-spin" /> Redirecting to PesaPal…</>
                      : <><CreditCard className="w-5 h-5" /> Pay KES {finalTotal.toLocaleString()} with PesaPal</>
                    }
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Secure payment via M-Pesa, Visa, Mastercard & more through PesaPal
                  </p>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 border-t border-border" />
                  <span className="text-xs text-muted-foreground">or pay manually</span>
                  <div className="flex-1 border-t border-border" />
                </div>

                <div className="text-left mb-6">
                  <p className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" /> Manual Payment Options
                  </p>
                  <div className="space-y-2">
                    {storeSettings.payment_number && (
                      <div className="flex items-center gap-3 bg-muted rounded-lg p-4 border border-border">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">M</div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">
                            M-Pesa {storeSettings.payment_type === 'paybill' ? 'Paybill' : 'Buy Goods (Till)'}
                          </p>
                          <p className="font-bold text-foreground text-lg tracking-widest">{storeSettings.payment_number}</p>
                          {storeSettings.payment_type === 'paybill' && (
                            <p className="text-xs text-muted-foreground">Account No: <strong className="text-foreground">{orderNumber}</strong></p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Amount</p>
                          <p className="font-bold text-primary">KES {finalTotal.toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                    <a href={`https://wa.me/${storeSettings.whatsapp.replace(/\D/g, '')}?text=Hi!%20I%20placed%20order%20*${orderNumber}*%20for%20KES%20${finalTotal.toLocaleString()}.%20Please%20confirm%20payment.`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-muted rounded-lg p-4 border border-border hover:border-[#25D366] transition-colors">
                      <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">WhatsApp</p>
                        <p className="font-bold text-foreground">{storeSettings.phone}</p>
                        <p className="text-xs text-muted-foreground">Tap to send order details automatically</p>
                      </div>
                    </a>
                    <a href={`tel:${storeSettings.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 bg-muted rounded-lg p-4 border border-border hover:border-primary transition-colors">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Call Us</p>
                        <p className="font-bold text-foreground">{storeSettings.phone}</p>
                        <p className="text-xs text-muted-foreground">Mon–Sat, 8am–8pm</p>
                      </div>
                    </a>
                    <a href={`mailto:${storeSettings.email}?subject=Order ${orderNumber}&body=Hi, I placed order ${orderNumber} for KES ${finalTotal.toLocaleString()}. Please confirm.`}
                      className="flex items-center gap-3 bg-muted rounded-lg p-4 border border-border hover:border-blue-400 transition-colors">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-bold text-foreground">{storeSettings.email}</p>
                        <p className="text-xs text-muted-foreground">We reply within 1 hour</p>
                      </div>
                    </a>
                  </div>
                </div>

                <Link href="/" className="block">
                  <Button variant="outline" className="w-full py-3 h-auto font-semibold">Continue Shopping</Button>
                </Link>
              </div>
            </div>

          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">

                <div className="flex gap-1 bg-muted rounded-lg p-1">
                  {(['shipping', 'review'] as const).map((step, idx) => (
                    <div key={step} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-all ${
                      currentStep === step ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
                    }`}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        currentStep === step ? 'bg-primary text-primary-foreground' : 'bg-border text-muted-foreground'
                      }`}>{idx + 1}</span>
                      <span>{step === 'review' ? 'Review & Place' : 'Shipping'}</span>
                    </div>
                  ))}
                </div>

                {currentStep === 'shipping' && (
                  <form onSubmit={handleShippingSubmit}>
                    <div className="bg-card rounded-xl border border-border p-6 mb-4">
                      <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" /> Shipping Information
                      </h2>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Full Name" name="fullName" placeholder="Jane Doe"
                            value={shippingData.fullName} onChange={setField('fullName')}
                            error={errors.fullName} onClearError={clearError} required />
                          <Field label="Email Address" name="email" type="email" placeholder="jane@example.com"
                            value={shippingData.email} onChange={setField('email')}
                            error={errors.email} onClearError={clearError} required />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Phone Number" name="phone" type="tel" placeholder="+254 700 000 000"
                            value={shippingData.phone} onChange={setField('phone')}
                            error={errors.phone} onClearError={clearError} required />
                          <Field label="City" name="city" placeholder="Nairobi"
                            value={shippingData.city} onChange={setField('city')}
                            error={errors.city} onClearError={clearError} required />
                        </div>
                        <Field label="Street Address" name="address" placeholder="123 Kenyatta Avenue, Westlands"
                          value={shippingData.address} onChange={setField('address')}
                          error={errors.address} onClearError={clearError} required />
                        <div className="sm:w-1/2">
                          <Field label="Postal Code" name="postalCode" placeholder="00100"
                            value={shippingData.postalCode} onChange={setField('postalCode')}
                            error={errors.postalCode} onClearError={clearError} />
                        </div>
                      </div>
                    </div>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full py-3 h-auto text-base font-semibold">
                      Review Order →
                    </Button>
                  </form>
                )}

                {currentStep === 'review' && (
                  <div className="space-y-4">
                    <div className="bg-card rounded-xl border border-border p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-primary" /> Delivering To
                        </h2>
                        <button onClick={() => setCurrentStep('shipping')} className="text-sm text-primary hover:underline">Edit</button>
                      </div>
                      <div className="text-sm space-y-1">
                        <p className="font-semibold text-foreground">{shippingData.fullName}</p>
                        <p className="text-muted-foreground">{shippingData.address}, {shippingData.city}</p>
                        <p className="text-muted-foreground">{shippingData.email} · {shippingData.phone}</p>
                      </div>
                    </div>

                    <div className="bg-card rounded-xl border border-border p-6">
                      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-primary" /> Payment
                      </h2>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm space-y-1.5 text-amber-800">
                        <p className="font-semibold">After placing your order you can pay via:</p>
                        {storeSettings.payment_number && (
                          <p>📱 <strong>M-Pesa {storeSettings.payment_type === 'paybill' ? 'Paybill' : 'Till'} {storeSettings.payment_number}</strong>{storeSettings.payment_type === 'paybill' ? ' — Account: your order number' : ''}</p>
                        )}
                        <p>💬 <strong>WhatsApp</strong> {storeSettings.phone}</p>
                        <p>📞 <strong>Call</strong> {storeSettings.phone} (Mon–Sat 8am–8pm)</p>
                        <p>📧 <strong>Email</strong> {storeSettings.email}</p>
                        <p className="text-xs text-amber-600 pt-1">We confirm all orders within 30 minutes during business hours.</p>
                      </div>
                    </div>

                    {errors.submit && (
                      <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">⚠️ {errors.submit}</div>
                    )}

                    <Button onClick={handlePlaceOrder} disabled={isLoading}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground w-full py-4 h-auto text-base font-bold flex items-center justify-center gap-2 rounded-xl">
                      {isLoading
                        ? <><Loader2 className="w-5 h-5 animate-spin" /> Placing Order...</>
                        : <>Place Order — KES {finalTotal.toLocaleString()}</>
                      }
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Payment collected after order confirmation via M-Pesa or direct contact.
                    </p>
                  </div>
                )}
              </div>

              <div><OrderSummary /></div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
