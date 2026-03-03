import type { Challenge } from "../types";

export const propSpecificityChallenges: Challenge[] = [
  {
    id: "ps-004",
    category: "prop-specificity",
    difficulty: "easy",
    title: "Variant type definition",
    badCode: `enum ButtonVariant {
  Primary = 'primary',
  Secondary = 'secondary',
  Danger = 'danger',
}

interface ButtonProps {
  label: string;
  variant: ButtonVariant;
}`,
    goodCode: `interface ButtonProps {
  label: string;
  variant: 'primary' | 'secondary' | 'danger';
}`,
    correctSide: "right",
    explanationCorrect:
      "String unions are preferred over enums in modern TypeScript. They're simpler, don't generate runtime code, and work naturally with string literals at call sites: `variant=\"primary\"` instead of `variant={ButtonVariant.Primary}`.",
    explanationWrong:
      "Enums generate runtime JavaScript objects, require imports everywhere they're used, and make call sites verbose. String unions achieve the same type safety with zero overhead and better ergonomics.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types",
    sourceLabel: "TypeScript: Union Types",
  },
  {
    id: "ps-005",
    category: "prop-specificity",
    difficulty: "easy",
    title: "Specific collection prop names",
    badCode: `interface UserListProps {
  data: User[];
  selected: string;
  onClick: (item: User) => void;
}`,
    goodCode: `interface UserListProps {
  users: User[];
  selectedUserId: string;
  onUserSelect: (user: User) => void;
}`,
    correctSide: "right",
    explanationCorrect:
      "Every prop is specific: `users` (not generic `data`), `selectedUserId` (not ambiguous `selected`), and `onUserSelect` (specifies what event occurred). Specific names eliminate guesswork.",
    explanationWrong:
      "`data` could be anything - users, products, orders. `selected` could be an ID, an index, a boolean, or a full object. `onClick` is too generic for item selection. Name each prop after what it actually contains.",
    sourceUrl: "https://react.dev/learn/passing-props-to-a-component",
    sourceLabel: "React Docs: Passing Props",
  },
  {
    id: "ps-006",
    category: "prop-specificity",
    difficulty: "medium",
    title: "Autocomplete prop naming",
    badCode: `interface AutocompleteProps {
  /** Available items. */
  items: string[];
  /** Current input value. */
  value: string;
  /** Called on value change. */
  onChange: (v: string) => void;
  /** Custom render function. */
  render: (item: string) => React.ReactNode;
  /** Shown when there are no results. */
  noResults: React.ReactNode;
}`,
    goodCode: `interface AutocompleteProps {
  /** Available suggestion items. */
  items: string[];
  /** The current input value. */
  value: string;
  /** Called when the input value changes. */
  onValueChange: (value: string) => void;
  /** Custom render function for each suggestion item. */
  renderItem: (item: string) => React.ReactNode;
  /** Content displayed when no items match. */
  emptyContent: React.ReactNode;
}`,
    correctSide: "right",
    explanationCorrect:
      "Every prop is specific: `renderItem` (not vague `render`), `emptyContent` (not the double-negative `noResults`), `onValueChange` (not generic `onChange`), and parameter names spell out their meaning (`value` not `v`).",
    explanationWrong:
      "`render` renders what? `noResults` is a confusing name — does `false` mean 'there are results' or 'don't show the no-results state'? `onChange` with `v` forces you to read the type to understand the callback. Specific names eliminate this guesswork.",
    sourceUrl: "https://react.dev/learn/passing-props-to-a-component",
    sourceLabel: "React Docs: Passing Props",
  },
  {
    id: "ps-001",
    category: "prop-specificity",
    difficulty: "medium",
    title: "Color prop typing",
    badCode: `interface AvatarProps {
  name: string;
  color: string;
}`,
    goodCode: `interface AvatarProps {
  name: string;
  backgroundColor: \`#\${string}\` | 'currentColor';
}`,
    correctSide: "right",
    explanationCorrect:
      "Two improvements: `backgroundColor` specifies *which* color (not text, not border), and the template literal type narrows valid inputs to hex strings at compile time. Even just the rename from `color` to `backgroundColor` is a big clarity win.",
    explanationWrong:
      "`color` could mean text color, background color, or border color - it's ambiguous. Rename to be specific (`backgroundColor`). The template literal type is a bonus - it narrows `string` to only accept hex color values.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html",
    sourceLabel: "TypeScript: Template Literal Types",
  },
  {
    id: "ps-002",
    category: "prop-specificity",
    difficulty: "medium",
    title: "Size prop typing",
    badCode: `interface IconProps {
  name: string;
  size: number;
}`,
    goodCode: `interface IconProps {
  name: string;
  size: 'sm' | 'md' | 'lg' | 'xl';
}`,
    correctSide: "right",
    explanationCorrect:
      "Union types for size are predictable and discoverable in IDE autocomplete. A raw number could be anything - pixels? rem? percentage?",
    explanationWrong:
      "`size: number` has no units, no bounds, and no discoverability. A union like `'sm' | 'md' | 'lg' | 'xl'` constrains valid values and lights up autocomplete.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types",
    sourceLabel: "TypeScript: Union Types",
  },
  {
    id: "ps-007",
    category: "prop-specificity",
    difficulty: "medium",
    title: "Accessible text prop conventions",
    badCode: `interface AutocompleteProps<T> {
  options: T[];
  value: T | null;
  onChange: (value: T | null) => void;
  placeholder?: string;
  /** @default "Clear all" */
  clearLabel?: string;
  /** @default "Toggle menu" */
  toggleLabel?: string;
  /** @default "Nothing found" */
  emptyMessage?: string;
  /** @default "Please wait..." */
  pendingMessage?: string;
}`,
    goodCode: `interface AutocompleteProps<T> {
  options: T[];
  value: T | null;
  onChange: (value: T | null) => void;
  placeholder?: string;
  /** Label for the clear button. @default "Clear" */
  clearText?: string;
  /** Label for the open popup button. @default "Open" */
  openText?: string;
  /** Label for the close popup button. @default "Close" */
  closeText?: string;
  /** Text shown when no options match. @default "No options" */
  noOptionsText?: React.ReactNode;
  /** Text shown while loading. @default "Loading…" */
  loadingText?: React.ReactNode;
}`,
    correctSide: "right",
    explanationCorrect:
      "Consistent `*Text` suffixes make the API predictable. Separate `openText`/`closeText` props (not a single `toggleLabel`) match the actual UI states. `React.ReactNode` for displayed messages allows rich formatting. MUI's Autocomplete uses this exact pattern — every interactive element and user-facing string gets a `*Text` prop with a sensible default.",
    explanationWrong:
      "Inconsistent suffixes (`*Label` vs `*Message`) make the API confusing. A single `toggleLabel` for both open and close states means the label can't say 'Open' when closed and 'Close' when open. `emptyMessage` and `pendingMessage` use non-standard naming — MUI's convention is `noOptionsText` and `loadingText`, matching what the user actually sees.",
    sourceUrl: "https://mui.com/material-ui/api/autocomplete/",
    sourceLabel: "MUI: Autocomplete API",
  },
  {
    id: "ps-003",
    category: "prop-specificity",
    difficulty: "hard",
    title: "Complete component API",
    badCode: `interface TableColumn {
  /** Column identifier for sorting. */
  name: string;
  /** Display header text. */
  label: string;
}

interface TableProps {
  /** Row data. */
  data: object[];
  /** Column definitions. */
  columns: TableColumn[];
  /** Enable row selection. */
  isSelectable?: boolean;
  /** Called when selection changes. */
  onSelect?: Function;
  /** Current page number. */
  page?: number;
  /** Called when page changes. */
  onPageChange?: Function;
  /** Active filter query. */
  filter?: string;
  /** Called when filter changes. */
  onFilterChange?: Function;
  /** Whether data is loading. */
  isLoading?: boolean;
}`,
    goodCode: `interface TableColumn<T> {
  /** Unique key matching a property of T. */
  key: keyof T;
  /** Display header label. */
  label: string;
  /** Whether this column is sortable. @default false */
  isSortable?: boolean;
}

interface TableProps<T extends Record<string, unknown>> {
  /** The row data to display. */
  data: T[];
  /** Column configuration objects. */
  columns: TableColumn<T>[];
  /** Called when selected rows change. */
  onSelectionChange?: (rows: T[]) => void;
  /** Called when the page changes. */
  onPageChange?: (page: number) => void;
  /** Called when the filter query changes. */
  onFilterChange?: (query: string) => void;
  /** Whether data is currently being fetched. */
  isLoading?: boolean;
}`,
    correctSide: "right",
    explanationCorrect:
      "Generics make `columns` and callbacks type-safe: `key: keyof T` ensures column keys match the data shape, and callbacks receive typed values instead of `Function`. `isSortable` lives on each column (not the whole table), and selection/pagination use typed event callbacks — not a mix of state props and untyped setters.",
    explanationWrong:
      "`object[]` loses all type information — TypeScript can't check if column `name` values match data properties. `Function` is effectively `any` for callbacks — no parameter or return type checking. Mixing state props (`page`, `filter`) with callbacks leaks internal state management. Generics and typed callbacks fix all three issues.",
    sourceUrl: "https://www.typescriptlang.org/docs/handbook/2/generics.html",
    sourceLabel: "TypeScript: Generics",
  },
];
