-- =============================================================================
-- MiniYo Store — Safe Security & Performance Migration
-- Applied: 2026-06-11
-- =============================================================================
-- SAFE VERSION after runtime failure on unknown column names.
-- This migration keeps only the fixes that are guaranteed to be schema-safe:
--   1) Revoke public EXECUTE on exposed SECURITY DEFINER functions
--   2) Add missing indexes on the exact FK columns surfaced by advisors
--
-- NOTE:
-- The earlier RLS policy rewrites were removed because the project schema in
-- the repo does not include the original table definitions, and the live DB
-- appears to use different column names than the guessed `user_id` fields.
-- Those RLS optimizations should be regenerated from the live schema before
-- applying.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- SECTION 1: SECURITY — Revoke EXECUTE on exposed SECURITY DEFINER functions
-- ---------------------------------------------------------------------------
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated;

-- ---------------------------------------------------------------------------
-- SECTION 2: PERFORMANCE — Add missing indexes on foreign key columns
-- ---------------------------------------------------------------------------
-- These column names come directly from the Supabase advisors' FK metadata.
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses (user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews (product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews (user_id);
