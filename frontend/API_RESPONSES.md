# API Response Format Documentation

This document outlines the expected API response formats for the BeautyHub e-commerce platform. These formats should be followed when integrating the backend API.

## Product Response

### Single Product
```json
{
  "id": "1",
  "name": "Luxury Face Serum",
  "price": 2500,
  "original_price": 3500,
  "image_urls": ["/product-serum.jpg"],
  "thumbnail_url": "/product-serum.jpg",
  "category_id": "1",
  "rating": 4.8,
  "review_count": 124,
  "stock_quantity": 45,
  "description": "Premium hydrating serum with vitamin C and hyaluronic acid.",
  "in_stock": true
}
```

### Products List Response
```json
{
  "status": "success",
  "data": [
    {
      "id": "1",
      "name": "Luxury Face Serum",
      "price": 2500,
      "original_price": 3500,
      "image_urls": ["/product-serum.jpg"],
      "thumbnail_url": "/product-serum.jpg",
      "category_id": "1",
      "rating": 4.8,
      "review_count": 124,
      "stock_quantity": 45,
      "description": "Premium hydrating serum with vitamin C and hyaluronic acid.",
      "in_stock": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 120,
    "pages": 6
  }
}
```

### Search Products
```json
{
  "status": "success",
  "data": [
    {
      "id": "1",
      "name": "Luxury Face Serum",
      "price": 2500,
      "original_price": 3500,
      "image_urls": ["/product-serum.jpg"],
      "thumbnail_url": "/product-serum.jpg",
      "category_id": "1",
      "rating": 4.8,
      "review_count": 124,
      "stock_quantity": 45,
      "description": "Premium hydrating serum with vitamin C and hyaluronic acid.",
      "in_stock": true
    }
  ],
  "total": 1
}
```

## Category Response

### Single Category
```json
{
  "id": "1",
  "name": "Skincare",
  "slug": "skincare",
  "image": "/category-skincare.jpg"
}
```

### Categories List
```json
{
  "status": "success",
  "data": [
    {
      "id": "1",
      "name": "Skincare",
      "slug": "skincare",
      "image": "/category-skincare.jpg"
    },
    {
      "id": "2",
      "name": "Makeup",
      "slug": "makeup",
      "image": "/category-makeup.jpg"
    }
  ]
}
```

## Order Response

### Create Order
```json
{
  "status": "success",
  "data": {
    "id": "order_123",
    "order_number": "ORD-1708123456789",
    "user_id": "user_123",
    "items": [
      {
        "product_id": "1",
        "name": "Luxury Face Serum",
        "price": 2500,
        "quantity": 2
      }
    ],
    "subtotal": 5000,
    "tax": 800,
    "shipping": 300,
    "total": 6100,
    "shipping_address": {
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone": "+254712345678",
      "address": "123 Main St",
      "city": "Nairobi",
      "postal_code": "00100"
    },
    "payment_method": "mpesa",
    "status": "pending",
    "created_at": "2024-02-20T10:30:00Z"
  }
}
```

### Order Status
```json
{
  "status": "success",
  "data": {
    "id": "order_123",
    "order_number": "ORD-1708123456789",
    "status": "processing",
    "tracking_number": "TRACK-123456",
    "estimated_delivery": "2024-02-25T00:00:00Z",
    "items": [
      {
        "product_id": "1",
        "name": "Luxury Face Serum",
        "quantity": 2
      }
    ],
    "total": 6100
  }
}
```

## Error Response

```json
{
  "status": "error",
  "message": "Product not found",
  "error_code": "PRODUCT_NOT_FOUND",
  "details": null
}
```

## Checkout Response

### Payment Initiation (M-Pesa)
```json
{
  "status": "success",
  "data": {
    "checkout_id": "checkout_123",
    "order_number": "ORD-1708123456789",
    "amount": 6100,
    "currency": "KES",
    "phone_number": "+254712345678",
    "mpesa_request_id": "mpesa_req_123",
    "status": "initiated",
    "expires_at": "2024-02-20T11:30:00Z"
  }
}
```

### Payment Confirmation
```json
{
  "status": "success",
  "data": {
    "order_number": "ORD-1708123456789",
    "payment_status": "completed",
    "transaction_id": "mpesa_trans_123",
    "amount": 6100,
    "currency": "KES",
    "timestamp": "2024-02-20T10:35:00Z"
  }
}
```

## Query Parameters

### Get Products with Filters
```
GET /api/products?category=1&minPrice=1000&maxPrice=5000&sortBy=price-asc&page=1&limit=20
```

### Search Products
```
GET /api/search?query=serum&category=1&limit=10
```

### Get Products by Category
```
GET /api/categories/skincare/products?sortBy=rating&limit=20
```

## Expected Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

## Implementation Notes

1. All prices are in KES (Kenyan Shilling)
2. Timestamps are in ISO 8601 format
3. All product IDs and category IDs are strings
4. Product images should be served from a CDN or public storage
5. M-Pesa integration requires actual MPesa API credentials
6. Search is case-insensitive
7. Sorting options: newest, price-asc, price-desc, rating
8. Default page limit is 20 products
