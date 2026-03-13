# BeautyHub E-Commerce System Overview

## Project Architecture

BeautyHub is a modern e-commerce platform built with Next.js 16, React, and TypeScript. It provides a complete shopping experience with product browsing, search, cart management, and checkout functionality.

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/UI
- **State Management**: React Context API
- **HTTP Client**: Fetch API (native)

### Data & Storage
- **Seed Data**: JSON files in `/public/data/`
- **Local Storage**: Cart context via localStorage
- **Cart State**: React Context (CartContext)
- **Wishlist State**: React Context (WishlistContext)

### APIs
- **Mock API Service**: `lib/mockApi.ts` (development)
- **Real API**: Ready for backend integration
- **API Schema**: `public/data/API_SCHEMA.json`

## Directory Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Home page
│   ├── checkout/
│   │   └── page.tsx              # Checkout flow
│   ├── cart/
│   │   └── page.tsx              # Shopping cart
│   ├── wishlist/
│   │   └── page.tsx              # Wishlist/Favorites
│   ├── products/
│   │   └── page.tsx              # All products with filters
│   ├── category/
│   │   └── [slug]/page.tsx       # Category products
│   ├── search/
│   │   └── page.tsx              # Search results
│   └── globals.css               # Global styles
│
├── components/
│   ├── Header.tsx                # Navigation header
│   ├── Footer.tsx                # Footer
│   ├── SearchBar.tsx             # Search functionality
│   ├── ProductCard.tsx           # Product display
│   ├── ProductFilters.tsx        # Filter sidebar
│   ├── PromoBanner.tsx           # Promotional banner
│   ├── BottomNav.tsx             # Mobile navigation
│   └── ui/                       # Shadcn components
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       └── ...
│
├── context/
│   ├── CartContext.tsx           # Cart state management
│   └── WishlistContext.tsx       # Wishlist state
│
├── lib/
│   ├── mockApi.ts                # Mock API service
│   ├── api.ts                    # Real API service (template)
│   ├── products.ts               # Product utilities
│   └── utils.ts                  # Helper functions
│
└── public/
    ├── data/
    │   ├── products.json          # Product seed data
    │   ├── categories.json        # Category seed data
    │   ├── API_SCHEMA.json        # API specifications
    │   ├── API_INTEGRATION_GUIDE.md
    │   ├── SEED_DATA_README.md
    │   ├── CHECKOUT_FLOW_GUIDE.md
    │   └── SYSTEM_OVERVIEW.md     # This file
    └── images/                    # Product and category images
```

## Core Features

### 1. Product Browsing
- **Home Page**: Featured products and categories
- **Products Page**: All products with filters and sorting
- **Category Pages**: Products filtered by category
- **Product Details**: Individual product information (ready)

**Components Involved:**
- `ProductCard` - Display product
- `ProductFilters` - Filter options
- `Header` - Navigation

### 2. Search Functionality
- **Real-time Search**: Search as you type in SearchBar
- **Search Results Page**: Dedicated search results view
- **Sorting**: By price, rating, newest
- **Filtering**: By category, price range

**Files Involved:**
- `components/SearchBar.tsx`
- `app/search/page.tsx`
- `lib/mockApi.ts` (searchProducts function)

**Mock Data:** 12 sample products with searchable names and descriptions

### 3. Shopping Cart
- **Add to Cart**: From product cards
- **Cart Summary**: Items, quantities, prices
- **Cart Management**: Update quantities, remove items
- **Persistent Storage**: Using localStorage

**Files Involved:**
- `context/CartContext.tsx`
- `app/cart/page.tsx`
- `components/ProductCard.tsx`

### 4. Wishlist/Favorites
- **Add to Wishlist**: Heart icon on products
- **Wishlist Page**: View all favorited items
- **Persistent Storage**: Using localStorage

**Files Involved:**
- `context/WishlistContext.tsx`
- `app/wishlist/page.tsx`
- `components/ProductCard.tsx`

### 5. Checkout Process
- **Step 1 - Shipping**: Collect delivery address
- **Step 2 - Payment**: M-Pesa payment setup
- **Step 3 - Confirmation**: Order confirmation

**Files Involved:**
- `app/checkout/page.tsx`
- `context/CartContext.tsx`

**Features:**
- Form validation (email, phone, address)
- Kenya-specific phone number validation
- Real-time error display
- Loading states
- Order number generation
- Price calculation (shipping + tax)

### 6. Filtering & Sorting
- **Category Filter**: By product category
- **Price Range Filter**: Min/max price selection
- **Sorting**: Newest, price (low-high), price (high-low), top-rated

**Components Involved:**
- `ProductFilters.tsx`
- `products/page.tsx`
- `category/[slug]/page.tsx`

## Data Flow

### Product Data Flow

```
products.json (seed data)
    ↓
