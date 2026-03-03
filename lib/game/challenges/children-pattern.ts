import type { Challenge } from "../types";

export const childrenPatternChallenges: Challenge[] = [
  {
    id: "cp-001",
    category: "children-pattern",
    difficulty: "hard",
    title: "Generic list component",
    badCode: `interface ListProps {
  data: any[];
  render: (item: any) => any;
  empty: any;
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
      "Generics (`<T>`) make `renderItem` type-safe: if `data` is `User[]`, the callback receives `User` - no casting needed. `renderItem` is specific (not vague `render`), `emptyState` is a `ReactNode` slot (not mystery `any`), and `React.ReactNode` is the correct return type for anything renderable.",
    explanationWrong:
      "Five uses of `any` means zero type safety. If `data` is `User[]`, `render` still receives `any` - you've lost the connection between input and output types. Generics preserve that link. Beyond types, `render` (of what?) and `empty` (boolean? string? component?) are ambiguously named.",
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
      "Compound components (Select + SelectOption) are more flexible than config objects. They support nesting, conditional rendering, custom content, and compose naturally with JSX. Adding icons or groups doesn't require changing the config type.",
    explanationWrong:
      "Config arrays like `options: Array<{...}>` are rigid. Every new feature (icons, descriptions, groups, custom rendering) means extending the config type. Compound components let consumers compose freely with JSX - the React way.",
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
      "Grouping overrides into `slots` and `slotProps` objects scales cleanly. Adding a new customizable element means adding one key to each object - not two new top-level props. This is the pattern MUI adopted across all components, replacing the older `PaperComponent`/`PaperProps` pairs that cluttered the API.",
    explanationWrong:
      "Each sub-component needs two props (component + props), so three sub-components means six top-level props. A fourth sub-component adds two more. This doesn't scale. The `slots`/`slotProps` pattern groups all overrides into two structured objects, keeping the top-level API clean and discoverable.",
    sourceUrl: "https://mui.com/material-ui/customization/creating-themed-components/",
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
      "Slot props (`header`, `footer`, `icon` as `ReactNode`) let consumers pass anything - text, icons, buttons, or custom components. String-typed slots restrict you to plain text; `ReactNode` slots enable full composition, which is the React way.",
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
      "A `content` prop works, but it fights JSX conventions. `children` is the default slot for primary content — it enables natural nesting `<Panel>...</Panel>` instead of the awkward `<Panel content={...} />`. Reserve named props for secondary content areas.",
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
      "Passing pre-rendered `ReactNode` slots avoids prop drilling. The Layout doesn't need to know about user data or nav items — it just renders whatever components the parent composes. If the sidebar design changes, only the parent's JSX changes, not the Layout props.",
    explanationWrong:
      "Passing raw data props forces the Layout to render user info and navigation internally. If you want a different avatar style or nav layout, you'd need to add more props or a `renderSidebar` function. `ReactNode` slots let the parent compose freely, keeping the Layout a pure layout shell.",
    sourceUrl:
      "https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children",
    sourceLabel: "React Docs: Passing JSX as children",
  },
];
