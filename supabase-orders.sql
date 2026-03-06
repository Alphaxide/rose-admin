-- ============================================================
-- SUPABASE FUNCTIONS: Orders & Dashboard Stats
-- Paste this entire file into the Supabase SQL Editor and run.
-- ============================================================

-- ------------------------------------------------------------
-- get_orders: returns all orders with items, optionally filtered by status
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_orders(status_filter text DEFAULT NULL)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_agg(
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
  INTO result
  FROM orders o
  WHERE (status_filter IS NULL OR o.status = status_filter);

  RETURN COALESCE(result, '[]'::json);
END;
$$;

-- ------------------------------------------------------------
-- get_order_by_id: returns a single order with items and customer info
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_order_by_id(o_id int)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
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
    'paymentMethod', o.payment_method,
    'trackingNumber',o.tracking_number,
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
                     ),
    'customer',      (
                       SELECT json_build_object(
                         'id',       u.id,
                         'email',    u.email,
                         'fullName', COALESCE(u.full_name, ''),
                         'phone',    COALESCE(u.phone, '')
                       )
                       FROM users u
                       WHERE u.id = o.user_id
                     )
  )
  INTO result
  FROM orders o
  WHERE o.id = o_id;

  RETURN result;
END;
$$;

-- ------------------------------------------------------------
-- get_dashboard_stats: returns aggregated stats for the admin dashboard
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'totalRevenue',      COALESCE((SELECT SUM(total) FROM orders WHERE status != 'cancelled'), 0),
    'totalOrders',       (SELECT COUNT(*) FROM orders),
    'totalCustomers',    (SELECT COUNT(*) FROM users),
    'totalProducts',     (SELECT COUNT(*) FROM products),
    'pendingOrders',     (SELECT COUNT(*) FROM orders WHERE status = 'pending'),
    'lowStockProducts',  (SELECT COUNT(*) FROM products WHERE stock_quantity < 50)
  )
  INTO result;

  RETURN result;
END;
$$;

-- Grant execute permissions to authenticated and anon roles
GRANT EXECUTE ON FUNCTION get_orders(text) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_order_by_id(int) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_dashboard_stats() TO authenticated, anon;
