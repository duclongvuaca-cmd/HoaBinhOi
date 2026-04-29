/**
 * Nhận diện món ăn / cảnh / hoa Hoà Bình bằng Claude Vision.
 * POST FormData { image: File }
 */
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { logEvent } from "@/lib/analytics";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(req: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "AI chưa cấu hình" }, { status: 503 });

    const form = await req.formData();
    const file = form.get("image");
    if (!(file instanceof File)) return NextResponse.json({ error: "Thiếu ảnh" }, { status: 400 });
    if (!ALLOWED.has(file.type)) return NextResponse.json({ error: "Chỉ JPG/PNG/WEBP/GIF" }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: "Ảnh quá 5MB" }, { status: 400 });

    const buf = Buffer.from(await file.arrayBuffer());
    const base64 = buf.toString("base64");

    const client = new Anthropic({ apiKey });
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: `Bạn là chuyên gia ẩm thực + thiên nhiên Hoà Bình (Tây Bắc VN, dân tộc Mường, Thái).
Khách gửi ảnh — bạn nhận diện và trả lời tiếng Việt theo cấu trúc:

**Đối tượng:** [tên cụ thể nếu rõ, vd "Cá lăng nướng giấy bạc" / "Hoa ban trắng" / "Bản Lác Mai Châu"]
**Mô tả:** [1-2 câu mô tả khách quan]
**Liên quan Hoà Bình:** [đặc sản/cảnh quan/văn hoá vùng Hoà Bình hay không, 1-2 câu]
**Mẹo người bản địa:** [1 mẹo cụ thể — ăn ở đâu, mùa nào, lưu ý gì]

Nếu không nhận ra → nói thẳng "Chưa nhận diện được rõ" + đoán gần đúng.`,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: file.type as any, data: base64 } },
          { type: "text", text: "Đây là gì? Có liên quan Hoà Bình không?" }
        ]
      }]
    });

    const text = msg.content[0].type === "text" ? msg.content[0].text : "";
    await logEvent("photo_recognized", { meta: { type: file.type, size: file.size } });

    return NextResponse.json({ result: text, usage: msg.usage });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
