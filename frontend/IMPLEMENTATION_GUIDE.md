# Implementation Guide: Mock API & Frontend Integration

This guide documents the mock API setup and how to integrate the BeautyHub frontend with a backend API.

## Overview

The frontend has been refactored to use a mock API layer (`lib/mockApi.ts`) instead of hardcoded data. This makes it easy to swap the mock functions with real API calls when you're ready to integrate with a backend.

## Project Structure

```
project/
├── lib/
│   ├── mockApi.ts          # Mock API functions and data
│   ├── products.ts         # Legacy products data (being phased out)
│   └── supabase.ts         # Supabase client setup
├── data/
│   ├── products.json       # (Future) Product seed data
│   ├── categories.json     # (Future) Category seed data
│   └── orders.json         # (Future) Order seed data
├── components/
│   ├── SearchBar.tsx       # Functional search component
│   └── (other components)
├── app/
│   ├── page.tsx            # Home page (updated to use mock API)
│   ├── products/
│   │   └── page.tsx        # Products page (uses mock API)
│   ├── search/
│   │   └── page.tsx        # Search results page
│   ├── checkout/
│   │   └── page.tsx        # Enhanced checkout with validation
│   ├── category/
│   │   └── [slug]/page.tsx # Category details page
│   └── (other pages)
├── API_RESPONSES.md        # Expected API response formats
└── IMPLEMENTATION_GUIDE.md # This file
```

## Current Features

### 1. Mock API (`lib/mockApi.ts`)

The mock API provides these main functions:

```typescript
// Get products with optional filters
getProducts(filters?: {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
}): Promise<ApiProduct[]>

// Get single product
getProductById(id: string): Promise<ApiProduct | null>

// Get all categories
getCategories(): Promise<ApiCategory[]>

// Get category by slug
getCategoryBySlug(slug: string): Promise<ApiCategory | null>

// Search products
searchProducts(query: string): Promise<ApiProduct[]>
```

### 2. Search Functionality

- **SearchBar Component** (`components/SearchBar.tsx`)
  - Real-time search with debouncing
  - Shows up to 8 results
  - Click-outside detection to close dropdown
  - Clear button for easy search reset

- **Search Results Page** (`app/search/page.tsx`)
  - Displays full search results
  - Responsive grid layout
  - Integrated with mock API

### 3. Enhanced Checkout

- **Validation**
  - Full name, email validation
  - Kenyan phone number format validation (254xxxxx or 0xxxxxxxx)
  - Address and city validation

- **Multi-step Process**
  1. Shipping information
  2. Payment method selection
  3. Order confirmation

- **Payment Integration Ready**
  - M-Pesa support (can integrate with Pesapal/Daraja)
  - Generates proper order payload
  - Includes tax calculation (16%) and shipping

### 4. Category Pages

- **Category Details** (`app/category/[slug]/page.tsx`)
  - Filters products by category
  - Sticky sidebar on desktop (md+ screens)
  - Mobile-friendly filter toggle
  - Sorting options (newest, price, rating)

## How to Integrate with Backend

### Step 1: Replace Mock API with Real API Calls

Update `lib/mockApi.ts` to call your backend endpoints:

```typescript
// Example: Replace getProducts mock with real API call
export async function getProducts(filters?: FilterOptions): Promise<ApiProduct[]> {
  const params = new URLSearchParams()
  
  if (filters?.category) params.append('category', filters.category)
  if (filters?.search) params.append('search', filters.search)
  if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString())
  if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
  if (filters?.sortBy) params.append('sortBy', filters.sortBy)
  
  const response = await fetch(`/api/products?${params}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  
  const data = await response.json()
  return data.data // Match the response structure from API_RESPONSES.md
}
```

### Step 2: Update Environment Variables

Add your API endpoint to `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-api.com/api
NEXT_PUBLIC_MPESA_KEY=your-mpesa-key
NEXT_PUBLIC_MPESA_SECRET=your-mpesa-secret
```

### Step 3: Implement Backend Endpoints

Refer to `API_RESPONSES.md` for the expected request/response formats.

Required endpoints:
- `GET /api/products` - List products with filters
- `GET /api/products/:id` - Get product details
- `GET /api/categories` - List categories
- `GET /api/categories/:slug` - Get category details
- `POST /api/search` - Search products
- `POST /api/orders` - Create order
- `POST /api/payments/mpesa` - Initiate M-Pesa payment
- `GET /api/orders/:id` - Get order details

### Step 4: Update Auth Integration

When ready, replace the cart/wishlist context with Supabase or your auth provider.

```typescript
// In components/Header.tsx, add:
const { user } = useAuth() // Your auth hook
```

## Search Bar Implementation

The search bar uses debounced API calls to avoid excessive requests:

```typescript
// Debounced search with 300ms delay
useEffect(() => {
  if (!query.trim()) {
    setResults([])
    return
  }

  const timer = setTimeout(async () => {
    const results = await searchProducts(query)
    setResults(results.slice(0, 8))
  }, 300)

  return () => clearTimeout(timer)
}, [query])
```

## Data Models

### Product
```typescript
{
  id: string
  name: string
  price: number
  original_price?: number
  image_urls: string[]
  thumbnail_url?: string
  category_id: string
  rating: number
  review_count: number
  stock_quantity: number
  description: string
  in_stock: boolean
}
```

### Category
```typescript
{
  id: string
  name: string
  slug: string
  image: string
}
```

### Order
```typescript
{
  id: string
  order_number: string
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  shipping_address: ShippingAddress
  payment_method: 'mpesa'
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  created_at: string
}
```

## Testing Mock API Locally

The mock API is fully functional and can be tested immediately:

```bash
# Test in browser console:
import { getProducts, searchProducts } from '@/lib/mockApi'

// Get all products
await getProducts()

// Search for products
await searchProducts('serum')

// Filter by category and price
await getProducts({
  category: '1',
  minPrice: 1000,
  maxPrice: 3000,
  sortBy: 'price-asc'
})
```

## Future Enhancements

1. **Database Seed Data**
   - Move mock data to `data/` JSON files
   - Create database migration scripts
   - Implement batch import functionality

2. **Admin API**
   - Product management endpoints
   - Inventory management
   - Order management

3. **User Features**
   - User registration and login
   - Wishlist persistence
   - Order history
   - Saved addresses

4. **Payment Integration**
   - M-Pesa real integration with Pesapal/Daraja
   - Payment webhook handling
   - Transaction verification

5. **Analytics**
   - Search analytics
   - Product view tracking
   - Conversion tracking

## Debugging

Enable debug logging with `[v0]` prefix to trace API calls:

```typescript
console.log('[v0] API call:', endpoint, params)
console.log('[v0] Response:', data)
console.log('[v0] Error:', error)
```

## Support

For more details on expected API response formats, see `API_RESPONSES.md`.
