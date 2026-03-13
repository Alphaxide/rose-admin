'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Upload, X, Loader2, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Category } from '@/lib/mock-data'
import Image from 'next/image'

const schema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  originalPrice: z.coerce.number().positive().optional().or(z.literal('')),
  categoryId: z.coerce.number().min(1, 'Please select a category'),
  stockQuantity: z.coerce.number().int().min(0, 'Stock cannot be negative'),
})

type FormValues = z.infer<typeof schema>

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loadingProduct, setLoadingProduct] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then(setCategories)
      .catch(console.error)
  }, [])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`)
        if (!res.ok) throw new Error('Failed to fetch product')
        const data = await res.json()
        reset({
          name: data.name,
          description: data.description,
          price: data.price,
          originalPrice: data.originalPrice ?? '',
          categoryId: data.categoryId,
          stockQuantity: data.stockQuantity,
        })
        setCurrentImage(data.image || null)
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : 'Failed to load product')
      } finally {
        setLoadingProduct(false)
      }
    }

    fetchProduct()
  }, [params.id, reset])

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function removeNewImage() {
    setImageFile(null)
    setImagePreview(null)
  }

  async function uploadImage(file: File): Promise<string | null> {
    const ext = file.name.split('.').pop()
    const path = `products/${Date.now()}.${ext}`

    const { error } = await supabase.storage
      .from('product-images')
      .upload(path, file, { upsert: false })

    if (error) throw new Error(`Image upload failed: ${error.message}`)

    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
  }

  async function onSubmit(values: FormValues) {
    setSubmitError(null)
    try {
      let imageUrl: string | null = null

      if (imageFile) {
        setUploading(true)
        imageUrl = await uploadImage(imageFile)
        setUploading(false)
      }

      const payload = {
        name: values.name,
        description: values.description,
        price: values.price,
        originalPrice: values.originalPrice || null,
        categoryId: values.categoryId,
        stockQuantity: values.stockQuantity,
        imageUrl,
      }

      const res = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update product')

      router.push(`/admin/products/${params.id}`)
    } catch (err) {
      setUploading(false)
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  const busy = isSubmitting || uploading
  const displayImage = imagePreview ?? currentImage

  if (loadingProduct) {
    return (
      <div className="p-8 max-w-3xl space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse w-48" />
        <div className="h-56 bg-muted rounded animate-pulse" />
        <div className="h-56 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="p-8 max-w-3xl">
        <Card className="p-6">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <p>{loadError}</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">Update product details</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload */}
        <Card className="p-6">
          <h2 className="text-sm font-semibold mb-4">Product Image</h2>
          {displayImage ? (
            <div className="relative w-full h-56 rounded-lg overflow-hidden bg-muted">
              <Image src={displayImage} alt="Preview" fill className="object-cover" />
              {imagePreview && (
                <button
                  type="button"
                  onClick={removeNewImage}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {!imagePreview && (
                <label className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-md cursor-pointer hover:bg-black/80 flex items-center gap-1.5">
                  <Upload className="w-3 h-3" />
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">Click to upload image</span>
              <span className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 5MB</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </Card>

        {/* Basic Info */}
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-semibold">Basic Information</h2>

          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" placeholder="e.g. Rose Glow Serum" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={4}
              placeholder="Describe the product..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <select
              id="categoryId"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              {...register('categoryId')}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-destructive">{errors.categoryId.message}</p>
            )}
          </div>
        </Card>

        {/* Pricing & Stock */}
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-semibold">Pricing & Stock</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (KES)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('price')}
              />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="originalPrice">
                Original Price (KES){' '}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('originalPrice')}
              />
              {errors.originalPrice && (
                <p className="text-xs text-destructive">{errors.originalPrice.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stockQuantity">Stock Quantity</Label>
            <Input
              id="stockQuantity"
              type="number"
              placeholder="0"
              {...register('stockQuantity')}
            />
            {errors.stockQuantity && (
              <p className="text-xs text-destructive">{errors.stockQuantity.message}</p>
            )}
          </div>
        </Card>

        {submitError && (
          <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-md">
            {submitError}
          </p>
        )}

        <div className="flex gap-3 pb-8">
          <Button type="submit" disabled={busy} className="min-w-36">
            {busy ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {uploading ? 'Uploading...' : 'Saving...'}
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
