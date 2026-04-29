import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getAdminUser } from "@/lib/admin-auth";
import { logAudit } from "@/lib/audit";

const VALID_ROLES = new Set(["admin", "editor"]);

export async function POST(req: Request) {
  const me = await getAdminUser();
  if (!me) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (me.role !== "admin") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json();
  const email = String(body.email || "").trim().toLowerCase();
  const role = String(body.role || "editor");
  const note = String(body.note || "").slice(0, 200) || null;

  if (!email || !email.includes("@")) return NextResponse.json({ error: "Email không hợp lệ" }, { status: 400 });
  if (!VALID_ROLES.has(role)) return NextResponse.json({ error: "Role không hợp lệ" }, { status: 400 });

  const sb = createClient();
  const { data, error } = await sb
    .from("admin_users")
    .insert({ email, role, invited_by: me.email, note })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "Email đã tồn tại" }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logAudit({
    actor_email: me.email,
    actor_role: me.role,
    action: "invite",
    resource: "admin_users",
    resource_id: data.id,
    after: data
  });

  return NextResponse.json({ user: data });
}

export async function PATCH(req: Request) {
  const me = await getAdminUser();
  if (!me) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (me.role !== "admin") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json();
  if (!body.id || !body.role) return NextResponse.json({ error: "id + role required" }, { status: 400 });
  if (!VALID_ROLES.has(body.role)) return NextResponse.json({ error: "Role không hợp lệ" }, { status: 400 });

  const sb = createClient();
  const { data: before } = await sb.from("admin_users").select("*").eq("id", body.id).maybeSingle();
  if (!before) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });

  if (before.email.toLowerCase() === me.email.toLowerCase()) {
    return NextResponse.json({ error: "Không thể đổi role của chính mình" }, { status: 400 });
  }

  const { data, error } = await sb.from("admin_users").update({ role: body.role }).eq("id", body.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actor_email: me.email,
    actor_role: me.role,
    action: "role_change",
    resource: "admin_users",
    resource_id: body.id,
    before,
    after: data
  });

  return NextResponse.json({ user: data });
}

export async function DELETE(req: Request) {
  const me = await getAdminUser();
  if (!me) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (me.role !== "admin") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const sb = createClient();
  const { data: before } = await sb.from("admin_users").select("*").eq("id", body.id).maybeSingle();
  if (!before) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  if (before.email.toLowerCase() === me.email.toLowerCase()) {
    return NextResponse.json({ error: "Không thể revoke chính mình" }, { status: 400 });
  }

  const { error } = await sb.from("admin_users").delete().eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actor_email: me.email,
    actor_role: me.role,
    action: "revoke",
    resource: "admin_users",
    resource_id: body.id,
    before
  });

  return NextResponse.json({ ok: true });
}
