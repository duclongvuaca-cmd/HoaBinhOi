"use client";

import { useState } from "react";

export function EmailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("ok");
      setMessage("Cảm ơn — sẽ báo khi launch full app.");
      setEmail("");
    } catch (err: any) {
      setStatus("err");
      setMessage(err.message || "Có lỗi, thử lại sau.");
    }
  }

  return (
    <section className="py-20 px-6 bg-brand-700 text-white">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-display text-4xl md:text-5xl mb-4">
          Báo cho tôi khi app live
        </h2>
        <p className="text-lg text-brand-100 mb-8">
          Nhập email để nhận thông báo + 1 hành trình PDF miễn phí khi launch.
        </p>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@cua-anh.com"
            className="flex-1 px-4 py-3 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sun-400"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3 bg-sun-400 hover:bg-sun-500 text-slate-900 font-semibold rounded-lg transition disabled:opacity-50"
          >
            {status === "loading" ? "Đang gửi..." : "Đăng ký"}
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-sm ${status === "ok" ? "text-sun-200" : "text-red-200"}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
