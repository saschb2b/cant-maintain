"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Challenge, Difficulty, GameState } from "./types";
import { challenges as allChallenges } from "./challenges";

/** Fisher-Yates shuffle (immutable). */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
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
function prepareChallenges(): Challenge[] {
  const byDifficulty = allChallenges.reduce<Record<Difficulty, Challenge[]>>(
    (acc, c) => {
      acc[c.difficulty].push(c);
      return acc;
    },
    { easy: [], medium: [], hard: [] },
  );

  return (Object.entries(byDifficulty) as [Difficulty, Challenge[]][])
    .sort(([a], [b]) => DIFFICULTY_ORDER[a] - DIFFICULTY_ORDER[b])
    .flatMap(([, cs]) =>
      shuffle(cs)
        .slice(0, SESSION_PICKS[cs[0]?.difficulty ?? "medium"])
        .map((c) => ({
          ...c,
          correctSide: (Math.random() > 0.5 ? "left" : "right") satisfies
            | "left"
            | "right",
        })),
    );
}

function createInitialState(): GameState {
  return {
    challenges: prepareChallenges(),
    currentIndex: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    answers: {},
    isFinished: false,
    startedAt: Date.now(),
    finishedAt: null,
  };
}

/** Core game state hook. Handles scoring, progression, and answers. */
export function useGame() {
  const [state, setState] = useState<GameState | null>(null);

  // Defer random shuffle to client to avoid hydration mismatch
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setState(createInitialState()), []);

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

  /** Submit an answer for the current challenge. */
  const answer = useCallback(
    (side: "left" | "right") => {
      if (!currentChallenge) return;

      const challengeId = currentChallenge.id;
      const correctSide = currentChallenge.correctSide;

      setState((prev) => {
        if (!prev || prev.answers[challengeId]) return prev;
        const isCorrect = side === correctSide;
        const newStreak = isCorrect ? prev.streak + 1 : 0;
        return {
          ...prev,
          score: isCorrect ? prev.score + 1 : prev.score,
          streak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
          answers: {
            ...prev.answers,
            [challengeId]: isCorrect ? "correct" : "wrong",
          },
        };
      });
    },
    [currentChallenge],
  );

  /** Move to the next challenge. */
  const next = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.challenges.length) {
        return { ...prev, isFinished: true, finishedAt: Date.now() };
      }
      return { ...prev, currentIndex: nextIndex };
    });
  }, []);

  /** Restart the game with freshly shuffled challenges. */
  const restart = useCallback(() => {
    setState(createInitialState());
  }, []);

  return {
    state,
    currentChallenge,
    currentAnswer,
    currentDifficulty,
    totalChallenges,
    answer,
    next,
    restart,
  };
}
