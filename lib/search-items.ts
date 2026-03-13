import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  CATEGORY_SECTIONS,
} from "@/lib/game/categories";
import { challenges } from "@/lib/game/challenges";
import type { ChallengeCategory } from "@/lib/game/types";

export interface SearchItem {
  type: "page" | "category" | "challenge";
  title: string;
  description: string;
  /** Optional secondary line (e.g. category + difficulty for challenges). */
  subtitle?: string;
  keywords: string[];
  href: string;
}

/** Section label for a given category (used as a keyword). */
function sectionFor(category: ChallengeCategory): string | undefined {
  return CATEGORY_SECTIONS.find((s) => s.categories.includes(category))?.label;
}

export const searchItems: SearchItem[] = [
  // Top-level pages
  {
    type: "page",
    title: "Play",
    description: "Start a quiz game and test your prop naming skills",
    keywords: ["game", "quiz", "daily", "weekly", "challenge"],
    href: "/play",
  },
  {
    type: "page",
    title: "Learn",
    description:
      "Browse all categories and study React component API patterns",
    keywords: ["learn", "study", "patterns", "overview", "categories"],
    href: "/learn",
  },
  {
    type: "page",
    title: "Changelog",
    description: "See what changed in each version",
    keywords: ["changelog", "updates", "releases", "version", "history"],
    href: "/changelog",
  },
  // One entry per category
  ...CATEGORY_ORDER.map((category) => ({
    type: "category" as const,
    title: CATEGORY_LABELS[category],
    description: CATEGORY_DESCRIPTIONS[category],
    keywords: [
      category,
      sectionFor(category),
      "learn",
      "pattern",
    ].filter(Boolean) as string[],
    href: `/learn/${category}`,
  })),
  // Individual challenges — searchable by title and code snippets
  ...challenges.map((c) => ({
    type: "challenge" as const,
    title: c.title,
    description: firstSentence(c.explanationCorrect),
    subtitle: `${CATEGORY_LABELS[c.category]} · ${c.difficulty}`,
    keywords: extractCodeKeywords(c.goodCode, c.badCode),
    href: `/learn/${c.category}#${c.id}`,
  })),
];

/** Extract the first sentence (up to the first period, newline, or 120 chars). */
function firstSentence(text: string): string {
  // Split on sentence-ending punctuation followed by whitespace, or newlines
  const match = /^[^.\n]+[.]/.exec(text);
  if (match) return match[0];
  // Fallback: first line, truncated
  const line = text.split("\n")[0] ?? text;
  return line.length > 120 ? `${line.slice(0, 117)}...` : line;
}

/**
 * Pull identifiers out of code snippets so users can search by
 * prop names, type names, and other tokens they remember.
 */
function extractCodeKeywords(goodCode: string, badCode: string): string[] {
  // Match identifiers that look like prop/type names (camelCase, PascalCase)
  const identifierRe = /\b[a-zA-Z][a-zA-Z0-9]{2,}\b/g;
  const all = `${goodCode} ${badCode}`;
  const matches = all.match(identifierRe) ?? [];

  // Deduplicate and drop very common noise words
  const noise = new Set([
    "string",
    "number",
    "boolean",
    "void",
    "null",
    "undefined",
    "true",
    "false",
    "interface",
    "type",
    "export",
    "import",
    "from",
    "const",
    "function",
    "return",
    "React",
    "ReactNode",
    "children",
    "Props",
    "props",
    "extends",
    "HTMLAttributes",
    "HTMLDivElement",
    "HTMLButtonElement",
    "ComponentProps",
    "div",
    "span",
    "button",
  ]);

  const unique = new Set<string>();
  for (const m of matches) {
    if (!noise.has(m)) unique.add(m);
  }
  return [...unique];
}
