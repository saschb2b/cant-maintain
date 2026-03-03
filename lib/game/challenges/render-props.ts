import type { Challenge } from "../types";

export const renderPropsChallenges: Challenge[] = [
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
