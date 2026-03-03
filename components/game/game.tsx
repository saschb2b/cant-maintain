"use client";

import { useMemo } from "react";
import { useGame } from "@/lib/game/use-game";
import { CodePanel } from "./code-panel";
import { ExplanationPanel } from "./explanation-panel";
import { GameHeader } from "./game-header";
import { ResultsScreen } from "./results-screen";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ArrowRight } from "lucide-react";

export function Game() {
  const {
    state,
    currentChallenge,
    currentAnswer,
    currentDifficulty,
    totalChallenges,
    answer,
    next,
    restart,
  } = useGame();

  const { leftCode, rightCode } = useMemo(() => {
    if (!currentChallenge) return { leftCode: "", rightCode: "" };
    return currentChallenge.correctSide === "left"
      ? { leftCode: currentChallenge.goodCode, rightCode: currentChallenge.badCode }
      : { leftCode: currentChallenge.badCode, rightCode: currentChallenge.goodCode };
  }, [currentChallenge]);

  const getResult = (side: "left" | "right"): "correct" | "wrong" | null => {
    if (!currentAnswer || !currentChallenge) return null;
    return side === currentChallenge.correctSide ? "correct" : "wrong";
  };

  if (!state) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 12,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Loading challenges...
        </Typography>
      </Box>
    );
  }

  if (state.isFinished) {
    return (
      <Box sx={{ maxWidth: 700, mx: "auto" }}>
        <ResultsScreen state={state} onRestart={restart} />
      </Box>
    );
  }

  if (!currentChallenge) return null;

  return (
    <Stack spacing={3}>
      <GameHeader
        score={state.score}
        total={totalChallenges}
        currentQuestion={state.currentIndex + 1}
        streak={state.streak}
        difficulty={currentDifficulty}
      />

      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h6" fontWeight={600}>
          {currentChallenge.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Pick the code with better prop naming
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
        }}
      >
        <CodePanel
          code={leftCode}
          label="A"
          isSelectable={!currentAnswer}
          onSelect={() => answer("left")}
          result={getResult("left")}
        />
        <CodePanel
          code={rightCode}
          label="B"
          isSelectable={!currentAnswer}
          onSelect={() => answer("right")}
          result={getResult("right")}
        />
      </Box>

      {currentAnswer && (
        <Stack spacing={2}>
          <ExplanationPanel
            isCorrect={currentAnswer === "correct"}
            text={
              currentAnswer === "correct"
                ? currentChallenge.explanationCorrect
                : currentChallenge.explanationWrong
            }
            sourceUrl={currentChallenge.sourceUrl}
            sourceLabel={currentChallenge.sourceLabel}
          />

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              size="large"
              onClick={next}
              endIcon={
                state.currentIndex + 1 < totalChallenges ? (
                  <ArrowRight size={18} />
                ) : undefined
              }
            >
              {state.currentIndex + 1 < totalChallenges
                ? "Next Challenge"
                : "See Results"}
            </Button>
          </Box>
        </Stack>
      )}
    </Stack>
  );
}
