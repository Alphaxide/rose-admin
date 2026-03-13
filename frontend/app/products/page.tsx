'use client'

import { useState, useEffect, useCallback } from 'react'
import { ShoppingBag, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/ProductCard'
import ProductFilters from '@/components/ProductFilters'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getProducts, getCategories, ApiProduct, ApiCategory } from '@/lib/api'

export const dynamic = 'force-dynamic'

export default function ProductsPage() {
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [isLoading, setIsLoading] = useState(true)

  // Load categories once on mount
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((e) => console.error('Failed to load categories:', e))
  }, [])

  // Reload products whenever filters or sort change
  const loadProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getProducts({
        category: selectedCategory ?? undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 10000 ? priceRange[1] : undefined,
        sortBy: sortBy as 'newest' | 'price-asc' | 'price-desc' | 'rating',
      })
      setProducts(data)
    } catch (e) {
      console.error('Failed to load products:', e)
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory, priceRange, sortBy])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 w-full">
        {/* Page header */}
        <div className="bg-muted border-b border-border py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">All Products</h1>
            <p className="text-muted-foreground text-sm">
              Browse our complete collection of beauty products
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-6 flex-col md:flex-row">

            {/* Mobile filter toggle */}
            <div className="md:hidden">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className={`w-full flex items-center justify-center gap-2 font-semibold rounded-md ${
                  showFilters
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-foreground hover:bg-muted'
                }`}
              >
                <Menu className="w-5 h-5" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>

            {/* Filters sidebar */}
            <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-64 flex-shrink-0`}>
              <div className="md:sticky md:top-24">
                <ProductFilters
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  priceRange={priceRange}
                  onPriceChange={setPriceRange}
                  onCloseFilters={() => setShowFilters(false)}
                />
              </div>
            </div>

            {/* Products grid */}
            <div className="flex-1">

              {/* Sort + count bar */}
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-border flex-wrap gap-3">
                <p className="text-sm text-muted-foreground">
                  {isLoading ? 'Loading...' : `${products.length} products`}
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              {/* Skeleton loader */}
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-3">
                      <div className="aspect-square bg-muted rounded-md animate-pulse" />
                      <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <ShoppingBag className="w-16 h-16 text-muted mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
                  <p className="text-muted-foreground text-sm mb-4">Try adjusting your filters</p>
                  <Button
                    onClick={() => {
                      setSelectedCategory(null)
                      setPriceRange([0, 10000])
                    }}
                  >
                    Clear Filters
                  </Button>
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