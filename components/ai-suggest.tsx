"use client";

import { useState } from "react";
import Link from "next/link";
import type { POI } from "@/lib/types";

export function AiSuggest() {
  const [query, setQuery] = useState("");
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ reasoning: string; pois: POI[] } | null>(null);
  const [err, setErr] = useState("");

  async function ask() {
    if (!query.trim()) return;
    setLoading(true);
    setErr("");
    setResult(null);
    try {
      const res = await fetch("/api/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, days })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Lỗi không rõ");
      setResult(json);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-sun-50 to-brand-50">
      <div className="max-w-4xl mx-auto">
        <p className="text-sm uppercase tracking-widest text-brand-600 mb-2">
          ✨ Trợ lý AI
        </p>
        <h2 className="font-display text-4xl mb-4">Hỏi tôi đi đâu</h2>
        <p className="text-slate-600 mb-6">
          Anh chị mô tả nhu cầu — đi với ai, thời gian, sở thích. AI gợi ý hành trình + POI phù hợp.
        </p>
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ví dụ: Đi với vợ cuối tuần, thích cá tươi và cảnh đẹp, ngân sách ~2tr/người..."
            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[80px]"
          />
          <div className="flex flex-wrap gap-3 items-center">
            <label className="text-sm text-slate-700">
              Số ngày:
              <select value={days} onChange={(e) => setDays(parseInt(e.target.value))}
                      className="ml-2 px-2 py-1 border border-slate-300 rounded">
                <option value={1}>1 ngày</option>
                <option value={2}>2 ngày</option>
                <option value={3}>3 ngày</option>
              </select>
            </label>
            <button
              onClick={ask}
              disabled={loading || !query.trim()}
              className="ml-auto px-6 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold rounded-lg transition"
            >
              {loading ? "Đang nghĩ..." : "Hỏi AI"}
            </button>
          </div>
        </div>

        {err && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
            {err}
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="bg-brand-50 border-l-4 border-brand-400 p-4 rounded-r">
              <p className="text-slate-800 leading-relaxed">{result.reasoning}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.pois.map((p) => (
                <Link key={p.slug} href={`/poi/${p.slug}`}
                      className="block bg-white border border-slate-200 hover:border-brand-400 rounded-lg p-4 transition">
                  <div className="font-display text-lg">{p.name}</div>
                  {p.price_range && <div className="text-sm text-sun-700 mt-1">{p.price_range}</div>}
                  {p.description && (
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">{p.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
