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
]

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: 1,
    email: 'sarah@example.com',
    fullName: 'Sarah Johnson',
    phone: '+254712345678',
    createdAt: '2023-11-15T10:30:00Z',
    totalOrders: 5,
    totalSpent: 28500,
  },
  {
    id: 2,
    email: 'emily@example.com',
    fullName: 'Emily Davis',
    phone: '+254798765432',
    createdAt: '2024-01-10T14:45:00Z',
    totalOrders: 3,
    totalSpent: 15600,
  },
  {
    id: 3,
    email: 'jessica@example.com',
    fullName: 'Jessica Smith',
    phone: '+254712111222',
    createdAt: '2024-01-20T09:15:00Z',
    totalOrders: 2,
    totalSpent: 9200,
  },
  {
    id: 4,
    email: 'amanda@example.com',
    fullName: 'Amanda Wilson',
    phone: '+254799999888',
    createdAt: '2024-02-05T11:20:00Z',
    totalOrders: 1,
    totalSpent: 5470,
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
