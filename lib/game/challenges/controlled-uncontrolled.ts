import type { Challenge } from "../types";

export const controlledUncontrolledChallenges: Challenge[] = [
  {
    id: "cu-001",
    category: "controlled-uncontrolled",
    difficulty: "easy",
    title: "Toggle component API",
    badCode: `interface ToggleProps {
  toggled: boolean;
  setToggled: (value: boolean) => void;
}`,
    goodCode: `interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}`,
    correctSide: "right",
    explanationCorrect:
      "Custom toggle components should mirror the native `<input type=\"checkbox\">` API: `checked` + `onChange`. Consumers familiar with HTML form elements instantly understand the contract. `setToggled` implies the child owns the state — in React, data flows down and events flow up.",
    explanationWrong:
      "`toggled` and `setToggled` invent a new naming convention. React already has an established pattern for boolean form controls: `checked` + `onChange`. Following native HTML conventions reduces learning curve and enables interoperability with form libraries like React Hook Form.",
    sourceUrl:
      "https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable",
    sourceLabel: "React Docs: Controlling an Input",
  },
  {
    id: "cu-002",
    category: "controlled-uncontrolled",
    difficulty: "easy",
    title: "Default value naming",
    badCode: `interface DatePickerProps {
  /** The initially selected date. */
  initialDate?: Date;
  /** Called when the user picks a date. */
  onDateChange: (date: Date) => void;
}`,
    goodCode: `interface DatePickerProps {
  /** The initial date for uncontrolled mode. */
  defaultValue?: Date;
  /** Called when the user picks a date. */
  onChange: (date: Date) => void;
}`,
    correctSide: "right",
    explanationCorrect:
      "React's convention for uncontrolled initial values is `defaultValue` (or `defaultChecked` for checkboxes). `initialDate` invents a custom name. Using `defaultValue` + `onChange` makes any form library and React developer immediately understand this is an uncontrolled component.",
    explanationWrong:
      "`initialDate` isn't wrong functionally, but it breaks from React's universal convention. Every native element uses `defaultValue` for initial uncontrolled state. Custom components that follow this pattern compose naturally with form libraries and require zero documentation to understand.",
    sourceUrl:
      "https://react.dev/reference/react-dom/components/input#providing-an-initial-value-for-an-input",
    sourceLabel: "React Docs: Initial Value for an Input",
  },
  {
    id: "cu-003",
    category: "controlled-uncontrolled",
    difficulty: "medium",
    title: "Dual-mode component API",
    badCode: `interface AccordionProps {
  children: React.ReactNode;
  /** Which panel is expanded. */
  expanded?: number;
  /** Called when a panel is toggled. */
  onToggle?: (index: number) => void;
  /** Initially expanded panel. */
  startExpanded?: number;
}`,
    goodCode: `interface AccordionProps {
  children: React.ReactNode;
  /** Controlled: which panel is expanded. */
  value?: number;
  /** Called when the expanded panel changes. */
  onChange?: (value: number) => void;
  /** Uncontrolled: initially expanded panel. */
  defaultValue?: number;
}`,
    correctSide: "right",
    explanationCorrect:
      "The `value` / `defaultValue` / `onChange` trio is React's universal contract for dual-mode (controlled + uncontrolled) components. `expanded` + `startExpanded` + `onToggle` invents custom names for the same concept. Consumers immediately know: pass `value` + `onChange` for controlled, or `defaultValue` for uncontrolled.",
    explanationWrong:
      "`expanded`, `startExpanded`, and `onToggle` are three custom names for a pattern React already has conventions for. With `value`/`defaultValue`/`onChange`, any React developer knows the contract without reading docs. This is the same API used by Radix's Accordion, Headless UI's Disclosure, and native `<select>`.",
    sourceUrl:
      "https://www.radix-ui.com/primitives/docs/components/accordion",
    sourceLabel: "Radix UI: Accordion",
  },
  {
    id: "cu-004",
    category: "controlled-uncontrolled",
    difficulty: "medium",
    title: "Multi-value controlled pattern",
    badCode: `interface TagInputProps {
  /** Current tags. */
  selectedTags: string[];
  /** Called to add a tag. */
  onAddTag: (tag: string) => void;
  /** Called to remove a tag. */
  onRemoveTag: (tag: string) => void;
  placeholder?: string;
}`,
    goodCode: `interface TagInputProps {
  /** Controlled: the current list of tags. */
  value: string[];
  /** Called with the full updated tag list. */
  onChange: (tags: string[]) => void;
  placeholder?: string;
}`,
    correctSide: "right",
    explanationCorrect:
      "Following the `value`/`onChange` convention, the component reports the entire new state — not individual operations. The parent decides how to update: `onChange` receives the full array after any add or remove. This matches how `<select multiple>` works natively.\n\nSeparate `onAddTag`/`onRemoveTag` callbacks force the parent to know the component's internal operations instead of just receiving the result.",
    explanationWrong:
      "`selectedTags` + `onAddTag` + `onRemoveTag` splits a single state update into three props. What about reordering? Replacing? Clearing all? Each new operation needs another callback. The `value` + `onChange` pattern handles all mutations with one callback that reports the new state, matching React's established form control conventions.",
    sourceUrl:
      "https://react.dev/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable",
    sourceLabel: "React Docs: Controlling a Select Box",
  },
  {
    id: "cu-005",
    category: "controlled-uncontrolled",
    difficulty: "hard",
    title: "Multiple controlled dimensions",
    badCode: `interface ColorPickerProps {
  /** The currently selected color. */
  selectedColor?: string;
  /** Called when a color is picked. */
  onColorPick?: (color: string) => void;
  /** Initial color before any interaction. */
  startColor?: string;
  /** Whether the popup is showing. */
  isOpen?: boolean;
  /** Called when popup visibility changes. */
  onOpenChange?: (open: boolean) => void;
  /** Whether popup starts open. */
  startsOpen?: boolean;
}`,
    goodCode: `interface ColorPickerProps {
  /** Controlled: the selected color. */
  value?: string;
  /** Called when the selected color changes. */
  onChange?: (color: string) => void;
  /** Uncontrolled: initial selected color. */
  defaultValue?: string;
  /** Controlled: whether the popup is open. */
  open?: boolean;
  /** Called when popup open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Uncontrolled: initial popup open state. */
  defaultOpen?: boolean;
}`,
    correctSide: "right",
    explanationCorrect:
      "Complex components often have multiple independently controlled dimensions. Each dimension should follow the same `value`/`defaultValue`/`onChange` convention (or `open`/`defaultOpen`/`onOpenChange` for visibility).\n\nThe bad version invents custom names for each dimension (`selectedColor`, `startColor`, `isOpen`, `startsOpen`) — every dimension uses different conventions, forcing consumers to learn each one from scratch.",
    explanationWrong:
      "Six props with six different naming conventions: `selectedColor` (adjective+noun), `onColorPick` (on+noun+verb), `startColor` (verb+noun), `isOpen` (is+adjective), `onOpenChange` (consistent!), `startsOpen` (verb+adjective). The inconsistency makes the API unpredictable.\n\nApplying the same `value`/`defaultValue`/`onChange` pattern to each dimension makes the API predictable: learn the pattern once, apply it everywhere.",
    sourceUrl: "https://mui.com/material-ui/api/autocomplete/",
    sourceLabel: "MUI: Autocomplete API",
  },
];
