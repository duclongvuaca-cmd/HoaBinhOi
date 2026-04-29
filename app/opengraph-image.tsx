import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Hoà Bình Ơi — du lịch lòng hồ, đập thuỷ điện, thác Bờ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Nh%C3%A0_m%C3%A1y_Th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg/1280px-Nh%C3%A0_m%C3%A1y_Th%E1%BB%A7y_%C4%91i%E1%BB%87n_H%C3%B2a_B%C3%ACnh.jpg";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 80,
          color: "white",
          fontFamily: "system-ui",
          backgroundImage: `linear-gradient(135deg, rgba(25,63,48,0.85), rgba(33,97,69,0.55)), url(${BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.9, marginBottom: 12 }}>
          Phường Hoà Bình · Tỉnh Phú Thọ
        </div>
        <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1, marginBottom: 18 }}>
          Hoà Bình Ơi
        </div>
        <div style={{ fontSize: 30, opacity: 0.95, maxWidth: 900 }}>
          Đập thuỷ điện · Thác Bờ · Lòng hồ Sông Đà · Bí quyết người bản địa
        </div>
        <div style={{ fontSize: 20, opacity: 0.7, marginTop: 24 }}>hoabinhoi.vn</div>
      </div>
    ),
    size
  );
}
