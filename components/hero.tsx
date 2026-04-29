import Link from "next/link";

const HERO_BG = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Nh%C3%A0_m%C3%A1y_Th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg/1920px-Nh%C3%A0_m%C3%A1y_Th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden text-white">
      <img
        src={HERO_BG}
        alt="Đập thuỷ điện Hoà Bình"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/85 via-brand-800/75 to-brand-700/60" />
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-sun-300 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-200 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
        <p className="text-sm uppercase tracking-widest text-sun-200 mb-4">
          Phường Hoà Bình · Tỉnh Phú Thọ
        </p>
        <h1 className="font-display text-5xl md:text-7xl leading-tight mb-6 drop-shadow-lg">
          Hoà Bình Ơi
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mb-8 text-brand-50 drop-shadow">
          Cuối tuần thoát Hà Nội — về với <b>Đập thuỷ điện</b>, <b>Thác Bờ</b>, lòng hồ Sông Đà,
          và bí quyết người bản địa không có trên Google.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="#hanh-trinh"
            className="inline-flex items-center px-6 py-3 bg-sun-400 hover:bg-sun-500 text-slate-900 font-semibold rounded-lg transition"
          >
            Xem hành trình chọn sẵn
          </Link>
          <Link
            href="#ban-do"
            className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 font-semibold rounded-lg transition"
          >
            Mở bản đồ
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <Stat n="73km" label="cách Hà Nội" />
          <Stat n="79K" label="dân phường" />
          <Stat n="30+" label="điểm đến" />
          <Stat n="5" label="hành trình curated" />
        </div>
      </div>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl md:text-4xl text-sun-200">{n}</div>
      <div className="text-sm text-brand-100 mt-1">{label}</div>
    </div>
  );
}
