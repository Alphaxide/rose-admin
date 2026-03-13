import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { hashPassword } from '@/lib/password'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('id, email, full_name, created_at, updated_at')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { email, fullName, password } = body

  if (!email || !fullName || !password) {
    return NextResponse.json({ error: 'email, fullName, and password are required' }, { status: 400 })
  }

  const passwordHash = hashPassword(password)

  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .insert({ email, full_name: fullName, password_hash: passwordHash })
    .select('id, email, full_name, created_at')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'An admin with this email already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
