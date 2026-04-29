"use client";

import { useEffect, useRef } from "react";

interface Stop {
  poi: { lat: number; lng: number; name: string; slug: string } | null;
  start_time: string;
}

export function ItineraryMap({ stops }: { stops: Stop[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const valid = stops.filter((s) => s.poi && s.poi.lat && s.poi.lng);

  useEffect(() => {
    if (!containerRef.current || !token || valid.length === 0) return;
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
        center: [valid[0].poi!.lng, valid[0].poi!.lat],
        zoom: 10
      });
      mapRef.current = map;

      map.on("load", () => {
        const bounds = new mapboxgl.LngLatBounds();
        valid.forEach((s) => bounds.extend([s.poi!.lng, s.poi!.lat]));

        valid.forEach((s, i) => {
          const el = document.createElement("div");
          el.style.cssText = `width:32px;height:32px;border-radius:50%;background:#287a55;
            border:3px solid white;color:white;display:flex;align-items:center;justify-content:center;
            font-weight:600;font-size:13px;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:pointer;`;
          el.textContent = String(i + 1);
          const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(
            `<div style="font-weight:600;font-size:13px">${s.poi!.name}</div>
             <div style="font-size:11px;color:#64748b;margin-top:2px">${s.start_time}</div>
             <a href="/poi/${s.poi!.slug}" style="display:inline-block;margin-top:6px;color:#287a55;font-size:12px;font-weight:600">Xem chi tiết →</a>`
          );
          new mapboxgl.Marker(el).setLngLat([s.poi!.lng, s.poi!.lat]).setPopup(popup).addTo(map);
        });

        const coords = valid.map((s) => [s.poi!.lng, s.poi!.lat]);
        if (coords.length > 1) {
          map.addSource("route", {
            type: "geojson",
            data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: coords } }
          });
          map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: { "line-color": "#287a55", "line-width": 3, "line-dasharray": [2, 1] }
          });
        }

        map.fitBounds(bounds, { padding: 60, maxZoom: 13 });
        map.addControl(new mapboxgl.NavigationControl(), "top-right");
      });
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
    };
  }, [stops, token, valid]);

  if (!token || valid.length === 0) return null;

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 mb-8">
      <div ref={containerRef} className="w-full h-[400px]" />
    </div>
  );
}
