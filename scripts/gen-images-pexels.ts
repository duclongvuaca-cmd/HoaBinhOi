/**
 * Lấy ảnh stock từ Pexels API cho POI chưa có ảnh.
 * Free, không cần thẻ — chỉ email register.
 *
 * Setup:
 *   1. https://www.pexels.com/api/ → "Get Started" → đăng ký (email + name)
 *   2. https://www.pexels.com/api/new/ → tạo App → copy API key
 *   3. Add vào .env.local: PEXELS_KEY=your_key
 *
 * Chạy:
 *   npm run gen-images-pexels                    # chỉ POI chưa có ảnh
 *   npm run gen-images-pexels -- --slug=xxx       # 1 POI
 *   npm run gen-images-pexels -- --max=4          # max ảnh / POI
 *   npm run gen-images-pexels -- --force          # override ảnh cũ
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const KEY = process.env.PEXELS_KEY;
if (!KEY) {
  console.error("Missing PEXELS_KEY in .env.local");
  console.error("Đăng ký free: https://www.pexels.com/api/new/");
  process.exit(1);
}

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const args = process.argv.slice(2);
const ONE = args.find((a) => a.startsWith("--slug="))?.split("=")[1];
const MAX = parseInt(args.find((a) => a.startsWith("--max="))?.split("=")[1] || "4");
const FORCE = args.includes("--force");

const QUERY_MAP: Record<string, string[]> = {
  // Ăn uống
  "an": ["vietnamese food rustic", "vietnamese hotpot", "river fish vietnam"],
  "vua-ca-long-phuong": ["vietnamese fish dish", "river fish hotpot vietnam"],
  "bep-muong": ["vietnamese stilt house dining", "muong cuisine vietnam"],
  "hang-than": ["vietnamese countryside restaurant", "rustic vietnamese kitchen"],
  "quan-de-nui": ["grilled goat vietnamese", "mountain goat dish"],
  // Mua
  "mua": ["vietnamese market traditional"],
  "cam-cao-phong": ["vietnamese orange grove"],
  "buoi-do-tan-lac": ["vietnamese pomelo fruit"],
  "ruou-can": ["vietnamese rice wine ceramic jar"],
  "mat-ong-lac-son": ["honey jar vietnamese"],
  "che-pa-co": ["green tea plantation vietnam"],
  "tho-cam-thai": ["thai brocade weaving vietnam", "ethnic textile vietnam"],
  // Nghỉ
  "nghi": ["vietnamese mountain resort"],
  "khach-san-hoa-binh-2": ["vietnam hotel mountain"],
  "mai-chau-ecolodge": ["vietnamese ecolodge bamboo"],
  "serena-resort-kim-boi": ["vietnam wellness resort hot spring"],
  "homestay-nha-san-mai-chau": ["vietnamese stilt house homestay", "mai chau ethnic village"],
  "avana-retreat": ["vietnam mountain retreat boutique"],
  // Trải nghiệm
  "choi": ["vietnam outdoor activity"],
  "long-phuong-pickleball": ["pickleball court outdoor"],
  "cheo-sup-ho-hoa-binh": ["paddleboard mountain lake", "sup vietnam lake"],
  "xong-hoi-muong": ["traditional sauna vietnam herb"],
  "dap-xe-quanh-ho": ["cycling mountain lake vietnam"],
  // Điểm đến
  "diem-den": ["vietnamese landscape mountain"],
  "thuy-dien-hoa-binh": ["hydroelectric dam vietnam"],
  "thac-bo": ["waterfall vietnam jungle"],
  "hang-hoa-tien": ["vietnamese cave limestone"],
  "suoi-kim-boi": ["vietnam hot spring nature"],
  "ban-lac-mai-chau": ["mai chau village rice paddy", "vietnam ethnic village"],
  "ban-pom-coong": ["vietnam ethnic mountain village"],
  "dinh-pa-co": ["vietnam mountain peak northwest"],
  "chua-tien": ["vietnamese pagoda mountain"],
  "long-ho-hoa-binh": ["vietnam reservoir lake mountains", "hoa binh lake da river"],
  "dao-dua-long-ho": ["lake island palm vietnam"],
  "den-ba-chua-thac-bo": ["vietnamese temple lake"],
  // Sự kiện
  "su-kien": ["vietnamese festival ethnic"],
  "le-hoi-khai-ha-muong-bi": ["muong festival vietnam"],
  "hoi-cong-chieng": ["vietnamese gong ceremony"],
  "cho-phien-pa-co": ["vietnamese ethnic market hmong"]
};

async function searchPexels(query: string, perPage = 6): Promise<string[]> {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: KEY! } });
  if (!res.ok) {
    console.error(`  Pexels ${res.status} for "${query}"`);
    return [];
  }
  const json: any = await res.json();
  return (json.photos || []).map((p: any) => p.src.large || p.src.medium);
}

async function processPoi(poi: any) {
  const has = Array.isArray(poi.images) && poi.images.length > 0;
  const userUploaded = has && (poi.images[0] as string).includes("supabase.co/storage");
  if (userUploaded && !FORCE) {
    console.log(`  ⊘ ${poi.slug} có ảnh user upload, skip`);
    return;
  }
  if (has && !FORCE) {
    console.log(`  ⊘ ${poi.slug} đã có ${poi.images.length} ảnh, skip`);
    return;
  }

  const queries = QUERY_MAP[poi.slug] || QUERY_MAP[poi.category] || [`vietnam ${poi.category}`];
  console.log(`  → ${poi.slug} ("${poi.name}") queries=[${queries.join(" | ")}]`);

  const allUrls: string[] = [];
  for (const q of queries) {
    if (allUrls.length >= MAX) break;
    const urls = await searchPexels(q, 6);
    for (const u of urls) {
      if (!allUrls.includes(u)) allUrls.push(u);
      if (allUrls.length >= MAX) break;
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  if (allUrls.length === 0) {
    console.log(`    ✗ không có ảnh`);
    return;
  }

  const { error } = await sb.from("pois").update({ images: allUrls }).eq("slug", poi.slug);
  if (error) console.error(`    ✗ save: ${error.message}`);
  else console.log(`    ✓ saved ${allUrls.length} ảnh`);
}

async function main() {
  let q = sb.from("pois").select("slug, name, images, category");
  if (ONE) q = q.eq("slug", ONE);
  const { data } = await q;
  if (!data) return;

  console.log(`Processing ${data.length} POI từ Pexels (max ${MAX} ảnh, ${FORCE ? "FORCE" : "skip-if-has"})\n`);
  for (const poi of data) {
    await processPoi(poi);
    await new Promise((r) => setTimeout(r, 500));
  }
}

main();
