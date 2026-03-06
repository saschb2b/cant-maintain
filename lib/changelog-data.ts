// This file duplicates CHANGELOG.md as a TypeScript string so it can be
// imported reliably in Server Components across all bundlers (Turbopack, etc.)
// When updating CHANGELOG.md, update this file as well.

export const changelog = `# Changelog

All notable changes to **Can't Maintain** are documented here.

## [0.7.0] - 2026-03-06

### Added
- \`/changelog\` page with MUI Timeline component
- Version badge in site header linking to changelog
- Package metadata (name, description, author, repository, license)

### Changed
- Updated landing page tagline and hero code example for clarity

### Fixed
- Open Graph image rendering for shared results (static root image, edge import fixes, Next.js 16 compat)
- Scroll behavior on results screen

---

## [0.6.0] - 2026-03-05

### Added
- Shareable results with dynamic OG image generation
- Redesigned results screen with two-column bento layout
- Lottie checkmark animation on correct answers

### Fixed
- Mobile layout and game UX improvements
- Wrong answer flash when advancing to next challenge

---

## [0.5.0] - 2026-03-04

### Added
- 3 new challenge categories with 23 new challenges (108 total):
  - **Controlled / Uncontrolled** — recognizing controlled vs uncontrolled component patterns
  - **Generic Props** — leveraging TypeScript generics in prop interfaces
  - **Server Component Props** — prop design for React Server Components
- Cross-cutting concern challenge (po-008)
- Challenges sorted by difficulty on learn pages
- Play button in header and category-specific review links
- Anchor links to learn challenge cards for sharing
- Smooth page transitions with View Transitions API

### Improved
- Challenge explanations toned down from prescriptive absolutes
- Render props, compound components, and controlled/uncontrolled challenges refined
- WCAG AA contrast compliance for text
- Centralized color tokens via theme and CSS variables

---

## [0.4.0] - 2026-03-03 (evening)

### Added
- \`/learn\` section with react.dev-style sidebar layout
- Inline markdown rendering in challenge explanations
- 2 new challenge categories:
  - **Ref Forwarding** — proper patterns for forwarding refs
  - **Accessibility Props** — aria and a11y prop conventions
- Redesigned landing page hero with open source section
- Shiki syntax highlighting (replaced Monaco Editor)
- Mid-game question review
- SEO metadata and custom angle-bracket favicon

### Fixed
- Visual parity enforced on medium/hard challenges
- Challenge titles blurred pre-answer to prevent bias

---

## [0.3.0] - 2026-03-03 (afternoon)

### Added
- 1 new challenge category:
  - **Prop Organization** — ordering and grouping props (6 challenges)
- 12 new challenges across existing categories
- Mesh gradient backgrounds
- Landing page with 10-challenge sessions, results review, and keyboard navigation
- Post-answer animations
- Footer links and contribution CTA

### Fixed
- Results screen text contrast against gradient background
- SSR hydration issues

---

## [0.2.0] - 2026-03-03 (early afternoon)

### Added
- 9 initial challenge categories:
  - **Boolean Naming** — \`is\`/\`has\`/\`should\` prefixes for boolean props
  - **Callback Naming** — \`on\`-prefixed event handler conventions
  - **Children Pattern** — composition vs config props
  - **Default Values** — sensible defaults and optional props
  - **Discriminated Unions** — type-safe variant props
  - **Extending HTML** — wrapping native element props correctly
  - **JSDoc** — documenting component APIs
  - **Prop Specificity** — narrow vs broad prop types
  - **Render Props** — render function patterns
- Warm navy color palette and improved MUI patterns
- ESLint strict type-checking, Prettier, and GitHub CI

### Changed
- Migrated from Tailwind CSS + shadcn/ui to Material UI

---

## [0.1.0] - 2026-03-03

### Added
- Initial release — renamed from "PropDoc" to "Can't Maintain"
- Core quiz gameplay — pick the better-named prop
- First set of challenges covering naming conventions
- Generated via v0 and iterated from there
`;
