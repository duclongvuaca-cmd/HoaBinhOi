/**
 * Generate magic link URL không gửi mail (bypass rate limit dev).
 * Chạy:
 *   npm run dev-login -- <email>                        # local
 *   npm run dev-login -- <email> https://prod-url       # prod
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const email = args[0];
const siteOverride = args[1];
const site = siteOverride || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

if (!url || !key) {
  console.error("Missing Supabase env in .env.local");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

async function main() {
  if (!email) {
    console.error("Usage: npm run dev-login -- <email> [redirect-url]");
    process.exit(1);
  }
  console.log(`→ redirect site: ${site}`);
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
