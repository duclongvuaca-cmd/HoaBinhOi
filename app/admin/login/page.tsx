"use client";

import { Suspense, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const urlError = params.get("error");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const redirect = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: { emailRedirectTo: redirect }
    });
    if (error) {
      setErrMsg(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8">
        <h1 className="font-display text-3xl mb-2">Quản trị · Hoà Bình Ơi</h1>
        <p className="text-slate-600 mb-6 text-sm">Đăng nhập bằng đường dẫn an toàn. Email phải có trong danh sách cho phép.</p>

        {urlError && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-lg text-sm mb-4">
            <b>Đường dẫn đăng nhập bị lỗi:</b> {urlError}
            <div className="text-xs mt-1 opacity-80">
              {urlError.includes("expired") || urlError.includes("invalid")
                ? "Đường dẫn đã hết hạn. Yêu cầu đường dẫn mới và bấm vào ngay (trong vòng 1 giờ)."
                : "Yêu cầu lại đường dẫn mới bên dưới."}
            </div>
          </div>
        )}

        {status === "sent" ? (
          <div className="bg-brand-50 text-brand-800 p-4 rounded-lg text-sm">
            ✉️ Đã gửi đường dẫn đăng nhập đến <b>{email}</b>. Mở Gmail, bấm vào đường dẫn để quay lại đây.
          </div>
        ) : (
          <form onSubmit={send} className="space-y-4">
            <input
              type="email"
              required
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 rounded-lg disabled:opacity-50"
            >
              {status === "sending" ? "Đang gửi..." : "Gửi đường dẫn đăng nhập"}
            </button>
            {status === "error" && (
              <div className="text-rose-600 text-sm">{errMsg}</div>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
