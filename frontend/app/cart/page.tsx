'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/context/CartContext'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart()
  const [promoCode, setPromoCode] = useState('')

  const shippingFee = totalPrice > 5000 ? 0 : 300
  const taxAmount = Math.round(totalPrice * 0.16)
  const finalTotal = totalPrice + shippingFee + taxAmount

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Shopping Cart</h1>
          </div>

          {items.length === 0 ? (
            // Empty Cart
            <div className="flex flex-col items-center justify-center py-16 bg-card rounded-md border border-border" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6 text-center">
                Explore our collection of premium beauty products
              </p>
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            // Cart Content
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-md border border-border overflow-hidden" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  {items.map((item) => (
                    <div
                      key={item.product_id}
                      className="p-4 md:p-6 border-b border-border last:border-b-0 flex gap-4"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-lg font-bold text-primary">
                            KES {item.price.toLocaleString()}
                          </p>
                        </div>

                        {/* Quantity Control */}
                        <div className="flex items-center gap-2 border border-border rounded-md w-fit">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="p-2 hover:bg-muted transition-colors border-r border-border"
                          >
                            <Minus className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <span className="w-8 text-center font-semibold text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="p-2 hover:bg-muted transition-colors border-l border-border"
                          >
                            <Plus className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal & Remove */}
                      <div className="flex flex-col items-end justify-between">
                        <p className="text-sm text-muted-foreground">
                          Subtotal: KES {(item.price * item.quantity).toLocaleString()}
                        </p>
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <Link href="/" className="inline-block mt-6">
                  <Button variant="outline" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

                  {/* Promo Code */}
                  <div className="mb-6">
                    <label className="text-sm font-semibold text-foreground block mb-2">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="text-sm"
                      />
                      <Button variant="outline" className="px-4">
                        Apply
                      </Button>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 py-4 border-y border-border mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground font-medium">
                        KES {totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Shipping {totalPrice > 5000 && <span className="text-accent">(Free)</span>}
                      </span>
                      <span className="text-foreground font-medium">
                        KES {shippingFee.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (16%)</span>
                      <span className="text-foreground font-medium">
                        KES {taxAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      KES {finalTotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <Link href="/checkout" className="w-full block">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base py-3 h-auto">
                      Proceed to Checkout
                    </Button>
                  </Link>

                  {/* Info */}
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Free shipping on orders over KES 5,000
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
