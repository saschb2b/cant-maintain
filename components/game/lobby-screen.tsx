"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import {
  ArrowRight,
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


interface LobbyScreenProps {
  challenges: Challenge[];
  onStart: (rawSeed: string, excludedCategories: Set<ChallengeCategory>) => void;
  defaultSeed?: string;
  defaultExcluded?: Set<ChallengeCategory>;
}

export function LobbyScreen({ challenges, onStart, defaultSeed = "", defaultExcluded }: LobbyScreenProps) {
  const defaultDecoded = defaultSeed ? decodeSeed(defaultSeed) : null;
  const [seedInput, setSeedInput] = useState(defaultSeed);
  const [excluded, setExcluded] = useState<Set<ChallengeCategory>>(
    defaultDecoded?.excludedCategories ?? defaultExcluded ?? new Set(),
  );

  const hasSeed = seedInput.trim().length > 0;
  const seedDecoded = hasSeed ? decodeSeed(seedInput.trim().toUpperCase()) : null;
  const seedHasCategories = (seedDecoded?.excludedCategories.size ?? 0) > 0;
  const effectiveExcluded = hasSeed ? (seedDecoded?.excludedCategories ?? new Set<ChallengeCategory>()) : excluded;
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
            mb: { xs: 2, md: 3 },
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

        {/* Seed input */}
        <Box sx={{ mt: { xs: 2.5, md: 3 } }}>
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

      </Box>
    </Stack>
  );
}
