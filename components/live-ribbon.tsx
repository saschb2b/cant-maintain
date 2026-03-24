"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Zap } from "lucide-react";
import type { RecentResult } from "@/lib/game/recent-results-store";
import { fetchRecentResults } from "@/lib/game/actions";

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${String(mins)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${String(hours)}h ago`;
  const days = Math.floor(hours / 24);
  return `${String(days)}d ago`;
}

function scoreColor(score: number, total: number): string {
  const pct = Math.round((score / total) * 100);
  if (pct >= 70) return "success.main";
  if (pct >= 50) return "warning.main";
  return "error.main";
}

function ResultCard({ result }: { result: RecentResult }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
    >
      <Typography
        variant="caption"
        fontWeight={700}
        fontFamily="var(--font-geist-mono), monospace"
        sx={{
          color: scoreColor(result.score, result.total),
          fontSize: "0.7rem",
        }}
      >
        {result.score}/{result.total}
      </Typography>
      {result.bestStreak >= 3 && (
        <Stack direction="row" alignItems="center" spacing={0.25}>
          <Zap size={9} color="var(--mui-palette-warning-main)" />
          <Typography
            variant="caption"
            fontFamily="var(--font-geist-mono), monospace"
            sx={{ color: "warning.main", fontSize: "0.6rem" }}
          >
            {result.bestStreak}x
          </Typography>
        </Stack>
      )}
      <Typography
        variant="caption"
        sx={{ color: "text.disabled", fontSize: "0.6rem" }}
      >
        {formatTimeAgo(result.timestamp)}
      </Typography>
    </Stack>
  );
}

/** Thin separator dot between result cards. */
function Dot() {
  return (
    <Box
      sx={{
        width: 3,
        height: 3,
        borderRadius: "50%",
        bgcolor: "text.disabled",
        flexShrink: 0,
      }}
    />
  );
}

export function LiveRibbon() {
  const [results, setResults] = useState<RecentResult[]>([]);

  useEffect(() => {
    void fetchRecentResults().then(setResults);
    const interval = setInterval(() => {
      void fetchRecentResults().then(setResults);
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  // Duplicate items for seamless infinite scroll
  const items = results.length > 0 ? [...results, ...results] : [];

  return (
    <Box
      aria-label="Recent game results from other players"
      sx={{
        position: "relative",
        zIndex: 1,
        py: 0.75,
        minHeight: 32,
        visibility: items.length > 0 ? "visible" : "hidden",
        "@media (prefers-reduced-motion: reduce)": {
          "& .ribbon-track": {
            animationPlayState: "paused",
          },
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ display: "flex", alignItems: "center", gap: 2 }}
      >
        {/* Pinned count */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.75}
          sx={{ flexShrink: 0 }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor: "success.main",
              animation: "pulse-dot 2s ease-in-out infinite",
              "@keyframes pulse-dot": {
                "0%, 100%": { opacity: 1 },
                "50%": { opacity: 0.3 },
              },
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            fontFamily="var(--font-geist-mono), monospace"
            sx={{ fontSize: "0.65rem", whiteSpace: "nowrap" }}
          >
            {results.length} today
          </Typography>
        </Stack>

        {/* Scrolling track */}
        <Box
          sx={{
            overflow: "hidden",
            flex: 1,
            minWidth: 0,
            maskImage:
              "linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)",
          }}
        >
          <Stack
            className="ribbon-track"
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              width: "max-content",
              animation: `ribbon-scroll ${String(Math.max(60, results.length * 3))}s linear infinite`,
              "&:hover": {
                animationPlayState: "paused",
              },
              "@keyframes ribbon-scroll": {
                "0%": { transform: "translateX(0)" },
                "100%": { transform: "translateX(-50%)" },
              },
            }}
          >
            {items.map((r, i) => (
              <Stack
                key={`${r.id}-${String(i)}`}
                direction="row"
                alignItems="center"
                spacing={2}
              >
                {i > 0 && <Dot />}
                <ResultCard result={r} />
              </Stack>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
