-- HoaBinhOi v3: thêm field cho Google Maps reviews + rating
-- Idempotent — chạy nhiều lần OK

alter table pois add column if not exists gmaps_reviews jsonb;
alter table pois add column if not exists gmaps_rating real;
alter table pois add column if not exists gmaps_review_count int;
alter table pois add column if not exists gmaps_synced_at timestamptz;

create index if not exists pois_gmaps_rating_idx on pois (gmaps_rating desc nulls last);
