'use client'

import Link from 'next/link'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PromoBanner() {
  return (
    <div className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-xl p-6 md:p-8 my-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase">Flash Sale</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Up to 50% Off Selected Items
          </h3>
          <p className="text-accent-foreground/90 mb-4 md:mb-0">
            Don't miss out! Limited time offer on your favorite beauty products.
          </p>
        </div>
        <Link href="/">
          <Button 
            variant="secondary" 
            size="lg"
            className="font-semibold whitespace-nowrap"
          >
            Shop Flash Sale
          </Button>
        </Link>
      </div>
    </div>
  )
}
