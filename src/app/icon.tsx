import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// AB monogram. Colours mirror the folio tokens (--bg, --text-strong, --accent).
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 64,
        height: 64,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#131011",
      }}
    >
      <div
        style={{
          fontSize: 30,
          fontWeight: 800,
          fontFamily: "Arial, Helvetica, sans-serif",
          color: "#f1ebdd",
          lineHeight: 1,
          letterSpacing: -1,
        }}
      >
        AB
      </div>
      <div
        style={{
          width: 24,
          height: 4,
          background: "#e5584f",
          marginTop: 5,
        }}
      />
    </div>,
    { ...size }
  );
}
