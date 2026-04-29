import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { PoiEditForm } from "@/components/admin/poi-edit-form";

export default async function EditPoi({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sb = createClient();
  const { data: poi } = await sb.from("pois").select("*").eq("slug", slug).maybeSingle();
  if (!poi) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl mb-2">Sửa POI</h1>
      <p className="text-slate-500 text-sm mb-6">{poi.slug}</p>
      <PoiEditForm poi={poi} mode="edit" />
    </div>
  );
}
