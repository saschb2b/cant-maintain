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
} from "lucide-react";
import type { ChallengeCategory } from "@/lib/game/types";
import { CATEGORY_SECTIONS, CATEGORY_LABELS } from "@/lib/game/categories";
import { decodeSeed } from "@/lib/game/seeded-random";

const ALL_CATEGORIES = CATEGORY_SECTIONS.flatMap((s) => s.categories);

interface LobbyScreenProps {
  onStart: (rawSeed: string, excludedCategories: Set<ChallengeCategory>) => void;
  defaultSeed?: string;
}

export function LobbyScreen({ onStart, defaultSeed = "" }: LobbyScreenProps) {
  const defaultDecoded = defaultSeed ? decodeSeed(defaultSeed) : null;
  const [seedInput, setSeedInput] = useState(defaultDecoded?.rawSeed ?? "");
  const [excluded, setExcluded] = useState<Set<ChallengeCategory>>(
    defaultDecoded?.excludedCategories ?? new Set(),
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
    <Stack spacing={0}>
      {/* Hero */}
      <Box
        sx={{
          textAlign: "center",
          pt: { xs: 4, md: 10 },
          pb: { xs: 4, md: 6 },
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          fontWeight={700}
          sx={{
            lineHeight: 1.15,
            mb: { xs: 1, md: 2 },
            fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
          }}
        >
          Ready when you are
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            lineHeight: 1.7,
            mb: { xs: 3, md: 4 },
            maxWidth: 440,
            mx: "auto",
            fontSize: { xs: "0.9rem", md: "1rem" },
          }}
        >
          Two code snippets, side by side.
          Pick the one with the better component API.
        </Typography>

        {/* What to expect */}
        <Stack
          direction="row"
          spacing={{ xs: 2, md: 4 }}
          justifyContent="center"
          sx={{ mb: { xs: 3, md: 5 } }}
        >
          {[
            { icon: <Layers size={16} />, label: "10 questions" },
            { icon: <Timer size={16} />, label: "~3 minutes" },
            { icon: <Eye size={16} />, label: "No trick questions" },
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

        <Button
          variant="contained"
          size="large"
          onClick={handleStart}
          endIcon={<ArrowRight size={18} />}
          sx={{
            minWidth: 220,
            py: 1.25,
            px: 5,
            fontSize: "1.05rem",
          }}
        >
          Go
        </Button>

        <Typography
          variant="caption"
          color="text.secondary"
          fontFamily="var(--font-geist-mono), monospace"
          sx={{ display: "block", mt: 1.5 }}
        >
          no signup &middot; instant start
        </Typography>
      </Box>

      {/* Customize section */}
      <Box
        sx={{
          borderTop: 1,
          borderColor: "divider",
          py: { xs: 2, md: 3 },
        }}
      >
        <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 3, md: 5 }}
            alignItems="flex-start"
            sx={{ pt: { xs: 2, md: 3 } }}
          >
            {/* Seed card */}
            <Paper
              elevation={0}
              sx={{
                border: 1,
                borderColor: "divider",
                p: 3,
                flex: 1,
                minWidth: 0,
                width: { xs: "100%", md: "auto" },
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.75}
                sx={{ mb: 1 }}
              >
                <Hash size={14} color="var(--mui-palette-text-secondary)" />
                <Typography variant="body2" fontWeight={600}>
                  Seed
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, lineHeight: 1.6 }}
              >
                Play the exact same challenges as a friend.
                Leave empty for a random set.
              </Typography>
              <TextField
                placeholder="e.g. A3X9K2"
                size="small"
                fullWidth
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
                }}
                sx={{ maxWidth: 220 }}
              />
            </Paper>

            {/* Categories card */}
            <Paper
              elevation={0}
              sx={{
                border: 1,
                borderColor: "divider",
                p: 3,
                flex: 2,
                minWidth: 0,
                width: { xs: "100%", md: "auto" },
                opacity: hasSeed ? 0.45 : 1,
                pointerEvents: hasSeed ? "none" : "auto",
                transition: "opacity 0.2s ease",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 1 }}
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
                  {enabledCount}/{ALL_CATEGORIES.length} active
                </Typography>
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2.5, lineHeight: 1.6 }}
              >
                {hasSeed
                  ? seedHasCategories
                    ? "This seed includes a category preset — categories are locked to match the original game."
                    : "This seed uses all categories."
                  : "Click to toggle. Challenges are drawn only from active categories."}
              </Typography>

              <Stack spacing={2}>
                {CATEGORY_SECTIONS.map((section) => (
                  <Box key={section.label}>
                    <Box
                      onClick={() => toggleSection(section.categories)}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.75,
                        mb: 0.75,
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
                              height: 28,
                              fontSize: "0.73rem",
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
      </Box>
    </Stack>
  );
}
