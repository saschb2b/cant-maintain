import type { GameState } from "./types";
import { CATEGORY_LABELS } from "./categories";

/** Rank thresholds based on percentage score. */
export function getRank(percentage: number): string {
  if (percentage >= 90) return "Prop Master";
  if (percentage >= 70) return "Naming Ninja";
  if (percentage >= 50) return "Getting There";
  return "Keep Practicing";
}

/** Decoded results from a shared URL param. */
export interface SharedResults {
  score: number;
  total: number;
  streak: number;
  seconds: number;
  results: boolean[];
  seed?: string;
}

/**
 * Encode game results into a compact URL-safe string.
 * Format: `score-total-streak-seconds-dotsBinary`
 * Example: `8-10-5-83-1101110110`
 */
export function encodeResults(state: GameState): string {
  const score = Object.values(state.answers).filter(
    (a) => a.result === "correct",
  ).length;
  const total = state.challenges.length;
  const elapsed = Math.round(
    ((state.finishedAt ?? state.startedAt) - state.startedAt) / 1000,
  );
  const dots = state.challenges
    .map((c) => (state.answers[c.id]?.result === "correct" ? "1" : "0"))
    .join("");

  const raw = `${String(score)}-${String(total)}-${String(state.bestStreak)}-${String(elapsed)}-${dots}-${state.seed}`;
  return btoa(raw);
}

/**
 * Decode a shared results string back into structured data.
 * Returns null if the format is invalid.
 */
export function decodeResults(param: string): SharedResults | null {
  let raw: string;
  try {
    raw = atob(param);
  } catch {
    return null;
  }
  const parts = raw.split("-");
  // Support both old 5-part format and new 6-part format with seed
  if (parts.length !== 5 && parts.length !== 6) return null;

  const [scoreStr, totalStr, streakStr, secondsStr, dotsStr, seedStr] = parts;
  const score = Number(scoreStr);
  const total = Number(totalStr);
  const streak = Number(streakStr);
  const seconds = Number(secondsStr);

  if ([score, total, streak, seconds].some((n) => !Number.isFinite(n) || n < 0))
    return null;
  if (dotsStr?.length !== total) return null;
  if (!/^[01]+$/.test(dotsStr)) return null;

  const results = Array.from(dotsStr, (c) => c === "1");
  return { score, total, streak, seconds, results, seed: seedStr };
}

/** Build the full share URL for a game session. */
export function getShareUrl(state: GameState): string {
  return `https://cant-maintain.saschb2b.com/play/results?r=${encodeResults(state)}&seed=${state.seed}`;
}

/** Get human-readable missed category names from game state. */
export function getMissedCategoryLabels(state: GameState): string[] {
  const missed = state.challenges
    .filter((c) => state.answers[c.id]?.result === "wrong")
    .map((c) => c.category);
  return [...new Set(missed)].map((cat) => CATEGORY_LABELS[cat].toLowerCase());
}
