/**
 * Generate magic link URL không gửi mail (bypass rate limit dev).
 * Chạy: npm run dev-login -- <email>
 * Ví dụ: npm run dev-login -- duclongvuaca@gmail.com
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

if (!url || !key) {
  console.error("Missing Supabase env in .env.local");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npm run dev-login -- <email>");
    process.exit(1);
  }
  const { data, error } = await sb.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: `${site}/auth/callback?next=/admin` }
  });
  if (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
  console.log("\n=== MAGIC LINK URL (paste vào browser) ===\n");
  console.log(data.properties?.action_link);
  console.log("\n=== HẾT HẠN trong 1 giờ ===\n");
}

main();
