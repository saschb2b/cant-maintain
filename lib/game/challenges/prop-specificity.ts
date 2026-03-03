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
    id: "ps-003",
    category: "prop-specificity",
    difficulty: "hard",
    title: "Complete component API",
    badCode: `interface TableProps {
  data: object[];
  columns: string[];
  sort: boolean;
  select: boolean;
  onSelect: Function;
  page: number;
  setPage: Function;
  filter: string;
  setFilter: Function;
  loading: boolean;
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
      "This is production-grade API design. Generic types, structured column config, `on*` event callbacks instead of setter functions, and `isLoading` boolean. No `Function` type, no `object[]`, no `string[]` columns.",
    explanationWrong:
      "Multiple issues: `Function` type is unsafe, `object[]` has no shape, `string[]` columns lose structure, `set*` callbacks imply child state ownership, `loading` is an ambiguous boolean, and `sort`/`select` could be nouns or verbs.",
    sourceUrl: "https://www.typescriptlang.org/docs/handbook/2/generics.html",
    sourceLabel: "TypeScript: Generics",
  },
];
