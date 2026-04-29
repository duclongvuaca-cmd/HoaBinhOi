"use client";

import { createBrowserClient } from "@supabase/ssr";

export function LogoutButton() {
  async function logout() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }
  return (
    <button onClick={logout} className="text-slate-500 hover:text-rose-600">
      Đăng xuất
    </button>
  );
}
