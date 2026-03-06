import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get('categoryId')

  const { data, error } = await supabaseAdmin.rpc('get_products', {
    category_id_filter: categoryId ? parseInt(categoryId) : null,
  })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name, description, price, originalPrice, categoryId, stockQuantity, imageUrl } = body

  // Insert product
  const { data: product, error: productError } = await supabaseAdmin
    .from('products')
    .insert({
      name,
      description,
      price,
      original_price: originalPrice ?? null,
      category_id: categoryId,
      stock_quantity: stockQuantity,
    })
    .select()
    .single()

  if (productError) return Response.json({ error: productError.message }, { status: 500 })

  // Insert image record if an image was uploaded
  if (imageUrl && product) {
    const { error: imageError } = await supabaseAdmin
      .from('product_images')
      .insert({
        product_id: product.id,
        url: imageUrl,
        is_thumbnail: true,
        sort_order: 0,
      })

    if (imageError) return Response.json({ error: imageError.message }, { status: 500 })
  }

  return Response.json(product, { status: 201 })
}
