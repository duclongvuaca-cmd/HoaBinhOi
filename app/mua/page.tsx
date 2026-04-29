export const revalidate = 60;

import { CategoryPage } from "@/components/category-page";

export const metadata = { title: "Mua gì ở Hoà Bình — Hoà Bình Ơi" };

export default function Page() {
  return <CategoryPage category="mua" />;
}
