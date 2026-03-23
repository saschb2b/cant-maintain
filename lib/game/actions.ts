"use server";

import { getRank } from "./share";
import { generateAnonymousName } from "./anonymous-names";
import {
  addResult,
  getRecentResults,
  hasResult,
  type RecentResult,
} from "./recent-results-store";

export async function submitGameResult(data: {
  sessionId: string;
  score: number;
  total: number;
  bestStreak: number;
  durationSec: number;
}): Promise<void> {
  const { sessionId, score, total, bestStreak, durationSec } = data;

  // Basic validation
  if (
    !Number.isInteger(score) ||
    !Number.isInteger(total) ||
    !Number.isInteger(bestStreak) ||
    !Number.isInteger(durationSec)
  )
    return;
  if (total <= 0 || score < 0 || score > total) return;
  if (bestStreak < 0 || durationSec < 0) return;
  if (!sessionId) return;

  // Ignore duplicate submissions for the same game session
  if (hasResult(sessionId)) return;

  const percentage = Math.round((score / total) * 100);

  addResult({
    sessionId,
    playerName: generateAnonymousName(),
    score,
    total,
    bestStreak,
    durationSec,
    rank: getRank(percentage),
  });
}

export async function fetchRecentResults(): Promise<RecentResult[]> {
  return getRecentResults();
}
