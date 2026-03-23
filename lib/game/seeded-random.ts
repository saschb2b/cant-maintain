/**
 * Seeded random number generation utilities.
 *
 * Allows deterministic challenge selection so two players with the same seed
 * get the exact same set of challenges in the same order with the same
 * left/right placement.
 */

import type { ChallengeCategory } from "./types";
import { CATEGORY_ORDER } from "./categories";

/** DJB2 hash — converts a string seed into a 32-bit integer. */
export function hashSeed(seed: string): number {
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) + hash + seed.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

/** Mulberry32 PRNG — returns a () => number producing values in [0, 1). */
export function createRng(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate a short, human-friendly seed code.
 * Format: 6 uppercase alphanumeric characters (e.g. "A3X9K2").
 */
export function generateSeed(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1 to avoid confusion
  let seed = "";
  for (let i = 0; i < 6; i++) {
    seed += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return seed;
}

/**
 * Generate a deterministic seed from a string key (e.g. "daily-2026-03-12").
 * Same key always produces the same 6-character seed code.
 */
export function seedFromKey(key: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rng = createRng(hashSeed(key));
  let seed = "";
  for (let i = 0; i < 6; i++) {
    seed += chars.charAt(Math.floor(rng() * chars.length));
  }
  return seed;
}

/** Get today's date string in YYYY-MM-DD format (UTC). */
export function getTodayKey(): string {
  const d = new Date();
  return `daily-${String(d.getUTCFullYear())}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

/** Get the current ISO week key (UTC). */
export function getWeekKey(): string {
  const d = new Date();
  // ISO week calculation
  const jan4 = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const start = new Date(jan4.getTime());
  start.setUTCDate(jan4.getUTCDate() - ((jan4.getUTCDay() + 6) % 7));
  const weekNum = Math.ceil(
    ((d.getTime() - start.getTime()) / 86400000 + 1) / 7,
  );
  return `weekly-${String(d.getUTCFullYear())}-W${String(weekNum).padStart(2, "0")}`;
}

/**
 * Encode excluded categories as a hex bitmask suffix on the seed.
 * Each bit corresponds to a category in CATEGORY_ORDER (1 = excluded).
 * Returns the raw seed if no categories are excluded.
 * Example: "GC9PJS" (all) or "GC9PJS-1FFFE" (only first category enabled).
 */
export function encodeSeed(
  rawSeed: string,
  excludedCategories: Set<ChallengeCategory>,
): string {
  if (excludedCategories.size === 0) return rawSeed;
  let mask = 0;
  for (let i = 0; i < CATEGORY_ORDER.length; i++) {
    const cat = CATEGORY_ORDER[i];
    if (cat && excludedCategories.has(cat)) {
      mask |= 1 << i;
    }
  }
  return `${rawSeed}-${mask.toString(16).toUpperCase()}`;
}

/**
 * Decode a seed string into a raw seed and excluded categories.
 * Handles both plain seeds ("GC9PJS") and seeds with a bitmask suffix ("GC9PJS-1FFFE").
 */
export function decodeSeed(seed: string): {
  rawSeed: string;
  excludedCategories: Set<ChallengeCategory>;
} {
  const dashIndex = seed.lastIndexOf("-");
  if (dashIndex === -1) {
    return { rawSeed: seed, excludedCategories: new Set() };
  }
  const rawSeed = seed.slice(0, dashIndex);
  const maskStr = seed.slice(dashIndex + 1);
  const mask = parseInt(maskStr, 16);
  if (Number.isNaN(mask)) {
    return { rawSeed: seed, excludedCategories: new Set() };
  }
  const excluded = new Set<ChallengeCategory>();
  for (let i = 0; i < CATEGORY_ORDER.length; i++) {
    const cat = CATEGORY_ORDER[i];
    if (mask & (1 << i) && cat) {
      excluded.add(cat);
    }
  }
  return { rawSeed, excludedCategories: excluded };
}
