/**
 * Thêm POI bổ sung: Lòng hồ Hoà Bình + verify Đập thuỷ điện
 * Chạy: npm run add-pois-extra
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Missing env"); process.exit(1); }
const sb = createClient(url, key, { auth: { persistSession: false } });

const POIS = [
  {
    slug: "long-ho-hoa-binh",
    name: "Lòng hồ Hoà Bình",
    category: "diem-den",
    lat: 20.7833,
    lng: 105.3167,
    address: "Sông Đà, tỉnh Phú Thọ (Hoà Bình cũ)",
    description: "Hồ thuỷ điện nhân tạo lớn nhất Đông Nam Á (208 km²), kéo dài qua 5 huyện. Cảnh quan núi đá vôi 2 bên bờ tựa Hạ Long, hơn 47 đảo lớn nhỏ. Đi tàu / chèo SUP / câu cá lăng tươi sống.",
    insider_tip: "Đi tàu xuất phát từ cảng Bích Hạ buổi sáng sớm 7-8h, mặt hồ phẳng lặng nhất, ánh sáng đẹp chụp ảnh. Tour 1 ngày tới Thác Bờ + Đền Bà Chúa Thác Bờ + đảo Dừa khoảng 250-400k/người. Mang áo phao của tàu, không thuê riêng (đắt).",
    price_range: "150k-500k/người (tour ngắn)",
    tags: ["long-ho", "song-da", "thuyen", "canh-quan", "halong-mien-bac"],
    images: [],
    status: "published"
  },
  {
    slug: "dao-dua-long-ho",
    name: "Đảo Dừa lòng hồ",
    category: "diem-den",
    lat: 20.7500,
    lng: 105.2833,
    address: "Lòng hồ Hoà Bình",
    description: "Đảo nhỏ giữa lòng hồ với rừng dừa và bãi cát nhỏ. Stop point chính của các tour tàu hồ Hoà Bình — chụp ảnh, tắm nhẹ, thưởng thức cá nướng tại nhà bè.",
    insider_tip: "Combo trong tour tàu, không tự đi được. Có quán nhà bè ăn cá lăng/cá ngạnh nướng giá 250-400k/kg — gọi trước khi tàu cập bờ để đợi không lâu.",
    price_range: "Trong tour 250-400k",
    tags: ["dao", "long-ho", "ca-nuong", "nha-be"],
    images: [],
    status: "published"
  },
  {
    slug: "den-ba-chua-thac-bo",
    name: "Đền Bà Chúa Thác Bờ",
    category: "diem-den",
    lat: 20.7167,
    lng: 105.2500,
    address: "Lòng hồ Hoà Bình",
    description: "Đền cổ thờ 2 vị nữ thần đã giúp vua Lê Lợi vượt thác sông Đà — di tích lịch sử + tâm linh. Đền chia 2 phần (đền Trình + đền Chính), nằm trên đảo nhỏ giữa lòng hồ.",
    insider_tip: "Đi cùng tour Thác Bờ. Lễ hội chính tháng Giêng âm lịch — đông nhất, không nên đi nếu không thích chen chúc. Ngày thường rất yên tĩnh. Mặc lịch sự khi vào đền.",
    price_range: "Vào cửa miễn phí",
    tags: ["den", "tam-linh", "di-tich", "thac-bo"],
    images: [],
    status: "published"
  }
];

async function upsert(poi: any) {
  const { error } = await sb.from("pois").upsert(poi, { onConflict: "slug" });
  if (error) console.error(`✗ ${poi.slug}: ${error.message}`);
  else console.log(`✓ ${poi.slug}`);
}

async function main() {
  console.log(`Upserting ${POIS.length} POIs...`);
  for (const poi of POIS) await upsert(poi);

  console.log("\n--- Verify existing POIs ---");
  const { data: thuydien } = await sb.from("pois").select("name, description").eq("slug", "thuy-dien-hoa-binh").maybeSingle();
  if (thuydien) console.log(`✓ thuy-dien-hoa-binh exists: ${thuydien.name}`);
  else console.log(`✗ thuy-dien-hoa-binh MISSING — kiểm tra seed`);
}

main();
