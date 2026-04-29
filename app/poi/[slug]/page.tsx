import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPoi, getPois } from "@/lib/data";
import { CATEGORY_META } from "@/lib/types";
import { createClient } from "@/lib/supabase-server";
import { PoiMiniMap } from "@/components/poi-mini-map";
import { ReviewForm } from "@/components/review-form";
import { ReviewList } from "@/components/review-list";

export async function generateStaticParams() {
  const pois = await getPois();
  return pois.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const poi = await getPoi(slug);
  if (!poi) return { title: "Không tìm thấy — Hoà Bình Ơi" };
  const meta = CATEGORY_META[poi.category];
  return {
    title: `${poi.name} — ${meta.title} | Hoà Bình Ơi`,
    description: poi.description?.slice(0, 160) || `${poi.name} ở phường Hoà Bình`,
    openGraph: {
      title: poi.name,
      description: poi.description?.slice(0, 160) || "",
      images: poi.images && poi.images.length > 0 ? poi.images.slice(0, 1) : []
    }
  };
}

const SCHEMA_TYPE: Record<string, string> = {
  "an": "Restaurant",
  "mua": "Store",
  "nghi": "LodgingBusiness",
  "choi": "TouristAttraction",
  "diem-den": "TouristAttraction",
  "su-kien": "Event"
};

export default async function PoiDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const poi = await getPoi(slug);
  if (!poi) notFound();

  const meta = CATEGORY_META[poi.category];
  const gmapsUrl = poi.place_id
    ? `https://www.google.com/maps/place/?q=place_id:${poi.place_id}`
    : `https://www.google.com/maps?q=${poi.lat},${poi.lng}`;

  let poiId: string | null = null;
  let avgRating: number | null = null;
  let reviewCount = 0;
  try {
    const sb = createClient();
    const { data: row } = await sb.from("pois").select("id").eq("slug", slug).maybeSingle();
    poiId = row?.id || null;
    if (poiId) {
      const { data: agg } = await sb
        .from("reviews")
        .select("rating")
        .eq("poi_id", poiId)
        .eq("status", "approved");
      if (agg && agg.length > 0) {
        avgRating = agg.reduce((s: number, r: any) => s + r.rating, 0) / agg.length;
        reviewCount = agg.length;
      }
    }
  } catch {}

  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPE[poi.category] || "Place",
    name: poi.name,
    description: poi.description || undefined,
    address: poi.address ? { "@type": "PostalAddress", addressLocality: poi.address } : undefined,
    geo: { "@type": "GeoCoordinates", latitude: poi.lat, longitude: poi.lng },
    telephone: poi.phone || undefined,
    image: poi.images && poi.images.length > 0 ? poi.images : undefined
  };
  if (avgRating !== null && reviewCount > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount
    };
  }

  const images = poi.images && poi.images.length > 0 ? poi.images : [];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-gradient-to-br from-brand-700 to-brand-500 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href={`/${poi.category}`} className="text-sm text-brand-100 hover:text-white">
            ← {meta.emoji} {meta.title}
          </Link>
          <h1 className="font-display text-4xl md:text-5xl mt-3 mb-2">{poi.name}</h1>
          {poi.address && <p className="text-brand-100">📍 {poi.address}</p>}
          {avgRating !== null && (
            <p className="text-brand-100 mt-2 text-sm">
              <span className="text-amber-300">★ {avgRating.toFixed(1)}</span> · {reviewCount} đánh giá
            </p>
          )}
        </div>
      </section>

      {images.length > 0 && (
        <section className="py-6 px-6 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {images.slice(0, 8).map((src: string, i: number) => (
                <a key={i} href={src} target="_blank" rel="noopener" className="block aspect-square overflow-hidden rounded-lg bg-slate-200">
                  <img src={src} alt={`${poi.name} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition" />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {poi.description && (
              <div>
                <h2 className="font-display text-2xl mb-2">Giới thiệu</h2>
                <p className="text-slate-700 leading-relaxed">{poi.description}</p>
              </div>
            )}

            {poi.insider_tip && (
              <div className="bg-gradient-to-br from-sun-50 to-white border-l-4 border-sun-400 p-5 rounded-r-xl">
                <h3 className="font-display text-lg mb-2 text-sun-800">💡 Bí quyết người bản địa</h3>
                <p className="text-slate-700">{poi.insider_tip}</p>
              </div>
            )}

            {poi.tags && poi.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {poi.tags.map((t: string) => (
                  <span key={t} className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded">
                    #{t}
                  </span>
                ))}
              </div>
            )}

            <div>
              <h2 className="font-display text-2xl mb-3">Đánh giá</h2>
              {poiId && (
                <>
                  <ReviewList poiId={poiId} />
                  <div className="mt-4">
                    <ReviewForm poiSlug={slug} />
                  </div>
                </>
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <PoiMiniMap lat={poi.lat} lng={poi.lng} name={poi.name} />

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              {poi.price_range && (
                <div>
                  <div className="text-xs text-slate-500">Giá tham khảo</div>
                  <div className="font-semibold">{poi.price_range}</div>
                </div>
              )}
              {poi.phone && (
                <div>
                  <div className="text-xs text-slate-500">Liên hệ</div>
                  <a href={`tel:${poi.phone}`} className="font-semibold text-brand-600">{poi.phone}</a>
                </div>
              )}
              <div>
                <div className="text-xs text-slate-500">Toạ độ</div>
                <div className="font-mono text-sm">{poi.lat.toFixed(4)}, {poi.lng.toFixed(4)}</div>
              </div>
              <a
                href={gmapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition"
              >
                Mở Google Maps
              </a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
