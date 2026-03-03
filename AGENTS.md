# AGENTS.md - LLM Development Guide

## Project Overview

Can't Maintain is a "Can't Unsee"-style quiz game for learning React prop naming. Players choose between two code snippets (displayed in Monaco Editor), picking the one with better prop naming. The game ramps difficulty from easy to hard, 10 challenges per session.

## Key Architecture Decisions

- **Challenge data lives in per-category files** under `lib/game/challenges/`. Each category has its own TypeScript file exporting an array. `index.ts` combines them. Do NOT move to a database — it's designed for easy editing by humans and LLMs.
- **Game state is a single hook** (`lib/game/use-game.ts`). All game logic lives here - scoring, progression, shuffling. Sessions pick 3 easy + 4 medium + 3 hard challenges.
- **Components are pure presentational** (except `game.tsx` which orchestrates). They receive props and render - no internal state machines.
- **Monaco Editor** renders code snippets read-only. Do not replace with a simpler code block - syntax highlighting quality is a core feature.
- **Material UI 7** for all UI components. Use `sx` prop for styling, no Tailwind, no custom CSS classes.

## Common Tasks

### Adding a new challenge

1. Open the relevant category file in `lib/game/challenges/` (e.g. `callback-naming.ts`)
2. Append a `Challenge` object to the exported array
3. Use the correct category prefix for the `id`:
   - `cb` = callback-naming
   - `bl` = boolean-naming
   - `jd` = jsdoc
   - `ps` = prop-specificity
   - `rp` = render-props
   - `cp` = children-pattern
   - `du` = discriminated-unions
   - `eh` = extending-html
   - `dv` = default-values
   - `po` = prop-organization
4. Include both `explanationCorrect` and `explanationWrong`
5. Always link to an authoritative source (React docs, TypeScript docs, MUI docs, MDN)
6. The `correctSide` value is overridden at runtime (randomized), but conventionally set to `"right"`

### Adding a new challenge category

1. Add the category string to `ChallengeCategory` union in `lib/game/types.ts`
2. Create a new file in `lib/game/challenges/` with the category array
3. Import and spread the array in `lib/game/challenges/index.ts`
4. Add the category label to the `CATEGORY_LABELS` map in both `components/game/game.tsx` and `components/game/results-screen.tsx`

### Modifying game mechanics

All game logic is in `lib/game/use-game.ts`. The `prepareChallenges()` function handles shuffling and difficulty ordering. The `SESSION_PICKS` constant controls how many challenges per difficulty tier. The `useGame()` hook exposes the full API.

## File Map

| File | Purpose |
| --- | --- |
| `lib/game/types.ts` | All TypeScript types |
| `lib/game/challenges/index.ts` | Combines per-category challenge arrays |
| `lib/game/challenges/*.ts` | Per-category challenge content |
| `lib/game/use-game.ts` | Game state machine hook |
| `components/game/game.tsx` | Main game orchestrator |
| `components/game/code-panel.tsx` | Monaco-powered code display |
| `components/game/explanation-panel.tsx` | Post-answer explanation |
| `components/game/game-header.tsx` | Score/progress UI |
| `components/game/results-screen.tsx` | End screen with challenge review |
| `app/page.tsx` | Landing page |
| `app/play/page.tsx` | Game page |
| `lib/theme.ts` | MUI dark theme configuration |
| `components/theme-provider.tsx` | MUI ThemeProvider wrapper |

## Conventions

- All component props have JSDoc comments (we practice what we preach)
- Use `on*` prefix for callback props
- Use `is*`/`has*` prefix for boolean props
- Keep the `Challenge` interface as the single source of truth
- Conventional commits: `feat:`, `fix:`, `chore:`
- Run `pnpm typecheck && pnpm lint && pnpm build` before committing
