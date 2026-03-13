import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import BottomNav from '@/components/BottomNav'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'BeautyByRose - Premium Beauty Products in Nairobi',
  description: 'Discover premium beauty, skincare, makeup, and haircare products in Nairobi. Shop the best beauty brands with fast delivery.',
  keywords: 'beauty products, skincare, makeup, haircare, Nairobi, Kenya',
  icons: {
    icon: '/rose.png',
    apple: '/rose.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
  themeColor: '#F68B1E',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background text-foreground pb-16 md:pb-0">
        <WishlistProvider>
          <CartProvider>
            {children}
            <BottomNav />
          </CartProvider>
        </WishlistProvider>
        <Analytics />
      </body>
    </html>
  )
}
