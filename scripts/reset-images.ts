import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

async function main() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const slugs = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  if (slugs.length === 0) { console.error("Usage: tsx reset-images.ts <slug1> <slug2>..."); process.exit(1); }
  for (const s of slugs) {
    const { error } = await sb.from("pois").update({ images: [] }).eq("slug", s);
    if (error) console.error(`✗ ${s}: ${error.message}`);
    else console.log(`✓ Reset ${s}`);
  }
}
main();
