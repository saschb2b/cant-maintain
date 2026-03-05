import { ImageResponse } from "next/og";
import { decodeResults, getRank } from "@/lib/game/share";

export const runtime = "edge";
export const alt = "Can't Maintain - Results";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const decoded = decodeResults(params.r ?? "");

  if (!decoded) {
    return renderFallback();
  }

  const { score, total, streak, seconds, results } = decoded;
  const percentage = Math.round((score / total) * 100);
  const rank = getRank(percentage);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeStr = `${String(minutes)}:${secs.toString().padStart(2, "0")}`;

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
      {/* Title */}
      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: "#8B9AAD",
          marginBottom: 32,
        }}
      >
        {"Can't Maintain"}
      </div>

      {/* Score */}
      <div
        style={{
          fontSize: 80,
          fontWeight: 700,
          color: "#F5F0EB",
          lineHeight: 1,
        }}
      >
        {score}/{total}
      </div>

      {/* Rank */}
      <div
        style={{
          fontSize: 32,
          fontWeight: 600,
          color:
            percentage >= 70
              ? "#4A7A62"
              : percentage >= 50
                ? "#B8860B"
                : "#B5432A",
          marginTop: 12,
          marginBottom: 8,
        }}
      >
        {rank}
      </div>

      {/* Stats */}
      <div
        style={{
          fontSize: 20,
          color: "#536476",
          marginBottom: 32,
          display: "flex",
          gap: 24,
        }}
      >
        <span>Streak: {streak}x</span>
        <span>{timeStr}</span>
      </div>

      {/* Dots */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 40,
        }}
      >
        {results.map((isCorrect, i) => (
          <div
            key={i}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              background: isCorrect
                ? "rgba(74,122,98,0.3)"
                : "rgba(181,67,42,0.3)",
              border: `2px solid ${isCorrect ? "#4A7A62" : "#B5432A"}`,
            }}
          />
        ))}
      </div>

      {/* CTA */}
      <div
        style={{
          fontSize: 22,
          color: "#8B9AAD",
        }}
      >
        Can you spot the better React props?
      </div>
    </div>,
    { ...size },
  );
}

function renderFallback() {
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
        }}
      >
        Can you spot the better React props?
      </div>
    </div>,
    { ...size },
  );
}
