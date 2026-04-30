/**
 * Batch 2 — thêm nhà hàng + ăn vặt + khách sạn TP. Hoà Bình
 * Chạy: npm run add-pois-batch2
 *
 * STATUS: published (anh chọn ship công khai luôn).
 * Note: lat/lng đặt approximate quanh TP. Hoà Bình center (20.81-20.85, 105.32-105.35).
 * Sau khi seed, vào /admin paste GG Maps URL từng POI để ingest-gmaps override toạ độ + place_id thật.
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Missing env"); process.exit(1); }
const sb = createClient(url, key, { auth: { persistSession: false } });

const POIS = [
  // ===== 8 NHÀ HÀNG =====
  {
    slug: "nha-hang-muong-dong",
    name: "Nhà hàng Mường Động",
    category: "an",
    lat: 20.8350, lng: 105.3380,
    address: "TP. Hoà Bình",
    description: "Nhà hàng đặc sản Mường quy mô lớn, không gian nhà sàn truyền thống. Lợn mán, gà đồi, cơm lam, xôi nếp nương, măng đắng nướng. Phục vụ đoàn 50-200 người.",
    insider_tip: "Đặt set 6-8 món cho đoàn — phù hợp công ty/team building. Cuối tuần cần đặt trước 1-2 ngày. Có chương trình múa cồng chiêng buổi tối khi đoàn yêu cầu.",
    price_range: "200k-400k/người",
    tags: ["dac-san-muong", "doan-cong-ty", "nha-san"],
    images: [],
    status: "published"
  },
  {
    slug: "ca-lang-song-da-99",
    name: "Cá lăng Sông Đà 99",
    category: "an",
    lat: 20.8205, lng: 105.3290,
    address: "Gần đập thuỷ điện, TP. Hoà Bình",
    description: "Chuyên cá lăng, cá ngạnh, cá chiên sông Đà — bắt trực tiếp từ lồng bè trên sông. Lẩu cá măng chua, cá nướng, cá kho riềng. Vị trí gần đập thuỷ điện, tiện kết hợp tham quan.",
    insider_tip: "Gọi cá lăng nướng giấy bạc + lẩu măng chua đầu cá ngạnh. Nên đi 4 người trở lên để gọi nguyên con cá 2-3kg. Đặt sớm cá tươi nhất buổi sáng.",
    price_range: "300k-600k/người",
    tags: ["ca-song-da", "lau", "gan-dap"],
    images: [],
    status: "published"
  },
  {
    slug: "nha-hang-la-co",
    name: "Nhà hàng Lá Cọ",
    category: "an",
    lat: 20.8410, lng: 105.3420,
    address: "TP. Hoà Bình",
    description: "Nhà hàng nhà sàn lớn với menu đa dạng — đặc sản Mường, hải sản, BBQ. Phù hợp tiệc cưới, sinh nhật, đoàn lớn.",
    insider_tip: "Combo BBQ ngoài sân vào tối cuối tuần. Phòng VIP riêng cho 10-20 người. Hỏi trước về phụ thu phục vụ đoàn lớn.",
    price_range: "180k-350k/người",
    tags: ["nha-san", "bbq", "tiec"],
    images: [],
    status: "published"
  },
  {
    slug: "quan-de-tai",
    name: "Quán Dê Tài",
    category: "an",
    lat: 20.8270, lng: 105.3360,
    address: "TP. Hoà Bình",
    description: "Đặc sản dê núi — dê tái chanh, dê hấp, dê nướng, lẩu dê. Dê chạy đồi vùng Lương Sơn, thịt chắc, không hôi.",
    insider_tip: "Dê tái chanh là signature — gọi cùng lá mơ, riềng tươi. Lẩu dê thuốc bắc thích hợp mùa lạnh. Cuối tuần đông, đặt trước.",
    price_range: "200k-400k/người",
    tags: ["de-nui", "lau", "dac-san"],
    images: [],
    status: "published"
  },
  {
    slug: "com-lam-bich-cau",
    name: "Cơm lam Bích Câu",
    category: "an",
    lat: 20.8390, lng: 105.3310,
    address: "TP. Hoà Bình",
    description: "Quán đặc sản cơm lam nướng ống tre, ăn kèm muối vừng, gà đồi nướng, lợn mán. Mộc, đậm chất bản Mường.",
    insider_tip: "Ăn cơm lam phải kèm muối vừng đen + thịt gà đồi nướng than hoa. Ăn nóng ngay khi nướng xong, để nguội mất ngon. Quán nhỏ, tự nhiên, phù hợp 2-6 người.",
    price_range: "120k-250k/người",
    tags: ["com-lam", "binh-dan", "muong"],
    images: [],
    status: "published"
  },
  {
    slug: "nha-hang-song-da",
    name: "Nhà hàng Sông Đà",
    category: "an",
    lat: 20.8195, lng: 105.3325,
    address: "Đường ven sông Đà, TP. Hoà Bình",
    description: "View trực tiếp sông Đà, chuyên hải sản nước ngọt — cá tầm, cá chiên, cá lăng. Không gian thoáng, thích hợp ngắm hoàng hôn trên sông.",
    insider_tip: "Đặt bàn ngoài hiên hướng sông trước 17h để ngắm hoàng hôn. Cá tầm hấp gừng + lẩu cá lăng là 2 món signature. Có sân đỗ xe rộng cho đoàn.",
    price_range: "300k-500k/người",
    tags: ["view-song", "ca-tam", "ngam-canh"],
    images: [],
    status: "published"
  },
  {
    slug: "vit-co-lung",
    name: "Vịt cổ lũng Lương Sơn",
    category: "an",
    lat: 20.8330, lng: 105.3450,
    address: "TP. Hoà Bình",
    description: "Đặc sản vịt cổ lũng — giống vịt bản địa cổ ngắn, thịt dày, da mỏng. Vịt nướng riềng mẻ, vịt om sấu, tiết canh vịt.",
    insider_tip: "Gọi vịt nướng riềng mẻ + bún ăn kèm — combo dân dã đặc trưng. Nửa con vịt khoảng 250-300k, đủ 2-3 người ăn no.",
    price_range: "150k-300k/người",
    tags: ["vit", "dac-san", "binh-dan"],
    images: [],
    status: "published"
  },
  {
    slug: "nha-hang-huong-que",
    name: "Nhà hàng Hương Quê",
    category: "an",
    lat: 20.8420, lng: 105.3380,
    address: "TP. Hoà Bình",
    description: "Menu Việt truyền thống pha trộn đặc sản Hoà Bình. Cá kho tộ, gà nướng, canh chua cá sông, rau rừng theo mùa.",
    insider_tip: "Quán có rau rừng theo mùa — hỏi nhân viên hôm đó có gì tươi. Set ăn gia đình 4-6 người 800k-1.2tr là combo hợp lý nhất.",
    price_range: "150k-300k/người",
    tags: ["gia-dinh", "rau-rung", "binh-dan"],
    images: [],
    status: "published"
  },

  // ===== 5 ĂN VẶT =====
  {
    slug: "pho-vinh-cu-chinh-lan",
    name: "Phở Vinh Cù Chính Lan",
    category: "an",
    lat: 20.8390, lng: 105.3360,
    address: "Phố Cù Chính Lan, TP. Hoà Bình",
    description: "Quán phở bò lâu năm trên phố Cù Chính Lan, được dân địa phương nhắc nhiều. Nước dùng đậm, bánh phở mỏng, thịt thái mỏng tươi.",
    insider_tip: "Đi sáng 6h-8h là đông nhất, nước dùng đậm nhất. Phở tái nạm gầu là gọi nhiều nhất. Quán nhỏ, có thể phải đợi bàn cuối tuần.",
    price_range: "40k-60k/bát",
    tags: ["an-vat", "pho", "sang", "binh-dan"],
    images: [],
    status: "published"
  },
  {
    slug: "banh-cuon-phuong-lam",
    name: "Bánh cuốn nóng chợ Phương Lâm",
    category: "an",
    lat: 20.8400, lng: 105.3340,
    address: "Chợ Phương Lâm, TP. Hoà Bình",
    description: "Bánh cuốn nóng tráng tay, nhân thịt mộc nhĩ, ăn kèm chả quế và nước mắm chấm pha tỉ mỉ. Chỉ bán sáng.",
    insider_tip: "Bán từ 6h sáng, hết khoảng 10h. Cuối tuần đông phải đợi 10-15 phút. Gọi thêm chả quế nóng + cốc nước chè xanh là chuẩn vị Hoà Bình.",
    price_range: "25k-40k/đĩa",
    tags: ["an-vat", "banh-cuon", "sang", "cho-phuong-lam"],
    images: [],
    status: "published"
  },
  {
    slug: "che-phuong-lam",
    name: "Chè Phương Lâm",
    category: "an",
    lat: 20.8395, lng: 105.3345,
    address: "Khu chợ Phương Lâm, TP. Hoà Bình",
    description: "Quán chè truyền thống — chè thái, chè bưởi, chè đậu xanh, sữa chua nếp cẩm. Mở từ chiều đến tối, là điểm tụ tập của giới trẻ địa phương.",
    insider_tip: "Sữa chua nếp cẩm + thạch là combo bán chạy. Mùa hè gọi chè thái đá nhiều. Buổi tối đông, nhất là tối thứ 6-7.",
    price_range: "15k-30k/cốc",
    tags: ["an-vat", "che", "sua-chua", "tre"],
    images: [],
    status: "published"
  },
  {
    slug: "oc-hang-toi",
    name: "Ốc nóng Hằng",
    category: "an",
    lat: 20.8370, lng: 105.3370,
    address: "TP. Hoà Bình (mở tối)",
    description: "Quán ăn vặt buổi tối nổi tiếng — ốc luộc, ốc xào me, ngao hấp, hến xào. Không gian vỉa hè, đông khách sau 19h.",
    insider_tip: "Mở từ 17h đến 23h. Ốc xào me + ngao hấp sả là 2 món gọi nhiều. Đi 2-4 người gọi đủ vài đĩa, bia hơi địa phương kèm.",
    price_range: "50k-150k/người",
    tags: ["an-vat", "oc", "toi", "via-he"],
    images: [],
    status: "published"
  },
  {
    slug: "banh-mi-pate-cu-chinh-lan",
    name: "Bánh mì pate phố Cù Chính Lan",
    category: "an",
    lat: 20.8385, lng: 105.3365,
    address: "Phố Cù Chính Lan, TP. Hoà Bình",
    description: "Xe bánh mì pate buổi sáng-trưa, pate tự làm, ruốc, dưa chuột, rau thơm. Vỏ bánh mì giòn, được dân văn phòng ăn sáng nhiều.",
    insider_tip: "Đi 6h30-8h là vừa nóng. Bánh mì thập cẩm + cốc cà phê bệt vỉa hè là combo sáng dân Hoà Bình. Hết khoảng 11h.",
    price_range: "20k-35k/ổ",
    tags: ["an-vat", "banh-mi", "sang", "via-he"],
    images: [],
    status: "published"
  },

  // ===== 8 KHÁCH SẠN + HOMESTAY =====
  {
    slug: "muong-thanh-hoa-binh",
    name: "Khách sạn Mường Thanh Hoà Bình",
    category: "nghi",
    lat: 20.8195, lng: 105.3290,
    address: "Đường ven sông Đà, TP. Hoà Bình",
    description: "Khách sạn 4 sao chuẩn quốc tế của tập đoàn Mường Thanh, view sông Đà và đập thuỷ điện. Bể bơi, gym, nhà hàng buffet sáng.",
    insider_tip: "Yêu cầu phòng tầng cao hướng sông để có view đập thuỷ điện. Buffet sáng đa dạng. Đặt qua agoda/booking thường rẻ hơn website 10-15%.",
    price_range: "1.2tr-2.5tr/đêm",
    tags: ["4-sao", "view-song", "be-boi", "muong-thanh"],
    images: [],
    status: "published"
  },
  {
    slug: "khach-san-hoa-binh-1",
    name: "Khách sạn Hoà Bình 1",
    category: "nghi",
    lat: 20.8390, lng: 105.3370,
    address: "TP. Hoà Bình",
    description: "Khách sạn 3 sao trung tâm TP. Hoà Bình, tiện đi chợ, ăn uống. Phòng cơ bản sạch sẽ, đủ tiện nghi.",
    insider_tip: "Vị trí trung tâm — đi bộ ra chợ Phương Lâm 5 phút. Phù hợp khách công tác / đoàn ngắn ngày. Không có view đẹp nhưng tiện.",
    price_range: "500k-900k/đêm",
    tags: ["3-sao", "trung-tam", "cong-tac"],
    images: [],
    status: "published"
  },
  {
    slug: "khach-san-sao-mai",
    name: "Khách sạn Sao Mai",
    category: "nghi",
    lat: 20.8350, lng: 105.3400,
    address: "TP. Hoà Bình",
    description: "Khách sạn 3 sao, phòng rộng, có nhà hàng + phòng hội nghị. Phù hợp đoàn công ty, sự kiện nhỏ.",
    insider_tip: "Có sảnh hội nghị 50-100 chỗ — phù hợp meeting đoàn. Đặt trước 1 tuần khi vào mùa hội nghị (tháng 3-5, 9-11).",
    price_range: "600k-1tr/đêm",
    tags: ["3-sao", "hoi-nghi", "doan"],
    images: [],
    status: "published"
  },
  {
    slug: "pacific-hotel-hb",
    name: "Pacific Hotel Hoà Bình",
    category: "nghi",
    lat: 20.8410, lng: 105.3360,
    address: "TP. Hoà Bình",
    description: "Khách sạn 3 sao mới, thiết kế hiện đại, vị trí trung tâm. Phòng có ban công nhỏ, tiện nghi đủ.",
    insider_tip: "Phòng deluxe có ban công riêng. Tầng cao có thể nhìn xa thấy sông Đà. Wifi mạnh, phù hợp khách work-cation.",
    price_range: "650k-1.1tr/đêm",
    tags: ["3-sao", "trung-tam", "moi"],
    images: [],
    status: "published"
  },
  {
    slug: "song-da-hotel",
    name: "Sông Đà Hotel",
    category: "nghi",
    lat: 20.8210, lng: 105.3310,
    address: "Gần đập thuỷ điện, TP. Hoà Bình",
    description: "Khách sạn 3 sao gần đập thuỷ điện, view sông Đà. Truyền thống lâu năm phục vụ kỹ sư + khách công tác đập.",
    insider_tip: "Vị trí siêu tiện cho khách thăm đập thuỷ điện — đi bộ 10 phút tới điểm tham quan. Phòng cũ nhưng sạch, giá tốt.",
    price_range: "450k-800k/đêm",
    tags: ["3-sao", "gan-dap", "view-song"],
    images: [],
    status: "published"
  },
  {
    slug: "homestay-ven-ho",
    name: "Homestay Ven Hồ Hoà Bình",
    category: "nghi",
    lat: 20.7950, lng: 105.3100,
    address: "Bờ lòng hồ Hoà Bình",
    description: "Homestay nhà sàn ven lòng hồ, tự nấu cá lăng, ngắm bình minh trên hồ. Có thuyền nhỏ thuê đi câu, chèo SUP.",
    insider_tip: "Phù hợp 2-6 người muốn thoát khỏi phố. Đặt qua FB chủ nhà — không có trên booking.com. Cá lăng tự nấu rẻ hơn nhà hàng 30-40%.",
    price_range: "300k-600k/đêm",
    tags: ["homestay", "ven-ho", "nha-san", "yen-tinh"],
    images: [],
    status: "published"
  },
  {
    slug: "hilltop-homestay",
    name: "Hilltop View Homestay",
    category: "nghi",
    lat: 20.8450, lng: 105.3500,
    address: "Đồi cao TP. Hoà Bình",
    description: "Homestay trên đồi, view bao quát thành phố và sông Đà. Phòng kiểu bungalow, sân vườn, BBQ tối.",
    insider_tip: "Phù hợp couple / nhóm bạn 4-6 người. Yêu cầu BBQ tối phải báo trước 1 ngày. View đẹp nhất hoàng hôn từ sân.",
    price_range: "500k-900k/đêm",
    tags: ["homestay", "view-doi", "bungalow", "couple"],
    images: [],
    status: "published"
  },
  {
    slug: "luna-homestay",
    name: "Luna Homestay",
    category: "nghi",
    lat: 20.8360, lng: 105.3420,
    address: "TP. Hoà Bình",
    description: "Homestay nhỏ kiểu boutique, thiết kế ấm cúng, phù hợp couple hoặc gia đình 3-4 người. Sân vườn nhỏ, cà phê sáng miễn phí.",
    insider_tip: "Chỉ 4-5 phòng, đặt sớm cuối tuần. Chủ nhà nhiệt tình tư vấn lịch trình du lịch local. Có cà phê sáng miễn phí ngon.",
    price_range: "400k-700k/đêm",
    tags: ["homestay", "boutique", "couple", "gia-dinh"],
    images: [],
    status: "published"
  },

  // ===== 4 MUA THÊM (đặc sản + chợ) =====
  {
    slug: "cho-phuong-lam",
    name: "Chợ Phương Lâm",
    category: "mua",
    lat: 20.8395, lng: 105.3340,
    address: "Phường Phương Lâm, TP. Hoà Bình",
    description: "Chợ truyền thống lớn nhất TP. Hoà Bình — đặc sản Mường, rau rừng, cá sông Đà tươi, đồ khô, thổ cẩm. Sáng từ 5h.",
    insider_tip: "Đi sáng sớm 6-8h hàng tươi nhất. Khu cá sông ở phía sau chợ. Mặc cả 20-30% được, đặc biệt với khách lạ.",
    price_range: "Theo món",
    tags: ["cho", "dac-san", "ca-tuoi", "sang"],
    images: [],
    status: "published"
  },
  {
    slug: "thit-trau-gac-bep",
    name: "Thịt trâu gác bếp Mường",
    category: "mua",
    lat: 20.8350, lng: 105.3390,
    address: "Quầy đặc sản TP. Hoà Bình",
    description: "Thịt trâu gác bếp truyền thống Mường — ướp mắc khén, hạt dổi, treo gác bếp 2-3 tháng. Khô, dai, đậm vị, ăn kèm rượu cần.",
    insider_tip: "Mua trực tiếp tại nhà người Mường rẻ hơn quầy 30-40%. Hỏi rõ thịt trâu thật hay bò — trâu thật giá 800k-1.2tr/kg, bò chỉ 500-700k.",
    price_range: "800k-1.2tr/kg",
    tags: ["dac-san", "trau-gac-bep", "muong", "qua-tang"],
    images: [],
    status: "published"
  }
];

async function upsert(poi: any) {
  const { error } = await sb.from("pois").upsert(poi, { onConflict: "slug" });
  if (error) console.error(`✗ ${poi.slug}: ${error.message}`);
  else console.log(`✓ ${poi.slug} (${poi.category})`);
}

async function main() {
  console.log(`Upserting ${POIS.length} POIs (status=draft)...\n`);
  const byCat: Record<string, number> = {};
  for (const poi of POIS) {
    await upsert(poi);
    byCat[poi.category] = (byCat[poi.category] || 0) + 1;
  }
  console.log("\n--- Summary ---");
  for (const [cat, n] of Object.entries(byCat)) console.log(`  ${cat}: ${n}`);
  console.log("\nNext steps:");
  console.log("  1. Mở http://localhost:3001/an + /nghi để xem POI mới");
  console.log("  2. Vào /admin/poi → từng POI paste GG Maps URL → ingest-gmaps fix lat/lng thật");
  console.log("  3. Chạy `npm run fetch-gmaps-reviews` sau khi có place_id để lấy rating thật");
}

main();
