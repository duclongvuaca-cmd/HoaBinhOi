/**
 * Set ảnh đã curate (verified đúng) cho landmark chính.
 * Override mọi ảnh sai từ auto-search trước đó.
 * Chạy: npm run set-curated
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const W = (filename: string, w = 1280) =>
  `https://upload.wikimedia.org/wikipedia/commons/thumb/${filename}/${w}px-${filename.split("/").pop()}`;

const CURATED: Record<string, string[]> = {
  "thuy-dien-hoa-binh": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Nh%C3%A0_m%C3%A1y_Th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg/1280px-Nh%C3%A0_m%C3%A1y_Th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/H%E1%BA%A7m_%C4%91%C6%B0%E1%BB%9Dng_b%E1%BB%99_nh%C3%A0_m%C3%A1y_th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg/1280px-H%E1%BA%A7m_%C4%91%C6%B0%E1%BB%9Dng_b%E1%BB%99_nh%C3%A0_m%C3%A1y_th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Khu_v%E1%BB%B1c_%C4%91%E1%BA%B7t_t%E1%BB%95_m%C3%A1y_ph%C3%A1t_%C4%91i%E1%BB%87n_trong_nh%C3%A0_m%C3%A1y_th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg/1280px-Khu_v%E1%BB%B1c_%C4%91%E1%BA%B7t_t%E1%BB%95_m%C3%A1y_ph%C3%A1t_%C4%91i%E1%BB%87n_trong_nh%C3%A0_m%C3%A1y_th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg"
  ],
  "thac-bo": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Th%C3%A1c_B%E1%BB%9D.jpg/1280px-Th%C3%A1c_B%E1%BB%9D.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Th%C3%A1c_B%E1%BB%9D_-_Nguy%E1%BB%85n_Huy%E1%BA%BFn.jpg/1280px-Th%C3%A1c_B%E1%BB%9D_-_Nguy%E1%BB%85n_Huy%E1%BA%BFn.jpg"
  ],
  "long-ho-hoa-binh": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Nh%C3%A0_m%C3%A1y_Th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg/1280px-Nh%C3%A0_m%C3%A1y_Th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg"
  ]
};

async function main() {
  for (const [slug, images] of Object.entries(CURATED)) {
    const { error } = await sb.from("pois").update({ images }).eq("slug", slug);
    if (error) console.error(`✗ ${slug}: ${error.message}`);
    else console.log(`✓ ${slug}: ${images.length} ảnh`);
  }
}
main();
