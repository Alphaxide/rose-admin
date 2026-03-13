import { supabaseAdmin } from '@/lib/supabase-admin'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const { name, slug, imageUrl } = body

  const updates: Record<string, string | null> = { name, slug }
  if (imageUrl !== undefined) updates.image = imageUrl

  const { data, error } = await supabaseAdmin
    .from('categories')
    .update(updates)
    .eq('id', parseInt(id))
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { error } = await supabaseAdmin
    .from('categories')
    .delete()
    .eq('id', parseInt(id))

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return new Response(null, { status: 204 })
}
