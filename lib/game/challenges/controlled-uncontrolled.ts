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
      'Custom toggle components should mirror the native `<input type="checkbox">` API: `checked` + `onChange`. Consumers familiar with HTML form elements instantly understand the contract. `setToggled` implies the child owns the state; in React, data flows down and events flow up.',
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
    sourceUrl: "https://www.radix-ui.com/primitives/docs/components/accordion",
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
      'Following the `value`/`onChange` convention, the component reports the entire new state, not individual operations. The parent decides how to update: `onChange` receives the full array after any add or remove. This matches how `<select multiple>` works natively.\n\nTradeoff: if the parent needs to know the operation type (e.g., show "Tag added" vs "Tag removed" toasts), supplementary callbacks like `onAdd`/`onRemove` alongside `value`/`onChange` can be useful.',
    explanationWrong:
      "`selectedTags` + `onAddTag` + `onRemoveTag` splits a single state update into three props. What about reordering? Replacing? Clearing all? Each new operation needs another callback. The `value` + `onChange` pattern handles all mutations with one callback that reports the new state.\n\nThat said, split callbacks can complement `value`/`onChange` when the parent needs to react differently per operation. The issue here is using them as the sole API instead of the standard convention.",
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
  /** The current color. */
  color?: string;
  /** Called when a color is selected. */
  onColorChange?: (color: string) => void;
  /** Initial color before interaction. */
  initialColor?: string;
  /** Whether the picker popup is visible. */
  isVisible?: boolean;
  /** Called when visibility changes. */
  onVisibilityChange?: (visible: boolean) => void;
  /** Whether popup starts visible. */
  initiallyVisible?: boolean;
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
      "Each controlled dimension follows the same convention: `value`/`defaultValue`/`onChange` for the color, `open`/`defaultOpen`/`onOpenChange` for the popup. Once a developer learns the pattern, every dimension is predictable.\n\nThe alternative uses natural-sounding names (`color`, `initialColor`, `isVisible`), but each dimension uses its own convention. `initialColor` could mean a default, a fallback, or a reset target. `isVisible` reads as a status report rather than a controllable prop.",
    explanationWrong:
      "The names are readable, but they don't follow the `value`/`defaultValue`/`onChange` convention that React and every major component library uses. `initialColor` is ambiguous: default value, fallback, or reset target? `isVisible` sounds read-only rather than controllable. `onColorChange` vs `onVisibilityChange` each invent their own callback convention.\n\nUsing the standard naming (`value`/`defaultValue`, `open`/`defaultOpen`) makes each dimension instantly recognizable as a controlled/uncontrolled pair.",
    sourceUrl: "https://mui.com/material-ui/api/autocomplete/",
    sourceLabel: "MUI: Autocomplete API",
  },
  {
    id: "cu-006",
    category: "controlled-uncontrolled",
    difficulty: "medium",
    title: "Resetting uncontrolled state",
    badCode: `interface ReplyFormProps {
  /** Current conversation. */
  conversationId: string;
  /** Called when the reply is sent. */
  onSend: (message: string) => void;
  /** Increment to clear the draft. */
  resetTrigger?: number;
}

// Internally resets via useEffect:
// useEffect(() => { clearDraft(); }, [resetTrigger]);`,
    goodCode: `interface ReplyFormProps {
  /** Called when the reply is sent. */
  onSend: (message: string) => void;
}

// Parent resets by changing the key:
// <ReplyForm
//   key={conversationId} onSend={handleSend}
// />`,
    correctSide: "right",
    explanationCorrect:
      "When the user switches conversations, the reply draft should reset. React's `key` prop handles this: when `key` changes, React unmounts and remounts the component with fresh state. No extra props needed.\n\nThe bad version threads `conversationId` through as a prop the component doesn't need for rendering, plus a `resetTrigger` counter. `key` eliminates both from the API.",
    explanationWrong:
      "`resetTrigger` forces the parent to track a counter and the component to watch it in a `useEffect`. The component also receives `conversationId` it doesn't use for rendering, just as a reset signal.\n\nReact's `key` prop is purpose-built for this: `<ReplyForm key={conversationId} />` remounts with clean state when the conversation changes. This is the approach the React docs recommend for resetting uncontrolled components.",
    sourceUrl:
      "https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes",
    sourceLabel: "React Docs: Resetting State with a Key",
  },
  {
    id: "cu-007",
    category: "controlled-uncontrolled",
    difficulty: "easy",
    title: "Resetting state on prop change",
    badCode: `interface ProfileEditorProps {
  /** Used to detect user changes. */
  userId: string;
  user: User;
  onSave: (updates: Partial<User>) => void;
}

// Resets draft state when user changes:
// useEffect(() => { setDraft(user); }, [userId]);`,
    goodCode: `interface ProfileEditorProps {
  user: User;
  onSave: (updates: Partial<User>) => void;
}

// Key change remounts with fresh state:
// <ProfileEditor
//   key={user.id} user={user} onSave={...}
// />`,
    correctSide: "right",
    explanationCorrect:
      "The bad version passes `userId` separately from `user` just to use it as a `useEffect` dependency for resetting internal draft state. But `user.id` already carries that information.\n\nUsing `key={user.id}` at the call site eliminates the redundant prop and the `useEffect` entirely. When the key changes, React remounts the component with clean state. This is the pattern the React docs recommend over syncing state in effects.",
    explanationWrong:
      "Passing `userId` alongside `user` (which already contains `id`) is redundant. It exists only to drive a `useEffect` that resets internal state, which is fragile: forget to add a new piece of state to the reset logic and you have a stale data bug.\n\n`key={user.id}` resets all internal state at once, automatically. No prop, no effect, no chance of forgetting a field.",
    sourceUrl:
      "https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes",
    sourceLabel: "React Docs: Resetting State with a Key",
  },
];
