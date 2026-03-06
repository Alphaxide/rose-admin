-- ============================================================
-- SUPABASE FUNCTIONS: Customers
-- Paste this entire file into the Supabase SQL Editor and run.
-- Note: "customers" in the admin panel map to the `users` table
-- since orders reference users.id. The `customers` table is
-- kept separate (e.g. for wholesale/B2B accounts).
-- ============================================================

-- ------------------------------------------------------------
-- get_customers: returns all users with computed order stats
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_customers()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_agg(
    json_build_object(
      'id',          u.id,
      'email',       u.email,
      'fullName',    COALESCE(u.full_name, ''),
      'phone',       COALESCE(u.phone, ''),
      'createdAt',   u.created_at,
      'totalOrders', COALESCE(stats.order_count, 0),
      'totalSpent',  COALESCE(stats.total_spent, 0)
    ) ORDER BY u.created_at DESC
  )
  INTO result
  FROM users u
  LEFT JOIN (
    SELECT
      user_id,
      COUNT(*)        AS order_count,
      SUM(total)      AS total_spent
    FROM orders
    WHERE status != 'cancelled'
    GROUP BY user_id
  ) stats ON stats.user_id = u.id;

  RETURN COALESCE(result, '[]'::json);
END;
$$;

-- ------------------------------------------------------------
-- get_customer_by_id: returns a single user with their orders
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_customer_by_id(c_id int)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'id',          u.id,
    'email',       u.email,
    'fullName',    COALESCE(u.full_name, ''),
    'phone',       COALESCE(u.phone, ''),
    'createdAt',   u.created_at,
    'totalOrders', COALESCE(stats.order_count, 0),
    'totalSpent',  COALESCE(stats.total_spent, 0),
    'orders',      COALESCE(
                     (SELECT json_agg(
                       json_build_object(
                         'id',            o.id,
                         'orderNumber',   o.order_number,
                         'userId',        o.user_id,
                         'customerName',  COALESCE(o.ship_full_name, ''),
                         'customerEmail', COALESCE(o.ship_email, ''),
                         'subtotal',      o.subtotal,
                         'tax',           o.tax,
                         'shipping',      o.shipping,
                         'total',         o.total,
                         'status',        o.status,
                         'createdAt',     o.created_at,
                         'items',         COALESCE(
                                            (SELECT json_agg(
                                              json_build_object(
                                                'id',        oi.id,
                                                'orderId',   oi.order_id,
                                                'productId', oi.product_id,
                                                'name',      oi.name,
                                                'price',     oi.price,
                                                'quantity',  oi.quantity
                                              ) ORDER BY oi.id
                                            )
                                            FROM order_items oi
                                            WHERE oi.order_id = o.id),
                                            '[]'::json
                                          )
                       ) ORDER BY o.created_at DESC
                     )
                     FROM orders o
                     WHERE o.user_id = u.id),
                     '[]'::json
                   )
  )
  INTO result
  FROM users u
  LEFT JOIN (
    SELECT
      user_id,
      COUNT(*)   AS order_count,
      SUM(total) AS total_spent
    FROM orders
    WHERE status != 'cancelled'
    GROUP BY user_id
  ) stats ON stats.user_id = u.id
  WHERE u.id = c_id;

  RETURN result;
END;
$$;

-- Grant execute permissions to authenticated and anon roles
GRANT EXECUTE ON FUNCTION get_customers() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_customer_by_id(int) TO authenticated, anon;
