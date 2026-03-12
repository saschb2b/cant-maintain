"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import type { GameState } from "@/lib/game/types";
import { CATEGORY_LABELS } from "@/lib/game/categories";
import { trackEvent } from "@/lib/analytics";
import {
  getRank,
  getShareUrl,
  getMissedCategoryLabels,
  encodeResults,
} from "@/lib/game/share";
import { FormattedText } from "@/components/formatted-text";
import {
  RotateCcw,
  Check,
  X,
  Zap,
  Clock,
  ExternalLink,
  BookOpen,
  Coffee,
  GitPullRequestArrow,
  Share2,
  ClipboardCheck,
  Hash,
  Copy,
} from "lucide-react";

interface ResultsScreenProps {
  /** Complete game state with all challenges and answers. */
  state: GameState;
  /** Called when the user clicks "Play Again" to start a fresh game. */
  onRestart: () => void;
}

export function ResultsScreen({ state, onRestart }: ResultsScreenProps) {
  const total = state.challenges.length;
  const correct = Object.values(state.answers).filter(
    (a) => a.result === "correct",
  ).length;
  const percentage = Math.round((correct / total) * 100);
  const elapsed = Math.round(
    ((state.finishedAt ?? state.startedAt) - state.startedAt) / 1000,
  );
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  const rank = getRank(percentage);

  const scoreColor =
    percentage >= 70
      ? "success.main"
      : percentage >= 50
        ? "warning.main"
        : "error.main";

  const wrongChallenges = state.challenges.filter(
    (c) => state.answers[c.id]?.result === "wrong",
  );

  const correctChallenges = state.challenges.filter(
    (c) => state.answers[c.id]?.result === "correct",
  );

  const [hasCopied, setHasCopied] = useState(false);
  const [seedCopied, setSeedCopied] = useState(false);

  const buildShareText = useCallback(() => {
    const dots = state.challenges
      .map((c) =>
        state.answers[c.id]?.result === "correct" ? "\u{1F7E2}" : "\u{1F534}",
      )
      .join("");
    const shareUrl = getShareUrl(state);
    const missedLabels = getMissedCategoryLabels(state);

    const lines: string[] = [];

    if (correct === total) {
      lines.push(
        `Perfect ${String(correct)}/${String(total)} on spotting better React component APIs!`,
      );
      lines.push("");
      lines.push(dots);
      lines.push("");
      lines.push(`Seed: ${state.seed}`);
      lines.push("Can you match a perfect score?");
    } else {
      lines.push(
        `I scored ${String(correct)}/${String(total)} on spotting better React component APIs.`,
      );
      lines.push("");
      lines.push(dots);
      lines.push("");
      lines.push(`Seed: ${state.seed}`);
      lines.push(`Tripped up on ${missedLabels.join(" and ")}.`);
      lines.push("Can you beat my score?");
    }

    lines.push("");
    lines.push(shareUrl);

    return lines.join("\n");
  }, [state, correct, total]);

  const handleShare = useCallback(() => {
    trackEvent("game-shared", { score: correct, total });
    const text = buildShareText();

    if (typeof navigator.share === "function") {
      void navigator.share({ text }).catch(() => {
        void navigator.clipboard.writeText(text).then(() => {
          setHasCopied(true);
          setTimeout(() => setHasCopied(false), 2000);
        });
      });
      return;
    }

    void navigator.clipboard.writeText(text).then(() => {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    });
  }, [buildShareText, correct, total]);

  const resultsParam = useMemo(() => encodeResults(state), [state]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    window.history.replaceState(null, "", `/play/results?r=${resultsParam}&seed=${state.seed}`);
    return () => window.history.replaceState(null, "", "/play");
  }, [resultsParam]);

  return (
    <Stack spacing={4} sx={{ py: 4 }}>
      {/* Hero */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Paper
          elevation={0}
          sx={{
            border: 1,
            borderColor: "divider",
            py: 4,
            px: 3,
            textAlign: "center",
            maxWidth: { md: 600 },
            width: "100%",
          }}
        >
          <Typography
            variant="h2"
            fontWeight={700}
            fontFamily="var(--font-geist-mono), monospace"
            sx={{ color: scoreColor, lineHeight: 1 }}
          >
            {correct}/{total}
          </Typography>

          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ mt: 1, color: "text.primary" }}
          >
            {rank}
          </Typography>

          {/* Dot row */}
          <Stack
            direction="row"
            spacing={0.75}
            justifyContent="center"
            sx={{ mt: 2 }}
          >
            {state.challenges.map((c) => {
              const isCorrect = state.answers[c.id]?.result === "correct";
              return (
                <Box
                  key={c.id}
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: isCorrect ? "success.main" : "error.main",
                    opacity: 0.8,
                  }}
                />
              );
            })}
          </Stack>

          {/* Stats */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
            sx={{ mt: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Zap size={14} color="var(--mui-palette-warning-main)" />
              <Typography
                variant="body2"
                color="text.secondary"
                fontFamily="var(--font-geist-mono), monospace"
              >
                {state.bestStreak}x streak
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Clock size={14} color="var(--mui-palette-text-secondary)" />
              <Typography
                variant="body2"
                color="text.secondary"
                fontFamily="var(--font-geist-mono), monospace"
              >
                {minutes}:{seconds.toString().padStart(2, "0")}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              onClick={() => {
                void navigator.clipboard.writeText(state.seed);
                setSeedCopied(true);
                setTimeout(() => setSeedCopied(false), 2000);
              }}
              sx={{
                cursor: "pointer",
                borderRadius: 1,
                px: 0.5,
                "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
              }}
            >
              <Hash size={14} color="var(--mui-palette-text-secondary)" />
              <Typography
                variant="body2"
                color="text.secondary"
                fontFamily="var(--font-geist-mono), monospace"
              >
                {state.seed}
              </Typography>
              {seedCopied ? (
                <ClipboardCheck
                  size={12}
                  color="var(--mui-palette-success-main)"
                />
              ) : (
                <Copy size={12} color="var(--mui-palette-text-secondary)" />
              )}
            </Stack>
          </Stack>

          {/* Actions */}
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <Button
              variant="outlined"
              size="large"
              onClick={handleShare}
              startIcon={
                hasCopied ? <ClipboardCheck size={18} /> : <Share2 size={18} />
              }
            >
              {hasCopied ? "Copied!" : "Share"}
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={onRestart}
              startIcon={<RotateCcw size={18} />}
            >
              Play Again
            </Button>
          </Stack>
        </Paper>
      </Box>

      {/* Review: two-column bento on desktop, stacked on mobile */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* You missed */}
        {wrongChallenges.length > 0 && (
          <Box
            sx={{
              gridColumn: correctChallenges.length > 0 ? undefined : "1 / -1",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 1.5 }}
            >
              <X size={16} color="var(--mui-palette-error-main)" />
              <Typography variant="body2" fontWeight={600} color="text.primary">
                You missed ({String(wrongChallenges.length)})
              </Typography>
            </Stack>

            <Stack spacing={1.5}>
              {wrongChallenges.map((challenge) => (
                <Paper
                  key={challenge.id}
                  elevation={0}
                  sx={{
                    border: 1,
                    borderColor:
                      "rgba(var(--mui-palette-error-mainChannel) / 0.3)",
                    bgcolor:
                      "rgba(var(--mui-palette-error-mainChannel) / 0.04)",
                    overflow: "hidden",
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{ px: 2, pt: 2, pb: 0.5 }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="error.main"
                      sx={{ flex: 1 }}
                    >
                      {challenge.title}
                    </Typography>
                    <Chip
                      label={CATEGORY_LABELS[challenge.category]}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.65rem",
                        bgcolor:
                          "rgba(var(--mui-palette-error-mainChannel) / 0.1)",
                        color: "error.main",
                      }}
                    />
                  </Stack>

                  <Box sx={{ px: 2, pb: 2, pt: 1 }}>
                    <Box
                      sx={{
                        typography: "body2",
                        lineHeight: 1.7,
                        color: "text.primary",
                        mb: 1.5,
                      }}
                    >
                      <FormattedText text={challenge.explanationWrong} />
                    </Box>
                    <Stack direction="row" spacing={2}>
                      <Link
                        href={challenge.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        onClick={() =>
                          trackEvent("source-link-clicked", {
                            challengeId: challenge.id,
                            category: challenge.category,
                            label: challenge.sourceLabel,
                          })
                        }
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.5,
                          typography: "caption",
                          fontWeight: 500,
                          color: "primary.main",
                        }}
                      >
                        <ExternalLink size={12} />
                        {challenge.sourceLabel}
                      </Link>
                      <Link
                        href={`/learn/${challenge.category}`}
                        underline="hover"
                        onClick={() =>
                          trackEvent("learn-link-clicked", {
                            challengeId: challenge.id,
                            category: challenge.category,
                            label: CATEGORY_LABELS[challenge.category],
                          })
                        }
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.5,
                          typography: "caption",
                          fontWeight: 500,
                          color: "text.secondary",
                        }}
                      >
                        <BookOpen size={12} />
                        Review {CATEGORY_LABELS[challenge.category]}
                      </Link>
                    </Stack>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}

        {/* You nailed + CTA stacked in right column */}
        {correctChallenges.length > 0 && (
          <Stack
            spacing={3}
            sx={{
              gridColumn: wrongChallenges.length > 0 ? undefined : "1 / -1",
              position: { md: "sticky" },
              top: { md: 24 },
            }}
          >
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 1.5 }}
              >
                <Check size={16} color="var(--mui-palette-success-main)" />
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.primary"
                >
                  You nailed ({String(correctChallenges.length)})
                </Typography>
              </Stack>

              <Paper
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  overflow: "hidden",
                }}
              >
                {correctChallenges.map((challenge, i) => (
                  <Stack
                    key={challenge.id}
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{
                      px: 2,
                      py: 1.25,
                      borderTop: i > 0 ? 1 : 0,
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        bgcolor:
                          "rgba(var(--mui-palette-success-mainChannel) / 0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: "success.main",
                      }}
                    >
                      <Check size={10} strokeWidth={3} />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{ flex: 1 }}
                    >
                      {challenge.title}
                    </Typography>
                    <Chip
                      label={CATEGORY_LABELS[challenge.category]}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.65rem",
                        bgcolor: "rgba(0,0,0,0.06)",
                        color: "text.secondary",
                      }}
                    />
                  </Stack>
                ))}
              </Paper>
            </Box>

            {/* Contribute / Support CTA */}
            <Paper
              elevation={0}
              sx={{ border: 1, borderColor: "divider", p: 2.5 }}
            >
              <Stack spacing={2} alignItems="center">
                <Link
                  href="https://github.com/saschb2b/cant-maintain"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "text.secondary",
                    fontWeight: 500,
                    typography: "body2",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  <GitPullRequestArrow size={16} />
                  Contribute challenges or fixes
                </Link>
                <Link
                  href="https://buymeacoffee.com/qohreuukw"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "text.secondary",
                    fontWeight: 500,
                    typography: "body2",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  <Coffee size={16} />
                  Buy me a coffee
                </Link>
              </Stack>
            </Paper>
          </Stack>
        )}
      </Box>

      {/* CTA fallback when no correct answers */}
      {correctChallenges.length === 0 && (
        <Paper elevation={0} sx={{ border: 1, borderColor: "divider", p: 2.5 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            justifyContent="center"
            spacing={{ xs: 2, sm: 4 }}
          >
            <Link
              href="https://github.com/saschb2b/cant-maintain"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "text.secondary",
                fontWeight: 500,
                typography: "body2",
                "&:hover": { color: "text.primary" },
              }}
            >
              <GitPullRequestArrow size={16} />
              Contribute challenges or fixes
            </Link>
            <Link
              href="https://buymeacoffee.com/qohreuukw"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "text.secondary",
                fontWeight: 500,
                typography: "body2",
                "&:hover": { color: "text.primary" },
              }}
            >
              <Coffee size={16} />
              Buy me a coffee
            </Link>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}
