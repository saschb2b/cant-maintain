import type { Challenge } from "../types";

export const childrenPatternChallenges: Challenge[] = [
  {
    id: "cp-001",
    category: "children-pattern",
    difficulty: "hard",
    title: "Render prop typing",
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
      "Generics (`<T>`) preserve type safety through the render function. `renderItem` is more specific than `render`, and `emptyState` is clearer than `empty`. No `any` in sight!",
    explanationWrong:
      "`any` destroys all type safety. `render` is vague (render what?). `empty` could be a boolean, a string, or a component. Use generics, specific names, and proper React types.",
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
];
