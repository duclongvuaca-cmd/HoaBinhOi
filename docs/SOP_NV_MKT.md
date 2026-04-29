# SOP — Nhân viên content (admin web)

> Hướng dẫn dành cho người **không phải dev**. 10 phút đọc, 60 phút training là làm được.

## 1. Đăng nhập lần đầu

1. Sau khi được mời, mở trình duyệt → vào `https://hoabinhoi.vn/admin/login`
   (hoặc `http://localhost:3001/admin/login` nếu chạy local)
2. Nhập email được cấp → bấm **"Gửi magic link"**
3. Mở Gmail → tìm mail từ Supabase / Hoà Bình Ơi → click link
4. Tự động vào trang `/admin` — xong.

> Mỗi lần login dùng cùng cách (không có password). Link hết hạn sau 1 giờ.

---

## 2. Thêm địa điểm (POI) mới

### Cách 1 — paste URL Google Maps (nhanh nhất, khuyên dùng)
1. Mở Google Maps web → tìm địa điểm (vd "Vua Cá Long Phượng Hoà Bình")
2. Click vào địa điểm → copy URL trên thanh địa chỉ
3. Vào `/admin/poi/new`
4. Paste URL vào ô **vàng** "URL Google Maps" → bấm **Apply**
   → toạ độ + tên + place_id tự fill vào form
5. Chọn **Danh mục** đúng:
   - 🍲 Ăn — nhà hàng, quán
   - 🛍️ Mua — đặc sản
   - 🛏️ Nghỉ — khách sạn, homestay
   - 🎯 Trải nghiệm — pickleball, SUP, đạp xe...
   - 🏞️ Điểm đến — cảnh, di tích
   - 🎉 Sự kiện — lễ hội
6. Sửa lại **Tên** nếu thiếu dấu / sai chính tả
7. Để **Status = Draft** trước (chưa công khai)
8. Bấm **Tạo POI**

### Cách 2 — nhập tay (khi không có URL Maps)
- `/admin/poi/new` → bỏ qua ô URL → điền **Tên + Slug + Danh mục** + Lat/Lng (xem từ Maps)

---

## 3. Viết content cho POI

Sau khi tạo POI (status=Draft), vào `/admin/poi/[slug]` để điền:

### 3.1 Mô tả ngắn (`description`) — bắt buộc
- 60-100 chữ, 3-4 câu
- Ngôi thứ 3 (không "chúng tôi", không "bạn")
- Tả: món ngon / không gian / giá phù hợp ai
- VD: *"Nhà hàng cá sông Đà nổi tiếng — cá lăng, cá ngạnh, lẩu cá. Không gian rộng, có khu nhà sàn truyền thống. Giá tầm trung, phù hợp gia đình hoặc đoàn công tác."*

### 3.2 Bí quyết người bản địa (`insider_tip`) — quan trọng nhất
- 1-2 câu — đây là **giá trị độc đáo** của site, không đâu có
- Đặt món gì? Khung giờ tốt? Lưu ý đặc biệt?
- VD: *"Đặt trước qua điện thoại buổi sáng để có cá tươi nhất. Combo cá lăng nướng + lẩu măng chua cá ngạnh là signature."*

### 3.3 Giá tham khảo (`price_range`)
- Format: `200k-500k/người` hoặc `vào cửa miễn phí` hoặc `1-2tr/đêm`

### 3.4 Tags (cách nhau bằng dấu phẩy)
- 2-3 tag, không dấu, viết liền dấu gạch
- VD: `ca-song-da, dac-san, lau`
- Dùng để filter — tag nhất quán với POI cùng loại

### 3.5 Liên hệ (tuỳ chọn)
- Phone: số ĐT hotline
- Address: địa chỉ cụ thể nếu Maps chưa rõ

---

## 4. Upload ảnh

