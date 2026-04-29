export const revalidate = 60;

import { CategoryPage } from "@/components/category-page";

export const metadata = { title: "Sự kiện Hoà Bình — Hoà Bình Ơi" };

export default function Page() {
  return <CategoryPage category="su-kien" />;
}
