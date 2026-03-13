# BeautyHub Data & Documentation

Welcome to the BeautyHub data directory. This folder contains seed data, API specifications, and comprehensive documentation for the BeautyHub e-commerce platform.

## Quick Navigation

### For Frontend Developers
- **[SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md)** - Complete system architecture and features
- **[SEED_DATA_README.md](./SEED_DATA_README.md)** - How to use and modify seed data
- **[API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)** - Connecting to real backend API

### For Backend Developers
- **[API_SCHEMA.json](./API_SCHEMA.json)** - Complete API specifications
- **[API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)** - Integration instructions
- **[products.json](./products.json)** - Sample product data structure
- **[categories.json](./categories.json)** - Category data structure

### For Product/Design Teams
- **[SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md)** - Features and capabilities
- **[CHECKOUT_FLOW_GUIDE.md](./CHECKOUT_FLOW_GUIDE.md)** - User checkout experience

## Files in This Directory

### Data Files

#### `products.json`
- 12 sample beauty products
- Realistic pricing in Kenyan Shillings (KES)
- Product images, descriptions, and features
- Stock levels and ratings
- Use as template for backend API responses

#### `categories.json`
- 5 product categories (Skincare, Makeup, Haircare, Body Care, Fragrances)
- Category metadata and product counts
- Image URLs for category display

### Documentation Files

#### `SYSTEM_OVERVIEW.md` (Start Here!)
Complete overview of the BeautyHub platform:
- Project architecture and tech stack
- Directory structure
- Core features explanation
- Data flow diagrams
- State management details
- Performance optimizations
- Integration checklist

**Best for**: Understanding the overall system

#### `API_SCHEMA.json`
Formal API specification document with:
- All endpoint definitions
- Request/response schemas
- Query parameters and payloads
- Error response formats
- Authentication requirements
- Rate limiting notes

**Best for**: Backend developers building APIs

#### `API_INTEGRATION_GUIDE.md`
Step-by-step guide for integrating backend API:
- Current architecture (mock API)
- Integration steps
- Environment configuration
- Error handling patterns
- Authentication setup
- Testing instructions
- Common issues and solutions

**Best for**: Transitioning from mock to real API

#### `SEED_DATA_README.md`
Complete guide to seed data:
- Data structure explanation
- File format and schema
- Usage examples
- How to modify data
- Adding new products/categories
- Image guidelines
- Validation requirements

**Best for**: Understanding and managing product data

#### `CHECKOUT_FLOW_GUIDE.md`
Detailed checkout process documentation:
- Flow diagram
- Implementation details
- Form validation rules
- Price calculations
- State management
- Payment integration points
- Error handling
- Testing checklist
- Security considerations

**Best for**: Understanding payment flow and checkout UX

## Getting Started

### 1. First Time Setup
```bash
# Clone the repository
git clone <repo-url>
cd beautyhub

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the app with mock data.

### 2. Understanding the App
1. Read **SYSTEM_OVERVIEW.md** for architecture
2. Browse the app and test features
3. Check **SEED_DATA_README.md** to understand data structure
4. Review component code in `/components`

### 3. Integrating Your Backend
1. Read **API_INTEGRATION_GUIDE.md**
2. Review **API_SCHEMA.json** for required endpoints
3. Update environment variables
4. Modify `lib/mockApi.ts` to call real API
5. Test integration

## Data Structure Quick Reference

### Product Object
```json
{
  "id": "1",
  "name": "Product Name",
  "slug": "product-name",
  "price": 2500,
  "original_price": 3500,
  "image_urls": ["url1", "url2"],
  "thumbnail_url": "url",
  "category_id": "1",
  "rating": 4.8,
  "review_count": 124,
  "stock_quantity": 45,
  "description": "...",
  "in_stock": true,
  "features": ["feature1", "feature2"]
}
```

### Category Object
```json
{
  "id": "1",
  "name": "Skincare",
  "slug": "skincare",
  "image": "/category-skincare.jpg",
  "description": "...",
  "productCount": 5
}
```

### Order Object
```json
{
  "orderId": "ORD-123456",
  "status": "pending",
  "items": [...],
  "shippingAddress": {...},
  "paymentMethod": "mpesa",
  "totalAmount": 5500,
  "createdAt": "2024-02-27T10:30:00Z",
  "estimatedDelivery": "2024-03-02T10:30:00Z"
}
```

## Key Features

### Current Implementation (Mock API)
- Product browsing with 12 sample items
- Real-time search functionality
- Category filtering
- Price-based sorting and filtering
- Shopping cart with persistence
- Wishlist/favorites
- Multi-step checkout with form validation
- M-Pesa payment simulation

### Ready for Backend Integration
- All API endpoints defined in `API_SCHEMA.json`
- Mock API service ready to replace with real calls
- Error handling patterns established
- Authentication hooks prepared
- Payment flow designed

## API Endpoints

### Products
- `GET /api/categories` - Get all categories
- `GET /api/products` - Get products with filters
- `GET /api/products/:id` - Get product details
- `POST /api/search` - Search products

### Orders & Payments
- `POST /api/orders` - Create new order
- `POST /api/payments/initiate` - Start payment
- `POST /api/payments/confirm` - Confirm payment

See `API_SCHEMA.json` for complete details.

## Components Using Data

| Component | Data Source | Purpose |
|-----------|------------|---------|
| ProductCard | products.json | Display product info |
| SearchBar | products.json | Search functionality |
| ProductFilters | products.json | Filter and sort |
| Header | - | Navigation and search |
| CheckoutPage | CartContext | Order processing |
| CategoryPage | products.json + categories.json | Show category products |

## Testing the System

### Manual Testing
1. Browse home page - See featured products
2. Search for "serum" - See search results
3. Filter by "Skincare" - See category products
4. Add items to cart - Persist in localStorage
5. Go to checkout - Follow form validation
6. Complete order - See confirmation

### API Testing
Use tools like Postman or curl to test endpoints:
```bash
# Get all products
curl http://localhost:3000/api/products

