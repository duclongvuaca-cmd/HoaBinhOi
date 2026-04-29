import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

async function main() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const slugs = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const { data } = await sb.from("pois").select("slug, name, images").in("slug", slugs);
  for (const p of data || []) {
    console.log(`\n${p.slug} (${p.name}):`);
    ((p.images as string[]) || []).forEach((u: string, i: number) => console.log(`  ${i+1}. ${u}`));
  }
}
main();
