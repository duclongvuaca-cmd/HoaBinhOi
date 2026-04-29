"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROLE_LABEL, tr } from "@/lib/labels";

export function UsersTable({ users, myEmail }: { users: any[]; myEmail: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "admin">("editor");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role, note })
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMsg({ kind: "err", text: json.error || "Lỗi" });
      return;
    }
    setMsg({ kind: "ok", text: `Đã thêm ${email}. Báo họ vào /admin/login để nhận đường dẫn đăng nhập.` });
    setEmail("");
    setNote("");
    router.refresh();
  }

  async function changeRole(id: string, newRole: string) {
    setBusy(true);
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role: newRole })
    });
    setBusy(false);
    router.refresh();
  }

  async function revoke(id: string, email: string) {
    if (!confirm(`Thu hồi quyền của ${email}?`)) return;
    setBusy(true);
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={invite} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <h2 className="font-medium">Thêm thành viên</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="email"
            required
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm md:col-span-1"
          />
          <select value={role} onChange={(e) => setRole(e.target.value as any)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
            <option value="editor">Biên tập (thêm/sửa địa điểm)</option>
            <option value="admin">Quản trị (toàn quyền)</option>
          </select>
          <input
            type="text"
            placeholder="Ghi chú (tuỳ chọn)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" disabled={busy} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50">
            {busy ? "..." : "Thêm thành viên"}
          </button>
          {msg && (
            <span className={`text-sm ${msg.kind === "ok" ? "text-brand-700" : "text-rose-600"}`}>{msg.text}</span>
          )}
        </div>
        <p className="text-xs text-slate-500">
          Sau khi thêm, báo họ vào <code>/admin/login</code>, nhập email → click đường dẫn trong Gmail.
        </p>
      </form>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Vai trò</th>
              <th className="px-4 py-3">Ghi chú</th>
              <th className="px-4 py-3">Thêm lúc</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => {
              const isMe = u.email.toLowerCase() === myEmail.toLowerCase();
              return (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    {u.email}{isMe && <span className="text-xs text-slate-400 ml-1">(bạn)</span>}
                  </td>
                  <td className="px-4 py-3">
                    {isMe ? (
                      <span className={`px-2 py-0.5 rounded text-xs ${u.role === "admin" ? "bg-brand-100 text-brand-800" : "bg-amber-100 text-amber-800"}`}>
                        {tr(ROLE_LABEL, u.role)}
                      </span>
                    ) : (
                      <select
                        value={u.role}
                        disabled={busy}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        className="border border-slate-300 rounded px-2 py-1 text-xs"
                      >
                        <option value="editor">Biên tập</option>
                        <option value="admin">Quản trị</option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{u.note || "—"}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {new Date(u.created_at).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!isMe && (
                      <button onClick={() => revoke(u.id, u.email)} disabled={busy} className="text-rose-600 hover:underline text-xs">
                        Thu hồi
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Chưa có thành viên nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
