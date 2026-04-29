/**
 * Expand: lấy thêm ảnh cho POI đã có ảnh (tối đa 8 ảnh / POI).
 * Query nhiều biến thể + Wikimedia category browsing để tăng hit.
 *
 * Chạy:
 *   npm run expand-images                          # all POI có ảnh
 *   npm run expand-images -- --slug=thac-bo        # 1 POI
 *   npm run expand-images -- --max=10              # mở rộng tối đa 10 ảnh
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const args = process.argv.slice(2);
const ONE = args.find((a) => a.startsWith("--slug="))?.split("=")[1];
const MAX = parseInt(args.find((a) => a.startsWith("--max="))?.split("=")[1] || "8");

const UA = { "User-Agent": "HoaBinhOi/1.0 (https://hoa-binh-oi.vercel.app)" };

const VN_KEYWORDS = ["hoa_binh", "hòa bình", "hoabinh", "song_da", "sông_đà", "muong",
  "mai_chau", "kim_boi", "vietnam", "thac_bo", "thác_bờ", "lac_son", "phú thọ", "phu_tho"];

function isVN(filename: string): boolean {
  const f = filename.toLowerCase();
  return VN_KEYWORDS.some((k) => f.includes(k));
}

async function search(query: string, limit = 15): Promise<string[]> {
  const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=${limit}&origin=*`;
  try {
    const r = await fetch(u, { headers: UA });
    const j: any = await r.json();
    return (j?.query?.search || []).map((s: any) => s.title);
  } catch { return []; }
}

async function fromCategory(cat: string, limit = 30): Promise<string[]> {
  const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&list=categorymembers&cmtitle=${encodeURIComponent("Category:" + cat)}&cmtype=file&cmlimit=${limit}&origin=*`;
  try {
    const r = await fetch(u, { headers: UA });
    const j: any = await r.json();
    return (j?.query?.categorymembers || []).map((m: any) => m.title);
  } catch { return []; }
}

async function getImageUrls(titles: string[], filterVN = true): Promise<string[]> {
  if (titles.length === 0) return [];
  const batches: string[][] = [];
  for (let i = 0; i < titles.length; i += 25) batches.push(titles.slice(i, i + 25));
  const urls: string[] = [];
  for (const batch of batches) {
    const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(batch.join("|"))}&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1280&origin=*`;
    try {
      const r = await fetch(u, { headers: UA });
      const j: any = await r.json();
      const pages = j?.query?.pages || {};
      for (const k of Object.keys(pages)) {
        const ii = pages[k]?.imageinfo?.[0];
        const title = pages[k]?.title || "";
        if (!ii) continue;
        if (!["image/jpeg", "image/png", "image/webp"].includes(ii.mime)) continue;
        if (ii.width && ii.width < 800) continue;
        if (filterVN && !isVN(title)) continue;
        urls.push(ii.thumburl || ii.url);
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 800));
  }
  return urls;
}

const QUERY_MAP: Record<string, { queries: string[]; categories: string[] }> = {
  "thuy-dien-hoa-binh": {
    queries: ["Nhà máy thuỷ điện Hoà Bình", "Hoa Binh hydroelectric", "Hòa Bình dam"],
    categories: ["Hoa Binh Hydroelectricity Plant", "Da River", "Sông Đà"]
  },
  "thac-bo": {
    queries: ["Thác Bờ", "Thac Bo waterfall Vietnam"],
    categories: ["Hòa Bình Province"]
  },
  "long-ho-hoa-binh": {
    queries: ["Hồ Hòa Bình", "Hoa Binh reservoir", "Da River reservoir"],
    categories: ["Hòa Bình Province", "Reservoirs of Vietnam", "Da River"]
  },
  "ban-lac-mai-chau": {
    queries: ["Bản Lác Mai Châu", "Ban Lac village", "Mai Chau Vietnam"],
    categories: ["Mai Châu district", "Hòa Bình Province"]
  },
  "ban-pom-coong": {
    queries: ["Pom Coọng", "Mai Chau village"],
    categories: ["Mai Châu district"]
  },
  "mai-chau-ecolodge": {
    queries: ["Mai Châu ecolodge", "Mai Chau valley"],
    categories: ["Mai Châu district"]
  },
  "homestay-nha-san-mai-chau": {
    queries: ["nhà sàn Mai Châu", "Mai Chau stilt house"],
    categories: ["Mai Châu district"]
  },
  "suoi-kim-boi": {
    queries: ["Suối khoáng Kim Bôi", "Kim Boi hot spring"],
    categories: ["Kim Bôi district", "Hòa Bình Province"]
  },
  "chua-tien": {
    queries: ["chùa Tiên Hòa Bình", "Tien pagoda Hoa Binh"],
    categories: ["Hòa Bình Province"]
  },
  "hang-hoa-tien": {
    queries: ["Động hoa tiên", "hang động Hòa Bình"],
    categories: ["Hòa Bình Province"]
  },
  "den-ba-chua-thac-bo": {
    queries: ["đền Bà Chúa Thác Bờ", "Thac Bo temple"],
    categories: ["Hòa Bình Province"]
  },
  "dao-dua-long-ho": {
    queries: ["đảo dừa Hòa Bình", "Hoa Binh lake island"],
    categories: ["Da River", "Hòa Bình Province"]
  },
  "dinh-pa-co": {
    queries: ["đỉnh Pà Cò", "Pa Co peak Hoa Binh"],
    categories: ["Mai Châu district", "Hòa Bình Province"]
  },
  "cho-phien-pa-co": {
    queries: ["chợ phiên Pà Cò", "Pa Co market"],
    categories: ["Mai Châu district"]
  }
};

async function processPoi(slug: string, name: string, existing: string[]) {
  console.log(`\n→ ${slug} ("${name}") — đang có ${existing.length} ảnh`);
  if (existing.length >= MAX) {
    console.log(`  ⊘ đã đủ ${MAX} ảnh, skip`);
    return;
  }

  const config = QUERY_MAP[slug] || { queries: [name, `${name} Hoà Bình`], categories: ["Hòa Bình Province"] };
  const allTitles = new Set<string>();

  for (const q of config.queries) {
    const titles = await search(q, 15);
    titles.forEach((t) => allTitles.add(t));
    await new Promise((r) => setTimeout(r, 800));
  }
  for (const c of config.categories) {
    const titles = await fromCategory(c, 30);
    titles.forEach((t) => allTitles.add(t));
    await new Promise((r) => setTimeout(r, 800));
  }

  console.log(`  searched ${allTitles.size} candidate files`);
  const urls = await getImageUrls(Array.from(allTitles));
  console.log(`  filtered to ${urls.length} VN-relevant`);

  const existingSet = new Set(existing);
  const newUrls = urls.filter((u) => !existingSet.has(u));
  if (newUrls.length === 0) {
    console.log(`  ⊘ không có ảnh mới`);
    return;
  }

  const merged = [...existing, ...newUrls].slice(0, MAX);
  const { error } = await sb.from("pois").update({ images: merged }).eq("slug", slug);
  if (error) console.error(`  ✗ save fail: ${error.message}`);
  else console.log(`  ✓ ${existing.length} → ${merged.length} ảnh (+${merged.length - existing.length})`);
}

async function main() {
  let q = sb.from("pois").select("slug, name, images");
  if (ONE) q = q.eq("slug", ONE);
  const { data } = await q;
  if (!data) return;

  // Chỉ POI có ít nhất 1 ảnh (skip POI chưa có)
  const targets = data.filter((p: any) => Array.isArray(p.images) && p.images.length > 0 && !p.images[0].includes("supabase.co/storage"));
  console.log(`Expand ${targets.length} POI (max ${MAX} ảnh / POI, skip user-uploaded)`);

  for (const p of targets) {
    await processPoi(p.slug, p.name, p.images);
  }
}

main();
