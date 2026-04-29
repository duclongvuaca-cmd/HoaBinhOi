import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase-server";
import { ACTION_LABEL, RESOURCE_LABEL, ROLE_LABEL, tr } from "@/lib/labels";

interface SearchParams { actor?: string; resource?: string; action?: string }

export default async function AuditPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const me = await getAdminUser();
  if (!me) redirect("/admin/login");
  if (me.role !== "admin") {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-rose-800">
        Chỉ quản trị xem được nhật ký kiểm toán.
      </div>
    );
  }

  const params = await searchParams;
  const sb = createClient();
  let q = sb.from("audit_log").select("*").order("created_at", { ascending: false }).limit(200);
  if (params.actor) q = q.eq("actor_email", params.actor);
  if (params.resource) q = q.eq("resource", params.resource);
  if (params.action) q = q.eq("action", params.action);

  const { data: rows, error } = await q;

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Nhật ký ({rows?.length ?? 0})</h1>

      <form className="flex gap-3 flex-wrap items-end mb-4">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Người thực hiện</label>
          <input type="text" name="actor" defaultValue={params.actor || ""} placeholder="email@..." className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Loại</label>
          <select name="resource" defaultValue={params.resource || ""} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
            <option value="">Tất cả</option>
            <option value="pois">Địa điểm</option>
            <option value="reviews">Đánh giá</option>
            <option value="admin_users">Người dùng</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Hành động</label>
          <select name="action" defaultValue={params.action || ""} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
            <option value="">Tất cả</option>
            <option value="insert">Thêm</option>
            <option value="update">Sửa</option>
            <option value="delete">Xoá</option>
            <option value="approve">Duyệt</option>
            <option value="reject">Từ chối</option>
            <option value="invite">Mời</option>
            <option value="role_change">Đổi quyền</option>
            <option value="revoke">Thu hồi</option>
          </select>
        </div>
        <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm h-[38px]">Lọc</button>
      </form>

      {error && <div className="bg-rose-50 text-rose-700 p-4 rounded-lg mb-4 text-sm">{error.message}</div>}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Thời điểm</th>
              <th className="px-3 py-2">Người thực hiện</th>
              <th className="px-3 py-2">Hành động</th>
              <th className="px-3 py-2">Loại</th>
              <th className="px-3 py-2">Mã</th>
              <th className="px-3 py-2">Thay đổi</th>
            </tr>
          </thead>
          <tbody>
            {(rows || []).map((r: any) => (
              <tr key={r.id} className="border-t border-slate-100 align-top">
                <td className="px-3 py-2 text-xs text-slate-500 whitespace-nowrap">
                  {new Date(r.created_at).toLocaleString("vi-VN")}
                </td>
                <td className="px-3 py-2">
                  <div>{r.actor_email}</div>
                  <div className="text-xs text-slate-400">{tr(ROLE_LABEL, r.actor_role || "")}</div>
                </td>
                <td className="px-3 py-2">
                  <ActionBadge action={r.action} />
                </td>
                <td className="px-3 py-2 text-xs">{tr(RESOURCE_LABEL, r.resource)}</td>
                <td className="px-3 py-2 font-mono text-xs text-slate-500 max-w-[180px] truncate">
                  {r.resource_id}
                </td>
                <td className="px-3 py-2">
                  <details className="text-xs">
                    <summary className="cursor-pointer text-brand-600">xem chi tiết</summary>
                    <pre className="bg-slate-50 p-2 rounded mt-1 max-w-md overflow-auto">{JSON.stringify({ truoc: r.before_data, sau: r.after_data }, null, 2)}</pre>
                  </details>
                </td>
              </tr>
            ))}
            {(!rows || rows.length === 0) && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Chưa có nhật ký nào khớp bộ lọc.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionBadge({ action }: { action: string }) {
  const color: Record<string, string> = {
    insert: "bg-brand-100 text-brand-800",
    update: "bg-blue-100 text-blue-800",
    delete: "bg-rose-100 text-rose-800",
    approve: "bg-emerald-100 text-emerald-800",
    reject: "bg-amber-100 text-amber-800",
    invite: "bg-purple-100 text-purple-800",
    role_change: "bg-indigo-100 text-indigo-800",
    revoke: "bg-rose-100 text-rose-800"
  };
  return <span className={`px-2 py-0.5 rounded text-xs ${color[action] || "bg-slate-100"}`}>{tr(ACTION_LABEL, action)}</span>;
}
