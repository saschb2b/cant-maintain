"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "../analytics";
import type {
  Challenge,
  ChallengeCategory,
  Difficulty,
  GameState,
} from "./types";
import { createRng, encodeSeed, hashSeed } from "./seeded-random";
import { recordGame } from "./history";
import { recordActivity } from "./activity";
import { submitGameResult } from "./actions";

/** Fisher-Yates shuffle (immutable) using a provided RNG. */
function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    // Indices i and j are guaranteed to be in bounds by the loop and Math.floor
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const temp = a[i]!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    a[i] = a[j]!;
    a[j] = temp;
  }
  return a;
}

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
};

/** How many challenges per difficulty tier in a single session. */
const SESSION_PICKS: Record<Difficulty, number> = {
  easy: 3,
  medium: 4,
  hard: 3,
};

/**
 * Prepares a session of 10 challenges: shuffles within each difficulty tier,
 * picks a fixed number per tier, then concatenates easy -> medium -> hard
 * for progressive difficulty. Also randomizes which side the "good" code
 * appears on.
 */
function prepareChallenges(
  allChallenges: Challenge[],
  rng: () => number,
  excludedCategories: Set<ChallengeCategory>,
): Challenge[] {
  const pool =
    excludedCategories.size === 0
      ? allChallenges
      : allChallenges.filter((c) => !excludedCategories.has(c.category));
  const byDifficulty = pool.reduce<Record<Difficulty, Challenge[]>>(
    (acc, c) => {
      acc[c.difficulty].push(c);
      return acc;
    },
    { easy: [], medium: [], hard: [] },
  );

  return (Object.entries(byDifficulty) as [Difficulty, Challenge[]][])
    .sort(([a], [b]) => DIFFICULTY_ORDER[a] - DIFFICULTY_ORDER[b])
    .flatMap(([, cs]) =>
      shuffle(cs, rng)
        .slice(0, SESSION_PICKS[cs[0]?.difficulty ?? "medium"])
        .map((c) => ({
          ...c,
          correctSide: (rng() > 0.5 ? "left" : "right") satisfies
            | "left"
            | "right",
        })),
    );
}

function createInitialState(
  allChallenges: Challenge[],
  rawSeed: string,
  excludedCategories: Set<ChallengeCategory>,
  gameType: "daily" | "weekly" | "custom",
): GameState {
  const rng = createRng(hashSeed(rawSeed));
  return {
    challenges: prepareChallenges(allChallenges, rng, excludedCategories),
    currentIndex: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    answers: {},
    reviewIndex: null,
    isFinished: false,
    startedAt: Date.now(),
    finishedAt: null,
    seed: encodeSeed(rawSeed, excludedCategories),
    gameType,
  };
}

