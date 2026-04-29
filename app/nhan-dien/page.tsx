import type { Metadata } from "next";
import { PhotoRecognizer } from "@/components/photo-recognizer";

export const metadata: Metadata = {
  title: "Nhận diện món ăn & cảnh — Hoà Bình Ơi",
  description: "Chụp/upload ảnh — AI nhận diện món ăn, hoa, phong cảnh, di tích vùng Hoà Bình kèm mẹo người bản địa."
};

export default function NhanDienPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <section className="px-6 py-12 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">📸</div>
          <h1 className="font-display text-4xl md:text-5xl mb-3 text-brand-900">Đây là gì ở Hoà Bình?</h1>
          <p className="text-slate-700 max-w-xl mx-auto">
            Chụp ảnh món ăn, hoa, phong cảnh hay di tích — AI nhận diện và kèm mẹo người bản địa.
          </p>
        </div>
        <PhotoRecognizer />
      </section>
    </main>
  );
}
