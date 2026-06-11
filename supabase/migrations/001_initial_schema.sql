-- ============================================================
-- MiniYo Store — Supabase Schema
-- Migration 001: Initial schema
-- Run in: Supabase Dashboard > SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Profiles ────────────────────────────────────────────────────────────────
-- Extends auth.users. Auto-created on signup via trigger below.
create table if not exists public.profiles (
  id                          uuid references auth.users(id) on delete cascade primary key,
  name                        text not null default '',
  phone                       text,
  date_of_birth               date,
  membership_tier             text not null default 'bronze'
                                check (membership_tier in ('bronze','silver','gold')),
  total_orders                integer not null default 0,
  total_spent                 numeric(10,2) not null default 0,
  free_shipping_used          integer not null default 0,
  free_shipping_month         text not null default to_char(now(),'YYYY-MM'),
  first_order_discount_used   boolean not null default false,
  birthday_offer_used         text,
  referral_code               text unique,
  referral_count              integer not null default 0,
  referred_by                 text,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile row on new signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  raw_name text;
  code_prefix text;
begin
  raw_name := coalesce(new.raw_user_meta_data->>'name', '');
  code_prefix := upper(
    substring(regexp_replace(raw_name, '[^A-Za-z]', '', 'g') from 1 for 4)
  );
  if length(code_prefix) < 2 then code_prefix := 'MINI'; end if;

  insert into public.profiles (id, name, referred_by, referral_code)
  values (
    new.id,
    raw_name,
    new.raw_user_meta_data->>'referred_by',
    code_prefix || floor(1000 + random() * 9000)::text
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Staff Roles ──────────────────────────────────────────────────────────────
create table if not exists public.staff_roles (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references auth.users(id) on delete cascade unique not null,
  role       text not null default 'staff'
               check (role in ('super_admin','admin','staff')),
  created_at timestamptz not null default now()
);

alter table public.staff_roles enable row level security;

create policy "Staff read own role"
  on public.staff_roles for select
  using (auth.uid() = user_id);

create policy "Super admins manage staff roles"
  on public.staff_roles
  using (
    exists (
      select 1 from public.staff_roles sr
      where sr.user_id = auth.uid() and sr.role = 'super_admin'
    )
  );

-- ─── Addresses ────────────────────────────────────────────────────────────────
create table if not exists public.addresses (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  label       text,
  full_name   text,
  phone       text,
  city        text,
  district    text,
  street      text,
  building    text,
  floor       text,
  apartment   text,
  landmark    text,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.addresses enable row level security;

create policy "Users manage own addresses"
  on public.addresses
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── Orders ───────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id               uuid primary key default uuid_generate_v4(),
  order_number     text unique not null,
  user_id          uuid references auth.users(id) on delete set null,
  status           text not null default 'pending_confirmation',
  subtotal         numeric(10,2) not null,
  discount         numeric(10,2) not null default 0,
  shipping         numeric(10,2) not null default 0,
  total            numeric(10,2) not null,
  payment_method   text,
  shipping_address jsonb,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Users read own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Admins manage orders"
  on public.orders
  using (
    exists (select 1 from public.staff_roles where user_id = auth.uid())
  );

create table if not exists public.order_items (
  id           uuid primary key default uuid_generate_v4(),
  order_id     uuid references public.orders(id) on delete cascade not null,
  product_id   text not null,
  name         text not null,
  qty          integer not null,
  price        numeric(10,2) not null,
  image_url    text
);

alter table public.order_items enable row level security;

create policy "Users read own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy "Admins manage order items"
  on public.order_items
  using (
    exists (select 1 from public.staff_roles where user_id = auth.uid())
  );

-- ─── Products ─────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id               text primary key,
  name_en          text not null,
  name_ar          text,
  description_en   text,
  description_ar   text,
  price            numeric(10,2) not null,
  original_price   numeric(10,2),
  stock_quantity   integer not null default 0,
  sku              text unique,
  category         text,
  subcategory      text,
  brand            text,
  age_group        text,
  gender           text not null default 'unisex',
  images           jsonb not null default '[]',
  tags             text[],
  is_active        boolean not null default true,
  is_featured      boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Anyone reads active products"
  on public.products for select
  using (is_active = true);

create policy "Admins manage products"
  on public.products
  using (
    exists (select 1 from public.staff_roles where user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.staff_roles where user_id = auth.uid())
  );

-- ─── Reviews ──────────────────────────────────────────────────────────────────
create table if not exists public.reviews (
  id             uuid primary key default uuid_generate_v4(),
  product_id     text references public.products(id) on delete cascade not null,
  user_id        uuid references auth.users(id) on delete set null,
  customer_name  text not null,
  rating         integer not null check (rating between 1 and 5),
  title          text,
  body           text,
  verified       boolean not null default false,
  helpful_count  integer not null default 0,
  created_at     timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "Anyone reads reviews"
  on public.reviews for select using (true);

create policy "Authenticated users insert reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Admins manage reviews"
  on public.reviews
  using (
    exists (select 1 from public.staff_roles where user_id = auth.uid())
  );

-- ─── Discount Codes ──────────────────────────────────────────────────────────
create table if not exists public.discount_codes (
  id          uuid primary key default uuid_generate_v4(),
  code        text unique not null,
  type        text not null check (type in ('percentage','fixed')),
  value       numeric(10,2) not null,
  min_order   numeric(10,2) not null default 0,
  max_uses    integer,
  uses_count  integer not null default 0,
  valid_from  date,
  valid_until date,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.discount_codes enable row level security;

create policy "Anyone validates discount code"
  on public.discount_codes for select
  using (is_active = true);

create policy "Admins manage discount codes"
  on public.discount_codes
  using (
    exists (select 1 from public.staff_roles where user_id = auth.uid())
  );

-- ─── Seed: discount code ──────────────────────────────────────────────────────
insert into public.discount_codes (code, type, value, min_order, valid_from, valid_until, is_active)
values ('WELCOME15', 'percentage', 15, 0, '2025-01-01', '2026-12-31', true)
on conflict (code) do nothing;
