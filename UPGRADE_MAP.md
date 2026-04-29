# HoaBinhOi — Upgrade Map (2026-04-29)

> Tách biệt hoàn toàn SOTA House. Không import, không chia sẻ DB, không chia sẻ env.
> Project độc lập tại `C:\HoaBinhOi\`, port dev 3001, Supabase riêng, Claude key riêng.

---

## A. Snapshot hiện tại (đã có gì sau session 2026-04-28)

### Stack đã chốt
- **Frontend:** Next.js 15 (App Router) + React 19 + Tailwind 3
- **Backend/DB:** Supabase (Postgres + Auth + Storage)
- **Map:** Mapbox GL JS
- **AI:** Claude API (Haiku 4.5) — key riêng
- **Hosting:** Vercel region `sin1`
- **Domain dự kiến:** hoabinhoi.vn

### Code đã viết (~858 dòng + seed)
| Layer | File | Dòng | Status |
|---|---|---|---|
| Routes | `app/page.tsx` (landing) | 21 | ✅ |
| Routes | `app/an,mua,nghi,choi,diem-den,su-kien/page.tsx` | ~7 mỗi | ✅ shell, render `<CategoryPage>` |
| Routes | `app/ban-do/page.tsx` | 24 | ✅ |
| Routes | `app/hanh-trinh/page.tsx` + `[slug]/page.tsx` | 47+? | ✅ |
| Routes | `app/poi/[slug]/page.tsx` | ? | ✅ |
| Routes | `app/admin/login/`, `app/admin/poi/` | 0 | ❌ **folder rỗng** |
| API | `/api/ai-suggest` (Claude Haiku) | 63 | ✅ |
| API | `/api/subscribe` | 24 | ✅ |
| API | `/api/admin/*` | — | ❌ chưa có |
| Components | hero, itinerary-preview, poi-grid, poi-card, local-secrets, ai-suggest, map-view, nav, footer, email-signup, category-page | 758 | ✅ |
| Lib | `data.ts` (Supabase + JSON fallback), `types.ts`, `supabase-server/browser.ts` | ~150 | ✅ |
| Schema | `data/schema.sql` — 6 bảng + RLS | 112 | ✅ chưa apply lên Supabase |
| Seeds | `seed-pois.json` (30 POI), `seed-itineraries.json` (5 itinerary) | — | ✅ |
| Scripts | `seed-pois.ts`, `ingest-gmaps.ts` | 95 | ✅ chạy được khi có env |

### Verify isolation với SOTA House
- ✅ `grep -r "AI_System|sota_|SOTA|duckdb|warehouse"` → 0 hit production code (chỉ 1 comment cảnh báo)
- ✅ Port riêng (3001 vs SOTA 8503)
- ✅ DB riêng (Supabase Postgres vs DuckDB local)
- ✅ Anthropic key riêng (sẽ tạo workspace riêng)
- ✅ Folder riêng `C:\HoaBinhOi\` không trong `C:\AI_System\`

### Gap nghiêm trọng
- ❌ Không có `.env.local` → app chạy fallback JSON, không kết nối Supabase
- ❌ Supabase project chưa tạo
- ❌ Admin CMS folder rỗng → không có cách edit POI ngoài chỉnh JSON
- ❌ Không auth → ai cũng vào `/admin` được nếu có page
- ❌ Mapbox token chưa có → `<MapView>` chưa hoạt động
- ❌ Chưa deploy Vercel
- ❌ Chưa mua domain
- ❌ `public/` rỗng (no favicon, no og-image)
- ❌ Không có sitemap.xml, robots.txt
- ❌ Reviews schema có nhưng chưa có UI

---

## B. 5 wave nâng cấp (8 tuần)

### Wave 1 — Foundation lên không khí (Tuần 1)
**Mục tiêu:** App chạy local có data thật từ Supabase. Anh edit POI bằng admin UI.

| # | Task | File mới/sửa | Loại | ETA |
|---|---|---|---|---|
| W1.1 | Tạo Supabase project (region Singapore) | dashboard.supabase | Tự làm | 30p |
| W1.2 | Run `data/schema.sql` trong SQL Editor | — | Tự làm | 10p |
| W1.3 | Tạo `.env.local` với Supabase URL + 2 key | `.env.local` | Tự làm | 10p |
| W1.4 | `npm run seed` — push 30 POI + 5 itinerary | — | Tự làm | 15p |
| W1.5 | Tạo Mapbox account + lấy token | account.mapbox | Tự làm | 15p |
| W1.6 | Anthropic console: tạo workspace `HoaBinhOi` + key riêng | console.anthropic | Tự làm | 10p |
| W1.7 | `npm run dev` — verify local có data + map + AI | — | Tự làm | 15p |
| W1.8 | **Admin auth page**: `app/admin/login/page.tsx` (Supabase magic link) | mới ~80 dòng | Tự làm | 1h |
| W1.9 | **Admin layout + middleware**: `app/admin/layout.tsx` + `middleware.ts` (block khi chưa login) | mới ~60 dòng | Tự làm | 1h |
| W1.10 | **Admin POI list**: `app/admin/poi/page.tsx` (table + search + draft/published filter) | mới ~150 dòng | Tự làm | 2h |
| W1.11 | **Admin POI edit**: `app/admin/poi/[slug]/page.tsx` (form sửa name/desc/tip/category/lat-lng/tags/status) | mới ~200 dòng | Tự làm | 3h |
| W1.12 | **Admin POI new**: `app/admin/poi/new/page.tsx` (paste GG Maps URL → auto-fill coords/cid → manual content) | mới ~150 dòng | Tự làm | 2h |
| W1.13 | API `/api/admin/poi` (POST/PATCH/DELETE) — service role bypass RLS | mới ~100 dòng | Tự làm | 1h |
| W1.14 | Seed allow-list email admin trong env (`ADMIN_EMAILS=duclongvuaca@gmail.com,...`) | env | Tự làm | 5p |

**Output Wave 1:** App local + admin CMS hoạt động. Anh thêm/sửa POI bằng web không cần code.

---

### Wave 2 — Content + SEO + UGC (Tuần 2-3)
**Mục tiêu:** Có 50+ POI chất lượng, page POI detail đẹp, SEO sẵn sàng, user gửi review được.

| # | Task | File mới/sửa | Loại | ETA |
|---|---|---|---|---|
| W2.1 | Polish `app/poi/[slug]/page.tsx` — image gallery + map + insider tip + reviews list | sửa | Tự làm | 3h |
| W2.2 | Polish `app/hanh-trinh/[slug]/page.tsx` — timeline + map với markers các stop | sửa | Tự làm | 2h |
| W2.3 | `app/api/reviews/route.ts` — POST review (tự động `status='pending'`) | mới ~50 dòng | Tự làm | 1h |
| W2.4 | Component `<ReviewForm>` + `<ReviewList>` trong POI detail | mới ~120 dòng | Tự làm | 2h |
| W2.5 | Admin `/admin/reviews/page.tsx` — moderate (approve/reject) | mới ~100 dòng | Tự làm | 1h |
| W2.6 | `app/sitemap.ts` (auto-generate từ pois + itineraries) | mới ~40 dòng | Tự làm | 30p |
| W2.7 | `app/robots.ts` + `app/manifest.ts` (PWA-ready) | mới ~30 dòng | Tự làm | 30p |
| W2.8 | Open Graph image generator `app/opengraph-image.tsx` | mới ~50 dòng | Tự làm | 1h |
| W2.9 | Favicon + apple-touch-icon + og-image bộ | `public/` | Tự làm | 1h |
| W2.10 | JSON-LD schema.org cho POI (`TouristAttraction`/`Restaurant`) trong page detail | sửa | Tự làm | 1h |
| W2.11 | Ingest 20 POI mới: dùng `npm run ingest-gmaps <url> <cat>` từ Maps URLs | seed-pois | Tự làm | 3h |
| W2.12 | Viết content (description + insider_tip) cho 20 POI mới qua admin UI | — | Tự làm | 4h |
| W2.13 | Image upload module: Supabase Storage bucket `poi-images` + form upload | sửa admin | Tự làm | 2h |

**Output Wave 2:** 50+ POI, mỗi POI có 3-5 ảnh + insider tip, review form công khai, SEO ngon.

---

### Wave 3 — AI multi-agent + chuẩn bị demo bí thư (Tuần 4)
**Mục tiêu:** AI travel planner (4 chuyên gia) + 1 demo có power để show bí thư phường.

| # | Task | File | Loại | ETA |
|---|---|---|---|---|
| W3.1 | Refactor `/api/ai-suggest` thành multi-agent: 4 vai (HDV / khách sạn / ngân sách / thổ địa) | sửa ~150 dòng | Tự làm | 4h |
| W3.2 | Component `<TravelPlanner>` — full page form (số ngày/budget/persona/sở thích) → output itinerary streaming | mới ~250 dòng | Tự làm | 4h |
| W3.3 | Page `app/ke-hoach/page.tsx` (URL "kế hoạch") chứa planner | mới ~30 dòng | Tự làm | 30p |
| W3.4 | Lưu plan đã gen vào `generated_itineraries` table (optional save link) | sửa schema | Tự làm | 1h |
| W3.5 | Translation EN cho 5 itinerary chính (toggle ngôn ngữ trong header) | sửa layout | Tự làm | 2h |
| W3.6 | Photo recognition demo: upload ảnh → Claude Vision → "đây là cá lăng/măng đắng/..." | mới ~80 dòng | Tự làm | 2h |
| W3.7 | Voice intro 30s VI cho landing — TTS Claude/ElevenLabs (1 lần gen, nhúng MP3) | sửa hero | Tự làm | 1h |
| W3.8 | Analytics: log event vào `events` table mỗi khi user ask AI/click POI/subscribe | sửa | Tự làm | 1h |
| W3.9 | **Demo deck PDF** (10 slide, làm trong Slides) cho buổi gặp bí thư | tài liệu | Tự làm | 3h |

**Output Wave 3:** AI 4-agent live, demo deck + URL share được. Sẵn sàng đặt lịch gặp bí thư.

---

### Wave 4 — Production launch (Tuần 5-6)
**Mục tiêu:** Domain live, deploy production, ads chạy, FB/Zalo group seeded.

| # | Task | File | Loại | ETA |
|---|---|---|---|---|
| W4.1 | Mua domain `hoabinhoi.vn` (Mắt Bão / iNet, ~750k) | external | **Phụ thuộc** | 1-3 ngày (verify CMND) |
| W4.2 | Mua thêm `hoabinhoi.com` (Cloudflare ~$10) | external | Tự làm | 30p |
| W4.3 | Deploy Vercel: `vercel --prod` + add env vars + connect domain | — | Tự làm | 1h |
| W4.4 | DNS propagate + SSL auto (Vercel handle) | — | **Phụ thuộc** (5p-24h) | wait |
| W4.5 | Setup Vercel Analytics + Speed Insights (free) | dashboard | Tự làm | 15p |
| W4.6 | Production smoke test: `https://hoabinhoi.vn` 5 trang chính + AI + admin | — | Tự làm | 1h |
| W4.7 | Tạo FB Page "Hoà Bình Ơi" + Zalo OA (official account) | external | Tự làm | 2h |
| W4.8 | Lấy 3 reel ngắn 30s trên TikTok về Hoà Bình → embed landing | — | Tự làm | 1h |
| W4.9 | FB ads $30 budget reach Hà Nội 25-45t interest "du lịch" | dashboard | Tự làm | 1h |
| W4.10 | Seed 5 bài FB Group "Phượt Hoà Bình", "Ăn chơi Phú Thọ" | external | Tự làm | 2h |
| W4.11 | Track ads → Vercel Analytics (UTM tags) | sửa | Tự làm | 30p |

**Output Wave 4:** Site live, có traffic ban đầu (mục tiêu 500 unique tuần đầu).

---

### Wave 5 — Demo bí thư + xin gov data (Tuần 6-7)
**Mục tiêu:** Pitch xong, có ít nhất 2 deliverable từ phường.

| # | Task | Loại | Risk |
|---|---|---|---|
| W5.1 | Đặt lịch gặp bí thư phường — show URL live + demo deck | **Phụ thuộc** anh chủ động | LOW |
| W5.2 | Pitch: deliverable PR + KPI cho bí thư + đề xuất phối hợp | — | LOW |
| W5.3 | Xin: danh sách sự kiện phường tháng tới | **Phụ thuộc** văn phòng UBND | MEDIUM |
| W5.4 | Xin: danh sách điểm WC công cộng + toạ độ (smart toilet locator) | **Phụ thuộc** | LOW |
| W5.5 | Xin: contact 3 ban quản lý điểm Thuỷ điện / Thác Bờ / Kim Bôi | **Phụ thuộc** | HIGH |
| W5.6 | Xin: 1 quote bí thư + 3 ảnh phường để nhúng landing (social proof) | **Phụ thuộc** | LOW |
| W5.7 | Cam kết với bí thư: tháng đầu PR 5 bài + share 10 nhóm + chạy ads | nội bộ | LOW |

**Output Wave 5:** Anh có political asset cụ thể — quote, ảnh, contact. Mở đường Wave 6+.

---

### Wave 6+ — Long game (Tuần 8+, 6 tháng tới)
| Mục | Phụ thuộc | Risk |
|---|---|---|
| Affiliate Agoda integration | Đăng ký Agoda Partner — cần traffic ≥1k/tháng | LOW |
| Hotel/homestay direct booking | Negotiate từng homestay HB | HIGH |
| Unified ticket Thuỷ điện + Thác Bờ + Kim Bôi | Phường + Sở VH-TT-DL Phú Thọ + ban quản lý | VERY HIGH (moat) |
| Real-time event data feed phường | Văn phòng UBND share endpoint/email | MEDIUM |
| One-click complaint route | API/email từ phường | LOW |
| Crowd density / tourist count | Camera/sensor — phường đầu tư | HIGH (cost lớn) |
| Zalo Mini App | Zalo Mini Developer + duyệt VNG | MEDIUM (~2-4 tuần) |
| MoMo / ZaloPay merchant | Đăng ký + giấy phép kinh doanh | MEDIUM |
| AR overlay (Mapbox/8thWall) | 3D scan + vendor | HIGH (đắt) |
| KOL livestream commerce | Negotiate KOL địa phương + budget | MEDIUM |
| Multi-province (extend 2 siêu phường Phú Thọ) | Bí thư các phường khác | VERY HIGH |
| Sponsor Sở VH-TT-DL Phú Thọ | Báo cáo qua bí thư phường lên tỉnh | HIGH (văn bản) |
| Báo chí PR (báo HB, VTV địa phương) | Bí thư giới thiệu | MEDIUM |

---

## C. Critical path & gating

```
Wave 1 [DO NOW]
  ↓ (Wave 1 hoàn thành = local + admin chạy)
Wave 2 [content + UGC, SEO]
  ↓ (50+ POI + page detail đẹp)
Wave 3 [AI multi-agent + demo deck]
  ↓ (có weapon để pitch)
Wave 4 [domain + deploy + ads]
  ↓ (site live, có traffic)
Wave 5 [demo bí thư] ────► moment political quyết định
  ↓
Wave 6+ [phụ thuộc bên ngoài, long game]
```

**Gate cứng:**
1. KHÔNG đi Wave 4 trước Wave 3 — vì Wave 3 cho ra demo deck mà bí thư cần thấy.
2. KHÔNG xin gov data ở Wave 5 nếu chưa có site live ở Wave 4 — bí thư cần thấy thứ thật, không phải PowerPoint.
3. KHÔNG bắt đầu Wave 6 trước khi có ≥3 deliverable từ Wave 5 — nếu phường không cộng tác thì pivot strategy.

---

## D. Phân loại tổng: Tự làm vs Phụ thuộc

### Tự làm (anh + Claude Code) — 100% trong Wave 1-4
- ~50 task kỹ thuật (admin CMS, AI, SEO, UGC, deploy, ads)
- ~6 tuần effort tập trung (~80h coding + ~20h content)
- Không cần xin ai. Critical path không blocker bên ngoài.

### Phụ thuộc bên ngoài — Wave 5+
| Loại phụ thuộc | Số task | Thời gian chờ |
|---|---|---|
| Đăng ký dịch vụ (domain, Vercel, Agoda, Zalo Mini, MoMo) | ~6 | 1 ngày - 4 tuần |
| Bí thư phường + UBND | ~5 | 1 tuần - vô hạn |
| Sở VH-TT-DL Phú Thọ + tỉnh | ~3 | 1-3 tháng (văn bản) |
| Vendor (3D, KOL, camera) | ~3 | tuỳ negotiate |
| Multi-province (bí thư 2 phường khác) | ~2 | 6-12 tháng |

**Quy tắc lõi:** Phase 1 (Wave 1-4) phải ship được dù KHÔNG ai trả lời anh. Phase 2 (Wave 5+) là political game — biết kiên nhẫn, không dependency 1 người.

---

## E. Câu hỏi cần anh quyết trước khi bắt đầu Wave 1

1. **Email admin nào allow-list?** (Mặc định `duclongvuaca@gmail.com`. Thêm Tài / vợ / bí thư?)
2. **Supabase free tier (500MB DB, 1GB storage) đủ Wave 1-4 không?** Có. Lên Pro $25/m khi >100k pageview/tháng.
3. **Mapbox free tier (50k loads/tháng) đủ?** Wave 1-4 OK. Sau khi traffic cao mới lo.
4. **Domain `.vn` cần CMND** — anh có sẵn để gửi Mắt Bão/iNet không?
5. **Budget Wave 1-4:** Domain (.vn 750k + .com $10) + Anthropic Claude (~$10/m start) + FB ads (~$30/đợt) = ~1.5tr setup + ~500k/tháng vận hành.

Trả lời 5 câu → bắt đầu Wave 1.

---

> Snapshot 2026-04-29. File: `C:\HoaBinhOi\UPGRADE_MAP.md`
