import { PoiEditForm } from "@/components/admin/poi-edit-form";

export default function NewPoi() {
  return (
    <div>
      <h1 className="font-display text-3xl mb-2">Thêm POI mới</h1>
      <p className="text-slate-500 text-sm mb-6">
        Paste URL Google Maps để auto-fill toạ độ + place_id, sau đó điền nội dung.
      </p>
      <PoiEditForm mode="new" />
    </div>
  );
}
