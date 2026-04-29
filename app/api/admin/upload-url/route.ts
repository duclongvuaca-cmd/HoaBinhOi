import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getAdminUser } from "@/lib/admin-auth";

const BUCKET = "poi-images";
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(req: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const slug = String(body.slug || "shared").toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 60);
  const filename = String(body.filename || "image.jpg");
  const size = Number(body.size || 0);
  const type = String(body.type || "");

  if (!ALLOWED.has(type)) {
    return NextResponse.json({ error: "Chỉ chấp nhận JPG/PNG/WEBP/GIF" }, { status: 400 });
  }
  if (size > MAX_BYTES) {
    return NextResponse.json({ error: `Ảnh quá ${MAX_BYTES / 1024 / 1024}MB` }, { status: 400 });
  }

  const ext = (filename.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  const path = `${slug}/${stamp}-${rand}.${ext}`;

  const sb = createClient();
  const { data, error } = await sb.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: pub } = sb.storage.from(BUCKET).getPublicUrl(path);

  return NextResponse.json({
    upload_url: data.signedUrl,
    token: data.token,
    path,
    public_url: pub.publicUrl
  });
}
