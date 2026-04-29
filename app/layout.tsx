import type { Metadata } from "next";
import { Inter, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Hoà Bình Ơi — Lòng hồ · Đập thuỷ điện · Cửa ngõ Tây Bắc",
  description:
    "Điểm dừng đẹp nhất trên đường Hà Nội ↔ Mộc Châu / Mai Châu / Sơn La. Lòng hồ Sông Đà, Đập thuỷ điện, Thác Bờ, bí quyết người bản địa.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://hoabinhoi.vn"),
  openGraph: {
    title: "Hoà Bình Ơi — Cửa ngõ Tây Bắc",
    description: "Lòng hồ · Đập thuỷ điện · Điểm dừng QL6 đi Mộc Châu / Mai Châu / Sơn La",
    locale: "vi_VN",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${beVietnam.variable}`}>
      <body className="min-h-screen bg-white text-slate-900 font-sans antialiased">
        <Nav />
        {children}
      </body>
    </html>
  );
}
