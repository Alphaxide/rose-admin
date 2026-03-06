import { createClient } from '@supabase/supabase-js'

// Safe for browser — uses anon key (NEXT_PUBLIC_ prefix)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
