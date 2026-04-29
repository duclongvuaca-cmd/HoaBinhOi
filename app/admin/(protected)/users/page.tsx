import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase-server";
import { UsersTable } from "@/components/admin/users-table";
import { ROLE_LABEL, tr } from "@/lib/labels";

export default async function AdminUsers() {
  const me = await getAdminUser();
  if (!me) redirect("/admin/login");
  if (me.role !== "admin") {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-rose-800">
        Chỉ quản trị xem được trang này. Vai trò hiện tại: <b>{tr(ROLE_LABEL, me.role)}</b>.
      </div>
    );
  }

  const sb = createClient();
  const { data: users, error } = await sb
    .from("admin_users")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Người dùng ({users?.length ?? 0})</h1>
      {error && <div className="bg-rose-50 text-rose-700 p-4 rounded-lg mb-4 text-sm">{error.message}</div>}
      <UsersTable users={users || []} myEmail={me.email} />
    </div>
  );
}
