"use client";

import { useMemo } from "react";
import { useGame } from "@/lib/game/use-game";
import { CodePanel } from "./code-panel";
import { ExplanationPanel } from "./explanation-panel";
import { GameHeader } from "./game-header";
import { ResultsScreen } from "./results-screen";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

/**
 * The main game orchestrator. Renders the current challenge as two
 * side-by-side Monaco panels, handles answer selection, shows explanations,
 * and transitions between challenges.
 */
export function Game() {
  const {
    state,
    currentChallenge,
    currentAnswer,
    currentDifficulty,
    totalChallenges,
    answer,
    next,
    restart,
  } = useGame();

  // Determine which code goes on which side
  const { leftCode, rightCode } = useMemo(() => {
    if (!currentChallenge) return { leftCode: "", rightCode: "" };
    return currentChallenge.correctSide === "left"
      ? { leftCode: currentChallenge.goodCode, rightCode: currentChallenge.badCode }
      : { leftCode: currentChallenge.badCode, rightCode: currentChallenge.goodCode };
  }, [currentChallenge]);

  const getResult = (side: "left" | "right"): "correct" | "wrong" | null => {
    if (!currentAnswer || !currentChallenge) return null;
    return side === currentChallenge.correctSide ? "correct" : "wrong";
  };

  // Loading state while client-side shuffle initializes
  if (!state) {
    return (
      <div className="w-full max-w-6xl mx-auto flex items-center justify-center py-24">
        <div className="text-muted-foreground text-sm animate-pulse">Loading challenges...</div>
      </div>
    );
  }

  if (state.isFinished) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <ResultsScreen state={state} onRestart={restart} />
      </div>
    );
  }

  if (!currentChallenge) return null;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <GameHeader
        score={state.score}
        total={totalChallenges}
        currentQuestion={state.currentIndex + 1}
        streak={state.streak}
        difficulty={currentDifficulty}
      />

      {/* Challenge title + instruction */}
      <div className="text-center space-y-1">
        <h2 className="text-lg font-semibold font-sans text-foreground text-balance">
          {currentChallenge.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          Pick the code with better prop naming
        </p>
      </div>

      {/* Two code panels side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CodePanel
          code={leftCode}
          label="A"
          isSelectable={!currentAnswer}
          onSelect={() => answer("left")}
          result={getResult("left")}
        />
        <CodePanel
          code={rightCode}
          label="B"
          isSelectable={!currentAnswer}
          onSelect={() => answer("right")}
          result={getResult("right")}
        />
      </div>

      {/* Explanation + Next button */}
      {currentAnswer && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <ExplanationPanel
            isCorrect={currentAnswer === "correct"}
            text={
              currentAnswer === "correct"
                ? currentChallenge.explanationCorrect
                : currentChallenge.explanationWrong
            }
            sourceUrl={currentChallenge.sourceUrl}
            sourceLabel={currentChallenge.sourceLabel}
          />

          <div className="flex justify-center">
            <Button onClick={next} size="lg" className="gap-2">
              {state.currentIndex + 1 < totalChallenges ? (
                <>
                  Next Challenge
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                "See Results"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
