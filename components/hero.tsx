import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-sun-300 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-200 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
        <p className="text-sm uppercase tracking-widest text-sun-200 mb-4">
          Phường Hoà Bình · Tỉnh Phú Thọ
        </p>
        <h1 className="font-display text-5xl md:text-7xl leading-tight mb-6">
          Hoà Bình Ơi
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mb-8 text-brand-50">
          Cuối tuần thoát Hà Nội — ăn gì, mua gì, nghỉ ở đâu, đi đường nào,
          và những bí quyết người bản địa không có trên Google.
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
