-- ============================================================================
-- KÓRÓGBÁ ISLAND BAR, RESTAURANT & LOUNGE — PRODUCTION SUPABASE MIGRATION
-- (100% Idempotent: safe to run multiple times without duplicate errors)
-- ============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================================
-- 1. TABLES SETUP (IF NOT EXISTS)
-- ============================================================================

-- Profiles table (Linked to auth.users, strictly secured)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  full_name text,
  role text not null default 'staff',
  is_active boolean not null default true,
  created_at timestamptz default now() not null
);

-- Ensure columns exist even if table was created in an earlier migration
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists role text not null default 'staff';
alter table public.profiles add column if not exists is_active boolean default true;

-- Reservations table
create table if not exists public.reservations (
  id uuid default uuid_generate_v4() primary key,
  guest_name text not null check (length(guest_name) >= 2 and length(guest_name) <= 100),
  phone text not null check (length(phone) >= 7 and length(phone) <= 30),
  email text not null check (position('@' in email) > 1),
  date date not null check (date >= current_date),
  time text not null,
  guests int not null check (guests >= 1 and guests <= 50),
  seating_area text not null,
  special_requests text check (length(special_requests) <= 500),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'declined', 'cancelled')),
  created_at timestamptz default now() not null
);

-- Event enquiries table
create table if not exists public.event_enquiries (
  id uuid default uuid_generate_v4() primary key,
  name text not null check (length(name) >= 2 and length(name) <= 100),
  phone text not null check (length(phone) >= 7 and length(phone) <= 30),
  email text not null check (position('@' in email) > 1),
  event_type text not null,
  guest_count int not null check (guest_count >= 1 and guest_count <= 1000),
  preferred_date date not null,
  details text check (length(details) <= 1000),
  status text not null default 'pending' check (status in ('pending', 'contacted', 'confirmed', 'archived')),
  created_at timestamptz default now() not null
);

-- Menu categories table
create table if not exists public.menu_categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  slug text not null unique,
  display_order int default 0 not null
);

-- Menu items table
create table if not exists public.menu_items (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references public.menu_categories(id) on delete cascade not null,
  name text not null,
  subcategory text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  badge text,
  popular boolean default false not null,
  is_published boolean default true not null,
  created_at timestamptz default now() not null
);

-- Events table
create table if not exists public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  date date not null,
  time text not null,
  description text not null,
  image_url text not null,
  category text not null,
  is_published boolean default true not null,
  created_at timestamptz default now() not null
);

-- Gallery table
create table if not exists public.gallery (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  category text not null,
  image_url text not null,
  display_order int default 0 not null,
  is_published boolean default true not null,
  created_at timestamptz default now() not null
);

-- Business settings table
create table if not exists public.business_settings (
  id uuid default uuid_generate_v4() primary key,
  key text not null unique,
  value jsonb not null,
  is_public boolean default true not null,
  updated_at timestamptz default now() not null
);

-- Ensure fallback columns exist for pre-existing tables
alter table public.menu_items add column if not exists is_published boolean default true;
alter table public.menu_items add column if not exists is_available boolean default true;
alter table public.menu_items add column if not exists image_url text;

alter table public.events add column if not exists is_published boolean default true;
alter table public.events add column if not exists image_url text;

alter table public.gallery add column if not exists is_published boolean default true;
alter table public.gallery add column if not exists image_url text;

alter table public.business_settings add column if not exists is_public boolean default true;

-- ============================================================================
-- 2. SECURITY FUNCTIONS & INDEXES
-- ============================================================================

create or replace function public.is_admin()
returns boolean
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'manager', 'super_admin')
  );
end;
$$ language plpgsql;

create or replace function public.prevent_privilege_escalation()
returns trigger
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.role := old.role;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists tr_prevent_privilege_escalation on public.profiles;
create trigger tr_prevent_privilege_escalation
  before update on public.profiles
  for each row
  execute function public.prevent_privilege_escalation();

create index if not exists idx_menu_items_category on public.menu_items(category_id);
create index if not exists idx_menu_items_published on public.menu_items(is_published);
create index if not exists idx_events_published on public.events(is_published);
create index if not exists idx_gallery_published on public.gallery(is_published);
create index if not exists idx_reservations_status on public.reservations(status);

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.reservations enable row level security;
alter table public.event_enquiries enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.events enable row level security;
alter table public.gallery enable row level security;
alter table public.business_settings enable row level security;

