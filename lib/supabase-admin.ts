import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy singleton — client is created on first use, not at module load time.
// This prevents build-time crashes when env vars are only available at runtime.
let _client: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) throw new Error('Supabase env vars are not configured.')
    _client = createClient(url, key)
  }
  return _client
}

// Convenience alias — same lazy pattern
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseAdmin() as never)[prop]
  },
})
