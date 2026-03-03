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
      "The `is` prefix makes boolean props read as yes/no questions: 'Is it loading?' Some established libraries (MUI, HTML) use bare names like `disabled` - that's fine for well-known HTML attributes. But for custom props, the prefix removes ambiguity: is `loading` a boolean, an enum, or a string?",
    explanationWrong:
      "Without a prefix, `loading` could be a boolean, a loading state enum, or a loading message string. The `is`/`has`/`should` convention is most valuable for custom props where the type isn't obvious. Note: native HTML attributes like `disabled` are the exception - everyone knows those are booleans.",
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
      "Two improvements! `isOpen` makes the boolean explicit, and `onClose` follows the event callback convention. Fun fact: MUI uses bare `open` for modals - that's fine for a well-known pattern. But `close` as an imperative verb is the real problem here: it should always be `onClose` to signal it's an event callback, not a command.",
    explanationWrong:
      "The bigger issue is `close` - it reads like an imperative command ('close the modal!') rather than an event callback ('the user requested closing'). `onClose` fixes that. For the boolean, `open` vs `isOpen` is a style choice (MUI uses `open`), but `isOpen` is more self-documenting in your own components.",
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
  noElevation?: boolean;
  noRipple?: boolean;
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
      "The `disable*` prefix is ideal for opt-out booleans: features that are on by default and can be turned off. `<Button disableElevation />` reads as 'disable the elevation' - clear and imperative. MUI uses this pattern across its entire library. The key rule: boolean props should default to `false` so that the JSX shorthand `<Button disableRipple />` means 'true'.",
    explanationWrong:
      "`no*` prefixes create double-negative confusion. `noElevation={false}` means... elevation is on? The `disable*` prefix avoids this: `disableElevation={false}` clearly means 'don't disable it' (elevation stays on). Also, `disable*` is the established MUI convention - consistency with the library your team uses matters.",
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
  isMounted?: boolean;
  isBackdropHidden?: boolean;
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
      "Different boolean intents deserve different prefixes: `keep*` means 'preserve this behavior that would normally stop,' `hide*` means 'don't render this visual element,' and `disable*` means 'turn off this feature.' `<Modal keepMounted hideBackdrop />` reads as clear instructions. MUI's Modal uses all three of these exact props.",
    explanationWrong:
      "`is*` works for state booleans, but `isMounted` is confusing - is it a read-only status or a setting? `isBackdropHidden` is a double description (is + hidden). `isScrollLocked` reverses the default mental model. Intent-specific prefixes (`keep*`, `hide*`, `disable*`) make each prop's purpose unambiguous without reading the docs.",
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
  collapsed: boolean;
  icons: boolean;
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
      "Three prefixes, three meanings: `is` for current state (`isCollapsed`), `has` for feature presence (`hasIcons`), and JSDoc `@default` so consumers know the baseline. At the call site, `<Navigation hasIcons isMobile />` reads like a sentence. Each prefix tells you the *kind* of boolean without reading the type.",
    explanationWrong:
      "`collapsed` - is this a past-tense verb ('it was collapsed') or a boolean? `icons` - a boolean or an array of Icon objects? `mobile` - a boolean, a phone number, or a breakpoint? Without prefixes, every prop requires reading the type definition to understand. `is`/`has`/`should` prefixes make the intent obvious at the call site.",
    sourceUrl: "https://react.dev/learn/passing-props-to-a-component",
    sourceLabel: "React Docs: Passing Props to a Component",
  },
];
