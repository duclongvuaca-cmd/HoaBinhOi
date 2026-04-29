import type { Metadata } from "next";
import { TravelPlanner } from "@/components/travel-planner";

export const metadata: Metadata = {
  title: "Lên kế hoạch du lịch — Hoà Bình Ơi",
  description: "AI 4 chuyên gia (hướng dẫn viên, khách sạn, ngân sách, thổ địa) gợi ý hành trình Hoà Bình theo nhu cầu của bạn."
};

export default function KeHoachPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <section className="px-6 py-12 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🤖</div>
          <h1 className="font-display text-4xl md:text-5xl mb-3 text-brand-900">Lên kế hoạch du lịch</h1>
          <p className="text-slate-700 max-w-xl mx-auto">
            4 chuyên gia AI cùng phân tích yêu cầu của bạn — hướng dẫn viên, khách sạn, ngân sách và thổ địa người bản địa.
          </p>
        </div>
        <TravelPlanner />
      </section>
    </main>
  );
}
