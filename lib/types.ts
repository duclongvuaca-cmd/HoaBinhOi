export type Category = "an" | "mua" | "nghi" | "choi" | "diem-den" | "su-kien";

export interface POI {
  slug: string;
  name: string;
  category: Category;
  lat: number;
  lng: number;
  place_id?: string | null;
  google_cid?: string | null;
  address?: string | null;
  phone?: string | null;
  description?: string | null;
  insider_tip?: string | null;
  price_range?: string | null;
  open_hours?: Record<string, string> | null;
  images?: string[];
  tags?: string[];
  source_url?: string | null;
  status?: "draft" | "published" | "archived";
}

export interface ItineraryStop {
  start_time: string;
  end_time?: string;
  poi_slug: string;
  note?: string;
}

export interface Itinerary {
  slug: string;
  title: string;
  persona: string;
  duration: string;
  budget_low: number;
  budget_high: number;
  highlights: string[];
  description: string;
  hero_color: string;
  stops: ItineraryStop[];
}

export const CATEGORY_META: Record<Category, { emoji: string; title: string; subtitle: string }> = {
  "an":       { emoji: "🍲", title: "Ăn gì",        subtitle: "Cá sông Đà, cơm lam, lợn mán & quán bí quyết" },
  "mua":      { emoji: "🛍️", title: "Mua gì",       subtitle: "Đặc sản chính gốc — không bị hớ" },
  "nghi":     { emoji: "🛏️", title: "Nghỉ ở đâu",   subtitle: "Khách sạn, homestay, resort theo ngân sách" },
  "choi":     { emoji: "🎯", title: "Trải nghiệm",  subtitle: "Pickleball, chèo SUP, đạp xe, xông hơi" },
  "diem-den": { emoji: "🏞️", title: "Điểm đến",    subtitle: "Cảnh, di tích, văn hoá địa phương" },
  "su-kien":  { emoji: "🎉", title: "Sự kiện",      subtitle: "Lễ hội, chợ phiên, đua thuyền" }
};
