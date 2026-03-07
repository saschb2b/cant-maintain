import type { Challenge } from "../types";

export const enumeratedVariantsChallenges: Challenge[] = [
  {
    id: "ev-001",
    category: "enumerated-variants",
    difficulty: "easy",
    title: "Button size: booleans vs enum",
    badCode: `interface ButtonProps {
  children: React.ReactNode;
  isSmall?: boolean;
  isLarge?: boolean;
}`,
    goodCode: `interface ButtonProps {
  children: React.ReactNode;
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
}`,
    correctSide: "right",
    explanationCorrect:
      'A `size` union replaces two booleans with a single, self-documenting prop. `<Button size="sm" />` is clear, and adding `"xs"` later is just one more union member.\n\nWith booleans, `<Button isSmall isLarge />` compiles fine but makes no sense. Unions make invalid states impossible and scale without combinatorial explosion.',
    explanationWrong:
      "Two booleans create four states (`false/false`, `true/false`, `false/true`, `true/true`), but only three are valid. Nothing prevents `<Button isSmall isLarge />`. Every new size needs another boolean, and the call site gets noisier.\n\nA single string union prop is easier to read, extend, and exhaustively check in a switch statement.",
    sourceUrl: "https://mui.com/material-ui/api/button/",
    sourceLabel: "MUI: Button API",
  },
  {
    id: "ev-002",
    category: "enumerated-variants",
    difficulty: "easy",
    title: "Alert severity levels",
    badCode: `interface AlertProps {
  children: React.ReactNode;
  isError?: boolean;
  isWarning?: boolean;
  isSuccess?: boolean;
  isInfo?: boolean;
}`,
    goodCode: `interface AlertProps {
  children: React.ReactNode;
  /** @default "info" */
  severity?: 'error' | 'warning' | 'success' | 'info';
}`,
    correctSide: "right",
    explanationCorrect:
      'Four mutually exclusive booleans should always be a single union. `<Alert severity="error" />` reads better than `<Alert isError />` and makes it impossible to pass conflicting states.\n\nBonus: `severity` works naturally in a switch statement for styling and icon selection, and adding new variants later is trivial.',
    explanationWrong:
      "With four booleans, `<Alert isError isSuccess />` compiles but is nonsensical. Worse, `<Alert />` with no flags has an implicit fifth state (none selected) that the component must handle.\n\nA union type makes exactly one severity active at all times. MUI's Alert uses this exact pattern.",
    sourceUrl: "https://mui.com/material-ui/api/alert/",
    sourceLabel: "MUI: Alert API",
  },
  {
    id: "ev-003",
    category: "enumerated-variants",
    difficulty: "medium",
    title: "Chip visual variants",
    badCode: `interface ChipProps {
  label: string;
  isOutlined?: boolean;
  isFilled?: boolean;
  isClickable?: boolean;
  isDeletable?: boolean;
  isPrimary?: boolean;
  isSecondary?: boolean;
}`,
    goodCode: `interface ChipProps {
  label: string;
  /** @default "filled" */
  variant?: 'filled' | 'outlined';
  /** @default "default" */
  color?: 'default' | 'primary' | 'secondary';
  onClick?: () => void;
  onDelete?: () => void;
}`,
    correctSide: "right",
    explanationCorrect:
      'Six booleans collapse into two enums plus event callbacks. `variant` and `color` are independent dimensions, so you can combine any variant with any color. And clickable/deletable are better expressed by the presence of their callbacks: if `onClick` is defined, the chip is clickable.\n\nThis is exactly how MUI\'s Chip API works.',
    explanationWrong:
      'Six booleans create 64 theoretical combinations, most of which are invalid. `<Chip isOutlined isFilled />` contradicts itself. `<Chip isClickable />` has no handler. `<Chip isPrimary isSecondary />` is meaningless.\n\nSeparate each visual dimension into its own union prop, and derive behavior from event callbacks instead of boolean flags.',
    sourceUrl: "https://mui.com/material-ui/api/chip/",
    sourceLabel: "MUI: Chip API",
  },
  {
    id: "ev-004",
    category: "enumerated-variants",
    difficulty: "medium",
    title: "Text alignment prop",
    badCode: `interface TextProps {
  children: React.ReactNode;
  alignLeft?: boolean;
  alignCenter?: boolean;
  alignRight?: boolean;
  alignJustify?: boolean;
}`,
    goodCode: `interface TextProps {
  children: React.ReactNode;
  /** @default "left" */
  align?: 'left' | 'center' | 'right' | 'justify';
}`,
    correctSide: "right",
    explanationCorrect:
      'This is a textbook case for a union. `align` maps directly to the CSS `text-align` property, making the prop name and values immediately familiar. One prop, one concept, one value.\n\n`<Text align="center" />` is concise and self-explanatory. MUI\'s Typography uses this exact pattern.',
    explanationWrong:
      'Four mutually exclusive booleans for a single CSS property is a red flag. `<Text alignLeft alignCenter />` is contradictory, and the component needs defensive code to handle it. Every additional alignment option means another boolean.\n\nWhen the values map 1:1 to a known domain (CSS, HTML, ARIA), mirror the domain\'s naming with a union.',
    sourceUrl: "https://mui.com/material-ui/api/typography/",
    sourceLabel: "MUI: Typography API",
  },
  {
    id: "ev-005",
    category: "enumerated-variants",
    difficulty: "medium",
    title: "Loading state representation",
    badCode: `interface DataViewProps<T> {
  data: T[];
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  isRefreshing?: boolean;
}`,
    goodCode: `interface DataViewProps<T> {
  data: T[];
  /** @default "idle" */
  status?: 'idle' | 'loading' | 'error'
    | 'empty' | 'refreshing';
}`,
    correctSide: "right",
    explanationCorrect:
      'Async state is a finite state machine. The view is always in exactly one state. A `status` union models this correctly and lets you exhaustively handle every case in a switch.\n\nWith booleans, `isLoading && isError` is a valid but meaningless combination that your component must defend against.',
    explanationWrong:
      "Four independent booleans create 16 possible combinations, but only 5 are valid states. The component must include defensive logic for impossible combos like `isLoading && isEmpty` or `isError && isRefreshing`.\n\nA status enum makes the state machine explicit. It's also easier to add new states later without worrying about interactions with existing booleans.",
    sourceUrl:
      "https://tkdodo.eu/blog/status-checks-in-react-query",
    sourceLabel: "TkDodo: Status Checks in React Query",
  },
  {
    id: "ev-006",
    category: "enumerated-variants",
    difficulty: "hard",
    title: "Icon position variants",
    badCode: `interface ButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  isIconBefore?: boolean;
  isIconAfter?: boolean;
  isIconOnly?: boolean;
}`,
    goodCode: `interface ButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  /** @default "start" */
  iconPosition?: 'start' | 'end';
} | {
  'aria-label': string;
  icon: React.ReactNode;
  iconPosition?: never;
}`,
    correctSide: "right",
    explanationCorrect:
      'The "icon-only" variant is fundamentally different: it requires `aria-label` for accessibility and has no `children`. That\'s a discriminated union, not a boolean.\n\nFor icon + text buttons, `iconPosition` is a clean enum. `<Button icon={<Save />} iconPosition="end">Save</Button>` reads naturally. Three booleans for one concept is a code smell.',
    explanationWrong:
      '`isIconBefore` and `isIconAfter` are mutually exclusive, a classic sign that a union is better. `isIconOnly` changes the component\'s requirements entirely (needs `aria-label`, no text), but the type doesn\'t enforce this.\n\n`<Button isIconBefore isIconAfter />` compiles. `<Button isIconOnly />` compiles without an `aria-label`. Both are bugs that types should prevent.',
    sourceUrl: "https://mui.com/material-ui/api/button/",
    sourceLabel: "MUI: Button API",
  },
  {
    id: "ev-007",
    category: "enumerated-variants",
    difficulty: "hard",
    title: "Spacing scale vs arbitrary numbers",
    badCode: `interface StackProps {
  children: React.ReactNode;
  /** Gap between items in pixels. */
  gap?: number;
  /** Padding in pixels. */
  padding?: number;
}`,
    goodCode: `interface StackProps {
  children: React.ReactNode;
  /** @default "md" */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** @default "none" */
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}`,
    correctSide: "right",
    explanationCorrect:
      "Named spacing tokens enforce visual consistency. `gap=\"md\"` constrains consumers to your design system's scale, so every component uses the same values.\n\nNote: MUI uses numbers (`gap={2}`) that multiply `theme.spacing`, which also works because the multiplier constrains values to the scale. The key insight is the same: don't accept arbitrary pixel values. Whether you use string tokens or a numeric multiplier, the API should map to a finite set of spacing steps.",
    explanationWrong:
      'Raw pixel values (`gap={12}`, `gap={14}`, `gap={16}`) create invisible inconsistency. There\'s no way to enforce spacing scale adherence through the type system. A team of 10 developers will produce 10 different spacing values.\n\nConstrain the prop to a finite scale, either with string tokens (`"sm" | "md" | "lg"`) or numeric multipliers (`1 | 2 | 3` mapped to `theme.spacing`). Both approaches keep the API consistent and decoupled from raw pixel values.',
    sourceUrl:
      "https://tailwindcss.com/docs/customizing-spacing",
    sourceLabel: "Tailwind: Customizing Spacing",
  },
  {
    id: "ev-008",
    category: "enumerated-variants",
    difficulty: "hard",
    title: "Multi-dimensional boolean explosion",
    badCode: `interface CardProps {
  children: React.ReactNode;
  isElevated?: boolean;
  isOutlined?: boolean;
  isCompact?: boolean;
  isHorizontal?: boolean;
  isInteractive?: boolean;
}`,
    goodCode: `interface CardProps {
  children: React.ReactNode;
  /** @default "elevated" */
  variant?: 'elevated' | 'outlined' | 'flat';
  /** @default "md" */
  padding?: 'sm' | 'md' | 'lg';
  /** @default "vertical" */
  direction?: 'vertical' | 'horizontal';
  onClick?: () => void;
}`,
    correctSide: "right",
    explanationCorrect:
      'Five booleans are really three independent dimensions: surface style (`variant`), density (`padding`), and layout (`direction`). Each dimension gets its own union prop. `isInteractive` is better expressed by the presence of `onClick`. If there\'s a click handler, the card is interactive.\n\nBooleans create 32 combinations, many conflicting. Enums produce 18, and every single one is valid.',
    explanationWrong:
      "Five independent booleans produce 32 combinations, many of which conflict (`isElevated isOutlined`), are unclear (`isCompact`, how compact?), or lack behavior (`isInteractive` without a handler).\n\nThe fix: identify independent visual dimensions, give each a union prop, and derive interaction from callbacks. Fewer props, clearer API, impossible to misconfigure.",
    sourceUrl: "https://mui.com/material-ui/api/card/",
    sourceLabel: "MUI: Card API",
  },
];
