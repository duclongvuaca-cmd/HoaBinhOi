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

export async function getPois(category?: Category): Promise<POI[]> {
  const client = sb();
  if (client) {
    let q = client.from("pois").select("*").eq("status", "published");
    if (category) q = q.eq("category", category);
    const { data, error } = await q;
    if (!error && data && data.length > 0) return data as POI[];
  }
  const local = seedPois as POI[];
  return category ? local.filter(p => p.category === category) : local;
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
