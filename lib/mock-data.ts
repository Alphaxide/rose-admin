export interface Category {
  id: number
  name: string
  slug: string
  image: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  categoryId: number
  rating: number
  reviewCount: number
  stockQuantity: number
  inStock: boolean
  image: string
  createdAt: string
}

export interface Order {
  id: number
  orderNumber: string
  userId: number
  customerName: string
  customerEmail: string
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  createdAt: string
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  name: string
  price: number
  quantity: number
}

export interface Customer {
  id: number
  email: string
  fullName: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  createdAt: string
  totalOrders: number
  totalSpent: number
}

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  pendingOrders: number
  lowStockProducts: number
}

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Skincare',
    slug: 'skincare',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    name: 'Makeup',
    slug: 'makeup',
    image: 'https://images.unsplash.com/photo-1596462502278-af155e41f50e?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    name: 'Hair Care',
    slug: 'haircare',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop',
  },
  {
    id: 4,
    name: 'Fragrance',
    slug: 'fragrance',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde0f?w=400&h=300&fit=crop',
  },
  {
    id: 5,
    name: 'Body Care',
    slug: 'bodycare',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=300&fit=crop',
  },
  {
    id: 6,
    name: 'Tools & Accessories',
    slug: 'tools-accessories',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop',
  },
]

