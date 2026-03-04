import type { Challenge } from "../types";

export const defaultValuesChallenges: Challenge[] = [
  {
    id: "dv-001",
    category: "default-values",
    difficulty: "easy",
    title: "Default prop values",
    badCode: `interface BadgeProps {
  label: string;
  color?: string;
  size?: string;
}

Badge.defaultProps = {
  color: 'gray',
  size: 'md',
};`,
    goodCode: `interface BadgeProps {
  label: string;
  /** @default "gray" */
  color?: 'gray' | 'blue' | 'green' | 'red';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
}

function Badge({
  label,
  color = 'gray',
  size = 'md',
}: BadgeProps) {`,
    correctSide: "right",
    explanationCorrect:
      "`defaultProps` is deprecated in React 19 and will be removed. ES6 destructuring defaults are type-safe, colocated with the function, and work with TypeScript out of the box. Bonus: `@default` JSDoc tags document the defaults in IDE hover tooltips.",
    explanationWrong:
      "`defaultProps` is a legacy pattern from class components. It's deprecated in React 19, doesn't benefit from TypeScript inference, and separates defaults from where they're used. Use destructuring defaults instead — they're the modern standard.",
    sourceUrl:
      "https://react.dev/blog/2024/04/25/react-19#removed-deprecated-react-apis",
    sourceLabel: "React 19: Removed Deprecated APIs",
  },
  {
    id: "dv-002",
    category: "default-values",
    difficulty: "medium",
    title: "Safe default assignment",
    badCode: `function Slider({
  min,
  max,
  value,
  label,
}: SliderProps) {
  const safeMin = min || 0;
  const safeMax = max || 100;
  const safeValue = value || 50;
  const safeLabel = label || 'Volume';
}`,
    goodCode: `function Slider({
  min = 0,
  max = 100,
  value = 50,
  label = 'Volume',
}: SliderProps) {
  // min, max, value, label are
  // guaranteed to be defined here.
}`,
    correctSide: "right",
    explanationCorrect:
      'Destructuring defaults only apply when the value is `undefined` — which is exactly what "not passed" means in React.\n\nThe `||` operator also triggers on `0`, `""`, and `false`, which are legitimate values. `min={0}` would silently become `0 || 0` here, but `value={0}` would wrongly become `50`.',
    explanationWrong:
      'The `||` operator treats `0`, `""`, and `false` as falsy — so `value || 50` overrides a legitimate `value={0}`. This is a subtle bug. Destructuring defaults (`value = 50`) only kick in for `undefined`, which is the correct behavior for missing props.',
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#default_value",
    sourceLabel: "MDN: Destructuring Default Values",
  },
  {
    id: "dv-003",
    category: "default-values",
    difficulty: "easy",
    title: "Defaults in signature vs body",
    badCode: `function Avatar({
  src,
  alt,
  size,
}: AvatarProps) {
  const imgSize = size ?? 40;
  const imgSrc = src ?? '/default-avatar.png';
  const imgAlt = alt ?? 'User avatar';

  return (
    <img
      src={imgSrc}
      alt={imgAlt}
      width={imgSize}
      height={imgSize}
    />
  );
}`,
    goodCode: `function Avatar({
  src = '/default-avatar.png',
  alt = 'User avatar',
  size = 40,
}: AvatarProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
    />
  );
}`,
    correctSide: "right",
    explanationCorrect:
      'Destructuring defaults apply when a prop is `undefined` — exactly what "not passed" means in React. This eliminates the intermediate variables and makes defaults visible in the function signature. Any developer reading the code instantly sees the fallback values.',
    explanationWrong:
      "Using `??` in the function body works correctly (unlike `||`), but it buries defaults inside the implementation. Destructuring defaults put them right in the signature where they're most discoverable. Compare: scanning one line vs reading through the function body to find each fallback.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#default_value",
    sourceLabel: "MDN: Destructuring Default Values",
  },
  {
    id: "dv-004",
    category: "default-values",
    difficulty: "medium",
    title: "Stable default object references",
    badCode: `function DataGrid({
  columns,
  data,
  filters = {},
  sortOrder = [],
  pagination = { page: 1, pageSize: 20 },
}: DataGridProps) {
  useEffect(() => {
    fetchData({ filters, sortOrder, pagination });
  }, [filters, sortOrder, pagination]);
}`,
    goodCode: `const EMPTY_FILTERS: Filters = {};
const EMPTY_SORT: SortOrder[] = [];
const DEFAULT_PAGINATION: Pagination = {
  page: 1,
  pageSize: 20,
};

function DataGrid({
  columns,
  data,
  filters = EMPTY_FILTERS,
  sortOrder = EMPTY_SORT,
  pagination = DEFAULT_PAGINATION,
}: DataGridProps) {
  useEffect(() => {
    fetchData({ filters, sortOrder, pagination });
  }, [filters, sortOrder, pagination]);
}`,
    correctSide: "right",
    explanationCorrect:
      "Inline `= {}`, `= []`, and `= { ... }` create **new object references on every render**. If these defaults are passed to `useEffect` or `useMemo` dependency arrays, they'll trigger re-runs every time.\n\nModule-level constants are created once and have stable references.",
    explanationWrong:
      "Every render where `filters` isn't passed creates a brand new `{}`. That new object fails `===` checks in dependency arrays, causing `useEffect(() => fetch(filters), [filters])` to re-fetch on every render. Hoisting defaults to module scope gives them stable identity.",
    sourceUrl:
      "https://react.dev/reference/react/useMemo#every-time-my-component-renders-the-calculation-in-usememo-re-runs",
    sourceLabel: "React Docs: useMemo troubleshooting",
  },
  {
    id: "dv-005",
    category: "default-values",
    difficulty: "hard",
    title: "Default callbacks that skip null checks",
    badCode: `interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  validate?: (value: string) => string | null;
}

function FormField({
  onBlur,
  onFocus,
  validate,
  ...props
}: FormFieldProps) {
  const error = validate?.(props.value) ?? null;
  // Optional chaining at every call site
}`,
    goodCode: `const noop = () => {};
const noValidation = () => null;

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** @default noop */
  onBlur?: () => void;
  /** @default noop */
  onFocus?: () => void;
  /** @default () => null */
  validate?: (value: string) => string | null;
}

function FormField({
  onBlur = noop,
  onFocus = noop,
  validate = noValidation,
  ...props
}: FormFieldProps) {
  const error = validate(props.value);
  // No null checks — defaults handle missing callbacks.
}`,
    correctSide: "right",
    explanationCorrect:
      "Default callbacks eliminate `?.()` scattered throughout the component — especially valuable when a callback is used in multiple places. Module-level defaults also provide stable references for dependency arrays.\n\n**Tradeoff:** If you conditionally render UI based on whether a callback was passed (e.g., showing a delete button only when `onDelete` is provided), keep it `undefined` — a `noop` default would hide that signal. Use defaults for callbacks you always want to *call*, not ones you want to *check*.",
    explanationWrong:
      "Optional chaining (`validate?.(value)`, `onBlur?.()`) is concise and perfectly fine for single call sites. But when multiple optional callbacks are used in several places, defaults reduce repetition and provide stable references for hooks.\n\n**Tradeoff:** Don't default callbacks you check to conditionally render UI — e.g., only showing a delete button when `onDelete` is passed. In that case, `undefined` is the right signal.",
    sourceUrl:
      "https://react.dev/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop",
    sourceLabel: "React Docs: Default Prop Values",
  },
];
