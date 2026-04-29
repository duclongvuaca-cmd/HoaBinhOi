import { createClient } from "@/lib/supabase-server";

export async function ReviewList({ poiId }: { poiId: string }) {
  const sb = createClient();
  const { data: reviews } = await sb
    .from("reviews")
    .select("*")
    .eq("poi_id", poiId)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(20);

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-slate-500 text-sm bg-slate-50 rounded-lg p-4 border border-dashed border-slate-300">
        Chưa có đánh giá nào. Hãy là người đầu tiên!
      </div>
    );
  }

  const avg = reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-amber-500 text-xl">★</span>
        <span className="font-semibold">{avg.toFixed(1)}</span>
        <span className="text-slate-500">— {reviews.length} đánh giá</span>
      </div>
      <ul className="space-y-3">
        {reviews.map((r: any) => (
          <li key={r.id} className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{r.author_name || "Khách"}</span>
                <span className="text-amber-500 text-xs">{"★".repeat(r.rating)}</span>
              </div>
              <span className="text-xs text-slate-400">
                {new Date(r.created_at).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed">{r.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
