'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ShoppingBag, Menu, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/ProductCard'
import ProductFilters from '@/components/ProductFilters'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getProducts, getCategories, ApiProduct, ApiCategory } from '@/lib/api'

export default function Home() {
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<ApiProduct[]>([])
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true)
  const [isLoadingAll, setIsLoadingAll] = useState(true)

  // Load categories + featured products once
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((e) => console.error('Failed to load categories:', e))

    getProducts({ sortBy: 'rating', limit: 4 })
      .then((data) => setFeaturedProducts(data))
      .catch((e) => console.error('Failed to load featured products:', e))
      .finally(() => setIsLoadingFeatured(false))
  }, [])

  // Reload all-products section when filters/sort change
  const loadAllProducts = useCallback(async () => {
    setIsLoadingAll(true)
    try {
      const data = await getProducts({
        category: selectedCategory ?? undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 10000 ? priceRange[1] : undefined,
        sortBy: sortBy as 'newest' | 'price-asc' | 'price-desc' | 'rating',
      })
      setAllProducts(data)
    } catch (e) {
      console.error('Failed to load products:', e)
      setAllProducts([])
    } finally {
      setIsLoadingAll(false)
    }
  }, [selectedCategory, priceRange, sortBy])

  useEffect(() => {
    loadAllProducts()
  }, [loadAllProducts])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 w-full">
        {/* Hero */}
        <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-8 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <span className="text-sm font-semibold">Welcome to BeautyByRose</span>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-balance">
              Premium Beauty Products
            </h1>
            <p className="text-primary-foreground/90 text-base md:text-lg mb-6 max-w-2xl">
              Discover the finest skincare, makeup, haircare and fragrances. Same day delivery in Nairobi!
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-card py-8 px-4 border-b border-border">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-6">Shop by Category</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className={`flex flex-col items-center justify-center rounded-md border transition-all overflow-hidden ${
                    selectedCategory === category.id
                      ? 'border-primary border-2'
                      : 'border-border hover:border-primary/30'
                  }`}
                  onClick={() =>
                    setSelectedCategory(category.id === selectedCategory ? null : category.id)
                  }
                  style={
                    selectedCategory === category.id
                      ? { boxShadow: '0 2px 8px rgba(246, 139, 30, 0.2)' }
                      : {}
                  }
                >
                  <div className="relative w-full aspect-square">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors flex items-end justify-center pb-2">
                      <span className="text-xs md:text-sm font-semibold text-white text-center px-1">
                        {category.name}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Featured Products</h2>
            <Link
              href="/products"
              className="text-primary hover:text-primary/80 font-semibold flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {isLoadingFeatured ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-md animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Promo Banner */}
        <section className="bg-primary text-primary-foreground py-8 px-4 my-8">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Limited Time Offer</h3>
            <p className="text-base md:text-lg mb-6">
              Get 20% OFF on your first order with code WELCOME20
            </p>
            <Link href="#all-products">
              <Button
                size="lg"
                className="font-semibold bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Shop Now
              </Button>
            </Link>
          </div>
        </section>

        {/* All Products */}
        <section id="all-products" className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex gap-4 flex-col md:flex-row">
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
                <Menu className="w-5 h-5" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>

            {/* Filters Sidebar */}
            <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-64 flex-shrink-0`}>
              <ProductFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                onCloseFilters={() => setShowFilters(false)}
              />
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border flex-wrap gap-3">
                <p className="text-sm text-muted-foreground">
                  Showing {allProducts.length} products
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

              {isLoadingAll ? (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-square bg-muted rounded-md animate-pulse" />
                  ))}
                </div>
              ) : allProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                  {allProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <ShoppingBag className="w-16 h-16 text-muted mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
                  <p className="text-muted-foreground text-sm">
                    Try adjusting your filters
                  </p>
                  <Button
                    className="mt-4"
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
        </section>

        {/* Why Choose Us */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            Why Choose BeautyByRose?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: 'Authentic Products', desc: '100% genuine beauty brands', icon: '✓' },
              { title: 'Fast Delivery', desc: 'Same day delivery in Nairobi', icon: '🚚' },
              { title: 'Best Prices', desc: 'Competitive prices & discounts', icon: '💰' },
              { title: 'Secure Payment', desc: 'Safe M-Pesa & card payments', icon: '🔒' },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-md bg-card border border-border hover:border-primary transition-all"
                style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}