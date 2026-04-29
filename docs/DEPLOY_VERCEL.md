# Deploy lên Vercel — hướng dẫn từng bước

Anh chỉ cần click trên web. ~15-20 phút.

---

## 1. Đăng ký Vercel (1 phút)

1. Mở https://vercel.com/signup
2. Bấm **"Continue with GitHub"** → authorize bằng tài khoản `duclongvuaca-cmd`
3. Plan: **Hobby (free)** — đủ cho MVP, có Vercel Analytics + 100GB bandwidth/tháng

---

## 2. Import GitHub repo (2 phút)

1. Sau login, vào https://vercel.com/new
2. Tìm repo `duclongvuaca-cmd/HoaBinhOi` → bấm **"Import"**
3. Configure project:
   - **Framework Preset:** Next.js (auto-detect)
   - **Root Directory:** `./` (giữ nguyên)
   - **Build Command:** `next build` (giữ nguyên)
   - **Output Directory:** `.next` (giữ nguyên)
   - **Node.js Version:** 22.x (default)
4. **CHƯA bấm Deploy** — bước tiếp theo phải add env trước

---

## 3. Add 7 environment variables (5 phút)

Trong cùng trang Configure Project, scroll xuống phần **"Environment Variables"**.

Mở file `C:\HoaBinhOi\.env.local` (Notepad). Copy paste 7 cặp KEY=VALUE từ đó vào Vercel:

| Vercel Key | Vercel Value | Lấy ở đâu |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://eajbatxljbscmdvbngzn.supabase.co` | `.env.local` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` (anon key dài) | `.env.local` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (service role) | `.env.local` |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | `pk.eyJ...` | `.env.local` |
| `ANTHROPIC_API_KEY` | `sk-ant-...` | `.env.local` |
| `NEXT_PUBLIC_SITE_URL` | `https://hoabinhoi.vn` (sau khi mua) hoặc `https://hoabinhoi-xxx.vercel.app` (tạm) | sửa sau |
| `ADMIN_EMAILS` | `duclongvuaca@gmail.com` | `.env.local` |

**Apply mỗi env cho cả 3 environment:** Production / Preview / Development → tick hết 3 ô.

---

## 4. Deploy (3 phút)

Sau khi add env xong → bấm **"Deploy"** (nút đen lớn cuối trang).

Vercel sẽ:
1. Pull code từ GitHub
2. `npm install --legacy-peer-deps`
3. `next build` (anh đã verify build local OK)
4. Deploy lên CDN edge sin1 (Singapore)

Đợi ~2-3 phút. Khi xong sẽ thấy:
- Status: **"Ready"** màu xanh
- URL preview: `https://hoabinhoi-xxx.vercel.app`
- Click URL → site live!

---

## 5. Update Supabase Auth callback (2 phút)

Vì giờ có domain mới, phải báo Supabase biết để magic link redirect đúng:

1. Supabase Dashboard → **Authentication** → **URL Configuration**
2. **Site URL:** thêm vào `https://hoabinhoi-xxx.vercel.app` (URL Vercel của anh)
3. **Redirect URLs:** Add → `https://hoabinhoi-xxx.vercel.app/auth/callback`
4. Save

Lúc này có 2 Site URL (`localhost:3001` + Vercel) — Supabase chấp nhận cả 2.

---

## 6. Update `NEXT_PUBLIC_SITE_URL` (1 phút)

Quay lại Vercel:
1. Project → **Settings** → **Environment Variables**
2. Edit `NEXT_PUBLIC_SITE_URL` → giá trị `https://hoabinhoi-xxx.vercel.app`
3. Save → Vercel sẽ tự rebuild (~2 phút)

Sau đó sitemap, OG image, robots.txt sẽ trỏ đúng URL production.

---

## 7. Smoke test production (3 phút)

Mở `https://hoabinhoi-xxx.vercel.app` rồi check:

| Path | Phải thấy |
|---|---|
| `/` | Landing với hero + 30 POI grid |
| `/an` | List nhà hàng |
| `/poi/vua-ca-long-phuong` | Detail có map + reviews + JSON-LD |
| `/hanh-trinh/cuoi-tuan-lang-man` | Lịch trình + map polyline |
| `/ke-hoach` | Form planner AI 4 agent |
| `/nhan-dien` | Drag-drop ảnh |
| `/sitemap.xml` | XML có 39+ URL |
| `/robots.txt` | Text 5 dòng |
| `/admin/login` | Form magic link |
| `/admin` (sau login) | Dashboard counters |

---

## 8. Bật Vercel Analytics (1 phút)

1. Vercel Dashboard → Project → tab **Analytics**
2. Bấm **"Enable Web Analytics"** (free Hobby)
3. Tab **Speed Insights** → **"Enable"** (free)

Tracking sẽ hiện sau ~1h có visitor.

---

## 9. Connect domain `.vn` (sau khi mua, ~5 phút config)

Khi đã có `hoabinhoi.vn`:
1. Vercel → Project → **Settings** → **Domains**
2. Add `hoabinhoi.vn` + `www.hoabinhoi.vn`
3. Vercel show DNS records cần update tại registrar (Mắt Bão/iNet):
   - A record `@` → `76.76.21.21` (Vercel)
   - CNAME `www` → `cname.vercel-dns.com`
4. Login Mắt Bão/iNet → DNS Manager → paste records
5. Đợi propagate 5p-24h
6. SSL Let's Encrypt tự cấp khi DNS xong

Sau đó update lại:
- `NEXT_PUBLIC_SITE_URL=https://hoabinhoi.vn` trong Vercel env
- Supabase URL Configuration thêm `https://hoabinhoi.vn` + callback

---

## 10. Auto-deploy mỗi commit

Đã có sẵn:
- Push code lên `main` branch → Vercel auto-deploy production
- Push lên branch khác → Vercel deploy preview URL riêng (test trước merge)

Workflow chuẩn:
```bash
cd C:\HoaBinhOi
# sửa code
git add .
git commit -m "feat: thêm tính năng X"
git push origin main
# Vercel tự build + deploy ~3 phút
```

---

## Trouble-shooting

| Lỗi | Cách xử lý |
|---|---|
| Build fail "Type error" | Local đã pass. Check Vercel build log → có khi cache stale → bấm **"Redeploy"** với "Clear cache" |
| Magic link redirect sai | Bước 5 chưa làm. Add Vercel URL vào Supabase Redirect URLs |
| Mapbox không hiện | Token chưa add hoặc tên sai. Kiểm tra `NEXT_PUBLIC_MAPBOX_TOKEN` trong Vercel |
| AI planner timeout | Vercel Hobby max 10s/function. Hiện set `maxDuration: 60` trong route — cần plan Pro $20/m hoặc tối ưu |
| Image upload fail | Storage policy chưa setup. Xem `data/schema-v2.sql` cuối file |

---

> Anh stuck bước nào → screenshot, tôi guide.
