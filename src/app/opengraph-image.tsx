import { ImageResponse } from "next/og";

export const alt = "Career Simulator — 20 questions, 5 careers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0a0f14 0%, #134e4a 100%)",
          color: "#e8eef4",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <p style={{ fontSize: 28, color: "#2dd4bf", margin: 0 }}>Career Simulator</p>
        <h1 style={{ fontSize: 64, fontWeight: 700, marginTop: 24, lineHeight: 1.1 }}>
          20 questions → 5 careers
        </h1>
        <p style={{ fontSize: 32, color: "#94a3b8", marginTop: 24, maxWidth: 900 }}>
          1000+ careers · salaries, AI-risk, roadmap
        </p>
      </div>
    ),
    { ...size }
  );
}
