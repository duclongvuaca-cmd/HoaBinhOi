import Link from "next/link";
import type { POI } from "@/lib/types";

export function PoiCard({ poi }: { poi: POI }) {
  return (
    <Link
      href={`/poi/${poi.slug}`}
      className="group block bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-brand-400 hover:shadow-lg transition"
    >
      <div className="h-40 bg-gradient-to-br from-brand-100 to-brand-300 relative">
        {poi.images && poi.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poi.images[0]} alt={poi.name} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-40">
            {poi.category === "an" && "🍲"}
            {poi.category === "mua" && "🛍️"}
            {poi.category === "nghi" && "🛏️"}
            {poi.category === "choi" && "🎯"}
            {poi.category === "diem-den" && "🏞️"}
            {poi.category === "su-kien" && "🎉"}
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl mb-2 group-hover:text-brand-600 transition">
          {poi.name}
        </h3>
        {poi.price_range && (
          <span className="inline-block bg-sun-100 text-sun-800 text-xs font-semibold px-2 py-1 rounded mb-2">
            {poi.price_range}
          </span>
        )}
        {poi.description && (
          <p className="text-sm text-slate-600 line-clamp-3">{poi.description}</p>
        )}
        {poi.address && (
          <p className="text-xs text-slate-400 mt-2">📍 {poi.address}</p>
        )}
      </div>
    </Link>
  );
}
