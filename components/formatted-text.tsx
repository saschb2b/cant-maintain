import Box from "@mui/material/Box";
import { Fragment } from "react";

interface FormattedTextProps {
  /** Text with optional inline markdown: `code` and **bold**. */
  text: string;
}

const codeStyle = {
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: "0.85em",
  bgcolor: "rgba(255,255,255,0.06)",
  px: 0.5,
  py: 0.125,
  borderRadius: 0.5,
} as const;

/**
 * Renders a string with lightweight inline markdown support.
 * Supports `` `code` ``, `**bold**`, and `\n` line breaks.
 */
export function FormattedText({ text }: FormattedTextProps) {
  const lines = text.split("\n");

  return (
    <>
      {lines.map((line, lineIdx) => (
        <Fragment key={lineIdx}>
          {lineIdx > 0 && <br />}
          {renderInline(line)}
        </Fragment>
      ))}
    </>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <Box key={i} component="code" sx={codeStyle}>
          {part.slice(1, -1)}
        </Box>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
