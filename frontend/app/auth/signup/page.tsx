'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSeller, setIsSeller] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    shopName: '',
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Validate password
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long')
        setIsLoading(false)
        return
      }

      // Simulate signup API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Store user data
      localStorage.setItem('beautybyrose_user', JSON.stringify({
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        isSeller: isSeller,
        shopName: isSeller ? formData.shopName : null,
        id: Math.random().toString(36).substr(2, 9),
      }))

      // Redirect to account or onboarding
      window.location.href = '/account'
    } catch (err) {
      setError('Signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 w-full flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-card rounded-lg border border-border p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
              <p className="text-muted-foreground">
                Join BeautyByRose and discover premium beauty products
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="+254 700 000 000"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  At least 8 characters
                </p>
              </div>

              {/* Seller Toggle */}
              <div className="border border-border rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSeller}
                    onChange={(e) => setIsSeller(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-sm">
                      I want to sell products
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Register as a seller to list your beauty products
                    </p>
                  </div>
                </label>
              </div>

              {/* Shop Name (if seller) */}
              {isSeller && (
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    Shop Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Your Beauty Shop"
                    value={formData.shopName}
                    onChange={(e) =>
                      setFormData({ ...formData, shopName: e.target.value })
                    }
                    required={isSeller}
                  />
                </div>
              )}

              {/* Terms */}
              <label className="flex items-start gap-2 text-xs">
                <input type="checkbox" className="w-4 h-4 rounded mt-0.5" required />
                <span className="text-muted-foreground">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 h-auto text-base flex items-center justify-center gap-2 mt-6"
              >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-primary hover:text-primary/80 transition-colors font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Info */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
