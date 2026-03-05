import { NextRequest, NextResponse } from 'next/server'
import { products, categories } from '@/lib/mock-data'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const productId = parseInt(params.id)
  const product = products.find(p => p.id === productId)
  
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  const category = categories.find(c => c.id === product.categoryId)

  return NextResponse.json({ ...product, category })
}
