-- ============================================================================
-- KÓRÓGBÁ ISLAND BAR, RESTAURANT & LOUNGE — PHASE 15
-- PRODUCTION SECURITY AUDIT, HARDENING & STORAGE CONFIGURATION
-- Forward-Only Migration (100% Idempotent, Additive & Safe)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SECURE FUNCTION DEFINITIONS WITH FIXED SEARCH_PATH
-- ----------------------------------------------------------------------------

-- Check admin status strictly using active status and non-null auth uid
create or replace function public.is_admin()
returns boolean
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return false;
  end if;
  return exists (
    select 1 from public.profiles
    where id = auth.uid() 
      and role in ('admin', 'super_admin', 'manager') 
      and is_active = true
  );
end;
$$ language plpgsql;

-- Privilege escalation prevention trigger covering both INSERT and UPDATE
create or replace function public.prevent_privilege_escalation()
returns trigger
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    if TG_OP = 'INSERT' then
      -- Unauthenticated or public users can NEVER assign themselves elevated roles
      if new.role is null or new.role <> 'user' then
        new.role := 'user';
      end if;
    elsif TG_OP = 'UPDATE' then
      -- Non-administrators cannot alter their role or active status
      new.role := old.role;
      new.is_active := old.is_active;
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

-- Attach trigger for both INSERT and UPDATE
drop trigger if exists tr_prevent_privilege_escalation on public.profiles;
create trigger tr_prevent_privilege_escalation
  before insert or update on public.profiles
  for each row
  execute function public.prevent_privilege_escalation();

-- ----------------------------------------------------------------------------
-- 2. STRENGTHEN PROFILE ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

drop policy if exists "Admins can insert profiles" on public.profiles;
drop policy if exists "Secure profile creation" on public.profiles;
drop policy if exists "Public users can only insert user profile" on public.profiles;

create policy "Public users can only insert user profile" on public.profiles
  for insert with check (
    public.is_admin() or (auth.uid() = id and role = 'user')
  );

drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles" on public.profiles
  for update using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 3. BUSINESS SETTINGS: ENFORCE is_public = true FOR PUBLIC READS (FINDING A)
-- ----------------------------------------------------------------------------

drop policy if exists "Public can view business settings" on public.business_settings;
drop policy if exists "Public can read public business settings" on public.business_settings;

create policy "Public can read public business settings" on public.business_settings
  for select using (is_public = true);

drop policy if exists "Admins manage business settings" on public.business_settings;
create policy "Admins manage business settings" on public.business_settings
  for all using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 4. EVENT ENQUIRIES STATUS CONSTRAINTS & RLS (FINDING D)
-- ----------------------------------------------------------------------------

-- Ensure all valid event enquiry lifecycle statuses are supported in check constraint
alter table public.event_enquiries drop constraint if exists event_enquiries_status_check;
alter table public.event_enquiries add constraint event_enquiries_status_check
  check (status in ('new', 'pending', 'contacted', 'confirmed', 'booked', 'archived'));

drop policy if exists "Anyone can submit event enquiries" on public.event_enquiries;
drop policy if exists "Public visitors submit new enquiries" on public.event_enquiries;

create policy "Public visitors submit new enquiries" on public.event_enquiries
  for insert with check (status in ('new', 'pending'));

drop policy if exists "Admins can manage event enquiries" on public.event_enquiries;
create policy "Admins can manage event enquiries" on public.event_enquiries
  for all using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 5. RESERVATIONS: RESTRICT INSERT TO 'pending' & HIDE PRIVATE DATA (FINDING E)
-- ----------------------------------------------------------------------------

alter table public.reservations drop constraint if exists reservations_status_check;
alter table public.reservations add constraint reservations_status_check
  check (status in ('pending', 'confirmed', 'completed', 'declined', 'cancelled'));

drop policy if exists "Anyone can submit reservations" on public.reservations;
drop policy if exists "Public visitors submit pending reservations" on public.reservations;

create policy "Public visitors submit pending reservations" on public.reservations
  for insert with check (status = 'pending');

drop policy if exists "Admins can manage reservations" on public.reservations;
create policy "Admins can manage reservations" on public.reservations
  for all using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 6. STORAGE CONFIGURATION: LIMITS & MIME RESTRICTIONS (PART 3)
-- ----------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'korogba-media', 
  'korogba-media', 
  true, 
  5242880, -- 5 MB limit
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Storage RLS
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

-- ----------------------------------------------------------------------------
-- 7. ADMINISTRATOR PROFILE LINKING FOR sixtusgreat@gmail.com (FINDING F)
-- ----------------------------------------------------------------------------

do $$
declare
  v_admin_id uuid;
begin
  -- Resolve auth.users id dynamically if user has signed up or exists in auth
  select id into v_admin_id from auth.users where email = 'sixtusgreat@gmail.com' limit 1;
  if v_admin_id is not null then
    insert into public.profiles (id, email, full_name, role, is_active)
    values (v_admin_id, 'sixtusgreat@gmail.com', 'KÓRÓGBÁ Executive Management', 'admin', true)
    on conflict (id) do update set
      role = 'admin',
      is_active = true;
  end if;
end;
$$;
