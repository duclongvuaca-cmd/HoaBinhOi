import { createClient } from "@/lib/supabase-server";
import { ReviewModerateRow } from "@/components/admin/review-moderate-row";
import { REVIEW_STATUS_LABEL, tr } from "@/lib/labels";

interface SearchParams { status?: string }

export default async function AdminReviews({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const status = params.status || "pending";
  const sb = createClient();

  const { data: reviews, error } = await sb
    .from("reviews")
    .select("*, pois!inner(slug, name)")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl">Đánh giá ({reviews?.length ?? 0})</h1>
        <div className="flex gap-2 text-sm">
          {["pending", "approved", "rejected"].map((s) => (
            <a
              key={s}
              href={`/admin/reviews?status=${s}`}
              className={`px-3 py-1.5 rounded-lg ${
                status === s ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              {tr(REVIEW_STATUS_LABEL, s)}
            </a>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-700 p-4 rounded-lg mb-4 text-sm">
          {error.message}
        </div>
      )}

      <div className="space-y-3">
        {(reviews || []).map((r: any) => (
          <ReviewModerateRow key={r.id} review={r} />
        ))}
        {(!reviews || reviews.length === 0) && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            Không có đánh giá nào ở trạng thái <b>{tr(REVIEW_STATUS_LABEL, status)}</b>.
          </div>
        )}
      </div>
    </div>
  );
}
