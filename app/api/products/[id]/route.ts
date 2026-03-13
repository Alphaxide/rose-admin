import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data, error } = await supabaseAdmin.rpc('get_product_by_id', {
    p_id: parseInt(id),
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  return NextResponse.json(data)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { name, description, price, originalPrice, categoryId, stockQuantity, imageUrl } = body

  const { data: product, error: productError } = await supabaseAdmin
    .from('products')
    .update({
      name,
      description,
      price,
      original_price: originalPrice ?? null,
      category_id: categoryId,
      stock_quantity: stockQuantity,
    })
    .eq('id', parseInt(id))
    .select()
    .single()

  if (productError) return NextResponse.json({ error: productError.message }, { status: 500 })

  // Update thumbnail image if a new one was provided
  if (imageUrl && product) {
    // Remove existing thumbnail then insert new one
    await supabaseAdmin
      .from('product_images')
      .delete()
      .eq('product_id', parseInt(id))
      .eq('is_thumbnail', true)

    const { error: imageError } = await supabaseAdmin
      .from('product_images')
      .insert({
        product_id: product.id,
        url: imageUrl,
        is_thumbnail: true,
        sort_order: 0,
      })

    if (imageError) return NextResponse.json({ error: imageError.message }, { status: 500 })
  }

  return NextResponse.json(product)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Delete related images first (FK constraint)
  await supabaseAdmin.from('product_images').delete().eq('product_id', parseInt(id))

  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', parseInt(id))

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
