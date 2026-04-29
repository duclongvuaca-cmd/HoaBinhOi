export const revalidate = 60;

import Link from "next/link";
import { getItineraries, getPoi } from "@/lib/data";

export const metadata = { title: "Hành trình chọn sẵn — Hoà Bình Ơi" };

const PILLAR_BG_LONGHO = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Nh%C3%A0_m%C3%A1y_Th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg/1280px-Nh%C3%A0_m%C3%A1y_Th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg";
const PILLAR_BG_DAP = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/H%E1%BA%A7m_%C4%91%C6%B0%E1%BB%9Dng_b%E1%BB%99_nh%C3%A0_m%C3%A1y_th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg/1280px-H%E1%BA%A7m_%C4%91%C6%B0%E1%BB%9Dng_b%E1%BB%99_nh%C3%A0_m%C3%A1y_th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg";

async function firstImage(it: any): Promise<string | null> {
  for (const stop of it.stops || []) {
    const poi = await getPoi(stop.poi_slug);
    if (poi?.images?.[0]) return poi.images[0];
  }
  return null;
}

export default async function ItinerariesPage() {
  const items = await getItineraries();
  const itemsWithImg = await Promise.all(
    items.map(async (it: any) => ({ ...it, coverImage: await firstImage(it) }))
  );

  return (
    <main>
      <section className="bg-gradient-to-br from-brand-700 to-brand-500 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-5xl mb-3">Hành trình chọn sẵn</h1>
          <p className="text-xl text-brand-100 max-w-2xl">
            Lịch trình curated theo từng kiểu khách. Bản đồ, lịch giờ, giá ước tính.
          </p>
        </div>
      </section>

      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl mb-4 text-brand-900">Khám phá theo trụ cột</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/cam-nang/long-ho" className="group relative h-48 rounded-2xl overflow-hidden text-white">
              <img src={PILLAR_BG_LONGHO} alt="Lòng hồ Hoà Bình" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <div className="text-3xl mb-1">🛥️</div>
                <h3 className="font-display text-2xl">Lòng hồ Hoà Bình</h3>
                <p className="text-sm text-brand-100">208km² · Hạ Long miền núi · tour 1 ngày</p>
              </div>
            </Link>
            <Link href="/cam-nang/dap-thuy-dien" className="group relative h-48 rounded-2xl overflow-hidden text-white">
              <img src={PILLAR_BG_DAP} alt="Đập thuỷ điện Hoà Bình" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <div className="text-3xl mb-1">🏗️</div>
                <h3 className="font-display text-2xl">Đập thuỷ điện</h3>
                <p className="text-sm text-brand-100">Công trình thế kỷ XX · 1920MW · vào cửa miễn phí</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl mb-4 text-brand-900">Tất cả hành trình ({items.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itemsWithImg.map((it: any) => (
              <Link
                key={it.slug}
                href={`/hanh-trinh/${it.slug}`}
                className="group block bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-brand-400 hover:shadow-xl transition"
              >
                <div className="relative h-44 overflow-hidden">
                  {it.coverImage ? (
                    <img
                      src={it.coverImage}
                      alt={it.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${it.hero_color}`} />
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-t ${it.hero_color} opacity-30 mix-blend-multiply`} />
                  <div className="absolute top-3 right-3 flex gap-1">
                    <span className="bg-white/90 backdrop-blur text-slate-800 text-xs px-2 py-1 rounded">
                      {it.duration}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white drop-shadow">
                    <div className="font-display text-xl leading-tight">{it.title}</div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-slate-500 mb-3">{it.persona}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-600 mb-3">
                    <span className="bg-sun-100 text-sun-800 px-2 py-1 rounded">
                      {(it.budget_low / 1000).toFixed(0)}k - {(it.budget_high / 1000).toFixed(0)}k/người
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 line-clamp-2">{it.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
