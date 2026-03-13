import type { ChallengeCategory } from "./types";

/** Canonical display order of challenge categories. */
export const CATEGORY_ORDER: ChallengeCategory[] = [
  // Naming & Docs
  "component-naming",
  "boolean-naming",
  "callback-naming",
  "jsdoc",
  // Prop Design
  "default-values",
  "prop-specificity",
  "prop-organization",
  "enumerated-variants",
  "styling-api",
  "controlled-uncontrolled",
  // Composition
  "children-pattern",
  "render-props",
  // Advanced Patterns
  "extending-html",
  "ref-forwarding",
  "generic-props",
  "accessibility-props",
  "discriminated-unions",
  // React 19 & Server
  "server-component-props",
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
  "controlled-uncontrolled": "Controlled & Uncontrolled",
  "server-component-props": "Server Component Props",
  "generic-props": "Generic Props",
  "enumerated-variants": "Enumerated Variants",
  "styling-api": "Styling API",
  "component-naming": "Component Naming",
};

/** Logical grouping of categories for sidebar navigation. */
export interface CategorySection {
  label: string;
  categories: ChallengeCategory[];
}

export const CATEGORY_SECTIONS: CategorySection[] = [
  {
    label: "Naming & Docs",
    categories: ["component-naming", "boolean-naming", "callback-naming", "jsdoc"],
  },
  {
    label: "Prop Design",
    categories: [
      "default-values",
      "prop-specificity",
      "prop-organization",
      "enumerated-variants",
      "styling-api",
      "controlled-uncontrolled",
    ],
  },
  {
    label: "Composition",
    categories: ["children-pattern", "render-props"],
  },
  {
    label: "Advanced Patterns",
    categories: [
      "extending-html",
      "ref-forwarding",
      "generic-props",
      "accessibility-props",
      "discriminated-unions",
    ],
  },
  {
    label: "React 19 & Server",
    categories: ["server-component-props"],
  },
];

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
  "controlled-uncontrolled":
    "The value/defaultValue/onChange contract, dual-mode APIs, and mirroring native HTML form patterns.",
  "server-component-props":
    "Serializable props across the server/client boundary, Server Actions, and the donut pattern.",
  "generic-props":
    "Using TypeScript generics to create type-safe, reusable component APIs that infer from props.",
  "enumerated-variants":
    "Replacing boolean prop explosion with string union enums for size, variant, color, and other visual dimensions.",
  "styling-api":
    "Choosing between className, style, variants, and design tokens to keep styling concerns out of your prop API.",
  "component-naming":
    "Naming components by role, not location. Avoiding over-specific prefixes, redundant splitting, and verb-based names.",
};
