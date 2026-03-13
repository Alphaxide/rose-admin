# BeautyHub API Integration Guide

## Overview

This document provides comprehensive guidance for integrating the BeautyHub backend API with the frontend application. The frontend currently uses a mock API service for development and testing.

## Current Architecture

### Mock API Service (`lib/mockApi.ts`)

The mock API service provides:
- Product fetching with filters (category, search, price, sort)
- Category management
- Search functionality
- Order creation
- Payment processing simulation

### Seed Data

- **Products**: `/public/data/products.json` - 12 beauty products across 5 categories
- **Categories**: `/public/data/categories.json` - 5 product categories

## Integration Steps

### Step 1: Backend API Setup

Create the following REST endpoints on your backend:

```
GET    /api/categories
GET    /api/products
GET    /api/products/:id
POST   /api/search
POST   /api/orders
POST   /api/payments/initiate
POST   /api/payments/confirm
```

Refer to `API_SCHEMA.json` for detailed endpoint specifications.

### Step 2: Update API Service

Replace the mock implementation in `lib/mockApi.ts` with actual API calls:

```typescript
// Before: Mock API
export async function getProducts(filters?: any) {
  // Returns mock data from JSON
}

// After: Real API
export async function getProducts(filters?: any) {
  const params = new URLSearchParams()
  if (filters?.category) params.append('categoryId', filters.category)
  if (filters?.search) params.append('q', filters.search)
  
  const response = await fetch(`${API_BASE_URL}/api/products?${params}`)
  return response.json()
}
```

### Step 3: Environment Configuration

Add to `.env.local`:

```
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_API_TIMEOUT=10000
```

Update `lib/config.ts`:

```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
```

### Step 4: Error Handling

Implement consistent error handling:

```typescript
async function apiCall(endpoint: string, options?: any) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options)
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error)
    throw error
  }
}
```

### Step 5: Authentication

For protected endpoints, implement JWT authentication:

```typescript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${authToken}`
}
```

## API Endpoints Reference

### Products

#### GET /api/products
Fetch products with optional filters

**Query Parameters:**
- `categoryId` (string) - Filter by category
- `q` (string) - Search query
- `sortBy` (string) - 'newest', 'price-low', 'price-high', 'rating'
- `priceMin` (number) - Minimum price
- `priceMax` (number) - Maximum price
- `page` (number) - Pagination page
- `limit` (number) - Items per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Product Name",
      "price": 2500,
      "original_price": 3500,
      "image_urls": ["url"],
      "thumbnail_url": "url",
      "category_id": "1",
      "rating": 4.8,
      "review_count": 124,
      "stock_quantity": 45,
      "description": "...",
      "in_stock": true,
      "features": ["feature1", "feature2"]
    }
  ],
  "total": 12,
  "pagination": {
    "page": 1,
    "limit": 12,
    "total_pages": 1
  }
}
```

### Orders

#### POST /api/orders
Create a new order

**Request Body:**
```json
{
  "items": [
    {
      "product_id": "1",
      "quantity": 2,
      "price": 2500
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+254712345678",
    "address": "123 Main St",
    "city": "Nairobi",
    "postalCode": "00100"
  },
  "paymentMethod": "mpesa",
  "totalAmount": 5500
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "ORD-123456789",
    "status": "pending",
    "items": [...],
    "shippingAddress": {...},
    "paymentMethod": "mpesa",
    "totalAmount": 5500,
    "createdAt": "2024-02-27T10:30:00Z",
    "estimatedDelivery": "2024-03-02T10:30:00Z"
  }
}
```

### Payments

#### POST /api/payments/initiate
Initiate M-Pesa payment

**Request Body:**
```json
{
  "orderId": "ORD-123456789",
  "amount": 5500,
  "phoneNumber": "+254712345678",
  "paymentMethod": "mpesa"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "TXN-123456789",
    "status": "initiated",
    "message": "Waiting for M-Pesa confirmation...",
    "amount": 5500,
    "phoneNumber": "+254712345678",
    "paymentMethod": "mpesa"
  }
}
```

## Frontend Components Using API

The following components interact with the API service:

1. **ProductCard** - Displays product information
2. **SearchBar** - Searches products
3. **ProductFilters** - Filters products by category and price
4. **CheckoutPage** - Creates orders and processes payments
5. **ProductPage** - Shows detailed product information
6. **CategoryPage** - Displays products by category

## Data Flow Example

### Search Flow

```
User types in SearchBar
  ↓
SearchBar component calls searchProducts(query)
  ↓
searchProducts() calls getProducts({ search: query })
  ↓
API returns filtered products
  ↓
Results rendered in SearchBar dropdown or search page
```

### Checkout Flow

```
User clicks "Checkout"
  ↓
CheckoutPage renders with cart items
  ↓
User enters shipping details
  ↓
handleShippingSubmit() validates and moves to payment step
  ↓
User selects M-Pesa and enters phone number
  ↓
handleMpesaPayment() creates order and initiates payment
  ↓
Payment confirmation displays order details
```

## Testing the Integration

### 1. Test with Mock API (Development)

The app works with mock JSON data by default. No changes needed.

### 2. Test with Real API (Development)

Update `lib/mockApi.ts` to call your development API:

```typescript
const API_BASE_URL = 'http://localhost:3001'

export async function getProducts(filters?: any) {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters)
  })
  return response.json()
}
```

### 3. Test with Production API

Update environment variables:

```
NEXT_PUBLIC_API_URL=https://api.beautyhub.com
```

## Common Issues and Solutions

### Issue: CORS Errors

**Solution:** Ensure backend has proper CORS headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Issue: Slow API Responses

**Solution:** Implement caching:

```typescript
const cache = new Map()

async function getCachedProducts(key: string) {
  if (cache.has(key)) return cache.get(key)
  
  const data = await getProducts()
  cache.set(key, data)
  
  // Clear cache after 5 minutes
  setTimeout(() => cache.delete(key), 5 * 60 * 1000)
  
  return data
}
```

### Issue: Authentication Required

**Solution:** Store and include JWT token:

```typescript
const token = localStorage.getItem('authToken')
const headers = {
  'Authorization': `Bearer ${token}`
}
```

## Performance Considerations

1. **Data Pagination**: Implement for large datasets
2. **Image Optimization**: Use next/image component
3. **Caching**: Cache frequently accessed data
4. **Lazy Loading**: Load products on scroll
5. **API Rate Limiting**: Respect rate limits on backend

## Deployment Checklist

- [ ] Update API_BASE_URL in environment variables
- [ ] Implement proper error handling
- [ ] Add authentication tokens if required
- [ ] Test all API endpoints
- [ ] Verify CORS configuration
- [ ] Set up error logging
- [ ] Configure API timeout values
- [ ] Test payment flow with real M-Pesa integration (if applicable)
- [ ] Load testing with expected user volume
- [ ] Monitor API performance in production

## Support

For API-related issues or questions about integration, refer to:
- `API_SCHEMA.json` - Complete endpoint specifications
- `lib/mockApi.ts` - Current implementation
- Backend API documentation
