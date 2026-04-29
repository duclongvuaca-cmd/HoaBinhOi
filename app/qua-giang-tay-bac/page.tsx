import type { Metadata } from "next";
import Link from "next/link";
import { getPoi } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Quá giang Tây Bắc — dừng chân Hoà Bình QL6 | Hoà Bình Ơi",
  description:
    "Hướng dẫn dừng chân Hoà Bình khi đi Mộc Châu, Mai Châu, Sơn La, Điện Biên. Cây xăng, WC sạch, quán ăn tin cậy, khách sạn nghỉ qua đêm.",
};

const HERO = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Nh%C3%A0_m%C3%A1y_Th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg/1920px-Nh%C3%A0_m%C3%A1y_Th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg";

export default async function QuaGiangTayBac() {
  const slugs = [
    "thuy-dien-hoa-binh", "vua-ca-long-phuong", "long-ho-hoa-binh",
    "serena-resort-kim-boi", "avana-retreat", "mai-chau-ecolodge",
    "homestay-nha-san-mai-chau", "khach-san-hoa-binh-2",
    "cam-cao-phong", "mat-ong-lac-son", "ruou-can", "tho-cam-thai"
  ];
  const pois = Object.fromEntries(
    (await Promise.all(slugs.map(async (s) => [s, await getPoi(s)] as const))).filter(([, p]) => !!p)
  );

  return (
    <main className="bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden text-white">
        <img src={HERO} alt="Cửa ngõ Tây Bắc" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/85 to-sun-700/50" />
        <div className="relative max-w-5xl mx-auto px-6 py-20">
          <p className="text-sm uppercase tracking-widest text-sun-200 mb-3">Trụ cột 3/3</p>
          <h1 className="font-display text-5xl md:text-6xl mb-3 drop-shadow-lg">Quá giang Tây Bắc</h1>
          <p className="text-xl text-brand-50 max-w-2xl">
            Đi Mộc Châu / Mai Châu / Sơn La / Điện Biên?<br />
            <b>Dừng Hoà Bình 2-5h là tối ưu.</b>
          </p>
        </div>
      </section>

      {/* Route diagram */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl text-center mb-8 text-brand-900">Bạn đang đi đâu?</h2>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-sm">
            <RouteNode emoji="🏙️" label="HN" sub="" />
            <Arrow km="73km" time="1h30" />
            <RouteNode emoji="⭐" label="HB" sub="bạn dừng đây" highlight />
            <Arrow km="60km" time="1h30" />
            <RouteNode emoji="🌾" label="Mai Châu" sub="" />
            <Arrow km="60km" time="1h30" />
            <RouteNode emoji="⛰️" label="Mộc Châu" sub="" />
            <Arrow km="80km" time="2h" />
            <RouteNode emoji="🏔️" label="Sơn La" sub="" />
            <Arrow km="160km" time="4h" />
            <RouteNode emoji="🪖" label="Điện Biên" sub="" />
          </div>
        </div>
      </section>

      {/* 4 combo cards */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl text-center mb-2 text-brand-900">Combo dừng chân</h2>
          <p className="text-center text-slate-600 mb-10">Chọn theo thời gian anh có</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ComboCard
              icon="🍽️" duration="1.5h" title="Chỉ ăn trưa" tone="bg-sun-500"
              steps={["Dừng Vua Cá Long Phượng (QL6)", "Cá lăng / lẩu cá ngạnh ~250k/ng", "Tiếp QL6"]}
              cost="~250k/người" cta="tour-long-ho-1-ngay"
            />
            <ComboCard
              icon="🏗️" duration="3h" title="Ăn + đập thuỷ điện" tone="bg-brand-600"
              steps={["11:30 trưa Vua Cá", "13:00 đập thuỷ điện (free)", "14:00 tiếp QL6"]}
              cost="~300k/người" cta="dap-thuy-dien-nua-ngay"
            />
            <ComboCard
              icon="🛥️" duration="5h" title="Ăn + đập + lòng hồ ngắn" tone="bg-brand-700"
              steps={["10:30 đập (xe điện 50k)", "12:00 trưa Vua Cá", "13:30 cảng Bích Hạ → Đảo Dừa cá nướng", "16:00 tiếp QL6"]}
              cost="~600k/người" cta="tour-long-ho-1-ngay"
            />
            <ComboCard
              icon="🏨" duration="Qua đêm" title="Ngủ HB lượt sau" tone="bg-slate-700"
              steps={["Thứ 7: HN → HB chiều", "Ngủ Serena Kim Bôi (suối khoáng)", "CN: day-trip Mai Châu", "Chiều CN về HN"]}
              cost="~2-3.5tr/người" cta="hn-mai-chau-ngu-hb"
            />
          </div>
        </div>
      </section>

      {/* Hotel cards */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl text-center mb-2 text-brand-900">Khách sạn nghỉ qua đêm tại HB</h2>
          <p className="text-center text-slate-600 mb-8">5 lựa chọn theo ngân sách</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <HotelCard poi={pois["serena-resort-kim-boi"]} tag="Cao cấp" price="1.5-3tr/đêm" />
            <HotelCard poi={pois["avana-retreat"]} tag="Boutique" price="3-5tr/đêm" />
            <HotelCard poi={pois["mai-chau-ecolodge"]} tag="Eco" price="1.5-2.5tr/đêm" />
            <HotelCard poi={pois["khach-san-hoa-binh-2"]} tag="Trung tâm" price="500-800k/đêm" />
            <HotelCard poi={pois["homestay-nha-san-mai-chau"]} tag="Bản địa" price="150-300k/đêm" />
          </div>
        </div>
      </section>

      {/* Driving tips icons */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl text-center mb-8 text-brand-900">Mẹo lái xe QL6</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TipIcon emoji="⏰" title="Tránh chiều CN" desc="14-19h tắc nặng về HN. Đi sớm trước 12h." />
            <TipIcon emoji="🌫️" title="Đèo Thung Khe" desc="Trước Mai Châu 30km. Sương mù sáng sớm." />
            <TipIcon emoji="📷" title="Đèo Tam Đảo" desc="Sau Mai Châu. Quanh co + camera tốc độ." />
            <TipIcon emoji="⛽" title="Cây xăng cuối" desc="Cao Phong (Petrolimex). Sau đó tới TP Sơn La mới có." />
          </div>
        </div>
      </section>

      {/* Đặc sản mua về */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl text-center mb-8 text-brand-900">Đặc sản mua về</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SpecialtyCard poi={pois["cam-cao-phong"]} season="Mùa 11-1" priceRange="25-40k/kg" />
            <SpecialtyCard poi={pois["mat-ong-lac-son"]} season="Quanh năm" priceRange="200-300k/lít" />
            <SpecialtyCard poi={pois["ruou-can"]} season="Quanh năm" priceRange="200-400k/bình" />
            <SpecialtyCard poi={pois["tho-cam-thai"]} season="Quanh năm" priceRange="100-500k/khăn" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gradient-to-br from-brand-700 to-brand-500 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl mb-3">Hành trình quá giang gợi ý</h2>
          <p className="mb-6 text-brand-100">Nhấn để xem chi tiết lịch trình từng giờ</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/hanh-trinh/dung-chan-ql6-tay-bac" className="bg-white/20 hover:bg-white/30 backdrop-blur border border-white/30 px-5 py-3 rounded-lg font-medium">
              🛣️ Stopover 3-5h
            </Link>
            <Link href="/hanh-trinh/hn-moc-chau-2n1d-dung-hb" className="bg-sun-500 hover:bg-sun-600 px-5 py-3 rounded-lg font-medium">
              ⛰️ HN → Mộc Châu 2N1Đ
            </Link>
            <Link href="/hanh-trinh/hn-mai-chau-ngu-hb" className="bg-brand-800 hover:bg-brand-900 px-5 py-3 rounded-lg font-medium">
              🏞️ HN → Mai Châu, ngủ HB
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function RouteNode({ emoji, label, sub, highlight }: { emoji: string; label: string; sub: string; highlight?: boolean }) {
  return (
    <div className={`text-center ${highlight ? "scale-110" : ""}`}>
      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl ${highlight ? "bg-sun-400 ring-4 ring-sun-200" : "bg-white border-2 border-slate-200"}`}>
        {emoji}
      </div>
      <div className={`mt-1 font-medium ${highlight ? "text-brand-700" : "text-slate-700"}`}>{label}</div>
      {sub && <div className="text-xs text-sun-700">{sub}</div>}
    </div>
  );
}

function Arrow({ km, time }: { km: string; time: string }) {
  return (
    <div className="flex flex-col items-center text-xs text-slate-500 px-1">
      <div className="font-mono">{km}</div>
      <div className="text-brand-400 text-2xl leading-none">→</div>
      <div className="font-mono">{time}</div>
    </div>
  );
}

function ComboCard({ icon, duration, title, tone, steps, cost, cta }: any) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition">
      <div className={`${tone} text-white px-5 py-4 flex items-center justify-between`}>
        <div>
          <div className="text-3xl">{icon}</div>
          <div className="font-display text-xl mt-1">{title}</div>
        </div>
        <div className="text-right">
          <div className="text-xs opacity-80">Thời gian</div>
          <div className="font-display text-2xl">{duration}</div>
        </div>
      </div>
      <div className="p-5 space-y-2">
        {steps.map((s: string, i: number) => (
          <div key={i} className="flex gap-2 text-sm">
            <span className="text-brand-500 font-bold">{i + 1}.</span>
            <span className="text-slate-700">{s}</span>
          </div>
        ))}
        <div className="pt-3 border-t border-slate-100 flex justify-between text-sm">
          <span className="text-slate-500">Chi phí</span>
          <span className="font-medium text-sun-700">{cost}</span>
        </div>
        <Link href={`/hanh-trinh/${cta}`} className="block text-center mt-2 text-brand-600 hover:underline text-sm font-medium">
          Xem hành trình chi tiết →
        </Link>
      </div>
    </div>
  );
}

function HotelCard({ poi, tag, price }: { poi: any; tag: string; price: string }) {
  if (!poi) return null;
  const img = poi.images?.[0];
  return (
    <Link href={`/poi/${poi.slug}`} className="block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition group">
      <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
        {img && <img src={img} alt={poi.name} className="w-full h-full object-cover group-hover:scale-105 transition" />}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display text-lg leading-tight group-hover:text-brand-600 transition">{poi.name}</h3>
          <span className="text-xs bg-brand-100 text-brand-800 px-2 py-0.5 rounded shrink-0">{tag}</span>
        </div>
        <div className="text-sm text-sun-700 font-medium">{price}</div>
      </div>
    </Link>
  );
}

function TipIcon({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="text-center">
      <div className="text-5xl mb-2">{emoji}</div>
      <div className="font-display text-lg text-brand-900 mb-1">{title}</div>
      <div className="text-sm text-slate-600">{desc}</div>
    </div>
  );
}

function SpecialtyCard({ poi, season, priceRange }: { poi: any; season: string; priceRange: string }) {
  if (!poi) return null;
  const img = poi.images?.[0];
  return (
    <Link href={`/poi/${poi.slug}`} className="block bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition group">
      <div className="aspect-square bg-slate-100 overflow-hidden">
        {img && <img src={img} alt={poi.name} className="w-full h-full object-cover group-hover:scale-105 transition" />}
      </div>
      <div className="p-3">
        <div className="font-medium text-sm group-hover:text-brand-600 truncate">{poi.name}</div>
        <div className="text-xs text-slate-500 mt-0.5">{season}</div>
        <div className="text-xs text-sun-700 font-medium mt-0.5">{priceRange}</div>
      </div>
    </Link>
  );
}
