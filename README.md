# Can't Maintain - React Prop Naming Game

A "Can't Unsee"-style training game that teaches React/TypeScript developers proper prop naming conventions, component API design, and JSDoc documentation.

## Architecture

```
app/
  layout.tsx             # Root layout with fonts, theme, analytics
  template.tsx           # View transition CSS injection (fade on navigate)
  page.tsx               # Landing page
  play/page.tsx          # Game page
  learn/
    layout.tsx           # Learn section layout with sidebar
    page.tsx             # Learn overview
    [category]/page.tsx  # Per-category learn page
  opengraph-image.tsx    # Dynamic OG image generation
  robots.ts              # Robots metadata
  sitemap.ts             # Sitemap metadata
  manifest.ts            # Web app manifest

lib/
  theme.ts               # MUI dark theme
  shiki.ts               # Singleton Shiki highlighter (TypeScript + github-light)
  code-styles.ts         # Shared Shiki code block styles
  game/
    types.ts             # All game types (Challenge, GameState, etc.)
    use-game.ts          # Core game state hook (shuffle, score, progression, review)
    categories.ts        # Category order, labels, descriptions, sections
    challenges/
      index.ts              # Combines all per-category arrays
      callback-naming.ts    # cb-* challenges
      boolean-naming.ts     # bl-* challenges
      jsdoc.ts              # jd-* challenges
      prop-specificity.ts   # ps-* challenges
      render-props.ts       # rp-* challenges
      children-pattern.ts   # cp-* challenges
      discriminated-unions.ts # du-* challenges
      extending-html.ts     # eh-* challenges
      ref-forwarding.ts     # rf-* challenges
      accessibility-props.ts # ap-* challenges
      default-values.ts     # dv-* challenges
      prop-organization.ts  # po-* challenges
      controlled-uncontrolled.ts # cu-* challenges
      server-component-props.ts  # sc-* challenges
      generic-props.ts      # gp-* challenges

components/
  theme-provider.tsx     # MUI ThemeProvider + CssBaseline
  emotion-registry.tsx   # Emotion cache for SSR streaming
  site-header.tsx        # Shared header with logo and GitHub link
  site-footer.tsx        # Shared footer with links
  mesh-gradient.tsx      # Decorative background gradient
  learn-sidebar.tsx      # Sidebar navigation for /learn (desktop)
  learn-mobile-nav.tsx   # Horizontal scroll nav for /learn (mobile)
  formatted-text.tsx     # Inline markdown rendering for explanations
  game/
    game.tsx             # Main game orchestrator
    code-panel.tsx       # Shiki-highlighted clickable code panel
    explanation-panel.tsx # Post-answer explanation with source link
    game-header.tsx      # Score, streak, difficulty, clickable progress dots
    results-screen.tsx   # End-of-game results with per-question breakdown
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

## Topics Covered (15 categories, 108 challenges)

- **Callback naming**: `on` prefix, descriptive event names, dual-level events
- **Boolean naming**: `is`/`has`/`should`/`disable`/`keep`/`hide` prefixes
- **JSDoc**: `@default`, `@example`, `@deprecated`, prop descriptions
- **Prop specificity**: union types vs primitives, template literals, accessible text
- **Render props**: `render*` vs `get*`, render functions vs ReactNode slots, headless components
- **Children patterns**: composition, compound components, slots, `slots`/`slotProps`
- **Discriminated unions**: variant-dependent props, `never` type, linked optionals
- **Extending HTML**: `React.ComponentProps`, `Omit`, polymorphic `as` prop
- **Ref forwarding**: `React.forwardRef`, `useImperativeHandle`, ref callback patterns
- **Accessibility props**: ARIA attributes, semantic HTML, screen reader support
- **Default values**: destructuring defaults, stable references, default callbacks
- **Prop organization**: grouping related props, removing redundancy, extracting sub-components
- **Controlled & uncontrolled**: `value`/`defaultValue`/`onChange` trio, key resets, array patterns
- **Server component props**: serializable props, avoiding functions in server components
- **Generic props**: type inference, constrained generics, multi-generic form fields

## Tech Stack

- Next.js 16 (App Router) with experimental View Transitions
- Material UI 7 (`@mui/material`)
- Shiki (`shiki`) for syntax highlighting
- TypeScript strict mode
- pnpm
