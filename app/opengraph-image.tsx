import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Can't Maintain — React Prop Naming Game";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#1A2332",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Angle brackets */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          marginBottom: 48,
        }}
      >
        <svg width="80" height="80" viewBox="0 0 180 180" fill="none">
          <path
            d="M80 34 L36 90 L80 146"
            stroke="#2B4C7E"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M100 34 L144 90 L100 146"
            stroke="#D4873C"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: "#F5F0EB",
          marginBottom: 16,
        }}
      >
        {"Can't Maintain"}
      </div>

      <div
        style={{
          fontSize: 26,
          color: "#8B9AAD",
          maxWidth: 700,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        Can you spot the better React props?
      </div>

      {/* Code preview strip */}
      <div
        style={{
          display: "flex",
          gap: 32,
          marginTop: 48,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            borderRadius: 8,
            background: "rgba(196,87,58,0.15)",
            border: "1px solid rgba(196,87,58,0.3)",
          }}
        >
          <span style={{ color: "#C4573A", fontSize: 22, fontWeight: 600 }}>
            delete
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#536476",
            fontSize: 22,
          }}
        >
          vs
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            borderRadius: 8,
            background: "rgba(91,138,114,0.15)",
            border: "1px solid rgba(91,138,114,0.3)",
          }}
        >
          <span style={{ color: "#5B8A72", fontSize: 22, fontWeight: 600 }}>
            onDelete
          </span>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
