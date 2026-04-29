# HoaBinhOi — Phân tích chiến lược (rewrite 2026-04-29)

> **TL;DR** — App du lịch phường Hoà Bình. Mục tiêu cuối **không** phải tiền,
> mà là **quan hệ chính trị với phường** (bí thư giao trực tiếp, miệng).
> Reference model = app du lịch cấp tỉnh Trung Quốc (Yunnan, Zhejiang, Mafengwo, Ctrip).
> Roadmap chia 7 tier feature; HoaBinhOi hiện ở Tier 1 (~70%) + Tier 3 (~30%).

---

## Phần 1 — Bối cảnh dự án

### 1.1 Phường Hoà Bình mới
| Item | Giá trị |
|---|---|
| Hình thành | Sáp nhập 1/7/2025 — gộp 7 phường cũ (Đồng Tiến, Hữu Nghị, Phương Lâm, Quỳnh Lâm, Tân Thịnh, Thịnh Lang, Trung Minh) |
| Vị thế | 1 trong 3 "siêu phường" tỉnh Phú Thọ mới (Phú Thọ + Vĩnh Phúc + Hoà Bình cũ) |
| Dân số | ~79.000 — đông nhất tỉnh |
| Khoảng cách HN | 73 km, ~1h30 xe — pool khách HN 8M+ |

### 1.2 Stakeholder chain
```
Bí thư phường  ──(giao miệng)──▶  Anh Long (chủ + chi tiền + dev phase 1)
                                      │
                                      ├──▶ Phase 2: thuê dev có kinh nghiệm
                                      │
              ┌───────────────────────┼───────────────────────┐
              ▼                       ▼                       ▼
   Bí thư có deliverable PR   Anh build quan hệ        2 BU F&B Long Phượng
                              chính trị dài hạn        hưởng traffic du lịch
```

### 1.3 Mục tiêu thật (đã user xác nhận 2026-04-28)
**MỤC TIÊU CUỐI = QUAN HỆ với chính quyền phường. Kinh tế là phụ.**

3 lớp giá trị, theo thứ tự ưu tiên:
1. **Political capital** — bí thư có sản phẩm để PR/báo cáo KPI; anh được biết đến là "người trẻ làm được việc cho phường".
2. **Business spillover** — Vua Cá + sân pickleball Long Phượng hưởng traffic du lịch.
3. **Tài sản số** — app/data nếu scale ra 2 siêu phường còn lại của Phú Thọ.

### 1.4 Approach rule (anh nhấn mạnh)
- ✅ **Tích cực trước, tiêu cực sau** — pitch không paint risk negative
- ✅ **Kinh tế + chính trị đi đầu** — 2 driver chính
- ✅ **Risk tính sau khi làm** — không paralysis-by-analysis
- ✅ **Chạy ads** — push reach
- ❌ KHÔNG perfectionist UX trước khi có user
- ❌ KHÔNG native iOS/Android trước khi web có traction

### 1.5 Asset có sẵn (lợi thế khởi điểm)
- **Vua Cá Long Phượng** đã được vietnambooking.com, mia.vn liệt kê trong "nhà hàng ngon Hoà Bình"
- **Sân pickleball Long Phượng** — niche mới, có thể là điểm nhấn
- **2 location** đã ingest vào `sota_locations` với coords + Google place_id
- **SOTA House data infra** — không phải build từ 0

### 1.6 Cạnh tranh
| Loại đối thủ | Ai đang có | Khoảng trống |
|---|---|---|
| App riêng cho Hoà Bình | Không ai | **First mover** — anh đi đầu |
| Web cẩm nang chung | mia.vn, cungphuot.info, traveloka, peacetour | Họ không deep cho Hoà Bình |
| Web tour operator | peacetour.com.vn, dulichdemen | → Affiliate partner tiềm năng, không phải đối thủ |

---

## Phần 2 — Reference model: App du lịch cấp tỉnh Trung Quốc

