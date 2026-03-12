"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import { ExternalLink, BookOpen } from "lucide-react";
import type { ChallengeCategory } from "@/lib/game/types";
import { CATEGORY_LABELS } from "@/lib/game/categories";
import { trackEvent } from "@/lib/analytics";
import { FormattedText } from "@/components/formatted-text";

interface ExplanationPanelProps {
  /** Whether the user answered correctly; controls color scheme. */
  isCorrect: boolean;
  /** Explanation text shown after answering. */
  explanationText: string;
  /** URL to an authoritative reference for this convention. */
  sourceUrl: string;
  /** Display label for the source link. */
  sourceLabel: string;
  /** Challenge category, used to link to the learn page. */
  category: ChallengeCategory;
  /** Challenge ID for analytics tracking. */
  challengeId: string;
}

export function ExplanationPanel({
  isCorrect,
  explanationText,
  sourceUrl,
  sourceLabel,
  category,
  challengeId,
}: ExplanationPanelProps) {
  const color = isCorrect ? "success" : "error";

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: isCorrect
          ? "rgba(var(--mui-palette-success-mainChannel) / 0.3)"
          : "rgba(var(--mui-palette-error-mainChannel) / 0.3)",
        bgcolor: isCorrect
          ? "rgba(var(--mui-palette-success-mainChannel) / 0.08)"
          : "rgba(var(--mui-palette-error-mainChannel) / 0.08)",
        p: 2,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Avatar
          sx={{
            width: 24,
            height: 24,
            fontSize: "0.75rem",
            fontWeight: 700,
            bgcolor: `${color}.main`,
            color: `${color}.contrastText`,
            mt: 0.25,
          }}
        >
          {isCorrect ? "+" : "-"}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ typography: "body2", lineHeight: 1.6, mb: 1 }}>
            <FormattedText text={explanationText} />
          </Box>
          <Link
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            onClick={() =>
              trackEvent("source-link-clicked", {
                challengeId,
                category,
                label: sourceLabel,
              })
            }
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              typography: "caption",
              fontWeight: 500,
              color: `${color}.main`,
            }}
          >
            <ExternalLink size={12} />
            {sourceLabel}
          </Link>
          <Link
            href={`/learn/${category}`}
            underline="hover"
            onClick={() =>
              trackEvent("learn-link-clicked", {
                challengeId,
                category,
                label: CATEGORY_LABELS[category],
              })
            }
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              typography: "caption",
              fontWeight: 500,
              color: "text.secondary",
              ml: 2,
            }}
          >
            <BookOpen size={12} />
            All {CATEGORY_LABELS[category]} patterns
          </Link>
        </Box>
      </Stack>
    </Paper>
  );
}
