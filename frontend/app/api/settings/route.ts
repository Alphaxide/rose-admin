import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const DEFAULTS = {
  payment_type: 'paybill',
  payment_number: '',
  phone: '+254 700 000 000',
  whatsapp: '+254700000000',
  email: 'support@beautybyrose.co.ke',
  address: 'Westlands, Nairobi, Kenya',
}

export async function GET() {
  const { data, error } = await supabase
    .from('store_settings')
    .select('*')
    .eq('id', 1)
    .single()

  if (error || !data) return Response.json(DEFAULTS)
  return Response.json({ ...DEFAULTS, ...data })
}
