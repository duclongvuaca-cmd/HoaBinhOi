/**
 * Agent tự fill ảnh cho POI thiếu hình.
 * - Landmark (đập/thác/đền/hồ/đảo): query Wikimedia Commons (CC-BY, free)
 * - Khác: skip, user upload qua admin UI
 *
 * Chạy: npm run gen-images
 *       npm run gen-images -- --slug=thuy-dien-hoa-binh   (chỉ 1 POI)
 *       npm run gen-images -- --force                      (override ảnh cũ)
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Missing env"); process.exit(1); }
const sb = createClient(url, key, { auth: { persistSession: false } });

const args = process.argv.slice(2);
const ONE_SLUG = args.find((a) => a.startsWith("--slug="))?.split("=")[1];
const FORCE = args.includes("--force");

const LANDMARK_KEYWORDS = ["đập", "thác", "đền", "chùa", "hồ", "đảo", "thuỷ điện", "thuy dien", "hoa binh", "mai châu", "kim bôi"];

function isLandmark(name: string): boolean {
  const n = name.toLowerCase();
  return LANDMARK_KEYWORDS.some((kw) => n.includes(kw));
}

const UA = { "User-Agent": "HoaBinhOi/1.0 (https://hoa-binh-oi.vercel.app; contact@hoabinhoi.vn)" };

async function searchWikimedia(query: string, limit = 5): Promise<string[]> {
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=${limit}&origin=*`;
  try {
    const res = await fetch(searchUrl, { headers: UA });
    const json: any = await res.json();
    const titles = (json?.query?.search || []).map((s: any) => s.title);
    if (titles.length === 0) return [];

    await new Promise((r) => setTimeout(r, 1000));
    const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(titles.join("|"))}&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1200&origin=*`;
    const infoRes = await fetch(infoUrl, { headers: UA });
    const infoJson: any = await infoRes.json();
    const pages = infoJson?.query?.pages || {};

    const urls: string[] = [];
    for (const k of Object.keys(pages)) {
      const ii = pages[k]?.imageinfo?.[0];
      if (!ii) continue;
      if (ii.mime !== "image/jpeg" && ii.mime !== "image/png" && ii.mime !== "image/webp") continue;
      if (ii.width && ii.width < 800) continue;
      const fname = (pages[k].title || "").toLowerCase();
      const isRelevant =
        fname.includes("hoa_binh") || fname.includes("hòa bình") ||
        fname.includes("hoabinh") || fname.includes("son_la") ||
        fname.includes("muong") || fname.includes("mai_chau") ||
        fname.includes("song_da") || fname.includes("kim_boi") ||
        fname.includes("vietnam");
      if (!isRelevant) continue;
      urls.push(ii.thumburl || ii.url);
    }
    return urls.slice(0, 3);
  } catch (e: any) {
    console.error(`  Wikimedia fail: ${e.message}`);
    return [];
  }
}

async function processPoi(poi: any) {
  const has = Array.isArray(poi.images) && poi.images.length > 0;
  if (has && !FORCE) {
    console.log(`  ⊘ ${poi.slug} đã có ${poi.images.length} ảnh (skip, dùng --force để override)`);
    return;
  }
  const landmark = isLandmark(poi.name);
  if (!landmark) {
    console.log(`  ⊘ ${poi.slug} không phải landmark — skip (admin upload tay)`);
    return;
  }

  console.log(`  → ${poi.slug}: "${poi.name}" — searching Wikimedia...`);
  const queries = [poi.name, `${poi.name} Hoà Bình`, `${poi.name} Vietnam`];
  let urls: string[] = [];
  for (const q of queries) {
    urls = await searchWikimedia(q);
    if (urls.length > 0) {
      console.log(`    found ${urls.length} qua "${q}"`);
      break;
    }
  }
  if (urls.length === 0) {
    console.log(`    ✗ không tìm được ảnh`);
    return;
  }

  const { error } = await sb.from("pois").update({ images: urls }).eq("slug", poi.slug);
  if (error) console.error(`    ✗ save fail: ${error.message}`);
  else console.log(`    ✓ saved ${urls.length} ảnh vào DB`);
}

async function main() {
  let q = sb.from("pois").select("slug, name, images, category");
  if (ONE_SLUG) q = q.eq("slug", ONE_SLUG);
  const { data: pois, error } = await q;
  if (error) { console.error("List fail:", error.message); process.exit(1); }
  if (!pois || pois.length === 0) { console.log("Không có POI"); return; }

  console.log(`Processing ${pois.length} POIs (${FORCE ? "FORCE" : "skip-if-has"})...\n`);
  for (const poi of pois) {
    await processPoi(poi);
    await new Promise((r) => setTimeout(r, 1500));
  }
  console.log("\nDone. Verify trên /admin/poi hoặc /poi/[slug].");
}

main();
