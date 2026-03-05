"use client";

import { useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "@mui/material/Link";
import type { GameState } from "@/lib/game/types";
import { CATEGORY_LABELS } from "@/lib/game/categories";
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

  const rank =
    percentage >= 90
      ? "Prop Master"
      : percentage >= 70
        ? "Naming Ninja"
        : percentage >= 50
          ? "Getting There"
          : "Keep Practicing";

  const scoreColor =
    percentage >= 70
      ? "success.main"
      : percentage >= 50
        ? "warning.main"
        : "error.main";

  const wrongChallenges = state.challenges.filter(
    (c) => state.answers[c.id]?.result === "wrong",
  );

  const missedCategories = [...new Set(wrongChallenges.map((c) => c.category))];

  useEffect(() => {
    window.history.replaceState(null, "", "/play/results");
    return () => window.history.replaceState(null, "", "/play");
  }, []);

  return (
    <Stack spacing={4} sx={{ py: 4 }}>
      {/* Summary header */}
      <Paper
        elevation={0}
        sx={{
          border: 1,
          borderColor: "divider",
          p: 3,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          spacing={3}
        >
          {/* Score ring */}
          <Box
            sx={{
              position: "relative",
              display: "inline-flex",
              flexShrink: 0,
            }}
          >
            <CircularProgress
              variant="determinate"
              value={100}
              size={80}
              thickness={3.5}
              sx={{ color: "rgba(0,0,0,0.06)", position: "absolute" }}
            />
            <CircularProgress
              variant="determinate"
              value={percentage}
              size={80}
              thickness={3.5}
              sx={{ color: scoreColor }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h5"
                fontWeight={700}
                fontFamily="var(--font-geist-mono), monospace"
              >
                {percentage}%
              </Typography>
            </Box>
          </Box>

          {/* Rank + stats */}
          <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
            <Typography variant="h5" fontWeight={700}>
              {rank}
            </Typography>
            <Stack
              direction="row"
              spacing={2.5}
              sx={{
                mt: 0.5,
                justifyContent: { xs: "center", sm: "flex-start" },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Check size={14} color="var(--mui-palette-success-main)" />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontFamily="var(--font-geist-mono), monospace"
                >
                  {correct}/{total}
                </Typography>
              </Stack>
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
            </Stack>
          </Box>

          {/* Play Again */}
          <Button
            variant="contained"
            size="large"
            onClick={onRestart}
            startIcon={<RotateCcw size={18} />}
            sx={{ flexShrink: 0 }}
          >
            Play Again
          </Button>
        </Stack>
      </Paper>

      {/* Challenge review */}
      <Box>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ mb: 1.5, color: "text.primary" }}
        >
          Challenge Review
        </Typography>

        <Stack spacing={1}>
          {state.challenges.map((challenge, i) => {
            const answer = state.answers[challenge.id];
            const isCorrect = answer?.result === "correct";

            return (
              <Paper
                key={challenge.id}
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: isCorrect
                    ? "divider"
                    : "rgba(var(--mui-palette-error-mainChannel) / 0.3)",
                  bgcolor: isCorrect
                    ? "background.paper"
                    : "rgba(var(--mui-palette-error-mainChannel) / 0.04)",
                  overflow: "hidden",
                }}
              >
                {/* Row header */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  sx={{ px: 2, py: 1.5 }}
                >
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      bgcolor: isCorrect
                        ? "rgba(var(--mui-palette-success-mainChannel) / 0.12)"
                        : "rgba(var(--mui-palette-error-mainChannel) / 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: isCorrect ? "success.main" : "error.main",
                    }}
                  >
                    {isCorrect ? (
                      <Check size={12} strokeWidth={3} />
                    ) : (
                      <X size={12} strokeWidth={3} />
                    )}
                  </Box>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{
                      flex: 1,
                      color: isCorrect ? "text.primary" : "error.main",
                    }}
                  >
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      fontFamily="var(--font-geist-mono), monospace"
                      sx={{ mr: 1 }}
                    >
                      {i + 1}.
                    </Typography>
                    {challenge.title}
                  </Typography>
                  <Chip
                    label={CATEGORY_LABELS[challenge.category]}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.65rem",
                      bgcolor: "rgba(0,0,0,0.08)",
                      color: "text.primary",
                    }}
                  />
                </Stack>

                {/* Expanded explanation for wrong answers */}
                {!isCorrect && (
                  <Box
                    sx={{
                      px: 2,
                      pb: 2,
                      pt: 0,
                      ml: 4.75,
                    }}
                  >
                    <Box
                      sx={{
                        typography: "body2",
                        lineHeight: 1.6,
                        color: "text.primary",
                        mb: 1,
                      }}
                    >
                      <FormattedText text={challenge.explanationWrong} />
                    </Box>
                    <Link
                      href={challenge.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
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
                  </Box>
                )}
              </Paper>
            );
          })}
        </Stack>
      </Box>

      {/* Encouragement for wrong answers */}
      {wrongChallenges.length > 0 && wrongChallenges.length < total && (
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ textAlign: "center", fontStyle: "italic" }}
        >
          {wrongChallenges.length === 1
            ? "Just 1 to review — you almost nailed it!"
            : `${String(wrongChallenges.length)} to review — play again for a fresh set.`}
        </Typography>
      )}

      {wrongChallenges.length === 0 && (
        <Typography
          variant="body2"
          color="success.main"
          sx={{ textAlign: "center", fontWeight: 500 }}
        >
          Perfect run — every convention nailed. Play again for new challenges!
        </Typography>
      )}

      {/* Learn links */}
      {missedCategories.length > 0 ? (
        <Stack spacing={1} alignItems="center">
          {missedCategories.map((category) => (
            <Link
              key={category}
              href={`/learn/${category}`}
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
              <BookOpen size={16} />
              Review {CATEGORY_LABELS[category]}
            </Link>
          ))}
        </Stack>
      ) : (
        <Link
          href="/learn"
          underline="hover"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            color: "text.secondary",
            fontWeight: 500,
            typography: "body2",
            "&:hover": { color: "text.primary" },
          }}
        >
          <BookOpen size={16} />
          Review all patterns
        </Link>
      )}

      {/* Contribute / Support CTA */}
      <Paper
        elevation={0}
        sx={{
          border: 1,
          borderColor: "divider",
          p: 2.5,
        }}
      >
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
    </Stack>
  );
}
