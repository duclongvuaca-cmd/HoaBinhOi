import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hoà Bình Ơi",
    short_name: "HBOi",
    description: "Du lịch phường Hoà Bình — hành trình chọn sẵn, bí quyết người bản địa",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#287a55",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" }
    ]
  };
}
