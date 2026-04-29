export const revalidate = 60;

import { getPois } from "@/lib/data";
import { MapView } from "@/components/map-view";

export const metadata = { title: "Bản đồ Hoà Bình — Hoà Bình Ơi" };

export default async function MapPage() {
  const pois = await getPois();
  return (
    <main>
      <section className="bg-gradient-to-br from-brand-700 to-brand-500 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl mb-2">Bản đồ</h1>
          <p className="text-brand-100">{pois.length} điểm đến trong phường Hoà Bình</p>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <MapView pois={pois} />
        </div>
      </section>
    </main>
  );
}
