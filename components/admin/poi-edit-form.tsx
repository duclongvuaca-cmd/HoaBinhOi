"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORY_META, type Category, type POI } from "@/lib/types";
import { ImageUpload } from "./image-upload";

const CATS: Category[] = ["an", "mua", "nghi", "choi", "diem-den", "su-kien"];

function parseGmapsUrl(u: string) {
  const out: any = { lat: null, lng: null, place_id: null, google_cid: null, name: null };
  let m = u.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (m) { out.lat = parseFloat(m[1]); out.lng = parseFloat(m[2]); }
  if (!out.lat) {
    m = u.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (m) { out.lat = parseFloat(m[1]); out.lng = parseFloat(m[2]); }
  }
  m = u.match(/!1s(0x[0-9a-f]+:0x[0-9a-f]+)/i);
  if (m) {
    out.place_id = m[1];
    const parts = m[1].split(":");
    if (parts[1]) {
      try { out.google_cid = BigInt(parts[1]).toString(); } catch {}
    }
  }
  m = u.match(/\/place\/([^/]+)\//);
  if (m) out.name = decodeURIComponent(m[1]).replace(/\+/g, " ");
  return out;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export function PoiEditForm({ poi, mode }: { poi?: any; mode: "new" | "edit" }) {
  const router = useRouter();
  const [form, setForm] = useState<any>(
    poi || {
      slug: "",
      name: "",
      category: "an",
      lat: null,
      lng: null,
      place_id: "",
      google_cid: "",
      address: "",
      phone: "",
      description: "",
      insider_tip: "",
      price_range: "",
      tags: [],
      images: [],
      source_url: "",
      status: "draft"
    }
  );
  const [images, setImages] = useState<string[]>(poi?.images || []);
  const [gmapsUrl, setGmapsUrl] = useState("");
  const [tagsRaw, setTagsRaw] = useState((poi?.tags || []).join(", "));
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  function applyGmaps() {
    const parsed = parseGmapsUrl(gmapsUrl);
    setForm((f: any) => ({
      ...f,
      lat: parsed.lat ?? f.lat,
      lng: parsed.lng ?? f.lng,
      place_id: parsed.place_id ?? f.place_id,
      google_cid: parsed.google_cid ?? f.google_cid,
      name: f.name || parsed.name || "",
      slug: f.slug || (parsed.name ? slugify(parsed.name) : ""),
      source_url: gmapsUrl
    }));
  }

  function setField(k: string, v: any) {
    setForm((f: any) => ({ ...f, [k]: v }));
    if (k === "name" && mode === "new" && !form.slug) {
      setForm((f: any) => ({ ...f, slug: slugify(v) }));
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const tags = tagsRaw.split(",").map((t: string) => t.trim()).filter(Boolean);
    const payload = { ...form, tags, images };

    const res = await fetch("/api/admin/poi", {
      method: mode === "new" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) {
      setMsg({ kind: "err", text: json.error || "Lưu lỗi" });
      return;
    }
    setMsg({ kind: "ok", text: "Đã lưu" });
    if (mode === "new") {
      router.push(`/admin/poi/${json.poi.slug}`);
    } else {
      router.refresh();
    }
  }

  async function remove() {
    if (!confirm(`Xoá địa điểm "${form.name}"? Hành động không thể hoàn tác.`)) return;
    const res = await fetch("/api/admin/poi", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: form.slug })
    });
    const json = await res.json();
    if (!res.ok) {
      setMsg({ kind: "err", text: json.error || "Xoá lỗi" });
      return;
    }
    router.push("/admin/poi");
  }

  return (
    <form onSubmit={save} className="space-y-6 max-w-3xl">
      {mode === "new" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <label className="block text-xs font-medium text-amber-900 mb-2">
            URL Google Maps (dán URL từ thanh địa chỉ → Áp dụng)
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={gmapsUrl}
              onChange={(e) => setGmapsUrl(e.target.value)}
              placeholder="https://www.google.com/maps/place/..."
              className="flex-1 border border-amber-300 rounded-lg px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={applyGmaps}
              className="bg-amber-700 text-white px-4 rounded-lg text-sm whitespace-nowrap"
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}

      <Section title="Cơ bản">
        <Field label="Tên" required>
          <input value={form.name} onChange={(e) => setField("name", e.target.value)} className={inp} required />
        </Field>
        <Field label="Đường dẫn (slug URL)" required>
          <input
            value={form.slug}
            onChange={(e) => setField("slug", e.target.value)}
            disabled={mode === "edit"}
            className={inp}
            required
          />
        </Field>
        <Field label="Danh mục" required>
          <select value={form.category} onChange={(e) => setField("category", e.target.value)} className={inp}>
            {CATS.map((c) => (
              <option key={c} value={c}>{CATEGORY_META[c].emoji} {CATEGORY_META[c].title}</option>
            ))}
          </select>
        </Field>
        <Field label="Trạng thái">
          <select value={form.status} onChange={(e) => setField("status", e.target.value)} className={inp}>
            <option value="draft">Nháp (chưa công khai)</option>
            <option value="published">Đã đăng (công khai)</option>
            <option value="archived">Đã ẩn</option>
          </select>
        </Field>
      </Section>

      <Section title="Vị trí">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Vĩ độ (lat)">
            <input
              type="number"
              step="any"
              value={form.lat ?? ""}
              onChange={(e) => setField("lat", e.target.value === "" ? null : parseFloat(e.target.value))}
              className={inp}
            />
          </Field>
          <Field label="Kinh độ (lng)">
            <input
              type="number"
              step="any"
              value={form.lng ?? ""}
              onChange={(e) => setField("lng", e.target.value === "" ? null : parseFloat(e.target.value))}
              className={inp}
            />
          </Field>
        </div>
        <Field label="Địa chỉ">
          <input value={form.address || ""} onChange={(e) => setField("address", e.target.value)} className={inp} />
        </Field>
        <Field label="Place ID (Google)">
          <input value={form.place_id || ""} onChange={(e) => setField("place_id", e.target.value)} className={inp} />
        </Field>
        <Field label="Google CID">
          <input value={form.google_cid || ""} onChange={(e) => setField("google_cid", e.target.value)} className={inp} />
        </Field>
      </Section>

      <Section title="Nội dung">
        <Field label="Mô tả ngắn">
          <textarea value={form.description || ""} onChange={(e) => setField("description", e.target.value)} className={inp} rows={4} />
        </Field>
        <Field label="Bí quyết người bản địa">
          <textarea value={form.insider_tip || ""} onChange={(e) => setField("insider_tip", e.target.value)} className={inp} rows={3} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Giá tham khảo">
            <input value={form.price_range || ""} onChange={(e) => setField("price_range", e.target.value)} placeholder="200k-500k/người" className={inp} />
          </Field>
          <Field label="Điện thoại">
            <input value={form.phone || ""} onChange={(e) => setField("phone", e.target.value)} className={inp} />
          </Field>
        </div>
        <Field label="Thẻ (cách nhau bằng dấu phẩy)">
          <input value={tagsRaw} onChange={(e) => setTagsRaw(e.target.value)} placeholder="ca-song-da, dac-san, lau" className={inp} />
        </Field>
      </Section>

      <Section title="Hình ảnh">
        <p className="text-xs text-slate-500 mb-2">Ảnh đầu = ảnh bìa (cover). Kéo thả nhiều ảnh cùng lúc.</p>
        <ImageUpload slug={form.slug} value={images} onChange={setImages} />
      </Section>

      {msg && (
        <div className={`rounded-lg p-3 text-sm ${msg.kind === "ok" ? "bg-brand-50 text-brand-800" : "bg-rose-50 text-rose-700"}`}>
          {msg.text}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {saving ? "Đang lưu..." : mode === "new" ? "Tạo địa điểm" : "Lưu thay đổi"}
        </button>
        {mode === "edit" && (
          <button type="button" onClick={remove} className="text-rose-600 hover:underline text-sm">
            Xoá địa điểm
          </button>
        )}
      </div>
    </form>
  );
}

const inp = "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
      <h2 className="font-medium text-slate-900">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs text-slate-500 mb-1">
        {label}{required && <span className="text-rose-500"> *</span>}
      </div>
      {children}
    </label>
  );
}
