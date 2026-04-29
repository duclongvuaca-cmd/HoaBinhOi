export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display text-2xl text-white mb-2">Hoà Bình Ơi</h3>
          <p className="text-sm">
            Du lịch phường Hoà Bình — Tỉnh Phú Thọ. Hành trình chọn sẵn,
            bí quyết người bản địa.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Liên kết</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/hanh-trinh" className="hover:text-white">Hành trình</a></li>
            <li><a href="/an" className="hover:text-white">Ăn gì</a></li>
            <li><a href="/nghi" className="hover:text-white">Nghỉ ở đâu</a></li>
            <li><a href="/ban-do" className="hover:text-white">Bản đồ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Liên hệ</h4>
          <p className="text-sm">
            Email: <a href="mailto:hello@hoabinhoi.vn" className="hover:text-white">hello@hoabinhoi.vn</a>
          </p>
          <p className="text-xs mt-4 text-slate-500">
            © 2026 Hoà Bình Ơi. Phối hợp với Phường Hoà Bình.
          </p>
        </div>
      </div>
    </footer>
  );
}
