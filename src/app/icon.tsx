import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// AB monogram. Colours mirror the dark folio tokens (--bg, --text-strong,
// --accent) so the tab icon reads on light and dark browser chrome.
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
        background: "#0b0b0c",
        borderRadius: 14,
      }}
    >
      <div
        style={{
          fontSize: 30,
          fontWeight: 800,
          fontFamily: "Arial, Helvetica, sans-serif",
          color: "#f4f1ea",
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
          borderRadius: 2,
          background: "#ec5a50",
          marginTop: 5,
        }}
      />
    </div>,
    { ...size }
  );
}
