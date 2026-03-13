// Database types for BeautyHub
export interface User {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  profile_picture_url: string | null
  is_seller: boolean
  seller_shop_name: string | null
  seller_description: string | null
  seller_rating: number
  seller_review_count: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description: string | null
  image_url: string | null
  slug: string | null
  display_order: number | null
  created_at: string
}

export interface Product {
  id: string
  seller_id: string
  category_id: string
  name: string
  description: string | null
  sku: string | null
  price: number
  original_price: number | null
  stock_quantity: number
  image_urls: string[]
  thumbnail_url: string | null
  ingredients: string | null
  usage_instructions: string | null
  shelf_life: string | null
  rating: number
  review_count: number
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  seller?: User
  category?: Category
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  added_at: string
  updated_at: string
  product?: Product
}

export interface Order {
  id: string
  order_number: string
  user_id: string
  subtotal: number
  shipping_fee: number
  tax: number
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_method: string | null
  mpesa_receipt_number: string | null
  shipping_address: string
  shipping_city: string | null
  shipping_phone: string | null
  customer_notes: string | null
  created_at: string
  updated_at: string
  completed_at: string | null
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  seller_id: string
  product_name: string
  product_image_url: string | null
  price: number
  quantity: number
  subtotal: number
  created_at: string
}

export interface Favorite {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  title: string | null
  comment: string | null
  helpful_count: number
  created_at: string
  updated_at: string
  user?: User
}

export interface PaymentTransaction {
  id: string
  order_id: string
  transaction_id: string | null
  payment_method: string | null
  amount: number
  status: 'pending' | 'success' | 'failed'
  mpesa_code: string | null
  mpesa_phone_number: string | null
  error_message: string | null
  created_at: string
  updated_at: string
}
