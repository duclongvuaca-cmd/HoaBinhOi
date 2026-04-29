# Hoà Bình Ơi

App du lịch phường Hoà Bình (Tỉnh Phú Thọ mới — sáp nhập 1/7/2025).

**Tách biệt hoàn toàn với SOTA House** (`C:\AI_System\`). Không import, không chia sẻ DB, không chia sẻ env. Project độc lập.

## Stack

- **Frontend**: Next.js 15 (App Router) + React 19 + Tailwind 3
- **Backend/DB**: Supabase (Postgres + Auth + Storage)
- **Map**: Mapbox GL JS
- **AI**: Claude API cho content generation (key riêng — không dùng key SOTA House)
- **Hosting**: Vercel
- **Domain**: hoabinhoi.vn (mua riêng)

## Setup lần đầu

```bash
# 1. Cài deps
cd C:\HoaBinhOi
npm install

# 2. Copy env
copy .env.local.example .env.local

# 3. Tạo Supabase project mới (KHÔNG dùng project SOTA House)
# https://supabase.com → New project
# - Name: hoabinhoi
# - Region: Southeast Asia (Singapore) — gần VN nhất
# - Copy URL + anon_key + service_role_key vào .env.local

# 4. Tạo schema
# Vào Supabase Dashboard → SQL Editor → paste data/schema.sql → Run

# 5. Mapbox token (free 50K loads/tháng)
# https://account.mapbox.com → Tokens → Copy default public token vào .env.local

# 6. Claude API key riêng cho project này
# https://console.anthropic.com → Keys → Create new key (workspace HoaBinhOi)
# Paste vào .env.local

# 7. Seed POI ban đầu
npm run seed

# 8. Chạy dev
npm run dev
# Mở http://localhost:3001
```

## Mua domain

Recommend registrar:
- **Mắt Bão / iNet / PA Vietnam**: cho .vn (~750k/năm), cần CMND
- **Cloudflare / Namecheap**: cho .com / .travel (~$10-15/năm)

Tên đề xuất:
- `hoabinhoi.vn` (Vietnamese, ngắn, đặc trưng)
- `hoabinhoi.com` (international fallback)
- `hoabinh.travel` (industry-specific TLD)

Mua cả 3 nếu được — bảo vệ brand.

## Deploy lên Vercel — production

### Cách 1: CLI (nhanh, không cần GitHub)
```bash
npm i -g vercel
cd C:\HoaBinhOi
vercel login           # Login bằng email
vercel                 # Deploy preview, làm theo wizard
# Khi được hỏi:
#   "Set up and deploy?" → Y
#   "Which scope?" → Personal account
#   "Link to existing project?" → N
#   "Project name?" → hoabinhoi
#   "In which directory?" → ./
#   "Override settings?" → N (vercel.json đã set)
vercel --prod          # Deploy production sau khi preview OK
```

### Cách 2: Link GitHub (auto-deploy mỗi commit, recommended)
1. Push code lên GitHub repo private
2. Vào https://vercel.com/new → Import từ GitHub
3. Chọn repo HoaBinhOi → Deploy

### Add env vars vào Vercel (BẮT BUỘC)
```
Vercel Dashboard → Project HoaBinhOi → Settings → Environment Variables → Add:
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
  NEXT_PUBLIC_MAPBOX_TOKEN
  ANTHROPIC_API_KEY
  NEXT_PUBLIC_SITE_URL=https://hoabinhoi.vn
```
Apply cho cả 3 env: Production, Preview, Development.

### Connect domain
1. Vercel Dashboard → Project → Settings → Domains
2. Add `hoabinhoi.vn` (sau khi mua)
3. Vercel sẽ chỉ DNS records cần update tại registrar (Mắt Bão / iNet)
4. Đợi DNS propagate (5 phút - 24h)

### Region
`vercel.json` đã set region `sin1` (Singapore) — gần VN nhất, latency thấp.

## Cấu trúc

```
C:\HoaBinhOi\
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx           # Landing
│   ├── globals.css
│   └── api/
│       └── subscribe/     # Email signup endpoint
├── components/
│   ├── hero.tsx
│   ├── itinerary-preview.tsx
│   ├── poi-grid.tsx
│   ├── local-secrets.tsx
│   ├── email-signup.tsx
│   └── footer.tsx
├── lib/
│   ├── supabase-server.ts # Service role (server-side)
│   └── supabase-browser.ts# Anon key (client-side)
├── data/
│   ├── schema.sql         # Supabase schema (chạy 1 lần)
│   └── seed-pois.json     # 10 POI seed
├── scripts/
│   ├── seed-pois.ts       # npm run seed
│   └── ingest-gmaps.ts    # npm run ingest-gmaps <url> <category>
├── public/
└── package.json
```

## Roadmap 6 tháng

- **Tháng 1**: Setup + landing + 30 POI seed
- **Tháng 2**: 5 trang chính (Ăn / Mua / Nghỉ / Trải nghiệm / Bản đồ) + 5 hành trình
- **Tháng 3**: Public launch + ads
- **Tháng 4-5**: Iterate theo data + booking affiliate
- **Tháng 6**: Đánh giá → quyết định native app

## Liên hệ

duclongvuaca@gmail.com
