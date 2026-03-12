/**
 * Thin wrapper around Umami's `umami.track()` for type-safe custom events.
 *
 * @see https://umami.is/docs/tracker-functions
 */

interface ChallengeAnsweredData {
  challengeId: string;
  category: string;
  difficulty: string;
  result: "correct" | "wrong";
}

interface GameFinishedData {
  score: number;
  total: number;
  bestStreak: number;
  durationSec: number;
}

interface EventMap {
  "challenge-answered": ChallengeAnsweredData;
  "game-finished": GameFinishedData;
}

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, unknown>) => void };
  }
}

export function trackEvent<K extends keyof EventMap>(
  event: K,
  data: EventMap[K],
): void {
  window.umami?.track(event, data as unknown as Record<string, unknown>);
}
