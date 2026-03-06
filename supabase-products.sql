-- ============================================================
-- SUPABASE FUNCTIONS: Products & Categories
-- Paste this entire file into the Supabase SQL Editor and run.
-- ============================================================

-- ------------------------------------------------------------
-- get_categories: returns all categories
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_categories()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_agg(
    json_build_object(
      'id',    c.id,
      'name',  c.name,
      'slug',  c.slug,
      'image', COALESCE(c.image, '')
    ) ORDER BY c.id
  )
  INTO result
  FROM categories c;

  RETURN COALESCE(result, '[]'::json);
END;
$$;

-- ------------------------------------------------------------
-- get_products: returns all products, optionally filtered by category
-- Maps DB snake_case to frontend camelCase
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_products(category_id_filter int DEFAULT NULL)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_agg(
    json_build_object(
      'id',            p.id,
      'name',          p.name,
      'description',   COALESCE(p.description, ''),
      'price',         p.price,
      'originalPrice', p.original_price,
      'categoryId',    p.category_id,
      'rating',        COALESCE(p.rating, 0),
      'reviewCount',   COALESCE(p.review_count, 0),
      'stockQuantity', p.stock_quantity,
      'inStock',       COALESCE(p.in_stock, p.stock_quantity > 0),
      'image',         COALESCE(
                         (SELECT pi.url FROM product_images pi
                          WHERE pi.product_id = p.id AND pi.is_thumbnail = true
                          ORDER BY pi.sort_order LIMIT 1),
                         (SELECT pi.url FROM product_images pi
                          WHERE pi.product_id = p.id
                          ORDER BY pi.sort_order LIMIT 1),
                         ''
                       ),
      'createdAt',     p.created_at
    ) ORDER BY p.id
  )
  INTO result
  FROM products p
  WHERE (category_id_filter IS NULL OR p.category_id = category_id_filter);

  RETURN COALESCE(result, '[]'::json);
END;
$$;

-- ------------------------------------------------------------
-- get_product_by_id: returns a single product with its category
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_product_by_id(p_id int)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'id',            p.id,
    'name',          p.name,
    'description',   COALESCE(p.description, ''),
    'price',         p.price,
    'originalPrice', p.original_price,
    'categoryId',    p.category_id,
    'rating',        COALESCE(p.rating, 0),
    'reviewCount',   COALESCE(p.review_count, 0),
    'stockQuantity', p.stock_quantity,
    'inStock',       COALESCE(p.in_stock, p.stock_quantity > 0),
    'image',         COALESCE(
                       (SELECT pi.url FROM product_images pi
                        WHERE pi.product_id = p.id AND pi.is_thumbnail = true
                        ORDER BY pi.sort_order LIMIT 1),
                       (SELECT pi.url FROM product_images pi
                        WHERE pi.product_id = p.id
                        ORDER BY pi.sort_order LIMIT 1),
                       ''
                     ),
    'createdAt',     p.created_at,
    'category',      (
                       SELECT json_build_object(
                         'id',    c.id,
                         'name',  c.name,
                         'slug',  c.slug,
                         'image', COALESCE(c.image, '')
                       )
                       FROM categories c
                       WHERE c.id = p.category_id
                     )
  )
  INTO result
  FROM products p
  WHERE p.id = p_id;

  RETURN result;
END;
$$;

-- Grant execute permissions to authenticated and anon roles
GRANT EXECUTE ON FUNCTION get_categories() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_products(int) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_product_by_id(int) TO authenticated, anon;
