const SECRETS = [
  {
    title: "Mua cam Cao Phong THẬT",
    body: "Cam dán tem Cao Phong ở chợ HN có thể là cam Trung Quốc dán tem giả. Mua tại vườn Cao Phong (cách phường HB ~30km) hoặc cửa hàng đặc sản phường có chứng nhận."
  },
  {
    title: "Cá sông Đà ngon nhất buổi sáng",
    body: "Cá lăng / cá ngạnh đánh bắt 4-6h sáng, đến quán 9-10h là tươi nhất. Đặt trước qua nhà hàng để có cá phù hợp khẩu vị."
  },
  {
    title: "Thuỷ điện Hoà Bình — đi giờ nào ít đông",
    body: "Tour đoàn thường 9h-11h sáng. Đi 14h-16h chiều vắng hơn, ánh sáng đẹp chụp ảnh, nắng dịu."
  },
  {
    title: "Suối Kim Bôi không chỉ tắm khoáng",
    body: "Có 3 cụm: Serena Resort (cao cấp), V'Resort (gia đình), khu công cộng (rẻ). Mỗi cụm ngâm suối + dịch vụ khác nhau — chọn đúng ngân sách."
  },
  {
    title: "Đường đi xe máy đẹp nhất",
    body: "Quốc lộ 6 từ HN qua Lương Sơn vào TP HB — view đẹp, ít xe tải. Tránh giờ cao điểm 7-8h sáng + 17-18h chiều."
  },
  {
    title: "Pickleball ở Hoà Bình",
    body: "Sân Long Phượng (gần nhà hàng Vua Cá) — combo chơi pickle sáng + ăn cá trưa rất tiện. Đặt sân trước qua FB hoặc số nhà hàng."
  }
];

export function LocalSecrets() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <div className="mb-12">
        <p className="text-sm uppercase tracking-widest text-sun-600 mb-2">Bí quyết người bản địa</p>
        <h2 className="font-display text-4xl md:text-5xl mb-4">
          Những điều Google không có
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl">
          App khác chỉ liệt kê. Hoà Bình Ơi mách bí quyết để anh chị đi đúng — không bị hớ giá,
          không đi nhầm chỗ, không bỏ lỡ cái hay.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SECRETS.map((s) => (
          <div
            key={s.title}
            className="p-6 bg-gradient-to-br from-sun-50 to-white border-l-4 border-sun-400 rounded-r-xl"
          >
            <h3 className="font-display text-xl mb-2 text-sun-800">💡 {s.title}</h3>
            <p className="text-slate-700">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
