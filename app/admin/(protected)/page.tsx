import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

async function getCounts() {
  try {
    const sb = createClient();
    const [pois, drafts, itins, reviews] = await Promise.all([
      sb.from("pois").select("id", { count: "exact", head: true }).eq("status", "published"),
      sb.from("pois").select("id", { count: "exact", head: true }).eq("status", "draft"),
      sb.from("itineraries").select("id", { count: "exact", head: true }).eq("status", "published"),
      sb.from("reviews").select("id", { count: "exact", head: true }).eq("status", "pending")
    ]);
    return {
      pubPois: pois.count ?? 0,
      draftPois: drafts.count ?? 0,
      pubItins: itins.count ?? 0,
      pendingReviews: reviews.count ?? 0
    };
  } catch {
    return { pubPois: 0, draftPois: 0, pubItins: 0, pendingReviews: 0 };
  }
}

export default async function AdminHome() {
  const c = await getCounts();
  const cards = [
    { title: "POI published", value: c.pubPois, href: "/admin/poi?status=published" },
    { title: "POI draft", value: c.draftPois, href: "/admin/poi?status=draft" },
    { title: "Hành trình published", value: c.pubItins, href: "/admin/itineraries" },
    { title: "Reviews chờ duyệt", value: c.pendingReviews, href: "/admin/reviews" }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl">Dashboard</h1>
        <Link
          href="/admin/poi/new"
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          + Thêm POI mới
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:border-brand-400 transition"
          >
            <div className="text-3xl font-bold text-slate-900">{card.value}</div>
            <div className="text-sm text-slate-500 mt-1">{card.title}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-900">
        <b>Wave 1 đang triển khai.</b> Sau khi setup Supabase + seed xong, các con số trên sẽ hiển thị thật.
      </div>
    </div>
  );
}
