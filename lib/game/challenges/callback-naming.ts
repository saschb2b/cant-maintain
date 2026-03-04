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
      'Child components don\'t "set" state. They signal that something changed. The `on` prefix followed by what happened (`ValueChange`) is the React convention. This mirrors native DOM events like `onChange` and `onClick`.',
    explanationWrong:
      '`setValue` implies the child owns and mutates state directly. In React, data flows down and events flow up. Use `onValueChange` to signal "this value changed"; the parent decides what to do with it.',
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
      "`onDelete` clearly communicates this is an event callback. The component requests deletion, and the parent performs it.",
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
      '`onSearch` is an event callback that says "the user triggered a search." The parent handles the actual search logic.',
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
      "`onItemSelect` tells you exactly what happened: the user selected an item. `onChange` is reserved for native `<input>` and `<select>` elements where it has established meaning.\n\nFor custom components, specific names like `onItemSelect`, `onTabChange`, or `onColorPick` describe the actual user action, which is invaluable when a component has multiple things that can change.",
    explanationWrong:
      "`onChange` is the right name for native form elements, but a Dropdown isn't an `<input>`. When a parent uses `<Dropdown onChange={...} />` alongside `<TextField onChange={...} />`, both callbacks look identical but mean different things. `onItemSelect` makes the Dropdown's event self-documenting, especially in components with multiple callbacks.",
    sourceUrl:
      "https://react.dev/learn/responding-to-events#naming-event-handler-props",
    sourceLabel: "React Docs: Naming event handler props",
  },
  {
    id: "cb-006",
    category: "callback-naming",
    difficulty: "hard",
    title: "Close callback with reason",
    badCode: `type CloseReason =
  | 'backdropClick'
  | 'escapeKeyDown'
  | 'closeButton';

interface DialogProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  /** Set after the dialog closes. */
  lastCloseReason?: CloseReason;
}`,
    goodCode: `type CloseReason =
  | 'backdropClick'
  | 'escapeKeyDown'
  | 'closeButton';

interface DialogProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: (reason: CloseReason) => void;
}`,
    correctSide: "right",
    explanationCorrect:
      "Passing the `reason` as a callback parameter lets the parent decide **how** to respond to each close trigger in real time. For example, you might ignore backdrop clicks on a confirmation dialog but allow Escape.\n\nMUI's Dialog uses exactly this pattern. A separate prop is reactive (updates after closing) instead of actionable (decides during closing).",
    explanationWrong:
      "Separating the reason into its own prop means the parent can't act on it **during** the close event. `lastCloseReason` updates after `onClose` fires, which is too late to prevent closing on a backdrop click. The `reason` belongs as a parameter of `onClose` so the parent can inspect it synchronously and decide whether to actually close.",
    sourceUrl: "https://mui.com/material-ui/api/dialog/",
    sourceLabel: "MUI: Dialog API",
  },
  {
    id: "cb-007",
    category: "callback-naming",
    difficulty: "hard",
    title: "Dual-level event callbacks",
    badCode: `interface SliderProps {
  min: number;
  max: number;
  value: number;
  /** Fires on every value change. */
  onChange: (value: number) => void;
  /**
   * Debounce delay in ms before onChange fires.
   * Use 0 for real-time updates.
   * @default 0
   */
  changeDebounceMs?: number;
}`,
    goodCode: `interface SliderProps {
  min: number;
  max: number;
  value: number;
  /** Fires continuously as the thumb moves. */
  onChange: (value: number) => void;
  /** Fires once when the user releases the thumb. */
  onChangeCommitted: (value: number) => void;
}`,
    correctSide: "right",
    explanationCorrect:
      "Some interactions have two meaningful moments: the live update and the final commit. Two callbacks let the parent do different things at each moment: `onChange` for UI preview, `onChangeCommitted` for saving to the server.\n\nMUI's Slider uses exactly this pattern. A `changeDebounceMs` config forces a trade-off between responsiveness and efficiency.",
    explanationWrong:
      "Debouncing collapses two distinct events into one. With `changeDebounceMs: 300`, you either get delayed UI updates or set it to `0` and still have no way to know when the user **finished** dragging.\n\nTwo callbacks (`onChange` for live preview, `onChangeCommitted` for persistence) let the parent respond to each moment appropriately.",
    sourceUrl: "https://mui.com/material-ui/api/slider/",
    sourceLabel: "MUI: Slider API",
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
      "Without `on` prefixes, these look like imperative methods. `pos` and `target` are ambiguous shorthand, while `position` and `targetId` are self-documenting.",
    sourceUrl: "https://react.dev/learn/responding-to-events",
    sourceLabel: "React Docs: Responding to Events",
  },
  {
    id: "cb-008",
    category: "callback-naming",
    difficulty: "medium",
    title: "Lifecycle callback pairs",
    badCode: `interface DrawerProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  /**
   * Called after the open/close animation finishes.
   * Use to clean up or update focus.
   */
  onAnimationDone?: () => void;
}`,
    goodCode: `interface DrawerProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  /**
   * Called when the open/close transition starts.
   * Useful for disabling interaction during animation.
   */
  onTransitionStart?: () => void;
  /**
   * Called when the open/close transition ends.
   * Useful for cleanup or focus management.
   */
  onTransitionEnd?: () => void;
}`,
    correctSide: "right",
    explanationCorrect:
      "Processes with duration deserve callback **pairs**: `onTransitionStart` / `onTransitionEnd`. This lets the parent disable interactions during animation and clean up afterward. A single `onAnimationDone` only covers the end. What if you need to lock scrolling during the transition?\n\nThe `on` + noun + lifecycle suffix pattern (`onTransitionStart`) is self-documenting.",
    explanationWrong:
      "A single `onAnimationDone` callback covers only half the lifecycle. What happens at the start of the animation? The parent might need to disable buttons, lock scroll, or trigger another animation in sync.\n\n**Lifecycle callback pairs** (`onTransitionStart`/`onTransitionEnd`, `onDragStart`/`onDragEnd`) let consumers respond to both moments. The naming convention makes the temporal relationship obvious.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event",
    sourceLabel: "MDN: transitionend event",
  },
  {
    id: "cb-009",
    category: "callback-naming",
    difficulty: "hard",
    title: "Promise-returning action callback",
    badCode: `interface SubmitButtonProps {
  children: React.ReactNode;
  /** Called when the button is clicked. */
  onClick: () => void;
  /** Whether to show a loading spinner. */
  isLoading?: boolean;
  /** Error message to display below the button. */
  errorMessage?: string;
  /** Whether the button is disabled. */
  isDisabled?: boolean;
}`,
    goodCode: `interface SubmitButtonProps {
  children: React.ReactNode;
  /**
   * Called on click. Return a Promise to
   * automatically show loading and error states.
   */
  onAction: () => Promise<void>;
  /** Whether the button is disabled. */
  isDisabled?: boolean;
  /** Additional CSS class for the button. */
  className?: string;
}`,
    correctSide: "right",
    explanationCorrect:
      "A Promise-returning callback lets the component derive loading and error states from the Promise lifecycle, so no manual `isLoading` or `errorMessage` props are needed.\n\nNaming it `onAction` (not `onClick`) signals it's async and the component will manage pending state. This is the pattern behind React 19's `useActionState` and `useTransition`.",
    explanationWrong:
      "Manually passing `isLoading` and `errorMessage` means the parent must track three pieces of state (`loading`, `error`, `idle`) and keep them in sync. Forgetting to reset `isLoading` after an error leaves the button stuck.\n\nA Promise-returning `onAction` lets the component derive these states automatically: pending while the Promise is unsettled, error if it rejects, idle on resolve.",
    sourceUrl: "https://react.dev/reference/react/useTransition",
    sourceLabel: "React Docs: useTransition",
  },
];
