import { getPois } from "@/lib/data";
import { CATEGORY_META, type Category } from "@/lib/types";
import { PoiCard } from "./poi-card";

export async function CategoryPage({ category }: { category: Category }) {
  const pois = await getPois(category);
  const meta = CATEGORY_META[category];

  return (
    <main>
      <section className="bg-gradient-to-br from-brand-700 to-brand-500 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-6xl mb-3">{meta.emoji}</div>
          <h1 className="font-display text-5xl mb-3">{meta.title}</h1>
          <p className="text-xl text-brand-100 max-w-2xl">{meta.subtitle}</p>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {pois.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <p>Chưa có điểm nào trong danh mục này. Sẽ cập nhật sớm.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pois.map((p) => <PoiCard key={p.slug} poi={p} />)}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
