import type { Challenge } from "./types";

/**
 * All challenges for the game.
 *
 * HOW TO ADD A NEW CHALLENGE:
 * 1. Pick a unique `id` with the category prefix (cb=callback, bl=boolean, jd=jsdoc, ps=prop-specificity, rp=render-props, cp=children-pattern, du=discriminated-unions).
 * 2. Write `badCode` and `goodCode` as template literal strings.
 * 3. Set `correctSide` to "left" or "right" - the game randomizes this at runtime anyway.
 * 4. Write both explanations (correct + wrong). Keep them concise but educational.
 * 5. Link to an authoritative source.
 * 6. Push the object into this array. Difficulty sorting happens automatically.
 */
export const challenges: Challenge[] = [
  // ─── EASY: Callback Naming ─────────────────────────────────────
  {
    id: "cb-001",
    category: "callback-naming",
    difficulty: "easy",
    title: "Value change handler",
    badCode: `interface SliderProps {
  value: number;
  setValue: (v: number) => void;
}`,
    goodCode: `interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
}`,
    correctSide: "right",
    explanationCorrect:
      'Correct! Child components don\'t "set" state - they signal that something changed. The `on` prefix followed by what happened (`ValueChange`) is the React convention. This mirrors native DOM events like `onChange` and `onClick`.',
    explanationWrong:
      '`setValue` implies the child owns and mutates state directly. In React, data flows down and events flow up. Use `onValueChange` to signal "this value changed" - the parent decides what to do with it.',
    sourceUrl: "https://react.dev/learn/responding-to-events",
    sourceLabel: "React Docs: Responding to Events",
  },
  {
    id: "cb-002",
    category: "callback-naming",
    difficulty: "easy",
    title: "Delete action handler",
    badCode: `interface TodoItemProps {
  todo: Todo;
  delete: () => void;
}`,
    goodCode: `interface TodoItemProps {
  todo: Todo;
  onDelete: () => void;
}`,
    correctSide: "right",
    explanationCorrect:
      "Correct! `onDelete` clearly communicates this is an event callback. The component requests deletion - the parent performs it.",
    explanationWrong:
      '`delete` is a reserved word in JavaScript and reads as an imperative command. Using `onDelete` follows the event handler convention and clearly signals "call me when delete is requested."',
    sourceUrl: "https://react.dev/learn/responding-to-events#naming-event-handler-props",
    sourceLabel: "React Docs: Naming event handler props",
  },
  {
    id: "cb-003",
    category: "callback-naming",
    difficulty: "easy",
    title: "Form submission",
    badCode: `interface SearchBarProps {
  query: string;
  search: (q: string) => void;
}`,
    goodCode: `interface SearchBarProps {
  query: string;
  onSearch: (query: string) => void;
}`,
    correctSide: "right",
    explanationCorrect:
      "Well spotted! `onSearch` is an event callback that says 'the user triggered a search.' The parent handles the actual search logic.",
    explanationWrong:
      "`search` reads like the component performs the search itself. With `onSearch`, it's clear the component only notifies the parent that a search was requested. Also note: the parameter is named `query` instead of the cryptic `q`.",
    sourceUrl: "https://react.dev/learn/responding-to-events",
    sourceLabel: "React Docs: Responding to Events",
  },

  // ─── EASY: Boolean Naming ──────────────────────────────────────
  {
    id: "bl-001",
    category: "boolean-naming",
    difficulty: "easy",
    title: "Loading state prop",
    badCode: `interface ButtonProps {
  text: string;
  loading: boolean;
}`,
    goodCode: `interface ButtonProps {
  text: string;
  isLoading: boolean;
}`,
    correctSide: "right",
    explanationCorrect:
      "Correct! Boolean props should read as a yes/no question: 'Is it loading?' The `is` prefix makes the type obvious at the call site without checking the definition.",
    explanationWrong:
      "Without a prefix like `is`, `has`, or `should`, it's ambiguous whether `loading` is a boolean, a loading state enum, or a loading message. `isLoading` is self-documenting.",
    sourceUrl:
      "https://react.dev/learn/passing-props-to-a-component",
    sourceLabel: "React Docs: Passing Props to a Component",
  },
  {
    id: "bl-002",
    category: "boolean-naming",
    difficulty: "easy",
    title: "Visibility toggle",
    badCode: `interface ModalProps {
  children: React.ReactNode;
  open: boolean;
  close: () => void;
}`,
    goodCode: `interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}`,
    correctSide: "right",
    explanationCorrect:
      "Two for one! `isOpen` is a clear boolean (is it open?), and `onClose` is a proper event callback (call me when close is requested).",
    explanationWrong:
      "`open` could be confused with a verb (an action to open) or a boolean. `close` is an imperative command. Use `isOpen` for the state and `onClose` for the event.",
    sourceUrl: "https://react.dev/learn/responding-to-events",
    sourceLabel: "React Docs: Responding to Events",
  },

  // ─── MEDIUM: Callback Naming (more subtle) ────────────────────
  {
    id: "cb-004",
    category: "callback-naming",
    difficulty: "medium",
    title: "Selection handler specificity",
    badCode: `interface DropdownProps {
  items: string[];
  onChange: (item: string) => void;
}`,
    goodCode: `interface DropdownProps {
  items: string[];
  onItemSelect: (item: string) => void;
}`,
    correctSide: "right",
    explanationCorrect:
      "Nice! `onItemSelect` is more specific than `onChange`. It tells you exactly what event occurred - an item was selected. `onChange` is vague and could mean anything changed.",
    explanationWrong:
      "`onChange` is fine for native inputs, but for custom components it's too generic. `onItemSelect` describes the exact event: the user selected an item. Be specific about what changed.",
    sourceUrl: "https://react.dev/learn/responding-to-events#naming-event-handler-props",
    sourceLabel: "React Docs: Naming event handler props",
  },
  {
    id: "cb-005",
    category: "callback-naming",
    difficulty: "medium",
    title: "Drag and drop callbacks",
    badCode: `interface DraggableProps {
  children: React.ReactNode;
  dragStart: () => void;
  dragEnd: (pos: Position) => void;
  drop: (target: string) => void;
}`,
    goodCode: `interface DraggableProps {
  children: React.ReactNode;
  onDragStart: () => void;
  onDragEnd: (position: Position) => void;
  onDrop: (targetId: string) => void;
}`,
    correctSide: "right",
    explanationCorrect:
      "All three callbacks use the `on` prefix and descriptive parameter names (`position` vs `pos`, `targetId` vs `target`). Consistent naming across related events is key.",
    explanationWrong:
      "Without `on` prefixes, these look like imperative methods. `pos` and `target` are ambiguous shorthand - `position` and `targetId` are self-documenting.",
    sourceUrl: "https://react.dev/learn/responding-to-events",
    sourceLabel: "React Docs: Responding to Events",
  },

  // ─── MEDIUM: Prop Specificity ──────────────────────────────────
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
      "Excellent! `color` is vague (text color? bg color? border?), and `string` accepts invalid values. `backgroundColor` with a template literal type is precise and type-safe.",
    explanationWrong:
      "`color` doesn't say which color (text, background, border?) and `string` accepts anything. Be explicit with `backgroundColor` and narrow the type for safety.",
    sourceUrl: "https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html",
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
    sourceUrl: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types",
    sourceLabel: "TypeScript: Union Types",
  },

  // ─── MEDIUM: JSDoc ─────────────────────────────────────────────
  {
    id: "jd-001",
    category: "jsdoc",
    difficulty: "medium",
    title: "Component documentation",
    badCode: `interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  delay?: number;
}`,
    goodCode: `interface TooltipProps {
  /** The text content displayed inside the tooltip. */
  content: string;
  /** The element that triggers the tooltip on hover. */
  children: React.ReactNode;
  /**
   * Where the tooltip appears relative to the trigger.
   * @default 'top'
   */
  position?: 'top' | 'bottom';
  /**
   * Delay in milliseconds before the tooltip appears.
   * @default 200
   */
  delay?: number;
}`,
    correctSide: "right",
    explanationCorrect:
      "JSDoc comments appear in IDE hover tooltips, making your component self-documenting. Noting `@default` values for optional props is especially valuable - no need to read the implementation.",
    explanationWrong:
      "Without JSDoc, every consumer of this component must read the source to understand what `delay` means (seconds? ms?), what happens without `position`, and what `content` actually renders.",
    sourceUrl: "https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html",
    sourceLabel: "TypeScript: JSDoc Reference",
  },
  {
    id: "jd-002",
    category: "jsdoc",
    difficulty: "medium",
    title: "Callback prop documentation",
    badCode: `interface DataTableProps<T> {
  data: T[];
  onRowClick?: (row: T) => void;
  onSort?: (col: string) => void;
}`,
    goodCode: `interface DataTableProps<T> {
  /** The array of data objects to render as rows. */
  data: T[];
  /**
   * Called when a row is clicked.
   * Receives the full data object for the clicked row.
   */
  onRowClick?: (row: T) => void;
  /**
   * Called when a column header is clicked for sorting.
   * Receives the column key that was clicked.
   */
  onSort?: (columnKey: string) => void;
}`,
    correctSide: "right",
    explanationCorrect:
      "Documenting callbacks is crucial: what triggers them, and what the parameters represent. Notice `columnKey` is also more descriptive than `col`.",
    explanationWrong:
      "Undocumented callbacks force consumers to guess: When is `onSort` called? What does the `col` string represent - a column name, index, or key? JSDoc eliminates the guesswork.",
    sourceUrl: "https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html",
    sourceLabel: "TypeScript: JSDoc Reference",
  },

  // ─── HARD: Boolean + JSDoc combined ────────────────────────────
  {
    id: "bl-003",
    category: "boolean-naming",
    difficulty: "hard",
    title: "Complex boolean props",
    badCode: `interface NavigationProps {
  items: NavItem[];
  collapsed: boolean;
  icons: boolean;
  mobile: boolean;
}`,
    goodCode: `interface NavigationProps {
  items: NavItem[];
  /**
   * Whether the navigation is in collapsed (icon-only) mode.
   * @default false
   */
  isCollapsed: boolean;
  /**
   * Whether to show icons alongside labels.
   * @default true
   */
  hasIcons: boolean;
  /**
   * Whether the component renders in mobile viewport layout.
   * @default false
   */
  isMobile: boolean;
}`,
    correctSide: "right",
    explanationCorrect:
      'Full marks! Three patterns at once: `is` for state booleans, `has` for feature booleans, and JSDoc with `@default` for every optional prop. `<Navigation hasIcons isMobile />` reads like English.',
    explanationWrong:
      '`collapsed` - is this a verb or adjective? `icons` - a boolean or an array of icons? `mobile` - a phone number? Each prop is ambiguous. Prefix booleans with `is`/`has`/`should` and document defaults.',
    sourceUrl:
      "https://react.dev/learn/passing-props-to-a-component",
    sourceLabel: "React Docs: Passing Props to a Component",
  },

  // ─── HARD: JSDoc with @example ─────────────────────────────────
  {
    id: "jd-003",
    category: "jsdoc",
    difficulty: "hard",
    title: "JSDoc with usage examples",
    badCode: `// Renders a confirmation dialog
interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'info' | 'danger';
}`,
    goodCode: `/**
 * A modal dialog that asks the user to confirm
 * or cancel a destructive action.
 *
 * @example
 * <ConfirmDialog
 *   title="Delete project?"
 *   message="This cannot be undone."
 *   variant="danger"
 *   onConfirm={handleDelete}
 *   onCancel={handleDismiss}
 * />
 */
interface ConfirmDialogProps {
  /** The heading text of the dialog. */
  title: string;
  /** The body message explaining the action. */
  message: string;
  /** Called when the user clicks the confirm button. */
  onConfirm: () => void;
  /** Called when the user dismisses or cancels. */
  onCancel: () => void;
  /**
   * Visual style of the dialog.
   * Use \`'danger'\` for destructive actions.
   * @default 'info'
   */
  variant?: 'info' | 'danger';
}`,
    correctSide: "right",
    explanationCorrect:
      "The `@example` tag in JSDoc shows up directly in your IDE on hover. New developers can see exactly how to use the component without searching the codebase for usage patterns.",
    explanationWrong:
      "A single-line comment above the interface is almost useless. JSDoc with `@example` gives IDE-integrated documentation, showing developers exactly how to use the component with realistic prop values.",
    sourceUrl: "https://jsdoc.app/tags-example",
    sourceLabel: "JSDoc: @example tag",
  },

  // ─── HARD: Discriminated Unions ────────────────────────────────
  {
    id: "du-001",
    category: "discriminated-unions",
    difficulty: "hard",
    title: "Variant-dependent props",
    badCode: `interface AlertProps {
  type: 'success' | 'error' | 'warning';
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  onDismiss?: () => void;
  autoDismissMs?: number;
}`,
    goodCode: `type AlertProps =
  | {
      /** Shown on successful operations. Auto-dismisses. */
      type: 'success';
      message: string;
      /**
       * Time in ms before the alert auto-dismisses.
       * @default 3000
       */
      autoDismissMs?: number;
    }
  | {
      /** Shown on failed operations. Offers a retry. */
      type: 'error';
      message: string;
      /** Called when the user clicks the retry button. */
      onRetry: () => void;
      /** Label for the retry button. @default "Try again" */
      retryLabel?: string;
    }
  | {
      /** Shown for non-critical issues. Can be dismissed. */
      type: 'warning';
      message: string;
      /** Called when the user dismisses the warning. */
      onDismiss: () => void;
    };`,
    correctSide: "right",
    explanationCorrect:
      "Discriminated unions ensure that `onRetry` is only required (and allowed) when `type` is `'error'`. TypeScript catches impossible combinations at compile time. No more 'why is retryLabel set on a success alert?' bugs.",
    explanationWrong:
      "The flat interface makes every optional prop available for every variant. Nothing stops you from passing `onRetry` to a success alert. Discriminated unions tie props to their specific variant, giving you compile-time safety.",
    sourceUrl: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions",
    sourceLabel: "TypeScript: Discriminated Unions",
  },

  // ─── HARD: Children pattern ────────────────────────────────────
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
    sourceUrl: "https://react.dev/reference/react/Children",
    sourceLabel: "React Docs: React Children",
  },

  // ─── HARD: Full API design ─────────────────────────────────────
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
      'This is production-grade API design. Generic types, structured column config, `on*` event callbacks instead of setter functions, and `isLoading` boolean. No `Function` type, no `object[]`, no `string[]` columns.',
    explanationWrong:
      "Multiple issues: `Function` type is unsafe, `object[]` has no shape, `string[]` columns lose structure, `set*` callbacks imply child state ownership, `loading` is an ambiguous boolean, and `sort`/`select` could be nouns or verbs.",
    sourceUrl: "https://www.typescriptlang.org/docs/handbook/2/generics.html",
    sourceLabel: "TypeScript: Generics",
  },

  // ─── EASY: JSDoc basics ────────────────────────────────────────
  {
    id: "jd-004",
    category: "jsdoc",
    difficulty: "easy",
    title: "Simple prop documentation",
    badCode: `interface BadgeProps {
  label: string;
  variant: 'default' | 'success' | 'warning';
}`,
    goodCode: `interface BadgeProps {
  /** The text displayed inside the badge. */
  label: string;
  /**
   * The visual style variant of the badge.
   * @default 'default'
   */
  variant: 'default' | 'success' | 'warning';
}`,
    correctSide: "right",
    explanationCorrect:
      "Even simple props benefit from JSDoc. When another developer hovers over `variant` in their IDE, they instantly see what it does and what the default is.",
    explanationWrong:
      "Without JSDoc, developers must open the component source to learn what each prop does. A few seconds of documentation saves minutes of code reading for every future consumer.",
    sourceUrl: "https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html",
    sourceLabel: "TypeScript: JSDoc Reference",
  },

  // ─── MEDIUM: Render prop naming ────────────────────────────────
  {
    id: "rp-001",
    category: "render-props",
    difficulty: "medium",
    title: "Render prop naming",
    badCode: `interface AutocompleteProps {
  items: string[];
  value: string;
  onChange: (v: string) => void;
  render: (item: string) => React.ReactNode;
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
      "Every prop clearly communicates its purpose: `renderItem` (not `render`), `emptyContent` (not `noResults`), and `onValueChange` (not `onChange` with `v`).",
    explanationWrong:
      "`render` renders what? `noResults` is a double negative. `onChange` with `v` is vague. Each prop should be specific about what it represents and what it does.",
    sourceUrl: "https://react.dev/reference/react/cloneElement#alternatives",
    sourceLabel: "React Docs: Alternatives to cloneElement",
  },
];
