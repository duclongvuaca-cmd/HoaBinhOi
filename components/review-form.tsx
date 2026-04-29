"use client";

import { useState } from "react";

export function ReviewForm({ poiSlug }: { poiSlug: string }) {
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ poi_slug: poiSlug, author_name: author, rating, body })
    });
    const json = await res.json();
    if (!res.ok) {
      setMsg(json.error || "Lỗi");
      setState("err");
      return;
    }
    setMsg(json.message || "Đã gửi");
    setState("ok");
    setBody("");
    setAuthor("");
    setRating(5);
  }

  if (state === "ok") {
    return (
      <div className="bg-brand-50 text-brand-800 p-4 rounded-lg text-sm">
        ✅ {msg}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3 bg-white border border-slate-200 rounded-xl p-5">
      <h3 className="font-display text-lg">Để lại đánh giá</h3>
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Tên (không bắt buộc)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={60}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
        />
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value={5}>★★★★★ Tuyệt vời</option>
          <option value={4}>★★★★ Tốt</option>
          <option value={3}>★★★ Bình thường</option>
          <option value={2}>★★ Không tốt</option>
          <option value={1}>★ Tệ</option>
        </select>
      </div>
      <textarea
        placeholder="Trải nghiệm của bạn (tối thiểu 10 ký tự)..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        maxLength={2000}
        required
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
      />
      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={state === "sending"}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          {state === "sending" ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
        {state === "err" && <span className="text-rose-600 text-xs">{msg}</span>}
      </div>
      <p className="text-xs text-slate-400">Review sẽ hiển thị sau khi quản trị duyệt.</p>
    </form>
  );
}
