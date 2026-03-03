import type { Challenge } from "../types";

export const discriminatedUnionsChallenges: Challenge[] = [
  {
    id: "du-003",
    category: "discriminated-unions",
    difficulty: "easy",
    title: "Status-specific message props",
    badCode: `interface StatusProps {
  status: 'loading' | 'error' | 'success';
  errorMessage?: string;
  successData?: string;
}`,
    goodCode: `type StatusProps =
  | { status: 'loading' }
  | { status: 'error'; errorMessage: string }
  | { status: 'success'; data: string };`,
    correctSide: "right",
    explanationCorrect:
      "A union type ties each status to exactly the props it needs. When `status` is `'loading'`, there's no `errorMessage` to accidentally render. When `status` is `'error'`, `errorMessage` is required - not optional. TypeScript narrows the type automatically when you check `status`.",
    explanationWrong:
      "With optional props, nothing stops `{ status: 'loading', errorMessage: 'oops' }` - a combination that makes no sense. Worse, `errorMessage` is optional even when `status` is `'error'`, so you could forget it entirely. Union types make impossible states impossible.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions",
    sourceLabel: "TypeScript: Discriminated Unions",
  },
  {
    id: "du-004",
    category: "discriminated-unions",
    difficulty: "medium",
    title: "Button action variants",
    badCode: `interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  target?: '_blank' | '_self';
  type?: 'button' | 'submit';
}`,
    goodCode: `type ButtonProps = {
  children: React.ReactNode;
} & (
  | {
      /** Renders as an anchor element. */
      href: string;
      target?: '_blank' | '_self';
      onClick?: never;
      type?: never;
    }
  | {
      /** Renders as a button element. */
      onClick?: () => void;
      type?: 'button' | 'submit';
      href?: never;
      target?: never;
    }
);`,
    correctSide: "right",
    explanationCorrect:
      "A button with an `href` is a link; a button with `onClick` is a button. Mixing both (`<Button href=\"/about\" onClick={fn}>`) leads to confusing behavior. The union ensures `target` only appears with `href` and `type` only appears without it. The `never` type blocks invalid combinations at compile time.",
    explanationWrong:
      "Making everything optional allows `<Button href=\"/page\" onClick={fn} type=\"submit\" target=\"_blank\" />` - should this navigate or call the handler? Submit a form or open a link? Union types force the consumer to pick one behavior, making the component predictable.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions",
    sourceLabel: "TypeScript: Discriminated Unions",
  },
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
  {
    id: "du-005",
    category: "discriminated-unions",
    difficulty: "easy",
    title: "Image avatar vs initials avatar",
    badCode: `interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}`,
    goodCode: `type AvatarProps = {
  size?: 'sm' | 'md' | 'lg';
} & (
  | { src: string; alt: string }
  | { name: string }
);`,
    correctSide: "right",
    explanationCorrect:
      "An avatar is either an image (src + alt) or initials (name). The union makes both variants clear and ensures an image avatar always has alt text for accessibility. You can't accidentally pass `src` without `alt` or pass nothing at all.",
    explanationWrong:
      'Making everything optional allows `<Avatar />` with no content, `<Avatar src="..." />` with no alt text, or `<Avatar name="Jo" src="..." />` with conflicting content. A union type forces the consumer to pick one variant and provide its required props.',
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions",
    sourceLabel: "TypeScript: Discriminated Unions",
  },
];
