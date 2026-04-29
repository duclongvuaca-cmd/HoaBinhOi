"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { POI } from "@/lib/types";
import { CATEGORY_META } from "@/lib/types";

const EMOJI: Record<string, string> = {
  "an": "🍲", "mua": "🛍️", "nghi": "🛏️",
  "choi": "🎯", "diem-den": "🏞️", "su-kien": "🎉"
};
const COLOR: Record<string, string> = {
  "an": "#dc5b03", "mua": "#287a55", "nghi": "#216145",
  "choi": "#f97e07", "diem-den": "#1d4d39", "su-kien": "#933110"
};

declare global {
  interface Window {
    google: any;
    __gmapsLoaded?: Promise<void>;
  }
}

function loadGoogleMaps(key: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();
  if (window.__gmapsLoaded) return window.__gmapsLoaded;
  window.__gmapsLoaded = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=marker&loading=async&v=quarterly`;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
  return window.__gmapsLoaded;
}

export function GmapsView({ pois }: { pois: POI[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [hovered, setHovered] = useState<string | null>(null);
  const filteredPois = filter === "all" ? pois : pois.filter((p) => p.category === filter);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!key) { setError("Thiếu NEXT_PUBLIC_GOOGLE_MAPS_KEY"); return; }
    if (!containerRef.current || filteredPois.length === 0) return;

    let cancelled = false;
    (async () => {
      try {
        await loadGoogleMaps(key);
        if (cancelled || !containerRef.current) return;

        const lats = filteredPois.map((p) => p.lat);
        const lngs = filteredPois.map((p) => p.lng);
        const center = {
          lat: (Math.min(...lats) + Math.max(...lats)) / 2,
          lng: (Math.min(...lngs) + Math.max(...lngs)) / 2
        };

        if (!mapRef.current) {
          mapRef.current = new window.google.maps.Map(containerRef.current, {
            center, zoom: 9, mapId: "DEMO_MAP_ID",
            mapTypeControl: false, streetViewControl: false, fullscreenControl: true
          });
        }

        markersRef.current.forEach((m) => m.map = null);
        markersRef.current = [];

        const bounds = new window.google.maps.LatLngBounds();
        for (const p of filteredPois) {
          const el = document.createElement("div");
          el.style.cssText = `width:36px;height:36px;border-radius:50%;
            background:${COLOR[p.category]};border:2px solid white;
            display:flex;align-items:center;justify-content:center;
            font-size:18px;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.3);`;
          el.textContent = EMOJI[p.category];
          el.addEventListener("mouseenter", () => setHovered(p.slug));
          el.addEventListener("mouseleave", () => setHovered(null));

          const marker = new window.google.maps.marker.AdvancedMarkerElement({
            map: mapRef.current,
            position: { lat: p.lat, lng: p.lng },
            content: el,
            title: p.name
          });

          const info = new window.google.maps.InfoWindow({
            content: `<div style="font-weight:600;font-size:14px">${p.name}</div>
              ${p.price_range ? `<div style="font-size:12px;color:#dc5b03;margin-top:4px">${p.price_range}</div>` : ""}
              <a href="/poi/${p.slug}" style="display:inline-block;margin-top:6px;color:#287a55;font-size:12px;font-weight:600">Xem chi tiết →</a>`
          });
          marker.addListener("click", () => info.open({ map: mapRef.current, anchor: marker }));

          markersRef.current.push(marker);
          bounds.extend({ lat: p.lat, lng: p.lng });
        }

        if (filteredPois.length > 1) mapRef.current.fitBounds(bounds, 60);
      } catch (e: any) {
        setError(e.message || "Lỗi load Google Maps");
      }
    })();

    return () => { cancelled = true; };
  }, [filteredPois, key]);

  if (error) {
    return <div className="bg-rose-50 text-rose-700 p-4 rounded-lg text-sm">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === "all" ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700"}`}>
          Tất cả ({pois.length})
        </button>
        {Object.entries(CATEGORY_META).map(([cat, meta]) => {
          const count = pois.filter((p) => p.category === cat).length;
          if (count === 0) return null;
          return (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === cat ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
              {meta.emoji} {meta.title} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div ref={containerRef} className="w-full h-[600px] rounded-xl overflow-hidden border border-slate-200" />
        </div>
        <aside className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {filteredPois.map((p) => (
            <Link key={p.slug} href={`/poi/${p.slug}`}
                  onMouseEnter={() => setHovered(p.slug)}
                  onMouseLeave={() => setHovered(null)}
                  className={`block p-3 rounded-lg border transition ${
                    hovered === p.slug ? "border-brand-400 bg-brand-50" : "border-slate-200 hover:border-brand-300"
                  }`}>
              <div className="flex items-start gap-2">
                <span className="text-xl">{EMOJI[p.category]}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-sm truncate">{p.name}</div>
                  {p.price_range && <div className="text-xs text-sun-700 mt-1">{p.price_range}</div>}
                </div>
              </div>
            </Link>
          ))}
        </aside>
      </div>
    </div>
  );
}
