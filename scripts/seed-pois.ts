/**
 * Seed POIs vào Supabase từ data/seed-pois.json
 * Chạy: npm run seed
 */
import "dotenv/config";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function main() {
  const file = resolve(process.cwd(), "data/seed-pois.json");
  const pois = JSON.parse(readFileSync(file, "utf-8"));
  console.log(`Seeding ${pois.length} POIs...`);

  for (const poi of pois) {
    const { error } = await supabase
      .from("pois")
      .upsert(poi, { onConflict: "slug" });
    if (error) {
      console.error(`  ✗ ${poi.slug}: ${error.message}`);
    } else {
      console.log(`  ✓ ${poi.slug}`);
    }
  }
  console.log("Done.");
}

main();
