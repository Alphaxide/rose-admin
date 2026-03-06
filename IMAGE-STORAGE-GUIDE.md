# Image Storage Guide

Images are uploaded to **Supabase Storage** and the public URLs are stored in the `product_images` table.

---

## Setup: Create the Storage Bucket

1. Go to your Supabase dashboard → **Storage**
2. Click **New bucket**
3. Set the name to exactly: `product-images`
4. Enable **Public bucket** (toggle ON)
5. Click **Save**

---

## Setup: Set Bucket Permissions (RLS Policy)

After creating the bucket, go to **Storage → Policies** and add these two policies for `product-images`:

### Allow public read (anyone can view images)
```sql
CREATE POLICY "Public read product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');
```

### Allow authenticated upload (only logged-in admins can upload)
```sql
CREATE POLICY "Authenticated upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');
```

### Allow authenticated delete
```sql
CREATE POLICY "Authenticated delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
```

Paste each policy into **Storage → Policies → New policy → For full customization**.

---

## How It Works in This Project

```
User picks image → Upload to Supabase Storage (product-images bucket)
                 → Get public URL
                 → POST /api/products with imageUrl
                 → Insert into products table
                 → Insert URL into product_images table (is_thumbnail = true)
```

The public URL format is:
```
https://<your-project-ref>.supabase.co/storage/v1/object/public/product-images/<filename>
```

---

## Getting Your Supabase API Keys

1. Go to [supabase.com](https://supabase.com) and open your project
2. Click **Project Settings** (gear icon) → **API**
3. Copy the following into your `.env.local`:

| Key | Where to find it |
|-----|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | "Project URL" — format: `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | "Project API keys" → `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | "Project API keys" → `service_role` `secret` key |

> **Important:** Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser. It is only used in server-side API routes (which is already the case in this project via `supabaseAdmin`).

---

## Alternative: Use an External Image CDN

If you prefer not to use Supabase Storage, here are other options:

| Service | Free Tier | Notes |
|---------|-----------|-------|
| **Cloudinary** | 25 GB storage, 25 GB bandwidth/month | Best for image transformations (resize, crop, format) |
| **Uploadthing** | 2 GB storage | Built for Next.js, easy SDK |
| **AWS S3 + CloudFront** | Pay per use | Most scalable, needs more setup |
| **Vercel Blob** | 500 MB | Tight Next.js integration |

### Cloudinary Quick Setup
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → copy **Cloud name**, **API Key**, **API Secret**
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Replace the `uploadImage` function in `app/admin/products/new/page.tsx` with a Cloudinary upload preset call.