// Mock Products
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Rose Glow Serum',
    description: 'Hydrating serum with rose extract and hyaluronic acid',
    price: 3500,
    originalPrice: 4500,
    categoryId: 1,
    rating: 4.8,
    reviewCount: 234,
    stockQuantity: 150,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'Luxe Lipstick Matte',
    description: 'Long-lasting matte lipstick in natural rose shades',
    price: 2200,
    originalPrice: 2800,
    categoryId: 2,
    rating: 4.6,
    reviewCount: 456,
    stockQuantity: 89,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1596462502278-af155e41f50e?w=400&h=400&fit=crop',
    createdAt: '2024-01-20T14:45:00Z',
  },
  {
    id: 3,
    name: 'Silk Hair Conditioner',
    description: 'Premium conditioner for soft and silky hair',
    price: 1800,
    originalPrice: 2200,
    categoryId: 3,
    rating: 4.7,
    reviewCount: 321,
    stockQuantity: 200,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
    createdAt: '2024-01-25T09:15:00Z',
  },
  {
    id: 4,
    name: 'Rose Essence Parfum',
    description: 'Elegant fragrance with rose and jasmine notes',
    price: 4500,
    categoryId: 4,
    rating: 4.9,
    reviewCount: 189,
    stockQuantity: 45,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde0f?w=400&h=400&fit=crop',
    createdAt: '2024-02-01T11:20:00Z',
  },
  {
    id: 5,
    name: 'Vitamin C Face Mask',
    description: 'Brightening face mask with vitamin C and aloe vera',
    price: 1500,
    originalPrice: 2000,
    categoryId: 1,
    rating: 4.5,
    reviewCount: 267,
    stockQuantity: 12,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    createdAt: '2024-02-05T16:30:00Z',
  },
  {
    id: 6,
    name: 'Eye Shadow Palette',
    description: '12 shades eyeshadow palette with matte and shimmer finishes',
    price: 3200,
    originalPrice: 4000,
    categoryId: 2,
    rating: 4.7,
    reviewCount: 512,
    stockQuantity: 78,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1596462502278-af155e41f50e?w=400&h=400&fit=crop',
    createdAt: '2024-02-10T13:45:00Z',
  },
  {
    id: 7,
    name: 'Hydrating Face Cream',
    description: 'Rich moisturizing cream for dry skin with rose oil',
    price: 2800,
    originalPrice: 3500,
    categoryId: 1,
    rating: 4.6,
    reviewCount: 298,
    stockQuantity: 95,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    createdAt: '2024-02-12T10:00:00Z',
  },
  {
    id: 8,
    name: 'Liquid Foundation SPF 30',
    description: 'Long-wear liquid foundation with sun protection',
    price: 2500,
    originalPrice: 3200,
    categoryId: 2,
    rating: 4.8,
    reviewCount: 645,
    stockQuantity: 120,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1596462502278-af155e41f50e?w=400&h=400&fit=crop',
    createdAt: '2024-02-13T15:30:00Z',
  },
  {
    id: 9,
    name: 'Hair Growth Oil',
    description: 'Nourishing oil blend to promote hair growth and shine',
    price: 1400,
    originalPrice: 1900,
    categoryId: 3,
    rating: 4.5,
    reviewCount: 387,
    stockQuantity: 160,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
    createdAt: '2024-02-14T09:45:00Z',
  },
  {
    id: 10,
    name: 'Rose Body Lotion',
    description: 'Lightweight body lotion with rose scent and aloe vera',
    price: 1200,
    originalPrice: 1600,
    categoryId: 5,
    rating: 4.6,
    reviewCount: 234,
    stockQuantity: 180,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop',
    createdAt: '2024-02-15T11:20:00Z',
  },
  {
    id: 11,
    name: 'Makeup Brush Set',
    description: 'Professional 24-piece makeup brush set with storage bag',
    price: 3800,
    originalPrice: 4800,
    categoryId: 6,
    rating: 4.9,
    reviewCount: 156,
    stockQuantity: 42,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=400&fit=crop',
    createdAt: '2024-02-16T14:10:00Z',
  },
  {
    id: 12,
    name: 'Intensive Hair Mask',
    description: 'Deep conditioning treatment mask for damaged hair',
    price: 1600,
    originalPrice: 2100,
    categoryId: 3,
    rating: 4.7,
    reviewCount: 421,
    stockQuantity: 88,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
    createdAt: '2024-02-17T08:30:00Z',
  },
  {
    id: 13,
    name: 'Blush Palette',
    description: '6 blush shades with highlighter for radiant glow',
    price: 2400,
    originalPrice: 3000,
    categoryId: 2,
    rating: 4.5,
    reviewCount: 267,
    stockQuantity: 105,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1596462502278-af155e41f50e?w=400&h=400&fit=crop',
    createdAt: '2024-02-18T12:45:00Z',
  },
  {
    id: 14,
    name: 'Anti-Aging Eye Cream',
    description: 'Targeted eye cream to reduce fine lines and puffiness',
    price: 3000,
    originalPrice: 3800,
    categoryId: 1,
    rating: 4.8,
    reviewCount: 532,
    stockQuantity: 67,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    createdAt: '2024-02-19T16:15:00Z',
  },
  {
    id: 15,
    name: 'Exfoliating Body Scrub',
    description: 'Gentle exfoliating scrub with rose petals and sea salt',
    price: 1100,
    originalPrice: 1500,
    categoryId: 5,
    rating: 4.4,
    reviewCount: 189,
    stockQuantity: 140,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop',
    createdAt: '2024-02-20T10:30:00Z',
  },
]

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: 'ORD-2024-001',
    userId: 1,
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    subtotal: 7000,
    tax: 700,
    shipping: 500,
    total: 8200,
    status: 'delivered',
    items: [
      { id: 1, orderId: 1, productId: 1, name: 'Rose Glow Serum', price: 3500, quantity: 2 },
      { id: 2, orderId: 1, productId: 2, name: 'Luxe Lipstick Matte', price: 2200, quantity: 1 },
    ],
    createdAt: '2024-02-20T08:30:00Z',
  },
  {
    id: 2,
    orderNumber: 'ORD-2024-002',
    userId: 2,
    customerName: 'Emily Davis',
    customerEmail: 'emily@example.com',
    subtotal: 5000,
    tax: 500,
    shipping: 300,
    total: 5800,
    status: 'shipped',
    items: [
      { id: 3, orderId: 2, productId: 4, name: 'Rose Essence Parfum', price: 4500, quantity: 1 },
      { id: 4, orderId: 2, productId: 5, name: 'Vitamin C Face Mask', price: 1500, quantity: 0 },
    ],
    createdAt: '2024-02-22T10:15:00Z',
  },
  {
    id: 3,
    orderNumber: 'ORD-2024-003',
    userId: 3,
    customerName: 'Jessica Smith',
    customerEmail: 'jessica@example.com',
    subtotal: 3500,
    tax: 350,
    shipping: 300,
    total: 4150,
    status: 'processing',
    items: [
      { id: 5, orderId: 3, productId: 1, name: 'Rose Glow Serum', price: 3500, quantity: 1 },
    ],
    createdAt: '2024-02-24T14:45:00Z',
  },
  {
    id: 4,
    orderNumber: 'ORD-2024-004',
    userId: 4,
    customerName: 'Amanda Wilson',
    customerEmail: 'amanda@example.com',
    subtotal: 4700,
    tax: 470,
    shipping: 300,
    total: 5470,
    status: 'pending',
    items: [
      { id: 6, orderId: 4, productId: 3, name: 'Silk Hair Conditioner', price: 1800, quantity: 2 },
      { id: 7, orderId: 4, productId: 6, name: 'Eye Shadow Palette', price: 3200, quantity: 0 },
    ],
    createdAt: '2024-02-25T09:20:00Z',
  },
  {
    id: 5,
    orderNumber: 'ORD-2024-005',
    userId: 5,
    customerName: 'Rachel Green',
    customerEmail: 'rachel@example.com',
    subtotal: 6800,
    tax: 680,
    shipping: 300,
    total: 7780,
    status: 'delivered',
    items: [
      { id: 8, orderId: 5, productId: 7, name: 'Hydrating Face Cream', price: 2800, quantity: 2 },
      { id: 9, orderId: 5, productId: 9, name: 'Hair Growth Oil', price: 1400, quantity: 1 },
      { id: 10, orderId: 5, productId: 15, name: 'Exfoliating Body Scrub', price: 1100, quantity: 1 },
    ],
    createdAt: '2024-02-21T07:45:00Z',
  },
  {
    id: 6,
    orderNumber: 'ORD-2024-006',
    userId: 6,
    customerName: 'Michelle Martinez',
    customerEmail: 'michelle@example.com',
    subtotal: 5600,
    tax: 560,
    shipping: 300,
    total: 6460,
    status: 'shipped',
    items: [
      { id: 11, orderId: 6, productId: 8, name: 'Liquid Foundation SPF 30', price: 2500, quantity: 2 },
      { id: 12, orderId: 6, productId: 10, name: 'Rose Body Lotion', price: 1200, quantity: 1 },
    ],
    createdAt: '2024-02-23T13:20:00Z',
  },
  {
    id: 7,
    orderNumber: 'ORD-2024-007',
    userId: 7,
    customerName: 'Lisa Anderson',
    customerEmail: 'lisa@example.com',
    subtotal: 3800,
    tax: 380,
    shipping: 300,
    total: 4480,
    status: 'processing',
    items: [
      { id: 13, orderId: 7, productId: 11, name: 'Makeup Brush Set', price: 3800, quantity: 1 },
    ],
    createdAt: '2024-02-24T11:10:00Z',
  },
  {
    id: 8,
    orderNumber: 'ORD-2024-008',
    userId: 8,
    customerName: 'Jennifer Lee',
    customerEmail: 'jennifer@example.com',
    subtotal: 4200,
    tax: 420,
    shipping: 300,
    total: 4920,
    status: 'delivered',
    items: [
      { id: 14, orderId: 8, productId: 13, name: 'Blush Palette', price: 2400, quantity: 1 },
      { id: 15, orderId: 8, productId: 5, name: 'Vitamin C Face Mask', price: 1500, quantity: 1 },
    ],
    createdAt: '2024-02-22T09:30:00Z',
  },
  {
    id: 9,
    orderNumber: 'ORD-2024-009',
    userId: 9,
    customerName: 'Victoria Brown',
    customerEmail: 'victoria@example.com',
    subtotal: 7500,
    tax: 750,
    shipping: 300,
    total: 8550,
    status: 'pending',
    items: [
      { id: 16, orderId: 9, productId: 14, name: 'Anti-Aging Eye Cream', price: 3000, quantity: 1 },
      { id: 17, orderId: 9, productId: 1, name: 'Rose Glow Serum', price: 3500, quantity: 1 },
      { id: 18, orderId: 9, productId: 10, name: 'Rose Body Lotion', price: 1200, quantity: 1 },
    ],
    createdAt: '2024-02-25T14:50:00Z',
  },
  {
    id: 10,
    orderNumber: 'ORD-2024-010',
    userId: 10,
    customerName: 'Olivia Taylor',
    customerEmail: 'olivia@example.com',
    subtotal: 6400,
    tax: 640,
    shipping: 300,
    total: 7340,
    status: 'shipped',
    items: [
      { id: 19, orderId: 10, productId: 12, name: 'Intensive Hair Mask', price: 1600, quantity: 2 },
      { id: 20, orderId: 10, productId: 9, name: 'Hair Growth Oil', price: 1400, quantity: 2 },
    ],
    createdAt: '2024-02-20T16:25:00Z',
  },
]

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: 1,
    email: 'sarah@example.com',
    fullName: 'Sarah Johnson',
    phone: '+254712345678',
    address: '123 Beauty Lane',
    city: 'Nairobi',
    state: 'Nairobi',
    zipCode: '00100',
    createdAt: '2023-11-15T10:30:00Z',
    totalOrders: 5,
    totalSpent: 28500,
  },
  {
    id: 2,
    email: 'emily@example.com',
    fullName: 'Emily Davis',
    phone: '+254798765432',
    address: '456 Rose Street',
    city: 'Nairobi',
    state: 'Nairobi',
    zipCode: '00200',
    createdAt: '2024-01-10T14:45:00Z',
    totalOrders: 3,
    totalSpent: 15600,
  },
  {
    id: 3,
    email: 'jessica@example.com',
    fullName: 'Jessica Smith',
    phone: '+254712111222',
    address: '789 Glow Avenue',
    city: 'Mombasa',
    state: 'Coastal',
    zipCode: '80100',
    createdAt: '2024-01-20T09:15:00Z',
    totalOrders: 2,
    totalSpent: 9200,
  },
  {
    id: 4,
    email: 'amanda@example.com',
    fullName: 'Amanda Wilson',
    phone: '+254799999888',
    address: '321 Serum Way',
    city: 'Nairobi',
    state: 'Nairobi',
    zipCode: '00300',
    createdAt: '2024-02-05T11:20:00Z',
    totalOrders: 1,
    totalSpent: 5470,
  },
  {
    id: 5,
    email: 'rachel@example.com',
    fullName: 'Rachel Green',
    phone: '+254745555666',
    address: '654 Beauty Plaza',
    city: 'Kisumu',
    state: 'Kisumu',
    zipCode: '40100',
    createdAt: '2023-12-20T13:15:00Z',
    totalOrders: 4,
    totalSpent: 22300,
  },
  {
    id: 6,
    email: 'michelle@example.com',
    fullName: 'Michelle Martinez',
    phone: '+254756789012',
    address: '987 Spa Road',
    city: 'Nairobi',
    state: 'Nairobi',
    zipCode: '00400',
    createdAt: '2024-01-05T08:45:00Z',
    totalOrders: 3,
    totalSpent: 18900,
  },
  {
    id: 7,
    email: 'lisa@example.com',
    fullName: 'Lisa Anderson',
    phone: '+254767890123',
    address: '246 Luxe Drive',
    city: 'Nairobi',
    state: 'Nairobi',
    zipCode: '00500',
    createdAt: '2024-02-10T10:30:00Z',
    totalOrders: 2,
    totalSpent: 11200,
  },
  {
    id: 8,
    email: 'jennifer@example.com',
    fullName: 'Jennifer Lee',
    phone: '+254778901234',
    address: '135 Bloom Street',
    city: 'Nakuru',
    state: 'Rift Valley',
    zipCode: '20100',
    createdAt: '2024-01-25T15:20:00Z',
    totalOrders: 3,
    totalSpent: 14500,
  },
  {
    id: 9,
    email: 'victoria@example.com',
    fullName: 'Victoria Brown',
    phone: '+254789012345',
    address: '579 Radiance Lane',
    city: 'Nairobi',
    state: 'Nairobi',
    zipCode: '00600',
    createdAt: '2024-02-01T11:45:00Z',
    totalOrders: 2,
    totalSpent: 13800,
  },
  {
    id: 10,
    email: 'olivia@example.com',
    fullName: 'Olivia Taylor',
    phone: '+254790123456',
    address: '802 Shine Circle',
    city: 'Nairobi',
    state: 'Nairobi',
    zipCode: '00700',
    createdAt: '2024-01-15T09:30:00Z',
    totalOrders: 3,
    totalSpent: 19650,
  },
  {
    id: 11,
    email: 'sophia@example.com',
    fullName: 'Sophia White',
    phone: '+254701234567',
    address: '413 Silk Path',
    city: 'Nairobi',
    state: 'Nairobi',
    zipCode: '00800',
    createdAt: '2024-02-08T14:10:00Z',
    totalOrders: 1,
    totalSpent: 8900,
  },
  {
    id: 12,
    email: 'isabella@example.com',
    fullName: 'Isabella Garcia',
    phone: '+254712345670',
    address: '647 Grace Avenue',
    city: 'Nairobi',
    state: 'Nairobi',
    zipCode: '00900',
    createdAt: '2023-11-28T10:15:00Z',
    totalOrders: 4,
    totalSpent: 25600,
  },
  {
    id: 13,
    email: 'charlotte@example.com',
    fullName: 'Charlotte Miller',
    phone: '+254723456781',
    address: '768 Elegance Drive',
    city: 'Nairobi',
    state: 'Nairobi',
    zipCode: '01000',
    createdAt: '2024-02-03T16:40:00Z',
    totalOrders: 1,
    totalSpent: 6700,
  },
  {
    id: 14,
    email: 'amelia@example.com',
    fullName: 'Amelia Jones',
    phone: '+254734567892',
    address: '891 Velvet Lane',
    city: 'Nairobi',
    state: 'Nairobi',
    zipCode: '01100',
    createdAt: '2024-01-12T12:25:00Z',
    totalOrders: 2,
    totalSpent: 11400,
  },
  {
    id: 15,
    email: 'mia@example.com',
    fullName: 'Mia Thompson',
    phone: '+254745678903',
    address: '924 Crystal Road',
    city: 'Nairobi',
    state: 'Nairobi',
    zipCode: '01200',
    createdAt: '2024-02-07T08:50:00Z',
    totalOrders: 1,
    totalSpent: 7850,
  },
]

// Dashboard Stats
export const getMockDashboardStats = (): DashboardStats => {
  return {
    totalRevenue: 58220,
    totalOrders: mockOrders.length,
    totalCustomers: mockCustomers.length,
    totalProducts: mockProducts.length,
    pendingOrders: mockOrders.filter((o) => o.status === 'pending').length,
    lowStockProducts: mockProducts.filter((p) => p.stockQuantity < 50).length,
  }
}
