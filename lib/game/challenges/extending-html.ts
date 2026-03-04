import type { Challenge } from "../types";

export const extendingHtmlChallenges: Challenge[] = [
  {
    id: "eh-001",
    category: "extending-html",
    difficulty: "medium",
    title: "Custom button component props",
    badCode: `interface ButtonProps
  extends React.ComponentProps<'button'> {
  /** The button text. */
  label: string;
  /** Click handler. */
  onClick?: () => void;
  /** Whether the button is disabled. */
  disabled?: boolean;
  /** Button type. @default 'button' */
  type?: 'button' | 'submit' | 'reset';
}`,
    goodCode: `interface ButtonProps
  extends React.ComponentProps<'button'> {
  /** The button's visible text content. */
  label: string;
  /** Visual style variant. @default 'primary' */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Button size. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
}`,
    correctSide: "right",
    explanationCorrect:
      "When you extend `ComponentProps<'button'>`, `onClick`, `disabled`, and `type` are already included with correct types. Only add props that the native element doesn't have. `label`, `variant`, and `size` are genuine additions. Re-declaring inherited props clutters the API.",
    explanationWrong:
      "Re-declaring `onClick`, `disabled`, and `type` after extending `ComponentProps<'button'>` is redundant. Worse, it can narrow the types. `onClick?: () => void` drops the `React.MouseEvent` parameter, and `type` limits to 3 values when the native type is more permissive.\n\n**Extend once and only declare what's truly new.**",
    sourceUrl: "https://react.dev/reference/react-dom/components/common",
    sourceLabel: "React Docs: Common Components",
  },
  {
    id: "eh-002",
    category: "extending-html",
    difficulty: "medium",
    title: "Input wrapper with custom onChange",
    badCode: `interface TextFieldProps
  extends Omit<
    React.ComponentProps<'input'>,
    'onChange' | 'value'
  > {
  /** Controlled string value. */
  value: string;
  /** Called on input change with the full event. */
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}`,
    goodCode: `interface TextFieldProps
  extends Omit<
    React.ComponentProps<'input'>,
    'onChange'
  > {
  /**
   * Called with the new string value on change.
   * Simplified from the native event-based onChange.
   */
  onChange: (value: string) => void;
}`,
    correctSide: "right",
    explanationCorrect:
      "`Omit` should only remove props you actually need to redefine. The native `value` on `<input>` already works fine, so omitting and re-declaring it as `string` is unnecessary.\n\nThe real win is simplifying `onChange` to pass just the string value, so consumers write `onChange={setValue}` instead of `onChange={(e) => setValue(e.target.value)}`.",
    explanationWrong:
      "Omitting `value` just to re-declare it as `string` is redundant; the native input already accepts `string`. The `onChange` still passes the raw event, forcing every consumer to extract `e.target.value`. **Omit only what you're genuinely changing**, and simplify the callback signature to pass just the data consumers need.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys",
    sourceLabel: "TypeScript: Omit Utility Type",
  },
  {
    id: "eh-003",
    category: "extending-html",
    difficulty: "hard",
    title: "Polymorphic component typing",
    badCode: `type CardProps<
  E extends string = 'div'
> = {
  /** The HTML element to render as. */
  as?: E;
  children: React.ReactNode;
} & Omit<
  React.HTMLAttributes<HTMLElement>,
  'as' | 'children'
>;`,
    goodCode: `type CardProps<
  E extends React.ElementType = 'div'
> = {
  /** The HTML element or component to render. */
  as?: E;
  children: React.ReactNode;
} & Omit<
  React.ComponentPropsWithoutRef<E>,
  'as' | 'children'
>;`,
    correctSide: "right",
    explanationCorrect:
      '`React.ElementType` constrains `as` to valid elements/components, and `ComponentPropsWithoutRef<E>` adapts the available props based on the element. `as="a"` enables `href`; `as="button"` enables `type`.\n\nCompare `string` + `HTMLAttributes<HTMLElement>` which accepts any string and always gives generic div-like props regardless of the element.',
    explanationWrong:
      'Using `string` for `as` accepts `"banana"` as a valid element. `HTMLAttributes<HTMLElement>` always gives the same generic props, so `as="a"` won\'t enable `href`, and `as="button"` won\'t enable `type`.\n\n`React.ElementType` + `ComponentPropsWithoutRef<E>` make TypeScript infer the correct props for whatever element type is passed.',
    sourceUrl: "https://react.dev/reference/react/createElement",
    sourceLabel: "React Docs: createElement",
  },
  {
    id: "eh-004",
    category: "extending-html",
    difficulty: "easy",
    title: "Wrapper div component props",
    badCode: `interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  role?: string;
  'aria-label'?: string;
}`,
    goodCode: `interface CardProps
  extends React.ComponentProps<'div'> {
  children: React.ReactNode;
}`,
    correctSide: "right",
    explanationCorrect:
      "Extending `React.ComponentProps<'div'>` inherits every valid div attribute: `className`, `style`, `role`, all ARIA props, event handlers, and more. Only declare custom props that don't exist on the native element.",
    explanationWrong:
      "Manually listing HTML attributes is incomplete by definition. You've covered 5 of hundreds of valid div props. What about `tabIndex`, `aria-describedby`, `onKeyDown`, `data-testid`? Extend from the native type and get them all for free.",
    sourceUrl: "https://react.dev/reference/react-dom/components/common",
    sourceLabel: "React Docs: Common Components",
  },
  {
    id: "eh-005",
    category: "extending-html",
    difficulty: "easy",
    title: "Link component extending anchor",
    badCode: `interface LinkProps {
  href: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
  className?: string;
  onClick?: () => void;
}`,
    goodCode: `interface LinkProps
  extends React.ComponentProps<'a'> {
  /**
   * Opens in a new tab with noopener noreferrer.
   * @default false
   */
  isExternal?: boolean;
}`,
    correctSide: "right",
    explanationCorrect:
      'Extending `<a>` gives you `href`, `target`, `rel`, `download`, ARIA props, and all event handlers for free. The custom `isExternal` prop adds real value: it encapsulates the `target="_blank" rel="noopener noreferrer"` pattern into a single boolean.',
    explanationWrong:
      "Re-declaring `href`, `target`, `rel`, `className`, and `onClick` is five props you didn't need to write. You've also missed `download`, `hrefLang`, `aria-current`, and dozens more. Extend `<a>` and only add props that provide new functionality.",
    sourceUrl: "https://react.dev/reference/react-dom/components/common",
    sourceLabel: "React Docs: Common Components",
  },
  {
    id: "eh-006",
    category: "extending-html",
    difficulty: "medium",
    title: "Form action prop pattern",
    badCode: `interface FormProps extends Omit<
  React.ComponentProps<'form'>,
  'onSubmit'
> {
  /** Called on form submission with form data. */
  onSubmit: (data: FormData) => Promise<void>;
  /** Whether the form is currently submitting. */
  isSubmitting?: boolean;
}`,
    goodCode: `interface FormProps extends Omit<
  React.ComponentProps<'form'>,
  'action'
> {
  /** Server Action or async submission handler. */
  action: (data: FormData) => Promise<void>;
  /** Pending state via useFormStatus() instead. */
}

// useFormStatus() inside child components
// provides isPending automatically.`,
    correctSide: "right",
    explanationCorrect:
      "React 19 added native `<form action={...}>` support. Passing an async function as `action` integrates with `useFormStatus` (for pending state) and `useActionState` (for return values), so no manual `isSubmitting` prop needed.\n\nThe form resets automatically on success for uncontrolled inputs. This is the modern replacement for `onSubmit` + `preventDefault()`.",
    explanationWrong:
      "`onSubmit` + `isSubmitting` is the pre-React 19 pattern. The parent must manually manage pending state, call `preventDefault()`, and reset the form. React 19's `action` prop handles all of this:\n\n- Pending state via `useFormStatus()`\n- Progressive enhancement (works without JS)\n- Automatic form reset on success\n- Server Action compatibility",
    sourceUrl: "https://react.dev/reference/react-dom/components/form",
    sourceLabel: "React Docs: form",
  },
  {
    id: "eh-007",
    category: "extending-html",
    difficulty: "hard",
    title: "Prop spreading with override protection",
    badCode: `interface ChipProps
  extends React.ComponentProps<'span'> {
  label: string;
  variant?: 'filled' | 'outlined';
}

function Chip({ label, variant, ...rest }: ChipProps) {
  return (
    <span
      className={getChipClass(variant)}
      {...rest}
    >
      {label}
    </span>
  );
}`,
    goodCode: `interface ChipProps
  extends Omit<
    React.ComponentProps<'span'>,
    'className' | 'children'
  > {
  label: string;
  variant?: 'filled' | 'outlined';
}

function Chip({ label, variant, ...rest }: ChipProps) {
  return (
    <span
      {...rest}
      className={getChipClass(variant)}
    >
      {label}
    </span>
  );
}`,
    correctSide: "right",
    explanationCorrect:
      "Two fixes: `Omit` removes `className` and `children` from the spread so consumers can't accidentally override critical styling or content. The spread goes **before** explicit props so `className` always wins.\n\nIn the bad version, `{...rest}` comes after `className`, meaning `<Chip className=\"oops\" />` silently replaces the component's styling.",
    explanationWrong:
      "Spreading `{...rest}` **after** `className` lets consumers accidentally overwrite the component's styling with `<Chip className=\"custom\" />`. The component's own `className` is silently replaced.\n\nSpread first, then set explicit props. Use `Omit` to block props that consumers shouldn't override at the type level, since `className` and `children` are managed internally.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys",
    sourceLabel: "TypeScript: Omit Utility Type",
  },
];
