/** Difficulty tier that determines when a challenge appears in the game. */
export type Difficulty = "easy" | "medium" | "hard";

/** Category tag for grouping and filtering challenges. */
export type ChallengeCategory =
  | "callback-naming"
  | "boolean-naming"
  | "jsdoc"
  | "prop-specificity"
  | "render-props"
  | "children-pattern"
  | "discriminated-unions";

/**
 * A single challenge in the game.
 *
 * To add a new challenge, create an object matching this shape and push it
 * into the appropriate difficulty array in `challenges.ts`.
 *
 * @example
 * const myChallenge: Challenge = {
 *   id: "cb-005",
 *   category: "callback-naming",
 *   difficulty: "easy",
 *   title: "Click handler naming",
 *   badCode: `interface Props {\n  click: () => void;\n}`,
 *   goodCode: `interface Props {\n  onClick: () => void;\n}`,
 *   correctSide: "right",
 *   explanationCorrect: "Nice! `onClick` follows the `on` + event pattern...",
 *   explanationWrong: "`click` is ambiguous...",
 *   sourceUrl: "https://react.dev/learn/responding-to-events",
 *   sourceLabel: "React Docs: Responding to Events",
 * };
 */
export interface Challenge {
  /** Unique identifier, prefixed by category abbreviation (e.g. "cb-001"). */
  id: string;
  category: ChallengeCategory;
  difficulty: Difficulty;
  /** Short title shown above the code panels. */
  title: string;
  /** The "bad" code snippet (TypeScript/TSX). */
  badCode: string;
  /** The "good" code snippet (TypeScript/TSX). */
  goodCode: string;
  /** Which side the good code should appear on - randomized at render time. */
  correctSide: "left" | "right";
  /** Explanation shown when the user picks correctly. */
  explanationCorrect: string;
  /** Explanation shown when the user picks incorrectly. */
  explanationWrong: string;
  /** URL to an authoritative source for learning more. */
  sourceUrl: string;
  /** Display label for the source link. */
  sourceLabel: string;
}

/** Snapshot of the current game state. */
export interface GameState {
  /** All challenges in play order (shuffled, difficulty-sorted). */
  challenges: Challenge[];
  /** Index of the current challenge. */
  currentIndex: number;
  /** Running score. */
  score: number;
  /** Current streak of correct answers. */
  streak: number;
  /** Best streak achieved this session. */
  bestStreak: number;
  /** Map of challenge id -> "correct" | "wrong". */
  answers: Record<string, "correct" | "wrong">;
  /** Whether the game has ended. */
  isFinished: boolean;
  /** Timestamp game started. */
  startedAt: number;
}
