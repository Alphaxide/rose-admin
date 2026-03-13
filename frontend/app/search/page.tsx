'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, SearchX } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'

// ── Search backend ─────────────────────────────────────────────────────────────
const FUNCTION_URL = process.env.NEXT_PUBLIC_SEARCH_FUNCTION_URL!
const ANON_KEY     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

interface Product {
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
  in_stock: boolean
  description: string
}

// In-memory cache
const cache = new Map<string, Product[]>()

async function searchProducts(query: string): Promise<Product[]> {
  if (cache.has(query)) return cache.get(query)!

  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
      'apikey':        ANON_KEY,
    },
    body: JSON.stringify({ query, limit: 40 }),
  })

  const data = await res.json()
  console.log('[SearchPage] response:', data)

  if (!res.ok) throw new Error(data.message ?? `HTTP ${res.status}`)

  const results: Product[] = Array.isArray(data) ? data : (data.data ?? data.results ?? [])
  cache.set(query, results)
  return results
}

// ── Search content ────────────────────────────────────────────────────────────
function SearchContent() {
  const searchParams = useSearchParams()
  const query        = searchParams.get('q')?.trim() ?? ''

  const [results,   setResults]   = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [sortBy,    setSortBy]    = useState('relevance')

  useEffect(() => {
    if (!query) { setResults([]); return }

    const run = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await searchProducts(query)
        setResults(data)
      } catch (e: unknown) {
        console.error('[SearchPage] error:', e)
        setError((e as Error).message ?? 'Search failed')
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }
    run()
  }, [query])

  // Client-side sort — no re-fetch
  const sorted = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':  return a.price - b.price
      case 'price-desc': return b.price - a.price
      case 'rating':     return b.rating - a.rating
      default:           return 0
    }
  })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Page header */}
        <div className="bg-muted border-b border-border py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">Search Results</h1>
            <p className="text-muted-foreground text-sm">
              {query ? `Results for "${query}"` : 'Enter a search term above'}
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-10">

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-24 gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <p className="text-muted-foreground">Searching for "{query}"...</p>
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700 font-semibold">{error}</p>
              <p className="text-red-500 text-xs mt-1">Check browser console for details</p>
            </div>
          )}

          {/* No query */}
          {!isLoading && !error && !query && (
            <div className="text-center py-24">
              <SearchX className="w-14 h-14 text-muted mx-auto mb-4" />
              <p className="text-foreground font-semibold mb-1">What are you looking for?</p>
              <p className="text-muted-foreground text-sm">Use the search bar above</p>
            </div>
          )}

          {/* Results */}
          {!isLoading && !error && query && results.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border flex-wrap gap-3">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">{results.length}</strong>{' '}
                  product{results.length !== 1 ? 's' : ''} for "{query}"
                </p>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">Sort:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {sorted.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}

          {/* No results */}
          {!isLoading && !error && query && results.length === 0 && (
            <div className="text-center py-24">
              <SearchX className="w-14 h-14 text-muted mx-auto mb-4" />
              <p className="text-foreground font-semibold mb-1">No products found</p>
              <p className="text-muted-foreground text-sm">No results for "{query}"</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}