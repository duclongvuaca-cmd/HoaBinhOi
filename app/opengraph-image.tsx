import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Hoà Bình Ơi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #216145, #37996b)",
          color: "white",
          padding: 80,
          fontFamily: "system-ui"
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 800, marginBottom: 20 }}>Hoà Bình Ơi</div>
        <div style={{ fontSize: 32, opacity: 0.9, textAlign: "center" }}>
          Du lịch phường Hoà Bình — hành trình chọn sẵn, bí quyết người bản địa
        </div>
        <div style={{ fontSize: 22, opacity: 0.7, marginTop: 40 }}>hoabinhoi.vn</div>
      </div>
    ),
    size
  );
}
