import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { CATEGORY_META, type Category } from "@/lib/types";
import { POI_STATUS_LABEL, tr } from "@/lib/labels";

const CATS: Category[] = ["an", "mua", "nghi", "choi", "diem-den", "su-kien"];

interface SearchParams {
  q?: string;
  category?: string;
  status?: string;
}

export default async function AdminPoiList({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const sb = createClient();

  let q = sb.from("pois").select("*").order("updated_at", { ascending: false }).limit(200);
  if (params.status && ["draft", "published", "archived"].includes(params.status)) {
    q = q.eq("status", params.status);
  }
  if (params.category && CATS.includes(params.category as Category)) {
    q = q.eq("category", params.category);
  }
  if (params.q) {
    q = q.ilike("name", `%${params.q}%`);
  }

  const { data: pois, error } = await q;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl">Địa điểm ({pois?.length ?? 0})</h1>
        <Link
          href="/admin/poi/new"
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          + Thêm địa điểm
        </Link>
      </div>

      <form className="mb-4 flex gap-3 flex-wrap items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-slate-500 mb-1">Tìm theo tên</label>
          <input
            type="text"
            name="q"
            defaultValue={params.q || ""}
            placeholder="Vua Cá, Bếp Mường..."
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Danh mục</label>
          <select name="category" defaultValue={params.category || ""} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
            <option value="">Tất cả</option>
            {CATS.map((c) => (
              <option key={c} value={c}>{CATEGORY_META[c].emoji} {CATEGORY_META[c].title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Trạng thái</label>
          <select name="status" defaultValue={params.status || ""} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
            <option value="">Tất cả</option>
            <option value="draft">Nháp</option>
            <option value="published">Đã đăng</option>
            <option value="archived">Đã ẩn</option>
          </select>
        </div>
        <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm h-[38px]">
          Lọc
        </button>
      </form>

      {error && (
        <div className="bg-rose-50 text-rose-700 p-4 rounded-lg mb-4 text-sm">
          Lỗi: {error.message}. Đã setup Supabase + chạy schema chưa?
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Danh mục</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Cập nhật</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(pois || []).map((p: any) => (
              <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.slug}</div>
                </td>
                <td className="px-4 py-3">
                  {CATEGORY_META[p.category as Category]?.emoji} {CATEGORY_META[p.category as Category]?.title}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {p.updated_at ? new Date(p.updated_at).toLocaleString("vi-VN") : "—"}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/poi/${p.slug}`} className="text-brand-600 hover:underline">
                    Sửa
                  </Link>
                </td>
              </tr>
            ))}
            {(!pois || pois.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  Chưa có địa điểm nào khớp bộ lọc.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    published: "bg-brand-100 text-brand-800",
    draft: "bg-amber-100 text-amber-800",
    archived: "bg-slate-200 text-slate-600"
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs ${map[status] || "bg-slate-100"}`}>
      {tr(POI_STATUS_LABEL, status)}
    </span>
  );
}
