import type { Challenge } from "../types";

export const jsdocChallenges: Challenge[] = [
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
      "This interface is clean and valid, but without JSDoc, developers must open the component source to learn what each prop does. A few seconds of documentation saves minutes of code reading for every future consumer.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html",
    sourceLabel: "TypeScript: JSDoc Reference",
  },
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
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html",
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
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html",
    sourceLabel: "TypeScript: JSDoc Reference",
  },
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
  {
    id: "jd-005",
    category: "jsdoc",
    difficulty: "easy",
    title: "Deprecation notice in JSDoc",
    badCode: `interface AccordionProps {
  // Don't use isOpen, use expanded instead
  isOpen?: boolean;
  expanded?: boolean;
  children: React.ReactNode;
  onToggle?: () => void;
}`,
    goodCode: `interface AccordionProps {
  /**
   * @deprecated Use \`isExpanded\` instead.
   * Will be removed in v3.0.
   */
  isOpen?: boolean;
  /** Whether the section is expanded. */
  isExpanded?: boolean;
  children: React.ReactNode;
  onToggle?: () => void;
}`,
    correctSide: "right",
    explanationCorrect:
      "The `@deprecated` JSDoc tag triggers a visual strikethrough in most IDEs and shows a warning on hover. It's machine-readable — linters can flag usage. A code comment is invisible at the call site and can't be enforced by tooling.",
    explanationWrong:
      "A plain comment above `isOpen` is only visible when reading the interface source. At the call site, `<Accordion isOpen />` shows no warning. The `@deprecated` tag surfaces warnings directly in the IDE, making migration discoverable without reading the component internals.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html",
    sourceLabel: "TypeScript: JSDoc Reference",
  },
];
