/**
 * Claude AI suggestion endpoint.
 * POST { query: string, days?: number, budget?: number }
 * → trả về danh sách POI gợi ý + 1 đoạn lý do.
 *
 * KHÔNG dùng API key của SOTA House — dùng key riêng cho project này.
 */
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getPois } from "@/lib/data";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { query, days = 1, budget } = await req.json();
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "query required" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey.includes("YOUR_KEY")) {
      return NextResponse.json({
        error: "AI chưa cấu hình. Set ANTHROPIC_API_KEY trong .env.local"
      }, { status: 503 });
    }

    const pois = await getPois();
    const poiList = pois.map(p =>
      `- ${p.slug} | ${p.name} | ${p.category} | ${p.price_range || "?"} | ${p.description?.slice(0, 80) || ""}`
    ).join("\n");

    const client = new Anthropic({ apiKey });
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      system: `Bạn là chuyên gia du lịch phường Hoà Bình (Phú Thọ mới). Trả lời tiếng Việt.
Chỉ recommend POI từ danh sách bên dưới. Output JSON: {"reasoning": "...", "poi_slugs": [...]}.
Danh sách POI:
${poiList}`,
      messages: [{
        role: "user",
        content: `Khách: "${query}". Số ngày: ${days}.${budget ? ` Ngân sách: ${budget}đ/người.` : ""} Gợi ý 3-7 POI phù hợp nhất + lý do ngắn gọn.`
      }]
    });

    const text = (msg.content[0] as any).text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ raw: text, error: "Không parse được JSON từ AI" }, { status: 500 });
    }
    const parsed = JSON.parse(jsonMatch[0]);
    const matched = pois.filter(p => parsed.poi_slugs?.includes(p.slug));

    return NextResponse.json({
      reasoning: parsed.reasoning,
      pois: matched,
      usage: msg.usage
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
