import type { Metadata } from "next";
import Link from "next/link";
import { getPoi } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Cẩm nang Đập thuỷ điện Hoà Bình — lịch sử, vé, tour | Hoà Bình Ơi",
  description:
    "Đập thuỷ điện Hoà Bình 1920MW — công trình thế kỷ XX của Việt Nam. Lịch sử, vé tham quan, đi xe điện vào hầm, bảo tàng, đài tưởng niệm.",
  openGraph: {
    title: "Cẩm nang Đập thuỷ điện Hoà Bình",
    description: "Công trình thế kỷ XX — 1920MW — vào cửa miễn phí"
  }
};

const HERO = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Nh%C3%A0_m%C3%A1y_Th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg/1920px-Nh%C3%A0_m%C3%A1y_Th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg";

export default async function CamNangDap() {
  const poi = await getPoi("thuy-dien-hoa-binh");
  const galleryUrls = (poi?.images || []).slice(0, 8);

  return (
    <main>
      <section className="relative overflow-hidden text-white">
        <img src={HERO} alt="Đập thuỷ điện Hoà Bình" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 to-brand-800/60" />
        <div className="relative max-w-4xl mx-auto px-6 py-20 md:py-28">
          <p className="text-sm uppercase tracking-widest text-sun-200 mb-3">Cẩm nang · 2/3 trụ cột</p>
          <h1 className="font-display text-4xl md:text-6xl mb-4 drop-shadow-lg">Đập thuỷ điện Hoà Bình</h1>
          <p className="text-xl text-brand-50 max-w-2xl">
            Công trình thế kỷ XX — 1920 MW — "Trái tim năng lượng Việt Nam".
            Vào cửa miễn phí.
          </p>
        </div>
      </section>

      {galleryUrls.length > 0 && (
        <section className="py-8 px-6 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {galleryUrls.map((src: string, i: number) => (
                <a key={i} href={src} target="_blank" rel="noopener" className="block aspect-square overflow-hidden rounded-xl bg-slate-200">
                  <img src={src} alt="Đập thuỷ điện Hoà Bình" className="w-full h-full object-cover hover:scale-105 transition" />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <article className="prose prose-slate max-w-3xl mx-auto px-6 py-12 prose-headings:font-display prose-a:text-brand-700">
        <h2>Tổng quan</h2>
        <p>
          Nhà máy Thuỷ điện Hoà Bình — một trong những công trình kỹ thuật lớn nhất
          Việt Nam thế kỷ XX. Khởi công <b>1979</b>, hoàn thành <b>1994</b>, công suất <b>1920 MW</b> (8 tổ máy × 240 MW),
          từng là nhà máy thuỷ điện lớn nhất Đông Nam Á. Đến nay vẫn là biểu tượng năng lượng quốc gia.
        </p>

        <h2>Lịch sử ngắn</h2>
        <ul>
          <li><b>1971</b>: Liên Xô tài trợ thiết kế, đào tạo cán bộ VN tại Volga</li>
          <li><b>1979</b>: Khởi công — 30,000+ công nhân + chuyên gia LX cùng làm</li>
          <li><b>1988</b>: Tổ máy 1 phát điện</li>
          <li><b>1994</b>: Tổ máy 8 (cuối) — hoàn thành toàn bộ</li>
          <li><b>168 người hy sinh</b> trong quá trình xây dựng — tưởng niệm tại đài</li>
        </ul>

        <h2>Trải nghiệm tham quan</h2>
        <h3>1. Đi qua thân đập (free)</h3>
        <ul>
          <li>Đậu xe bãi ngoài (5-10k), đi bộ qua đỉnh đập 730m</li>
          <li>View toàn cảnh hồ phía thượng lưu + sông Đà phía hạ lưu</li>
          <li>Tốt nhất buổi sáng 7-9h hoặc chiều 16-18h (tránh nắng giữa)</li>
        </ul>

        <h3>2. Xe điện vào hầm 280m (50k/người)</h3>
        <ul>
          <li>Khu vực phía nam thân đập — vé 50k mua tại cổng</li>
          <li>Đi xe điện xuyên hầm vào lòng đập, xem turbine 240 MW đang chạy</li>
          <li>Có guide thuyết minh tiếng Việt</li>
        </ul>

        <h3>3. Bảo tàng + đài tưởng niệm (free)</h3>
        <ul>
          <li>Ảnh tài liệu xây đập 1979-1994</li>
          <li>Mô hình kỹ thuật, công nghệ Liên Xô</li>
          <li>Đài tưởng niệm 168 người hy sinh — kiến trúc đẹp, view hồ</li>
        </ul>

        <h3>4. Tượng đài Hồ Chí Minh (free)</h3>
        <ul>
          <li>Trên đỉnh đồi gần đập, view bao quát toàn nhà máy</li>
          <li>Đi bộ lên 5-10 phút, đường có bậc</li>
        </ul>

        <h2>Giờ mở cửa</h2>
        <ul>
          <li><b>Đập + đài tưởng niệm + bảo tàng</b>: 7:00 - 17:00 hàng ngày</li>
          <li><b>Xe điện vào hầm</b>: 8:00 - 16:00 (lưu ý nghỉ trưa 11:30-13:00)</li>
          <li><b>Nghỉ Tết</b>: ngày 1-3 âm lịch</li>
        </ul>

        <h2>Mẹo người bản địa</h2>
        <ul>
          <li><b>Đi sáng sớm 7-8h</b>: ảnh đẹp ngược nắng, ít người</li>
          <li><b>Mặc lịch sự</b>: cấm quần ngắn / áo hai dây tại đài tưởng niệm</li>
          <li><b>Mang nước</b>: trên đập gió mạnh + nắng, bãi xe không có quán</li>
          <li><b>Trẻ em</b>: thích phòng turbine + xe điện. Nhớ giữ tay khi đi đập</li>
          <li><b>Combo gần</b>: cách <Link href="/poi/vua-ca-long-phuong">Vua Cá Long Phượng</Link> 5 phút lái xe</li>
          <li><b>Combo xa</b>: cách <Link href="/poi/long-ho-hoa-binh">cảng Bích Hạ lòng hồ</Link> 5-10 phút</li>
        </ul>

        <h2>Bảng giá</h2>
        <table>
          <thead><tr><th>Mục</th><th>Giá</th></tr></thead>
          <tbody>
            <tr><td>Vào cửa khu vực đập + đài tưởng niệm + bảo tàng</td><td><b>Miễn phí</b></td></tr>
            <tr><td>Xe điện vào hầm 280m + thuyết minh</td><td>50k/người</td></tr>
            <tr><td>Gửi xe máy</td><td>5-10k</td></tr>
            <tr><td>Gửi ô tô</td><td>20-30k</td></tr>
          </tbody>
        </table>

        <h2>Đi tiếp đâu?</h2>
        <ul>
          <li><Link href="/poi/long-ho-hoa-binh">Lòng hồ Hoà Bình</Link> — tour tàu từ cảng Bích Hạ kế bên</li>
          <li><Link href="/poi/vua-ca-long-phuong">Vua Cá Long Phượng</Link> — trưa cá lăng sông Đà</li>
          <li><Link href="/poi/cam-cao-phong">Vườn cam Cao Phong</Link> — mua quà về (mùa 11-1)</li>
        </ul>
      </article>

      <section className="bg-brand-50 py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl mb-4 text-brand-900">Hành trình gợi ý</h2>
          <Link
            href="/hanh-trinh/dap-thuy-dien-nua-ngay"
            className="inline-block bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            🏗️ Đập thuỷ điện + bảo tàng (nửa ngày) →
          </Link>
        </div>
      </section>
    </main>
  );
}
