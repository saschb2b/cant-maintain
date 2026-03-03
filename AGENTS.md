# AGENTS.md - LLM Development Guide

## Project Overview

PropDoc is a "Can't Unsee"-style quiz game for learning React prop naming. Players choose between two code snippets (displayed in Monaco Editor), picking the one with better prop naming. The game ramps difficulty from easy to hard.

## Key Architecture Decisions

- **Challenge data is a flat array** in `lib/game/challenges.ts`. Do NOT move it to a database. It's designed for easy editing by humans and LLMs.
- **Game state is a single hook** (`lib/game/use-game.ts`). All game logic lives here - scoring, progression, shuffling.
- **Components are pure presentational** (except `game.tsx` which orchestrates). They receive props and render - no internal state machines.
- **Monaco Editor** renders code snippets read-only. Do not replace with a simpler code block - syntax highlighting quality is a core feature.

## Common Tasks

### Adding a new challenge

1. Open `lib/game/challenges.ts`
2. Add a `Challenge` object to the `challenges` array
3. Use the correct category prefix for the `id` (cb=callback, bl=boolean, jd=jsdoc, ps=prop-specificity, rp=render-props, cp=children-pattern, du=discriminated-unions)
4. Include both `explanationCorrect` and `explanationWrong`
5. Always link to an authoritative source (React docs, TypeScript docs, JSDoc docs)

### Adding a new challenge category

1. Add the category string to `ChallengeCategory` union in `lib/game/types.ts`
2. Add challenges using that category in `lib/game/challenges.ts`
3. No other changes needed - the game engine handles everything generically

### Modifying game mechanics

All game logic is in `lib/game/use-game.ts`. The `prepareChallenges()` function handles shuffling and difficulty ordering. The `useGame()` hook exposes the full API.

## File Map

| File | Purpose |
|------|---------|
| `lib/game/types.ts` | All TypeScript types |
| `lib/game/challenges.ts` | Challenge content (THE main file to edit) |
| `lib/game/use-game.ts` | Game state machine hook |
| `components/game/game.tsx` | Main game orchestrator |
| `components/game/code-panel.tsx` | Monaco-powered code display |
| `components/game/explanation-panel.tsx` | Post-answer explanation |
| `components/game/game-header.tsx` | Score/progress UI |
| `components/game/results-screen.tsx` | End screen |

## Conventions

- All component props have JSDoc comments (we practice what we preach)
- Use `on*` prefix for callback props
- Use `is*`/`has*` prefix for boolean props
- Keep the `Challenge` interface as the single source of truth
