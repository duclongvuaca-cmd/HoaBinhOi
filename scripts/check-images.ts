import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function main() {
  const { data } = await sb.from("pois").select("slug, name, images, status").order("slug");
  if (!data) return;
  let withImg = 0;
  const without: string[] = [];
  for (const p of data) {
    const n = (p.images as string[] | null)?.length || 0;
    if (n > 0) withImg++; else without.push(p.slug);
  }
  console.log(`Tổng ${data.length} | Có ảnh: ${withImg} | Chưa: ${without.length}`);
  console.log(`Chưa có ảnh:`, without.slice(0, 20).join(", "));
  const vc = data.find((p) => p.slug === "vua-ca-long-phuong");
  console.log(`\nvua-ca-long-phuong (${vc?.images?.length || 0} ảnh):`);
  vc?.images?.slice(0, 2).forEach((u: string, i: number) => console.log(`  ${i+1}. ${u.slice(0, 120)}`));
}
main();
