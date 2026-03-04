import type { Challenge } from "../types";

export const booleanNamingChallenges: Challenge[] = [
  {
    id: "bl-001",
    category: "boolean-naming",
    difficulty: "easy",
    title: "Loading state prop",
    badCode: `interface ButtonProps {
  text: string;
  loading: boolean;
}`,
    goodCode: `interface ButtonProps {
  text: string;
  isLoading: boolean;
}`,
    correctSide: "right",
    explanationCorrect:
      'The `is` prefix makes boolean props read as yes/no questions: "Is it loading?"\n\nSome established libraries (MUI, HTML) use bare names like `disabled`, and that\'s fine for well-known HTML attributes. But for custom props, the prefix removes ambiguity: is `loading` a boolean, an enum, or a string?',
    explanationWrong:
      "Without a prefix, `loading` could be a boolean, a loading state enum, or a loading message string. The `is`/`has`/`should` convention is most valuable for custom props where the type isn't obvious.\n\nNote: native HTML attributes like `disabled` are the exception; everyone knows those are booleans.",
    sourceUrl: "https://react.dev/learn/passing-props-to-a-component",
    sourceLabel: "React Docs: Passing Props to a Component",
  },
  {
    id: "bl-002",
    category: "boolean-naming",
    difficulty: "easy",
    title: "Visibility toggle",
    badCode: `interface ModalProps {
  children: React.ReactNode;
  open: boolean;
  close: () => void;
}`,
    goodCode: `interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}`,
    correctSide: "right",
    explanationCorrect:
      "`isOpen` makes the boolean explicit, and `onClose` follows the event callback convention.\n\nFun fact: MUI uses bare `open` for modals, and that's fine for a well-known pattern. But `close` as an imperative verb is the real problem here: it should always be `onClose` to signal it's an event callback, not a command.",
    explanationWrong:
      'The bigger issue is `close`, which reads like an imperative command ("close the modal!") rather than an event callback ("the user requested closing"). `onClose` fixes that. For the boolean, `open` vs `isOpen` is a style choice (MUI uses `open`), but `isOpen` is more self-documenting in your own components.',
    sourceUrl: "https://react.dev/learn/responding-to-events",
    sourceLabel: "React Docs: Responding to Events",
  },
  {
    id: "bl-004",
    category: "boolean-naming",
    difficulty: "medium",
    title: "Opt-out boolean naming",
    badCode: `interface ButtonProps {
  children: React.ReactNode;
  variant?: 'text' | 'outlined' | 'contained';
  /** @default false */
  noElevation?: boolean;
  /** @default false */
  noRipple?: boolean;
  /** @default false */
  noFocusRipple?: boolean;
}`,
    goodCode: `interface ButtonProps {
  children: React.ReactNode;
  variant?: 'text' | 'outlined' | 'contained';
  /** @default false */
  disableElevation?: boolean;
  /** @default false */
  disableRipple?: boolean;
  /** @default false */
  disableFocusRipple?: boolean;
}`,
    correctSide: "right",
    explanationCorrect:
      'The `disable*` prefix is ideal for opt-out booleans: features that are on by default and can be turned off. `<Button disableElevation />` reads as "disable the elevation," which is clear and imperative. MUI uses this pattern across its entire library.\n\nThe key rule: boolean props should default to `false` so that the JSX shorthand `<Button disableRipple />` means "true".',
    explanationWrong:
      '`no*` prefixes create double-negative confusion. `noElevation={false}` means... elevation is on? The `disable*` prefix avoids this: `disableElevation={false}` clearly means "don\'t disable it" (elevation stays on).\n\nAlso, `disable*` is the established MUI convention, and consistency with the library your team uses matters.',
    sourceUrl: "https://mui.com/material-ui/api/button/",
    sourceLabel: "MUI: Button API",
  },
  {
    id: "bl-005",
    category: "boolean-naming",
    difficulty: "hard",
    title: "Intent-specific boolean prefixes",
    badCode: `interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  /** Keep in DOM when closed. @default false */
  isMounted?: boolean;
  /** Hide the backdrop. @default false */
  isBackdropHidden?: boolean;
  /** Lock body scroll. @default true */
  isScrollLocked?: boolean;
}`,
    goodCode: `interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  /** Keep children in the DOM when closed. @default false */
  keepMounted?: boolean;
  /** Hide the backdrop overlay. @default false */
  hideBackdrop?: boolean;
  /** Prevent body scroll when open. @default true */
  disableScrollLock?: boolean;
}`,
    correctSide: "right",
    explanationCorrect:
      'Different boolean intents deserve different prefixes: `keep*` means "preserve this behavior that would normally stop," `hide*` means "don\'t render this visual element," and `disable*` means "turn off this feature."\n\n`<Modal keepMounted hideBackdrop />` reads as clear instructions. MUI\'s Modal uses all three of these exact props.',
    explanationWrong:
      "`is*` works for state booleans, but `isMounted` is confusing: is it a read-only status or a setting? `isBackdropHidden` is a double description (`is` + `hidden`). `isScrollLocked` reverses the default mental model. Intent-specific prefixes (`keep*`, `hide*`, `disable*`) make each prop's purpose unambiguous without reading the docs.",
    sourceUrl: "https://mui.com/material-ui/api/modal/",
    sourceLabel: "MUI: Modal API",
  },
  {
    id: "bl-003",
    category: "boolean-naming",
    difficulty: "hard",
    title: "Complex boolean props",
    badCode: `interface NavigationProps {
  items: NavItem[];
  /**
   * Whether the navigation is collapsed.
   * @default false
   */
  collapsed: boolean;
  /**
   * Whether to show icons.
   * @default true
   */
  icons: boolean;
  /**
   * Whether in mobile layout.
   * @default false
   */
  mobile: boolean;
}`,
    goodCode: `interface NavigationProps {
  items: NavItem[];
  /**
   * Whether the navigation is in collapsed (icon-only) mode.
   * @default false
   */
  isCollapsed: boolean;
  /**
   * Whether to show icons alongside labels.
   * @default true
   */
  hasIcons: boolean;
  /**
   * Whether the component renders in mobile viewport layout.
   * @default false
   */
  isMobile: boolean;
}`,
    correctSide: "right",
    explanationCorrect:
      "Three prefixes, three meanings: `is` for current state (`isCollapsed`), `has` for feature presence (`hasIcons`), and JSDoc `@default` so consumers know the baseline.\n\nAt the call site, `<Navigation hasIcons isMobile />` reads like a sentence. Each prefix tells you the **kind** of boolean without reading the type.",
    explanationWrong:
      '`collapsed`: is this a past-tense verb ("it was collapsed") or a boolean? `icons`: a boolean or an array of Icon objects? `mobile`: a boolean, a phone number, or a breakpoint?\n\nWithout prefixes, every prop requires reading the type definition to understand. `is`/`has`/`should` prefixes make the intent obvious at the call site.',
    sourceUrl: "https://react.dev/learn/passing-props-to-a-component",
    sourceLabel: "React Docs: Passing Props to a Component",
  },
  {
    id: "bl-006",
    category: "boolean-naming",
    difficulty: "medium",
    title: "Native HTML booleans vs custom booleans",
    badCode: `interface InputProps
  extends React.ComponentProps<'input'> {
  /** Whether the field has a validation error. */
  isError?: boolean;
  /** Whether the field is mandatory. */
  isRequired?: boolean;
  /** Whether the field is disabled. */
  isDisabled?: boolean;
}`,
    goodCode: `interface InputProps
  extends React.ComponentProps<'input'> {
  /** Whether the field has a validation error. */
  hasError?: boolean;
  /**
   * Maps to the native required attribute.
   * Uses the HTML name for consistency.
   * @default false
   */
  required?: boolean;
  /**
   * Maps to the native disabled attribute.
   * Uses the HTML name for consistency.
   * @default false
   */
  disabled?: boolean;
}`,
    correctSide: "right",
    explanationCorrect:
      "Props that map directly to HTML attributes should use the native name: `disabled` (not `isDisabled`), `required` (not `isRequired`). These are universally understood and are already in `ComponentProps<'input'>`.\n\n`hasError` gets a prefix because it's a custom boolean that doesn't exist in HTML, so the prefix removes ambiguity. General guideline: native HTML booleans stay bare, custom booleans get prefixes.",
    explanationWrong:
      "Adding `is` prefix to well-known HTML attributes like `disabled` and `required` creates inconsistency with native elements and re-declares props already inherited from `ComponentProps<'input'>`. It also means `<Input isDisabled />` doesn't set the native `disabled` attribute without manual mapping.\n\nReserve prefixes for **custom** booleans like `hasError` where the type isn't obvious from the name alone.",
    sourceUrl: "https://react.dev/reference/react-dom/components/input",
    sourceLabel: "React Docs: input",
  },
];