### 2.1 Apps anh muốn copy

| App | Operator | Loại | Điểm copy |
|---|---|---|---|
| **游云南 (You Yunnan)** | Sở VH-DL Vân Nam + Tencent | Provincial super-app + WeChat mini | IoT/cloud/big data/AI tích hợp; livestream 16 prefectures realtime |
| **Zhejiang Travel** | Sở VH-DL Chiết Giang | Provincial smart tourism (launch 6/2025) | 4 module + multi-agent AI (Tongyi Qianwen + DeepSeek) |
| **Mafengwo (蜂窝)** | Tư nhân | UGC: TripAdvisor + IG + Lonely Planet hybrid | Travel diaries, Q&A, photo sharing — millennial/Gen Z |
| **Ctrip / Trip.com** | Tư nhân | OTA dominant — 40% market, 300M MAU | Booking flow: hotel + flight + car + ticket unified |
| **Dianping/Meituan** | Tư nhân | Review + booking, 4.4M merchants | Review + ratings + merchant onboarding |
| **Beijing 74-attraction** | Sở VH-DL Bắc Kinh | WeChat mini-program | Unified ticketing 74 điểm 1 QR |

### 2.2 Khung 7 tier feature

```
Tier 7 ┃ Ecosystem (mini-program, multi-province, B2B)         ◀── long game
Tier 6 ┃ Social/UGC (travel diary, Q&A, photo sharing)         ◀── Mafengwo style
Tier 5 ┃ Government services (Easy Go QR, complaint, crowd)    ◀── moat chính trị
Tier 4 ┃ Live + AR/VR (livestream, AR overlay, audio guide)    ◀── đắt
Tier 3 ┃ AI agents (planner, multi-agent chuyên gia)           ◀── Zhejiang model
Tier 2 ┃ Booking + Payment (unified ticket, hotel, QR entry)   ◀── monetize
Tier 1 ┃ Information (POI, maps, reviews, itineraries)         ◀── nền tảng
```

### 2.3 Chi tiết từng tier (rút từ apps TQ)

**Tier 1 — Information**
- POI directory: ăn / mua / nghỉ / chơi / điểm đến
- Maps + coords + place_id
- Reviews + ratings (Mafengwo + Dianping core)
- Curated itineraries (1-day, 2-day, weekend)

**Tier 2 — Booking + Payment**
- Unified ticketing nhiều điểm (Beijing 74 điểm = 1 QR; Zhejiang multi-attraction)
- Hotel/car/flight integrated (Ctrip core flow)
- QR entry + face recognition
- Discounted advance ticket
- WeChat Pay/Alipay 1-tap

**Tier 3 — AI agents**
- AI travel planner (input thời gian/budget/sở thích → output itinerary)
- **4 agent chuyên gia (Zhejiang)**: hướng dẫn viên / khách sạn / ngân sách / thổ địa
- Personalized recommendation (deep learning)
- Photo recognition (hoa, cảnh, món ăn)
- Real-time translation (EN/CN cho khách quốc tế)

**Tier 4 — Live + AR/VR**
- Livestream từ điểm đến (Vân Nam: 16 prefectures realtime)
- AR overlay tại điểm (museum, di tích)
- VR exploration (Mogao Grottoes — VR Cave 285)
- Voice-guided audio tour
- Influencer livestream commerce (flash sale)

**Tier 5 — Government services**
- "Easy Go" travel code — 1 QR cho hải quan, payment, accommodation, transport
- Real-time tourist count / crowd density
- Smart toilet locator
- 30-day no-reason return policy
- One-click complaint
- Real-time event data từ phường

**Tier 6 — Social / UGC**
- Travel diary từ user
- Q&A forum
- Self-driving route recommendations
- Photo + video sharing với hashtag địa điểm
- Influencer creator program

