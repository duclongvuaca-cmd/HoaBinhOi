import { createSupabaseServerClient } from "./supabase-ssr";
import { createClient } from "./supabase-server";

export type AdminRole = "admin" | "editor";

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
}

function envBootstrapEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
}

export async function lookupAdmin(email: string): Promise<AdminUser | null> {
  const e = email.toLowerCase().trim();
  if (!e) return null;
  try {
    const sb = createClient();
    const { data } = await sb.from("admin_users").select("id, email, role").eq("email", e).maybeSingle();
    if (data) return data as AdminUser;
  } catch {}
  if (envBootstrapEmails().includes(e)) {
    return { id: "env-bootstrap", email: e, role: "admin" };
  }
  return null;
}

export async function getAdminUser(): Promise<(AdminUser & { auth_id: string }) | null> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return null;
  const admin = await lookupAdmin(user.email);
  if (!admin) return null;
  return { ...admin, auth_id: user.id };
}

export async function requireAdmin(): Promise<AdminUser & { auth_id: string }> {
  const a = await getAdminUser();
  if (!a) throw new Error("UNAUTHORIZED");
  return a;
}

export async function requireRole(role: AdminRole): Promise<AdminUser & { auth_id: string }> {
  const a = await requireAdmin();
  if (role === "admin" && a.role !== "admin") throw new Error("FORBIDDEN");
  return a;
}
