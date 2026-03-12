"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import {
  ArrowRight,
  Eye,
  Timer,
  Layers,
  Hash,
  Dices,
  X,
} from "lucide-react";
import type { Challenge, ChallengeCategory } from "@/lib/game/types";
import { CATEGORY_SECTIONS, CATEGORY_LABELS } from "@/lib/game/categories";
import { decodeSeed, generateSeed } from "@/lib/game/seeded-random";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";

const ALL_CATEGORIES = CATEGORY_SECTIONS.flatMap((s) => s.categories);

const SESSION_PICKS: Record<string, number> = { easy: 3, medium: 4, hard: 3 };

function countSessionChallenges(
  challenges: Challenge[],
  excludedCategories: Set<ChallengeCategory>,
): number {
  const pool =
    excludedCategories.size === 0
      ? challenges
      : challenges.filter((c) => !excludedCategories.has(c.category));
  const byDifficulty: Record<string, number> = { easy: 0, medium: 0, hard: 0 };
  for (const c of pool) byDifficulty[c.difficulty] = (byDifficulty[c.difficulty] ?? 0) + 1;
  return Object.entries(SESSION_PICKS).reduce(
    (sum, [d, pick]) => sum + Math.min(pick, byDifficulty[d] ?? 0),
    0,
  );
}

interface LobbyScreenProps {
  challenges: Challenge[];
  onStart: (rawSeed: string, excludedCategories: Set<ChallengeCategory>) => void;
  defaultSeed?: string;
}

export function LobbyScreen({ challenges, onStart, defaultSeed = "" }: LobbyScreenProps) {
  const defaultDecoded = defaultSeed ? decodeSeed(defaultSeed) : null;
  const [seedInput, setSeedInput] = useState(defaultSeed);
  const [excluded, setExcluded] = useState<Set<ChallengeCategory>>(
    defaultDecoded?.excludedCategories ?? new Set(),
  );

  const hasSeed = seedInput.trim().length > 0;
  const seedDecoded = hasSeed ? decodeSeed(seedInput.trim().toUpperCase()) : null;
  const seedHasCategories = (seedDecoded?.excludedCategories.size ?? 0) > 0;
  const effectiveExcluded = hasSeed ? (seedDecoded?.excludedCategories ?? new Set<ChallengeCategory>()) : excluded;
  const enabledCount = ALL_CATEGORIES.length - effectiveExcluded.size;
  const sessionCount = countSessionChallenges(challenges, effectiveExcluded);

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
      onStart(rawSeed, excludedCategories);
    } else {
      onStart("", excluded);
    }
  };

  return (
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
            mb: { xs: 2, md: 4 },
            fontSize: { xs: "0.9rem", md: "1rem" },
          }}
        >
          Focus on specific categories or play them all.
          Hit Go to jump straight in.
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

        {/* Info pills */}
        <Stack
          direction="row"
          spacing={{ xs: 2, md: 3 }}
          sx={{
            mt: 1.5,
            mb: { xs: 2.5, md: 3 },
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          {[
            { icon: <Layers size={14} />, label: `${String(sessionCount)} questions` },
            { icon: <Timer size={14} />, label: "~3 min" },
            { icon: <Eye size={14} />, label: "No tricks" },
          ].map((item) => (
            <Stack
              key={item.label}
              direction="row"
              alignItems="center"
              spacing={0.75}
            >
              <Box sx={{ color: "text.secondary", display: "flex" }}>
                {item.icon}
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontFamily="var(--font-geist-mono), monospace"
                sx={{ fontSize: "0.72rem" }}
              >
                {item.label}
              </Typography>
            </Stack>
          ))}
        </Stack>

        {/* Seed input */}
        <Box>
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.75}
            sx={{ mb: 0.75, justifyContent: { xs: "center", md: "flex-start" } }}
          >
            <Hash size={13} color="var(--mui-palette-text-secondary)" />
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
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
      <Paper
        elevation={0}
        sx={{
          border: 1,
          borderColor: "divider",
          p: { xs: 2.5, md: 3 },
          flex: 1,
          minWidth: 0,
          width: { xs: "100%", md: "auto" },
          maxWidth: { md: 520 },
          opacity: hasSeed ? 0.45 : 1,
          pointerEvents: hasSeed ? "none" : "auto",
          transition: "opacity 0.2s ease",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 0.75 }}
        >
          <Typography variant="body2" fontWeight={600}>
            Categories
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            fontFamily="var(--font-geist-mono), monospace"
            sx={{ fontSize: "0.7rem" }}
          >
            {enabledCount}/{ALL_CATEGORIES.length} active &middot; {sessionCount} questions
          </Typography>
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, lineHeight: 1.6, fontSize: "0.82rem" }}
        >
          {hasSeed
            ? seedHasCategories
              ? "This seed includes a category preset — categories are locked to match the original game."
              : "This seed uses all categories."
            : "Click to toggle. Challenges are drawn only from active categories."}
        </Typography>

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
                          ? "rgba(0,0,0,0.07)"
                          : "transparent",
                        color: isEnabled
                          ? "text.primary"
                          : "text.disabled",
                        border: 1,
                        borderColor: isEnabled
                          ? "transparent"
                          : "divider",
                        opacity: isEnabled ? 1 : 0.45,
                        transition: "all 0.15s ease",
                        "&:hover": {
                          bgcolor: isEnabled
                            ? "rgba(0,0,0,0.12)"
                            : "rgba(0,0,0,0.04)",
                        },
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}
