import type { Challenge } from "../types";

export const extendingHtmlChallenges: Challenge[] = [
  {
    id: "eh-001",
    category: "extending-html",
    difficulty: "medium",
    title: "Custom button component props",
    badCode: `interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  id?: string;
}`,
    goodCode: `interface ButtonProps
  extends React.ComponentProps<'button'> {
  /** The button's visible text content. */
  label: string;
}`,
    correctSide: "right",
    explanationCorrect:
      "`React.ComponentProps<'button'>` gives you every native button attribute for free - onClick, disabled, type, aria attributes, and more. Only declare custom props that the native element doesn't have.",
    explanationWrong:
      "Manually re-declaring native attributes is incomplete and tedious. You'll miss `aria-describedby`, `form`, `formAction`, and dozens more. Extend from `React.ComponentProps` and only add what's new.",
    sourceUrl: "https://react.dev/reference/react-dom/components/common",
    sourceLabel: "React Docs: Common Components",
  },
  {
    id: "eh-002",
    category: "extending-html",
    difficulty: "medium",
    title: "Input wrapper with custom onChange",
    badCode: `interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  name?: string;
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
      "Using `Omit` lets you override specific native props while keeping all others. Here, `onChange` is simplified to pass just the value string. Consumers still get `placeholder`, `disabled`, `maxLength`, and every other input attribute automatically.",
    explanationWrong:
      "Re-declaring native input attributes one by one means you'll inevitably miss some. `Omit<React.ComponentProps<'input'>, 'onChange'>` inherits everything and only overrides what's different - a common pattern in design system components.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys",
    sourceLabel: "TypeScript: Omit Utility Type",
  },
  {
    id: "eh-003",
    category: "extending-html",
    difficulty: "hard",
    title: "Polymorphic component typing",
    badCode: `interface CardProps {
  as?: string;
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
}`,
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
      "The generic `as` prop lets a Card render as a `div`, `section`, `a`, or any component - with type-safe props for that element. `as=\"a\"` enables `href`; `as=\"button\"` enables `onClick` and `type`. TypeScript catches invalid combos like `<Card as=\"a\" disabled />` at compile time.",
    explanationWrong:
      "Typing `as` as `string` gives no type safety - you'd need to manually add every possible HTML prop (`href`, `onClick`, `disabled`, etc.) and hope consumers use the right ones. A generic `ElementType` constraint makes TypeScript infer the correct props automatically.",
    sourceUrl:
      "https://react.dev/reference/react/createElement",
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
      "Extending `React.ComponentProps<'div'>` inherits every valid div attribute — `className`, `style`, `role`, all ARIA props, event handlers, and more. Only declare custom props that don't exist on the native element.",
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
      'Extending `<a>` gives you `href`, `target`, `rel`, `download`, ARIA props, and all event handlers for free. The custom `isExternal` prop adds real value — it encapsulates the `target="_blank" rel="noopener noreferrer"` pattern into a single boolean.',
    explanationWrong:
      "Re-declaring `href`, `target`, `rel`, `className`, and `onClick` is five props you didn't need to write. You've also missed `download`, `hrefLang`, `aria-current`, and dozens more. Extend `<a>` and only add props that provide new functionality.",
    sourceUrl: "https://react.dev/reference/react-dom/components/common",
    sourceLabel: "React Docs: Common Components",
  },
];
