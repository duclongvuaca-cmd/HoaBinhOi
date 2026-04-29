import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getAdminUser } from "@/lib/admin-auth";
import { logAudit } from "@/lib/audit";

const CATS = new Set(["an", "mua", "nghi", "choi", "diem-den", "su-kien"]);
const STATUSES = new Set(["draft", "published", "archived"]);

function pickFields(body: any) {
  const out: any = {};
  const keys = ["slug", "name", "category", "lat", "lng", "place_id", "google_cid",
    "address", "phone", "description", "insider_tip", "price_range", "tags",
    "source_url", "images", "open_hours", "status"];
  for (const k of keys) if (k in body) out[k] = body[k];
  return out;
}

function validate(payload: any, mode: "create" | "update") {
  if (mode === "create") {
    if (!payload.slug || !payload.name || !payload.category) return "slug + name + category là bắt buộc";
  }
  if (payload.category && !CATS.has(payload.category)) return "category không hợp lệ";
  if (payload.status && !STATUSES.has(payload.status)) return "status không hợp lệ";
  if (payload.slug && !/^[a-z0-9-]+$/.test(payload.slug)) return "slug chỉ chứa a-z, 0-9, -";
  return null;
}

export async function POST(req: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const payload = pickFields(body);
  const err = validate(payload, "create");
  if (err) return NextResponse.json({ error: err }, { status: 400 });

  const sb = createClient();
  const { data, error } = await sb.from("pois").insert(payload).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actor_email: user.email, actor_role: user.role,
    action: "insert", resource: "pois", resource_id: data.id, after: data
  });

  return NextResponse.json({ poi: data });
}

export async function PATCH(req: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  const payload = pickFields(body);
  delete payload.slug;
  payload.updated_at = new Date().toISOString();
  const err = validate(payload, "update");
  if (err) return NextResponse.json({ error: err }, { status: 400 });

  const sb = createClient();
  const { data: before } = await sb.from("pois").select("*").eq("slug", body.slug).maybeSingle();
  const { data, error } = await sb.from("pois").update(payload).eq("slug", body.slug).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actor_email: user.email, actor_role: user.role,
    action: "update", resource: "pois", resource_id: data.id, before, after: data
  });

  return NextResponse.json({ poi: data });
}

export async function DELETE(req: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Chỉ admin được xoá POI. Editor có thể đổi status sang archived." }, { status: 403 });
  }

  const body = await req.json();
  if (!body.slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const sb = createClient();
  const { data: before } = await sb.from("pois").select("*").eq("slug", body.slug).maybeSingle();
  const { error } = await sb.from("pois").delete().eq("slug", body.slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actor_email: user.email, actor_role: user.role,
    action: "delete", resource: "pois", resource_id: before?.id, before
  });

  return NextResponse.json({ ok: true });
}
