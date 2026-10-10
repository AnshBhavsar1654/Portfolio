import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Light theme, per plan §11: --bg background, serif name, mono role line,
// red accent line.
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 96,
        background: "#faf8f4",
      }}
    >
      <div
        style={{
          width: 72,
          height: 6,
          background: "#c42b22",
          marginBottom: 32,
        }}
      />
      <div
        style={{
          fontSize: 96,
          fontFamily: "Georgia, serif",
          color: "#14130f",
          lineHeight: 1.05,
        }}
      >
        Ansh Bhavsar
      </div>
      <div
        style={{
          marginTop: 24,
          fontSize: 32,
          fontFamily: "monospace",
          color: "#3a3832",
        }}
      >
        {profile.role}
      </div>
    </div>,
    { ...size }
  );
}
