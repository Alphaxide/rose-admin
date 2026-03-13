'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Star, ArrowLeft, AlertCircle, Pencil, Trash2, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ProductDetail {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  categoryId: number
  rating: number
  reviewCount: number
  stockQuantity: number
  inStock: boolean
  image: string
  createdAt: string
  category?: {
    id: number
    name: string
    slug: string
    image: string
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch product')
        const data = await response.json()
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/products/${params.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete product')
      }
      router.push('/admin/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-muted rounded animate-pulse" />
        <div className="h-96 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <p>{error || 'Product not found'}</p>
        </div>
      </Card>
    )
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Product Image */}
        <Card className="lg:col-span-2 p-6">
          <div className="relative w-full h-96 rounded-lg overflow-hidden bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        </Card>

        {/* Product Info Sidebar */}
        <div className="space-y-4">
          {/* Status Card */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Stock:</span>
                <Badge variant={product.inStock ? 'default' : 'destructive'}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Quantity:</span>
                <span className="font-semibold">{product.stockQuantity}</span>
              </div>
            </div>
          </Card>

          {/* Pricing Card */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Pricing</h3>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">KES {product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-sm line-through text-muted-foreground">
                      KES {product.originalPrice.toLocaleString()}
                    </span>
                    <Badge variant="secondary">{discount}% off</Badge>
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* Rating Card */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Rating</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Product Details */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
        <div className="flex gap-3 mb-6">
          {product.category && (
            <Badge variant="outline">{product.category.name}</Badge>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">Product ID</p>
              <p className="font-semibold">{product.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category ID</p>
              <p className="font-semibold">{product.categoryId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-semibold">
                {new Date(product.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-semibold">{product.inStock ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t border-border">
          <Button
            onClick={() => router.push(`/admin/products/${product.id}/edit`)}
            className="gap-2"
          >
            <Pencil className="w-4 h-4" />
            Edit Product
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2" disabled={deleting}>
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete Product
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete &quot;{product.name}&quot;?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The product and all its associated images will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>
    </div>
  )
}
