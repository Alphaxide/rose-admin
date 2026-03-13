'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Heart, Share2, ArrowLeft, Minus, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { getProductById, ApiProduct } from '@/lib/api'

export const dynamic = 'force-dynamic'

const STATIC_DETAILS = {
  ingredients: 'Water, Vitamin C (15%), Hyaluronic Acid, Glycerin, Allantoin, Phenoxyethanol',
  usage: 'Apply 2-3 drops to clean skin after toning. Massage gently and allow to absorb.',
  shelf_life: '12 months after opening',
  size: '30ml',
  brand: 'BeautyLux',
}

const STATIC_SELLER = { name: 'BeautyByRose Official Store', rating: 4.9, reviews: 589 }

const STATIC_REVIEWS = [
  {
    id: '1',
    author: 'Sarah K.',
    rating: 5,
    title: 'Absolutely love this!',
    comment: 'My skin looks so much brighter after using this for 2 weeks. Highly recommend!',
    date: '2024-02-15',
  },
  {
    id: '2',
    author: 'Jane M.',
    rating: 4,
    title: 'Good product, great value',
    comment: 'Works well on my sensitive skin. A little goes a long way.',
    date: '2024-02-10',
  },
]

// ── Next.js 15: params is a Promise ──────────────────────────────────────────
export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()

  const [product, setProduct] = useState<ApiProduct | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  const [showAddedMessage, setShowAddedMessage] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    if (!id) return

    const load = async () => {
      setIsLoading(true)
      setNotFound(false)
      try {
        console.log('[ProductPage] Fetching product id:', id)
        const data = await getProductById(id)
        console.log('[ProductPage] Response:', data)
        if (!data) {
          setNotFound(true)
        } else {
          setProduct(data)
          setIsWishlisted(isInWishlist(id))
        }
      } catch (e) {
        console.error('[ProductPage] Failed to load product:', e)
        setNotFound(true)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [id]) // ← removed isInWishlist from deps to prevent infinite re-fetch

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading product...</p>
        </main>
        <Footer />
      </div>
    )
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (notFound || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-lg font-semibold text-foreground">Product not found</p>
          <p className="text-muted-foreground text-sm">
            This product may have been removed or the link is incorrect.
          </p>
          <Link href="/products" className="text-primary underline">
            Back to Products
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  // ── Computed values ───────────────────────────────────────────────────────
  const images = product.image_urls?.length > 0 ? product.image_urls : ['/placeholder.jpg']
  const imageUrl = product.thumbnail_url ?? images[0]

  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAddToCart = async () => {
    setIsAdding(true)
    addItem({
      product_id: product.id,
      quantity,
      name:      product.name,
      price:     product.price,
      image_url: imageUrl ?? '',
    })
    setShowAddedMessage(true)
    setTimeout(() => {
      setShowAddedMessage(false)
      setIsAdding(false)
    }, 2000)
  }

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        product_id: product.id,
        name:      product.name,
        price:     product.price,
        image_url: imageUrl ?? '',
      })
    }
    setIsWishlisted(!isWishlisted)
  }

  const handleShare = async () => {
    try {
      await navigator.share({ title: product.name, url: window.location.href })
    } catch {
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* Back */}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">

            {/* ── Images ── */}
            <div className="space-y-4">
              <div
                className="relative bg-muted rounded-md overflow-hidden aspect-square"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = '/placeholder.jpg'
                  }}
                />
                {discountPercentage > 0 && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-md font-bold text-sm">
                    -{discountPercentage}%
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-primary'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Product view ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Product info ── */}
            <div className="space-y-6">

              {/* Seller */}
              <div
                className="flex items-center justify-between p-4 bg-muted rounded-md border border-border"
                style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
              >
                <div>
                  <p className="text-sm text-muted-foreground">Sold by</p>
                  <p className="font-semibold text-foreground">{STATIC_SELLER.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">★ {STATIC_SELLER.rating}</p>
                  <p className="text-xs text-muted-foreground">({STATIC_SELLER.reviews} reviews)</p>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-4xl font-bold text-foreground">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.rating)
                          ? 'fill-primary text-primary'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-foreground">{product.rating}</span>
                <span className="text-muted-foreground text-sm">
                  ({product.review_count} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-primary">
                    KES {product.price.toLocaleString()}
                  </span>
                  {product.original_price && (
                    <span className="text-xl text-muted-foreground line-through">
                      KES {product.original_price.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.original_price && (
                  <p className="text-sm text-green-600 font-semibold">
                    You save KES {(product.original_price - product.price).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Stock */}
              <div
                className={`p-3 rounded-md border text-sm font-semibold ${
                  product.in_stock
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                {product.in_stock
                  ? `✓ ${product.stock_quantity} in stock — Order now!`
                  : '✗ Out of stock'}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed text-sm">
                {product.description}
              </p>

              {/* Quantity + Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-foreground font-semibold">Quantity:</span>
                  <div className="flex items-center border border-border rounded-md overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={isAdding || quantity <= 1}
                      className="p-3 hover:bg-muted transition-colors border-r border-border disabled:opacity-40"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold text-foreground">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      disabled={isAdding || quantity >= product.stock_quantity}
                      className="p-3 hover:bg-muted transition-colors border-l border-border disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={!product.in_stock || isAdding}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 h-auto text-lg font-semibold flex items-center justify-center gap-2 rounded-md"
                >
                  {isAdding && <Loader2 className="w-5 h-5 animate-spin" />}
                  {product.in_stock
                    ? isAdding ? 'Adding to Cart...' : 'Add to Cart'
                    : 'Out of Stock'}
                </Button>

                {showAddedMessage && (
                  <div className="p-3 bg-green-50 text-green-700 rounded-md text-center font-semibold border border-green-200 text-sm">
                    ✓ Added {quantity} item{quantity > 1 ? 's' : ''} to cart!
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleWishlist}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 border rounded-md transition-colors font-semibold text-sm ${
                      isWishlisted
                        ? 'border-red-300 bg-red-50 text-red-600'
                        : 'border-border hover:bg-muted text-foreground'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    {isWishlisted ? 'Saved' : 'Wishlist'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-border rounded-md hover:bg-muted transition-colors text-foreground font-semibold text-sm"
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Details & Reviews ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">

              {/* Product details */}
              <div className="bg-card rounded-lg border border-border p-6 md:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Product Details</h2>
                <div className="space-y-4">
                  {([
                    ['Size', STATIC_DETAILS.size],
                    ['Brand', STATIC_DETAILS.brand],
                    ['Ingredients', STATIC_DETAILS.ingredients],
                    ['How to Use', STATIC_DETAILS.usage],
                    ['Shelf Life', STATIC_DETAILS.shelf_life],
                  ] as [string, string][]).map(([label, value]) => (
                    <div key={label} className="grid grid-cols-3 gap-4">
                      <p className="font-semibold text-foreground text-sm">{label}</p>
                      <p className="text-muted-foreground text-sm col-span-2">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-card rounded-lg border border-border p-6 md:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Customer Reviews</h2>
                <div className="space-y-6">
                  {STATIC_REVIEWS.map((review) => (
                    <div key={review.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-foreground">{review.author}</p>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-primary text-primary'
                                  : 'text-muted'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <h4 className="font-semibold text-foreground mb-1 text-sm">{review.title}</h4>
                      <p className="text-muted-foreground text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-bold text-foreground mb-4">Shipping Info</h3>
                <div className="space-y-3 text-sm">
                  {([
                    ['📦', 'Free Shipping', 'On orders over KES 5,000'],
                    ['⏱️', 'Fast Delivery', '1–3 days in Nairobi'],
                    ['✓', 'Verified Seller', '100% Authentic Products'],
                  ] as [string, string, string][]).map(([icon, title, sub]) => (
                    <div key={title} className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-0.5">{icon}</span>
                      <div>
                        <p className="font-semibold text-foreground">{title}</p>
                        <p className="text-muted-foreground text-xs">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-bold text-foreground mb-3">Return Policy</h3>
                <p className="text-sm text-muted-foreground">
                  7-day easy returns. No questions asked. Full refund or exchange.
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-bold text-foreground mb-3">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Questions about this product?
                </p>
                <Link
                  href="/contact"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Contact Support →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}