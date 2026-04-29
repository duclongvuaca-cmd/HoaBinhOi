import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quá giang Tây Bắc — dừng chân Hoà Bình QL6 | Hoà Bình Ơi",
  description:
    "Hướng dẫn dừng chân Hoà Bình khi đi/về Mộc Châu, Mai Châu, Sơn La, Điện Biên. Cây xăng, WC sạch, quán ăn tin cậy, khách sạn nghỉ qua đêm dọc QL6.",
  openGraph: {
    title: "Quá giang Tây Bắc — dừng chân Hoà Bình",
    description: "Cẩm nang dừng chân QL6 đi Mộc Châu / Mai Châu / Sơn La / Điện Biên"
  }
};

const HERO = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Nh%C3%A0_m%C3%A1y_Th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg/1920px-Nh%C3%A0_m%C3%A1y_Th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg";

export default function QuaGiangTayBac() {
  return (
    <main>
      <section className="relative overflow-hidden text-white">
        <img src={HERO} alt="Cửa ngõ Tây Bắc" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/85 to-sun-700/40" />
        <div className="relative max-w-4xl mx-auto px-6 py-20 md:py-28">
          <p className="text-sm uppercase tracking-widest text-sun-200 mb-3">Cẩm nang · 3/3 trụ cột</p>
          <h1 className="font-display text-4xl md:text-6xl mb-4 drop-shadow-lg">
            Quá giang Tây Bắc
          </h1>
          <p className="text-xl text-brand-50 max-w-2xl">
            Dừng chân Hoà Bình trên đường HN ↔ Mộc Châu / Mai Châu / Sơn La / Điện Biên.
            73km — 1.5 giờ — must-stop.
          </p>
        </div>
      </section>

      <article className="prose prose-slate max-w-3xl mx-auto px-6 py-12 prose-headings:font-display prose-a:text-brand-700">
        <h2>Vì sao phải dừng Hoà Bình?</h2>
        <p>
          QL6 là tuyến chính từ Hà Nội lên Tây Bắc. Hầu hết khách phóng thẳng tới Mộc Châu / Mai Châu / Sơn La,
          bỏ qua Hoà Bình. <b>Nhưng dừng HB 2-3 giờ là tối ưu</b>:
        </p>
        <ul>
          <li>Đập thuỷ điện <b>vào cửa miễn phí</b> — chỉ 30 phút lái xe khỏi QL6 chính</li>
          <li>Cá lăng tươi sông Đà — không có ở đâu khác trên tuyến</li>
          <li>WC sạch + cây xăng tin cậy — nhiều hơn các huyện sau (Mai Châu, Mộc Châu thiếu)</li>
          <li>Mua đặc sản (cam Cao Phong, mật ong Lạc Sơn, rượu cần) cho cả chuyến</li>
        </ul>

        <h2>Khoảng cách + thời gian từ Hoà Bình</h2>
        <table>
          <thead><tr><th>Đến</th><th>Khoảng cách</th><th>Thời gian xe</th></tr></thead>
          <tbody>
            <tr><td>Hà Nội (về xuôi)</td><td>73 km</td><td>1.5 giờ</td></tr>
            <tr><td>Mai Châu</td><td>60 km</td><td>1.5-2 giờ (đèo Thung Khe)</td></tr>
            <tr><td>Mộc Châu</td><td>120 km</td><td>3 giờ</td></tr>
            <tr><td>Sơn La (TP)</td><td>200 km</td><td>4.5 giờ</td></tr>
            <tr><td>Điện Biên</td><td>360 km</td><td>9-10 giờ</td></tr>
            <tr><td>Lai Châu</td><td>320 km</td><td>8 giờ</td></tr>
          </tbody>
        </table>

        <h2>Combo dừng chân tối ưu</h2>
        <h3>Combo 1.5 giờ — chỉ ăn trưa</h3>
        <ul>
          <li>Dừng <Link href="/poi/vua-ca-long-phuong">Vua Cá Long Phượng</Link> ngay QL6</li>
          <li>Cá lăng nướng hoặc lẩu cá ngạnh ~250k/người</li>
          <li>Chỗ đậu ô tô / bus rộng, WC sạch</li>
        </ul>

        <h3>Combo 3 giờ — ăn + tham quan đập</h3>
        <ul>
          <li>11:30 trưa Vua Cá (1.5h)</li>
          <li>13:00 sang đập thuỷ điện đi qua thân + xem đài tưởng niệm (1h, free)</li>
          <li>14:00 tiếp tục QL6 → Mộc Châu / Mai Châu</li>
        </ul>

        <h3>Combo 5 giờ — ăn + đập + lòng hồ ngắn</h3>
        <ul>
          <li>10:30 đập thuỷ điện (1.5h) — đi xe điện vào hầm 50k/người</li>
          <li>12:00 trưa Vua Cá (1.5h)</li>
          <li>13:30 cảng Bích Hạ thuê tàu nhanh ra Đảo Dừa cá nướng (2h, ~300k/người)</li>
          <li>16:00 tiếp QL6</li>
        </ul>

        <h3>Combo qua đêm — về lượt sau</h3>
        <ul>
          <li>Chiều thứ 7 đi từ HN, ngủ HB <Link href="/poi/serena-resort-kim-boi">Serena Kim Bôi</Link> (~1.5tr/đêm)</li>
          <li>Chủ nhật sáng day-trip Mai Châu, chiều về</li>
        </ul>

        <h2>Khách sạn / homestay nghỉ qua đêm tại HB</h2>
        <table>
          <thead><tr><th>Tên</th><th>Loại</th><th>Giá/đêm</th></tr></thead>
          <tbody>
            <tr><td><Link href="/poi/serena-resort-kim-boi">Serena Resort Kim Bôi</Link></td><td>Resort suối khoáng cao cấp</td><td>1.5-3tr</td></tr>
            <tr><td><Link href="/poi/avana-retreat">Avana Retreat</Link></td><td>Boutique cao cấp núi</td><td>3-5tr</td></tr>
            <tr><td><Link href="/poi/mai-chau-ecolodge">Mai Châu Ecolodge</Link></td><td>Eco-lodge tre nứa</td><td>1.5-2.5tr</td></tr>
            <tr><td><Link href="/poi/khach-san-hoa-binh-2">Khách sạn Hoà Bình 2</Link></td><td>Trung tâm thị xã</td><td>500-800k</td></tr>
            <tr><td><Link href="/poi/homestay-nha-san-mai-chau">Homestay nhà sàn Mai Châu</Link></td><td>Bản địa, ngân sách thấp</td><td>150-300k</td></tr>
          </tbody>
        </table>

        <h2>Mẹo lái xe QL6</h2>
        <ul>
          <li><b>Tránh giờ tắc</b>: Chiều CN 14-19h chiều về HN bị tắc nghiêm trọng. Đi sớm trước 12h.</li>
          <li><b>Đèo Thung Khe</b>: trước Mai Châu ~30km — sương mù sáng sớm, đi cẩn thận</li>
          <li><b>Đèo Tam Đảo</b>: tiếp QL6 sau Mai Châu — quanh co, có camera tốc độ</li>
          <li><b>Cây xăng cuối cùng</b>: trước Mai Châu là Cao Phong (Petrolimex). Sau đó tới TP Sơn La mới có thương hiệu lớn.</li>
          <li><b>Tắc khi mưa lũ</b>: tháng 7-9, kiểm tra báo trước khi đi</li>
        </ul>

        <h2>Cây xăng + WC tin cậy dọc QL6 (HB → Mai Châu)</h2>
        <ul>
          <li><b>Petrolimex Hoà Bình 1</b> (km73 QL6, ngay vào TP HB) — WC sạch, có quán cà phê</li>
          <li><b>Petrolimex Cao Phong</b> (km97) — cuối cùng trước đèo Thung Khe</li>
          <li><b>Petrolimex Mai Châu</b> (km125) — sau đèo, có nhà nghỉ kế bên</li>
        </ul>

        <h2>Mua đặc sản về</h2>
        <ul>
          <li><Link href="/poi/cam-cao-phong">Cam Cao Phong</Link> — mùa 11-1, 25-40k/kg</li>
          <li><Link href="/poi/mat-ong-lac-son">Mật ong Lạc Sơn</Link> — 200-300k/lít</li>
          <li><Link href="/poi/ruou-can">Rượu cần</Link> — 200-400k/bình</li>
          <li><Link href="/poi/tho-cam-thai">Thổ cẩm Thái</Link> — 100-500k/khăn</li>
        </ul>
      </article>

      <section className="bg-brand-50 py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl mb-4 text-brand-900">Hành trình quá giang gợi ý</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/hanh-trinh/dung-chan-ql6-tay-bac"
              className="inline-block bg-brand-600 hover:bg-brand-700 text-white px-5 py-3 rounded-lg font-medium"
            >
              🛣️ Stopover 3-5h
            </Link>
            <Link
              href="/hanh-trinh/hn-moc-chau-2n1d-dung-hb"
              className="inline-block bg-sun-500 hover:bg-sun-600 text-white px-5 py-3 rounded-lg font-medium"
            >
              ⛰️ HN → Mộc Châu 2N1Đ
            </Link>
            <Link
              href="/hanh-trinh/hn-mai-chau-ngu-hb"
              className="inline-block bg-brand-700 hover:bg-brand-800 text-white px-5 py-3 rounded-lg font-medium"
            >
              🏞️ HN → Mai Châu, ngủ HB
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
