-- ============================================================================
-- KÓRÓGBÁ ISLAND — PHASE 15 CONSOLIDATED PRODUCTION VERIFICATION AUDIT
-- Read-only SQL script to verify database state, security, and RLS policies
-- ============================================================================

-- 1. Table Inventory & RLS Status
select 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
from pg_tables
where schemaname = 'public'
order by tablename;

-- 2. Complete RLS Policies Audit
select 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual as using_expression,
  with_check as check_expression
from pg_policies
where schemaname in ('public', 'storage')
order by schemaname, tablename, policyname;

-- 3. Storage Bucket Configuration
select 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at,
  updated_at
from storage.buckets
where id = 'korogba-media';

-- 4. Triggers on Profiles Table
select 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement,
  action_timing
from information_schema.triggers
where event_object_table = 'profiles';

-- 5. Helper Security Functions
select 
  proname,
  prosecdef as is_security_definer,
  proconfig as search_path_config
from pg_proc
where proname in ('is_admin', 'prevent_privilege_escalation');

-- 6. Check Administrator Account Status
select 
  p.id as profile_id,
  p.email,
  p.full_name,
  p.role,
  p.is_active,
  u.id as auth_user_id,
  u.email as auth_email
from public.profiles p
full outer join auth.users u on p.id = u.id
where p.email = 'sixtusgreat@gmail.com' or u.email = 'sixtusgreat@gmail.com';
