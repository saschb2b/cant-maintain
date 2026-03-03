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
];
