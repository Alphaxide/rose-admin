import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const { data, error } = await supabaseAdmin.rpc('get_customers')

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}
