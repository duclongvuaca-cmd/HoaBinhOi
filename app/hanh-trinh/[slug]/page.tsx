import { notFound } from "next/navigation";
import Link from "next/link";
import { getItinerary, getPoi, getItineraries } from "@/lib/data";
import { ItineraryMap } from "@/components/itinerary-map";

export const revalidate = 60;

export async function generateStaticParams() {
  const items = await getItineraries();
  return items.map((it) => ({ slug: it.slug }));
}

export default async function ItineraryDetail({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const it = await getItinerary(slug);
  if (!it) notFound();

  const stops = await Promise.all(
    it.stops.map(async (s, i) => ({
      ...s,
      poi: await getPoi(s.poi_slug),
      day: groupByDay(it.stops, i)
    }))
  );

  // Group stops into days based on time order (when start_time decreases, new day)
  const days: typeof stops[] = [];
  let currentDay: typeof stops = [];
  let lastTime = "00:00";
  for (const s of stops) {
    if (s.start_time < lastTime && currentDay.length > 0) {
      days.push(currentDay);
      currentDay = [];
    }
    currentDay.push(s);
    lastTime = s.start_time;
  }
  if (currentDay.length > 0) days.push(currentDay);

  return (
    <main>
      <section className={`bg-gradient-to-br ${it.hero_color} text-white py-16 px-6`}>
        <div className="max-w-4xl mx-auto">
          <Link href="/hanh-trinh" className="text-sm text-white/80 hover:text-white">
            ← Hành trình
          </Link>
          <h1 className="font-display text-5xl mt-3 mb-3">{it.title}</h1>
          <p className="text-xl mb-4 opacity-90">{it.persona}</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-white/20 backdrop-blur px-3 py-1.5 rounded">⏱️ {it.duration}</span>
            <span className="bg-white/20 backdrop-blur px-3 py-1.5 rounded">
              💰 {(it.budget_low / 1000).toFixed(0)}k - {(it.budget_high / 1000).toFixed(0)}k/người
            </span>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 max-w-4xl mx-auto">
        <p className="text-lg text-slate-700 leading-relaxed mb-6">{it.description}</p>

        <ItineraryMap
          stops={stops.map((s) => ({
            poi: s.poi ? { lat: s.poi.lat, lng: s.poi.lng, name: s.poi.name, slug: s.poi.slug } : null,
            start_time: s.start_time
          }))}
        />

        <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 mb-8">
          <h3 className="font-display text-lg mb-3 text-brand-800">Highlight</h3>
          <ul className="space-y-1">
            {it.highlights.map((h) => (
              <li key={h} className="flex items-start text-slate-700">
                <span className="text-brand-500 mr-2">✓</span>{h}
              </li>
            ))}
          </ul>
        </div>

        {days.map((dayStops, dIdx) => (
          <div key={dIdx} className="mb-10">
            <h2 className="font-display text-3xl mb-6 text-brand-700">
              Ngày {dIdx + 1}
            </h2>
            <div className="space-y-4">
              {dayStops.map((s, sIdx) => (
                <div key={sIdx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-16 text-center">
                      <div className="font-mono font-semibold text-brand-700">{s.start_time}</div>
                      {s.end_time && <div className="text-xs text-slate-400">{s.end_time}</div>}
                    </div>
                    {sIdx < dayStops.length - 1 && <div className="flex-1 w-0.5 bg-brand-200 my-2" />}
                  </div>
                  <div className="flex-1 pb-6">
                    {s.poi ? (
                      <Link
                        href={`/poi/${s.poi.slug}`}
                        className="block bg-white border border-slate-200 hover:border-brand-400 rounded-lg p-4 transition"
                      >
                        <h3 className="font-display text-lg text-brand-700">{s.poi.name}</h3>
                        {s.poi.address && (
                          <p className="text-xs text-slate-500 mt-1">📍 {s.poi.address}</p>
                        )}
                        {s.note && (
                          <p className="text-sm text-slate-700 mt-2 italic">"{s.note}"</p>
                        )}
                      </Link>
                    ) : (
                      <div className="text-slate-400 italic">POI không tìm thấy: {s.poi_slug}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

function groupByDay(_stops: any[], _i: number) {
  return 0;
}
