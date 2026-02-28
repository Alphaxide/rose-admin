import { mockProducts } from '@/lib/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get('categoryId')

  let products = mockProducts

  if (categoryId) {
    products = products.filter((p) => p.categoryId === parseInt(categoryId))
  }

  return Response.json(products)
}