mockApi.getProducts()
    ↓
Components:
- Home page
- Products page
- Category page
- Search results
    ↓
Display with ProductCard
```

### Search Data Flow

```
User input in SearchBar
    ↓
searchProducts(query)
    ↓
mockApi searches products.json
    ↓
Returns filtered results
    ↓
Display in dropdown or search page
```

### Cart Data Flow

```
User clicks "Add to Cart"
    ↓
CartContext.addToCart()
    ↓
Store in context state + localStorage
    ↓
Update cart badge in Header
    ↓
Display in cart page
```

### Checkout Data Flow

```
User clicks "Checkout"
    ↓
Collect shipping information (Step 1)
    ↓
Collect M-Pesa phone (Step 2)
    ↓
Create order (simulated API call)
    ↓
Show confirmation (Step 3)
    ↓
Clear cart
```

## Mock API Service

**File**: `lib/mockApi.ts`

**Key Functions:**
```typescript
getProducts(filters?) → ApiProduct[]
getProductById(id) → ApiProduct
getCategories() → ApiCategory[]
getCategoryBySlug(slug) → ApiCategory
searchProducts(query) → ApiProduct[]
```

**Mock Data:**
- 12 products across 5 categories
- Realistic pricing in KES
- Star ratings and reviews
- Stock information
- Product descriptions and features

## Seed Data Structure

### Products (`products.json`)
```json
{
  "id": "1",
  "name": "Product Name",
  "price": 2500,
  "original_price": 3500,
  "category_id": "1",
  "rating": 4.8,
  "review_count": 124,
  "stock_quantity": 45,
  "in_stock": true,
  "features": ["feature1", "feature2"]
}
```

### Categories (`categories.json`)
```json
{
  "id": "1",
  "name": "Skincare",
  "slug": "skincare",
  "productCount": 5
}
```

## State Management

### Cart Context
```typescript
interface CartItem {
  product_id: string
  name: string
  price: number
  image_url: string
  quantity: number
}

useCart() returns:
- items: CartItem[]
- totalPrice: number
- totalItems: number
- addToCart(productId, name, price, image, qty)
- removeFromCart(productId)
- updateQuantity(productId, qty)
- clearCart()
```

### Wishlist Context
```typescript
interface WishlistItem {
  product_id: string
  name: string
  price: number
  image_url: string
}

