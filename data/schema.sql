-- Hoà Bình Ơi — Supabase schema
-- Chạy trong Supabase SQL Editor sau khi tạo project mới.
-- TÁCH BIỆT hoàn toàn với SOTA House DuckDB.

-- Subscribers (email signup landing)
create table if not exists subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  source      text,
  created_at  timestamptz default now()
);

-- POI (points of interest)
create table if not exists pois (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  category      text not null check (category in ('an','mua','nghi','choi','diem-den','su-kien')),
  lat           double precision,
  lng           double precision,
  place_id      text,
  google_cid    text,
  address       text,
  phone         text,
  description   text,
  insider_tip   text,
  price_range   text,
  open_hours    jsonb,
  images        jsonb default '[]'::jsonb,
  tags          text[] default '{}',
  source_url    text,
  status        text default 'draft' check (status in ('draft','published','archived')),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index if not exists pois_category_idx on pois (category) where status='published';
create index if not exists pois_geo_idx on pois (lat, lng) where status='published';

-- Itineraries (hành trình curated)
create table if not exists itineraries (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  persona       text,
  duration      text,
  budget_low    int,
  budget_high   int,
  highlights    text[] default '{}',
  description   text,
  hero_image    text,
  status        text default 'draft' check (status in ('draft','published','archived')),
  created_at    timestamptz default now()
);

-- Stops in itineraries
create table if not exists itinerary_stops (
  id              uuid primary key default gen_random_uuid(),
  itinerary_id    uuid references itineraries(id) on delete cascade,
  poi_id          uuid references pois(id),
  stop_order      int not null,
  start_time      text,
  end_time        text,
  note            text,
  created_at      timestamptz default now()
);

create index if not exists stops_itinerary_idx on itinerary_stops (itinerary_id, stop_order);

-- Reviews (user-generated, moderated)
create table if not exists reviews (
  id            uuid primary key default gen_random_uuid(),
  poi_id        uuid references pois(id) on delete cascade,
  author_name   text,
  rating        int check (rating between 1 and 5),
  body          text,
  status        text default 'pending' check (status in ('pending','approved','rejected')),
  created_at    timestamptz default now()
);

-- Analytics events (lightweight, no PII)
create table if not exists events (
  id            bigserial primary key,
  event_type    text not null,
  poi_id        uuid,
  itinerary_id  uuid,
  meta          jsonb,
  created_at    timestamptz default now()
);

create index if not exists events_type_idx on events (event_type, created_at desc);

-- Row Level Security
alter table subscribers enable row level security;
alter table pois enable row level security;
alter table itineraries enable row level security;
alter table itinerary_stops enable row level security;
alter table reviews enable row level security;
alter table events enable row level security;

-- Public read for published content
create policy "public read pois" on pois
  for select using (status = 'published');
create policy "public read itineraries" on itineraries
  for select using (status = 'published');
create policy "public read itinerary_stops" on itinerary_stops
  for select using (true);
create policy "public read approved reviews" on reviews
  for select using (status = 'approved');

-- Service role bypasses RLS automatically
