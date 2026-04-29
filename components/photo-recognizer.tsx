"use client";

import { useState, useRef } from "react";

export function PhotoRecognizer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function pick(f: File | null) {
    setFile(f);
    setResult(null);
    setError(null);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  }

  async function recognize() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/nhan-dien", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Lỗi");
      setResult(json.result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) pick(f);
        }}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 hover:border-brand-400 rounded-xl p-8 text-center cursor-pointer bg-white"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(e) => pick(e.target.files?.[0] || null)}
          className="hidden"
        />
        {preview ? (
          <img src={preview} alt="preview" className="max-h-72 mx-auto rounded-lg" />
        ) : (
          <>
            <div className="text-5xl mb-3">📸</div>
            <p className="text-slate-700">Kéo thả hoặc bấm để chọn ảnh</p>
            <p className="text-xs text-slate-400 mt-1">JPG / PNG / WEBP · ≤5MB · món ăn, hoa, phong cảnh, di tích</p>
          </>
        )}
      </div>

      {file && (
        <div className="flex gap-2">
          <button
            onClick={recognize}
            disabled={busy}
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 rounded-lg disabled:opacity-50"
          >
            {busy ? "🤖 Đang nhận diện..." : "✨ Nhận diện bằng AI"}
          </button>
          <button
            onClick={() => pick(null)}
            className="px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg"
          >
            Xoá ảnh
          </button>
        </div>
      )}

      {error && <div className="bg-rose-50 text-rose-700 p-4 rounded-lg text-sm">{error}</div>}

      {result && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-display text-xl mb-3 text-brand-800">Kết quả</h2>
          <div className="prose prose-slate max-w-none whitespace-pre-wrap">{result}</div>
        </div>
      )}
    </div>
  );
}
