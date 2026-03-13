import { createBrowserClient } from '@supabase/ssr'

// Client-side Supabase client
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export const supabase = createClient()

// Types for database operations
export type {
  User,
  Product,
  Category,
  CartItem,
  Order,
  OrderItem,
  Favorite,
  Review,
  PaymentTransaction,
} from '@/types/database'
