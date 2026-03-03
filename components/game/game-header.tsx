"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Difficulty } from "@/lib/game/types";
import { cn } from "@/lib/utils";

interface GameHeaderProps {
  /** Current score. */
  score: number;
  /** Total challenges in the game. */
  total: number;
  /** 1-based index of the current question. */
  currentQuestion: number;
  /** Current consecutive correct streak. */
  streak: number;
  /** Current difficulty tier. */
  difficulty: Difficulty | null;
}

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; className: string }> = {
  easy: { label: "Easy", className: "bg-success/20 text-success border-success/30" },
  medium: { label: "Medium", className: "bg-accent/20 text-accent border-accent/30" },
  hard: { label: "Hard", className: "bg-destructive/20 text-destructive border-destructive/30" },
};

/**
 * Top bar showing score, streak, difficulty badge, and progress.
 */
export function GameHeader({
  score,
  total,
  currentQuestion,
  streak,
  difficulty,
}: GameHeaderProps) {
  const progressPercent = (currentQuestion / total) * 100;
  const diffConfig = difficulty ? DIFFICULTY_CONFIG[difficulty] : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
              Score
            </span>
            <span className="text-2xl font-bold font-mono text-foreground">
              {score}
              <span className="text-sm text-muted-foreground">/{total}</span>
            </span>
          </div>

          {streak >= 2 && (
            <div className="flex flex-col animate-in fade-in zoom-in duration-200">
              <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                Streak
              </span>
              <span className="text-2xl font-bold font-mono text-accent">
                {streak}x
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {diffConfig && (
            <Badge
              variant="outline"
              className={cn("font-mono text-xs", diffConfig.className)}
            >
              {diffConfig.label}
            </Badge>
          )}
          <span className="text-sm font-mono text-muted-foreground">
            {currentQuestion}/{total}
          </span>
        </div>
      </div>

      <Progress value={progressPercent} className="h-1" />
    </div>
  );
}
