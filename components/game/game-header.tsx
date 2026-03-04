"use client";

import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import type { Difficulty } from "@/lib/game/types";
import { Flame } from "lucide-react";

type QuestionResult = "correct" | "wrong" | null;

interface GameHeaderProps {
  /** Running score of correct answers. */
  score: number;
  /** Total number of challenges in the session. */
  total: number;
  /** 1-based index of the current question. */
  currentQuestion: number;
  /** Current consecutive-correct streak. */
  streak: number;
  /** Difficulty of the current challenge, or null while loading. */
  difficulty: Difficulty | null;
  /** Per-question results array for the progress indicator. */
  questionResults: QuestionResult[];
  /** Index of the question being reviewed, or null. */
  reviewIndex: number | null;
  /** Called when the user clicks an answered progress dot. */
  onQuestionClick: (index: number) => void;
}

const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; color: string; bgcolor: string }
> = {
  easy: {
    label: "Easy",
    color: "#5B8A72",
    bgcolor: "rgba(91,138,114,0.12)",
  },
  medium: {
    label: "Medium",
    color: "#D4873C",
    bgcolor: "rgba(212,135,60,0.12)",
  },
  hard: { label: "Hard", color: "#C4573A", bgcolor: "rgba(196,87,58,0.12)" },
};

export function GameHeader({
  score,
  total,
  currentQuestion,
  streak,
  difficulty,
  questionResults,
  reviewIndex,
  onQuestionClick,
}: GameHeaderProps) {
  const diffConfig = difficulty ? DIFFICULTY_CONFIG[difficulty] : null;

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        borderRadius: 2.5,
        px: 2.5,
        py: 2,
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={3}>
            <Box>
              <Typography
                variant="overline"
                fontFamily="var(--font-geist-mono), monospace"
                sx={{
                  color: "text.secondary",
                }}
              >
                Score
              </Typography>
              <Typography
                variant="h5"
                fontWeight={700}
                fontFamily="var(--font-geist-mono), monospace"
                sx={{ lineHeight: 1.1 }}
              >
                {score}
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                >
                  /{total}
                </Typography>
              </Typography>
            </Box>

            {streak >= 2 && (
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <Flame size={20} color="#D4873C" />
                <Box>
                  <Typography
                    variant="overline"
                    fontFamily="var(--font-geist-mono), monospace"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Streak
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    fontFamily="var(--font-geist-mono), monospace"
                    sx={{ lineHeight: 1.1, color: "#D4873C" }}
                  >
                    {streak}x
                  </Typography>
                </Box>
              </Stack>
            )}
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1.5}>
            {diffConfig && (
              <Chip
                label={diffConfig.label}
                size="small"
                sx={{
                  color: diffConfig.color,
                  bgcolor: diffConfig.bgcolor,
                  borderColor: diffConfig.color,
                  border: 1,
                  fontWeight: 600,
                }}
              />
            )}
            <Typography
              variant="body2"
              fontWeight={600}
              fontFamily="var(--font-geist-mono), monospace"
              color="text.secondary"
            >
              {currentQuestion}/{total}
            </Typography>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "flex",
            gap: "4px",
            width: "100%",
          }}
        >
          {questionResults.map((result, i) => {
            const isCurrent = i === currentQuestion - 1;
            const isReviewed = i === reviewIndex;
            const isAnswered = result !== null;

            let bgcolor: string;
            let shadow: string | undefined;
            if (result === "correct") {
              bgcolor = "#3D9E6F";
            } else if (result === "wrong") {
              bgcolor = "#D4563A";
            } else if (isCurrent) {
              bgcolor = "var(--mui-palette-primary-main)";
              shadow = "0 0 8px rgba(43,76,126,0.4)";
            } else {
              bgcolor = "#DDD6CA";
            }

            if (isReviewed) {
              shadow = `0 0 0 2px #FFFFFF, 0 0 0 4px ${bgcolor}`;
            }

            const dotSx = {
              flex: 1,
              height: 10,
              borderRadius: 1.5,
              bgcolor,
              boxShadow: shadow,
              opacity: isCurrent && !result ? 0.7 : 1,
              transition: "all 0.3s ease",
              ...(isAnswered && {
                cursor: "pointer",
                "&:hover": {
                  transform: "scaleY(1.6)",
                  filter: "brightness(1.15)",
                },
              }),
            };

            if (isAnswered) {
              return (
                <ButtonBase
                  key={i}
                  onClick={() => onQuestionClick(i)}
                  aria-label={`Review question ${String(i + 1)} (${result})`}
                  sx={dotSx}
                />
              );
            }

            return <Box key={i} sx={dotSx} />;
          })}
        </Box>
      </Stack>
    </Paper>
  );
}
