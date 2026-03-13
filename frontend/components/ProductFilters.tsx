'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ProductFiltersProps {
  categories: Array<{ id: string; name: string; slug: string }>
  selectedCategory: string | null
  onCategoryChange: (categoryId: string | null) => void
  priceRange: [number, number]
  onPriceChange: (range: [number, number]) => void
  onCloseFilters?: () => void
}

export default function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  onCloseFilters,
}: ProductFiltersProps) {
  return (
    <div className="bg-card rounded-md border border-border p-4 md:p-6" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      {/* Close Button (Mobile) */}
      <div className="flex items-center justify-between mb-6 md:hidden">
        <h2 className="text-lg font-bold text-foreground">Filters</h2>
        <button
          onClick={onCloseFilters}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <h2 className="hidden md:block text-lg font-bold text-foreground mb-6">Filters</h2>

      {/* Categories */}
      <div className="mb-8">
        <h3 className="font-semibold text-foreground mb-4">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
              selectedCategory === null
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h3 className="font-semibold text-foreground mb-4">Price Range</h3>
        <div className="space-y-4">
          {/* Min Price */}
          <div>
            <label className="text-sm text-muted-foreground block mb-2">
              Minimum: KES {priceRange[0].toLocaleString()}
            </label>
            <Input
              type="range"
              min="0"
              max="10000"
              value={priceRange[0]}
              onChange={(e) => {
                const newMin = parseInt(e.target.value)
                if (newMin <= priceRange[1]) {
                  onPriceChange([newMin, priceRange[1]])
                }
              }}
              className="w-full"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="text-sm text-muted-foreground block mb-2">
              Maximum: KES {priceRange[1].toLocaleString()}
            </label>
            <Input
              type="range"
              min="0"
              max="10000"
              value={priceRange[1]}
              onChange={(e) => {
                const newMax = parseInt(e.target.value)
                if (newMax >= priceRange[0]) {
                  onPriceChange([priceRange[0], newMax])
                }
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <Button
        variant="outline"
        onClick={() => {
          onCategoryChange(null)
          onPriceChange([0, 10000])
        }}
        className="w-full"
      >
        Reset Filters
      </Button>
    </div>
  )
}
