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
      "The `is` prefix is a widely used convention that makes boolean props read as yes/no questions: 'Is it loading?' While some libraries use bare names like `disabled`, the prefix makes the type unambiguous at the call site.",
    explanationWrong:
      "Without a prefix like `is`, `has`, or `should`, it can be ambiguous whether `loading` is a boolean, a loading state enum, or a loading message string. The `is` prefix is a common convention that makes the type self-documenting.",
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
      "Two improvements! `isOpen` reads as a clear yes/no question, and `onClose` is a proper event callback. Note: some libraries (like MUI) use `open` without prefix - both are valid, but `close` as an imperative is the bigger issue here.",
    explanationWrong:
      "`open` is debatable on its own, but pairing it with `close` (an imperative command) is the real problem. `close` should be `onClose` to signal it's an event callback. Adding `is` to the boolean makes the state vs. event distinction clearer.",
    sourceUrl: "https://react.dev/learn/responding-to-events",
    sourceLabel: "React Docs: Responding to Events",
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
      "Full marks! Three patterns at once: `is` for state booleans, `has` for feature booleans, and JSDoc with `@default` for every optional prop. `<Navigation hasIcons isMobile />` reads like English.",
    explanationWrong:
      "`collapsed` - is this a verb or adjective? `icons` - a boolean or an array of icons? `mobile` - a phone number? Each prop is ambiguous. Prefix booleans with `is`/`has`/`should` and document defaults.",
    sourceUrl: "https://react.dev/learn/passing-props-to-a-component",
    sourceLabel: "React Docs: Passing Props to a Component",
  },
];
