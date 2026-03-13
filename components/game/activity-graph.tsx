"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { useColorScheme } from "@mui/material/styles";
import { getActivityGrid } from "@/lib/game/activity";

const MIN_WEEKS = 10;
const MAX_WEEKS = 52;
const CELL_GAP = 3;
const LABEL_WIDTH = 28;
const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", ""];
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getLevel(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count <= 4) return 3;
  return 4;
}

const LEVEL_COLORS_LIGHT = [
  "#E8E0D4",
  "#A8C5AE",
  "#6F9E7A",
  "#4A7A62",
  "#2F5A45",
];
const LEVEL_COLORS_DARK = [
  "#2E2924",
  "#3A6B4A",
  "#4A8A5E",
  "#6BA882",
  "#8CC8A0",
];

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Calculate how many weeks fit in a given width, keeping cell size ≥ 10px. */
function calcLayout(containerWidth: number): {
  weeks: number;
  cellSize: number;
} {
  const available = containerWidth - LABEL_WIDTH;
  // Try to fill the space with the largest cells ≥ 10px
  // available = weeks * (cellSize + gap) - gap
  // Start from MAX_WEEKS and shrink until cells are ≥ 10
  for (let w = MAX_WEEKS; w >= MIN_WEEKS; w--) {
    const cellSize = Math.floor((available + CELL_GAP) / w - CELL_GAP);
    if (cellSize >= 10) return { weeks: w, cellSize: Math.min(cellSize, 14) };
  }
  return { weeks: MIN_WEEKS, cellSize: 10 };
}

export function ActivityGraph() {
  const { mode, systemMode } = useColorScheme();
  const resolvedMode = mode === "system" ? systemMode : mode;
  const levelColors = resolvedMode === "dark" ? LEVEL_COLORS_DARK : LEVEL_COLORS_LIGHT;

  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<{
    weeks: number;
    cellSize: number;
  } | null>(null);

  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.offsetWidth;
    setLayout(calcLayout(width));
  }, []);

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [measure]);

  const grid = useMemo(
    () => (layout ? getActivityGrid(layout.weeks) : []),
    [layout],
  );

  const weeks = useMemo(() => {
    const result: (typeof grid)[] = [];
    for (let i = 0; i < grid.length; i += 7) {
      result.push(grid.slice(i, i + 7));
    }
    return result;
  }, [grid]);

  const monthLabels = useMemo(() => {
    const labels: { weekIndex: number; label: string }[] = [];
    let lastMonth = -1;
    for (let w = 0; w < weeks.length; w++) {
      const firstDay = weeks[w]?.[0];
      if (!firstDay) continue;
      const month = firstDay.date.getMonth();
      if (month !== lastMonth) {
        labels.push({ weekIndex: w, label: MONTH_NAMES[month] ?? "" });
        lastMonth = month;
      }
    }
    return labels;
  }, [weeks]);

  const totalGames = useMemo(
    () => grid.reduce((sum, d) => sum + d.count, 0),
    [grid],
  );
  const cellSize = layout?.cellSize ?? 12;
  const step = cellSize + CELL_GAP;

  return (
    <Box ref={containerRef}>
      {layout && grid.length > 0 && (
        <>
          {/* Header */}
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ fontSize: "0.68rem", mb: 1.5, display: "block" }}
          >
            {totalGames === 0
              ? "No activity yet — play a game to start your streak!"
              : `${String(totalGames)} game${totalGames === 1 ? "" : "s"} in the last ${String(layout.weeks)} weeks`}
          </Typography>

          {/* Month labels */}
          <Box
            sx={{
              position: "relative",
              height: 14,
              ml: `${String(LABEL_WIDTH)}px`,
              mb: 0.5,
            }}
          >
            {monthLabels.map(({ weekIndex, label }) => (
              <Typography
                key={`${label}-${String(weekIndex)}`}
                variant="caption"
                color="text.disabled"
                sx={{
                  fontSize: "0.6rem",
                  position: "absolute",
                  left: weekIndex * step,
                  top: 0,
                }}
              >
                {label}
              </Typography>
            ))}
          </Box>

          {/* Grid with day labels */}
          <Box sx={{ display: "flex" }}>
            {/* Day labels */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: `${String(CELL_GAP)}px`,
                width: LABEL_WIDTH,
                flexShrink: 0,
              }}
            >
              {DAY_LABELS.map((label, i) => (
                <Box
                  key={i}
                  sx={{
                    height: cellSize,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ fontSize: "0.55rem", lineHeight: 1 }}
                  >
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Cells */}
            <Box
              sx={{
                display: "flex",
                gap: `${String(CELL_GAP)}px`,
                flex: 1,
                minWidth: 0,
              }}
            >
              {weeks.map((week, wIdx) => (
                <Box
                  key={wIdx}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: `${String(CELL_GAP)}px`,
                  }}
                >
                  {week.map((day) => {
                    const level = getLevel(day.count);
                    const tooltip =
                      day.count === 0
                        ? `No games on ${formatDate(day.date)}`
                        : `${String(day.count)} game${day.count === 1 ? "" : "s"} on ${formatDate(day.date)}`;
                    return (
                      <Tooltip
                        key={day.dateKey}
                        title={tooltip}
                        arrow
                        placement="top"
                        slotProps={{
                          tooltip: {
                            sx: {
                              fontSize: "0.65rem",
                              fontFamily: "var(--font-geist-mono), monospace",
                            },
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: cellSize,
                            height: cellSize,
                            borderRadius: "2px",
                            bgcolor: levelColors[level],
                            transition: "opacity 0.15s ease",
                            "&:hover": { opacity: 0.8 },
                          }}
                        />
                      </Tooltip>
                    );
                  })}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Legend */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 0.5,
              mt: 1.5,
            }}
          >
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ fontSize: "0.55rem", mr: 0.25 }}
            >
              Less
            </Typography>
            {levelColors.map((color, i) => (
              <Box
                key={i}
                sx={{
                  width: cellSize,
                  height: cellSize,
                  borderRadius: "2px",
                  bgcolor: color,
                }}
              />
            ))}
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ fontSize: "0.55rem", ml: 0.25 }}
            >
              More
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}
