/**
 * Lấy reviews + rating thật từ Google Maps cho POI có place_id.
 * Chạy: npm run fetch-gmaps-reviews
 *       npm run fetch-gmaps-reviews -- --slug=xxx
 *       npm run fetch-gmaps-reviews -- --force  (refetch dù đã sync)
 *
 * Setup trước (1 lần):
 *   1. Run data/schema-v3-gmaps.sql trong Supabase SQL Editor
 *   2. .env.local có GOOGLE_MAPS_KEY
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const KEY = process.env.GOOGLE_MAPS_KEY;
if (!KEY) { console.error("Missing GOOGLE_MAPS_KEY"); process.exit(1); }

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const args = process.argv.slice(2);
const ONE = args.find((a) => a.startsWith("--slug="))?.split("=")[1];
const FORCE = args.includes("--force");

async function fetchPlace(placeId: string) {
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
  const res = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": KEY!,
      "X-Goog-FieldMask": "rating,userRatingCount,reviews,displayName"
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 150)}`);
  return res.json();
}

async function searchPlace(name: string, lat: number, lng: number) {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "X-Goog-Api-Key": KEY!,
      "X-Goog-FieldMask": "places.id,places.rating,places.userRatingCount,places.reviews,places.displayName",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      textQuery: `${name} Hoà Bình`,
      locationBias: { circle: { center: { latitude: lat, longitude: lng }, radius: 5000 } },
      maxResultCount: 1
    })
  });
  if (!res.ok) return null;
  const json: any = await res.json();
  return json.places?.[0] || null;
}

function normalizeReviews(reviews: any[]): any[] {
  return (reviews || []).slice(0, 5).map((r: any) => ({
    rating: r.rating,
    text: r.text?.text || "",
    author: r.authorAttribution?.displayName || "Khách",
    avatar: r.authorAttribution?.photoUri || null,
    relative: r.relativePublishTimeDescription || "",
    published: r.publishTime || null
  }));
}

async function processOne(poi: any) {
  if (!FORCE && poi.gmaps_synced_at) {
    console.log(`  ⊘ ${poi.slug} đã sync (${poi.gmaps_synced_at}) — skip`);
    return;
  }
  console.log(`  → ${poi.slug} ("${poi.name}")`);

  let data: any = null;
  try {
    if (poi.place_id) {
      data = await fetchPlace(poi.place_id);
    }
    if ((!data || !data.rating) && poi.lat && poi.lng) {
      const found = await searchPlace(poi.name, poi.lat, poi.lng);
      if (found) data = found;
    }
  } catch (e: any) {
    console.log(`    fetch fail: ${e.message.slice(0, 100)}`);
  }

  if (!data || !data.rating) {
    console.log(`    ✗ không có data Google`);
    await sb.from("pois").update({ gmaps_synced_at: new Date().toISOString() }).eq("slug", poi.slug);
    return;
  }

  const reviews = normalizeReviews(data.reviews);
  const { error } = await sb.from("pois").update({
    gmaps_rating: data.rating,
    gmaps_review_count: data.userRatingCount,
    gmaps_reviews: reviews,
    gmaps_synced_at: new Date().toISOString()
  }).eq("slug", poi.slug);

  if (error) console.error(`    ✗ save: ${error.message}`);
  else console.log(`    ✓ ★${data.rating} (${data.userRatingCount} reviews) + ${reviews.length} reviews lưu`);
}

async function main() {
  let q = sb.from("pois").select("slug, name, place_id, lat, lng, gmaps_synced_at").not("place_id", "is", null);
  if (ONE) q = q.eq("slug", ONE);
  const { data } = await q;
  if (!data || data.length === 0) { console.log("Không POI nào có place_id"); return; }

  console.log(`Processing ${data.length} POI có place_id (${FORCE ? "FORCE" : "skip-if-synced"})\n`);
  for (const poi of data) {
    await processOne(poi);
    await new Promise((r) => setTimeout(r, 250));
  }
  console.log("\nDone.");
}

main();
