import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

const RATE_LIMIT_PER_HOUR = 5;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = String(body.poi_slug || "").trim();
    const author = String(body.author_name || "").trim().slice(0, 60);
    const rating = Number(body.rating);
    const text = String(body.body || "").trim().slice(0, 2000);

    if (!slug) return NextResponse.json({ error: "Thiếu poi_slug" }, { status: 400 });
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Đánh giá phải từ 1-5 sao" }, { status: 400 });
    }
    if (text.length < 10) {
      return NextResponse.json({ error: "Bình luận quá ngắn (≥10 ký tự)" }, { status: 400 });
    }

    const sb = createClient();
    const { data: poi } = await sb.from("pois").select("id").eq("slug", slug).maybeSingle();
    if (!poi) return NextResponse.json({ error: "Địa điểm không tồn tại" }, { status: 404 });

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await sb
      .from("reviews")
      .select("id", { count: "exact", head: true })
      .eq("poi_id", poi.id)
      .gte("created_at", since)
      .eq("author_name", author || ip);
    if ((count ?? 0) >= RATE_LIMIT_PER_HOUR) {
      return NextResponse.json({ error: "Quá nhiều review trong 1 giờ — thử lại sau" }, { status: 429 });
    }

    const { error } = await sb.from("reviews").insert({
      poi_id: poi.id,
      author_name: author || "Khách",
      rating,
      body: text,
      status: "pending"
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true, message: "Cảm ơn — review sẽ hiện sau khi duyệt." });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
