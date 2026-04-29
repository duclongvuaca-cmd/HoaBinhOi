import { createClient as createSbClient } from "@supabase/supabase-js";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) {
    throw new Error("Supabase env missing — check .env.local");
  }
  return createSbClient(url, key, { auth: { persistSession: false } });
}