/** Core game state hook. Handles scoring, progression, and answers. */
export function useGame(
  challengePool: Challenge[],
  seed: string | null,
  excludedCategories = new Set<ChallengeCategory>(),
  retryKey = 0,
  gameType: "daily" | "weekly" | "custom" = "custom",
) {
  const [state, setState] = useState<GameState | null>(null);
  const challengeShownAt = useRef(0);

  // Initialize game when a seed is provided (deferred to client for hydration safety)
  // retryKey forces re-initialization for same-seed retries
  const didFireFinish = useRef(false);
  useEffect(() => {
    didFireFinish.current = false;
    if (seed)
      setState(
        createInitialState(challengePool, seed, excludedCategories, gameType),
      );
    else setState(null);
  }, [challengePool, seed, excludedCategories, retryKey, gameType]);

  // Reset timer whenever the current challenge changes
  useEffect(() => {
    challengeShownAt.current = Date.now();
  }, [state?.currentIndex]);

  const currentChallenge = useMemo(
    () => state?.challenges[state.currentIndex] ?? null,
    [state],
  );

  const totalChallenges = state?.challenges.length ?? 0;

  const currentDifficulty: Difficulty | null =
    currentChallenge?.difficulty ?? null;

  /** The user's answer for the current challenge, if any. */
  const currentAnswer =
    currentChallenge && state
      ? (state.answers[currentChallenge.id] ?? null)
      : null;

  const isReviewing = state?.reviewIndex != null;

  /** The challenge currently displayed (reviewed or current). */
  const displayChallenge = useMemo(() => {
    if (state?.reviewIndex != null) {
      return state.challenges[state.reviewIndex] ?? null;
    }
    return currentChallenge;
  }, [state, currentChallenge]);

  /** The answer for the displayed challenge (always non-null in review mode). */
  const displayAnswer = useMemo(() => {
    if (!displayChallenge || !state) return null;
    return state.answers[displayChallenge.id] ?? null;
  }, [displayChallenge, state]);

  /** Submit an answer for the current challenge. */
  const submitAnswer = useCallback(
    (side: "left" | "right") => {
      if (!currentChallenge) return;

      const challengeId = currentChallenge.id;
      const correctSide = currentChallenge.correctSide;

      const category = currentChallenge.category;
      const difficulty = currentChallenge.difficulty;
      const timeSec = Math.round(
        (Date.now() - challengeShownAt.current) / 1000,
      );

      const isCorrect = side === correctSide;

      trackEvent("challenge-answered", {
        challengeId,
        category,
        difficulty,
        result: isCorrect ? "correct" : "wrong",
        timeSec,
      });

      setState((prev) => {
        if (!prev || prev.answers[challengeId]) return prev;
        const newStreak = isCorrect ? prev.streak + 1 : 0;

        return {
          ...prev,
          score: isCorrect ? prev.score + 1 : prev.score,
          streak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
          answers: {
            ...prev.answers,
            [challengeId]: {
              result: isCorrect ? "correct" : "wrong",
              side,
            },
          },
        };
      });
    },
    [currentChallenge],
  );

  /** Move to the next challenge. */
  const goToNext = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.challenges.length) {
        return {
          ...prev,
          reviewIndex: null,
          isFinished: true,
          finishedAt: Date.now(),
        };
      }
      return { ...prev, reviewIndex: null, currentIndex: nextIndex };
    });
  }, []);

  // Fire side effects once when the game finishes (outside setState to avoid
  // double-invocation in React strict mode).
  useEffect(() => {
    if (!state?.isFinished || !state.finishedAt || didFireFinish.current)
      return;
    didFireFinish.current = true;
    trackEvent("game-finished", {
      score: state.score,
      total: state.challenges.length,
      bestStreak: state.bestStreak,
      durationSec: Math.round((state.finishedAt - state.startedAt) / 1000),
      seed: state.seed,
      gameType: state.gameType,
    });
    recordGame(
      state.seed,
      state.score,
      state.challenges.length,
      state.bestStreak,
    );
    recordActivity();
    void submitGameResult({
      sessionId: `${state.seed}-${String(state.startedAt)}`,
      score: state.score,
      total: state.challenges.length,
      bestStreak: state.bestStreak,
      durationSec: Math.round((state.finishedAt - state.startedAt) / 1000),
    });
  }, [state?.isFinished]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Track restart analytics. The actual reset is handled by the parent. */
  const restartGame = useCallback(() => {
    if (state) {
      trackEvent("game-restarted", {
        previousScore: state.score,
        previousTotal: state.challenges.length,
      });
    }
  }, [state]);

  /** Enter review mode for a previously answered challenge. */
  const reviewQuestion = useCallback((index: number) => {
    setState((prev) => {
      if (!prev) return prev;
      const challenge = prev.challenges[index];
      if (!challenge || !prev.answers[challenge.id]) return prev;
      return { ...prev, reviewIndex: index };
    });
  }, []);

  /** Exit review mode and return to the current question. */
  const exitReview = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      return { ...prev, reviewIndex: null };
    });
  }, []);

  return {
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
  };
}
