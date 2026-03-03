import type { Challenge } from "../types";

export const discriminatedUnionsChallenges: Challenge[] = [
  {
    id: "du-001",
    category: "discriminated-unions",
    difficulty: "hard",
    title: "Variant-dependent props",
    badCode: `interface AlertProps {
  type: 'success' | 'error' | 'warning';
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  onDismiss?: () => void;
  autoDismissMs?: number;
}`,
    goodCode: `type AlertProps =
  | {
      /** Shown on successful operations. Auto-dismisses. */
      type: 'success';
      message: string;
      /**
       * Time in ms before the alert auto-dismisses.
       * @default 3000
       */
      autoDismissMs?: number;
    }
  | {
      /** Shown on failed operations. Offers a retry. */
      type: 'error';
      message: string;
      /** Called when the user clicks the retry button. */
      onRetry: () => void;
      /** Label for the retry button. @default "Try again" */
      retryLabel?: string;
    }
  | {
      /** Shown for non-critical issues. Can be dismissed. */
      type: 'warning';
      message: string;
      /** Called when the user dismisses the warning. */
      onDismiss: () => void;
    };`,
    correctSide: "right",
    explanationCorrect:
      "Discriminated unions ensure that `onRetry` is only required (and allowed) when `type` is `'error'`. TypeScript catches impossible combinations at compile time. No more 'why is retryLabel set on a success alert?' bugs.",
    explanationWrong:
      "The flat interface makes every optional prop available for every variant. Nothing stops you from passing `onRetry` to a success alert. Discriminated unions tie props to their specific variant, giving you compile-time safety.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions",
    sourceLabel: "TypeScript: Discriminated Unions",
  },
  {
    id: "du-002",
    category: "discriminated-unions",
    difficulty: "hard",
    title: "Controlled vs uncontrolled input",
    badCode: `interface InputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}`,
    goodCode: `type InputProps = {
  placeholder?: string;
} & (
  | {
      /** Controlled mode: parent manages the value. */
      value: string;
      /** Required in controlled mode. */
      onChange: (value: string) => void;
      defaultValue?: never;
    }
  | {
      /** Uncontrolled mode: initial value only. */
      defaultValue?: string;
      /** Optional in uncontrolled mode. */
      onChange?: (value: string) => void;
      value?: never;
    }
);`,
    correctSide: "right",
    explanationCorrect:
      "Discriminated unions with `never` prevent mixing controlled and uncontrolled patterns. You can't pass both `value` and `defaultValue`, and controlled mode requires `onChange`. This catches the exact bug React warns about at runtime - but at compile time.",
    explanationWrong:
      'Making everything optional allows `<Input value="hello" defaultValue="world" />` - a React anti-pattern that triggers a runtime warning. A controlled input needs `value` + `onChange`; uncontrolled uses `defaultValue`. TypeScript should enforce this.',
    sourceUrl:
      "https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable",
    sourceLabel: "React Docs: Controlling an Input",
  },
];
