/**
 * Tạo bucket poi-images (idempotent) — chỉ chạy 1 lần.
 * Chạy: npm run setup-storage
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

const sb = createClient(url, key, { auth: { persistSession: false } });
const BUCKET = "poi-images";

async function main() {
  console.log("→ Checking bucket...");
  const { data: buckets, error: listErr } = await sb.storage.listBuckets();
  if (listErr) {
    console.error("List error:", listErr.message);
    process.exit(1);
  }
  const exists = buckets?.find((b) => b.name === BUCKET);
  if (exists) {
    console.log(`✓ Bucket "${BUCKET}" already exists (public=${exists.public})`);
    if (!exists.public) {
      const { error: upErr } = await sb.storage.updateBucket(BUCKET, { public: true });
      if (upErr) console.error("Update fail:", upErr.message);
      else console.log("→ Updated to public");
    }
  } else {
    const { error } = await sb.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 8 * 1024 * 1024,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"]
    });
    if (error) {
      console.error("Create error:", error.message);
      process.exit(1);
    }
    console.log(`✓ Bucket "${BUCKET}" created (public, 8MB limit)`);
  }
  console.log("\nTest upload signed URL...");
  const { data, error: signErr } = await sb.storage.from(BUCKET).createSignedUploadUrl("_test/check.txt");
  if (signErr) {
    console.error("Sign URL fail:", signErr.message);
  } else {
    console.log("✓ createSignedUploadUrl works");
    console.log(`  path: ${data.path}`);
  }
  console.log("\nDone. Anh có thể drag ảnh trong /admin/poi/[slug] giờ rồi.");
}

main();