**Tier 7 — Ecosystem**
- Mini-program trong super-app (WeChat → **Zalo Mini App** ở VN)
- Multi-province platform (extend ra 3 siêu phường Phú Thọ)
- Cross-border tourism (Lào, TQ giáp ranh)
- B2B platform cho operator + agency

---

## Phần 3 — VN context: KHÔNG copy mù

| Thành phần | China | VN equivalent | Ghi chú |
|---|---|---|---|
| Super-app | WeChat | **Zalo** (~70M MAU) | Không có alternative thực sự |
| Mini-program | WeChat Mini | Zalo Mini App, FB Instant | Zalo Mini là pick chính |
| Payment | WeChat Pay/Alipay | **MoMo, ZaloPay, VietQR** | Phải tích 3 cổng, không độc quyền 1 |
| Big-tech sponsor | Tencent (Yunnan) | VNG, Tiki, Sky Mavis... | Nhỏ hơn TQ — khó kêu gọi sponsor |
| Government partner | Sở VH-DL tỉnh | **UBND phường + Sở VH-TT-DL Phú Thọ** | Anh đã có quan hệ phường |
| Map base | Baidu + Amap | **Google Maps + VietMap** | Google Maps đủ cho phase 1 |
| Livestream | Douyin + Kuaishou | **TikTok VN + FB Live** | Embed thay vì tự xây |
| OTA dominant | Ctrip 40% | Booking.com + Agoda + Vntrip | Affiliate Agoda là path nhanh nhất |

**4 sai lầm phải tránh khi copy:**
1. Đừng tự xây payment gateway — tích MoMo/ZaloPay
2. Đừng đợi Tencent VN — không có; phải bootstrap
3. Đừng bỏ qua FB/Zalo group — đó là kênh discovery #1 ở VN, khác TQ
4. Đừng làm tiếng Trung trước tiếng Anh — pool khách quốc tế ở Hoà Bình chủ yếu Tây ba lô

---

## Phần 4 — Gap analysis HoaBinhOi (2026-04-28)

| Tier | Status hiện tại | Nỗ lực fill gap | Priority |
|---|---|---|---|
| 1 — Info | ✅ ~70% | Thêm reviews + ratings | LOW (đã có roadmap) |
| 2 — Booking | ❌ 0% | Affiliate Agoda + ticketing tự xây | **HIGH** — monetize |
| 3 — AI agent | 🟡 ~30% | Multi-agent (4 chuyên gia Zhejiang) | MEDIUM |
| 4 — Live/AR/VR | ❌ 0% | TikTok embed + livestream URL + AR Mapbox | LOW (đắt) |
| 5 — Gov services | ❌ 0% | Partnership phường — political moat | **HIGH** — anh có quan hệ |
| 6 — UGC | ❌ 0% | Reviews + diary + photo upload | MEDIUM |
| 7 — Ecosystem | ❌ 0% | Zalo Mini App + multi-tenant | Phase 12+ |

**2 ô đáng đầu tư nhất** = Tier 2 (monetize) + Tier 5 (political moat). Anh có lợi thế quan hệ phường — không đối thủ nào copy được.

---

## Phần 5 — Roadmap đã chỉnh sau research

| Phase | Nội dung | Tier liên quan | Trạng thái |
|---|---|---|---|
| **5** | Admin CMS + Agoda affiliate + SEO | T1, T2 | Đang dở, **pause** |
| 6 | AI multi-agent (4 chuyên gia: HDV / KS / budget / thổ địa) | T3 | Tiếp theo |
| 7 | UGC — reviews + travel diary + photo upload | T6 | |
| 8 | Zalo Mini App (analog WeChat mini) | T7 | |
| 9 | Livestream embed (TikTok/FB) + AR layer (Mapbox) | T4 | |
| 10 | Government services — phối hợp phường: real-time event, complaint, unified ticket Thuỷ điện + Thác Bờ + Kim Bôi | T5 | **Political deliverable cao nhất** |
| 11 | Voice guide audio tour (VI/EN) | T4 | |
| 12 | Multi-tenant — extend 2 siêu phường Phú Thọ khác | T7 | Long game |

