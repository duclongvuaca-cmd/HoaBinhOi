/**
 * Data loader. Tries Supabase first; falls back to local JSON seed
 * khi env chưa setup hoặc Supabase trả empty. Cho phép preview offline.
 */
import { createClient } from "@supabase/supabase-js";
import seedPois from "@/data/seed-pois.json";
import seedItins from "@/data/seed-itineraries.json";
import type { POI, Itinerary, Category } from "./types";

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("YOUR_PROJECT")) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

const FEATURED_ORDER = [
  "vua-ca-long-phuong",
  "sojo-hotel-hoa-binh",
  "muong-thanh-hoa-binh",
  "nem-chua-ran-caption"
];

function sortFeaturedFirst(pois: POI[]): POI[] {
  return [...pois].sort((a, b) => {
    const ai = FEATURED_ORDER.indexOf(a.slug);
    const bi = FEATURED_ORDER.indexOf(b.slug);
    if (ai >= 0 && bi >= 0) return ai - bi;
    if (ai >= 0) return -1;
    if (bi >= 0) return 1;
    const af = a.tags?.includes("featured") ? 1 : 0;
    const bf = b.tags?.includes("featured") ? 1 : 0;
    if (af !== bf) return bf - af;
    return (a.name || "").localeCompare(b.name || "", "vi");
  });
}

export async function getPois(category?: Category): Promise<POI[]> {
  const client = sb();
  if (client) {
    let q = client.from("pois").select("*").eq("status", "published");
    if (category) q = q.eq("category", category);
    const { data, error } = await q;
    if (!error && data && data.length > 0) return sortFeaturedFirst(data as POI[]);
  }
  const local = seedPois as POI[];
  const filtered = category ? local.filter(p => p.category === category) : local;
  return sortFeaturedFirst(filtered);
}

export async function getPoi(slug: string): Promise<POI | null> {
  const client = sb();
  if (client) {
    const { data } = await client.from("pois").select("*").eq("slug", slug).maybeSingle();
    if (data) return data as POI;
  }
  return (seedPois as POI[]).find(p => p.slug === slug) || null;
}

export async function getItineraries(): Promise<Itinerary[]> {
  const client = sb();
  if (client) {
    const { data } = await client.from("itineraries").select("*").eq("status", "published");
    if (data && data.length > 0) return data as Itinerary[];
  }
  return seedItins as Itinerary[];
}

export async function getItinerary(slug: string): Promise<Itinerary | null> {
  const client = sb();
  if (client) {
    const { data } = await client.from("itineraries").select("*").eq("slug", slug).maybeSingle();
    if (data) return data as Itinerary;
  }
  return (seedItins as Itinerary[]).find(i => i.slug === slug) || null;
}
