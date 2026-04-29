"use client";

import { useEffect, useRef } from "react";

export function PoiMiniMap({ lat, lng, name }: { lat: number; lng: number; name: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!containerRef.current || !token) return;
    let cancelled = false;
    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      // @ts-ignore
      await import("mapbox-gl/dist/mapbox-gl.css");
      if (cancelled) return;
      mapboxgl.accessToken = token;
      const map = new mapboxgl.Map({
        container: containerRef.current!,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [lng, lat],
        zoom: 13
      });
      mapRef.current = map;
      const el = document.createElement("div");
      el.style.cssText = `width:32px;height:32px;border-radius:50%;background:#287a55;
        border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);`;
      new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);
      map.addControl(new mapboxgl.NavigationControl(), "top-right");
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
    };
  }, [lat, lng, token]);

  if (!token) {
    return (
      <div className="bg-slate-100 rounded-lg p-4 text-xs text-slate-500 text-center">
        Chưa cấu hình Mapbox token.
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200">
      <div ref={containerRef} className="w-full h-[280px]" aria-label={`Bản đồ ${name}`} />
    </div>
  );
}
