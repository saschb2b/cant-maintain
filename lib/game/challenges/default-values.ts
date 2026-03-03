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
      "`defaultProps` is a legacy pattern from class components. It's deprecated in React 19, doesn't benefit from TypeScript inference, and separates defaults from where they're used. Use destructuring defaults instead - they're the modern standard.",
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
      "Destructuring defaults only apply when the value is `undefined` - which is exactly what \"not passed\" means in React. The `||` operator also triggers on `0`, `\"\"`, and `false`, which are legitimate values. `min={0}` would silently become `0 || 0` here, but `value={0}` would wrongly become `50`.",
    explanationWrong:
      "The `||` operator treats `0`, `\"\"`, and `false` as falsy - so `value || 50` overrides a legitimate `value={0}`. This is a subtle bug. Destructuring defaults (`value = 50`) only kick in for `undefined`, which is the correct behavior for missing props.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#default_value",
    sourceLabel: "MDN: Destructuring Default Values",
  },
];
