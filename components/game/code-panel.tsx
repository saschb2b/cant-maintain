"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Fade from "@mui/material/Fade";

interface CodePanelProps {
  code: string;
  label: string;
  isSelectable: boolean;
  onSelect: () => void;
  result?: "correct" | "wrong" | null;
  fixedHeight?: number;
}

export function CodePanel({
  code,
  label,
  isSelectable,
  onSelect,
  result,
  fixedHeight,
}: CodePanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mountHeight, setMountHeight] = useState<number | null>(null);

  const calculatedHeight = useMemo(() => {
    const lineCount = code.split("\n").length;
    const lineHeight = 20;
    const padding = 32;
    return Math.max(lineCount * lineHeight + padding, 120);
  }, [code]);

  const editorHeight = fixedHeight ?? mountHeight ?? calculatedHeight;

  const handleEditorMount: OnMount = useCallback((editor) => {
    const lineCount = editor.getModel()?.getLineCount() ?? 10;
    const lineHeight = 20;
    const padding = 32;
    setMountHeight(Math.max(lineCount * lineHeight + padding, 120));

    editor.updateOptions({
      readOnly: true,
      domReadOnly: true,
      cursorStyle: "line",
      renderLineHighlight: "none",
      scrollBeyondLastLine: false,
      minimap: { enabled: false },
      scrollbar: { vertical: "hidden", horizontal: "hidden" },
      overviewRulerLanes: 0,
      hideCursorInOverviewRuler: true,
      overviewRulerBorder: false,
      folding: false,
      lineNumbers: "on",
      lineDecorationsWidth: 0,
      lineNumbersMinChars: 3,
      glyphMargin: false,
      contextmenu: false,
      fontSize: 14,
      fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
      padding: { top: 16, bottom: 16 },
    });
  }, []);

  const borderColor =
    result === "correct"
      ? "success.main"
      : result === "wrong"
        ? "error.main"
        : "divider";

  const ringColor =
    result === "correct"
      ? "rgba(91,138,114,0.3)"
      : result === "wrong"
        ? "rgba(196,87,58,0.3)"
        : undefined;

  const headerBg =
    result === "correct"
      ? "rgba(91,138,114,0.1)"
      : result === "wrong"
        ? "rgba(196,87,58,0.1)"
        : "secondary.main";

  const headerBorderColor =
    result === "correct"
      ? "rgba(91,138,114,0.3)"
      : result === "wrong"
        ? "rgba(196,87,58,0.3)"
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
        border: 2,
        borderColor,
        overflow: "hidden",
        cursor: isSelectable ? "pointer" : "default",
        transition: "all 0.3s ease",
        boxShadow: ringColor ? `0 0 0 3px ${ringColor}` : undefined,
        ...(result === "correct" && {
          animation: "panelCorrect 0.4s ease",
          "@keyframes panelCorrect": {
            "0%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.015)" },
            "100%": { transform: "scale(1)" },
          },
        }),
        ...(result === "wrong" && {
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
              boxShadow: "0 0 0 3px rgba(43,76,126,0.3)",
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
            fontSize: "0.9rem",
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

      <Box sx={{ height: editorHeight, position: "relative" }}>
        {isSelectable && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              cursor: "pointer",
            }}
          />
        )}
        <Editor
          height={editorHeight}
          defaultLanguage="typescript"
          value={code}
          theme="vs"
          onMount={handleEditorMount}
          options={{
            readOnly: true,
            domReadOnly: true,
            minimap: { enabled: false },
            scrollbar: { vertical: "hidden", horizontal: "hidden" },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: "on",
            folding: false,
            contextmenu: false,
            renderLineHighlight: "none",
            padding: { top: 16, bottom: 16 },
          }}
          loading={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Loading editor...
              </Typography>
            </Box>
          }
        />
      </Box>
    </Paper>
  );
}
