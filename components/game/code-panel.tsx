"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { cn } from "@/lib/utils";

interface CodePanelProps {
  /** The TypeScript code to display in the panel. */
  code: string;
  /** Label shown at the top of the panel (e.g. "A" or "B"). */
  label: string;
  /** Whether this panel is currently selectable. */
  isSelectable: boolean;
  /** Called when this panel is clicked. */
  onSelect: () => void;
  /** Visual state after the user answers. */
  result?: "correct" | "wrong" | null;
}

/**
 * A clickable code panel that renders TypeScript code via Monaco Editor.
 * Highlighted green/red after an answer is submitted.
 */
export function CodePanel({
  code,
  label,
  isSelectable,
  onSelect,
  result,
}: CodePanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [editorHeight, setEditorHeight] = useState(200);

  const handleEditorMount: OnMount = useCallback((editor) => {
    // Auto-size based on content
    const lineCount = editor.getModel()?.getLineCount() ?? 10;
    const lineHeight = 20;
    const padding = 32;
    setEditorHeight(Math.max(lineCount * lineHeight + padding, 120));

    // Disable all editing interactions
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
      fontFamily: "var(--font-mono), 'Geist Mono', monospace",
      padding: { top: 16, bottom: 16 },
    });
  }, []);

  useEffect(() => {
    const lineCount = code.split("\n").length;
    const lineHeight = 20;
    const padding = 32;
    setEditorHeight(Math.max(lineCount * lineHeight + padding, 120));
  }, [code]);

  const borderColor =
    result === "correct"
      ? "border-success"
      : result === "wrong"
        ? "border-destructive"
        : isSelectable
          ? "border-border hover:border-muted-foreground"
          : "border-border";

  return (
    <div
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
      className={cn(
        "relative flex flex-col rounded-lg border-2 transition-all overflow-hidden",
        borderColor,
        isSelectable && "cursor-pointer",
        result === "correct" && "ring-2 ring-success/30",
        result === "wrong" && "ring-2 ring-destructive/30",
      )}
    >
      {/* Label badge */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-2 border-b",
          result === "correct"
            ? "bg-success/10 border-success/30"
            : result === "wrong"
              ? "bg-destructive/10 border-destructive/30"
              : "bg-secondary border-border",
        )}
      >
        <span className="text-sm font-mono font-semibold text-muted-foreground">
          {label}
        </span>
        {result === "correct" && (
          <span className="text-xs font-medium text-success">Better</span>
        )}
        {result === "wrong" && (
          <span className="text-xs font-medium text-destructive">Worse</span>
        )}
      </div>

      {/* Monaco editor */}
      <div style={{ height: editorHeight }}>
        <Editor
          height={editorHeight}
          defaultLanguage="typescript"
          value={code}
          theme="vs-dark"
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
            <div className="flex items-center justify-center h-full">
              <span className="text-muted-foreground text-sm">Loading editor...</span>
            </div>
          }
        />
      </div>
    </div>
  );
}
