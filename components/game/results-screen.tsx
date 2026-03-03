"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import type { GameState } from "@/lib/game/types";
import { RotateCcw, Trophy, Target, Zap, Clock } from "lucide-react";

interface ResultsScreenProps {
  state: GameState;
  onRestart: () => void;
}

export function ResultsScreen({ state, onRestart }: ResultsScreenProps) {
  const total = state.challenges.length;
  const correct = Object.values(state.answers).filter(
    (a) => a === "correct",
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

  return (
    <Stack alignItems="center" spacing={4} sx={{ py: 6 }}>
      <Box sx={{ textAlign: "center" }}>
        <Trophy size={64} color="var(--mui-palette-warning-main)" />
        <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
          {rank}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Challenge your colleagues to beat your score!
        </Typography>
      </Box>

      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={160}
          thickness={3}
          sx={{ color: "rgba(255,255,255,0.06)", position: "absolute" }}
        />
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={160}
          thickness={3}
          sx={{
            color:
              percentage >= 70
                ? "success.main"
                : percentage >= 50
                  ? "warning.main"
                  : "error.main",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h3"
            fontWeight={700}
            fontFamily="var(--font-geist-mono), monospace"
          >
            {percentage}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Final Score
          </Typography>
        </Box>
      </Box>

      <Stack direction="row" spacing={2} sx={{ width: "100%", maxWidth: 450 }}>
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
            p: 2.5,
            bgcolor: "secondary.main",
            border: 1,
            borderColor: "divider",
          }}
        >
          <Target size={20} color="var(--mui-palette-success-main)" />
          <Typography
            variant="h5"
            fontWeight={700}
            fontFamily="var(--font-geist-mono), monospace"
          >
            {correct}/{total}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Correct
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
            p: 2.5,
            bgcolor: "secondary.main",
            border: 1,
            borderColor: "divider",
          }}
        >
          <Zap size={20} color="var(--mui-palette-warning-main)" />
          <Typography
            variant="h5"
            fontWeight={700}
            fontFamily="var(--font-geist-mono), monospace"
          >
            {state.bestStreak}x
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Best Streak
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
            p: 2.5,
            bgcolor: "secondary.main",
            border: 1,
            borderColor: "divider",
          }}
        >
          <Clock size={20} color="var(--mui-palette-text-secondary)" />
          <Typography
            variant="h5"
            fontWeight={700}
            fontFamily="var(--font-geist-mono), monospace"
          >
            {minutes}:{seconds.toString().padStart(2, "0")}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Time
          </Typography>
        </Paper>
      </Stack>

      <Button
        variant="contained"
        size="large"
        onClick={onRestart}
        startIcon={<RotateCcw size={18} />}
      >
        Play Again
      </Button>
    </Stack>
  );
}
