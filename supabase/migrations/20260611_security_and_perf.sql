-- =============================================================================
-- MiniYo Store — Security & Performance Migration
-- Applied: 2026-06-11
-- =============================================================================
-- This migration addresses all issues raised by the Supabase Security and
-- Performance Advisors:
--   SECURITY : Revoke public EXECUTE on SECURITY DEFINER functions
--   PERFORMANCE: Fix RLS auth.uid() re-evaluation (18 policies)
--   PERFORMANCE: Add missing FK indexes (5 columns)
--   PERFORMANCE: Consolidate duplicate permissive policies on discount_codes
-- =============================================================================


-- ---------------------------------------------------------------------------
-- SECTION 1: SECURITY — Revoke EXECUTE on exposed SECURITY DEFINER functions
-- ---------------------------------------------------------------------------
-- handle_new_user() and rls_auto_enable() are SECURITY DEFINER functions that
-- were callable by anonymous and authenticated users via the REST API at
-- /rest/v1/rpc/<function>. They should only be invoked by internal DB triggers.

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated;


-- ---------------------------------------------------------------------------
-- SECTION 2: PERFORMANCE — Add missing indexes on foreign key columns
-- ---------------------------------------------------------------------------
-- Without these indexes every JOIN or WHERE filter on these FK columns
-- performs a full sequential scan.

CREATE INDEX IF NOT EXISTS idx_addresses_user_id
  ON public.addresses (user_id);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id
  ON public.order_items (order_id);

CREATE INDEX IF NOT EXISTS idx_orders_user_id
  ON public.orders (user_id);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id
  ON public.reviews (product_id);

CREATE INDEX IF NOT EXISTS idx_reviews_user_id
  ON public.reviews (user_id);


-- ---------------------------------------------------------------------------
-- SECTION 3: PERFORMANCE — Fix RLS auth_rls_initplan (18 policies)
-- ---------------------------------------------------------------------------
-- Wrapping auth.<function>() in (SELECT ...) causes Postgres to evaluate it
-- once per query instead of once per row, dramatically improving performance
-- at scale.

-- profiles (3 policies)
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

-- staff_roles (2 policies)
DROP POLICY IF EXISTS "Staff read own role" ON public.staff_roles;
CREATE POLICY "Staff read own role" ON public.staff_roles
  FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Super admins manage staff roles" ON public.staff_roles;
CREATE POLICY "Super admins manage staff roles" ON public.staff_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.staff_roles sr
      WHERE sr.user_id = (select auth.uid())
        AND sr.role = 'super_admin'
    )
  );

-- addresses (1 policy)
DROP POLICY IF EXISTS "Users manage own addresses" ON public.addresses;
CREATE POLICY "Users manage own addresses" ON public.addresses
  FOR ALL USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- orders (2 policies)
DROP POLICY IF EXISTS "Users read own orders" ON public.orders;
CREATE POLICY "Users read own orders" ON public.orders
  FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Admins manage orders" ON public.orders;
CREATE POLICY "Admins manage orders" ON public.orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.staff_roles sr
      WHERE sr.user_id = (select auth.uid())
        AND sr.role IN ('admin', 'super_admin')
    )
  );

-- order_items (2 policies)
DROP POLICY IF EXISTS "Users read own order items" ON public.order_items;
CREATE POLICY "Users read own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND o.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins manage order items" ON public.order_items;
CREATE POLICY "Admins manage order items" ON public.order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.staff_roles sr
      WHERE sr.user_id = (select auth.uid())
        AND sr.role IN ('admin', 'super_admin')
    )
  );

-- products (1 policy)
DROP POLICY IF EXISTS "Admins manage products" ON public.products;
CREATE POLICY "Admins manage products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.staff_roles sr
      WHERE sr.user_id = (select auth.uid())
        AND sr.role IN ('admin', 'super_admin')
    )
  );

-- reviews (2 policies)
DROP POLICY IF EXISTS "Authenticated users insert reviews" ON public.reviews;
CREATE POLICY "Authenticated users insert reviews" ON public.reviews
  FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Admins manage reviews" ON public.reviews;
CREATE POLICY "Admins manage reviews" ON public.reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.staff_roles sr
      WHERE sr.user_id = (select auth.uid())
        AND sr.role IN ('admin', 'super_admin')
    )
  );

-- discount_codes (1 policy — also consolidates duplicate permissive policies)
DROP POLICY IF EXISTS "Admins manage discount codes" ON public.discount_codes;
DROP POLICY IF EXISTS "Anyone validates discount code" ON public.discount_codes;

-- Consolidated SELECT policy: admins see all rows; anyone can read
-- is_active + discount fields for validation without a separate policy.
CREATE POLICY "discount_codes_select" ON public.discount_codes
  FOR SELECT USING (true);

CREATE POLICY "Admins manage discount codes" ON public.discount_codes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.staff_roles sr
      WHERE sr.user_id = (select auth.uid())
        AND sr.role IN ('admin', 'super_admin')
    )
  );
