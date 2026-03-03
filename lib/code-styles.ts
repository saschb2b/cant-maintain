/** Shared sx styles for Shiki-highlighted code blocks. */
export const codeBlockStyles = {
  "& pre": {
    m: 0,
    p: 2,
    fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
    fontSize: "0.85rem",
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    bgcolor: "transparent !important",
  },
  "& code": {
    fontFamily: "inherit",
  },
} as const;
