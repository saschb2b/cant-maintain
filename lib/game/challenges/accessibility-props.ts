import type { Challenge } from "../types";

export const accessibilityPropsChallenges: Challenge[] = [
  {
    id: "ap-001",
    category: "accessibility-props",
    difficulty: "easy",
    title: "Icon button missing accessible label",
    badCode: `interface IconButtonProps
  extends React.ComponentProps<'button'> {
  /** The icon to display. */
  icon: React.ReactNode;
  /** Visual style variant. @default 'default' */
  variant?: 'default' | 'outlined';
  /** Button size. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
}`,
    goodCode: `interface IconButtonProps
  extends React.ComponentProps<'button'> {
  /** The icon to display. */
  icon: React.ReactNode;
  /** Accessible label for screen readers. */
  'aria-label': string;
  /** Visual style variant. @default 'default' */
  variant?: 'default' | 'outlined';
  /** Button size. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
}`,
    correctSide: "right",
    explanationCorrect:
      'Icon-only buttons have no visible text — screen readers announce them as just "button" with no context. Making `aria-label` **required** (not optional) ensures every usage site provides accessible text.\n\nA screen reader user hears "Delete, button" instead of just "button". This is one of the most common accessibility failures in component libraries.',
    explanationWrong:
      "Without `aria-label`, this icon button is invisible to screen readers. The `icon` prop is a visual `ReactNode` — it has no text content for assistive technology. Even `ComponentProps<'button'>` only makes `aria-label` optional.\n\nMaking it required in the interface forces consumers to think about what the button does, not just what it looks like.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label",
    sourceLabel: "MDN: aria-label",
  },
  {
    id: "ap-002",
    category: "accessibility-props",
    difficulty: "easy",
    title: "Image with optional alt text",
    badCode: `interface ImageProps {
  src: string;
  alt?: string;
  width: number;
  height: number;
  isLazy?: boolean;
}`,
    goodCode: `interface ImageProps {
  src: string;
  /** Descriptive text, or "" for decorative images. */
  alt: string;
  width: number;
  height: number;
  isLazy?: boolean;
}`,
    correctSide: "right",
    explanationCorrect:
      'Making `alt` required forces a conscious decision: provide a description, or explicitly pass `""` for decorative images. Optional `alt` means consumers can simply forget it — and `undefined` alt is different from empty alt in HTML.\n\nAn `<img>` with no `alt` attribute is flagged by every accessibility audit tool. An `<img alt="">` is intentionally decorative and skipped by screen readers.',
    explanationWrong:
      'When `alt` is optional, nothing stops `<Image src="chart.png" width={400} height={300} />` — a content image with no description. Screen readers would announce the filename instead, which is useless.\n\nMaking `alt` required catches this at compile time. Decorative images use `alt=""` — that\'s a deliberate choice, not an omission.',
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#accessibility",
    sourceLabel: "MDN: img accessibility",
  },
  {
    id: "ap-003",
    category: "accessibility-props",
    difficulty: "medium",
    title: "ARIA role typed as string",
    badCode: `interface LiveRegionProps {
  children: React.ReactNode;
  /**
   * ARIA role for the live region.
   * @default 'status'
   */
  role?: string;
  /**
   * How assertively the region announces.
   * @default 'polite'
   */
  'aria-live'?: string;
}`,
    goodCode: `interface LiveRegionProps {
  children: React.ReactNode;
  /**
   * ARIA role for the live region.
   * @default 'status'
   */
  role?: 'status' | 'alert' | 'log' | 'timer';
  /**
   * How assertively the region announces.
   * @default 'polite'
   */
  'aria-live'?: 'polite' | 'assertive' | 'off';
}`,
    correctSide: "right",
    explanationCorrect:
      "ARIA roles and attributes have a defined vocabulary — `role=\"statis\"` (typo) silently does nothing. Union types catch typos at compile time and light up IDE autocomplete with the valid options.\n\nThe same principle applies to `aria-live`: only `'polite'`, `'assertive'`, and `'off'` are valid. A `string` type accepts anything.",
    explanationWrong:
      '`role?: string` accepts `"banana"` without complaint. ARIA roles must be from a defined set — an invalid role is silently ignored by the browser, and the element loses its semantic meaning.\n\nUnion types apply the same constraint strategy used for `size` and `variant` props: narrow the type to only valid values.',
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions",
    sourceLabel: "MDN: ARIA Live Regions",
  },
  {
    id: "ap-004",
    category: "accessibility-props",
    difficulty: "medium",
    title: "Redundant aria-label vs labelledby",
    badCode: `interface DialogProps {
  children: React.ReactNode;
  /** The dialog title text. */
  title: string;
  /**
   * Accessible label for screen readers.
   * Should match the title text.
   */
  'aria-label'?: string;
  isOpen: boolean;
  onClose: () => void;
}`,
    goodCode: `interface DialogProps {
  children: React.ReactNode;
  /** The dialog title text. Renders as an h2. */
  title: string;
  /**
   * ID of the element that labels this dialog.
   * Auto-generated from the title element.
   * @default auto-generated
   */
  'aria-labelledby'?: string;
  isOpen: boolean;
  onClose: () => void;
}`,
    correctSide: "right",
    explanationCorrect:
      "When a visible title already exists, `aria-labelledby` points to it — the label stays in sync automatically. `aria-label` duplicates the title text, creating a maintenance risk: update the `title` prop but forget `aria-label` and screen readers announce stale text.\n\nMUI's Dialog auto-generates the `aria-labelledby` ID from the title element, so consumers rarely need to pass it explicitly.",
    explanationWrong:
      '`aria-label` duplicates the `title` text. If a consumer writes `<Dialog title="Confirm deletion" aria-label="Delete dialog">`, screen readers announce "Delete dialog" instead of the actual title. The two strings drift apart over time.\n\n`aria-labelledby` references the rendered title element directly — one source of truth, always in sync.',
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby",
    sourceLabel: "MDN: aria-labelledby",
  },
  {
    id: "ap-005",
    category: "accessibility-props",
    difficulty: "hard",
    title: "Custom form control accessibility",
    badCode: `interface CustomSelectProps {
  /** The selectable options. */
  options: Array<{ value: string; label: string }>;
  /** The currently selected value. */
  value: string;
  /** Called when the user picks an option. */
  onChange: (value: string) => void;
  /** Text shown when no value is selected. */
  placeholder?: string;
  /** Whether the field is disabled. */
  isDisabled?: boolean;
  /** Error message to display. */
  errorMessage?: string;
  /** Whether the field is required. */
  isRequired?: boolean;
}`,
    goodCode: `interface CustomSelectProps {
  /** The selectable options. */
  options: Array<{ value: string; label: string }>;
  /** The currently selected value. */
  value: string;
  /** Called when the user picks an option. */
  onChange: (value: string) => void;
  /** Text shown when no value is selected. */
  placeholder?: string;
  /** Whether the field is disabled. */
  isDisabled?: boolean;
  /** Visible error message. Sets aria-invalid. */
  errorMessage?: string;
  /** Whether the field is required. Sets aria-required. */
  isRequired?: boolean;
  /** ID of the element that labels this select. */
  'aria-labelledby'?: string;
  /** ID of the element that describes this select. */
  'aria-describedby'?: string;
}`,
    correctSide: "right",
    explanationCorrect:
      "Custom form controls must replicate the accessibility contract of their native equivalents. `aria-labelledby` connects an external `<label>`, and `aria-describedby` connects help text or error messages. Without these, the select is an unlabeled, undescribed control to screen readers.\n\nThe component should internally set `aria-invalid` when `errorMessage` is present and `aria-required` when `isRequired` is `true` — consumers shouldn't have to manage these separately.",
    explanationWrong:
      "This custom select has `isDisabled`, `errorMessage`, and `isRequired`, but no way to connect it to external labels or descriptions. A screen reader user encounters a control with no name and no context.\n\n`aria-labelledby` and `aria-describedby` are the missing link. The component maps `errorMessage` to `aria-invalid` and `isRequired` to `aria-required` internally.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role",
    sourceLabel: "MDN: ARIA Listbox Role",
  },
];