---

## Phần 6 — Decision rules cho mọi feature mới

Trước khi build feature mới, chạy 4 check:

1. **Tier check** — feature này thuộc tier nào trong 7? Nếu không xác định được → suy nghĩ lại.
2. **Reference check** — feature này trace về 1 trong 5 app TQ ở Phần 2 không? Nếu không → có thể đang sáng tác.
3. **Political deliverable check** — bí thư có dùng được feature này để PR/báo cáo không? Nếu có → priority cao.
4. **Cost-to-quan-hệ check** — chi phí (tiền + thời gian) có ROI quan hệ không? Nếu chỉ ROI tiền → cân nhắc.

---

## Phần 7 — Risk (chỉ thảo luận nội bộ, KHÔNG pitch phường)

| Risk | Mức độ | Mitigation |
|---|---|---|
| Bí thư đổi nhiệm sở | Cao (5y+) | Build product có giá trị độc lập — không dependency 1 người |
| Phường không cấp data thật | Trung | Phase 1 tự ingest — tự crawl + manual; phase 2 mới ask data |
| Anh hết hứng / busy F&B | Trung | Phase 1 khoá scope nhỏ (≤3 tháng), ship được dù dở dang |
| Đối thủ từ HN/SG xuống làm | Thấp | Họ không có quan hệ phường — moat chính trị bảo vệ |
| Du lịch HB không scale | Trung | App không phụ thuộc 100% du khách — local cũng dùng (review nhà hàng, sự kiện phường) |

---

## Phần 8 — Phân loại công việc: tự làm vs phụ thuộc bên ngoài

### 8.1 Thuần kỹ thuật — anh tự giải quyết (không chờ ai)

| # | Task | Tier | Phase | Thời gian ước |
|---|---|---|---|---|
| T1 | POI directory + maps + coords (đã có 70%) | T1 | 5 | 1-2 tuần |
| T2 | Itinerary curated (1-day, 2-day, weekend) | T1 | 5 | 3-5 ngày |
| T3 | Admin CMS để bí thư/anh tự nhập POI, sự kiện | T1 | 5 | 1 tuần |
| T4 | SEO on-page + sitemap + schema.org | T1 | 5 | 3-5 ngày |
| T5 | Reviews + ratings module (anh + nhân viên seed) | T1, T6 | 5-7 | 1 tuần |
| T6 | AI travel planner (input → itinerary, dùng Claude API) | T3 | 6 | 1-2 tuần |
| T7 | Multi-agent 4 chuyên gia (HDV/KS/budget/thổ địa) | T3 | 6 | 2-3 tuần |
| T8 | Photo recognition (Claude Vision / GPT-4V) | T3 | 6 | 3-5 ngày |
| T9 | Translation EN/CN (Claude/Google Translate API) | T3 | 6 | 2-3 ngày |
| T10 | UGC: travel diary + photo upload + Q&A forum | T6 | 7 | 2 tuần |
| T11 | Livestream embed TikTok/FB iframe | T4 | 9 | 2-3 ngày |
| T12 | Voice guide audio tour (TTS Claude/ElevenLabs) | T4 | 11 | 1 tuần |
| T13 | Analytics + tracking + heatmap | T1 | 5 | 3-5 ngày |
| T14 | FB/Zalo group seeding + content marketing | T1, T6 | 5+ | ongoing |
| T15 | Chạy ads FB/TikTok (anh tự setup) | — | 5+ | ongoing |

**Tổng:** ~15 task ship được trong 6-8 tuần nếu anh focus, không cần xin ai.

---

### 8.2 Phụ thuộc bên ngoài — phải chờ / nhờ / xin

