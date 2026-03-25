"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import {
  ArrowRight,
  Hash,
  Dices,
  History,
  Flame,
  Sun,
  Calendar,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import type { Challenge, ChallengeCategory } from "@/lib/game/types";
import { CATEGORY_SECTIONS, CATEGORY_LABELS } from "@/lib/game/categories";
import {
  decodeSeed,
  generateSeed,
  seedFromKey,
  getTodayKey,
  getWeekKey,
} from "@/lib/game/seeded-random";
import {
  getHistory,
  getEntryBySeed,
  formatRelativeDate,
  type HistoryEntry,
} from "@/lib/game/history";
import { trackEvent } from "@/lib/analytics";
import { ActivityGraph } from "./activity-graph";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";

const ALL_CATEGORIES = CATEGORY_SECTIONS.flatMap((s) => s.categories);

function ChallengeCard({
  icon,
  label,
  sublabel,
  seed,
  result,
  onPlay,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  seed: string;
  result: HistoryEntry | null;
  onPlay: () => void;
}) {
  const completed = result !== null;
  const pct = completed
    ? Math.round((result.bestScore / result.total) * 100)
    : 0;
  const scoreColor =
    pct >= 70 ? "success.main" : pct >= 50 ? "warning.main" : "error.main";

  return (
    <Paper
      elevation={0}
      onClick={onPlay}
      sx={{
        flex: 1,
        border: 1,
        borderColor: "divider",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.75}
        sx={{
          px: 2,
          py: 1,
          bgcolor: "secondary.main",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box sx={{ color: "text.secondary", display: "flex" }}>{icon}</Box>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          sx={{ fontSize: "0.72rem" }}
        >
          {label}
        </Typography>
        {completed && (
          <Box sx={{ color: "success.main", display: "flex", ml: "auto" }}>
            <Check size={16} />
          </Box>
        )}
      </Stack>

      <Box sx={{ p: 2 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.5 }}
        >
          {sublabel}
        </Typography>

        {completed ? (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ mt: 1.5 }}
          >
            <Typography
              fontFamily="var(--font-geist-mono), monospace"
              fontWeight={700}
              sx={{ fontSize: "1.1rem", color: scoreColor }}
            >
              {result.bestScore}/{result.total}
            </Typography>
            {result.bestStreak > 0 && (
              <Stack direction="row" alignItems="center" spacing={0.25}>
                <Flame size={12} color="var(--mui-palette-text-disabled)" />
                <Typography
                  variant="caption"
                  color="text.disabled"
                  fontFamily="var(--font-geist-mono), monospace"
                  sx={{ fontSize: "0.7rem" }}
                >
                  {result.bestStreak}
                </Typography>
              </Stack>
            )}
            {result.plays > 1 && (
              <Typography
                variant="caption"
                color="text.disabled"
                fontFamily="var(--font-geist-mono), monospace"
                sx={{ fontSize: "0.65rem" }}
              >
                {result.plays}x
              </Typography>
            )}
            <Typography
              variant="caption"
              color="text.disabled"
              fontFamily="var(--font-geist-mono), monospace"
              sx={{ fontSize: "0.65rem", ml: "auto" }}
            >
              {pct < 100 ? "Improve?" : "Perfect!"}
            </Typography>
          </Stack>
        ) : (
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.75}
            sx={{ mt: 1.5 }}
          >
            <Typography
              fontFamily="var(--font-geist-mono), monospace"
              fontWeight={600}
              sx={{
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                color: "text.secondary",
              }}
            >
              {seed}
            </Typography>
            <Box sx={{ ml: "auto", color: "text.secondary", display: "flex" }}>
              <ArrowRight size={14} />
            </Box>
          </Stack>
        )}
      </Box>
    </Paper>
  );
}

export type GameType = "daily" | "weekly" | "custom";

interface LobbyScreenProps {
  challenges: Challenge[];
  onStart: (
    rawSeed: string,
    excludedCategories: Set<ChallengeCategory>,
    gameType: GameType,
  ) => void;
  defaultSeed?: string;
  defaultExcluded?: Set<ChallengeCategory>;
}

