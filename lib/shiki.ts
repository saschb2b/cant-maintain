import { getSingletonHighlighterCore } from "@shikijs/core";
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript";

/** Returns a shared Shiki highlighter instance (TypeScript + github-light). */
export function getHighlighter() {
  return getSingletonHighlighterCore({
    engine: createJavaScriptRegexEngine(),
    themes: [import("@shikijs/themes/github-light")],
    langs: [import("@shikijs/langs/typescript")],
  });
}
