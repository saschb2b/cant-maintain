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
  /** The content. */
  content: string;
  /** The children. */
  children: React.ReactNode;
  /** The position. */
  position?: 'top' | 'bottom';
  /** The delay. */
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
      "Good JSDoc explains *what* a prop does and documents defaults. 'The text content displayed inside the tooltip' is useful; 'The content' just repeats the prop name. The `@default` tags on optional props are especially valuable — no need to read the implementation to know the fallback.",
    explanationWrong:
      "JSDoc that just restates the prop name ('The delay', 'The position') adds noise, not clarity. Compare: 'The delay' tells you nothing about the unit or default. 'Delay in milliseconds before the tooltip appears. @default 200' answers every question a consumer would have.",
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
  /** The data to display. */
  data: T[];
  /** Handler for row clicks. */
  onRowClick?: (row: T) => void;
  /** Handler for sorting. */
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
      "Good callback documentation explains *when* the callback fires and *what* the parameters represent. 'Called when a column header is clicked for sorting' tells you the trigger. The rename from `col` to `columnKey` reinforces clarity. Compare 'Handler for sorting' — that just restates the prop name.",
    explanationWrong:
      "JSDoc like 'Handler for sorting' tells you nothing you can't already see from `onSort`. Good documentation answers the questions developers actually have: *when* is it called (on header click), *what* does the parameter represent (the column key, not an index or label). The rename from `col` to `columnKey` also helps — parameter names are documentation too.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html",
    sourceLabel: "TypeScript: JSDoc Reference",
  },
  {
    id: "jd-003",
    category: "jsdoc",
    difficulty: "hard",
    title: "Realistic JSDoc examples",
    badCode: `/**
 * A confirmation dialog component.
 *
 * @example
 * <ConfirmDialog
 *   title="Title"
 *   message="Message"
 *   onConfirm={handleConfirm}
 *   onCancel={handleCancel}
 * />
 */
interface ConfirmDialogProps {
  /** The title. */
  title: string;
  /** The message. */
  message: string;
  /** Confirm handler. */
  onConfirm: () => void;
  /** Cancel handler. */
  onCancel: () => void;
  /** The variant. */
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
      "A good `@example` uses realistic prop values that show how the component is *actually* used. `title=\"Delete project?\"` and `variant=\"danger\"` paint a real scenario. Prop-level JSDoc explains purpose, not just the name: 'The heading text of the dialog' vs 'The title.'",
    explanationWrong:
      "Both have `@example` blocks, but generic placeholders like `title=\"Title\"` defeat the purpose. An example should teach by showing a real use case — what kind of message goes here, which variant to pick. Prop-level JSDoc like 'The title' also just restates the name. Compare 'The heading text of the dialog' which tells you it renders as a heading.",
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
