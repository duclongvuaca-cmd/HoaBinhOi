/**
 * Parse Google Maps URL → insert/update vào pois.
 * Chạy: npx tsx scripts/ingest-gmaps.ts <url> <category> <name?>
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing Supabase env");
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false } });

function parseGmapsUrl(u: string) {
  const out: any = { raw_url: u, lat: null, lng: null, place_id: null, google_cid: null, name: null };
  let m = u.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (m) { out.lat = parseFloat(m[1]); out.lng = parseFloat(m[2]); }
  m = u.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (m) { out.lat = parseFloat(m[1]); out.lng = parseFloat(m[2]); }
  m = u.match(/!1s(0x[0-9a-f]+:0x[0-9a-f]+)/);
  if (m) {
    out.place_id = m[1];
    const cidHex = m[1].split(":")[1];
    out.google_cid = BigInt("0x" + cidHex.slice(2)).toString();
  }
  m = u.match(/\/place\/([^/]+)\//);
  if (m) out.name = decodeURIComponent(m[1]).replace(/\+/g, " ");
  return out;
}

async function main() {
  const [, , gmapsUrl, category, nameOverride] = process.argv;
  if (!gmapsUrl || !category) {
    console.error("Usage: tsx scripts/ingest-gmaps.ts <gmaps_url> <category> [name]");
    process.exit(1);
  }
  const parsed = parseGmapsUrl(gmapsUrl);
  if (!parsed.lat || !parsed.lng) {
    console.error("Could not extract coords");
    process.exit(1);
  }
  const name = nameOverride || parsed.name || "(unnamed)";
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);

  const { error } = await supabase.from("pois").upsert({
    slug, name, category,
    lat: parsed.lat, lng: parsed.lng,
    place_id: parsed.place_id,
    google_cid: parsed.google_cid,
    source_url: gmapsUrl,
    status: "draft"
  }, { onConflict: "slug" });

  if (error) console.error("Error:", error.message);
  else console.log(`✓ Ingested: ${slug} (status=draft, edit content + change to published)`);
}

main();
