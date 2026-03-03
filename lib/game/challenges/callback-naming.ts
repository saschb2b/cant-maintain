import type { Challenge } from "../types";

export const callbackNamingChallenges: Challenge[] = [
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
    sourceUrl:
      "https://react.dev/learn/responding-to-events#naming-event-handler-props",
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
    sourceUrl:
      "https://react.dev/learn/responding-to-events#naming-event-handler-props",
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
];
