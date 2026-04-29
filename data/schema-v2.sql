-- HoaBinhOi schema v2: admin_users + audit_log
-- Chạy trong Supabase SQL Editor sau khi đã chạy schema.sql
-- Idempotent — chạy nhiều lần OK

-- === admin_users: self-service onboarding ===
create table if not exists admin_users (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  role        text not null default 'editor' check (role in ('admin', 'editor')),
  invited_by  text,
  note        text,
  created_at  timestamptz default now(),
  last_login  timestamptz
);

create index if not exists admin_users_email_idx on admin_users (lower(email));

alter table admin_users enable row level security;
-- Service role bypass tự động. Không tạo public policy — chỉ admin API thấy.

-- === audit_log: ai làm gì khi nào ===
create table if not exists audit_log (
  id           bigserial primary key,
  actor_email  text not null,
  actor_role   text,
  action       text not null,     -- insert, update, delete, approve, reject, invite, role_change, revoke
  resource     text not null,     -- pois, reviews, admin_users
  resource_id  text,
  before_data  jsonb,
  after_data   jsonb,
  created_at   timestamptz default now()
);

create index if not exists audit_log_actor_idx on audit_log (actor_email, created_at desc);
create index if not exists audit_log_resource_idx on audit_log (resource, created_at desc);
create index if not exists audit_log_action_idx on audit_log (action, created_at desc);

alter table audit_log enable row level security;
-- Không tạo public policy.

-- === Bootstrap owner ===
-- THAY 'duclongvuaca@gmail.com' bằng email anh nếu khác.
insert into admin_users (email, role, note)
values ('duclongvuaca@gmail.com', 'admin', 'bootstrap owner')
on conflict (email) do update set role = 'admin';

-- === Storage: bucket cho POI images ===
-- Bucket phải tạo qua Supabase Dashboard (UI), KHÔNG qua SQL:
--   Storage → New bucket → Name: "poi-images" → Public ✅ → Save
-- RLS storage policy:
--   Storage → poi-images → Policies → New Policy
--   - Name: "admin upload"
--   - Allowed operation: INSERT, UPDATE, DELETE
--   - Target roles: authenticated
--   - USING expression: true
--   - WITH CHECK expression: true
--   (Auth check thực hiện ở /api/admin/upload-url server-side, bucket public read)
