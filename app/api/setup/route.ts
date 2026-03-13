import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { hashPassword } from '@/lib/password'

const SEED_EMAIL = 'kalpha@gmail.com'
const SEED_NAME = 'Alpha'
const SEED_PASSWORD = 'password'

export async function GET() {
  // Check whether the table exists
  const { error: checkError } = await supabaseAdmin
    .from('admin_users')
    .select('id')
    .limit(1)

  if (checkError) {
    return NextResponse.json({ status: 'table_missing', error: checkError.message })
  }

  const { count } = await supabaseAdmin
    .from('admin_users')
    .select('id', { count: 'exact', head: true })

  return NextResponse.json({ status: 'ready', userCount: count ?? 0 })
}

export async function POST() {
  // Verify table exists first
  const { error: checkError } = await supabaseAdmin
    .from('admin_users')
    .select('id')
    .limit(1)

  if (checkError) {
    return NextResponse.json(
      { error: 'Table does not exist yet. Run the SQL shown on this page first.' },
      { status: 500 }
    )
  }

  // Check if seed user already exists
  const { data: existing } = await supabaseAdmin
    .from('admin_users')
    .select('id, email')
    .eq('email', SEED_EMAIL)
    .single()

  if (existing) {
    return NextResponse.json({ message: 'Seed user already exists', email: existing.email })
  }

  // Insert seed user
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .insert({
      email: SEED_EMAIL,
      full_name: SEED_NAME,
      password_hash: hashPassword(SEED_PASSWORD),
    })
    .select('id, email, full_name')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, user: data })
}
