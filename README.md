# Can't Maintain - React Prop Naming Game

A "Can't Unsee"-style training game that teaches junior React/TypeScript developers proper prop naming conventions and JSDoc documentation.

## Architecture

```
lib/game/
  types.ts         # All game types (Challenge, GameState, etc.)
  challenges.ts    # Challenge data array - ADD NEW CHALLENGES HERE
  use-game.ts      # Core game state hook (shuffle, score, progression)

components/game/
  game.tsx           # Main game orchestrator
  code-panel.tsx     # Monaco Editor-based clickable code panel
  explanation-panel.tsx # Post-answer explanation with source link
  game-header.tsx    # Score, streak, difficulty, progress bar
  results-screen.tsx # End-of-game summary
```

## Adding New Challenges

Open `lib/game/challenges.ts` and add an object matching the `Challenge` interface:

```ts
{
  id: "cb-006",                    // Unique ID with category prefix
  category: "callback-naming",     // Category tag
  difficulty: "easy",              // easy | medium | hard
  title: "Your challenge title",
  badCode: `...`,                  // The worse code snippet
  goodCode: `...`,                 // The better code snippet
  correctSide: "right",           // Ignored at runtime (randomized)
  explanationCorrect: "...",       // Shown when user picks correctly
  explanationWrong: "...",         // Shown when user picks incorrectly
  sourceUrl: "https://...",        // Authoritative learning link
  sourceLabel: "React Docs: ...",  // Display text for the link
}
```

Challenges auto-sort by difficulty (easy -> medium -> hard) and shuffle within tiers.

## Topics Covered

- **Callback naming**: `on` prefix, descriptive event names
- **Boolean naming**: `is`/`has`/`should` prefixes
- **JSDoc**: `@default`, `@example`, prop descriptions
- **Prop specificity**: union types vs primitives, template literals
- **Render props**: naming patterns, generic typing
- **Children patterns**: `React.ReactNode` typing
- **Discriminated unions**: variant-dependent prop APIs

## Tech Stack

- Next.js 16 (App Router)
- Monaco Editor (`@monaco-editor/react`)
- shadcn/ui components
- TypeScript strict mode
