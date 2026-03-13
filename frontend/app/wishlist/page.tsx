'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ArrowLeft, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import { mockProducts } from '@/lib/products'

export default function WishlistPage() {
  const { items: wishlistItems, removeItem } = useWishlist()
  const { addToCart } = useCart()

  const wishlistProducts = mockProducts.filter((product) =>
    wishlistItems.some((item) => item.product_id === product.id)
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link href="/" className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">
              Save your favorite products and get notified when they go on sale
            </p>
          </div>

          {/* Empty State */}
          {wishlistProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-card rounded-md border border-border" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <Heart className="w-16 h-16 text-muted mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Start adding your favorite beauty products to your wishlist!
              </p>
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map((product) => (
                <div key={product.id} className="bg-card rounded-md border border-border overflow-hidden" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <Image
                      src={product.thumbnail_url || product.image_urls[0]}
                      alt={product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-lg font-bold text-foreground">
                        KES {product.price.toLocaleString()}
                      </span>
                      {product.original_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          KES {product.original_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          addToCart(product.id, product.name, product.price, product.thumbnail_url || product.image_urls[0], 1)
                        }}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
                      >
                        Add to Cart
                      </Button>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="p-2 border border-border rounded-md hover:bg-muted transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
