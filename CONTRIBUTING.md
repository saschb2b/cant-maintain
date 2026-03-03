# Contributing to Can't Maintain

Thanks for your interest in contributing! This guide covers everything you need to get started.

## Quick Start

```bash
# Clone the repo
git clone https://github.com/saschb2b/cant-maintain.git
cd cant-maintain

# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command             | What it does                 |
| ------------------- | ---------------------------- |
| `pnpm dev`          | Start the Next.js dev server |
| `pnpm build`        | Production build             |
| `pnpm lint`         | Run ESLint                   |
| `pnpm format:check` | Check Prettier formatting    |
| `pnpm typecheck`    | Run TypeScript type checking |

Run all checks before submitting a PR:

```bash
pnpm typecheck && pnpm lint && pnpm format:check && pnpm build
```

## Project Structure

```
app/
  page.tsx                  # Landing page
  play/page.tsx             # Game page
  learn/
    layout.tsx              # Learn section layout with sidebar
    page.tsx                # Learn overview
    [category]/page.tsx     # Per-category learn page
components/
  game/                     # Game UI components
  learn-sidebar.tsx         # Sidebar navigation for /learn
  theme-provider.tsx        # MUI ThemeProvider wrapper
lib/
  game/
    types.ts                # All TypeScript types
    use-game.ts             # Game state hook
    categories.ts           # Category order, labels, descriptions
    challenges/
      index.ts              # Combines per-category arrays
      callback-naming.ts    # cb-* challenges
      boolean-naming.ts     # bl-* challenges
      jsdoc.ts              # jd-* challenges
      prop-specificity.ts   # ps-* challenges
      render-props.ts       # rp-* challenges
      children-pattern.ts   # cp-* challenges
      discriminated-unions.ts # du-* challenges
      extending-html.ts     # eh-* challenges
      default-values.ts     # dv-* challenges
      prop-organization.ts  # po-* challenges
  theme.ts                  # MUI dark theme
  code-styles.ts            # Shared Shiki code block styles
```

## Adding a Challenge

This is the most common contribution. Each challenge shows two code snippets side by side — the player picks the one with better React prop naming.

### Step by step

1. Open the relevant category file in `lib/game/challenges/` (e.g., `callback-naming.ts`)
2. Append a `Challenge` object to the exported array
3. Use the correct ID prefix for the category:

| Prefix | Category             |
| ------ | -------------------- |
| `cb`   | callback-naming      |
| `bl`   | boolean-naming       |
| `jd`   | jsdoc                |
| `ps`   | prop-specificity     |
| `rp`   | render-props         |
| `cp`   | children-pattern     |
| `du`   | discriminated-unions |
| `eh`   | extending-html       |
| `dv`   | default-values       |
| `po`   | prop-organization    |

4. Include both `explanationCorrect` and `explanationWrong`
5. Link to an authoritative source (React docs, TypeScript docs, MUI docs, MDN)
6. Set `correctSide` to `"right"` by convention — it's randomized at runtime

### Visual parity (critical for medium and hard)

Both sides of a challenge **must have the same visual structure**. The difference should be in **quality**, not presence/absence. This prevents players from guessing correctly based on shape alone.

Rules:

- **JSDoc**: If one side has JSDoc, the other must too. The bad side has lazy JSDoc that restates the prop name (`/** The content. */`), the good side has meaningful JSDoc that explains purpose and documents `@default` values.
- **Type structure**: If the good side uses union types, generics, `extends`, or `Omit`, the bad side should too — but use them incorrectly (e.g., no `never` types in unions, `string` instead of `ElementType`, re-declaring inherited props after `extends`).
- **Code length**: Both sides should have roughly the same number of lines. Don't have one side with 3 props and the other with 10.
- **Comments and examples**: If one side has `@example`, both should. The bad side uses generic placeholder values (`title="Title"`), the good side uses realistic values (`title="Delete project?"`).

**Easy challenges are exempt** — visual differences are acceptable there since they help beginners recognize patterns (e.g., no JSDoc vs JSDoc, bare names vs prefixed names).

### Difficulty tiers

- **Easy**: Obvious visual difference, teaches pattern recognition (e.g., `loading` vs `isLoading`)
- **Medium**: Same structure, subtler quality difference (e.g., both have JSDoc but one is vague, both use `Omit` but one omits too much)
- **Hard**: Same structure, requires deep understanding (e.g., both use union types but one leaks props across variants, both use generics but one constrains incorrectly)

### Explanation quality

- `explanationCorrect`: Explain _why_ the good version is better, reference specific prop names
- `explanationWrong`: Explain the concrete problem with the bad version, show what breaks
- Both explanations should teach something regardless of whether the player guessed right or wrong
- Reference real-world usage (MUI, React docs) when applicable

### Example challenge

```ts
{
  id: "cb-005",
  category: "callback-naming",
  difficulty: "easy",
  title: "Click handler naming",
  badCode: `interface Props {\n  click: () => void;\n}`,
  goodCode: `interface Props {\n  onClick: () => void;\n}`,
  correctSide: "right",
  explanationCorrect:
    "Nice! `onClick` follows the `on` + event pattern...",
  explanationWrong:
    "`click` is ambiguous...",
  sourceUrl: "https://react.dev/learn/responding-to-events",
  sourceLabel: "React Docs: Responding to Events",
}
```

## Adding a New Category

1. Add the category string to the `ChallengeCategory` union in `lib/game/types.ts`
2. Create a new file in `lib/game/challenges/` with the category array
3. Import and spread the array in `lib/game/challenges/index.ts`
4. Add the category to `CATEGORY_ORDER`, `CATEGORY_LABELS`, and `CATEGORY_DESCRIPTIONS` in `lib/game/categories.ts`

## Code Conventions

- **Material UI 7** for all UI — use the `sx` prop for styling, no Tailwind, no custom CSS classes
- **Shiki** for syntax highlighting (server-side on /learn, client-side in the game)
- All component props have JSDoc comments (we practice what we preach)
- Use `on*` prefix for callback props, `is*`/`has*` prefix for booleans
- Conventional commits: `feat:`, `fix:`, `chore:`

## Pull Requests

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Run `pnpm typecheck && pnpm lint && pnpm format:check && pnpm build`
4. Open a PR against `main` with a clear description of the change
5. CI runs lint, format check, typecheck, and build automatically
