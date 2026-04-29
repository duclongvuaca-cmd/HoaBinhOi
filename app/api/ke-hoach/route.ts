/**
 * Multi-agent travel planner.
 * 4 chuyên gia chạy song song: hướng dẫn viên / khách sạn / ngân sách / thổ địa.
 * Composer gộp lại thành kế hoạch markdown.
 */
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getPois } from "@/lib/data";
import { logEvent } from "@/lib/analytics";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "claude-haiku-4-5-20251001";

interface PlanInput {
  query: string;
  days: number;
  budget?: number;
  group?: string;
}

const SYSTEM_BASE = `Bạn là chuyên gia du lịch phường Hoà Bình (Phú Thọ mới sau sáp nhập 1/7/2025).
Trả lời tiếng Việt, ngôi thứ 3 (không "tôi" / "chúng tôi" / "bạn").
Chỉ recommend từ danh sách POI cung cấp — không bịa.

3 TRỤ CỘT chính của Hoà Bình:
1. LÒNG HỒ HOÀ BÌNH (208km², "Hạ Long miền núi") — tour tàu, chèo SUP, Thác Bờ, Đảo Dừa, Đền Bà Chúa
2. ĐẬP THUỶ ĐIỆN (1920MW, công trình thế kỷ XX) — tham quan miễn phí, bảo tàng, đài tưởng niệm
3. CỬA NGÕ TÂY BẮC — 73km từ HN trên QL6, điểm dừng must-stop khi đi Mộc Châu / Mai Châu / Sơn La / Điện Biên

PRIORITIZATION rule:
- Nếu khách hỏi vague "1 ngày HB" / "cuối tuần" → ưu tiên đề xuất TOUR LÒNG HỒ + ĐẬP THUỶ ĐIỆN trước
- Nếu khách nhắc Mộc Châu/Sơn La/Mai Châu/Tây Bắc → đề xuất HB là điểm DỪNG CHÂN giữa hành trình
- Nếu khách hỏi "ngắm cảnh" / "hùng vĩ" / "thiên nhiên" → đề xuất LÒNG HỒ trước Mai Châu`;

function poiList(pois: any[]) {
  return pois.map((p) =>
    `- slug=${p.slug} | ${p.name} | ${p.category} | giá: ${p.price_range || "?"} | ${(p.description || "").slice(0, 100)}`
  ).join("\n");
}

async function runAgent(client: Anthropic, system: string, user: string) {
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 600,
    system,
    messages: [{ role: "user", content: user }]
  });
  const block = msg.content[0];
  return block.type === "text" ? block.text : "";
}

export async function POST(req: Request) {
  try {
    const body: PlanInput = await req.json();
    const { query, days = 1, budget, group } = body;
    if (!query || query.length < 5) {
      return NextResponse.json({ error: "Mô tả ngắn quá" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI chưa cấu hình" }, { status: 503 });
    }

    const pois = await getPois();
    const ctx = poiList(pois);
    const userBlock = `
Yêu cầu khách: "${query}"
Số ngày: ${days}
${budget ? `Ngân sách: ${budget.toLocaleString("vi-VN")}đ/người` : ""}
${group ? `Nhóm khách: ${group}` : ""}

Danh sách địa điểm có sẵn:
${ctx}
`.trim();

    const client = new Anthropic({ apiKey });

    const [hdv, hotel, budgetOut, local] = await Promise.all([
      runAgent(client,
        `${SYSTEM_BASE}
Vai: HƯỚNG DẪN VIÊN. Đề xuất lịch trình từng ngày, chia khung giờ (sáng/trưa/chiều/tối).
Output markdown, mỗi ngày 1 section. Mỗi địa điểm bullet kèm slug=... để link sau.
Chỉ liệt kê 4-7 địa điểm cho 1 ngày.`,
        userBlock),
      runAgent(client,
        `${SYSTEM_BASE}
Vai: CHUYÊN GIA KHÁCH SẠN. Đề xuất 2-3 nơi nghỉ phù hợp ngân sách + nhóm khách.
Output markdown ngắn: tên + slug + lý do (1 câu) + giá tham khảo.
Chỉ chọn từ danh mục "nghi" trong POI list.`,
        userBlock),
      runAgent(client,
        `${SYSTEM_BASE}
Vai: CHUYÊN GIA NGÂN SÁCH. Phân tích chi phí dự kiến: ăn / ở / di chuyển / vé tham quan / khác.
Output markdown bảng. Đưa con số VND realistic.
Tổng cuối phải nằm trong / gần ngân sách khách (nếu có).`,
        userBlock),
      runAgent(client,
        `${SYSTEM_BASE}
Vai: THỔ ĐỊA. 4-6 bí quyết / lưu ý / cảnh báo người bản địa biết.
Vd: thời điểm tránh đông, món đặt trước, tuyến tránh tắc, đặc sản chợ phiên ngày nào.
Output markdown bullets, mỗi bullet 1-2 câu.`,
        userBlock)
    ]);

    const composer = await runAgent(client,
      `${SYSTEM_BASE}
Vai: TỔNG BIÊN TẬP. Gộp 4 phần dưới thành 1 kế hoạch markdown hoàn chỉnh có cấu trúc:
# Tổng quan (2-3 câu mở đầu)
## Lịch trình
## Nơi nghỉ
## Ngân sách
## Bí quyết người bản địa

Giữ nguyên slug=... trong link để hệ thống tự gắn link.`,
      `Yêu cầu khách: "${query}", ${days} ngày${budget ? `, ${budget.toLocaleString("vi-VN")}đ` : ""}.

[HDV]:
${hdv}

[KS]:
${hotel}

[NGÂN SÁCH]:
${budgetOut}

[THỔ ĐỊA]:
${local}`);

    await logEvent("ai_plan_generated", { meta: { days, budget, group, query: query.slice(0, 100) } });

    return NextResponse.json({
      plan: composer,
      agents: { hdv, hotel, budget: budgetOut, local },
      pois: pois.map((p) => ({ slug: p.slug, name: p.name }))
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Lỗi gen kế hoạch" }, { status: 500 });
  }
}
