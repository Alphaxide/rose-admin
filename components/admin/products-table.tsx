'use client'

import { Product } from '@/lib/mock-data'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'
import Image from 'next/image'

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="text-left px-6 py-4 font-semibold">Product</th>
              <th className="text-left px-6 py-4 font-semibold">Category</th>
              <th className="text-left px-6 py-4 font-semibold">Price</th>
              <th className="text-left px-6 py-4 font-semibold">Stock</th>
              <th className="text-left px-6 py-4 font-semibold">Rating</th>
              <th className="text-left px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.categoryId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {product.categoryId === 1 && 'Skincare'}
                  {product.categoryId === 2 && 'Makeup'}
                  {product.categoryId === 3 && 'Hair Care'}
                  {product.categoryId === 4 && 'Fragrance'}
                </td>
                <td className="px-6 py-4 font-medium">
                  KES {product.price.toLocaleString()}
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground ml-2 line-through">
                      KES {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{product.stockQuantity}</span>
                    {product.stockQuantity < 50 && (
                      <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-800">
                        Low Stock
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    className={product.inStock ? 'bg-green-100 text-green-800 border-0' : 'bg-red-100 text-red-800 border-0'}
                    variant="outline"
                  >
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
