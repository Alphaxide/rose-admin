import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  const { data, error } = await supabaseAdmin.rpc('get_orders', {
    status_filter: status ?? null,
  })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}
