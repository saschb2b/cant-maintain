import { getSingletonHighlighter } from "shiki";

/** Returns a shared Shiki highlighter instance (TypeScript + github-light). */
export function getHighlighter() {
  return getSingletonHighlighter({
    themes: ["github-light"],
    langs: ["typescript"],
  });
}
