"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import type { Difficulty } from "@/lib/game/types";

type QuestionResult = "correct" | "wrong" | null;

interface GameHeaderProps {
  score: number;
  total: number;
  currentQuestion: number;
  streak: number;
  difficulty: Difficulty | null;
  questionResults: QuestionResult[];
}

const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; color: string; bgcolor: string }
> = {
  easy: {
    label: "Easy",
    color: "success.main",
    bgcolor: "rgba(43,217,123,0.15)",
  },
  medium: {
    label: "Medium",
    color: "warning.main",
    bgcolor: "rgba(212,145,61,0.15)",
  },
  hard: { label: "Hard", color: "error.main", bgcolor: "rgba(224,64,64,0.15)" },
};

export function GameHeader({
  score,
  total,
  currentQuestion,
  streak,
  difficulty,
  questionResults,
}: GameHeaderProps) {
  const diffConfig = difficulty ? DIFFICULTY_CONFIG[difficulty] : null;

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontFamily="var(--font-geist-mono), monospace"
              sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
            >
              Score
            </Typography>
            <Typography
              variant="h5"
              fontWeight={700}
              fontFamily="var(--font-geist-mono), monospace"
            >
              {score}
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                /{total}
              </Typography>
            </Typography>
          </Box>

          {streak >= 2 && (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontFamily="var(--font-geist-mono), monospace"
                sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
              >
                Streak
              </Typography>
              <Typography
                variant="h5"
                fontWeight={700}
                fontFamily="var(--font-geist-mono), monospace"
                color="warning.main"
              >
                {streak}x
              </Typography>
            </Box>
          )}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1.5}>
          {diffConfig && (
            <Chip
              label={diffConfig.label}
              size="small"
              variant="outlined"
              sx={{
                color: diffConfig.color,
                bgcolor: diffConfig.bgcolor,
                borderColor: diffConfig.color,
              }}
            />
          )}
          <Typography
            variant="body2"
            color="text.secondary"
            fontFamily="var(--font-geist-mono), monospace"
          >
            {currentQuestion}/{total}
          </Typography>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: "flex",
          gap: "3px",
          width: "100%",
        }}
      >
        {questionResults.map((result, i) => {
          const isCurrent = i === currentQuestion - 1;
          let bgcolor: string;
          if (result === "correct") {
            bgcolor = "var(--mui-palette-success-main)";
          } else if (result === "wrong") {
            bgcolor = "var(--mui-palette-error-main)";
          } else if (isCurrent) {
            bgcolor = "var(--mui-palette-primary-main)";
          } else {
            bgcolor = "rgba(255,255,255,0.08)";
          }

          return (
            <Box
              key={i}
              sx={{
                flex: 1,
                height: 6,
                borderRadius: 1,
                bgcolor,
                opacity: isCurrent && !result ? 0.6 : 1,
                transition: "background-color 0.3s, opacity 0.3s",
              }}
            />
          );
        })}
      </Box>
    </Stack>
  );
}
