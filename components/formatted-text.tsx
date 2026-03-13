import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Fragment } from "react";

interface FormattedTextProps {
  /** Text with optional inline markdown: `code`, **bold**, and paragraph breaks. */
  text: string;
}

const codeStyle = {
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: "0.85em",
  bgcolor: "action.hover",
  px: 0.6,
  py: 0.2,
  borderRadius: 0.5,
} as const;

/**
 * Renders a string with lightweight inline markdown support.
 *
 * - `\n\n` → paragraph break (with spacing)
 * - `\n` → line break
 * - `` `code` `` → inline code
 * - `**bold**` → strong
 */
export function FormattedText({ text }: FormattedTextProps) {
  const paragraphs = text.split("\n\n");

  return (
    <>
      {paragraphs.map((paragraph, pIdx) => (
        <Typography
          key={pIdx}
          component="p"
          sx={{
            mt: pIdx > 0 ? 1.5 : 0,
            lineHeight: 1.7,
            fontSize: "inherit",
            color: "inherit",
          }}
        >
          {renderParagraph(paragraph)}
        </Typography>
      ))}
    </>
  );
}

function renderParagraph(text: string) {
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => (
    <Fragment key={lineIdx}>
      {lineIdx > 0 && <br />}
      {renderInline(line)}
    </Fragment>
  ));
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
