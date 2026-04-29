import Link from "next/link";

const CATEGORIES = [
  { slug: "an", emoji: "🍲", title: "Ăn gì", count: 8, desc: "Cá lăng, cơm lam, lợn mán, bí quyết quán nào ngon" },
  { slug: "mua", emoji: "🛍️", title: "Mua gì", count: 5, desc: "Cam Cao Phong, mật ong Lạc Sơn, rượu cần thật" },
  { slug: "nghi", emoji: "🛏️", title: "Nghỉ ở đâu", count: 5, desc: "Khách sạn, homestay, resort theo ngân sách" },
  { slug: "choi", emoji: "🎯", title: "Trải nghiệm", count: 4, desc: "Pickleball, chèo SUP, đạp xe, xông hơi" },
  { slug: "diem-den", emoji: "🏞️", title: "Điểm đến", count: 5, desc: "Thuỷ điện, Thác Bờ, hang Hoa Tiên, Kim Bôi" },
  { slug: "su-kien", emoji: "🎉", title: "Sự kiện", count: 3, desc: "Lễ hội cồng chiêng, chợ phiên, đua thuyền" }
];

export function POIGrid() {
  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-sm uppercase tracking-widest text-brand-600 mb-2">Khám phá</p>
          <h2 className="font-display text-4xl md:text-5xl mb-4">30+ điểm đến đã được chọn lọc</h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            Không phải danh sách dài như Google Maps. Đây là điểm tốt nhất, có review thật,
            kèm bí quyết từ người bản địa.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="group block bg-white p-6 rounded-xl border border-slate-200 hover:border-brand-400 hover:shadow-lg transition"
            >
              <div className="text-4xl mb-3">{c.emoji}</div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-2xl group-hover:text-brand-600 transition">
                  {c.title}
                </h3>
                <span className="bg-brand-100 text-brand-700 text-xs font-semibold px-2 py-1 rounded">
                  {c.count} điểm
                </span>
              </div>
              <p className="text-sm text-slate-600">{c.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
