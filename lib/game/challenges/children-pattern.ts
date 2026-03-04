import type { Challenge } from "../types";

export const childrenPatternChallenges: Challenge[] = [
  {
    id: "cp-001",
    category: "children-pattern",
    difficulty: "hard",
    title: "Generic list component",
    badCode: `interface ListProps<T> {
  /** The data to iterate. */
  data: T[];
  /** Render function for each item. */
  render: (item: T) => React.ReactNode;
  /** Empty state content. */
  empty: React.ReactNode;
}`,
    goodCode: `interface ListProps<T> {
  /** The data array to iterate over. */
  data: T[];
  /**
   * Render function called for each item.
   * Receives the item and its index.
   */
  renderItem: (item: T, index: number) => React.ReactNode;
  /**
   * Content shown when the data array is empty.
   * @example
   * emptyState={<EmptyMessage text="No items" />}
   */
  emptyState: React.ReactNode;
}`,
    correctSide: "right",
    explanationCorrect:
      "`renderItem` is specific (render what? an item), the callback includes `index` for `key` assignment and alternating styles, and `emptyState` clearly describes the slot's purpose.\n\nThe `@example` in JSDoc shows the expected usage pattern. Compare `render` (of what?) and `empty` (a boolean? a message?).",
    explanationWrong:
      "`render` could mean anything: render the list? render an item? render a header? `empty` is equally ambiguous: is it a boolean, a string, or JSX? Specific names like `renderItem` and `emptyState` make the API self-documenting. The callback also misses the `index` parameter, which is needed for `key` props and alternating row styles.",
    sourceUrl: "https://www.typescriptlang.org/docs/handbook/2/generics.html",
    sourceLabel: "TypeScript: Generics",
  },
  {
    id: "cp-002",
    category: "children-pattern",
    difficulty: "hard",
    title: "Compound component API design",
    badCode: `interface SelectProps {
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
    icon?: React.ReactNode;
    group?: string;
  }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}`,
    goodCode: `interface SelectOptionProps {
  /** The value submitted when selected. */
  value: string;
  /** Display label. Falls back to children. */
  children: React.ReactNode;
  /** Whether this option is non-selectable. */
  isDisabled?: boolean;
}

interface SelectProps {
  /** Compose with SelectOption components. */
  children: React.ReactNode;
  /** The currently selected value. */
  value: string;
  /** Called when the user selects an option. */
  onValueChange: (value: string) => void;
  /** Text shown when no value is selected. */
  placeholder?: string;
}`,
    correctSide: "right",
    explanationCorrect:
      "Compound components (`Select` + `SelectOption`) are more flexible than config objects. They support nesting, conditional rendering, custom content, and compose naturally with JSX. Adding icons or groups doesn't require changing the config type.\n\nThis is the pattern Radix UI, Headless UI, and React Aria all chose for Select. Note: for data-heavy, fixed-layout components (like data grids), config props can be the better choice.",
    explanationWrong:
      "Config arrays like `options: Array<{...}>` are rigid. Every new feature (icons, descriptions, groups, custom rendering) means extending the config type. Compound components let consumers compose freely with JSX.\n\nThat said, config props shine for data-driven components with fixed layouts (like MUI's DataGrid). For Select, where styling and accessibility customization matter, compound components are the industry standard.",
    sourceUrl: "https://react.dev/learn/thinking-in-react",
    sourceLabel: "React Docs: Thinking in React",
  },
  {
    id: "cp-004",
    category: "children-pattern",
    difficulty: "medium",
    title: "Customizing sub-components",
    badCode: `interface AutocompleteProps {
  options: string[];
  PaperComponent?: React.ElementType;
  PaperProps?: Record<string, unknown>;
  ListboxComponent?: React.ElementType;
  ListboxProps?: Record<string, unknown>;
  PopperComponent?: React.ElementType;
  PopperProps?: Record<string, unknown>;
}`,
    goodCode: `interface AutocompleteProps {
  options: string[];
  /**
   * Override internal sub-components and their props.
   * Each slot maps to an internal element.
   */
  slots?: {
    paper?: React.ElementType;
    listbox?: React.ElementType;
    popper?: React.ElementType;
  };
  slotProps?: {
    paper?: Record<string, unknown>;
    listbox?: Record<string, unknown>;
    popper?: Record<string, unknown>;
  };
}`,
    correctSide: "right",
    explanationCorrect:
      "Grouping overrides into `slots` and `slotProps` objects scales cleanly. Adding a new customizable element means adding one key to each object, not two new top-level props.\n\nThis is the pattern MUI adopted across all components, replacing the older `PaperComponent`/`PaperProps` pairs that cluttered the API.",
    explanationWrong:
      "Each sub-component needs two props (component + props), so three sub-components means six top-level props. A fourth sub-component adds two more. This doesn't scale. The `slots`/`slotProps` pattern groups all overrides into two structured objects, keeping the top-level API clean and discoverable.",
    sourceUrl:
      "https://mui.com/material-ui/customization/creating-themed-components/",
    sourceLabel: "MUI: Themed Components",
  },
  {
    id: "cp-003",
    category: "children-pattern",
    difficulty: "medium",
    title: "Named content slots",
    badCode: `interface CardProps {
  title: string;
  subtitle?: string;
  iconName?: string;
  actions?: string[];
  children: React.ReactNode;
  footerText?: string;
}`,
    goodCode: `interface CardProps {
  children: React.ReactNode;
  /** Content rendered in the card header. */
  header?: React.ReactNode;
  /** Action buttons rendered in the footer. */
  footer?: React.ReactNode;
  /** Icon shown before the header content. */
  icon?: React.ReactNode;
}`,
    correctSide: "right",
    explanationCorrect:
      "Slot props (`header`, `footer`, `icon` as `ReactNode`) let consumers pass anything: text, icons, buttons, or custom components. String-typed slots restrict you to plain text; `ReactNode` slots enable full composition.",
    explanationWrong:
      "String-typed props like `title: string` and `iconName?: string` limit what consumers can render. What if you need a bold title, an SVG icon, or action buttons in the footer? `ReactNode` slots give consumers full control over content and layout.",
    sourceUrl: "https://react.dev/learn/passing-props-to-a-component",
    sourceLabel: "React Docs: Passing Props",
  },
  {
    id: "cp-005",
    category: "children-pattern",
    difficulty: "easy",
    title: "Primary content as children",
    badCode: `interface PanelProps {
  title: string;
  content: React.ReactNode;
}

// Usage:
// <Panel
//   title="Settings"
//   content={<SettingsForm />}
// />`,
    goodCode: `interface PanelProps {
  title: string;
  children: React.ReactNode;
}

// Usage:
// <Panel title="Settings">
//   <SettingsForm />
// </Panel>`,
    correctSide: "right",
    explanationCorrect:
      "The primary content of a component should use `children`, not a named prop. This follows JSX composition conventions and lets consumers nest content naturally. Named slots like `header` or `footer` are for secondary content areas.",
    explanationWrong:
      "A `content` prop works, but it fights JSX conventions. `children` is the default slot for primary content, and it enables natural nesting `<Panel>...</Panel>` instead of the awkward `<Panel content={...} />`. Reserve named props for secondary content areas.",
    sourceUrl:
      "https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children",
    sourceLabel: "React Docs: Passing JSX as children",
  },
  {
    id: "cp-006",
    category: "children-pattern",
    difficulty: "easy",
    title: "Composition over prop drilling",
    badCode: `interface LayoutProps {
  userName: string;
  userAvatar: string;
  userRole: string;
  navItems: NavItem[];
  children: React.ReactNode;
}`,
    goodCode: `interface LayoutProps {
  /** Rendered in the sidebar area. */
  sidebar: React.ReactNode;
  /** Rendered in the top header area. */
  header: React.ReactNode;
  /** Main content area. */
  children: React.ReactNode;
}`,
    correctSide: "right",
    explanationCorrect:
      "Passing pre-rendered `ReactNode` slots avoids prop drilling. The Layout doesn't need to know about user data or nav items; it just renders whatever components the parent composes. If the sidebar design changes, only the parent's JSX changes, not the Layout props.",
    explanationWrong:
      "Passing raw data props forces the Layout to render user info and navigation internally. If you want a different avatar style or nav layout, you'd need to add more props or a `renderSidebar` function. `ReactNode` slots let the parent compose freely, keeping the Layout a pure layout shell.",
    sourceUrl:
      "https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children",
    sourceLabel: "React Docs: Passing JSX as children",
  },
  {
    id: "cp-007",
    category: "children-pattern",
    difficulty: "medium",
    title: "asChild composition pattern",
    badCode: `interface TooltipTriggerProps {
  /** The element to render as. */
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// Usage:
// <TooltipTrigger as="button"
//   className="my-btn">
//   Hover me
// </TooltipTrigger>`,
    goodCode: `interface TooltipTriggerProps {
  /**
   * Merge trigger behavior onto the child element
   * instead of wrapping in a <span>.
   * @default false
   */
  asChild?: boolean;
  children: React.ReactNode;
}

// Usage:
// <TooltipTrigger asChild>
//   <Button className="my-btn">
//     Hover me
//   </Button>
// </TooltipTrigger>`,
    correctSide: "right",
    explanationCorrect:
      "The `asChild` pattern (popularized by Radix UI) merges the component's behavior onto its child element rather than creating a wrapper. This avoids the DOM nesting issues and TypeScript complexity of the `as` prop.\n\nWith `as`, you lose the child component's own props and types. With `asChild`, the child keeps full control of its props, styling, and ref.",
    explanationWrong:
      "The `as` prop has two problems: TypeScript struggles to infer the correct props for the rendered element (is `onClick` from the trigger or from the button?), and it creates ambiguity about which component controls styling.\n\n`asChild` is simpler: the component merges its behavior (event handlers, ARIA attributes) onto whatever child you provide, keeping the child in full control of its own rendering.",
    sourceUrl: "https://www.radix-ui.com/primitives/docs/guides/composition",
    sourceLabel: "Radix UI: Composition",
  },
  {
    id: "cp-008",
    category: "children-pattern",
    difficulty: "hard",
    title: "Server Component children in client wrapper",
    badCode: `'use client';

interface TabPanelProps {
  /** Product data to render in each tab. */
  productData: {
    id: string;
    name: string;
    specs: Record<string, string>;
    reviews: Review[];
  };
  /** Tab labels for navigation. */
  labels: string[];
  /** @default 0 */
  defaultIndex?: number;
}`,
    goodCode: `'use client';

interface TabPanelProps {
  /** Each child is rendered as a tab panel. */
  children: React.ReactNode;
  /** Tab labels for navigation. */
  labels: string[];
  /** @default 0 */
  defaultIndex?: number;
}`,
    correctSide: "right",
    explanationCorrect:
      "The Client Component (`TabPanel`) only handles tab switching logic, and the actual content stays as Server Components passed through `children`. Product data never crosses the serialization boundary.\n\nThe bad version forces all product data into the Client Component, making every spec, review, and related product part of the client bundle.",
    explanationWrong:
      "Passing the entire `productData` object to a Client Component means serializing every field and shipping it to the client. The tab panel only needs to show/hide children, so it doesn't need to know about product data.\n\nUsing `children` as Server Component slots keeps data-heavy rendering on the server while the client handles only the interactive tab switching.",
    sourceUrl:
      "https://nextjs.org/docs/app/getting-started/server-and-client-components",
    sourceLabel: "Next.js: Server and Client Components",
  },
];
