import type { Challenge } from "../types";

export const refForwardingChallenges: Challenge[] = [
  {
    id: "rf-001",
    category: "ref-forwarding",
    difficulty: "easy",
    title: "Wrapper component swallows ref",
    badCode: `interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  onClick?: () => void;
}`,
    goodCode: `interface ButtonProps
  extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}`,
    correctSide: "right",
    explanationCorrect:
      "Extending `ComponentProps<'button'>` gives you `ref`, `onClick`, `children`, `disabled`, ARIA props, and every other native button attribute for free. A manually defined interface with no `ref` support means consumers can't focus the button programmatically or measure its position.\n\nIn React 19, `ref` is a regular prop; extending native props is the simplest way to support it.",
    explanationWrong:
      "This interface has no `ref` support, so `<Button ref={myRef} />` is a type error. Consumers can't call `.focus()`, `.blur()`, or pass the button to focus-management libraries.\n\nExtending `ComponentProps<'button'>` adds ref support (plus every native attribute) without listing them manually.",
    sourceUrl: "https://react.dev/reference/react/forwardRef",
    sourceLabel: "React Docs: forwardRef",
  },
  {
    id: "rf-002",
    category: "ref-forwarding",
    difficulty: "easy",
    title: "Ref typed as any",
    badCode: `interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: any;
}`,
    goodCode: `interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ref?: React.Ref<HTMLInputElement>;
}`,
    correctSide: "right",
    explanationCorrect:
      "`React.Ref<HTMLInputElement>` accepts callback refs, ref objects, and `null`: all valid ref forms. It also tells TypeScript the exact element type, so `ref.current.focus()` and `.select()` autocomplete correctly.\n\n`any` bypasses all of that; consumers can pass a string, a number, or anything else without a type error.",
    explanationWrong:
      "`ref?: any` disables all type checking. A consumer could pass `ref={42}` and TypeScript wouldn't complain. Worse, the IDE can't autocomplete methods on the ref target: is it an `<input>`, a `<div>`, or something else?\n\n`React.Ref<HTMLInputElement>` gives type safety and full autocomplete for the underlying element.",
    sourceUrl:
      "https://react.dev/reference/react/useRef#manipulating-the-dom-with-a-ref",
    sourceLabel: "React Docs: Manipulating the DOM with a Ref",
  },
  {
    id: "rf-003",
    category: "ref-forwarding",
    difficulty: "medium",
    title: "Imperative handle vs raw DOM ref",
    badCode: `interface VideoPlayerProps {
  /** Video source URL. */
  src: string;
  /** Poster image shown before playback. */
  poster?: string;
  /** Whether to show playback controls. */
  hasControls?: boolean;
  /**
   * Ref to the root container element.
   * Use for play/pause/seek operations.
   */
  ref?: React.Ref<HTMLDivElement>;
}`,
    goodCode: `interface VideoPlayerHandle {
  /** Start playback. */
  play: () => void;
  /** Pause playback. */
  pause: () => void;
  /** Seek to a specific time in seconds. */
  seek: (time: number) => void;
}

interface VideoPlayerProps {
  /** Video source URL. */
  src: string;
  /** Poster image shown before playback. */
  poster?: string;
  /** Whether to show playback controls. */
  hasControls?: boolean;
  /** Imperative handle for playback control. */
  ref?: React.Ref<VideoPlayerHandle>;
}`,
    correctSide: "right",
    explanationCorrect:
      "An imperative handle exposes only the operations consumers need: `play()`, `pause()`, `seek()`. Exposing the raw `<div>` leaks every DOM method and property; consumers could accidentally call `.remove()` or read `.innerHTML`.\n\n`useImperativeHandle` creates this focused API. The handle type also serves as documentation for what the component supports.",
    explanationWrong:
      "A `Ref<HTMLDivElement>` exposes the entire DOM API: hundreds of methods and properties. Consumers must dig through the DOM to find the `<video>` element inside, then call `.play()` on it directly. This couples the consumer to the component's internal DOM structure.\n\nAn imperative handle (`VideoPlayerHandle`) exposes a stable, typed API that survives internal refactors.",
    sourceUrl: "https://react.dev/reference/react/useImperativeHandle",
    sourceLabel: "React Docs: useImperativeHandle",
  },
  {
    id: "rf-004",
    category: "ref-forwarding",
    difficulty: "medium",
    title: "Ref targeting the wrong element",
    badCode: `interface SearchFieldProps {
  /** Current search query. */
  value: string;
  /** Called when the query changes. */
  onValueChange: (value: string) => void;
  /** Placeholder text. */
  placeholder?: string;
  /**
   * Ref to the outer wrapper element.
   * Used for layout measurements.
   */
  ref?: React.Ref<HTMLDivElement>;
}`,
    goodCode: `interface SearchFieldProps {
  /** Current search query. */
  value: string;
  /** Called when the query changes. */
  onValueChange: (value: string) => void;
  /** Placeholder text. */
  placeholder?: string;
  /**
   * Ref to the inner input element.
   * Supports .focus() and .select().
   */
  ref?: React.Ref<HTMLInputElement>;
}`,
    correctSide: "right",
    explanationCorrect:
      "Consumers ref a SearchField to call `.focus()` or `.select()`; those are `HTMLInputElement` methods. A ref to the outer `<div>` wrapper can't do either. The ref should point to the element consumers actually interact with programmatically.\n\nIf consumers also need the wrapper for layout, expose that as a separate `containerRef` prop.",
    explanationWrong:
      "The wrapper `<div>` doesn't have `.focus()` or `.select()`. A consumer writing `ref.current?.focus()` gets a type error, or worse, it silently does nothing at runtime because `HTMLDivElement.focus()` exists but doesn't move keyboard focus to the input.\n\nTarget the `<input>`; that's the element consumers need to control.",
    sourceUrl:
      "https://react.dev/reference/react/useRef#manipulating-the-dom-with-a-ref",
    sourceLabel: "React Docs: Manipulating the DOM with a Ref",
  },
  {
    id: "rf-005",
    category: "ref-forwarding",
    difficulty: "hard",
    title: "Over-exposed imperative handle",
    badCode: `interface EditorHandle {
  /** Get the current editor content. */
  getValue: () => string;
  /** Replace the editor content. */
  setValue: (value: string) => void;
  /** Focus the editor. */
  focus: () => void;
  /** Blur the editor. */
  blur: () => void;
  /** Get the current selection range. */
  getSelection: () => SelectionRange;
  /** Set the selection range. */
  setSelection: (range: SelectionRange) => void;
  /** Undo the last change. */
  undo: () => void;
  /** Redo the last undone change. */
  redo: () => void;
}

interface EditorProps {
  /** Controlled content value. */
  value: string;
  /** Called on content change. */
  onChange: (value: string) => void;
  /** Imperative editor API. */
  ref?: React.Ref<EditorHandle>;
}`,
    goodCode: `interface EditorHandle {
  /** Move focus to the editor. */
  focus: () => void;
  /** Remove focus from the editor. */
  blur: () => void;
  /** Scroll a line number into view. */
  scrollToLine: (line: number) => void;
}

interface EditorProps {
  /** Controlled content value. */
  value: string;
  /** Called on content change. */
  onChange: (value: string) => void;
  /** Selection range. Controlled by parent. */
  selection?: SelectionRange;
  /** Called when the selection changes. */
  onSelectionChange?: (range: SelectionRange) => void;
  /** Imperative editor API. */
  ref?: React.Ref<EditorHandle>;
}`,
    correctSide: "right",
    explanationCorrect:
      "The imperative handle should only expose what **can't** be done through props. `getValue`/`setValue` duplicate the controlled `value`/`onChange` pair. Selection is better as controlled props (`selection`/`onSelectionChange`) so the parent can react to changes. `undo`/`redo` are internal state management.\n\nWhat remains (`focus()`, `blur()`, `scrollToLine()`) are genuine imperative operations that have no declarative equivalent.",
    explanationWrong:
      "`getValue()` and `setValue()` create a second, imperative channel for the same data that `value`/`onChange` already controls. Now there are two sources of truth. `getSelection`/`setSelection` have the same problem; they should be props.\n\n`undo`/`redo` expose internal history state. If the parent needs undo, the editor should emit change events and the parent manages its own history stack.",
    sourceUrl: "https://react.dev/reference/react/useImperativeHandle",
    sourceLabel: "React Docs: useImperativeHandle",
  },
];
