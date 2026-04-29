import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cẩm nang lòng hồ Hoà Bình — tour, giá, mùa đẹp | Hoà Bình Ơi",
  description:
    "Hướng dẫn chi tiết tour lòng hồ Hoà Bình: cảng xuất phát, lịch tàu, giá vé, nhà bè ăn cá, mùa đẹp nhất, mẹo người bản địa.",
  openGraph: {
    title: "Cẩm nang lòng hồ Hoà Bình",
    description: "208 km² 'Hạ Long miền núi' — từ HN trong 1 ngày"
  }
};

const HERO = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Nh%C3%A0_m%C3%A1y_Th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg/1920px-Nh%C3%A0_m%C3%A1y_Th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg";

export default function CamNangLongHo() {
  return (
    <main>
      <section className="relative overflow-hidden text-white">
        <img src={HERO} alt="Lòng hồ Hoà Bình" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/85 to-brand-700/60" />
        <div className="relative max-w-4xl mx-auto px-6 py-20 md:py-28">
          <p className="text-sm uppercase tracking-widest text-sun-200 mb-3">Cẩm nang · 1/3 trụ cột</p>
          <h1 className="font-display text-4xl md:text-6xl mb-4 drop-shadow-lg">Lòng hồ Hoà Bình</h1>
          <p className="text-xl text-brand-50 max-w-2xl">
            208 km² — "Hạ Long miền núi" — kéo dài qua 5 huyện, hơn 47 đảo lớn nhỏ.
            Từ Hà Nội 1.5 giờ xe.
          </p>
        </div>
      </section>

      <article className="prose prose-slate max-w-3xl mx-auto px-6 py-12 prose-headings:font-display prose-a:text-brand-700">
        <h2>Tổng quan</h2>
        <p>
          Lòng hồ Hoà Bình hình thành sau khi xây nhà máy thuỷ điện (1979-1994) — diện tích 208 km², dài 230 km
          theo dòng Sông Đà, là <b>hồ thuỷ điện nhân tạo lớn nhất Đông Nam Á</b>. Cảnh quan núi đá vôi 2 bên bờ
          tựa vịnh Hạ Long, hơn 47 đảo lớn nhỏ rải rác.
        </p>

        <h2>Cảng xuất phát chính</h2>
        <ul>
          <li><b>Cảng Bích Hạ</b> (gần đập thuỷ điện) — phổ biến nhất, dễ kết hợp tham quan đập</li>
          <li><b>Cảng Thung Nai</b> (xã Thung Nai) — gần Thác Bờ hơn, đường xe vào đẹp</li>
          <li><b>Cảng Bình Thanh</b> — ít khách, phù hợp đoàn riêng</li>
        </ul>

        <h2>Tour phổ biến</h2>
        <h3>Tour 1 — Bích Hạ → Thác Bờ → Đảo Dừa (5h, ~250-400k/người)</h3>
        <ul>
          <li>9:00 lên tàu Bích Hạ → 10:30 cập đảo Đền Bà Chúa Thác Bờ (viếng đền + ngắm cảnh)</li>
          <li>11:30 tàu đi tiếp tới Đảo Dừa, ăn trưa cá nướng nhà bè (~250k/kg cá)</li>
          <li>14:00 tàu về Bích Hạ</li>
        </ul>

        <h3>Tour 2 — Thung Nai → Thác Bờ + động (1 ngày, ~350-500k/người)</h3>
        <ul>
          <li>Có thêm phần thăm động Thác Bờ (đèn led đẹp), kéo dài hơn</li>
          <li>Đi từ Thung Nai gần hơn, đỡ tàu</li>
        </ul>

        <h3>Tour 3 — Tàu riêng cao cấp (cả thuyền 2-3tr)</h3>
        <ul>
          <li>Đặt riêng cả thuyền cho nhóm 6-12 người</li>
          <li>Tự chọn lịch trình, có chỗ nướng cá BBQ trên thuyền</li>
        </ul>

        <h2>Mùa đẹp nhất</h2>
        <ul>
          <li><b>Tháng 3-5</b>: trời trong, xanh, ít mưa. Mùa đẹp nhất.</li>
          <li><b>Tháng 9-11</b>: thu lạnh, lá vàng 2 bên bờ. Khách ít.</li>
          <li><b>Tháng 6-8</b>: mưa nhiều, hồ đầy, có thể không đi tàu được</li>
          <li><b>Tháng 1 âm lịch</b>: hội Đền Bà Chúa Thác Bờ — đông nghẹt, không nên đi nếu không thích chen chúc</li>
        </ul>

        <h2>Mẹo người bản địa</h2>
        <ul>
          <li><b>Đi sáng sớm 7-8h</b>: mặt hồ phẳng nhất, không có gió chiều. Ánh sáng đẹp chụp ảnh.</li>
          <li><b>Mặc áo phao của tàu</b>: không thuê riêng (bị chặt giá). Tàu nào cũng có sẵn.</li>
          <li><b>Đặt cá nướng trước</b>: gọi điện cho nhà bè 30 phút trước khi tàu cập, không phải đợi 45p+</li>
          <li><b>Đem mũ + kem chống nắng</b>: phản nắng từ mặt hồ rất mạnh</li>
          <li><b>Tránh chợ Tết âm lịch</b>: đông + giá tăng 50%+</li>
          <li><b>Mặc lịch sự khi vào đền</b>: che vai, không quần ngắn</li>
        </ul>

        <h2>Khoảng giá tham khảo</h2>
        <table>
          <thead><tr><th>Loại</th><th>Giá (VND/người)</th></tr></thead>
          <tbody>
            <tr><td>Tour ghép 5h (Bích Hạ-Thác Bờ-Đảo Dừa)</td><td>250-400k</td></tr>
            <tr><td>Tour ghép 1 ngày (Thung Nai trọn gói)</td><td>350-500k</td></tr>
            <tr><td>Tàu riêng nhóm 6-12 người</td><td>2-3tr / cả thuyền</td></tr>
            <tr><td>Cá nướng nhà bè (cá lăng, cá ngạnh)</td><td>250-400k/kg</td></tr>
            <tr><td>Chèo SUP / kayak (1h)</td><td>100-150k</td></tr>
            <tr><td>Vé vào đền Bà Chúa</td><td>Miễn phí</td></tr>
          </tbody>
        </table>

        <h2>Đi tiếp đâu sau lòng hồ?</h2>
        <ul>
          <li><Link href="/poi/thuy-dien-hoa-binh">Đập thuỷ điện</Link> — cách cảng Bích Hạ 5 phút</li>
          <li><Link href="/poi/vua-ca-long-phuong">Vua Cá Long Phượng</Link> — cá lăng tươi sông Đà</li>
          <li><Link href="/poi/suoi-kim-boi">Suối khoáng Kim Bôi</Link> — nghỉ qua đêm ngâm khoáng</li>
        </ul>
      </article>

      <section className="bg-brand-50 py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl mb-4 text-brand-900">Hành trình gợi ý</h2>
          <Link
            href="/hanh-trinh/tour-long-ho-1-ngay"
            className="inline-block bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            🛥️ Tour lòng hồ 1 ngày →
          </Link>
        </div>
      </section>
    </main>
  );
}
