# AGENTS.md - LLM Development Guide

## Project Overview

Can't Maintain is a "Can't Unsee"-style quiz game for learning React prop naming. Players choose between two code snippets (displayed in Monaco Editor), picking the one with better prop naming. The game ramps difficulty from easy to hard, 10 challenges per session.

## Key Architecture Decisions

- **Challenge data lives in per-category files** under `lib/game/challenges/`. Each category has its own TypeScript file exporting an array. `index.ts` combines them. Do NOT move to a database — it's designed for easy editing by humans and LLMs.
- **Game state is a single hook** (`lib/game/use-game.ts`). All game logic lives here - scoring, progression, shuffling. Sessions pick 3 easy + 4 medium + 3 hard challenges.
- **Components are pure presentational** (except `game.tsx` which orchestrates). They receive props and render - no internal state machines.
- **Shiki** renders code snippets with syntax highlighting (server-side on /learn, client-side via `code-panel.tsx` in the game). Shared styles live in `lib/code-styles.ts`.
- **Material UI 7** for all UI components. Use `sx` prop for styling, no Tailwind, no custom CSS classes.

## Challenge Design Principles

Every challenge shows two code snippets side by side. The player must pick the better one. To prevent players from guessing correctly based on visual shape alone, follow these rules:

### Visual parity (critical for medium and hard)

Both sides of a challenge **must have the same visual structure**. The difference should be in **quality**, not presence/absence. Specifically:

- **JSDoc**: If one side has JSDoc, the other must too. The bad side has lazy JSDoc that restates the prop name (`/** The content. */`), the good side has meaningful JSDoc that explains purpose and documents `@default` values.
- **Type structure**: If the good side uses union types, generics, `extends`, or `Omit`, the bad side should too — but use them incorrectly (e.g., no `never` types in unions, `string` instead of `ElementType`, re-declaring inherited props after `extends`).
- **Code length**: Both sides should have roughly the same number of lines. Don't have one side with 3 props and the other with 10.
- **Comments and examples**: If one side has `@example`, both should. The bad side uses generic placeholder values (`title="Title"`), the good side uses realistic values (`title="Delete project?"`).

**Easy challenges are exempt** — visual differences are acceptable there since they help beginners learn to recognize patterns (e.g., no JSDoc vs JSDoc, bare names vs prefixed names).

### What makes a good challenge

- **Easy**: Obvious visual difference, teaches pattern recognition (e.g., `loading` vs `isLoading`)
- **Medium**: Same structure, subtler quality difference (e.g., both have JSDoc but one is vague, both use `Omit` but one omits too much)
- **Hard**: Same structure, requires deep understanding (e.g., both use union types but one leaks props across variants, both use generics but one constrains incorrectly)

### Explanation quality

- `explanationCorrect`: Explain _why_ the good version is better, reference specific prop names
- `explanationWrong`: Explain the concrete problem with the bad version, show what breaks
- Both explanations should teach something even if the player guesses right/wrong
- Reference real-world usage (MUI, React docs) when applicable

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
7. **Follow the visual parity rules above** for medium and hard challenges

### Adding a new challenge category

1. Add the category string to `ChallengeCategory` union in `lib/game/types.ts`
2. Create a new file in `lib/game/challenges/` with the category array
3. Import and spread the array in `lib/game/challenges/index.ts`
4. Add the category to `CATEGORY_ORDER`, `CATEGORY_LABELS`, and `CATEGORY_DESCRIPTIONS` in `lib/game/categories.ts`

### Modifying game mechanics

All game logic is in `lib/game/use-game.ts`. The `prepareChallenges()` function handles shuffling and difficulty ordering. The `SESSION_PICKS` constant controls how many challenges per difficulty tier. The `useGame()` hook exposes the full API.

## File Map

| File                                    | Purpose                                |
| --------------------------------------- | -------------------------------------- |
| `lib/game/types.ts`                     | All TypeScript types                   |
| `lib/game/challenges/index.ts`          | Combines per-category challenge arrays |
| `lib/game/challenges/*.ts`              | Per-category challenge content         |
| `lib/game/use-game.ts`                  | Game state machine hook                |
| `components/game/game.tsx`              | Main game orchestrator                 |
| `lib/game/categories.ts`                | Category order, labels, descriptions   |
| `lib/code-styles.ts`                    | Shared Shiki code block styles         |
| `components/game/code-panel.tsx`        | Shiki-powered code display             |
| `components/game/explanation-panel.tsx` | Post-answer explanation                |
| `components/game/game-header.tsx`       | Score/progress UI                      |
| `components/game/results-screen.tsx`    | End screen with challenge review       |
| `app/page.tsx`                          | Landing page                           |
| `app/play/page.tsx`                     | Game page                              |
| `app/learn/layout.tsx`                  | Learn section layout with sidebar      |
| `app/learn/page.tsx`                    | Learn overview page                    |
| `app/learn/[category]/page.tsx`         | Per-category learn page                |
| `components/learn-sidebar.tsx`          | Sidebar navigation for /learn          |
| `lib/theme.ts`                          | MUI dark theme configuration           |
| `components/theme-provider.tsx`         | MUI ThemeProvider wrapper              |

## Conventions

- All component props have JSDoc comments (we practice what we preach)
- Use `on*` prefix for callback props
- Use `is*`/`has*` prefix for boolean props
- Keep the `Challenge` interface as the single source of truth
- Conventional commits: `feat:`, `fix:`, `chore:`
- Run `pnpm typecheck && pnpm lint && pnpm build` before committing
