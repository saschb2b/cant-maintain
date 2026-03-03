"use client";

import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface ExplanationPanelProps {
  /** Whether the user picked correctly. */
  isCorrect: boolean;
  /** The explanation text to display. */
  text: string;
  /** URL to an external source for learning more. */
  sourceUrl: string;
  /** Display label for the source link. */
  sourceLabel: string;
}

/**
 * Shows a post-answer explanation with a link to an authoritative source.
 * Green for correct, red for incorrect.
 */
export function ExplanationPanel({
  isCorrect,
  text,
  sourceUrl,
  sourceLabel,
}: ExplanationPanelProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-all animate-in fade-in slide-in-from-bottom-2 duration-300",
        isCorrect
          ? "bg-success/5 border-success/30"
          : "bg-destructive/5 border-destructive/30",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
            isCorrect
              ? "bg-success text-success-foreground"
              : "bg-destructive text-destructive-foreground",
          )}
        >
          {isCorrect ? "+" : "-"}
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-sm leading-relaxed text-foreground">{text}</p>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium transition-colors",
              isCorrect
                ? "text-success hover:text-success/80"
                : "text-destructive hover:text-destructive/80",
            )}
          >
            <ExternalLink className="w-3 h-3" />
            {sourceLabel}
          </a>
        </div>
      </div>
    </div>
  );
}
