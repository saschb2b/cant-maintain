"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import type { GameState } from "@/lib/game/types";
import { RotateCcw, Trophy, Target, Zap } from "lucide-react";

interface ResultsScreenProps {
  state: GameState;
  onRestart: () => void;
}

export function ResultsScreen({ state, onRestart }: ResultsScreenProps) {
  const total = state.challenges.length;
  const correct = Object.values(state.answers).filter(
    (a) => a === "correct"
  ).length;
  const percentage = Math.round((correct / total) * 100);
  const elapsed = Math.round((Date.now() - state.startedAt) / 1000);
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

      <Stack
        direction="row"
        spacing={3}
        sx={{ width: "100%", maxWidth: 450 }}
      >
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
            p: 2,
            bgcolor: "secondary.main",
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
            p: 2,
            bgcolor: "secondary.main",
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
            p: 2,
            bgcolor: "secondary.main",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Time
          </Typography>
        </Paper>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 450,
          p: 2,
          bgcolor: "secondary.main",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          fontWeight={700}
          fontFamily="var(--font-geist-mono), monospace"
        >
          {percentage}%
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Final Score
        </Typography>
      </Paper>

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
