'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface WishlistItem {
  product_id: string
  name: string
  price: number
  image_url: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  totalItems: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('beautyhub_wishlist')
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist))
      } catch (error) {
        console.error('Failed to load wishlist from localStorage:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save wishlist to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('beautyhub_wishlist', JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addItem = (newItem: WishlistItem) => {
    setItems((prevItems) => {
      const exists = prevItems.find((item) => item.product_id === newItem.product_id)
      if (exists) {
        return prevItems
      }
      return [...prevItems, newItem]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product_id !== productId))
  }

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.product_id === productId)
  }

  const totalItems = items.length

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, totalItems }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
