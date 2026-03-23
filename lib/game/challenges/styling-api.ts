import type { Challenge } from "../types";

export const stylingApiChallenges: Challenge[] = [
  {
    id: "sa-001",
    category: "styling-api",
    difficulty: "easy",
    title: "Variants vs style overrides",
    badCode: `interface BadgeProps {
  children: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
  fontSize?: number;
}`,
    goodCode: `interface BadgeProps {
  children: React.ReactNode;
  /** @default "default" */
  variant?: 'default' | 'success' | 'warning'
    | 'error' | 'info';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
}`,
    correctSide: "right",
    explanationCorrect:
      'Exposing raw style values (`backgroundColor`, `fontSize`) turns every consumer into a designer. Variants encode design decisions once, so consumers pick from a curated set.\n\n`<Badge variant="success" size="sm" />` is self-documenting and guaranteed to look correct. With raw values, two developers will pick two different greens for success.',
    explanationWrong:
      "Raw style props create an infinite API surface. `backgroundColor=\"#22c55e\"` in one file and `backgroundColor=\"#16a34a\"` in another both mean 'success' but look different.\n\nVariants centralize design decisions inside the component. Consumers express intent ('this is a success badge'), not implementation ('make it this shade of green').",
    sourceUrl: "https://mui.com/material-ui/api/chip/",
    sourceLabel: "MUI: Chip API",
  },
  {
    id: "sa-002",
    category: "styling-api",
    difficulty: "easy",
    title: "className pass-through",
    badCode: `interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined';
}

function Card({ children, variant }: CardProps) {
  return (
    <div className={styles[variant ?? 'elevated']}>
      {children}
    </div>
  );
}`,
    goodCode: `interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined';
  className?: string;
}

function Card({ children, variant, className }: CardProps) {
  return (
    <div className={clsx(styles[variant ?? 'elevated'], className)}>
      {children}
    </div>
  );
}`,
    correctSide: "right",
    explanationCorrect:
      "A `className` prop is the escape hatch every component needs. Without it, consumers can't add margins, adjust positioning, or apply one-off overrides without wrapping the component in an extra `<div>`.\n\nMerging with `clsx` (or `cn`) ensures the component's own styles are preserved while the consumer's additions take effect.",
    explanationWrong:
      'Without `className`, the only way to adjust spacing or layout is to wrap the component: `<div className="mt-4"><Card>...</Card></div>`. That adds unnecessary DOM nodes and makes the code harder to read.\n\nAccepting `className` and merging it with internal classes is the standard pattern used by Radix, shadcn/ui, and most composable component libraries.',
    sourceUrl: "https://www.radix-ui.com/primitives/docs/guides/styling",
    sourceLabel: "Radix: Styling Guide",
  },
  {
    id: "sa-003",
    category: "styling-api",
    difficulty: "medium",
    title: "Inline style prop vs className",
    badCode: `interface TooltipProps {
  content: string;
  children: React.ReactNode;
  /** Custom width for the tooltip. */
  style?: React.CSSProperties;
}`,
    goodCode: `interface TooltipProps {
  content: string;
  children: React.ReactNode;
  /** Additional classes for the tooltip. */
  className?: string;
}`,
    correctSide: "right",
    explanationCorrect:
      "Exposing `style` as the primary customization prop encourages inline styles, which can't use media queries, pseudo-classes, or CSS variables. `className` integrates with any CSS methodology (Tailwind, CSS modules, styled-components) and supports responsive design.\n\nIf you need both, accept both. But `className` alone covers more use cases than `style` alone.",
    explanationWrong:
      "`style` only supports static, non-responsive CSS properties. You can't write `style={{ ':hover': { ... } }}` or `style={{ '@media': { ... } }}` in React.\n\n`className` works with every CSS solution and supports the full power of CSS. For components that need dynamic runtime values (like positioning), accepting both `className` and `style` is the right call.",
    sourceUrl:
      "https://react.dev/reference/react-dom/components/common#applying-css-styles",
    sourceLabel: "React Docs: Applying CSS Styles",
  },
  {
    id: "sa-004",
    category: "styling-api",
    difficulty: "medium",
    title: "Design tokens vs arbitrary color props",
    badCode: `interface ButtonProps {
  children: React.ReactNode;
  /** Any valid CSS color. */
  color?: string;
  /** Any valid CSS color. */
  hoverColor?: string;
}`,
    goodCode: `interface ButtonProps {
  children: React.ReactNode;
  /** @default "primary" */
  color?: 'primary' | 'secondary' | 'error'
    | 'success' | 'inherit';
}`,
    correctSide: "right",
    explanationCorrect:
      "A `color` prop that accepts any string is impossible to validate. `color=\"rde\"` (typo) compiles fine. Token-based color props constrain consumers to the design system's palette and handle hover, focus, and disabled states internally.\n\nMUI's Button uses this exact pattern: `color` maps to theme palette keys, and the component derives all related colors (hover, active, text contrast) automatically.",
    explanationWrong:
      'An open `string` color prop forces every consumer to manually specify hover states, disabled states, focus rings, and text contrast. `<Button color="#e74c3c" hoverColor="#c0392b" />` is error-prone and duplicates design decisions across every call site.\n\nToken-based colors let the component look up the full color ramp from the theme, keeping the API simple and the visuals consistent.',
    sourceUrl: "https://mui.com/material-ui/api/button/",
    sourceLabel: "MUI: Button API",
  },
  {
    id: "sa-005",
    category: "styling-api",
    difficulty: "medium",
    title: "Slot classNames for sub-elements",
    badCode: `interface DialogProps {
  title: string;
  children: React.ReactNode;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  overlayClassName?: string;
  closeButtonClassName?: string;
}`,
    goodCode: `interface DialogProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  classes?: {
    header?: string;
    body?: string;
    footer?: string;
    overlay?: string;
    closeButton?: string;
  };
}`,
    correctSide: "right",
    explanationCorrect:
      "Grouping sub-element classNames into a `classes` object keeps the top-level API clean. The root `className` handles the common case, while `classes` is there for fine-grained control.\n\nWith five flat `*ClassName` props, the component's main API (title, children, callbacks) gets buried. MUI uses this exact `classes` pattern across all its components.",
    explanationWrong:
      "Five separate `*ClassName` props clutter the component's API surface. Autocomplete shows `headerClassName`, `bodyClassName`, etc. mixed in with functional props like `title` and `onClose`.\n\nA `classes` object groups styling concerns together, making the API scannable. Consumers who don't need sub-element styling never see the individual slot names.",
    sourceUrl:
      "https://mui.com/material-ui/customization/how-to-customize/#overriding-nested-component-styles",
    sourceLabel: "MUI: Overriding Nested Styles",
  },
  {
    id: "sa-006",
    category: "styling-api",
    difficulty: "medium",
    title: "CSS variables vs style props",
    badCode: `interface ProgressBarProps {
  /** Progress from 0 to 100. */
  value: number;
  /** Height in pixels. @default 8 */
  height?: number;
  /** Track color. @default "#e5e7eb" */
  trackColor?: string;
  /** Fill color. @default "#3b82f6" */
  fillColor?: string;
  /** Border radius in pixels. @default 4 */
  borderRadius?: number;
}`,
    goodCode: `interface ProgressBarProps {
  /** Progress from 0 to 100. */
  value: number;
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** @default "primary" */
  color?: 'primary' | 'success' | 'warning'
    | 'error';
  className?: string;
}`,
    correctSide: "right",
    explanationCorrect:
      "Four separate style props (`height`, `trackColor`, `fillColor`, `borderRadius`) make the consumer responsible for visual coherence. Do `height={4}` and `borderRadius={8}` look right together? Nobody knows without rendering it.\n\nSemantic props (`size`, `color`) express intent and let the component handle internally consistent styling. `className` is the escape hatch for anything the variants don't cover.",
    explanationWrong:
      'Granular style props seem flexible but shift design responsibility to every consumer. Each call site becomes a mini design decision: what height, what color, what radius?\n\nSemantic variants encode these decisions once. `<ProgressBar size="sm" color="success" />` is always visually correct. For rare overrides, `className` or CSS custom properties (via the component\'s internal styles) provide an escape hatch without polluting the prop API.',
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties",
    sourceLabel: "MDN: CSS Custom Properties",
  },
  {
    id: "sa-007",
    category: "styling-api",
    difficulty: "hard",
    title: "Responsive prop values",
    badCode: `interface GridProps {
  children: React.ReactNode;
  columns: number;
  mobileColumns?: number;
  tabletColumns?: number;
  desktopColumns?: number;
}`,
    goodCode: `interface GridProps {
  children: React.ReactNode;
  columns: number | {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}`,
    correctSide: "right",
    explanationCorrect:
      "A single prop that accepts either a static value or a breakpoint object scales cleanly. `columns={3}` for simple cases, `columns={{ xs: 1, md: 2, lg: 3 }}` for responsive ones.\n\nSeparate props per breakpoint (`mobileColumns`, `tabletColumns`) don't compose. What if you add an `xxl` breakpoint? Every responsive prop needs a new sibling. MUI's Grid uses this responsive object pattern.",
    explanationWrong:
      "Three extra props per responsive dimension explodes the API. A component with `columns`, `gap`, and `padding` would need 12 props to cover four breakpoints.\n\nThe breakpoint object pattern keeps it to three props: `columns`, `gap`, `padding`, each accepting `number | { xs?, sm?, md?, lg? }`. Adding a new breakpoint updates the shared type, not every prop definition.",
    sourceUrl: "https://mui.com/material-ui/api/grid/",
    sourceLabel: "MUI: Grid API",
  },
  {
    id: "sa-008",
    category: "styling-api",
    difficulty: "medium",
    title: "Exposing internal layout props",
    badCode: `interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  gap?: number;
  padding?: number;
  maxHeight?: number;
  overflow?: 'auto' | 'hidden' | 'scroll';
  display?: 'flex' | 'grid';
  flexDirection?: 'row' | 'column';
}`,
    goodCode: `interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  /** @default "vertical" */
  direction?: 'vertical' | 'horizontal';
  /** @default "md" */
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}`,
    correctSide: "right",
    explanationCorrect:
      "Props like `display`, `flexDirection`, and `overflow` leak CSS implementation details into the component API. They couple consumers to the component's internal layout strategy.\n\n`direction` and `spacing` express the same concepts at a higher abstraction level. If the component switches from flexbox to grid internally, the API stays the same. `className` covers edge cases.",
    explanationWrong:
      "Mirroring CSS properties as React props (`display`, `flexDirection`, `overflow`) creates a leaky abstraction. The consumer must know the component uses flexbox. Changing to CSS grid would be a breaking API change.\n\nSemantic props (`direction`, `spacing`) describe what the component does, not how. The implementation can change freely. For one-off overrides, `className` lets consumers apply any CSS without the component needing to expose every property.",
    sourceUrl: "https://react.dev/learn/passing-props-to-a-component",
    sourceLabel: "React Docs: Passing Props",
  },
];
