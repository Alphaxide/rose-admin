# BeautyHub - E-Commerce Platform for Beauty Products in Nairobi

A modern, mobile-first e-commerce application built for selling premium beauty products in Nairobi, Kenya.

## Features

### Customer Features
- **Product Catalog**: Browse beautiful products with advanced filtering by category and price
- **Category Shopping**: Visual category cards (Skincare, Makeup, Haircare, Body Care, Fragrances) for easy navigation
- **Featured Products Section**: Highlighted premium products on home page
- **Search Functionality**: Quick search to find products by name or description
- **Shopping Cart**: Add/remove products, adjust quantities with persistent storage
- **Checkout**: Multi-step checkout process with shipping address collection
- **M-Pesa Payment Integration**: Seamless mobile money payment via M-Pesa
- **Order Management**: View order history and track order status
- **Wishlist**: Save favorite products for later
- **User Accounts**: Create accounts, manage profiles, and view order history
- **Customer Testimonials**: View real customer reviews and ratings
- **Promotional Banners**: Flash sales and limited-time offers
- **Why Choose Us Section**: Highlight brand benefits

### Seller/Admin Features
- **Dashboard**: Overview of sales, revenue, products, and customer metrics
- **Product Management**: Add, edit, and delete products
- **Inventory Management**: Track stock levels and manage availability
- **Order Management**: View and process customer orders
- **Sales Analytics**: Monitor performance metrics and trends
- **Shop Management**: Customize shop information and branding

### Design Features
- **Mobile-First Design**: Optimized for all screen sizes (320px and up)
- **Solid, Premium Aesthetic**: No gradients, no glassmorphism - clean, professional UI
- **Responsive Layout**: Touch-friendly buttons (44x44px minimum), adaptive grid layouts
- **Brand Colors**: 
  - Primary: Vibrant Yellow (#fbbf24)
  - Secondary: Bright Yellow (#fcd34d)
  - Accent: Hot Pink (#ec4899)
  - Neutrals: Professional grays and off-whites

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **State Management**: React Context (Cart)
- **Database**: Supabase (PostgreSQL with RLS)
- **Authentication**: Supabase Auth (ready to integrate)
- **Payment**: M-Pesa integration (via Pesapal/Daraja API)
- **Images**: Next.js Image optimization
- **Icons**: Lucide React

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with CartProvider
│   ├── page.tsx                # Home/Products page
│   ├── globals.css             # Global styles with design tokens
│   ├── auth/
│   │   ├── login/page.tsx      # Login page
│   │   └── signup/page.tsx     # Sign up page
│   ├── account/page.tsx        # User profile & orders
│   ├── cart/page.tsx           # Shopping cart
│   ├── checkout/page.tsx       # Checkout with M-Pesa
│   ├── product/[id]/page.tsx   # Product details
│   └── admin/page.tsx          # Seller dashboard
├── components/
│   ├── Header.tsx              # Navigation header with cart badge
│   ├── BottomNav.tsx           # Mobile bottom navigation bar
│   ├── Footer.tsx              # Footer with links
│   ├── ProductCard.tsx         # Product card component (no ratings)
│   ├── ProductFilters.tsx      # Category & price filters
│   ├── PromoBanner.tsx         # Promotional flash sale banner
│   └── ui/                     # shadcn/ui components
├── context/
│   └── CartContext.tsx         # Shopping cart state management
├── lib/
│   ├── supabase.ts            # Supabase client setup
│   └── utils.ts               # Utility functions
├── types/
│   └── database.ts            # TypeScript types for database
├── scripts/
│   └── init-database.sql      # Supabase schema setup
└── public/
    └── images/                # Assets
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beautyhub
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup Supabase** (Optional - for real backend)
   - Create a Supabase project
   - Run the schema from `scripts/init-database.sql`
   - Add environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
     ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

## Key Pages

### Customer Pages
- `/` - Home with product catalog, categories, featured products, testimonials
- `/product/[id]` - Product details page with reviews and specs
- `/cart` - Shopping cart with quantity adjustment
- `/checkout` - Checkout with M-Pesa payment
- `/wishlist` - Saved favorite products
- `/auth/login` - User login
- `/auth/signup` - User registration (with seller option)
- `/account` - User profile and order history

### Admin Pages
- `/admin` - Seller dashboard with stats and management

## Database Schema

The app includes a comprehensive schema in `scripts/init-database.sql` with:
- Users (with seller profiles)
- Categories
- Products
- Cart Items
- Orders & Order Items
- Reviews
- Favorites/Wishlist
- Payment Transactions

All tables include proper Row Level Security (RLS) policies for security.

## Shopping Flow

1. **Browse**: Users search and filter products on the home page
2. **View Details**: Click on a product to see full details, reviews, and specifications
3. **Add to Cart**: Add items with quantity selection
4. **Checkout**: 
   - Enter shipping address
   - Select M-Pesa payment
   - Enter M-Pesa phone number
   - Complete payment
5. **Confirmation**: Order confirmation with tracking details
6. **Track**: View order status in account page

## M-Pesa Integration

The checkout supports M-Pesa payment integration. To enable:

1. Register with Pesapal or Daraja (MPESA API)
2. Add API credentials to environment variables
3. Implement the actual payment gateway API call in `/app/checkout/page.tsx`

Current implementation includes UI and flow - backend integration ready to connect.

## Mobile Responsiveness

The app is designed mobile-first:
- Responsive grid layouts (2 cols on mobile, 3+ on desktop)
- Touch-friendly buttons and inputs (44x44px minimum)
- Collapsible filters on mobile (hamburger menu style)
- Bottom sheets and modals for mobile UX
- Optimized images with Next.js Image component

## Styling & Colors

All styling uses Tailwind CSS with custom color tokens:

```css
/* Primary Colors */
--primary: #fbbf24 (Vibrant Yellow)
--secondary: #fcd34d (Bright Yellow)
--accent: #ec4899 (Hot Pink)

/* Neutrals */
--background: #ffffff
--foreground: #1c1917
--border: #e7e5e4
--muted: #f5f5f4
```

### New Design Updates
- **Color Scheme**: Changed from brown/rose to vibrant yellow/pink for modern, energetic feel
- **Mobile Bottom Nav**: Fixed navigation bar for easy access to Home, Cart, Wishlist, Account
- **Enhanced Product Grid**: 2 columns on mobile (shows more items), 3-4 columns on larger screens
- **No Star Ratings**: Clean product cards without star ratings on home page
- **Category Section**: Visual category buttons with emojis for quick navigation
- **Promotional Content**: Flash sale banners, testimonials, and "Why Choose Us" sections

## Performance

- Image optimization with Next.js Image component
- Responsive images with proper sizing
- CSS modules and Tailwind for minimal CSS
- Client-side state management with Context API
- Lazy loading for routes

## Security

- Row Level Security (RLS) on Supabase tables
- Password hashing (to be implemented with Supabase Auth)
- HTTPS for all external API calls
- Environment variables for sensitive data
- CSRF protection with Next.js

## Future Enhancements

- [ ] Live Supabase integration
- [ ] Real M-Pesa payment processing
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Admin analytics dashboard
- [ ] Product recommendations
- [ ] Customer reviews with images
- [ ] Inventory alerts
- [ ] Multi-language support (English/Swahili)
- [ ] Dark mode toggle
- [ ] Social sharing features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@beautyhub.co.ke or open an issue in the repository.

---

Built with ❤️ for Nairobi's beauty community