export function LobbyScreen({
  onStart,
  defaultSeed = "",
  defaultExcluded,
}: LobbyScreenProps) {
  const defaultDecoded = defaultSeed ? decodeSeed(defaultSeed) : null;
  const [seedInput, setSeedInput] = useState(defaultSeed);
  const [excluded, setExcluded] = useState(
    defaultDecoded?.excludedCategories ??
      defaultExcluded ??
      new Set<ChallengeCategory>(),
  );

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [dailyResult, setDailyResult] = useState<HistoryEntry | null>(null);
  const [weeklyResult, setWeeklyResult] = useState<HistoryEntry | null>(null);

  const dailySeed = seedFromKey(getTodayKey());
  const weeklySeed = seedFromKey(getWeekKey());

  useEffect(() => {
    setHistory(getHistory()); // eslint-disable-line react-hooks/set-state-in-effect -- hydration-safe: reads localStorage on mount
    setDailyResult(getEntryBySeed(dailySeed));
    setWeeklyResult(getEntryBySeed(weeklySeed));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const hasSeed = seedInput.trim().length > 0;
  const seedDecoded = hasSeed
    ? decodeSeed(seedInput.trim().toUpperCase())
    : null;
  const seedHasCategories = (seedDecoded?.excludedCategories.size ?? 0) > 0;
  const effectiveExcluded = hasSeed
    ? (seedDecoded?.excludedCategories ?? new Set<ChallengeCategory>())
    : excluded;
  const enabledCount = ALL_CATEGORIES.length - effectiveExcluded.size;

  const toggleCategory = (cat: ChallengeCategory) => {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        if (enabledCount <= 1) return prev;
        next.add(cat);
      }
      return next;
    });
  };

  const toggleSection = (categories: ChallengeCategory[]) => {
    setExcluded((prev) => {
      const allDisabled = categories.every((c) => prev.has(c));
      const next = new Set(prev);
      if (allDisabled) {
        // Enable all in this section
        for (const c of categories) next.delete(c);
      } else {
        // Disable all in this section — but keep at least 1 category globally
        const othersEnabled = ALL_CATEGORIES.filter(
          (c) => !prev.has(c) && !categories.includes(c),
        );
        if (othersEnabled.length === 0) return prev;
        for (const c of categories) next.add(c);
      }
      return next;
    });
  };

  const handleStart = () => {
    const trimmed = seedInput.trim().toUpperCase();
    if (trimmed) {
      const { rawSeed, excludedCategories } = decodeSeed(trimmed);
      trackEvent("game-started", {
        seed: trimmed,
        type: "custom",
        categories: ALL_CATEGORIES.length - excludedCategories.size,
      });
      onStart(rawSeed, excludedCategories, "custom");
    } else {
      trackEvent("game-started", {
        seed: "",
        type: "custom",
        categories: enabledCount,
      });
      onStart("", excluded, "custom");
    }
  };

  return (
    <>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ md: "flex-start" }}
        spacing={{ xs: 4, md: 8 }}
        sx={{ pt: { xs: 3, md: 12 }, pb: { xs: 3, md: 8 } }}
      >
        {/* Left column — title, subtitle, seed, CTA */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            fontWeight={700}
            sx={{
              lineHeight: 1.15,
              mb: { xs: 1, md: 1.5 },
              fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
            }}
          >
            Customize your game
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              lineHeight: 1.7,
              mb: { xs: 2, md: 3 },
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            Focus on specific categories or play them all. Hit Go to jump
            straight in.
          </Typography>

          {/* CTA */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ justifyContent: { xs: "center", md: "flex-start" } }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleStart}
              endIcon={<ArrowRight size={18} />}
              sx={{
                px: { xs: 3, md: 5 },
                py: { xs: 1, md: 1.5 },
                fontSize: { xs: "0.9rem", md: "1.05rem" },
              }}
            >
              Go
            </Button>
          </Stack>

          {/* Seed input */}
          <Box sx={{ mt: { xs: 2.5, md: 3 } }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.75}
              sx={{
                mb: 0.75,
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <Hash size={13} color="var(--mui-palette-text-secondary)" />
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
              >
                Seed — play the same game as a friend
              </Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{ justifyContent: { xs: "center", md: "flex-start" } }}
            >
              <TextField
                placeholder="e.g. A3X9K2"
                size="small"
                value={seedInput}
                onChange={(e) => setSeedInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleStart();
                }}
                slotProps={{
                  htmlInput: {
                    maxLength: 20,
                    style: {
                      fontFamily: "var(--font-geist-mono), monospace",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                    },
                  },
                  input: {
                    endAdornment: hasSeed ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSeedInput("")}
                          edge="end"
                          sx={{ color: "text.disabled", p: 0.5 }}
                        >
                          <X size={14} />
                        </IconButton>
                      </InputAdornment>
                    ) : undefined,
                  },
                }}
                sx={{ maxWidth: 200 }}
              />
              <Tooltip title="Random seed" arrow>
                <IconButton
                  size="small"
                  onClick={() => setSeedInput(generateSeed())}
                  sx={{
                    color: "text.secondary",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  <Dices size={18} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </Box>

        {/* Right column — categories */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            width: { xs: "100%", md: "auto" },
            maxWidth: { md: 520 },
            opacity: hasSeed ? 0.45 : 1,
            pointerEvents: hasSeed ? "none" : "auto",
            transition: "opacity 0.2s ease",
          }}
        >
          {hasSeed && (
            <Typography
              variant="caption"
              color="text.secondary"
              fontFamily="var(--font-geist-mono), monospace"
              sx={{ display: "block", mb: 1.5, fontSize: "0.72rem" }}
            >
              {seedHasCategories
                ? "Categories locked by seed."
                : "This seed uses all categories."}
            </Typography>
          )}

          <Stack spacing={1.5}>
            {CATEGORY_SECTIONS.map((section) => (
              <Box key={section.label}>
                <Box
                  onClick={() => toggleSection(section.categories)}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                    mb: 0.5,
                    cursor: "pointer",
                    "&:hover .toggle-hint": {
                      opacity: 1,
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontFamily="var(--font-geist-mono), monospace"
                    sx={{
                      fontSize: "0.63rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {section.label}
                  </Typography>
                  <Typography
                    className="toggle-hint"
                    variant="caption"
                    fontFamily="var(--font-geist-mono), monospace"
                    sx={{
                      fontSize: "0.58rem",
                      color: "text.disabled",
                      opacity: 0,
                      transition: "opacity 0.15s ease",
                    }}
                  >
                    {section.categories.every((c) => effectiveExcluded.has(c))
                      ? "enable all"
                      : "disable all"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                  }}
                >
                  {section.categories.map((cat) => {
                    const isEnabled = !effectiveExcluded.has(cat);
                    return (
                      <Chip
                        key={cat}
                        label={CATEGORY_LABELS[cat]}
                        size="small"
                        onClick={() => toggleCategory(cat)}
                        sx={{
                          height: 26,
                          fontSize: "0.72rem",
                          cursor: "pointer",
                          bgcolor: isEnabled
                            ? "action.selected"
                            : "transparent",
                          color: isEnabled ? "text.primary" : "text.disabled",
                          border: 1,
                          borderColor: isEnabled ? "transparent" : "divider",
                          opacity: isEnabled ? 1 : 0.45,
                          transition: "all 0.15s ease",
                          "&:hover": {
                            bgcolor: isEnabled
                              ? "action.focus"
                              : "action.hover",
                          },
                        }}
                      />
                    );
                  })}
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>

      {/* Challenges — Daily & Weekly side by side */}
      <Box sx={{ pb: { xs: 2, md: 3 } }}>
        <Typography
          variant="caption"
          color="text.secondary"
          fontFamily="var(--font-geist-mono), monospace"
          sx={{
            fontSize: "0.63rem",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            mb: 1.5,
            display: "block",
          }}
        >
          Challenges
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 2, md: 3 }}
          sx={{ maxWidth: { sm: 520 } }}
        >
          <ChallengeCard
            icon={<Sun size={18} />}
            label="Daily"
            sublabel="Resets every day"
            seed={dailySeed}
            result={dailyResult}
            onPlay={() => {
              trackEvent("game-started", {
                seed: dailySeed,
                type: "daily",
                categories: ALL_CATEGORIES.length,
              });
              onStart(dailySeed, new Set(), "daily");
            }}
          />
          <ChallengeCard
            icon={<Calendar size={18} />}
            label="Weekly"
            sublabel="Resets every Monday"
            seed={weeklySeed}
            result={weeklyResult}
            onPlay={() => {
              trackEvent("game-started", {
                seed: weeklySeed,
                type: "weekly",
                categories: ALL_CATEGORIES.length,
              });
              onStart(weeklySeed, new Set(), "weekly");
            }}
          />
        </Stack>
      </Box>

      {/* Activity graph + History side by side */}
      <Box sx={{ pb: { xs: 3, md: 6 } }}>
        <Typography
          variant="caption"
          color="text.secondary"
          fontFamily="var(--font-geist-mono), monospace"
          sx={{
            fontSize: "0.63rem",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            mb: 1.5,
            display: "block",
          }}
        >
          Activity
        </Typography>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ md: "flex-start" }}
          spacing={{ xs: 2, md: 3 }}
        >
          {/* Activity — 2/3 */}
          <Paper
            elevation={0}
            sx={{
              flex: 2,
              minWidth: 0,
              border: 1,
              borderColor: "divider",
              p: { xs: 2, md: 3 },
            }}
          >
            <ActivityGraph />
          </Paper>

          {/* History — 1/3 */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              minWidth: 0,
              border: 1,
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.75}
              sx={{
                px: 2,
                py: 1,
                bgcolor: "secondary.main",
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <History size={13} color="var(--mui-palette-text-secondary)" />
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                sx={{ fontSize: "0.72rem" }}
              >
                Previous games
              </Typography>
            </Stack>
            {history.length === 0 ? (
              <Box sx={{ px: 2, py: 2.5 }}>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ fontSize: "0.72rem" }}
                >
                  No games played yet.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ position: "relative" }}>
                <Stack
                  spacing={0}
                  sx={{
                    py: 0.5,
                    maxHeight: 300,
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                  }}
                >
                  {history.map((entry) => {
                    const pct = Math.round(
                      (entry.bestScore / entry.total) * 100,
                    );
                    return (
                      <Box
                        key={entry.seed}
                        onClick={() => {
                          trackEvent("history-replayed", {
                            seed: entry.seed,
                            previousBestScore: entry.bestScore,
                            plays: entry.plays,
                          });
                          const { rawSeed: s, excludedCategories: ec } =
                            decodeSeed(entry.seed);
                          onStart(s, ec, "custom");
                        }}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: { xs: 1.5, md: 1 },
                          py: { xs: 1, md: 0.75 },
                          px: 2,
                          cursor: "pointer",
                          transition: "background 0.15s ease",
                          "&:hover": { bgcolor: "action.hover" },
                          minHeight: { xs: 40, md: "auto" },
                        }}
                      >
                        <Typography
                          variant="caption"
                          fontFamily="var(--font-geist-mono), monospace"
                          fontWeight={600}
                          sx={{
                            fontSize: "0.72rem",
                            letterSpacing: "0.06em",
                          }}
                        >
                          {entry.seed}
                        </Typography>
                        <Typography
                          variant="caption"
                          fontFamily="var(--font-geist-mono), monospace"
                          sx={{
                            fontSize: "0.72rem",
                            color:
                              pct >= 70
                                ? "success.main"
                                : pct >= 50
                                  ? "warning.main"
                                  : "text.secondary",
                          }}
                        >
                          {entry.bestScore}/{entry.total}
                        </Typography>
                        {entry.bestStreak > 0 && (
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.25}
                          >
                            <Flame
                              size={10}
                              color="var(--mui-palette-text-disabled)"
                            />
                            <Typography
                              variant="caption"
                              color="text.disabled"
                              fontFamily="var(--font-geist-mono), monospace"
                              sx={{ fontSize: "0.65rem" }}
                            >
                              {entry.bestStreak}
                            </Typography>
                          </Stack>
                        )}
                        <Typography
                          variant="caption"
                          color="text.disabled"
                          sx={{
                            fontSize: "0.62rem",
                            ml: "auto",
                            flexShrink: 0,
                          }}
                        >
                          {formatRelativeDate(entry.lastPlayedAt)}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
                {/* Bottom fade hint when list overflows */}
                {history.length > 6 && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 32,
                      background:
                        "linear-gradient(transparent, var(--mui-palette-background-paper))",
                      pointerEvents: "none",
                    }}
                  />
                )}
              </Box>
            )}
          </Paper>
        </Stack>
      </Box>

      {/* More topics */}
      <Box sx={{ pb: { xs: 3, md: 6 } }}>
        <Typography
          variant="caption"
          color="text.secondary"
          fontFamily="var(--font-geist-mono), monospace"
          sx={{
            fontSize: "0.63rem",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            mb: 1.5,
            display: "block",
          }}
        >
          More topics
        </Typography>
        <Box
          component="a"
          href="https://cant-resize.saschb2b.com/play"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: "block",
            textDecoration: "none",
            color: "inherit",
            maxWidth: { sm: 360 },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              border: 1,
              borderColor: "divider",
              overflow: "hidden",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "text.secondary",
                transform: "translateY(-1px)",
              },
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.75}
              sx={{
                px: 2,
                py: 1,
                bgcolor: "secondary.main",
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                sx={{ fontSize: "0.72rem" }}
              >
                {"Can't Resize"}
              </Typography>
              <Box
                sx={{
                  ml: "auto",
                  color: "text.disabled",
                  display: "flex",
                }}
              >
                <ExternalLink size={12} />
              </Box>
            </Stack>
            <Box sx={{ p: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.5 }}
              >
                Think you know responsive design? Same game, same format,
                different topic.
              </Typography>
              <Typography
                variant="caption"
                color="text.disabled"
                fontFamily="var(--font-geist-mono), monospace"
                sx={{ mt: 1, display: "block", fontSize: "0.65rem" }}
              >
                Media queries, flexbox, grid, MUI patterns
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
