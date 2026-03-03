"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useGame } from "@/lib/game/use-game";
import { CodePanel } from "./code-panel";
import { ExplanationPanel } from "./explanation-panel";
import { GameHeader } from "./game-header";
import { ResultsScreen } from "./results-screen";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import Grow from "@mui/material/Grow";
import type { ChallengeCategory } from "@/lib/game/types";
import { ArrowRight } from "lucide-react";

const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  "callback-naming": "Callback Naming",
  "boolean-naming": "Boolean Props",
  jsdoc: "JSDoc",
  "prop-specificity": "Prop Specificity",
  "render-props": "Render Props",
  "children-pattern": "Children Pattern",
  "discriminated-unions": "Discriminated Unions",
  "extending-html": "Extending HTML",
  "default-values": "Default Values",
  "prop-organization": "Prop Organization",
};

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

  const { leftCode, rightCode, editorHeight } = useMemo(() => {
    if (!currentChallenge)
      return { leftCode: "", rightCode: "", editorHeight: 120 };
    const left =
      currentChallenge.correctSide === "left"
        ? currentChallenge.goodCode
        : currentChallenge.badCode;
    const right =
      currentChallenge.correctSide === "left"
        ? currentChallenge.badCode
        : currentChallenge.goodCode;
    const maxLines = Math.max(
      left.split("\n").length,
      right.split("\n").length,
    );
    const lineHeight = 20;
    const padding = 32;
    const height = Math.max(maxLines * lineHeight + padding, 120);
    return { leftCode: left, rightCode: right, editorHeight: height };
  }, [currentChallenge]);

  const getResult = (side: "left" | "right"): "correct" | "wrong" | null => {
    if (!currentAnswer || !currentChallenge) return null;
    return side === currentChallenge.correctSide ? "correct" : "wrong";
  };

  const questionResults = useMemo(() => {
    if (!state) return [];
    return state.challenges.map((c) => state.answers[c.id] ?? null);
  }, [state]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!currentChallenge) return;

      // After answering: Enter/Space advances to next
      if (currentAnswer) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          next();
        }
        return;
      }

      // Before answering: A/B/1/2/ArrowLeft/ArrowRight to pick
      if (
        e.key === "a" ||
        e.key === "A" ||
        e.key === "1" ||
        e.key === "ArrowLeft"
      ) {
        answer("left");
      } else if (
        e.key === "b" ||
        e.key === "B" ||
        e.key === "2" ||
        e.key === "ArrowRight"
      ) {
        answer("right");
      }
    },
    [currentAnswer, currentChallenge, answer, next],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

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
        questionResults={questionResults}
      />

      <Box sx={{ textAlign: "center" }}>
        <Chip
          label={CATEGORY_LABELS[currentChallenge.category]}
          size="small"
          sx={{
            mb: 1,
            bgcolor: "rgba(0,0,0,0.08)",
            color: "text.primary",
            fontSize: "0.7rem",
            height: 22,
          }}
        />
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
          gridTemplateColumns: { xs: "1fr", md: "1fr auto 1fr" },
          gap: { xs: 2, md: 0 },
          alignItems: "stretch",
        }}
      >
        <CodePanel
          code={leftCode}
          label="A"
          isSelectable={!currentAnswer}
          onSelect={() => answer("left")}
          result={getResult("left")}
          fixedHeight={editorHeight}
        />

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            px: 1.5,
          }}
        >
          <Typography
            variant="caption"
            fontWeight={700}
            fontFamily="var(--font-geist-mono), monospace"
            sx={{
              color: "text.primary",
              bgcolor: "rgba(0,0,0,0.07)",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
            }}
          >
            VS
          </Typography>
        </Box>

        <CodePanel
          code={rightCode}
          label="B"
          isSelectable={!currentAnswer}
          onSelect={() => answer("right")}
          result={getResult("right")}
          fixedHeight={editorHeight}
        />
      </Box>

      <Stack spacing={2}>
        <Grow
          in={!!currentAnswer}
          timeout={400}
          style={{ transformOrigin: "top center" }}
        >
          <Box>
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
          </Box>
        </Grow>

        <Fade
          in={!!currentAnswer}
          timeout={400}
          style={{ transitionDelay: currentAnswer ? "200ms" : "0ms" }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              size="large"
              onClick={next}
              tabIndex={currentAnswer ? 0 : -1}
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
        </Fade>
      </Stack>

      <Typography
        variant="caption"
        color="text.secondary"
        fontFamily="var(--font-geist-mono), monospace"
        sx={{
          textAlign: "center",
          opacity: 0.9,
          transition: "opacity 0.2s",
          fontSize: "0.7rem",
        }}
      >
        {currentAnswer ? "Press Enter to continue" : "A / ← for left · B / → for right"}
      </Typography>
    </Stack>
  );
}
