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

export function MapView({ pois }: { pois: POI[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [hovered, setHovered] = useState<string | null>(null);
  const filteredPois = filter === "all" ? pois : pois.filter(p => p.category === filter);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const useMapbox = !!mapboxToken && !mapboxToken.includes("YOUR_TOKEN");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
            filter === "all" ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700"
          }`}
        >
          Tất cả ({pois.length})
        </button>
        {Object.entries(CATEGORY_META).map(([cat, meta]) => {
          const count = pois.filter(p => p.category === cat).length;
          if (count === 0) return null;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                filter === cat ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {meta.emoji} {meta.title} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {useMapbox ? (
            <MapboxMap pois={filteredPois} hovered={hovered} setHovered={setHovered} />
          ) : (
            <SvgMap pois={filteredPois} hovered={hovered} setHovered={setHovered} />
          )}
        </div>

        <aside className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {filteredPois.map((p) => (
            <Link key={p.slug} href={`/poi/${p.slug}`}
                  onMouseEnter={() => setHovered(p.slug)}
                  onMouseLeave={() => setHovered(null)}
                  className={`block p-3 rounded-lg border transition ${
                    hovered === p.slug
                      ? "border-brand-400 bg-brand-50"
                      : "border-slate-200 hover:border-brand-300"
                  }`}>
              <div className="flex items-start gap-2">
                <span className="text-xl">{EMOJI[p.category]}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-sm truncate">{p.name}</div>
                  {p.price_range && (
                    <div className="text-xs text-sun-700 mt-1">{p.price_range}</div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </aside>
      </div>
    </div>
  );
}

function SvgMap({ pois, hovered, setHovered }: {
  pois: POI[]; hovered: string | null; setHovered: (s: string | null) => void;
}) {
  const lats = pois.map(p => p.lat);
  const lngs = pois.map(p => p.lng);
  const minLat = Math.min(...lats) - 0.05;
  const maxLat = Math.max(...lats) + 0.05;
  const minLng = Math.min(...lngs) - 0.05;
  const maxLng = Math.max(...lngs) + 0.05;
  const W = 800, H = 500;
  const project = (lat: number, lng: number) => ({
    x: ((lng - minLng) / (maxLng - minLng)) * W,
    y: H - ((lat - minLat) / (maxLat - minLat)) * H
  });

  return (
    <div className="bg-gradient-to-br from-brand-50 to-sun-50 border border-slate-200 rounded-xl overflow-hidden relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {pois.map((p) => {
          const { x, y } = project(p.lat, p.lng);
          const isSelected = hovered === p.slug;
          return (
            <g key={p.slug} transform={`translate(${x}, ${y})`}
               onMouseEnter={() => setHovered(p.slug)}
               onMouseLeave={() => setHovered(null)}
               className="cursor-pointer">
              <circle r={isSelected ? 18 : 12} fill={COLOR[p.category]} opacity="0.9"
                      stroke="white" strokeWidth="2" />
              <text textAnchor="middle" dy="5" fontSize="14" pointerEvents="none">
                {EMOJI[p.category]}
              </text>
              {isSelected && (
                <text x="0" y="-22" textAnchor="middle" fontSize="11"
                      fill="#1d4d39" fontWeight="600" stroke="white" strokeWidth="3"
                      paintOrder="stroke">
                  {p.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <p className="absolute bottom-2 right-2 text-xs text-slate-500 bg-white/70 px-2 py-1 rounded">
        Map đơn giản. Add NEXT_PUBLIC_MAPBOX_TOKEN để upgrade tile map thật.
      </p>
    </div>
  );
}

function MapboxMap({ pois, hovered, setHovered }: {
  pois: POI[]; hovered: string | null; setHovered: (s: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || pois.length === 0) return;

    let mapboxgl: any;
    (async () => {
      mapboxgl = (await import("mapbox-gl")).default;
      // @ts-ignore - css side-effect
      await import("mapbox-gl/dist/mapbox-gl.css");
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

      const lats = pois.map(p => p.lat);
      const lngs = pois.map(p => p.lng);
      const center: [number, number] = [
        (Math.min(...lngs) + Math.max(...lngs)) / 2,
        (Math.min(...lats) + Math.max(...lats)) / 2
      ];

      const map = new mapboxgl.Map({
        container: containerRef.current!,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center,
        zoom: 9
      });
      mapRef.current = map;

      map.on("load", () => {
        const bounds = new mapboxgl.LngLatBounds();
        pois.forEach(p => bounds.extend([p.lng, p.lat]));
        map.fitBounds(bounds, { padding: 60, maxZoom: 12 });

        pois.forEach(p => {
          const el = document.createElement("div");
          el.className = "map-marker";
          el.style.cssText = `width:36px;height:36px;border-radius:50%;
            background:${COLOR[p.category]};border:2px solid white;
            display:flex;align-items:center;justify-content:center;
            font-size:18px;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.3);`;
          el.textContent = EMOJI[p.category];
          el.addEventListener("mouseenter", () => setHovered(p.slug));
          el.addEventListener("mouseleave", () => setHovered(null));

          const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
            .setHTML(`<div style="font-weight:600;font-size:14px">${p.name}</div>
                     ${p.price_range ? `<div style="font-size:12px;color:#dc5b03;margin-top:4px">${p.price_range}</div>` : ""}
                     <a href="/poi/${p.slug}" style="display:inline-block;margin-top:6px;color:#287a55;font-size:12px;font-weight:600">Xem chi tiết →</a>`);

          new mapboxgl.Marker(el)
            .setLngLat([p.lng, p.lat])
            .setPopup(popup)
            .addTo(map);
        });

        map.addControl(new mapboxgl.NavigationControl(), "top-right");
      });
    })();

    return () => mapRef.current?.remove();
  }, [pois]);

  return <div ref={containerRef} className="w-full h-[600px] rounded-xl overflow-hidden" />;
}
