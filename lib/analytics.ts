import { createClient } from "./supabase-server";

export interface EventInput {
  meta?: any;
  poi_id?: string | null;
  itinerary_id?: string | null;
}

export async function logEvent(eventType: string, input: EventInput = {}) {
  try {
    const sb = createClient();
    await sb.from("events").insert({
      event_type: eventType,
      poi_id: input.poi_id || null,
      itinerary_id: input.itinerary_id || null,
      meta: input.meta || null
    });
  } catch (e) {
    console.error("[analytics] failed", e);
  }
}
