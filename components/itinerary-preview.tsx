import Link from "next/link";

const ITINERARIES = [
  {
    slug: "cuoi-tuan-lang-man",
    title: "Cuối tuần lãng mạn 2N1Đ",
    persona: "Cặp đôi 25-35 tuổi",
    duration: "2 ngày 1 đêm",
    budget: "1.8 - 2.5tr/người",
    highlights: ["Ăn cá lăng sông Đà", "Du thuyền hồ HB", "Suối khoáng Kim Bôi"],
    color: "from-brand-500 to-brand-700"
  },
  {
    slug: "gia-dinh-2-ngay",
    title: "Gia đình 2 ngày",
    persona: "Có trẻ em + ông bà",
    duration: "2 ngày 1 đêm",
    budget: "1.2 - 1.8tr/người",
    highlights: ["Thuỷ điện HB", "Bản Lác Mai Châu", "Cơm lam + lợn mán"],
    color: "from-sun-500 to-sun-700"
  },
  {
    slug: "active-foodie",
    title: "Active Foodie 1 ngày",
    persona: "Active 25-40t",
    duration: "1 ngày",
    budget: "500 - 800k/người",
    highlights: ["Pickleball sáng", "Foodie tour chiều", "Cá sông Đà tối"],
    color: "from-brand-600 to-sun-500"
  },
  {
    slug: "trekking-relax",
    title: "Trekking + Relax 2N1Đ",
    persona: "Bạn bè 25-35t",
    duration: "2 ngày 1 đêm",
    budget: "1.5 - 2tr/người",
    highlights: ["Trekking Mai Châu", "Đạp xe bản Lác", "Suối khoáng"],
    color: "from-brand-700 to-brand-500"
  },
  {
    slug: "ngan-sach-thap",
    title: "Ngân sách thấp 1 ngày",
    persona: "Sinh viên / nhóm bạn",
    duration: "1 ngày",
    budget: "<500k/người",
    highlights: ["Đi xe máy", "Ăn quán địa phương", "Hồ HB ngắm hoàng hôn"],
    color: "from-slate-500 to-slate-700"
  }
];

export function ItineraryPreview() {
  return (
    <section id="hanh-trinh" className="py-20 px-6 max-w-6xl mx-auto">
      <div className="mb-12">
        <p className="text-sm uppercase tracking-widest text-brand-600 mb-2">
          Hành trình chọn sẵn
        </p>
        <h2 className="font-display text-4xl md:text-5xl mb-4">
          Đi đâu, ăn gì, không cần nghĩ
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl">
          5 hành trình curated theo từng kiểu khách. Mỗi hành trình đã có lịch trình theo giờ,
          map, giá ước tính, link đặt chỗ. Mở app, làm theo, hết.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ITINERARIES.map((it) => (
          <Link
            key={it.slug}
            href={`/hanh-trinh/${it.slug}`}
            className="group block rounded-xl overflow-hidden border border-slate-200 hover:border-brand-400 hover:shadow-xl transition"
          >
            <div className={`h-32 bg-gradient-to-br ${it.color}`} />
            <div className="p-5">
              <h3 className="font-display text-xl mb-1 group-hover:text-brand-600 transition">
                {it.title}
              </h3>
              <p className="text-sm text-slate-500 mb-3">{it.persona}</p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-600 mb-3">
                <span className="bg-slate-100 px-2 py-1 rounded">{it.duration}</span>
                <span className="bg-sun-100 text-sun-800 px-2 py-1 rounded">{it.budget}</span>
              </div>
              <ul className="text-sm text-slate-700 space-y-1">
                {it.highlights.map((h) => (
                  <li key={h} className="flex items-start">
                    <span className="text-brand-500 mr-2">•</span>{h}
                  </li>
                ))}
              </ul>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
