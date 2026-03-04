import type { Challenge } from "../types";

export const renderPropsChallenges: Challenge[] = [
  {
    id: "rp-001",
    category: "render-props",
    difficulty: "medium",
    title: "Render function vs ReactNode slot",
    badCode: `interface ComboboxProps<T> {
  options: T[];
  value: T | null;
  onChange: (value: T) => void;
  /** Custom option display. */
  optionContent?: React.ReactNode;
}

// Usage:
// <Combobox
//   options={users}
//   optionContent={<UserCard />}
// />`,
    goodCode: `interface ComboboxProps<T> {
  options: T[];
  value: T | null;
  onChange: (value: T) => void;
  /** Custom option rendering with state. */
  renderOption?: (
    option: T,
    state: { isHighlighted: boolean; isSelected: boolean },
  ) => React.ReactNode;
}

// Usage:
// <Combobox
//   options={users}
//   renderOption={(user, { isHighlighted }) => (
//     <UserCard user={user} highlighted={isHighlighted} />
//   )}
// />`,
    correctSide: "right",
    explanationCorrect:
      "A render function gives the consumer access to runtime data the component owns. Here, the Combobox knows which option is highlighted and selected. A static `ReactNode` can't receive these states, so custom options can't react to keyboard navigation or selection.\n\nThis is exactly how MUI's Autocomplete `renderOption` works.",
    explanationWrong:
      "A `ReactNode` slot works for static content, but each option in a Combobox has runtime state: is it highlighted? Selected? With `optionContent: ReactNode`, every option renders identically. A render function passes per-option data so the consumer can style highlighted and selected states differently.",
    sourceUrl: "https://mui.com/material-ui/api/autocomplete/",
    sourceLabel: "MUI: Autocomplete API",
  },
  {
    id: "rp-002",
    category: "render-props",
    difficulty: "easy",
    title: "render* vs get* function props",
    badCode: `interface AutocompleteProps<T> {
  options: T[];
  /** Returns the display label for an option. */
  renderLabel: (option: T) => string;
  /** Renders a custom option in the dropdown. */
  getOption: (option: T) => React.ReactNode;
}`,
    goodCode: `interface AutocompleteProps<T> {
  options: T[];
  /** Returns the display label for an option. */
  getOptionLabel: (option: T) => string;
  /** Renders a custom option in the dropdown. */
  renderOption: (option: T) => React.ReactNode;
}`,
    correctSide: "right",
    explanationCorrect:
      "`render*` functions return JSX (`React.ReactNode`); they control what appears on screen. `get*` functions return data (strings, numbers, booleans); they extract or compute values.\n\nMUI follows this strictly: `renderOption` returns JSX for the dropdown, `getOptionLabel` returns a plain string for the input field. Swapping the prefixes reverses the reader's expectation.",
    explanationWrong:
      "The prefixes are swapped. `renderLabel` implies it returns JSX, but it returns a `string`; that's a `get*` function. `getOption` implies it extracts data, but it returns JSX; that's a `render*` function. Match the prefix to the return type: `get*` for data, `render*` for UI.",
    sourceUrl: "https://mui.com/material-ui/api/autocomplete/",
    sourceLabel: "MUI: Autocomplete API",
  },
  {
    id: "rp-003",
    category: "render-props",
    difficulty: "easy",
    title: "Static slot vs unnecessary render function",
    badCode: `interface EmptyStateProps {
  renderIcon: () => React.ReactNode;
  renderTitle: () => React.ReactNode;
  renderAction: () => React.ReactNode;
}

// Usage:
// <EmptyState
//   renderIcon={() => <SearchIcon />}
//   renderTitle={() => "No results found"}
//   renderAction={() => <Button>Reset</Button>}
// />`,
    goodCode: `interface EmptyStateProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  action?: React.ReactNode;
}

// Usage:
// <EmptyState
//   icon={<SearchIcon />}
//   title="No results found"
//   action={<Button>Reset</Button>}
// />`,
    correctSide: "right",
    explanationCorrect:
      "Render functions are only needed when the component passes data back to the consumer. Here, EmptyState doesn't provide any data; it just displays content. Plain `ReactNode` slots are simpler: `icon={<SearchIcon />}` vs `renderIcon={() => <SearchIcon />}`.",
    explanationWrong:
      "These render functions take no arguments and return JSX; they're just `ReactNode` with extra ceremony. `renderIcon={() => <SearchIcon />}` creates a new function on every render for no benefit.\n\nUse `icon={<SearchIcon />}` instead. Reserve `render*` for when the component passes runtime data to the callback.",
    sourceUrl:
      "https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children",
    sourceLabel: "React Docs: Passing JSX as children",
  },
  {
    id: "rp-004",
    category: "render-props",
    difficulty: "medium",
    title: "Error boundary fallback",
    badCode: `interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

// Usage:
// <ErrorBoundary
//   fallback={<p>Something went wrong</p>}
// >
//   <App />
// </ErrorBoundary>`,
    goodCode: `interface ErrorBoundaryProps {
  children: React.ReactNode;
  renderFallback: (
    error: Error,
    reset: () => void,
  ) => React.ReactNode;
}

// Usage:
// <ErrorBoundary renderFallback={(error, reset) => (
//   <div>
//     <p>{error.message}</p>
//     <button onClick={reset}>Try again</button>
//   </div>
// )}>
//   <App />
// </ErrorBoundary>`,
    correctSide: "right",
    explanationCorrect:
      "A render function gives the fallback access to the actual `Error` and a `reset` function. A static `ReactNode` can't show the error message or offer a retry button. Use `render*` when the component has runtime data the consumer needs.",
    explanationWrong:
      "A static `fallback` works for generic error messages, but it can't show what went wrong or let the user retry. The Error Boundary knows the error and can reset itself, and a `renderFallback` callback passes this context to the consumer.",
    sourceUrl:
      "https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary",
    sourceLabel: "React Docs: Error Boundaries",
  },
  {
    id: "rp-005",
    category: "render-props",
    difficulty: "hard",
    title: "Scoped render props vs broad state exposure",
    badCode: `interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  /**
   * Full render control. Receives all
   * internal table state.
   */
  children: (state: {
    rows: T[];
    sortedBy: keyof T | null;
    sortDir: 'asc' | 'desc';
    page: number;
    pageCount: number;
    selectedRows: Set<string>;
    toggleSort: (col: keyof T) => void;
    setPage: (p: number) => void;
    toggleRow: (id: string) => void;
  }) => React.ReactNode;
}`,
    goodCode: `interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  /** Custom row rendering with row-level state. */
  renderRow?: (
    row: T,
    state: { isSelected: boolean; index: number },
  ) => React.ReactNode;
  /** Custom empty state when data is empty. */
  renderEmpty?: () => React.ReactNode;
  /** Custom pagination controls. */
  renderPagination?: (state: {
    page: number;
    pageCount: number;
    setPage: (p: number) => void;
  }) => React.ReactNode;
}`,
    correctSide: "right",
    explanationCorrect:
      "Scoped render props expose only what each customization point needs. `renderRow` gets row-level state, `renderPagination` gets page state. The broad `children` callback dumps all internal state into one bag, coupling the consumer to every implementation detail.\n\nIf the table adds filtering or column resizing internally, the scoped render props don't change. The broad callback's type signature breaks.",
    explanationWrong:
      "Exposing all internal state through a single `children` callback seems flexible, but it couples consumers to every detail. If the table refactors sorting or adds virtual scrolling, the callback signature changes and every consumer breaks.\n\nScoped render props (`renderRow`, `renderPagination`, `renderEmpty`) are stable contracts. Each one exposes only the state relevant to that customization point.",
    sourceUrl: "https://tanstack.com/table/latest/docs/guide/introduction",
    sourceLabel: "TanStack Table: Introduction",
  },
];
