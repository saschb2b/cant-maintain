"use client";

import { Button } from "@/components/ui/button";
import type { GameState } from "@/lib/game/types";
import { RotateCcw, Trophy, Target, Zap } from "lucide-react";

interface ResultsScreenProps {
  /** Final game state snapshot. */
  state: GameState;
  /** Called when the user wants to play again. */
  onRestart: () => void;
}

/**
 * End-of-game results summary with score breakdown and replay button.
 */
export function ResultsScreen({ state, onRestart }: ResultsScreenProps) {
  const total = state.challenges.length;
  const correct = Object.values(state.answers).filter((a) => a === "correct").length;
  const percentage = Math.round((correct / total) * 100);
  const elapsed = Math.round((Date.now() - state.startedAt) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  const rank =
    percentage >= 90
      ? "Prop Master"
      : percentage >= 70
        ? "Naming Ninja"
        : percentage >= 50
          ? "Getting There"
          : "Keep Practicing";

  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <div className="text-center space-y-2">
        <Trophy className="w-16 h-16 mx-auto text-accent" />
        <h2 className="text-3xl font-bold font-sans text-foreground text-balance">
          {rank}
        </h2>
        <p className="text-muted-foreground text-sm">
          Challenge your colleagues to beat your score!
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 w-full max-w-md">
        <div className="flex flex-col items-center gap-1 p-4 rounded-lg bg-secondary">
          <Target className="w-5 h-5 text-success" />
          <span className="text-2xl font-bold font-mono text-foreground">
            {correct}/{total}
          </span>
          <span className="text-xs text-muted-foreground">Correct</span>
        </div>
        <div className="flex flex-col items-center gap-1 p-4 rounded-lg bg-secondary">
          <Zap className="w-5 h-5 text-accent" />
          <span className="text-2xl font-bold font-mono text-foreground">
            {state.bestStreak}x
          </span>
          <span className="text-xs text-muted-foreground">Best Streak</span>
        </div>
        <div className="flex flex-col items-center gap-1 p-4 rounded-lg bg-secondary">
          <span className="text-lg text-muted-foreground">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
          <span className="text-xs text-muted-foreground">Time</span>
        </div>
      </div>

      <div className="w-full max-w-md p-4 rounded-lg bg-secondary text-center">
        <div className="text-5xl font-bold font-mono text-foreground">
          {percentage}%
        </div>
        <p className="text-sm text-muted-foreground mt-1">Final Score</p>
      </div>

      <Button onClick={onRestart} size="lg" className="gap-2">
        <RotateCcw className="w-4 h-4" />
        Play Again
      </Button>
    </div>
  );
}
