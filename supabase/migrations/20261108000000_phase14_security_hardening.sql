-- ============================================================================
-- KÓRÓGBÁ ISLAND BAR, RESTAURANT & LOUNGE — PHASE 14 SECURITY HARDENING
-- Forward-Only Migration (100% Idempotent)
-- ============================================================================

-- 1. Ensure staff_notes column exists on reservations
alter table public.reservations 
  add column if not exists staff_notes text;

-- 2. Ensure updated_at timestamp columns exist
alter table public.reservations 
  add column if not exists updated_at timestamptz default now();

alter table public.event_enquiries 
  add column if not exists updated_at timestamptz default now();

alter table public.menu_items 
  add column if not exists updated_at timestamptz default now();

alter table public.events 
  add column if not exists updated_at timestamptz default now();

-- 3. Strengthen RLS: Public Insert Restrictions
-- Public visitors must ONLY be able to submit reservations with status 'pending'
drop policy if exists "Anyone can submit reservations" on public.reservations;
drop policy if exists "Public visitors submit pending reservations" on public.reservations;
create policy "Public visitors submit pending reservations" on public.reservations
  for insert with check (status = 'pending');

-- Public visitors must ONLY be able to submit event enquiries with status 'new' or 'pending'
drop policy if exists "Anyone can submit event enquiries" on public.event_enquiries;
drop policy if exists "Public visitors submit new enquiries" on public.event_enquiries;
create policy "Public visitors submit new enquiries" on public.event_enquiries
  for insert with check (status in ('new', 'pending'));

-- 4. Strengthen Profile Self-Creation Rules
-- Ensure user id matches auth.uid() on insert and default role is non-admin
drop policy if exists "Admins can insert profiles" on public.profiles;
drop policy if exists "Secure profile creation" on public.profiles;
create policy "Secure profile creation" on public.profiles
  for insert with check (
    public.is_admin() or (auth.uid() = id and role in ('staff', 'user'))
  );

-- 5. Business Settings Default Seeding
insert into public.business_settings (key, value, is_public)
values (
  'contact_info',
  jsonb_build_object(
    'name', 'KÓRÓGBÁ Island Bar, Restaurant & Lounge',
    'tagline', '... an african experience, reimagined',
    'slogan', 'LAGOS, GET READY FOR A ROYAL EXPERIENCE!',
    'address', 'Royal Estate 2, Isheri-Igando Road, Lagos, Nigeria',
    'phone', '+234 903 281 0235',
    'instagram', 'https://instagram.com/korogbalagos',
    'tiktok', 'https://tiktok.com/@korogbalagos',
    'is_accepting_reservations', true
  ),
  true
)
on conflict (key) do nothing;
