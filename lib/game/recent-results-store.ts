import "server-only";

const DAY_MS = 24 * 60 * 60 * 1000;

export interface RecentResult {
  id: string;
  sessionId: string;
  playerName: string;
  score: number;
  total: number;
  bestStreak: number;
  durationSec: number;
  rank: string;
  timestamp: number;
}

// Persist across HMR in dev — in production this is just a plain module-level array.
const globalKey = Symbol.for("cant-maintain:recent-results");
const g = globalThis as unknown as { [k: symbol]: RecentResult[] };
const results: RecentResult[] = (g[globalKey] ??= []);

/** Remove entries older than 24 hours. */
function prune(): void {
  const cutoff = Date.now() - DAY_MS;
  while (results.length > 0 && results[results.length - 1]!.timestamp < cutoff) {
    results.pop();
  }
}

/** Check whether a result for the given session already exists. */
export function hasResult(sessionId: string): boolean {
  return results.some((r) => r.sessionId === sessionId);
}

export function addResult(
  data: Omit<RecentResult, "id" | "timestamp">,
): void {
  results.unshift({
    ...data,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  });
  prune();
}

/** Returns results from the last 24 hours, newest first. */
export function getRecentResults(): RecentResult[] {
  prune();
  return [...results];
}