-- Profiles Policies
drop policy if exists "Users can view own profile or admins view all" on public.profiles;
create policy "Users can view own profile or admins view all" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "Admins can insert profiles" on public.profiles;
create policy "Admins can insert profiles" on public.profiles
  for insert with check (public.is_admin() or not exists (select 1 from public.profiles));

drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles" on public.profiles
  for update using (public.is_admin());

-- Reservations Policies
drop policy if exists "Anyone can submit reservations" on public.reservations;
create policy "Anyone can submit reservations" on public.reservations
  for insert with check (true);

drop policy if exists "Admins can manage reservations" on public.reservations;
create policy "Admins can manage reservations" on public.reservations
  for all using (public.is_admin());

-- Event Enquiries Policies
drop policy if exists "Anyone can submit event enquiries" on public.event_enquiries;
create policy "Anyone can submit event enquiries" on public.event_enquiries
  for insert with check (true);

drop policy if exists "Admins can manage event enquiries" on public.event_enquiries;
create policy "Admins can manage event enquiries" on public.event_enquiries
  for all using (public.is_admin());

-- Menu Categories Policies
drop policy if exists "Public can read menu categories" on public.menu_categories;
create policy "Public can read menu categories" on public.menu_categories
  for select using (true);

drop policy if exists "Admins manage menu categories" on public.menu_categories;
create policy "Admins manage menu categories" on public.menu_categories
  for all using (public.is_admin());

-- Menu Items Policies
drop policy if exists "Public can view available menu items" on public.menu_items;
drop policy if exists "Public can read published menu items" on public.menu_items;
create policy "Public can read published menu items" on public.menu_items
  for select using (true);

drop policy if exists "Admins manage menu items" on public.menu_items;
create policy "Admins manage menu items" on public.menu_items
  for all using (public.is_admin());

-- Events Policies
drop policy if exists "Public can view published events" on public.events;
drop policy if exists "Public can read published events" on public.events;
create policy "Public can read published events" on public.events
  for select using (true);

drop policy if exists "Admins manage events" on public.events;
create policy "Admins manage events" on public.events
  for all using (public.is_admin());

-- Gallery Policies
drop policy if exists "Public can view gallery" on public.gallery;
drop policy if exists "Public can read published gallery" on public.gallery;
create policy "Public can read published gallery" on public.gallery
  for select using (true);

drop policy if exists "Admins manage gallery" on public.gallery;
create policy "Admins manage gallery" on public.gallery
  for all using (public.is_admin());

-- Business Settings Policies
drop policy if exists "Public can view business settings" on public.business_settings;
drop policy if exists "Public can read public business settings" on public.business_settings;
create policy "Public can read public business settings" on public.business_settings
  for select using (true);

drop policy if exists "Admins manage business settings" on public.business_settings;
create policy "Admins manage business settings" on public.business_settings
  for all using (public.is_admin());

-- ============================================================================
-- 4. STORAGE BUCKET & POLICIES ('korogba-media')
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('korogba-media', 'korogba-media', true)
on conflict (id) do nothing;

drop policy if exists "Public Access to Korogba Media" on storage.objects;
create policy "Public Access to Korogba Media" on storage.objects
  for select using (bucket_id = 'korogba-media');

drop policy if exists "Admins Upload Korogba Media" on storage.objects;
create policy "Admins Upload Korogba Media" on storage.objects
  for insert with check (bucket_id = 'korogba-media' and public.is_admin());

drop policy if exists "Admins Update Korogba Media" on storage.objects;
create policy "Admins Update Korogba Media" on storage.objects
  for update using (bucket_id = 'korogba-media' and public.is_admin());

drop policy if exists "Admins Delete Korogba Media" on storage.objects;
create policy "Admins Delete Korogba Media" on storage.objects
  for delete using (bucket_id = 'korogba-media' and public.is_admin());

-- ============================================================================
-- 5. INITIAL MENU CATEGORIES SEEDING (OPTIONAL CONVENIENCE)
-- ============================================================================
insert into public.menu_categories (name, slug, display_order)
values
  ('Food & Grills', 'food', 1),
  ('Drinks & Cocktails', 'drinks', 2),
  ('Shisha Lounge', 'shisha', 3)
on conflict (name) do nothing;

-- ============================================================================
-- 6. BOOTSTRAP INITIAL SUPER ADMIN
-- ============================================================================
insert into public.profiles (id, email, full_name, role, is_active)
values (
  '46c2cc4b-ffa4-47a1-8a82-3f235a430d0e',
  'sixtusgreat@gmail.com',
  'KÓRÓGBÁ Executive Management',
  'admin',
  true
)
on conflict (id) do update set
  role = 'admin',
  is_active = true;
