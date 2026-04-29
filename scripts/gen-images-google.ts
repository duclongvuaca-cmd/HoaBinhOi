/**
 * Lấy ảnh thật từ Google Maps Places API cho mỗi POI có place_id.
 * - Best quality, ảnh thực của từng địa điểm
 * - Dùng Google Places (New) API
 * - Cost: ~$0.007 / photo. 33 POI × 5 ảnh = ~$1.15
 *
 * Setup 1 lần:
 *   1. https://console.cloud.google.com → New Project "HoaBinhOi"
 *   2. APIs & Services → Library → enable "Places API (New)"
 *   3. APIs & Services → Credentials → Create API key
 *   4. (optional) Restrict key: HTTP referrer = your domain
 *   5. Add billing (free $300 credit auto)
 *   6. Add to .env.local: GOOGLE_MAPS_KEY=AIzaSy...
 *
 * Chạy:
 *   npm run gen-images-google                       # all POI có place_id
 *   npm run gen-images-google -- --slug=xxx          # 1 POI
 *   npm run gen-images-google -- --max=5             # max ảnh / POI
 *   npm run gen-images-google -- --force             # override ảnh cũ
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const KEY = process.env.GOOGLE_MAPS_KEY;
if (!KEY) {
  console.error("Missing GOOGLE_MAPS_KEY in .env.local");
  console.error("Setup: https://console.cloud.google.com → Places API (New) → Credentials");
  process.exit(1);
}

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const args = process.argv.slice(2);
const ONE = args.find((a) => a.startsWith("--slug="))?.split("=")[1];
const MAX = parseInt(args.find((a) => a.startsWith("--max="))?.split("=")[1] || "5");
const FORCE = args.includes("--force");

const HEADERS = {
  "X-Goog-Api-Key": KEY,
  "X-Goog-FieldMask": "photos"
};

function gmapsPlaceIdFromHex(hex: string | null): string | null {
  if (!hex) return null;
  return hex;
}

async function fetchPhotosByPlaceId(placeId: string): Promise<string[]> {
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Place details ${res.status}: ${t.slice(0, 200)}`);
  }
  const json: any = await res.json();
  const photos = json.photos || [];
  const urls: string[] = [];
  for (const p of photos.slice(0, MAX)) {
    const photoUrl = `https://places.googleapis.com/v1/${p.name}/media?maxHeightPx=1200&key=${KEY}&skipHttpRedirect=true`;
    try {
      const r = await fetch(photoUrl);
      if (!r.ok) continue;
      const j: any = await r.json();
      if (j.photoUri) urls.push(j.photoUri);
    } catch {}
  }
  return urls;
}

async function fetchByName(name: string, lat: number, lng: number): Promise<string[]> {
  const searchUrl = "https://places.googleapis.com/v1/places:searchText";
  const res = await fetch(searchUrl, {
    method: "POST",
    headers: { ...HEADERS, "Content-Type": "application/json", "X-Goog-FieldMask": "places.id,places.photos,places.displayName" },
    body: JSON.stringify({
      textQuery: `${name} Hoà Bình`,
      locationBias: { circle: { center: { latitude: lat, longitude: lng }, radius: 5000 } },
      maxResultCount: 1
    })
  });
  if (!res.ok) return [];
  const json: any = await res.json();
  const place = json.places?.[0];
  if (!place?.photos) return [];
  const urls: string[] = [];
  for (const p of place.photos.slice(0, MAX)) {
    const photoUrl = `https://places.googleapis.com/v1/${p.name}/media?maxHeightPx=1200&key=${KEY}&skipHttpRedirect=true`;
    try {
      const r = await fetch(photoUrl);
      if (!r.ok) continue;
      const j: any = await r.json();
      if (j.photoUri) urls.push(j.photoUri);
    } catch {}
  }
  return urls;
}

async function processPoi(poi: any) {
  const has = Array.isArray(poi.images) && poi.images.length > 0;
  const userUploaded = has && (poi.images[0] as string).includes("supabase.co/storage");
  if (userUploaded && !FORCE) {
    console.log(`  ⊘ ${poi.slug} có ảnh user upload, skip (--force để override)`);
    return;
  }
  if (has && !FORCE) {
    console.log(`  ⊘ ${poi.slug} đã có ${poi.images.length} ảnh (--force để override)`);
    return;
  }

  console.log(`  → ${poi.slug} ("${poi.name}")`);
  let urls: string[] = [];

  if (poi.place_id) {
    try {
      urls = await fetchPhotosByPlaceId(poi.place_id);
      if (urls.length > 0) console.log(`    via place_id: ${urls.length} ảnh`);
    } catch (e: any) {
      console.log(`    place_id fail: ${e.message.slice(0, 80)}`);
    }
  }

  if (urls.length === 0 && poi.lat && poi.lng) {
    try {
      urls = await fetchByName(poi.name, poi.lat, poi.lng);
      if (urls.length > 0) console.log(`    via text search: ${urls.length} ảnh`);
    } catch (e: any) {
      console.log(`    text search fail: ${e.message.slice(0, 80)}`);
    }
  }

  if (urls.length === 0) {
    console.log(`    ✗ không có ảnh`);
    return;
  }

  const { error } = await sb.from("pois").update({ images: urls }).eq("slug", poi.slug);
  if (error) console.error(`    ✗ save: ${error.message}`);
  else console.log(`    ✓ saved ${urls.length} ảnh`);
}

async function main() {
  let q = sb.from("pois").select("slug, name, images, place_id, lat, lng");
  if (ONE) q = q.eq("slug", ONE);
  const { data } = await q;
  if (!data) return;

  console.log(`Processing ${data.length} POI từ Google Places (${FORCE ? "FORCE" : "skip-if-has"}, max ${MAX} ảnh / POI)\n`);
  for (const poi of data) {
    await processPoi(poi);
    await new Promise((r) => setTimeout(r, 300));
  }
  console.log("\nDone.");
}

main();
