'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Check,
  X,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react'

interface AdminUser {
  id: number
  email: string
  full_name: string
  created_at: string
  updated_at: string
}

interface EditState {
  email: string
  fullName: string
  password: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState<string | null>(null)

  // Create form
  const [showCreate, setShowCreate] = useState(false)
  const [createEmail, setCreateEmail] = useState('')
  const [createName, setCreateName] = useState('')
  const [createPassword, setCreatePassword] = useState('')
  const [showCreatePw, setShowCreatePw] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  // Inline edit state: { [userId]: EditState }
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editState, setEditState] = useState<EditState>({ email: '', fullName: '', password: '' })
  const [showEditPw, setShowEditPw] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState<number | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Delete
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setLoading(true)
    setPageError(null)
    try {
      const res = await fetch('/api/admin-users')
      if (!res.ok) throw new Error('Failed to load admin users')
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreateError(null)
    setCreating(true)
    try {
      const res = await fetch('/api/admin-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: createEmail, fullName: createName, password: createPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create admin user')
      setUsers((prev) => [...prev, data])
      setShowCreate(false)
      setCreateEmail('')
      setCreateName('')
      setCreatePassword('')
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setCreating(false)
    }
  }

  function startEdit(user: AdminUser) {
    setEditingId(user.id)
    setEditState({ email: user.email, fullName: user.full_name, password: '' })
    setShowEditPw(false)
    setSaveError(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setSaveError(null)
  }

  async function handleSave(userId: number) {
    setSaving(true)
    setSaveError(null)
    try {
      const payload: Record<string, string> = {
        email: editState.email,
        fullName: editState.fullName,
      }
      if (editState.password) payload.password = editState.password

      const res = await fetch(`/api/admin-users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update')

      setUsers((prev) => prev.map((u) => (u.id === userId ? data : u)))
      setEditingId(null)
      setSaveSuccess(userId)
      setTimeout(() => setSaveSuccess(null), 3000)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(userId: number) {
    setDeletingId(userId)
    try {
      const res = await fetch(`/api/admin-users/${userId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Delete failed')
      }
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    } catch (err) {
      console.error(err)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-7 h-7" />
            Admin Users
          </h1>
          <p className="text-muted-foreground mt-1">Manage who can access this admin dashboard</p>
        </div>
        <Button onClick={() => { setShowCreate(true); setCreateError(null) }} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Admin User
        </Button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <Card className="p-6 mb-6 border-primary/30">
          <h2 className="font-semibold mb-4">New Admin User</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="create-name">Full Name</Label>
              <Input
                id="create-name"
                placeholder="Jane Doe"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                type="email"
                placeholder="jane@example.com"
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="create-password">Password</Label>
              <div className="relative">
                <Input
                  id="create-password"
                  type={showCreatePw ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  minLength={8}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowCreatePw((v) => !v)}
                  tabIndex={-1}
                >
                  {showCreatePw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {createError && (
              <p className="sm:col-span-3 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                {createError}
              </p>
            )}

            <div className="sm:col-span-3 flex gap-2">
              <Button type="submit" disabled={creating} className="gap-2">
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Create
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => { setShowCreate(false); setCreateError(null) }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : pageError ? (
        <Card className="p-6 text-destructive">{pageError}</Card>
      ) : users.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          <ShieldCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No admin users yet. Create the first one above.</p>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold">Name</th>
                  <th className="text-left px-6 py-4 font-semibold">Email</th>
                  <th className="text-left px-6 py-4 font-semibold">Created</th>
                  <th className="text-left px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0">
                    {editingId === user.id ? (
                      /* ── Edit Row ── */
                      <td colSpan={4} className="px-6 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Full Name</Label>
                            <Input
                              value={editState.fullName}
                              onChange={(e) => setEditState((s) => ({ ...s, fullName: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Email</Label>
                            <Input
                              type="email"
                              value={editState.email}
                              onChange={(e) => setEditState((s) => ({ ...s, email: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">New Password <span className="text-muted-foreground font-normal">(leave blank to keep)</span></Label>
                            <div className="relative">
                              <Input
                                type={showEditPw ? 'text' : 'password'}
                                placeholder="Enter new password"
                                value={editState.password}
                                onChange={(e) => setEditState((s) => ({ ...s, password: e.target.value }))}
                                className="pr-10"
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                onClick={() => setShowEditPw((v) => !v)}
                                tabIndex={-1}
                              >
                                {showEditPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          {saveError && (
                            <p className="sm:col-span-3 text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                              {saveError}
                            </p>
                          )}

                          <div className="sm:col-span-3 flex gap-2">
                            <Button size="sm" disabled={saving} onClick={() => handleSave(user.id)} className="gap-1.5">
                              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelEdit} className="gap-1.5">
                              <X className="w-3.5 h-3.5" /> Cancel
                            </Button>
                          </div>
                        </div>
                      </td>
                    ) : (
                      /* ── Display Row ── */
                      <>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.full_name}</span>
                            {saveSuccess === user.id && (
                              <Badge className="bg-green-100 text-green-800 border-0 text-xs">Saved</Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => startEdit(user)}
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  disabled={deletingId === user.id}
                                  title="Delete"
                                >
                                  {deletingId === user.id
                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                    : <Trash2 className="w-4 h-4" />}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete &quot;{user.full_name}&quot;?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This admin user will be permanently removed and will lose access to the dashboard.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(user.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
