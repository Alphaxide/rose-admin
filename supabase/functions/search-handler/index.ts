import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Accept both GET (?q=...) and POST ({ query: '...' })
    let query = ''
    let limit = 40

    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}))
      query = (body.query ?? body.q ?? '').trim()
      limit = body.limit ?? 40
    } else {
      const url = new URL(req.url)
      query = (url.searchParams.get('q') ?? url.searchParams.get('query') ?? '').trim()
      limit = Number(url.searchParams.get('limit') ?? 40)
    }

    if (!query) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    const term = `%${query}%`

    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        price,
        original_price,
        stock_quantity,
        category_id,
        rating,
        review_count,
        product_images (url, is_thumbnail)
      `)
      .or(`name.ilike.${term},description.ilike.${term}`)
      .limit(limit)

    if (error) throw error

    // Shape into flat product objects
    const results = (data ?? []).map((p: Record<string, unknown>) => {
      const images = (p.product_images as { url: string; is_thumbnail: boolean }[]) ?? []
      const thumbnail = images.find((i) => i.is_thumbnail)?.url ?? images[0]?.url ?? null
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        original_price: p.original_price ?? null,
        stock_quantity: p.stock_quantity ?? 0,
        in_stock: (p.stock_quantity as number) > 0,
        category_id: p.category_id,
        rating: p.rating ?? 0,
        review_count: p.review_count ?? 0,
        image_urls: images.map((i) => i.url),
        thumbnail_url: thumbnail,
      }
    })

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
