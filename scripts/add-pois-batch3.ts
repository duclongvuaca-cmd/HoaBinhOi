/**
 * Batch 3 — thêm 3 POI mới + featured Vua Cá + ảnh minh hoạ Unsplash
 * Chạy: npm run add-pois-batch3
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const NEW_POIS = [
  {
    slug: "sojo-hotel-hoa-binh",
    name: "SOJO Hotel Hoà Bình",
    category: "nghi",
    lat: 20.8205, lng: 105.3315,
    address: "TP. Hoà Bình",
    description: "Khách sạn 3 sao chuỗi SOJO (TNH Hotels), thiết kế hiện đại, smart room với app điều khiển đèn/rèm/máy lạnh. Vị trí trung tâm tiện đi đập thuỷ điện.",
    insider_tip: "Smart room dùng app SOJO điều khiển toàn phòng — đăng ký app trước khi check-in để tận dụng. Buffet sáng đầy đủ. Yêu cầu phòng cao tầng có view sông Đà.",
    price_range: "800k-1.4tr/đêm",
    tags: ["3-sao", "smart-room", "trung-tam", "sojo", "featured"],
    images: [],
    status: "published"
  },
  {
    slug: "sakura-hotel-hoa-binh",
    name: "Sakura Hotel Hoà Bình",
    category: "nghi",
    lat: 20.8380, lng: 105.3395,
    address: "TP. Hoà Bình",
    description: "Khách sạn phong cách Nhật, không gian yên tĩnh, phòng sạch sẽ tinh tế. Phù hợp khách công tác hoặc couple muốn nghỉ ngơi yên bình.",
    insider_tip: "Phòng có ban công nhỏ — phù hợp đọc sách/làm việc. Có cà phê sáng kiểu Nhật. Đặt qua booking.com thường có deal sớm.",
    price_range: "600k-1.1tr/đêm",
    tags: ["3-sao", "nhat-ban", "yen-tinh", "couple"],
    images: [],
    status: "published"
  },
  {
    slug: "nem-chua-ran-caption",
    name: "Nem chua rán Caption",
    category: "an",
    lat: 20.8385, lng: 105.3375,
    address: "TP. Hoà Bình",
    description: "Quán ăn vặt nem chua rán nổi tiếng giới trẻ Hoà Bình. Nem chua giòn rụm, ăn kèm tương ớt cay + dưa chuột. Mở chiều-tối.",
    insider_tip: "Mở từ 15h đến 22h. Đi nhóm 4-6 người gọi đĩa to + thêm khoai tây chiên + xúc xích nướng. Cuối tuần đông sau 19h, đi sớm hơn nếu muốn có chỗ.",
    price_range: "30k-80k/người",
    tags: ["an-vat", "nem-chua-ran", "tre", "chieu-toi", "featured"],
    images: [],
    status: "published"
  }
];

// Unsplash photos verified — ảnh ẩm thực Việt + khách sạn
const FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1280&q=80",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1280&q=80",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1280&q=80",
  "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=1280&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1280&q=80",
  "https://images.unsplash.com/photo-1535007813616-79dc02ba4021?w=1280&q=80",
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=1280&q=80",
  "https://images.unsplash.com/photo-1559847844-5315695dadae?w=1280&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1280&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1280&q=80"
];
const STREETFOOD_IMAGES = [
  "https://images.unsplash.com/photo-1606851094291-6efae152bb87?w=1280&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1280&q=80",
  "https://images.unsplash.com/photo-1583224944844-5b268c057b14?w=1280&q=80",
  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1280&q=80"
];
const HOTEL_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1280&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1280&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1280&q=80",
  "https://images.unsplash.com/photo-1455587734955-081b22074882?w=1280&q=80",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1280&q=80",
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1280&q=80"
];

// Hash slug → 3 ảnh ổn định (cùng slug luôn cùng ảnh)
function pickImages(slug: string, pool: string[], count = 3): string[] {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = ((hash << 5) - hash) + slug.charCodeAt(i);
  const start = Math.abs(hash) % pool.length;
  return Array.from({ length: count }, (_, i) => pool[(start + i) % pool.length]);
}

async function upsertNewPois() {
  console.log("=== 1. Thêm 3 POI mới ===");
  for (const poi of NEW_POIS) {
    const pool = poi.category === "an"
      ? (poi.tags.includes("an-vat") ? STREETFOOD_IMAGES : FOOD_IMAGES)
      : HOTEL_IMAGES;
    poi.images = pickImages(poi.slug, pool);
    const { error } = await sb.from("pois").upsert(poi, { onConflict: "slug" });
    if (error) console.error(`  ✗ ${poi.slug}: ${error.message}`);
    else console.log(`  ✓ ${poi.slug} (${poi.category}, ${poi.images.length} ảnh)`);
  }
}

async function setFeatured() {
  console.log("\n=== 2. Đặt featured tag cho POI top ===");
  const FEATURED = ["vua-ca-long-phuong", "sojo-hotel-hoa-binh", "nem-chua-ran-caption", "muong-thanh-hoa-binh"];
  for (const slug of FEATURED) {
    const { data: poi } = await sb.from("pois").select("tags").eq("slug", slug).maybeSingle();
    if (!poi) { console.log(`  ⊘ ${slug}: không có`); continue; }
    const tags = Array.isArray(poi.tags) ? poi.tags : [];
    if (!tags.includes("featured")) tags.push("featured");
    const { error } = await sb.from("pois").update({ tags }).eq("slug", slug);
    if (error) console.error(`  ✗ ${slug}: ${error.message}`);
    else console.log(`  ✓ ${slug} → featured`);
  }
}

async function fillImages() {
  console.log("\n=== 3. Set ảnh Unsplash cho POI chưa có ảnh ===");
  const { data: pois } = await sb.from("pois").select("slug, name, category, tags, images").in("category", ["an", "nghi"]);
  if (!pois) return;
  let count = 0;
  for (const p of pois) {
    const cur = Array.isArray(p.images) ? p.images : [];
    if (cur.length > 0) continue;  // đã có ảnh thì skip
    const tags = Array.isArray(p.tags) ? p.tags : [];
    const pool = p.category === "an"
      ? (tags.includes("an-vat") ? STREETFOOD_IMAGES : FOOD_IMAGES)
      : HOTEL_IMAGES;
    const imgs = pickImages(p.slug, pool);
    const { error } = await sb.from("pois").update({ images: imgs }).eq("slug", p.slug);
    if (error) console.error(`  ✗ ${p.slug}: ${error.message}`);
    else { console.log(`  ✓ ${p.slug} (${p.category}): ${imgs.length} ảnh`); count++; }
  }
  console.log(`\n  Tổng: ${count} POI được set ảnh`);
}

async function main() {
  await upsertNewPois();
  await setFeatured();
  await fillImages();
  console.log("\n--- DONE ---");
  console.log("Verify:");
  console.log("  npm run dev → http://localhost:3001/an  (Vua Cá + Nem chua rán đầu)");
  console.log("  http://localhost:3001/nghi  (SOJO + Mường Thanh đầu)");
}

main();