### Trong form sửa POI, section **Hình ảnh**:
1. **Kéo thả** ảnh từ máy vào ô có viền đứt — hoặc bấm vào ô để mở file picker
2. Có thể chọn nhiều ảnh cùng lúc (Ctrl+click)
3. Đợi upload — mỗi ảnh ≤8MB, định dạng JPG / PNG / WEBP / GIF
4. Ảnh đầu tiên = **ảnh bìa** (hiển thị trên POI card + OG image)
5. Hover ảnh → bấm **←** để di chuyển ảnh đó lên đầu (cover)
6. Hover ảnh → bấm **Xoá** để remove

### Quy tắc ảnh
- ≥3 ảnh / POI: 1 cover + 2 chi tiết
- Cover ngang (16:9) đẹp nhất, đừng dùng ảnh selfie/người
- Lấy ảnh từ Google Maps reviews (license OK) hoặc tự chụp
- KHÔNG copy ảnh có watermark báo (vnexpress, dantri...)

---

## 5. Public POI

Sau khi đã có:
- ✅ Mô tả ≥60 chữ
- ✅ Insider tip ≥10 chữ
- ✅ ≥1 ảnh
- ✅ Toạ độ chính xác

→ Đổi **Status: Draft → Published** → bấm **Lưu thay đổi**.

POI sẽ xuất hiện ngay trên `/an`, `/poi/[slug]`, `/ban-do`, sitemap.

---

## 6. Sửa POI cũ

`/admin/poi` → search tên / filter category → click **Sửa**.

### Editor (quyền chuẩn)
- ✅ Sửa mọi field
- ✅ Đổi status (Draft / Published / Archived)
- ❌ KHÔNG xoá vĩnh viễn — dùng "Archived" thay xoá

### Admin
- ✅ Tất cả của Editor
- ✅ Xoá vĩnh viễn (dùng cẩn thận, không undo)

---

## 7. Duyệt review (chỉ admin)

`/admin/reviews` — tabs:
- **Pending** — review user mới gửi, chờ duyệt
- **Approved** — đã duyệt, hiện trên POI detail
- **Rejected** — đã từ chối, ẩn

Mỗi review:
- Bấm **Duyệt** → hiện công khai
- Bấm **Từ chối** → ẩn nhưng giữ data
- Bấm **Xoá** → mất luôn (hardly cần)

### Review nào duyệt
- ✅ Tiếng Việt rõ ràng, có trải nghiệm cụ thể
- ✅ Rating phù hợp nội dung (5 sao + chê → reject)

### Review nào từ chối
- ❌ Spam, quảng cáo
- ❌ Chửi bậy, từ ngữ tục
- ❌ Đánh giá không trải nghiệm thực ("nghe nói...")
- ❌ Tiếng nước ngoài tự động chưa kiểm duyệt

---

## 8. Quy trình team (chuẩn)

1. **Editor** thêm POI (status=Draft) + viết content + upload ảnh
2. **Admin** review nội dung lần cuối → đổi `Published`
3. User phản hồi qua review → **Admin** duyệt/từ chối tuần 1 lần
4. Hằng tháng: admin xem `/admin/audit` xem ai làm gì có sai sót không

---

## 9. Khi gặp lỗi

| Lỗi | Cách xử lý |
|---|---|
| "Email không hợp lệ" | Email chưa được mời — nhờ admin add |
| Không nhận magic link | Check Spam, đợi 2 phút, request lại |
| Upload ảnh fail | Ảnh quá 8MB → resize trước; hoặc đổi sang JPG |
| Form save fail | Slug đã tồn tại → đổi slug khác |
| Bản đồ không hiện | Refresh trang; hoặc báo dev (Mapbox token hết hạn) |
| Page 403 / 401 | Đăng xuất rồi đăng nhập lại |

Liên hệ admin: 1 trong các email trong `/admin/users` có role `admin`.

---

## 10. Mẹo nâng cao

- **Batch import:** dùng admin web nhập 1 POI / 5 phút. Có 50 POI? Một buổi sáng xong.
- **SEO friendly:** description nên có chữ "Hoà Bình" / "Phú Thọ" / loại POI ít nhất 1 lần
- **Vietnamese unicode:** dùng đầy đủ dấu (đ, ư, ơ...) — KHÔNG viết kiểu telex (du`)
- **Insider tip = USP của site:** đầu tư thời gian viết ô này, đó là khác biệt với đối thủ
