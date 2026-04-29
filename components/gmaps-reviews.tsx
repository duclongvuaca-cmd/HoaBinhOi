interface Review {
  rating: number;
  text: string;
  author: string;
  avatar?: string | null;
  relative?: string;
  published?: string | null;
}

interface Props {
  rating: number | null;
  count: number | null;
  reviews: Review[] | null;
}

export function GmapsReviews({ rating, count, reviews }: Props) {
  if (!rating || !reviews || reviews.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-slate-500">Đánh giá từ Google Maps</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-amber-500 text-2xl">★</span>
            <span className="font-display text-2xl font-bold">{rating.toFixed(1)}</span>
            <span className="text-sm text-slate-500">({count?.toLocaleString("vi-VN")} đánh giá)</span>
          </div>
        </div>
        <img src="https://www.gstatic.com/images/branding/product/2x/maps_64dp.png" alt="Google Maps" className="h-8 w-8 opacity-70" />
      </div>

      <ul className="space-y-3">
        {reviews.map((r, i) => (
          <li key={i} className="border-t border-slate-100 pt-3 first:border-0 first:pt-0">
            <div className="flex items-center gap-2 mb-1">
              {r.avatar && (
                <img src={r.avatar} alt={r.author} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
              )}
              <span className="text-sm font-medium">{r.author}</span>
              <span className="text-amber-500 text-xs">{"★".repeat(r.rating)}</span>
              {r.relative && (
                <span className="text-xs text-slate-400 ml-auto">{r.relative}</span>
              )}
            </div>
            {r.text && <p className="text-sm text-slate-700 leading-relaxed line-clamp-4">{r.text}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
