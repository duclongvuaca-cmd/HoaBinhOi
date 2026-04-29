import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getAdminUser } from "@/lib/admin-auth";
import { logAudit } from "@/lib/audit";

const ACTION_TO_STATUS: Record<string, string> = {
  approve: "approved",
  reject: "rejected"
};

export async function PATCH(req: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Chỉ admin duyệt review" }, { status: 403 });
  }

  const body = await req.json();
  if (!body.id || !body.action) return NextResponse.json({ error: "id + action required" }, { status: 400 });

  const status = ACTION_TO_STATUS[body.action];
  if (!status) return NextResponse.json({ error: "action không hợp lệ" }, { status: 400 });

  const sb = createClient();
  const { data: before } = await sb.from("reviews").select("*").eq("id", body.id).maybeSingle();
  const { error } = await sb.from("reviews").update({ status }).eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actor_email: user.email, actor_role: user.role,
    action: body.action, resource: "reviews", resource_id: body.id,
    before, after: { ...before, status }
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Chỉ admin xoá review" }, { status: 403 });
  }

  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const sb = createClient();
  const { data: before } = await sb.from("reviews").select("*").eq("id", body.id).maybeSingle();
  const { error } = await sb.from("reviews").delete().eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actor_email: user.email, actor_role: user.role,
    action: "delete", resource: "reviews", resource_id: body.id, before
  });

  return NextResponse.json({ ok: true });
}
