"use client";

import { useCallback, useMemo, useState } from "react";
import type { Challenge, Difficulty, GameState } from "./types";
import { challenges as allChallenges } from "./challenges";

/** Fisher-Yates shuffle (immutable). */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
};

/**
 * Prepares the challenge list: shuffles within each difficulty tier,
 * then concatenates easy -> medium -> hard for progressive difficulty.
 * Also randomizes which side the "good" code appears on.
 */
function prepareChallenges(): Challenge[] {
  const byDifficulty = allChallenges.reduce(
    (acc, c) => {
      acc[c.difficulty].push(c);
      return acc;
    },
    { easy: [], medium: [], hard: [] } as Record<Difficulty, Challenge[]>,
  );

  return (
    Object.entries(byDifficulty) as [Difficulty, Challenge[]][]
  )
    .sort(([a], [b]) => DIFFICULTY_ORDER[a] - DIFFICULTY_ORDER[b])
    .flatMap(([, cs]) =>
      shuffle(cs).map((c) => ({
        ...c,
        correctSide: (Math.random() > 0.5 ? "left" : "right") as "left" | "right",
      })),
    );
}

/** Core game state hook. Handles scoring, progression, and answers. */
export function useGame() {
  const [state, setState] = useState<GameState>(() => ({
    challenges: prepareChallenges(),
    currentIndex: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    answers: {},
    isFinished: false,
    startedAt: Date.now(),
  }));

  const currentChallenge = useMemo(
    () => state.challenges[state.currentIndex] ?? null,
    [state.challenges, state.currentIndex],
  );

  const totalChallenges = state.challenges.length;

  const currentDifficulty: Difficulty | null = currentChallenge?.difficulty ?? null;

  /** The user's answer for the current challenge, if any. */
  const currentAnswer = currentChallenge
    ? state.answers[currentChallenge.id] ?? null
    : null;

  /** Submit an answer for the current challenge. */
  const answer = useCallback(
    (side: "left" | "right") => {
      if (!currentChallenge || state.answers[currentChallenge.id]) return;

      const isCorrect = side === currentChallenge.correctSide;

      setState((prev) => {
        const newStreak = isCorrect ? prev.streak + 1 : 0;
        return {
          ...prev,
          score: isCorrect ? prev.score + 1 : prev.score,
          streak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
          answers: {
            ...prev.answers,
            [currentChallenge.id]: isCorrect ? "correct" : "wrong",
          },
        };
      });
    },
    [currentChallenge, state.answers],
  );

  /** Move to the next challenge. */
  const next = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.challenges.length) {
        return { ...prev, isFinished: true };
      }
      return { ...prev, currentIndex: nextIndex };
    });
  }, []);

  /** Restart the game with freshly shuffled challenges. */
  const restart = useCallback(() => {
    setState({
      challenges: prepareChallenges(),
      currentIndex: 0,
      score: 0,
      streak: 0,
      bestStreak: 0,
      answers: {},
      isFinished: false,
      startedAt: Date.now(),
    });
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
