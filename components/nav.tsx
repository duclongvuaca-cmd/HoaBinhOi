import Link from "next/link";

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-xl text-brand-700 hover:text-brand-600">
          Hoà Bình Ơi
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
          <Link href="/cam-nang/long-ho" className="hover:text-brand-600">🛥️ Lòng hồ</Link>
          <Link href="/cam-nang/dap-thuy-dien" className="hover:text-brand-600">🏗️ Đập</Link>
          <Link href="/qua-giang-tay-bac" className="hover:text-brand-600">🛣️ Quá giang</Link>
          <Link href="/hanh-trinh" className="hover:text-brand-600">Hành trình</Link>
          <Link href="/an" className="hover:text-brand-600">Ăn</Link>
          <Link href="/mua" className="hover:text-brand-600">Mua</Link>
          <Link href="/nghi" className="hover:text-brand-600">Nghỉ</Link>
          <Link href="/choi" className="hover:text-brand-600">Trải nghiệm</Link>
          <Link href="/diem-den" className="hover:text-brand-600">Điểm đến</Link>
          <Link href="/ke-hoach" className="hover:text-brand-600">🤖 AI</Link>
          <Link href="/nhan-dien" className="hover:text-brand-600">📸</Link>
          <Link href="/ban-do" className="px-3 py-1.5 bg-brand-600 text-white rounded-md hover:bg-brand-700">
            Bản đồ
          </Link>
        </div>
      </div>
    </nav>
  );
}
