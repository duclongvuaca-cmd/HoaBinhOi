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
  title: "Hoà Bình Ơi — Du lịch phường Hoà Bình",
  description:
    "Khám phá Hoà Bình theo cách người địa phương: hành trình chọn sẵn, ăn gì - mua gì - nghỉ ở đâu, kèm bí quyết.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://hoabinhoi.vn"),
  openGraph: {
    title: "Hoà Bình Ơi",
    description: "Du lịch phường Hoà Bình — hành trình chọn sẵn, bí quyết người bản địa",
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
