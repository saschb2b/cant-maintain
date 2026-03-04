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
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import Grow from "@mui/material/Grow";
import { CATEGORY_LABELS } from "@/lib/game/categories";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function Game() {
  const {
    state,
    currentChallenge,
    currentAnswer,
    currentDifficulty,
    totalChallenges,
    isReviewing,
    displayChallenge,
    displayAnswer,
    submitAnswer,
    goToNext,
    restartGame,
    reviewQuestion,
    exitReview,
  } = useGame();

  const { leftCode, rightCode } = useMemo(() => {
    if (!displayChallenge) return { leftCode: "", rightCode: "" };
    const left =
      displayChallenge.correctSide === "left"
        ? displayChallenge.goodCode
        : displayChallenge.badCode;
    const right =
      displayChallenge.correctSide === "left"
        ? displayChallenge.badCode
        : displayChallenge.goodCode;
    return { leftCode: left, rightCode: right };
  }, [displayChallenge]);

  const getResult = (side: "left" | "right"): "correct" | "wrong" | null => {
    if (!displayAnswer || !displayChallenge) return null;
    return side === displayChallenge.correctSide ? "correct" : "wrong";
  };

  const questionResults = useMemo(() => {
    if (!state) return [];
    return state.challenges.map((c) => state.answers[c.id] ?? null);
  }, [state]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!currentChallenge) return;

      // In review mode: Escape / Enter / Space exits review
      if (isReviewing) {
        if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          exitReview();
        }
        return;
      }

      // After answering: Enter/Space advances to next
      if (currentAnswer) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToNext();
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
        submitAnswer("left");
      } else if (
        e.key === "b" ||
        e.key === "B" ||
        e.key === "2" ||
        e.key === "ArrowRight"
      ) {
        submitAnswer("right");
      }
    },
    [
      currentAnswer,
      currentChallenge,
      submitAnswer,
      goToNext,
      isReviewing,
      exitReview,
    ],
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
        <ResultsScreen state={state} onRestart={restartGame} />
      </Box>
    );
  }

  if (!displayChallenge) return null;

  return (
    <Stack spacing={3}>
      <GameHeader
        score={state.score}
        total={totalChallenges}
        currentQuestion={state.currentIndex + 1}
        streak={state.streak}
        difficulty={currentDifficulty}
        questionResults={questionResults}
        reviewIndex={state.reviewIndex}
        onQuestionClick={reviewQuestion}
      />

      {isReviewing && (
        <Fade in timeout={200}>
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1,
              border: 1,
              borderColor: "primary.main",
              bgcolor: "rgba(43,76,126,0.06)",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="body2"
              fontWeight={500}
              color="primary.main"
              fontFamily="var(--font-geist-mono), monospace"
            >
              Reviewing question {(state.reviewIndex ?? 0) + 1}
            </Typography>
            <Button
              size="small"
              variant="text"
              onClick={exitReview}
              startIcon={<ArrowLeft size={14} />}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Back to question {state.currentIndex + 1}
            </Button>
          </Paper>
        </Fade>
      )}

      <Box sx={{ textAlign: "center" }}>
        <Chip
          label={CATEGORY_LABELS[displayChallenge.category]}
          size="small"
          sx={{
            mb: 1,
            bgcolor: "rgba(0,0,0,0.08)",
            color: "text.primary",
            fontSize: "0.7rem",
            height: 22,
            filter: displayAnswer || isReviewing ? "blur(0)" : "blur(6px)",
            opacity: displayAnswer || isReviewing ? 1 : 0.6,
            transition:
              displayAnswer || isReviewing
                ? "filter 0.4s ease, opacity 0.4s ease"
                : "none",
            userSelect: displayAnswer || isReviewing ? "auto" : "none",
          }}
        />
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{
            filter: displayAnswer || isReviewing ? "blur(0)" : "blur(6px)",
            opacity: displayAnswer || isReviewing ? 1 : 0.6,
            transform:
              displayAnswer || isReviewing ? "scale(1)" : "scale(0.97)",
            transition:
              displayAnswer || isReviewing
                ? "filter 0.4s ease, opacity 0.4s ease, transform 0.3s ease"
                : "none",
            userSelect: displayAnswer || isReviewing ? "auto" : "none",
          }}
        >
          {displayChallenge.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isReviewing
            ? "Reviewing your previous answer"
            : "Pick the code with better prop naming"}
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
          isSelectable={!isReviewing && !currentAnswer}
          onSelect={() => submitAnswer("left")}
          result={getResult("left")}
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
              letterSpacing: "0.1em",
            }}
          >
            VS
          </Typography>
        </Box>

        <CodePanel
          code={rightCode}
          label="B"
          isSelectable={!isReviewing && !currentAnswer}
          onSelect={() => submitAnswer("right")}
          result={getResult("right")}
        />
      </Box>

      <Stack spacing={2}>
        <Grow
          in={!!displayAnswer}
          timeout={400}
          style={{ transformOrigin: "top center" }}
        >
          <Box>
            <ExplanationPanel
              isCorrect={displayAnswer === "correct"}
              text={
                displayAnswer === "correct"
                  ? displayChallenge.explanationCorrect
                  : displayChallenge.explanationWrong
              }
              sourceUrl={displayChallenge.sourceUrl}
              sourceLabel={displayChallenge.sourceLabel}
              category={displayChallenge.category}
            />
          </Box>
        </Grow>

        <Fade
          in={!!displayAnswer}
          timeout={400}
          style={{ transitionDelay: displayAnswer ? "200ms" : "0ms" }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {isReviewing ? (
              <Button
                variant="outlined"
                size="large"
                onClick={exitReview}
                startIcon={<ArrowLeft size={18} />}
              >
                Back to Question {state.currentIndex + 1}
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                onClick={goToNext}
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
            )}
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
        }}
      >
        {isReviewing
          ? "Press Escape to return"
          : currentAnswer
            ? "Press Enter to continue"
            : "A / \u2190 for left \u00B7 B / \u2192 for right"}
      </Typography>
    </Stack>
  );
}