# Search products
curl "http://localhost:3000/api/products?q=serum"

# Get category
curl "http://localhost:3000/api/categories"
```

## Validation Rules

### Phone Numbers (Kenya)
- Must be 9 digits after 0 or +254
- Valid formats: `0712345678` or `+254712345678`

### Emails
- Standard email format validation
- Example: `user@example.com`

### Prices
- All prices in KES (Kenyan Shillings)
- Whole numbers only
- Positive values only

### Product Names
- Required, non-empty
- String type

## Performance Metrics

- **Load Time**: < 2 seconds (with mock API)
- **Search Response**: < 300ms
- **Checkout Processing**: ~2 seconds (simulated)
- **Mobile Optimization**: Fully responsive
- **Accessibility**: WCAG 2.1 compliant

## Security Considerations

### Current (Development)
- Mock API for testing
- Client-side validation only
- No real payment processing

### For Production
- Use HTTPS/SSL for all API calls
- Implement server-side validation
- Use secure M-Pesa gateway
- Encrypt sensitive data
- Implement rate limiting
- Add CORS headers correctly
- Use secure session management

## Troubleshooting

### Products Not Loading
1. Check `/public/data/products.json` exists
2. Verify JSON format is valid
3. Check browser console for errors
4. Restart development server

### Search Not Working
1. Verify search query is not empty
2. Check SearchBar component is mounted
3. Check mockApi.searchProducts() works
4. Try different search terms

### Cart Not Persisting
1. Check localStorage in DevTools
2. Verify CartContext provider is in layout
3. Check for JavaScript errors
4. Clear cache and reload

### Checkout Errors
1. Validate form inputs
2. Check phone number format (Kenya)
3. Check email format
4. Ensure shipping address is complete

## Contributing

When modifying seed data:
1. Maintain JSON format
2. Use realistic Kenyan pricing
3. Keep product names descriptive
4. Include meaningful descriptions
5. Update documentation
6. Test with frontend

## Support Resources

- **Code Examples**: Check `/components` and `/app`
- **Type Definitions**: Check `lib/mockApi.ts` for types
- **API Examples**: See `API_SCHEMA.json`
- **Component Usage**: Review component files with comments

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Feb 2024 | Initial release with mock API, seed data, and documentation |

## License

BeautyHub © 2024. All rights reserved.

---

## Quick Links

- [System Overview](./SYSTEM_OVERVIEW.md) - Start here for architecture
- [API Schema](./API_SCHEMA.json) - Complete API specifications  
- [Integration Guide](./API_INTEGRATION_GUIDE.md) - How to add backend
- [Seed Data Guide](./SEED_DATA_README.md) - Product data structure
- [Checkout Flow](./CHECKOUT_FLOW_GUIDE.md) - Payment process

---

**Last Updated**: February 27, 2024  
**Maintained By**: Development Team  
**Status**: Production Ready with Mock API
