"use client";

import { useState, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";

interface Props {
  slug?: string;
  value: string[];
  onChange: (urls: string[]) => void;
}

const BUCKET = "poi-images";

export function ImageUpload({ slug, value, onChange }: Props) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadOne(file: File) {
    const res = await fetch("/api/admin/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: slug || "shared", filename: file.name, size: file.size, type: file.type })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Lỗi xin upload URL");

    const sb = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await sb.storage.from(BUCKET).uploadToSignedUrl(json.path, json.token, file, {
      contentType: file.type,
      upsert: false
    });
    if (error) throw new Error(error.message);
    return json.public_url as string;
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setErr(null);
    const next = [...value];
    try {
      for (const f of Array.from(files)) {
        const url = await uploadOne(f);
        next.push(url);
        onChange([...next]);
      }
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(i: number) {
    const next = value.filter((_, idx) => idx !== i);
    onChange(next);
  }

  function moveUp(i: number) {
    if (i === 0) return;
    const next = [...value];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 hover:border-brand-400 rounded-lg p-6 text-center cursor-pointer bg-slate-50"
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="text-3xl mb-2">📸</div>
        <div className="text-sm text-slate-700">
          {busy ? "Đang upload..." : "Kéo thả ảnh vào đây hoặc bấm để chọn"}
        </div>
        <div className="text-xs text-slate-400 mt-1">JPG / PNG / WEBP / GIF · ≤8MB / ảnh</div>
      </div>

      {err && <div className="text-rose-600 text-sm">{err}</div>}

      {value.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {value.map((url, i) => (
            <div key={url} className="relative group aspect-square overflow-hidden rounded bg-slate-100">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                {i > 0 && (
                  <button type="button" onClick={() => moveUp(i)} className="bg-white text-slate-800 text-xs px-2 py-1 rounded">
                    ←
                  </button>
                )}
                <button type="button" onClick={() => removeAt(i)} className="bg-rose-600 text-white text-xs px-2 py-1 rounded">
                  Xoá
                </button>
              </div>
              {i === 0 && (
                <div className="absolute top-1 left-1 bg-brand-600 text-white text-xs px-1.5 rounded">cover</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
