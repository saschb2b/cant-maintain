import type { Challenge } from "../types";

export const renderPropsChallenges: Challenge[] = [
  {
    id: "rp-001",
    category: "render-props",
    difficulty: "medium",
    title: "Render function vs ReactNode slot",
    badCode: `interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

// Usage:
// <Tooltip content={<span>{data.label}</span>}>
//   <Button />
// </Tooltip>`,
    goodCode: `interface TooltipProps {
  children: React.ReactNode;
  /** Receives the anchor rect for positioning. */
  renderContent: (anchorRect: DOMRect) => React.ReactNode;
}

// Usage:
// <Tooltip renderContent={(rect) => (
//   <Popover style={{ top: rect.bottom }}>
//     {data.label}
//   </Popover>
// )}>
//   <Button />
// </Tooltip>`,
    correctSide: "right",
    explanationCorrect:
      "A render function (`renderContent`) gives the consumer access to runtime data - here, the anchor's position. A static `ReactNode` slot can't receive arguments. Use `render*` prefix when the consumer needs data from the component to decide what to render.",
    explanationWrong:
      "A `ReactNode` slot works for static content, but the tooltip needs to position itself relative to the trigger. With `content: ReactNode`, the consumer can't access the anchor's bounding rect. A render function solves this by passing runtime data to the consumer.",
    sourceUrl: "https://react.dev/reference/react/cloneElement#alternatives",
    sourceLabel: "React Docs: Alternatives to cloneElement",
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
      "`render*` functions return JSX (`React.ReactNode`) - they control what appears on screen. `get*` functions return data (strings, numbers, booleans) - they extract or compute values. MUI follows this strictly: `renderOption` returns JSX for the dropdown, `getOptionLabel` returns a plain string for the input field. Swapping the prefixes reverses the reader's expectation.",
    explanationWrong:
      "The prefixes are swapped. `renderLabel` implies it returns JSX, but it returns a string - that's a `get*` function. `getOption` implies it extracts data, but it returns JSX - that's a `render*` function. Match the prefix to the return type: `get*` for data, `render*` for UI.",
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
      "Render functions are only needed when the component passes data back to the consumer. Here, EmptyState doesn't provide any data — it just displays content. Plain `ReactNode` slots are simpler: `icon={<SearchIcon />}` vs `renderIcon={() => <SearchIcon />}`.",
    explanationWrong:
      "These render functions take no arguments and return JSX — they're just `ReactNode` with extra ceremony. `renderIcon={() => <SearchIcon />}` creates a new function on every render for no benefit. Use `icon={<SearchIcon />}` instead. Reserve `render*` for when the component passes runtime data to the callback.",
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
      "A render function gives the fallback access to the actual error and a reset function. A static `ReactNode` can't show the error message or offer a retry button. Use `render*` when the component has runtime data the consumer needs.",
    explanationWrong:
      "A static `fallback` works for generic error messages, but it can't show what went wrong or let the user retry. The Error Boundary knows the error and can reset itself — a `renderFallback` callback passes this context to the consumer.",
    sourceUrl:
      "https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary",
    sourceLabel: "React Docs: Error Boundaries",
  },
  {
    id: "rp-005",
    category: "render-props",
    difficulty: "hard",
    title: "Headless component with state callback",
    badCode: `interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
  onLabel?: string;
  offLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  children?: React.ReactNode;
}`,
    goodCode: `interface ToggleState {
  isOn: boolean;
  toggle: () => void;
}

interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
  /**
   * Full control over rendering.
   * Receives the toggle state.
   */
  children: (state: ToggleState) => React.ReactNode;
}`,
    correctSide: "right",
    explanationCorrect:
      "A headless component exposes state and behavior through a render callback, leaving all visual decisions to the consumer. Instead of adding `size`, `color`, `onLabel`, and `offLabel` props to handle every use case, the consumer gets full control. This is the pattern behind libraries like Downshift and React Aria.",
    explanationWrong:
      "Adding visual props (`size`, `color`, `onLabel`) makes the component increasingly rigid. Want a toggle that looks like a checkbox? A switch? An icon button? Each new design requires new props. A render callback hands control to the consumer — they render whatever they want using the toggle state.",
    sourceUrl: "https://react.dev/reference/react/cloneElement#alternatives",
    sourceLabel: "React Docs: Alternatives to cloneElement",
  },
];
