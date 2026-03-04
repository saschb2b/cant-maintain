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
      "A union type ties each status to exactly the props it needs. When `status` is `'loading'`, there's no `errorMessage` to accidentally render. When `status` is `'error'`, `errorMessage` is required, not optional. TypeScript narrows the type automatically when you check `status`.",
    explanationWrong:
      "With optional props, nothing stops `{ status: 'loading', errorMessage: 'oops' }`, a combination that makes no sense. Worse, `errorMessage` is optional even when `status` is `'error'`, so you could forget it entirely. **Union types make impossible states impossible.**",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions",
    sourceLabel: "TypeScript: Discriminated Unions",
  },
  {
    id: "du-004",
    category: "discriminated-unions",
    difficulty: "medium",
    title: "Button action variants",
    badCode: `type ButtonProps = {
  children: React.ReactNode;
} & (
  | {
      /** Renders as an anchor element. */
      href: string;
      target?: '_blank' | '_self';
      onClick?: () => void;
    }
  | {
      /** Renders as a button element. */
      onClick?: () => void;
      type?: 'button' | 'submit';
      href?: string;
    }
);`,
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
      'The `never` type blocks invalid combinations at compile time. Without it, both `onClick` and `href` appear in both variants, so the union doesn\'t actually constrain anything. With `never`, `<Button href="/about" onClick={fn} />` is a type error. Each variant is truly exclusive.',
    explanationWrong:
      'Both variants allow `onClick` and `href`, so the union provides no enforcement. `<Button href="/page" onClick={fn} type="submit" />` compiles fine. The `never` type is what turns a union from documentation into a real constraint: `onClick?: never` in the link variant means TypeScript rejects it at the call site.',
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions",
    sourceLabel: "TypeScript: Discriminated Unions",
  },
  {
    id: "du-001",
    category: "discriminated-unions",
    difficulty: "hard",
    title: "Variant-dependent props",
    badCode: `type AlertProps =
  | {
      /** Success state. */
      type: 'success';
      message: string;
      /** Auto-dismiss delay. */
      autoDismissMs?: number;
      /** Retry handler. */
      onRetry?: () => void;
      /** Dismiss handler. */
      onDismiss?: () => void;
    }
  | {
      /** Error state. */
      type: 'error';
      message: string;
      /** Retry handler. */
      onRetry?: () => void;
      /** Retry button text. */
      retryLabel?: string;
      /** Dismiss handler. */
      onDismiss?: () => void;
    }
  | {
      /** Warning state. */
      type: 'warning';
      message: string;
      /** Dismiss handler. */
      onDismiss?: () => void;
      /** Retry handler. */
      onRetry?: () => void;
      /** Auto-dismiss delay. */
      autoDismissMs?: number;
    };`,
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
      "Even though both use union types, the correct version makes each variant **self-contained**: `onRetry` is required (not optional) only for errors, `autoDismissMs` only exists on success, and `onDismiss` only on warnings.\n\nThe other version duplicates every prop across all variants as optional, so a success alert can still have `onRetry`.",
    explanationWrong:
      "Using a union type is the right instinct, but making every prop available in every variant defeats the purpose. `onRetry` is optional on the success variant, so nothing stops a consumer from passing it.\n\nWorse, `onRetry` is optional on the error variant too, meaning you can forget it entirely. Restrict each variant to only its relevant props, and make them required where appropriate.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions",
    sourceLabel: "TypeScript: Discriminated Unions",
  },
  {
    id: "du-002",
    category: "discriminated-unions",
    difficulty: "hard",
    title: "Controlled vs uncontrolled input",
    badCode: `type InputProps = {
  placeholder?: string;
} & (
  | {
      /** Controlled mode: parent owns value. */
      value: string;
      /** Called when the value changes. */
      onChange: (value: string) => void;
      defaultValue?: string;
    }
  | {
      /** Uncontrolled mode: internal state. */
      defaultValue?: string;
      /** Called when the value changes. */
      onChange?: (value: string) => void;
      value?: string;
    }
);`,
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
      'The `never` type is the key difference. Without it, both `value` and `defaultValue` are allowed in both variants, so the union doesn\'t actually prevent mixing.\n\n`defaultValue?: never` in controlled mode and `value?: never` in uncontrolled mode make TypeScript reject `<Input value="hi" defaultValue="there" />` at compile time.',
    explanationWrong:
      'Both use union types, but without `never` to exclude cross-variant props, nothing stops `<Input value="hello" defaultValue="world" />`.\n\nTypeScript sees that `value` exists in both variants and allows it everywhere. The `never` type turns a union from documentation into an **actual compile-time constraint**.',
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
      "An avatar is either an image (`src` + `alt`) or initials (`name`). The union makes both variants clear and ensures an image avatar always has `alt` text for accessibility. You can't accidentally pass `src` without `alt` or pass nothing at all.",
    explanationWrong:
      'Making everything optional allows `<Avatar />` with no content, `<Avatar src="..." />` with no alt text, or `<Avatar name="Jo" src="..." />` with conflicting content. A union type forces the consumer to pick one variant and provide its required props.',
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions",
    sourceLabel: "TypeScript: Discriminated Unions",
  },
  {
    id: "du-006",
    category: "discriminated-unions",
    difficulty: "medium",
    title: "Form field type unions",
    badCode: `interface FormFieldProps {
  type: 'text' | 'number' | 'select';
  value: string | number;
  onChange: (value: string | number) => void;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  placeholder?: string;
}`,
    goodCode: `type FormFieldProps =
  | {
      type: 'text';
      value: string;
      onChange: (value: string) => void;
      placeholder?: string;
    }
  | {
      type: 'number';
      value: number;
      onChange: (value: number) => void;
      min?: number;
      max?: number;
    }
  | {
      type: 'select';
      value: string;
      onChange: (value: string) => void;
      options: Array<{ value: string; label: string }>;
    };`,
    correctSide: "right",
    explanationCorrect:
      'Each field type gets exactly the props it needs: `options` is required (not optional) for select, `min`/`max` only exist on number, and `value`/`onChange` types match the field. The discriminant `type` lets TypeScript narrow the type in a switch statement.\n\nThe flat interface allows `<FormField type="text" min={0} />`. `min` makes no sense on a text field.',
    explanationWrong:
      "A single interface with `value: string | number` means every `onChange` handler must deal with both types. `options` is optional even for select fields (forgetting it compiles fine). `min`/`max` appear on text fields where they're meaningless.\n\nDiscriminated unions tie each `type` to its specific props, making impossible combinations unrepresentable.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions",
    sourceLabel: "TypeScript: Discriminated Unions",
  },
];
