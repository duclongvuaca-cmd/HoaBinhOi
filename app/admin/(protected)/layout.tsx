import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin-auth";
import { LogoutButton } from "@/components/admin/logout-button";
import { ROLE_LABEL, tr } from "@/lib/labels";

export const metadata = { title: "Admin — Hoà Bình Ơi" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const isAdmin = user.role === "admin";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-6 flex-wrap">
            <Link href="/admin" className="font-display font-bold text-lg">
              Hoà Bình Ơi · Admin
            </Link>
            <nav className="flex gap-4 text-sm text-slate-600">
              <Link href="/admin/poi" className="hover:text-brand-700">POI</Link>
              <Link href="/admin/itineraries" className="hover:text-brand-700">Hành trình</Link>
              <Link href="/admin/reviews" className="hover:text-brand-700">Reviews</Link>
              {isAdmin && <Link href="/admin/users" className="hover:text-brand-700">Người dùng</Link>}
              {isAdmin && <Link href="/admin/audit" className="hover:text-brand-700">Nhật ký</Link>}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-500">
              {user.email}
              <span className={`ml-1 px-1.5 py-0.5 rounded text-xs ${isAdmin ? "bg-brand-100 text-brand-800" : "bg-amber-100 text-amber-800"}`}>{tr(ROLE_LABEL, user.role)}</span>
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
