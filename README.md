# Can't Maintain - React Prop Naming Game

A "Can't Unsee"-style training game that teaches React/TypeScript developers proper prop naming conventions, component API design, and JSDoc documentation.

## Architecture

```
lib/game/
  types.ts              # All game types (Challenge, GameState, etc.)
  use-game.ts           # Core game state hook (shuffle, score, progression)
  challenges/
    index.ts            # Combines all per-category arrays
    callback-naming.ts  # cb-* challenges
    boolean-naming.ts   # bl-* challenges
    jsdoc.ts            # jd-* challenges
    prop-specificity.ts # ps-* challenges
    render-props.ts     # rp-* challenges
    children-pattern.ts # cp-* challenges
    discriminated-unions.ts # du-* challenges
    extending-html.ts   # eh-* challenges
    default-values.ts   # dv-* challenges

components/game/
  game.tsx             # Main game orchestrator
  code-panel.tsx       # Monaco Editor-based clickable code panel
  explanation-panel.tsx # Post-answer explanation with source link
  game-header.tsx      # Score, streak, difficulty, progress bar
  results-screen.tsx   # End-of-game results with challenge review
```

## Adding New Challenges

Find the relevant category file in `lib/game/challenges/` (e.g. `callback-naming.ts`) and append a `Challenge` object to its array:

```ts
{
  id: "cb-008",                    // Unique ID with category prefix
  category: "callback-naming",     // Must match the file's category
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

Each session picks 3 easy, 4 medium, and 3 hard challenges, shuffled within tiers. Side randomization happens automatically.

## Topics Covered (9 categories, 50 challenges)

- **Callback naming**: `on` prefix, descriptive event names, dual-level events
- **Boolean naming**: `is`/`has`/`should`/`disable`/`keep`/`hide` prefixes
- **JSDoc**: `@default`, `@example`, `@deprecated`, prop descriptions
- **Prop specificity**: union types vs primitives, template literals, accessible text
- **Render props**: `render*` vs `get*`, render functions vs ReactNode slots, headless components
- **Children patterns**: composition, compound components, slots, `slots`/`slotProps`
- **Discriminated unions**: variant-dependent props, `never` type, linked optionals
- **Extending HTML**: `React.ComponentProps`, `Omit`, polymorphic `as` prop
- **Default values**: destructuring defaults, stable references, default callbacks

## Tech Stack

- Next.js 16 (App Router)
- Material UI 7 (`@mui/material`)
- Monaco Editor (`@monaco-editor/react`)
- TypeScript strict mode
- pnpm
