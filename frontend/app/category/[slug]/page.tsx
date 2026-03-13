'use client'

/**
 * Category page — fetches data from the `categories-api` Supabase Edge Function.
 *
 * Add to .env.local:
 *   NEXT_PUBLIC_CATEGORIES_API_URL=https://<project-ref>.functions.supabase.co/categories-api
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
 */

import { useState, useEffect, useCallback, use } from 'react'
import Link from 'next/link'
import { ChevronLeft, ArrowUpDown, Menu, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/ProductCard'
import ProductFilters from '@/components/ProductFilters'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Category {
  id: string
  name: string
  slug: string
  image: string | null
}

interface Product {
  id: string
  name: string
  price: number
  original_price: number | null
  category_id: string
  rating: number
  review_count: number
  stock_quantity: number
  in_stock: boolean
  description: string
  image_urls: string[]
  thumbnail_url: string | null
}

// ─── API helpers ──────────────────────────────────────────────────────────────
const BASE = process.env.NEXT_PUBLIC_CATEGORIES_API_URL || ''
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY  || ''
const apiHeaders = () => ({
  'Content-Type': 'application/json',
  ...(ANON ? { Authorization: `Bearer ${ANON}` } : {}),
})

async function apiFetch<T>(path: string): Promise<T> {
  const res  = await fetch(`${BASE}${path}`, { headers: apiHeaders() })
  const data = await res.json()
  if (!res.ok || data.status === 'error') throw new Error(data.message ?? `Error ${res.status}`)
  return data as T
}

const getAllCategories = () =>
  apiFetch<{ status: string; data: Category[] }>('/').then((r) => r.data)

const getCategoryProducts = (
  slug: string,
  opts: { sortBy?: string; minPrice?: number; maxPrice?: number; limit?: number }
) => {
  const params = new URLSearchParams()
  if (opts.sortBy)                 params.set('sortBy',   opts.sortBy)
  if (opts.minPrice !== undefined) params.set('minPrice', String(opts.minPrice))
  if (opts.maxPrice !== undefined) params.set('maxPrice', String(opts.maxPrice))
  if (opts.limit    !== undefined) params.set('limit',    String(opts.limit))
  const qs = params.toString()
  return apiFetch<{ status: string; category: Category; data: Product[]; total: number }>(
    `/${slug}/products${qs ? `?${qs}` : ''}`
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  // Unwrap params Promise (required in Next.js 15+)
  const { slug } = use(params)

  const [sortBy, setSortBy]           = useState('rating')
  const [priceRange, setPriceRange]   = useState([0, 10000])
  const [showFilters, setShowFilters] = useState(false)

  const [categories, setCategories] = useState<Category[]>([])
  const [category,   setCategory]   = useState<Category | null>(null)
  const [products,   setProducts]   = useState<Product[]>([])

  const [loadingPage,     setLoadingPage]     = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [error,           setError]           = useState<string | null>(null)

  // Load sidebar categories once
  useEffect(() => {
    getAllCategories()
      .then(setCategories)
      .catch((e) => console.error('Failed to load categories:', e))
  }, [])

  // Load category + products (re-runs on filter / sort change)
  const loadProducts = useCallback(async () => {
    setLoadingProducts(true)
    setError(null)
    try {
      const res = await getCategoryProducts(slug, {
        sortBy,
        minPrice: priceRange[0] > 0     ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 10000 ? priceRange[1] : undefined,
        limit: 60,
      })
      setCategory(res.category)
      setProducts(res.data)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong'
      setError(msg.toLowerCase().includes('not found') ? 'category_not_found' : msg)
      setProducts([])
    } finally {
      setLoadingProducts(false)
      setLoadingPage(false)
    }
  }, [slug, sortBy, priceRange])

  useEffect(() => { loadProducts() }, [loadProducts])

  // ── Initial loading ──────────────────────────────────────────────────────────
  if (loadingPage) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading category...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // ── Category not found ───────────────────────────────────────────────────────
  if (error === 'category_not_found') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Category not found</h1>
          <p className="text-muted-foreground mb-6">
            No category matched{' '}
            <code className="bg-muted px-2 py-1 rounded text-sm">{slug}</code>
          </p>
          <Link href="/"><Button>Back to Home</Button></Link>
        </main>
        <Footer />
      </div>
    )
  }

  // ── Main ─────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Header */}
        <div className="bg-muted border-b border-border py-6 px-4">
          <div className="max-w-6xl mx-auto">
            <Link href="/" className="flex items-center gap-2 text-primary hover:underline mb-4">
              <ChevronLeft className="w-4 h-4" /> Back
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {category?.name ?? slug}
            </h1>
            <p className="text-muted-foreground">
              {loadingProducts
                ? 'Loading products...'
                : `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Mobile filter toggle */}
          <div className="md:hidden mb-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className={`w-full flex items-center justify-center gap-2 font-semibold rounded-md ${
                showFilters
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:bg-muted'
              }`}
            >
              <Menu className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className={`${showFilters ? 'block' : 'hidden'} md:block md:col-span-1`}>
              <div className="md:sticky md:top-24">
                <ProductFilters
                  categories={categories}
                  selectedCategory={category?.id}
                  priceRange={priceRange}
                  onCategoryChange={() => {}}
                  onPriceChange={setPriceRange}
                  onCloseFilters={() => setShowFilters(false)}
                />
              </div>
            </div>

            {/* Products */}
            <div className="md:col-span-3">
              {/* Sort bar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">{products.length} items</p>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                  >
                    <option value="rating">Top Rated</option>
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {loadingProducts ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-square bg-muted rounded-md animate-pulse" />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={loadProducts}>Retry</Button>
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <ShoppingBag className="w-16 h-16 text-muted mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
                  <p className="text-muted-foreground text-sm mb-4">Try adjusting your filters</p>
                  <Button onClick={() => setPriceRange([0, 10000])}>Clear Filters</Button>
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