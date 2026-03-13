'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Loader2, Copy, Check, ExternalLink } from 'lucide-react'

const CREATE_SQL = `-- Run this in your Supabase SQL Editor
-- Dashboard → SQL Editor → New query → paste → Run

CREATE TABLE IF NOT EXISTS public.admin_users (
  id           serial PRIMARY KEY,
  email        character varying NOT NULL UNIQUE,
  full_name    character varying NOT NULL,
  password_hash text NOT NULL,
  created_at   timestamp without time zone DEFAULT now(),
  updated_at   timestamp without time zone DEFAULT now()
);

GRANT ALL ON TABLE public.admin_users TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.admin_users_id_seq TO service_role;
REVOKE ALL ON TABLE public.admin_users FROM anon, authenticated;`

type Status = 'idle' | 'checking' | 'table_missing' | 'ready' | 'seeding' | 'done' | 'error'

export default function SetupPage() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    checkStatus()
  }, [])

  async function checkStatus() {
    setStatus('checking')
    try {
      const res = await fetch('/api/setup')
      const data = await res.json()
      if (data.status === 'table_missing') {
        setStatus('table_missing')
      } else if (data.status === 'ready') {
        if (data.userCount === 0) {
          setStatus('ready')
        } else {
          setStatus('done')
          setMessage(`Setup complete. ${data.userCount} admin user(s) exist.`)
        }
      }
    } catch {
      setStatus('error')
      setMessage('Could not reach the server.')
    }
  }

  async function handleSeed() {
    setStatus('seeding')
    setMessage('')
    try {
      const res = await fetch('/api/setup', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setStatus('table_missing')
        setMessage(data.error || 'Failed to seed.')
      } else {
        setStatus('done')
        setMessage(data.message || `Admin user created: ${data.user?.email}`)
      }
    } catch {
      setStatus('error')
      setMessage('Network error.')
    }
  }

  function copySQL() {
    navigator.clipboard.writeText(CREATE_SQL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">BeautyByRose Setup</h1>
          <p className="text-slate-500 mt-1">One-time database setup for the admin dashboard</p>
        </div>

        {/* Step 1 — Create Table */}
        <Card className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5 ${
              status === 'ready' || status === 'seeding' || status === 'done'
                ? 'bg-green-100 text-green-700'
                : 'bg-slate-200 text-slate-600'
            }`}>
              {status === 'ready' || status === 'seeding' || status === 'done'
                ? <CheckCircle2 className="w-4 h-4" />
                : '1'}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-slate-900">Create the admin_users table</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Run this SQL in your{' '}
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-0.5"
                >
                  Supabase SQL Editor <ExternalLink className="w-3 h-3" />
                </a>
              </p>

              <div className="relative mt-3">
                <pre className="bg-slate-900 text-slate-100 text-xs rounded-lg p-4 overflow-x-auto leading-relaxed">
                  {CREATE_SQL}
                </pre>
                <button
                  onClick={copySQL}
                  className="absolute top-2 right-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded px-2 py-1 text-xs flex items-center gap-1 transition-colors"
                >
                  {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Step 2 — Seed admin user */}
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5 ${
              status === 'done'
                ? 'bg-green-100 text-green-700'
                : 'bg-slate-200 text-slate-600'
            }`}>
              {status === 'done' ? <CheckCircle2 className="w-4 h-4" /> : '2'}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-slate-900">Seed the initial admin user</h2>
              <p className="text-sm text-slate-500 mt-0.5 mb-4">
                After running the SQL above, click the button below to create the first admin account.
              </p>

              {/* Credentials preview */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm">
                <p className="font-semibold text-blue-900 mb-1">Initial credentials</p>
                <p className="text-blue-800">Name: <span className="font-mono">Alpha</span></p>
                <p className="text-blue-800">Email: <span className="font-mono">kalpha@gmail.com</span></p>
                <p className="text-blue-800">Password: <span className="font-mono">password</span></p>
                <p className="text-xs text-blue-600 mt-1">Change the password after first login via Admin Users page.</p>
              </div>

              {/* Status feedback */}
              {status === 'checking' && (
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking database…
                </div>
              )}
              {status === 'table_missing' && (
                <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                  <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    Table not found. Run the SQL in Step 1 first, then click &quot;Re-check&quot;.
                    {message && <p className="mt-1 opacity-75">{message}</p>}
                  </div>
                </div>
              )}
              {status === 'done' && (
                <div className="flex items-start gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {message || 'Setup complete!'}
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                  <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {message}
                </div>
              )}

              <div className="flex gap-3">
                {status === 'table_missing' && (
                  <Button variant="outline" onClick={checkStatus} className="gap-2">
                    <Loader2 className="w-4 h-4" />
                    Re-check
                  </Button>
                )}
                {(status === 'ready' || status === 'table_missing') && (
                  <Button
                    onClick={handleSeed}
                    disabled={status === 'table_missing'}
                    className="gap-2"
                  >
                    Seed Admin User
                  </Button>
                )}
                {status === 'seeding' && (
                  <Button disabled className="gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Seeding…
                  </Button>
                )}
                {status === 'done' && (
                  <Button onClick={() => router.push('/login')} className="gap-2 bg-green-600 hover:bg-green-700">
                    <CheckCircle2 className="w-4 h-4" />
                    Go to Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