| # | Task | Phụ thuộc ai | Risk |
|---|---|---|---|
| E1 | **Affiliate Agoda** (Tier 2) | Đăng ký Agoda Partner — cần website có traffic | LOW — quy trình rõ |
| E2 | **MoMo / ZaloPay merchant** (Tier 2) | Đăng ký merchant + giấy phép kinh doanh | MEDIUM — cần pháp nhân |
| E3 | **Hotel/homestay booking** (Tier 2) | Negotiate với từng homestay Hoà Bình | HIGH — manual, từng cái |
| E4 | **Unified ticketing** Thuỷ điện + Thác Bờ + Kim Bôi (Tier 5) | **Phường + Sở VH-TT-DL Phú Thọ** + ban quản lý từng điểm | **VERY HIGH** — political moat nhưng cần gặp mặt |
| E5 | **Real-time event data** từ phường (Tier 5) | Văn phòng UBND phường share data | MEDIUM — bí thư đã hứa |
| E6 | **Crowd density / tourist count** (Tier 5) | Cần camera/sensor — chờ phường đầu tư | HIGH — cost lớn |
| E7 | **One-click complaint** route đến phường (Tier 5) | API/email từ văn phòng phường | LOW — chỉ cần endpoint |
| E8 | **Smart toilet locator** (Tier 5) | Phường cung cấp danh sách + toạ độ | LOW |
| E9 | **AR overlay** tại điểm (Tier 4) | Cần đo đạc + 3D scan + hợp tác Mapbox/8thWall | HIGH — đắt, cần vendor |
| E10 | **VR exploration** (Tier 4) | Quay 360° + studio VR | HIGH — đắt |
| E11 | **Influencer livestream commerce** (Tier 4) | Negotiate KOL địa phương + budget ads | MEDIUM |
| E12 | **Zalo Mini App** (Tier 7) | Đăng ký Zalo Mini Developer + duyệt VNG | MEDIUM — quy trình ~2-4 tuần |
| E13 | **Multi-province extend** (Tier 7) | Bí thư 2 siêu phường Phú Thọ khác | VERY HIGH — chính trị, dài hạn |
| E14 | **Sponsor / fund** từ Sở VH-TT-DL Phú Thọ | Báo cáo qua bí thư phường lên tỉnh | HIGH — văn bản, lâu |
| E15 | **Báo chí PR** (báo Hoà Bình, VTV1 địa phương) | Bí thư giới thiệu + content team | MEDIUM |

**Tổng:** ~15 task có blocker bên ngoài, nhiều cái phụ thuộc **chính bí thư phường** — đó vừa là risk vừa là moat.

---

### 8.3 Quy tắc thứ tự thực thi

```
Tuần 1-8   ▶  Làm hết 8.1 (thuần kỹ thuật)
              KHÔNG đợi ai. KHÔNG xin gì.
              ▼
Tuần 4+    ▶  Đăng ký E1 (Agoda), E12 (Zalo Mini) song song — chờ duyệt
              ▼
Tuần 6-8   ▶  Có MVP demo → gặp bí thư show, xin E4-E8 (gov data)
              ĐÂY là moment political: bí thư có deliverable cầm tay
              ▼
Tháng 3-6  ▶  E2 (payment), E3 (hotel), E11 (KOL) — sau khi có traffic
              ▼
Tháng 6+   ▶  E13 (multi-province), E14 (tỉnh sponsor) — long game
```

**Nguyên tắc:** Không bao giờ blocker ngoại nội tuyến critical path Phase 1. Phase 1 phải ship được dù KHÔNG ai trả lời anh.

---

## Phụ lục — Nguồn nghiên cứu
- 游云南 — Yunnan Provincial Dept Culture & Tourism + Tencent partnership
- Zhejiang Travel — launched 6/2025, multi-agent AI
- Mafengwo — UGC platform
- Ctrip — OTA leader
- Dianping/Meituan — review + merchant
- Beijing 74-attraction WeChat mini

> Snapshot 2026-04-29. Review next: 2026-07-28 (cùng review_due của 2 memory gốc).
