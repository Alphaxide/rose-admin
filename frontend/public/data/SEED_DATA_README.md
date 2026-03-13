# BeautyHub Seed Data

This directory contains JSON files with seed data for the BeautyHub e-commerce platform. These files are used for initial development, testing, and as templates for backend API responses.

## Files Overview

### 1. `products.json`

Contains 12 sample beauty products across multiple categories.

**Structure:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string - unique identifier",
      "name": "string - product name",
      "slug": "string - url-friendly name",
      "price": "number - current price in KES",
      "original_price": "number - original price (optional, for discounts)",
      "image_urls": ["array of image URLs"],
      "thumbnail_url": "string - primary image",
      "category_id": "string - associated category",
      "rating": "number - 0-5 rating",
      "review_count": "number - total reviews",
      "stock_quantity": "number - available units",
      "description": "string - product description",
      "in_stock": "boolean - stock availability",
      "features": ["array of product features"]
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

**Sample Products:**
- Luxury Face Serum (Skincare) - KES 2,500
- Matte Lipstick - Berry Kiss (Makeup) - KES 1,200
- Hair Growth Oil (Haircare) - KES 1,800
- Brightening Face Mask (Skincare) - KES 2,000
- Foundation - Fair (Makeup) - KES 1,500
- Argan Hair Conditioner (Haircare) - KES 1,400
- Vitamin C Eye Cream (Skincare) - KES 2,200
- Perfume - Floral Bliss (Fragrances) - KES 3,500
- Luxury Face Moisturizer (Skincare) - KES 2,200
- Liquid Concealer (Makeup) - KES 1,300
- Premium Body Lotion (Body Care) - KES 1,100
- Powder Blush - Rose Gold (Makeup) - KES 950

### 2. `categories.json`

Contains 5 product categories.

**Structure:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string - unique identifier",
      "name": "string - category name",
      "slug": "string - url-friendly slug",
      "image": "string - category image URL",
      "description": "string - category description",
      "productCount": "number - products in category"
    }
  ]
}
```

**Categories:**
1. Skincare (5 products)
2. Makeup (4 products)
3. Haircare (2 products)
4. Body Care (1 product)
5. Fragrances (1 product)

### 3. `API_SCHEMA.json`

Complete API endpoint specifications and expected response formats. Serves as the contract between frontend and backend.

### 4. `API_INTEGRATION_GUIDE.md`

Detailed guide for integrating backend API with the frontend application.

## Seed Data Features

### Product Properties

Each product includes:
- **Basic Info**: ID, name, slug, description
- **Pricing**: Current price, original price (for discounts)
- **Media**: Thumbnail and multiple image URLs
- **Categorization**: Category ID linking to categories.json
- **Ratings**: Average rating (0-5) and review count
- **Stock**: Quantity available and in-stock status
- **Details**: Array of product features/benefits

### Category Properties

Each category includes:
- **Identification**: Unique ID and URL-friendly slug
- **Display**: Name, image, and description
- **Metadata**: Count of products in category

## Usage in Frontend

### Loading Seed Data

```typescript
// Mock API service uses seed data
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mockApi'

// Or fetch from JSON files
const products = await fetch('/data/products.json').then(r => r.json())
const categories = await fetch('/data/categories.json').then(r => r.json())
```

### Displaying Products

```typescript
import ProductCard from '@/components/ProductCard'

{products.map(product => (
  <ProductCard key={product.id} product={product} />
))}
```

### Searching Products

```typescript
import { searchProducts } from '@/lib/mockApi'

const results = await searchProducts('face serum')
```

### Filtering by Category

```typescript
const skincare = products.filter(p => p.category_id === '1')
```

## Modifying Seed Data

### Adding a New Product

Edit `products.json` and add to the `data` array:

```json
{
  "id": "13",
  "name": "New Product Name",
  "slug": "new-product-name",
  "price": 1500,
  "original_price": 2000,
  "image_urls": ["/product-new.jpg"],
  "thumbnail_url": "/product-new.jpg",
  "category_id": "1",
  "rating": 4.5,
  "review_count": 50,
  "stock_quantity": 30,
  "description": "Product description",
  "in_stock": true,
  "features": ["feature1", "feature2"]
}
```

Also update the `total` count in the pagination section.

### Adding a New Category

Edit `categories.json` and add to the `data` array:

```json
{
  "id": "6",
  "name": "New Category",
  "slug": "new-category",
  "image": "/category-new.jpg",
  "description": "Category description",
  "productCount": 0
}
```

## Integration with Backend

### Step 1: Mirror Data Structure

Ensure your backend API returns the same JSON structure as these seed files.

### Step 2: Replace Mock Data

Update `lib/mockApi.ts` to fetch from your backend:

```typescript
export async function getProducts() {
  const response = await fetch('https://your-api.com/api/products')
  return response.json()
}
```

### Step 3: Test Compatibility

Verify frontend works with real API responses by:
1. Starting backend API
2. Updating API_BASE_URL in environment variables
3. Running frontend
4. Testing all features (search, filtering, checkout)

## Image Guidelines

### Product Images

- **Recommended Size**: 400x400px minimum
- **Format**: JPG or PNG
- **Background**: White or transparent
- **Thumbnail**: Same as main image or different angle

### Category Images

- **Recommended Size**: 300x200px minimum
- **Format**: JPG or PNG
- **Content**: Category representative image

### Image Paths

All image URLs use relative paths. Store images in `/public`:
```
/public/product-serum.jpg
/public/category-skincare.jpg
```

## Validation

All JSON files should be valid according to their schema:

```bash
# Validate JSON syntax
node -e "console.log(JSON.parse(require('fs').readFileSync('./products.json', 'utf8')))"
```

## Best Practices

1. **Keep IDs Sequential**: Use simple numeric strings for IDs
2. **Use Slugs**: Always include URL-friendly slugs for navigation
3. **Complete Data**: Fill all required fields
4. **Realistic Data**: Use realistic prices, descriptions, and ratings
5. **Consistent Formatting**: Match format of existing entries
6. **Valid Images**: Ensure all image URLs are accessible
7. **Category Mapping**: Ensure category_ids reference existing categories

## Data Integrity Checks

Before using seed data:

- [ ] All product IDs are unique
- [ ] All category IDs are unique
- [ ] All category_ids in products exist in categories
- [ ] All image URLs are valid or will be replaced
- [ ] Prices are reasonable (> 0 and < 1,000,000)
- [ ] Ratings are between 0 and 5
- [ ] Review counts are >= 0
- [ ] Stock quantities are >= 0
- [ ] Descriptions are non-empty
- [ ] JSON is properly formatted

## Performance Tips

1. **Pagination**: For large datasets, implement pagination
2. **Caching**: Cache seed data to reduce file reads
3. **Compression**: Compress JSON files in production
4. **CDN**: Serve images from CDN for faster loading

## Future Enhancements

- Add product reviews with ratings
- Add user favorites/wishlist data
- Add promotions and coupon codes
- Add inventory management
- Add seller information
- Add bulk product import/export
