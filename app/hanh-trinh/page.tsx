export const revalidate = 60;

import Link from "next/link";
import { getItineraries } from "@/lib/data";

export const metadata = { title: "Hành trình chọn sẵn — Hoà Bình Ơi" };

export default async function ItinerariesPage() {
  const items = await getItineraries();
  return (
    <main>
      <section className="bg-gradient-to-br from-brand-700 to-brand-500 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-5xl mb-3">Hành trình chọn sẵn</h1>
          <p className="text-xl text-brand-100 max-w-2xl">
            5 hành trình curated theo từng kiểu khách. Lịch trình chi tiết, map, giá ước tính.
          </p>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it) => (
            <Link
              key={it.slug}
              href={`/hanh-trinh/${it.slug}`}
              className="group block bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-brand-400 hover:shadow-xl transition"
            >
              <div className={`h-32 bg-gradient-to-br ${it.hero_color}`} />
              <div className="p-5">
                <h3 className="font-display text-xl mb-1 group-hover:text-brand-600 transition">
                  {it.title}
                </h3>
                <p className="text-sm text-slate-500 mb-3">{it.persona}</p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-600 mb-3">
                  <span className="bg-slate-100 px-2 py-1 rounded">{it.duration}</span>
                  <span className="bg-sun-100 text-sun-800 px-2 py-1 rounded">
                    {(it.budget_low / 1000).toFixed(0)}k - {(it.budget_high / 1000).toFixed(0)}k/người
                  </span>
                </div>
                <p className="text-sm text-slate-700 line-clamp-2">{it.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
