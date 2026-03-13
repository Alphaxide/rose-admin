import { supabaseAdmin } from '@/lib/supabase-admin'

const DEFAULTS = {
  payment_type: 'paybill',
  payment_number: '',
  phone: '+254 700 000 000',
  whatsapp: '+254700000000',
  email: 'support@beautybyrose.co.ke',
  address: 'Westlands, Nairobi, Kenya',
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('store_settings')
    .select('*')
    .eq('id', 1)
    .single()

  if (error || !data) return Response.json(DEFAULTS)
  return Response.json({ ...DEFAULTS, ...data })
}

export async function PUT(request: Request) {
  const body = await request.json()

  const { data, error } = await supabaseAdmin
    .from('store_settings')
    .upsert({ id: 1, ...body }, { onConflict: 'id' })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}
