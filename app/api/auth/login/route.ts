import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyPassword } from '@/lib/password'

export async function POST(request: Request) {
  const body = await request.json()
  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  const { data: user, error } = await supabaseAdmin
    .from('admin_users')
    .select('id, email, full_name, password_hash')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (error || !user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const valid = verifyPassword(password, user.password_hash)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    fullName: user.full_name,
  })
}
