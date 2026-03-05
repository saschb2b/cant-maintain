"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Fade from "@mui/material/Fade";
import Lottie from "lottie-react";
import { getHighlighter } from "@/lib/shiki";
import { codeBlockStyles } from "@/lib/code-styles";
import checkmarkAnimation from "./checkmark-animation.json";

interface CodePanelProps {
  /** TypeScript/TSX source code to display in the editor. */
  code: string;
  /** Short label shown in the panel header (e.g. "A" or "B"). */
  label: string;
  /** Whether the panel can be clicked to select this option. */
  isSelectable: boolean;
  /** Called when the user picks this panel as their answer. */
  onSelect: () => void;
  /** Answer result after the user picks; drives color and animation. */
  result?: "correct" | "wrong" | null;
  /** Whether this panel was the one the user selected. */
  isSelected?: boolean;
}

export function CodePanel({
  code,
  label,
  isSelectable,
  onSelect,
  result,
  isSelected,
}: CodePanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    if (result === "correct" && isSelected) {
      setShowCheckmark(true);
      setFadingOut(false);
    } else {
      setShowCheckmark(false);
      setFadingOut(false);
    }
  }, [result, isSelected]);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.5);
    }
  });

  useEffect(() => {
    let cancelled = false;
    void getHighlighter().then((hl) => {
      if (cancelled) return;
      setHighlightedHtml(
        hl.codeToHtml(code, { lang: "typescript", theme: "github-light" }),
      );
    });
    return () => {
      cancelled = true;
    };
  }, [code]);

  const borderColor =
    result === "correct"
      ? "success.main"
      : result === "wrong"
        ? "error.main"
        : "divider";

  const ringColor =
    result === "correct"
      ? "rgba(var(--mui-palette-success-mainChannel) / 0.3)"
      : result === "wrong"
        ? "rgba(var(--mui-palette-error-mainChannel) / 0.3)"
        : undefined;

  const headerBg =
    result === "correct"
      ? "rgba(var(--mui-palette-success-mainChannel) / 0.1)"
      : result === "wrong"
        ? "rgba(var(--mui-palette-error-mainChannel) / 0.1)"
        : "secondary.main";

  const headerBorderColor =
    result === "correct"
      ? "rgba(var(--mui-palette-success-mainChannel) / 0.3)"
      : result === "wrong"
        ? "rgba(var(--mui-palette-error-mainChannel) / 0.3)"
        : "divider";

  return (
    <Paper
      ref={containerRef}
      role="button"
      tabIndex={isSelectable ? 0 : -1}
      aria-label={`Code option ${label}`}
      onClick={() => isSelectable && onSelect()}
      onKeyDown={(e) => {
        if (isSelectable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect();
        }
      }}
      elevation={0}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        border: 2,
        borderColor,
        overflow: "hidden",
        cursor: isSelectable ? "pointer" : "default",
        transition: "all 0.3s ease",
        boxShadow: ringColor ? `0 0 0 3px ${ringColor}` : undefined,
        ...(result === "correct" &&
          isSelected && {
            animation: "panelCorrect 0.4s ease",
            "@keyframes panelCorrect": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.015)" },
              "100%": { transform: "scale(1)" },
            },
          }),
        ...(result === "wrong" &&
          isSelected && {
            animation: "panelWrong 0.3s ease",
            "@keyframes panelWrong": {
              "0%": { transform: "translateX(0)" },
              "25%": { transform: "translateX(-3px)" },
              "50%": { transform: "translateX(3px)" },
              "75%": { transform: "translateX(-2px)" },
              "100%": { transform: "translateX(0)" },
            },
          }),
        "&:hover": isSelectable
          ? {
              borderColor: "text.secondary",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }
          : undefined,
        "&:focus-visible": isSelectable
          ? {
              borderColor: "primary.main",
              outline: "none",
              boxShadow:
                "0 0 0 3px rgba(var(--mui-palette-primary-mainChannel) / 0.3)",
            }
          : undefined,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
          borderBottom: 1,
          borderColor: headerBorderColor,
          bgcolor: headerBg,
        }}
      >
        <Typography
          variant="body2"
          fontFamily="var(--font-geist-mono), monospace"
          fontWeight={700}
          sx={{
            color:
              result === "correct"
                ? "success.main"
                : result === "wrong"
                  ? "error.main"
                  : "text.primary",
          }}
        >
          {label}
        </Typography>
        <Fade in={result === "correct"} timeout={300} unmountOnExit>
          <Typography variant="caption" fontWeight={500} color="success.main">
            Better
          </Typography>
        </Fade>
        <Fade in={result === "wrong"} timeout={300} unmountOnExit>
          <Typography variant="caption" fontWeight={500} color="error.main">
            Worse
          </Typography>
        </Fade>
      </Box>

      <Box
        sx={{
          flex: 1,
          bgcolor: "#FAF8F5",
          ...codeBlockStyles,
        }}
      >
        {highlightedHtml ? (
          <div dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
        ) : (
          <pre
            style={{
              margin: 0,
              padding: 16,
              fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
              fontSize: "0.875rem",
              lineHeight: 1.7,
            }}
          >
            {code}
          </pre>
        )}
      </Box>
      {showCheckmark && (
        <Lottie
          lottieRef={lottieRef}
          animationData={checkmarkAnimation}
          loop={false}
          onComplete={() => {
            setFadingOut(true);
            setTimeout(() => setShowCheckmark(false), 400);
          }}
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            width: 48,
            height: 48,
            opacity: fadingOut ? 0 : 1,
            transition: "opacity 0.4s ease",
          }}
        />
      )}
    </Paper>
  );
}
