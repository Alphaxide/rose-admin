'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    original_price?: number | null
    image_urls: string[]
    thumbnail_url?: string | null
    rating: number
    review_count: number
    stock_quantity: number
    description: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()                           // ← was addToCart
  const { addItem: addToWishlist, removeItem, isInWishlist } = useWishlist()
  const [isAdding, setIsAdding] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id))
  }, [product.id, isInWishlist])

  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  const inStock = product.stock_quantity > 0

  const imageUrl = product.thumbnail_url ?? product.image_urls?.[0] ?? '/placeholder.jpg'

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsAdding(true)
    addItem({                                             // ← was addToCart(positional args)
      product_id: product.id,
      name:       product.name,
      price:      product.price,
      image_url:  imageUrl,
      quantity:   1,
    })
    setShowNotification(true)
    setTimeout(() => {
      setIsAdding(false)
      setShowNotification(false)
    }, 2000)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isWishlisted) {
      removeItem(product.id)
    } else {
      addToWishlist({
        product_id: product.id,
        name:       product.name,
        price:      product.price,
        image_url:  imageUrl,
      })
    }
    setIsWishlisted(!isWishlisted)
  }

  return (
    <Link href={`/product/${product.id}`}>
      <div
        className="bg-card rounded-md border border-border overflow-hidden hover:shadow-sm transition-shadow h-full flex flex-col"
        style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
      >
        {/* Image */}
        <div className="relative bg-muted aspect-square overflow-hidden group">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {discountPercentage > 0 && (
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-sm">
              -{discountPercentage}%
            </div>
          )}

          {!inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}

          <button
            onClick={handleWishlist}
            className={`absolute top-3 left-3 rounded-full p-2 transition-all ${
              isWishlisted
                ? 'bg-primary text-primary-foreground'
                : 'bg-white/80 hover:bg-white text-primary'
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <span className="text-xs text-muted-foreground mb-2">Beauty Product</span>

          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 text-sm md:text-base">
            {product.name}
          </h3>

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

          <p className="text-xs text-muted-foreground mb-4">
            {inStock ? `${product.stock_quantity} in stock` : 'Out of stock'}
          </p>

          {showNotification && (
            <div className="p-2 mb-2 bg-green-50 border border-green-200 rounded-md text-center">
              <p className="text-xs font-semibold text-green-700">Added to cart!</p>
            </div>
          )}

          <Button
            disabled={!inStock || isAdding}
            onClick={handleAddToCart}
            className="w-full mt-auto bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            {isAdding ? 'Adding...' : inStock ? 'Add to Cart' : 'Unavailable'}
          </Button>
        </div>
      </div>
    </Link>
  )
}