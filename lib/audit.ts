import { createClient } from "./supabase-server";

export interface AuditEntry {
  actor_email: string;
  actor_role?: string;
  action: string;
  resource: string;
  resource_id?: string | null;
  before?: any;
  after?: any;
}

export async function logAudit(entry: AuditEntry) {
  try {
    const sb = createClient();
    await sb.from("audit_log").insert({
      actor_email: entry.actor_email,
      actor_role: entry.actor_role || null,
      action: entry.action,
      resource: entry.resource,
      resource_id: entry.resource_id || null,
      before_data: entry.before || null,
      after_data: entry.after || null
    });
  } catch (e) {
    console.error("[audit] failed", e);
  }
}
