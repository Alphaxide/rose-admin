'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Save } from 'lucide-react'

interface StoreSettings {
  payment_type: 'paybill' | 'till'
  payment_number: string
  phone: string
  whatsapp: string
  email: string
  address: string
}

const DEFAULTS: StoreSettings = {
  payment_type: 'paybill',
  payment_number: '',
  phone: '+254 700 000 000',
  whatsapp: '+254700000000',
  email: 'support@beautybyrose.co.ke',
  address: 'Westlands, Nairobi, Kenya',
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => setSettings({ ...DEFAULTS, ...data }))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const set = (key: keyof StoreSettings) => (val: string) =>
    setSettings((p) => ({ ...p, [key]: val }))

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Store Settings</h1>
        <p className="text-muted-foreground">Manage payment and contact information shown to customers</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Payment */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-lg">Payment Details</h2>

          <div className="space-y-2">
            <Label>Payment Type</Label>
            <div className="flex gap-3">
              {(['paybill', 'till'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSettings((p) => ({ ...p, payment_type: type }))}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${
                    settings.payment_type === type
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  {type === 'paybill' ? 'Paybill' : 'Buy Goods (Till)'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_number">
              {settings.payment_type === 'paybill' ? 'Paybill Number' : 'Till Number'}
            </Label>
            <Input
              id="payment_number"
              placeholder={settings.payment_type === 'paybill' ? 'e.g. 247247' : 'e.g. 123456'}
              value={settings.payment_number}
              onChange={(e) => set('payment_number')(e.target.value)}
            />
          </div>
        </Card>

        {/* Contact */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-lg">Contact Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="+254 700 000 000" value={settings.phone} onChange={(e) => set('phone')(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input id="whatsapp" placeholder="+254700000000" value={settings.whatsapp} onChange={(e) => set('whatsapp')(e.target.value)} />
              <p className="text-xs text-muted-foreground">No spaces — used in wa.me links</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Contact Email</Label>
            <Input id="email" type="email" placeholder="support@beautybyrose.co.ke" value={settings.email} onChange={(e) => set('email')(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Store Address</Label>
            <Input id="address" placeholder="Westlands, Nairobi, Kenya" value={settings.address} onChange={(e) => set('address')(e.target.value)} />
          </div>
        </Card>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>
        )}

        <Button type="submit" disabled={saving} className="min-w-32">
          {saving ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
          ) : saved ? (
            '✓ Saved!'
          ) : (
            <><Save className="w-4 h-4 mr-2" />Save Settings</>
          )}
        </Button>
      </form>
    </div>
  )
}
