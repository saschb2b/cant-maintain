import { getSingletonHighlighterCore } from "@shikijs/core";
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript";

/** Returns a shared Shiki highlighter instance (TypeScript + both themes). */
export function getHighlighter() {
  return getSingletonHighlighterCore({
    engine: createJavaScriptRegexEngine(),
    themes: [
      import("@shikijs/themes/github-light"),
      import("@shikijs/themes/github-dark-default"),
    ],
    langs: [import("@shikijs/langs/tsx")],
  });
}

/**
 * Highlight code with both themes and wrap in containers that toggle
 * via the `.light` / `.dark` class on `<html>`.
 */
export function highlightDual(
  highlighter: Awaited<ReturnType<typeof getHighlighter>>,
  code: string,
  lang: "tsx" = "tsx",
): string {
  const light = highlighter.codeToHtml(code, {
    lang,
    theme: "github-light",
  });
  const dark = highlighter.codeToHtml(code, {
    lang,
    theme: "github-dark-default",
  });
  return `<div class="shiki-light">${light}</div><div class="shiki-dark">${dark}</div>`;
}
