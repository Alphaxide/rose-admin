'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Save, LogOut, MapPin, Phone, Mail, CheckCircle } from 'lucide-react'

const ADMIN_USER = 'beautybyrose'
const ADMIN_PASS = 'beautybyrose'

const DEFAULT_CONTACT = {
  address: 'Westlands, Nairobi, Kenya',
  phone: '+254 700 000 000',
  email: 'support@beautybyrose.co.ke',
}

function loadContact() {
  try {
    const stored = localStorage.getItem('beauty_contact')
    return stored ? { ...DEFAULT_CONTACT, ...JSON.parse(stored) } : { ...DEFAULT_CONTACT }
  } catch {
    return { ...DEFAULT_CONTACT }
  }
}

export default function AdminPage() {
  const [authed, setAuthed]       = useState(false)
  const [username, setUsername]   = useState('')
  const [password, setPassword]   = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [loginError, setLoginError] = useState('')

  const [contact, setContact]     = useState({ ...DEFAULT_CONTACT })
  const [saved, setSaved]         = useState(false)

  // Check session on mount
  useEffect(() => {
    if (sessionStorage.getItem('admin_authed') === '1') {
      setAuthed(true)
      setContact(loadContact())
    }
  }, [])

  function handleLogin(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      sessionStorage.setItem('admin_authed', '1')
      setAuthed(true)
      setContact(loadContact())
      setLoginError('')
    } else {
      setLoginError('Incorrect username or password.')
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_authed')
    setAuthed(false)
    setUsername('')
    setPassword('')
  }

  function handleSave(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    localStorage.setItem('beauty_contact', JSON.stringify(contact))
    // Notify other tabs/components
    window.dispatchEvent(new Event('storage'))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  // ── Login Screen ──────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <div className="leading-tight">
              <p className="font-bold text-foreground">beauty</p>
              <p className="text-xs text-primary font-semibold -mt-0.5">by rose</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-foreground mb-1">Admin Login</h1>
            <p className="text-muted-foreground text-sm mb-6">Sign in to manage your store</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full px-3 py-2 pr-10 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <p className="text-destructive text-sm">{loginError}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // ── Admin Dashboard ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">B</span>
            </div>
            <div className="leading-tight">
              <p className="font-bold text-foreground text-sm">beauty</p>
              <p className="text-xs text-primary font-semibold -mt-0.5">by rose — Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-foreground mb-1">Contact Information</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Update the contact details shown in the website footer.
        </p>

        <form onSubmit={handleSave} className="bg-card border border-border rounded-2xl p-8 space-y-6">
          {/* Address */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              Address
            </label>
            <input
              type="text"
              value={contact.address}
              onChange={(e) => setContact({ ...contact, address: e.target.value })}
              placeholder="e.g. Westlands, Nairobi, Kenya"
              required
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
              <Phone className="w-4 h-4 text-primary" />
              Phone Number
            </label>
            <input
              type="text"
              value={contact.phone}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              placeholder="e.g. +254 700 000 000"
              required
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
              <Mail className="w-4 h-4 text-primary" />
              Email Address
            </label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              placeholder="e.g. support@beautybyrose.co.ke"
              required
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>

            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                <CheckCircle className="w-4 h-4" />
                Saved! Footer updated.
              </span>
            )}
          </div>
        </form>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Changes are saved locally and reflected immediately in the footer.
        </p>
      </main>
    </div>
  )
}
