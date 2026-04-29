# HoaBinhOi — Coding Principles (project-level)

> Auto-loaded khi cwd là `C:\HoaBinhOi\`. Override global CLAUDE.md nếu conflict.
> Nguyên tắc xây hệ thống — public-shareable.

---

## 1. Role separation: developer vs content provider

Hệ thống có 2 role rõ ràng — KHÔNG được trộn:

| Role | Ai | Việc | Tool |
|---|---|---|---|
| **Developer / system builder** | Owner + dev | Code, schema, deploy, ops, infra | Editor + Git + CLI + DB |
| **Content provider** | End user + nhân viên | Thêm/sửa POI, ảnh, địa điểm, hành trình, review | **Admin web UI duy nhất** |

**Hệ quả bắt buộc:**
- Mọi nguồn content (POI, ảnh, địa điểm, hành trình, review, sự kiện) — KHÔNG bao giờ chỉnh tay file code/JSON/seed như cách "permanent ingest". Seed chỉ dùng cho dev/test.
- Mọi feature mới có thao tác content → phải có form/upload/UI tương ứng. KHÔNG có path "anh sẽ chạy script" cho content workflow.
- Onboard staff mới — qua UI invite/role assignment, KHÔNG phải dev sửa env/code.

---

## 2. Self-service first

Mọi feature liên quan content phải có **UI web** dùng được bởi content provider (non-dev). KHÔNG yêu cầu:
- Gõ lệnh CLI
- Sửa file JSON / YAML / code
- Restart server để apply config

**Test bắt buộc trước khi ship feature:** non-dev với 5 phút training có làm được không? Nếu không → redesign.

**Workflow chuẩn cho content provider:**
- Thêm POI = paste URL vào form, không CLI
- Upload ảnh = drag-drop, không paste URL
- Sửa content = web form, không edit code
- Login = magic link, không phải tạo account thủ công
- Phân quyền nội dung mình tạo = UI quản lý, không phải dev sửa DB

---

## 3. MVP minimal scope

- KHÔNG build RBAC chi tiết / audit log / multi-tenant trước khi có user thật
- KHÔNG refactor code kề bên không được yêu cầu
- Phân biệt rõ `must (MVP)` vs `nice-to-have (post-MVP)` — chỉ ship `must`
- Ba dòng giống nhau tốt hơn premature abstraction

---

## 4. Project isolation

- KHÔNG import cross-project (mỗi codebase độc lập)
- Mỗi project: DB schema/connection riêng, API key riêng, folder riêng, dev port riêng
- Git config local cho commit identity riêng (tránh leak email cá nhân)
- KHÔNG trùng tên table — prefix rõ ràng nếu share DB

---

## 5. Kế thừa global code rules

- **Think before code:** state assumption rõ, hỏi user khi mơ hồ
- **Simplicity first:** min code solves problem
- **Surgical changes:** mỗi dòng đổi trace về 1 request; không refactor "tiện tay"
- **Goal-driven:** task vague → convert thành verifiable goal

---

## 6. Self-test 5 câu trước commit

1. **Trace test:** mỗi dòng đổi có trace về user request không?
2. **Orphan test:** có fix/refactor cái user không hỏi không?
3. **Simplicity test:** rewrite từ 0 có ngắn hơn không?
4. **Assumption test:** có assumption chưa nói ra không?
5. **Verify test:** có cách check mỗi step pass chưa?

2/5 trả lời "yes" → STOP + fix trước khi commit.

---

## Anti-patterns auto-reject

- ❌ Thêm CLI script khi có thể làm UI web
- ❌ Bắt user/staff sửa `.env`, `package.json`, code để config
- ❌ Hardcode admin email trong code — dùng DB hoặc env
- ❌ Feature "đẹp cho dev" non-tech user không dùng được (regex search, JSON editor, raw diff)
- ❌ Phân quyền RBAC phức tạp khi MVP chỉ 2-3 user
- ❌ "Tôi sẽ build X cho internal" — dùng admin web sẵn có
- ❌ Trộn data cross-project dù chỉ 1 dòng
- ❌ Dev seed/edit content thật trực tiếp vào DB/JSON ngoài UI — content phải qua admin web
- ❌ Onboard nhân viên/user bằng cách dev sửa env hoặc tạo row DB tay
- ❌ `except Exception:` phạm vi rộng cho case không thể xảy ra
- ❌ `# TODO` không kèm ticket
- ❌ Magic number không comment why
- ❌ Duplicate code >3 lần (extract)
- ❌ File >500 dòng không split
- ❌ Hardcoded path (dùng constants)
- ❌ Secret trong code (dùng `.env`)
- ❌ Cross-domain edit không split commit
- ❌ Comment giải thích WHAT (code rõ ràng tự giải thích) — chỉ comment WHY

---

## Quyết định cần xin trước khi làm

Hỏi user trước khi:
- Tạo bảng DB mới (naming, schema collision)
- Add npm package mới (bundle size, security)
- Đổi auth flow (ảnh hưởng login)
- Sửa schema bảng cũ (data loss risk)
- Đụng API route xử lý payment / booking

KHÔNG cần hỏi khi:
- Thêm component / route / API mới (CRUD trên resource mới)
- Sửa CSS / UX
- Thêm test
- Refactor file >500 dòng (sau khi đã thông báo user)

---

## Khi stuck >30 phút

DỪNG. Hỏi user. KHÔNG:
- Đoán thêm lần nữa
- Thử approach mới chưa confirm
- Generate output cho ra vẻ productive

Ping ngắn: "stuck vì X, đã thử Y, cần quyết định Z hay W."

---

## Nguồn truy cập

- **Schema DB:** `data/schema.sql`
- **Stack:** xem `package.json` + `next.config.js`
- **Roadmap chi tiết** (private): xem `UPGRADE_MAP.md` nếu có
