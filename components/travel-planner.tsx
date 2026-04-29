"use client";

import { useState } from "react";

interface POIRef { slug: string; name: string }

export function TravelPlanner() {
  const [query, setQuery] = useState("");
  const [days, setDays] = useState(2);
  const [budget, setBudget] = useState<number>(2000000);
  const [group, setGroup] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [agents, setAgents] = useState<any>(null);
  const [pois, setPois] = useState<POIRef[]>([]);
  const [openTab, setOpenTab] = useState<"plan" | "hdv" | "hotel" | "budget" | "local">("plan");

  async function gen(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setPlan(null);
    setAgents(null);
    try {
      const res = await fetch("/api/ke-hoach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, days, budget: budget || undefined, group: group || undefined })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Lỗi");
      setPlan(json.plan);
      setAgents(json.agents);
      setPois(json.pois || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  function linkifySlugs(md: string) {
    let html = md;
    pois.forEach((p) => {
      const re = new RegExp(`slug=${p.slug}\\b`, "g");
      html = html.replace(re, `[${p.name}](/poi/${p.slug})`);
    });
    return html;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={gen} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">Bạn muốn trải nghiệm gì?</label>
          <textarea
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="VD: gia đình 4 người, có con nhỏ 4 tháng, thích ẩm thực và cảnh đẹp, không leo trèo nặng"
            rows={3}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Số ngày</label>
            <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
              <option value={1}>1 ngày</option>
              <option value={2}>2 ngày 1 đêm</option>
              <option value={3}>3 ngày 2 đêm</option>
              <option value={4}>Cuối tuần dài</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Ngân sách / người (đ)</label>
            <select value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
              <option value={1000000}>≤ 1 triệu</option>
              <option value={2000000}>1-2 triệu</option>
              <option value={3500000}>2-3.5 triệu</option>
              <option value={5000000}>3.5-5 triệu</option>
              <option value={0}>Linh hoạt</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Nhóm khách</label>
            <select value={group} onChange={(e) => setGroup(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
              <option value="">Tự chọn</option>
              <option value="cap-doi">Cặp đôi lãng mạn</option>
              <option value="gia-dinh">Gia đình có con nhỏ</option>
              <option value="ban-be">Nhóm bạn</option>
              <option value="phuot">Phượt thủ</option>
              <option value="cong-tac">Đoàn công tác</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 rounded-lg disabled:opacity-50"
        >
          {busy ? "🤖 4 chuyên gia đang lên kế hoạch..." : "✨ Lên kế hoạch bằng AI"}
        </button>
        {error && <div className="text-rose-600 text-sm">{error}</div>}
      </form>

      {plan && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 mb-4 text-sm">
            <Tab id="plan" cur={openTab} set={setOpenTab}>📋 Kế hoạch tổng</Tab>
            <Tab id="hdv" cur={openTab} set={setOpenTab}>🧭 Hướng dẫn viên</Tab>
            <Tab id="hotel" cur={openTab} set={setOpenTab}>🛏️ Khách sạn</Tab>
            <Tab id="budget" cur={openTab} set={setOpenTab}>💰 Ngân sách</Tab>
            <Tab id="local" cur={openTab} set={setOpenTab}>🌿 Thổ địa</Tab>
          </div>
          <article className="prose prose-slate max-w-none prose-headings:font-display prose-a:text-brand-600">
            <Markdown text={openTab === "plan" ? linkifySlugs(plan) :
              openTab === "hdv" ? linkifySlugs(agents?.hdv || "") :
              openTab === "hotel" ? linkifySlugs(agents?.hotel || "") :
              openTab === "budget" ? agents?.budget || "" :
              linkifySlugs(agents?.local || "")} />
          </article>
        </div>
      )}
    </div>
  );
}

function Tab({ id, cur, set, children }: { id: any; cur: string; set: (v: any) => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => set(id)}
      className={`px-3 py-1.5 rounded-lg ${cur === id ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
    >
      {children}
    </button>
  );
}

function Markdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let listBuf: React.ReactNode[] = [];
  const flushList = () => {
    if (listBuf.length) { out.push(<ul key={out.length}>{listBuf}</ul>); listBuf = []; }
  };
  lines.forEach((line, i) => {
    if (/^### /.test(line)) { flushList(); out.push(<h3 key={i}>{inline(line.replace(/^### /, ""))}</h3>); return; }
    if (/^## /.test(line)) { flushList(); out.push(<h2 key={i}>{inline(line.replace(/^## /, ""))}</h2>); return; }
    if (/^# /.test(line)) { flushList(); out.push(<h1 key={i}>{inline(line.replace(/^# /, ""))}</h1>); return; }
    if (/^[-*] /.test(line)) { listBuf.push(<li key={i}>{inline(line.replace(/^[-*] /, ""))}</li>); return; }
    if (/^\|/.test(line)) { flushList(); out.push(<div key={i} className="font-mono text-xs whitespace-pre">{line}</div>); return; }
    if (line.trim() === "") { flushList(); return; }
    flushList(); out.push(<p key={i}>{inline(line)}</p>);
  });
  flushList();
  return <>{out}</>;
}

function inline(s: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0; let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m.index > last) parts.push(s.slice(last, m.index));
    if (m[1] && m[2]) parts.push(<a key={m.index} href={m[2]}>{m[1]}</a>);
    else if (m[3]) parts.push(<strong key={m.index}>{m[3]}</strong>);
    last = m.index + m[0].length;
  }
  if (last < s.length) parts.push(s.slice(last));
  return parts;
}
