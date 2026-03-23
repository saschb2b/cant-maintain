const STORAGE_KEY = "cant-maintain:history";
const MAX_ENTRIES = 20;

export interface HistoryEntry {
  /** Encoded seed (includes category bitmask if any). */
  seed: string;
  /** Best score achieved on this seed. */
  bestScore: number;
  /** Total challenges in the session. */
  total: number;
  /** Best streak achieved on this seed. */
  bestStreak: number;
  /** Number of times this seed has been played. */
  plays: number;
  /** Timestamp of the most recent play. */
  lastPlayedAt: number;
}

function readAll(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

function writeAll(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

/** Get all history entries, sorted by most recently played. */
export function getHistory(): HistoryEntry[] {
  return readAll().sort((a, b) => b.lastPlayedAt - a.lastPlayedAt);
}

/** Look up history for a specific seed. */
export function getEntryBySeed(seed: string): HistoryEntry | null {
  return readAll().find((e) => e.seed === seed) ?? null;
}

/** Format a timestamp as a relative date string. */
export function formatRelativeDate(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${String(mins)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${String(hours)}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${String(days)}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${String(weeks)}w ago`;
  const months = Math.floor(days / 30);
  return `${String(months)}mo ago`;
}

/** Record a finished game. Updates best score if improved, bumps play count. */
export function recordGame(
  seed: string,
  score: number,
  total: number,
  bestStreak: number,
) {
  const entries = readAll();
  const existing = entries.find((e) => e.seed === seed);

  if (existing) {
    existing.bestScore = Math.max(existing.bestScore, score);
    existing.bestStreak = Math.max(existing.bestStreak, bestStreak);
    existing.plays += 1;
    existing.lastPlayedAt = Date.now();
  } else {
    entries.push({
      seed,
      bestScore: score,
      total,
      bestStreak,
      plays: 1,
      lastPlayedAt: Date.now(),
    });
  }

  // Keep only the most recent entries
  entries.sort((a, b) => b.lastPlayedAt - a.lastPlayedAt);
  writeAll(entries.slice(0, MAX_ENTRIES));
}
