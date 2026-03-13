'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface StoreSettings {
  phone: string
  email: string
  address: string
}

const DEFAULTS: StoreSettings = {
  phone: '+254 700 000 000',
  email: 'support@beautybyrose.co.ke',
  address: 'Westlands, Nairobi, Kenya',
}

export default function Footer() {
  const [contact, setContact] = useState<StoreSettings>(DEFAULTS)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => setContact({ phone: data.phone || DEFAULTS.phone, email: data.email || DEFAULTS.email, address: data.address || DEFAULTS.address }))
      .catch(() => {})
  }, [])

  return (
    <footer className="bg-foreground/5 text-foreground mt-16">
      {/* Newsletter Section */}
      <div className="bg-primary">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2 text-primary-foreground">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-primary-foreground/80 text-sm">
                Get exclusive deals and beauty tips delivered to your inbox
              </p>
            </div>
            <div className="w-full md:w-auto flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground/20 border-primary-foreground/30 placeholder:text-primary-foreground/50 text-primary-foreground"
              />
              <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Company */}
          <div>
            <h4 className="font-bold mb-4 text-foreground">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4 text-foreground">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Help Center</Link></li>
              <li><Link href="/shipping" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Returns</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors text-sm">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-foreground">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">{contact.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="text-muted-foreground hover:text-foreground transition-colors text-sm">{contact.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href={`mailto:${contact.email}`} className="text-muted-foreground hover:text-foreground transition-colors text-sm">{contact.email}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">B</span>
            </div>
            <span className="font-bold text-foreground">BeautyByRose</span>
          </div>
          <p className="text-muted-foreground text-sm text-center md:text-right">
            © 2024 BeautyByRose. All rights reserved. | Made with ❤️ for Nairobi
          </p>
        </div>
      </div>
    </footer>
  )
}
