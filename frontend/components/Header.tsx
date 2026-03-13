'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, User, Menu, X, Heart, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'
import SearchBar from './SearchBar'
import MobileSearchBar from './MobileSearchBar'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const { totalItems } = useCart()

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 py-3 border-b border-border bg-muted">
          <MobileSearchBar />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image src="/rose.png" alt="BeautyByRose" width={40} height={40} className="rounded-lg" />
              <div className="hidden sm:flex flex-col gap-0 leading-tight">
                <span className="font-bold text-base text-foreground">beauty</span>
                <span className="text-xs text-primary font-semibold -mt-1">by rose</span>
              </div>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <SearchBar />
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              Home
            </Link>
            <Link href="/products" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              Products
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Search Button */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden text-foreground hover:text-primary transition-colors p-2"
            >
              <Search className="w-6 h-6" />
            </button>

            
            <Link href="/cart" className="text-foreground hover:text-primary transition-colors p-2 relative">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
            <Link href="/account" className="text-foreground hover:text-primary transition-colors p-2 hidden sm:block">
              <User className="w-6 h-6" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-foreground hover:text-primary transition-colors p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-border space-y-3 flex flex-col">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
