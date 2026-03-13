-- ============================================================
-- Admin Users Table
-- Run this in the Supabase SQL Editor to create the table.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
  id         serial PRIMARY KEY,
  email      character varying NOT NULL UNIQUE,
  full_name  character varying NOT NULL,
  password_hash text NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now()
);

-- Grant service_role full access (used by the admin backend)
GRANT ALL ON TABLE public.admin_users TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.admin_users_id_seq TO service_role;

-- Deny access to anon/authenticated roles (admin users are internal only)
REVOKE ALL ON TABLE public.admin_users FROM anon, authenticated;
