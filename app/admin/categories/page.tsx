'use client'

import { useEffect, useState } from 'react'
import { Category } from '@/lib/mock-data'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash2, X, Upload, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // Add form
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null)
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  // Delete state
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  async function uploadImage(file: File): Promise<string> {
    const ext = file.name.split('.').pop()
    const path = `categories/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: false })
    if (error) throw new Error(`Image upload failed: ${error.message}`)
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
  }

  // --- Add ---
  function handleNameChange(val: string) { setName(val); setSlug(slugify(val)) }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function resetForm() {
    setName(''); setSlug(''); setImageFile(null); setImagePreview(null); setFormError(null); setShowForm(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (!name.trim()) return setFormError('Name is required')
    if (!slug.trim()) return setFormError('Slug is required')
    setSubmitting(true)
    try {
      let imageUrl: string | null = null
      if (imageFile) imageUrl = await uploadImage(imageFile)
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, imageUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create category')
      await fetchCategories()
      resetForm()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  // --- Edit ---
  function startEdit(cat: Category) {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditSlug(cat.slug)
    setEditImageFile(null)
    setEditImagePreview(cat.image ?? null)
    setEditError(null)
  }

  function cancelEdit() {
    setEditingId(null); setEditImageFile(null); setEditImagePreview(null); setEditError(null)
  }

  function handleEditImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setEditImageFile(file)
    setEditImagePreview(URL.createObjectURL(file))
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEditError(null)
    if (!editName.trim()) return setEditError('Name is required')
    if (!editSlug.trim()) return setEditError('Slug is required')
    setEditSubmitting(true)
    try {
      let imageUrl: string | undefined = undefined
      if (editImageFile) imageUrl = await uploadImage(editImageFile)
      const res = await fetch(`/api/categories/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, slug: editSlug, imageUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update category')
      await fetchCategories()
      cancelEdit()
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setEditSubmitting(false)
    }
  }

  // --- Delete ---
  async function handleDelete() {
    if (!deletingId) return
    setDeleteSubmitting(true)
    try {
      const res = await fetch(`/api/categories/${deletingId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete category')
      }
      await fetchCategories()
    } catch (err) {
      console.error(err)
    } finally {
      setDeleteSubmitting(false)
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-muted rounded-lg w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-64 bg-muted rounded-lg" />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Organize your product categories</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Add Form */}
      {showForm && (
        <Card className="p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">New Category</h2>
            <button onClick={resetForm} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cat-name">Name</Label>
                <Input id="cat-name" placeholder="e.g. Skincare" value={name} onChange={(e) => handleNameChange(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-slug">Slug</Label>
                <Input id="cat-slug" placeholder="e.g. skincare" value={slug} onChange={(e) => setSlug(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Image (optional)</Label>
              {imagePreview ? (
                <div className="relative w-40 h-28 rounded-lg overflow-hidden bg-muted">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  <button type="button" onClick={() => { setImageFile(null); setImagePreview(null) }} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-3 w-fit px-4 py-2 border border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Upload image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
            {formError && <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{formError}</p>}
            <div className="flex gap-3">
              <Button type="submit" disabled={submitting} className="min-w-28">
                {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save Category'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative w-full h-40 bg-muted">
              {category.image ? (
                <Image src={category.image} alt={category.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No image</div>
              )}
            </div>

            <div className="p-4">
              {editingId === category.id ? (
                <form onSubmit={handleEditSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Name</Label>
                    <Input value={editName} onChange={(e) => { setEditName(e.target.value); setEditSlug(slugify(e.target.value)) }} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Slug</Label>
                    <Input value={editSlug} onChange={(e) => setEditSlug(e.target.value)} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Image</Label>
                    {editImagePreview ? (
                      <div className="relative w-full h-20 rounded overflow-hidden bg-muted">
                        <Image src={editImagePreview} alt="Preview" fill className="object-cover" />
                        <button type="button" onClick={() => { setEditImageFile(null); setEditImagePreview(null) }} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 px-3 py-1.5 border border-dashed border-border rounded cursor-pointer hover:bg-muted/50 text-xs text-muted-foreground">
                        <Upload className="w-3 h-3" />
                        Upload new image
                        <input type="file" accept="image/*" className="hidden" onChange={handleEditImageChange} />
                      </label>
                    )}
                  </div>
                  {editError && <p className="text-xs text-destructive bg-destructive/10 px-2 py-1 rounded">{editError}</p>}
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={editSubmitting} className="flex-1 text-xs">
                      {editSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save'}
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="flex-1 text-xs" onClick={cancelEdit}>Cancel</Button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Slug: <code className="bg-muted px-2 py-1 rounded text-xs">{category.slug}</code>
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => startEdit(category)}>
                      <Edit className="w-4 h-4 mr-2" />Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-destructive hover:bg-destructive/10" onClick={() => setDeletingId(category.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => { if (!open) setDeletingId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteSubmitting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
