/**
 * Bot Claude recommend top nhà hàng Hoà Bình.
 * - Đọc kiến thức training về quán ăn HB
 * - Loại trùng với DB hiện tại
 * - Geocode địa chỉ qua OSM Nominatim (free, no key)
 * - Insert status=draft, anh review qua /admin/poi rồi publish
 *
 * Chạy:
 *   npm run recommend-restaurants                    # default 15 quán
 *   npm run recommend-restaurants -- --count=25      # 25 quán
 *   npm run recommend-restaurants -- --focus=muong   # focus quán Mường
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const args = process.argv.slice(2);
const COUNT = parseInt(args.find((a) => a.startsWith("--count="))?.split("=")[1] || "15");
const FOCUS = args.find((a) => a.startsWith("--focus="))?.split("=")[1] || "all";

const FOCUS_DESC: Record<string, string> = {
  all: "đa dạng — đặc sản địa phương, nhà hàng truyền thống, quán đường phố nổi tiếng",
  muong: "chỉ quán dân tộc Mường — cơm lam, lợn mán, gà đồi, xôi nếp nương",
  song_da: "chỉ chuyên cá sông Đà — cá lăng, cá ngạnh, cá chiên, cá quất",
  binh_dan: "quán bình dân giá rẻ ≤200k/người — quán cơm, phở, bánh cuốn, bún chả",
  cao_cap: "nhà hàng cao cấp 500k+/người — resort dining, không gian đẹp",
  cafe: "cafe đẹp / quán giải khát — view hồ, không gian sống ảo"
};

interface RecPOI {
  slug: string;
  name: string;
  category: string;
  address: string;
  description: string;
  insider_tip: string;
  price_range: string;
  tags: string[];
}

async function getExistingSlugs(): Promise<Set<string>> {
  const { data } = await sb.from("pois").select("slug, name").eq("category", "an");
  const set = new Set<string>();
  for (const p of data || []) {
    set.add(p.slug);
    set.add(p.name.toLowerCase());
  }
  return set;
}

async function askClaude(count: number, focus: string, existing: Set<string>): Promise<RecPOI[]> {
  const focusDesc = FOCUS_DESC[focus] || FOCUS_DESC.all;
  const skip = Array.from(existing).slice(0, 30).join(", ");

  console.log(`→ Asking Claude for ${count} restaurants (focus: ${focus})...`);
  const msg = await claude.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 16000,
    system: `Bạn là chuyên gia ẩm thực phường Hoà Bình (Phú Thọ mới sau sáp nhập 1/7/2025) — bao gồm khu vực TP Hoà Bình cũ + Mai Châu + Cao Phong + Lạc Sơn + Kim Bôi.
Bạn biết các quán ăn nổi tiếng + được giới reviewer foody/báo du lịch khen.
Luôn trả lời JSON array hợp lệ — không markdown, không text trước/sau.`,
    messages: [{
      role: "user",
      content: `Recommend ${count} nhà hàng / quán ăn / cafe ngon nhất ở Hoà Bình mà KHÔNG nằm trong list này: ${skip}

Focus: ${focusDesc}

Output JSON array với mỗi quán có shape:
{
  "slug": "ten-quan-khong-dau-cach-bang-gach",
  "name": "Tên quán có dấu",
  "category": "an",
  "address": "Địa chỉ cụ thể đường + xã/phường + Hoà Bình",
  "description": "60-120 từ — món signature, không gian, giá ai phù hợp, vì sao đáng đến",
  "insider_tip": "1-2 câu mẹo bí quyết — đặt món gì, khung giờ tốt, lưu ý đặc biệt",
  "price_range": "150k-300k/người (format chuẩn)",
  "tags": ["tag-1", "tag-2", "tag-3"]
}

Quy tắc bắt buộc:
- Chỉ recommend quán THẬT (có trong báo du lịch / Maps / mạng xã hội VN). Không bịa.
- Slug viết liền không dấu, dùng dấu gạch giữa.
- Description ngôi thứ 3 — không "tôi" / "bạn".
- Tags 3-5 cái không dấu.
- KHÔNG include lat/lng (sẽ geocode sau).

Trả về JSON array thuần — KHÔNG markdown wrap, không giải thích.`
    }]
  });

  const text = msg.content[0].type === "text" ? msg.content[0].text : "";
  console.log(`  Claude response: ${text.length} chars`);
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.error("  ✗ không parse được JSON");
    return [];
  }
  let raw = jsonMatch[0];
  try {
    const list: RecPOI[] = JSON.parse(raw);
    return list.filter((p) => p.slug && p.name && !existing.has(p.slug));
  } catch (e: any) {
    console.error(`  ✗ JSON parse fail tại ${e.message}, thử rescue...`);
    const lastClose = raw.lastIndexOf("}");
    if (lastClose > 0) {
      const truncated = raw.slice(0, lastClose + 1) + "]";
      try {
        const list: RecPOI[] = JSON.parse(truncated);
        console.log(`  ✓ rescue được ${list.length} quán (JSON bị cắt cuối)`);
        return list.filter((p) => p.slug && p.name && !existing.has(p.slug));
      } catch {}
    }
    return [];
  }
}

async function geocode(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    const res = await fetch(url, { headers: { "User-Agent": "HoaBinhOi/1.0" } });
    const json: any = await res.json();
    if (json[0]) return { lat: parseFloat(json[0].lat), lng: parseFloat(json[0].lon) };
  } catch {}
  return null;
}

async function processOne(rec: RecPOI) {
  console.log(`  → ${rec.slug} (${rec.name})`);
  const geo = await geocode(rec.address) || { lat: 20.83, lng: 105.34 };  // fallback HB center
  await new Promise((r) => setTimeout(r, 1100));  // OSM rate limit

  const { error } = await sb.from("pois").upsert({
    slug: rec.slug,
    name: rec.name,
    category: "an",
    lat: geo.lat,
    lng: geo.lng,
    address: rec.address,
    description: rec.description,
    insider_tip: rec.insider_tip,
    price_range: rec.price_range,
    tags: rec.tags,
    status: "draft",
    images: []
  }, { onConflict: "slug" });

  if (error) console.error(`    ✗ save fail: ${error.message}`);
  else console.log(`    ✓ saved (status=draft, lat=${geo.lat.toFixed(4)})`);
}

async function main() {
  const existing = await getExistingSlugs();
  console.log(`Đang có ${existing.size / 2} nhà hàng trong DB. Yêu cầu Claude thêm ${COUNT}...\n`);

  const recs = await askClaude(COUNT, FOCUS, existing);
  console.log(`\nClaude trả ${recs.length} quán mới.\n`);

  for (const rec of recs) {
    await processOne(rec);
  }

  console.log(`\nDone. Vào /admin/poi?status=draft&category=an để review + publish.`);
  console.log(`Tip: chạy 'npm run gen-images-pexels' để fill ảnh cho quán mới.`);
}

main();
