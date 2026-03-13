import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AuthProvider } from '@/lib/auth-context'
import './theme-colors.css'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'BeautyByRose Admin Dashboard',
  description: 'Admin dashboard for BeautyByRose ecommerce',
  icons: {
    icon: '/rose.png',
    apple: '/rose.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
