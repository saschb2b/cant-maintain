import type { ChallengeCategory } from "./types";

/** Canonical display order of challenge categories. */
export const CATEGORY_ORDER: ChallengeCategory[] = [
  "boolean-naming",
  "callback-naming",
  "default-values",
  "prop-specificity",
  "jsdoc",
  "prop-organization",
  "children-pattern",
  "render-props",
  "extending-html",
  "ref-forwarding",
  "accessibility-props",
  "discriminated-unions",
];

/** Human-readable labels for each challenge category. */
export const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  "callback-naming": "Callback Naming",
  "boolean-naming": "Boolean Props",
  jsdoc: "JSDoc",
  "prop-specificity": "Prop Specificity",
  "render-props": "Render Props",
  "children-pattern": "Children Pattern",
  "discriminated-unions": "Discriminated Unions",
  "extending-html": "Extending HTML",
  "ref-forwarding": "Ref Forwarding",
  "accessibility-props": "Accessibility Props",
  "default-values": "Default Values",
  "prop-organization": "Prop Organization",
};

/** Short description for each category, shown on the learn overview. */
export const CATEGORY_DESCRIPTIONS: Record<ChallengeCategory, string> = {
  "callback-naming":
    "Why the on prefix matters and how to name event handler props so they read like English.",
  "boolean-naming":
    "Using is, has, should, and other prefixes to make yes/no props obvious at a glance.",
  jsdoc:
    "Documenting defaults, examples, and deprecations so consumers don't have to read your source.",
  "prop-specificity":
    "Replacing vague primitives with union types, template literals, and accessible text props.",
  "render-props":
    "When to use render functions vs ReactNode slots, and how to name headless component APIs.",
  "children-pattern":
    "Composition, compound components, named slots, and the slots/slotProps convention.",
  "discriminated-unions":
    "Modeling variant-dependent props with TypeScript so impossible states are unrepresentable.",
  "extending-html":
    "Forwarding native HTML attributes with ComponentProps, Omit, and polymorphic as props.",
  "ref-forwarding":
    "Forwarding refs to the right element, typing them correctly, and keeping imperative handles minimal.",
  "accessibility-props":
    "Making aria-label required, typing ARIA roles as unions, and wiring up labelledby/describedby.",
  "default-values":
    "Setting sensible defaults via destructuring, stable references, and default callbacks.",
  "prop-organization":
    "Grouping related props, removing redundancy, and knowing when to extract sub-components.",
};
