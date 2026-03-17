-- ============================================================
-- PesaPal Integration Migration
-- Run this in the Supabase SQL Editor to add payment tracking columns.
-- ============================================================

-- Add payment_status column (pending | completed | failed)
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending';

-- Add PesaPal tracking ID (returned by PesaPal after order submission)
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS pesapal_tracking_id TEXT;

-- Index for IPN lookups by order_number
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders (order_number);

-- Update the get_orders function to include payment fields
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
      'id',             o.id,
      'orderNumber',    o.order_number,
      'userId',         o.user_id,
      'customerName',   COALESCE(o.ship_full_name, ''),
      'customerEmail',  COALESCE(o.ship_email, ''),
      'subtotal',       o.subtotal,
      'tax',            o.tax,
      'shipping',       o.shipping,
      'total',          o.total,
      'status',         o.status,
      'paymentStatus',  COALESCE(o.payment_status, 'pending'),
      'createdAt',      o.created_at,
      'items',          COALESCE(
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
