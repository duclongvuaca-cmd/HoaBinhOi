"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReviewModerateRow({ review }: { review: any }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function act(action: "approve" | "reject" | "delete") {
    if (action === "delete" && !confirm("Xoá review này?")) return;
    setBusy(true);
    const res = await fetch("/api/admin/reviews", {
      method: action === "delete" ? "DELETE" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: review.id, action })
    });
    setBusy(false);
    if (res.ok) router.refresh();
    else {
      const j = await res.json();
      alert(j.error || "Lỗi");
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <a href={`/poi/${review.pois?.slug}`} target="_blank" className="font-medium text-brand-700 hover:underline">
              {review.pois?.name || "?"}
            </a>
            <span className="text-amber-500 text-sm">{"★".repeat(review.rating)}</span>
            <span className="text-xs text-slate-400">
              {review.author_name || "Khách"} · {new Date(review.created_at).toLocaleString("vi-VN")}
            </span>
          </div>
          <p className="text-slate-700 text-sm whitespace-pre-wrap">{review.body}</p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          {review.status !== "approved" && (
            <button onClick={() => act("approve")} disabled={busy} className="bg-brand-600 hover:bg-brand-700 text-white text-xs px-3 py-1.5 rounded">
              Duyệt
            </button>
          )}
          {review.status !== "rejected" && (
            <button onClick={() => act("reject")} disabled={busy} className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs px-3 py-1.5 rounded">
              Từ chối
            </button>
          )}
          <button onClick={() => act("delete")} disabled={busy} className="text-rose-600 hover:underline text-xs">
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
}
