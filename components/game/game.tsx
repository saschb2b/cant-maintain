"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Challenge, ChallengeCategory } from "@/lib/game/types";
import type { GameType } from "./lobby-screen";
import { useGame } from "@/lib/game/use-game";
import { generateSeed } from "@/lib/game/seeded-random";
import { CodePanel } from "./code-panel";
import { ExplanationPanel } from "./explanation-panel";
import { GameHeader } from "./game-header";
import { ResultsScreen } from "./results-screen";
import { LobbyScreen } from "./lobby-screen";
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

interface GameProps {
  challenges: Challenge[];
  highlightMap: Record<string, { goodHtml: string; badHtml: string }>;
  defaultSeed?: string;
}

export function Game({ challenges, highlightMap, defaultSeed }: GameProps) {
  const [activeSeed, setActiveSeed] = useState<string | null>(null);
  const [lobbySeed, setLobbySeed] = useState(defaultSeed);
  const [excludedCategories, setExcludedCategories] = useState<
    Set<ChallengeCategory>
  >(new Set());
  const [retryKey, setRetryKey] = useState(0);
  const [gameType, setGameType] = useState<GameType>("custom");

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
  } = useGame(challenges, activeSeed, excludedCategories, retryKey, gameType);

  const handleLobbyStart = useCallback(
    (seed: string, excluded: Set<ChallengeCategory>, type: GameType) => {
      setExcludedCategories(excluded);
      setGameType(type);
      setActiveSeed(seed || generateSeed());
    },
    [],
  );

  /** Replay the exact same game (same seed + categories, skip lobby). */
  const handleRetry = useCallback(() => {
    restartGame();
    setRetryKey((k) => k + 1);
  }, [restartGame]);

  /** New game — go to lobby with categories preserved but no seed. */
  const handleNewGame = useCallback(() => {
    restartGame();
    setActiveSeed(null);
    setLobbySeed(undefined);
  }, [restartGame]);

  const explanationRef = useRef<HTMLDivElement>(null);

  const { leftHtml, rightHtml } = useMemo(() => {
    if (!displayChallenge) return { leftHtml: "", rightHtml: "" };
    const highlight = highlightMap[displayChallenge.id];
    if (!highlight) return { leftHtml: "", rightHtml: "" };
    const leftHtml =
      displayChallenge.correctSide === "left"
        ? highlight.goodHtml
        : highlight.badHtml;
    const rightHtml =
      displayChallenge.correctSide === "left"
        ? highlight.badHtml
        : highlight.goodHtml;
    return { leftHtml, rightHtml };
  }, [displayChallenge, highlightMap]);

  const getResult = (side: "left" | "right"): "correct" | "wrong" | null => {
    if (!displayAnswer || !displayChallenge) return null;
    return side === displayChallenge.correctSide ? "correct" : "wrong";
  };

  const isSelectedSide = (side: "left" | "right"): boolean => {
    if (!displayAnswer) return false;
    return displayAnswer.side === side;
  };

  const questionResults = useMemo(() => {
    if (!state) return [];
    return state.challenges.map((c) => {
      const answer = state.answers[c.id];
      return answer ? answer.result : null;
    });
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

  useEffect(() => {
    if (!displayAnswer || isReviewing) return;
    const t = setTimeout(() => {
      explanationRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);
    return () => clearTimeout(t);
  }, [displayAnswer, isReviewing]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [state?.currentIndex]);

  if (!activeSeed) {
    return (
      <LobbyScreen
        challenges={challenges}
        onStart={handleLobbyStart}
        defaultSeed={lobbySeed}
        defaultExcluded={excludedCategories}
      />
    );
  }

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
      <ResultsScreen
        state={state}
        onRetry={handleRetry}
        onNewGame={handleNewGame}
      />
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
              bgcolor: "rgba(var(--mui-palette-primary-mainChannel) / 0.06)",
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
            bgcolor: "action.selected",
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
            : "Pick the better component API"}
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
          highlightedHtml={leftHtml}
          label="A"
          isSelectable={!isReviewing && !currentAnswer}
          onSelect={() => submitAnswer("left")}
          result={getResult("left")}
          isSelected={isSelectedSide("left")}
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
              bgcolor: "action.selected",
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
          highlightedHtml={rightHtml}
          label="B"
          isSelectable={!isReviewing && !currentAnswer}
          onSelect={() => submitAnswer("right")}
          result={getResult("right")}
          isSelected={isSelectedSide("right")}
        />
      </Box>

      <Stack spacing={2}>
        {displayAnswer && (
          <Grow in timeout={400} style={{ transformOrigin: "top center" }}>
            <Box ref={explanationRef}>
              <ExplanationPanel
                isCorrect={displayAnswer.result === "correct"}
                explanationText={
                  displayAnswer.result === "correct"
                    ? displayChallenge.explanationCorrect
                    : displayChallenge.explanationWrong
                }
                sourceUrl={displayChallenge.sourceUrl}
                sourceLabel={displayChallenge.sourceLabel}
                category={displayChallenge.category}
                challengeId={displayChallenge.id}
              />
            </Box>
          </Grow>
        )}

        {displayAnswer && (
          <Fade in timeout={400} style={{ transitionDelay: "200ms" }}>
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
        )}
      </Stack>

      <Typography
        variant="caption"
        color="text.secondary"
        fontFamily="var(--font-geist-mono), monospace"
        sx={{
          textAlign: "center",
          opacity: 0.9,
          transition: "opacity 0.2s",
          display: { xs: "none", md: "block" },
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
