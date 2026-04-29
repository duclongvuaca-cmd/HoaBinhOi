"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function AuthCallback() {
  return (
    <Suspense fallback={<Status text="Đang xử lý..." />}>
      <CallbackInner />
    </Suspense>
  );
}

function CallbackInner() {
  const router = useRouter();
  const search = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Đang đăng nhập...");

  useEffect(() => {
    const rawNext = search.get("next") || "/admin";
    const next = /^\/[a-zA-Z0-9\-_/]*$/.test(rawNext) ? rawNext : "/admin";
    const sb = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    (async () => {
      const sbErr = search.get("error_code") || search.get("error");
      const sbErrDesc = search.get("error_description");
      if (sbErr) {
        setError(sbErrDesc || sbErr);
        return;
      }

      const code = search.get("code");
      if (code) {
        setStatus("Đang xác thực...");
        const { error } = await sb.auth.exchangeCodeForSession(code);
        if (error) { setError(error.message); return; }
        window.location.href = next;
        return;
      }

      const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
      if (hash) {
        const params = new URLSearchParams(hash);
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        const errH = params.get("error_description") || params.get("error_code") || params.get("error");
        if (errH) { setError(errH); return; }
        if (access_token && refresh_token) {
          setStatus("Đang lưu session...");
          const { error } = await sb.auth.setSession({ access_token, refresh_token });
          if (error) { setError(error.message); return; }
          window.location.href = next;
          return;
        }
      }

      setError("Không tìm thấy mã xác thực — đường dẫn không hợp lệ.");
    })();
  }, [router, search]);

  if (error) {
    return (
      <Status>
        <div className="text-rose-600 mb-3">Lỗi: {error}</div>
        <a href="/admin/login" className="text-brand-700 underline text-sm">Quay lại đăng nhập</a>
      </Status>
    );
  }
  return <Status text={status} />;
}

function Status({ text, children }: { text?: string; children?: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full text-center">
        <div className="text-3xl mb-3">🔐</div>
        {text && <p className="text-slate-700">{text}</p>}
        {children}
      </div>
    </main>
  );
}