useWishlist() returns:
- items: WishlistItem[]
- addItem(item)
- removeItem(productId)
- isInWishlist(productId)
```

## Responsive Design

### Breakpoints (Tailwind)
- **Mobile**: < 768px (default)
- **Tablet**: md (768px - 1024px)
- **Desktop**: lg (1024px+)

### Mobile Features
- **Bottom Navigation**: BottomNav component
- **Hamburger Menu**: Toggle navigation
- **Sticky Header**: Quick access to search/cart
- **Touch-friendly**: Large buttons and inputs
- **Responsive Grid**: 2-4 columns based on screen size

### Desktop Features
- **Sticky Sidebar**: Filter sidebar on products page
- **Header Navigation**: Full menu visible
- **Wide Layout**: Multi-column grid
- **Keyboard Support**: Full keyboard navigation

## Color System

**Design Tokens** (from `globals.css`):
- `--primary`: Orange accent (#f68b1e)
- `--foreground`: Text color
- `--background`: Page background
- `--muted`: Subtle backgrounds
- `--border`: Border color

**Usage in Components:**
```tsx
className="bg-primary text-primary-foreground"
className="text-muted-foreground"
className="border border-border"
```

## Performance Optimizations

1. **Image Optimization**: Next.js Image component ready
2. **Code Splitting**: Route-based code splitting
3. **Lazy Loading**: Components load on demand
4. **Caching**: Mock API has simulated delays
5. **CSS**: Tailwind production optimization
6. **State**: Minimal re-renders with Context API

## Validation Rules

### Phone Numbers
- Format: `+254XXXXXXXXX` or `0XXXXXXXXX`
- Length: 9 digits after 0 or 254
- Region: Kenya-specific validation

### Email
- Format: `email@domain.com`
- Regex validation

### Address Fields
- Non-empty validation
- Minimum character checks

## Integration Points

### For Backend Developers

1. **Replace Mock API**: Update `lib/mockApi.ts` with real API calls
2. **Match Response Format**: Use `API_SCHEMA.json` as contract
3. **Implement Endpoints**: See `API_INTEGRATION_GUIDE.md`
4. **Test with Frontend**: Ensure compatibility

### API Endpoints Required

```
GET    /api/categories
GET    /api/products
POST   /api/search
POST   /api/orders
POST   /api/payments/initiate
POST   /api/payments/confirm
```

## Testing Strategy

### Manual Testing Checklist
- [ ] Browse products
- [ ] Search for items
- [ ] Filter by category
- [ ] Add to cart
- [ ] Add to wishlist
- [ ] Update cart quantity
- [ ] Proceed to checkout
- [ ] Fill shipping form
- [ ] Complete payment
- [ ] View confirmation
- [ ] Test on mobile
- [ ] Test responsiveness

### Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Deployment

### Pre-deployment Checklist
- [ ] Update API_BASE_URL in environment
- [ ] Test with real API
- [ ] Run build: `npm run build`
- [ ] Check for console errors
- [ ] Test on production URL
- [ ] Verify all features work
- [ ] Check mobile responsiveness
- [ ] Test payment flow

### Environment Variables
```
NEXT_PUBLIC_API_URL=https://api.beautyhub.com
```

## Documentation Files

| File | Purpose |
|------|---------|
| `API_SCHEMA.json` | Complete API specifications |
| `API_INTEGRATION_GUIDE.md` | How to integrate backend |
| `SEED_DATA_README.md` | Data structure and formats |
| `CHECKOUT_FLOW_GUIDE.md` | Checkout process details |
| `SYSTEM_OVERVIEW.md` | This document |

## Support & Troubleshooting

### Common Issues

**Products not loading:**
- Check `/public/data/products.json` exists
- Verify mock API in `lib/mockApi.ts`
- Check browser console for errors

**Search not working:**
- Verify `searchProducts()` in mockApi
- Check SearchBar component
- Test with different keywords

**Cart not persisting:**
- Check localStorage in browser DevTools
- Verify CartContext provider in layout
- Check for errors in browser console

**Checkout form errors:**
- Verify form validation in checkout page
- Check phone number format (Kenya)
- Ensure email format is correct

## Future Enhancements

1. **User Authentication**: Login/registration system
2. **User Accounts**: Order history, saved addresses
3. **Reviews & Ratings**: Customer product reviews
4. **Inventory Management**: Real-time stock updates
5. **Multiple Payment Methods**: Stripe, Airtel Money, etc.
6. **Product Recommendations**: AI-based suggestions
7. **Customer Support**: Live chat, FAQs
8. **Analytics**: User behavior tracking
9. **Admin Dashboard**: Inventory management
10. **Mobile App**: React Native version

## Getting Started

### Development
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

### Building for Production
```bash
npm run build
npm run start
```

### Environment Setup
```bash
# Copy example env
cp .env.example .env.local

# Update with your API URL
NEXT_PUBLIC_API_URL=your-api-url
```

## Contact & Support

For questions or issues:
1. Check the documentation files in `/public/data/`
2. Review component code with comments
3. Check browser console for errors
4. Review mock API implementation

---

**Last Updated**: February 2024  
**Version**: 1.0.0  
**Status**: Production Ready with Mock API
