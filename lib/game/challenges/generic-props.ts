import type { Challenge } from "../types";

export const genericPropsChallenges: Challenge[] = [
  {
    id: "gp-001",
    category: "generic-props",
    difficulty: "easy",
    title: "Generic list callback typing",
    badCode: `interface ListProps {
  items: unknown[];
  onSelect: (item: unknown) => void;
  renderItem: (item: unknown) => React.ReactNode;
}`,
    goodCode: `interface ListProps<T> {
  items: T[];
  onSelect: (item: T) => void;
  renderItem: (item: T) => React.ReactNode;
}`,
    correctSide: "right",
    explanationCorrect:
      "Generics let TypeScript infer the item type from the `items` array and enforce it across all related props. When you pass `items={users}`, TypeScript knows `onSelect` receives a `User` and `renderItem` receives a `User`, with zero manual type annotations needed.\n\n`unknown` throws that away: every consumer must cast.",
    explanationWrong:
      "`unknown` is type-safe in that it prevents unsafe access, but it forces every consumer to narrow the type manually. With generics, `<List items={users} onSelect={handleUser} renderItem={...} />` automatically types everything from the `items` prop. The type flows through the entire API.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/generics.html",
    sourceLabel: "TypeScript: Generics",
  },
  {
    id: "gp-002",
    category: "generic-props",
    difficulty: "easy",
    title: "Select component type safety",
    badCode: `interface SelectProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}

// Any string accepted, no constraint:
// <Select value="banana" options={roleOptions} />
// Compiles fine even though "banana" isn't a role`,
    goodCode: `interface SelectProps<V extends string = string> {
  options: Array<{ value: V; label: string }>;
  value: V;
  onChange: (value: V) => void;
}

// Constrained to valid option values:
// type Role = 'admin' | 'user' | 'guest';
// <Select<Role> value="banana" ... />
// Type error: "banana" is not assignable to Role`,
    correctSide: "right",
    explanationCorrect:
      "A generic `V` parameter constrains `value`, `onChange`, and `options` to the same type. With `<Select<Role>>`, TypeScript ensures only valid roles are passed as `value`. Without generics, any string is accepted, so `value=\"banana\"` compiles fine even when your options are roles.\n\nThe `extends string` constraint ensures values are still string-based.",
    explanationWrong:
      "When everything is `string`, there's no connection between `options` and `value`. You can pass `value=\"banana\"` with options that only contain `\"admin\"` and `\"user\"`. A generic `V` lets consumers specify the exact string literal union, so `<Select<Role>>` makes TypeScript reject anything that isn't a valid `Role`.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints",
    sourceLabel: "TypeScript: Generic Constraints",
  },
  {
    id: "gp-003",
    category: "generic-props",
    difficulty: "medium",
    title: "Constrained generic props",
    badCode: `interface DataTableProps<T> {
  data: T[];
  columns: Array<{
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
  }>;
  onRowClick?: (item: T) => void;
}`,
    goodCode: `interface DataTableProps<T extends { id: string | number }> {
  data: T[];
  columns: Array<{
    key: keyof T & string;
    header: string;
    render?: (item: T) => React.ReactNode;
  }>;
  onRowClick?: (item: T) => void;
}`,
    correctSide: "right",
    explanationCorrect:
      "Two improvements: `T extends { id: string | number }` ensures every row has a stable identity for React keys. Without this, the table can't reliably render rows. `keyof T & string` constrains `key` to actual properties of `T`, so `key: \"naem\"` (typo) is a compile-time error.\n\nThe unconstrained version accepts items with no `id` and column keys that don't exist on the data.",
    explanationWrong:
      "An unconstrained `T` accepts data without an `id` field, so the table has no way to generate stable React `key` props, leading to rendering bugs on sort/filter. Column `key: string` allows typos and non-existent fields.\n\n`T extends { id: ... }` guarantees row identity. `keyof T & string` ties column keys to actual data fields, catching errors at compile time.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints",
    sourceLabel: "TypeScript: Generic Constraints",
  },
  {
    id: "gp-004",
    category: "generic-props",
    difficulty: "medium",
    title: "Inferred generic from render prop",
    badCode: `interface ComboboxProps {
  items: Array<{ id: string; label: string }>;
  value: string | null;
  onChange: (id: string) => void;
  renderItem: (item: {
    id: string;
    label: string;
  }) => React.ReactNode;
}`,
    goodCode: `interface ComboboxProps<T extends { id: string }> {
  items: T[];
  value: T | null;
  onChange: (item: T) => void;
  renderItem: (item: T) => React.ReactNode;
}

// TypeScript infers T from items:
// <Combobox items={users}
//   value={selectedUser}
//   onChange={setSelectedUser}
//   renderItem={(u) => u.name} />`,
    correctSide: "right",
    explanationCorrect:
      "The generic version lets consumers work with their own data types. `items={users}` makes TypeScript infer `T = User`, so `onChange` receives a `User` (not a bare string ID) and `renderItem` gets full `User` access.\n\nThe non-generic version forces all data into `{id, label}`, so consumers must transform their data to fit the component.",
    explanationWrong:
      "Fixing the item shape to `{ id: string; label: string }` means every consumer must map their data before passing it. A `User` with `name` and `email` needs to be transformed into `{ id, label }`, losing type information.\n\nWith generics, the component adapts to the consumer's data type. `renderItem` receives the full `User` object, enabling `(u) => u.name` without any mapping.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/generics.html#using-type-parameters-in-generic-constraints",
    sourceLabel: "TypeScript: Type Parameters in Constraints",
  },
  {
    id: "gp-005",
    category: "generic-props",
    difficulty: "hard",
    title: "Generic form field component",
    badCode: `interface FieldProps<V> {
  name: string;
  value: V;
  onChange: (value: V) => void;
  validate?: (value: V) => string | undefined;
}

// No connection between name and form shape:
// <Field name="emial" value={...} />
// Typo compiles fine!`,
    goodCode: `interface FieldProps<
  TForm extends Record<string, unknown>,
  K extends keyof TForm & string,
> {
  name: K;
  value: TForm[K];
  onChange: (value: TForm[K]) => void;
  validate?: (value: TForm[K]) => string | undefined;
}

// <Field<SignupForm, 'email'>
//   name="email"
//   value={form.email}
//   onChange={...} />
// "emial" → type error!`,
    correctSide: "right",
    explanationCorrect:
      "Two type parameters create a type-safe link between the form shape and the field. `K extends keyof TForm` means `name` must be an actual key of the form type. `TForm[K]` ensures `value` and `onChange` match that field's type, so a `number` field can't accidentally receive a `string`.\n\nThis is the pattern used by Formik, React Hook Form, and TanStack Form.",
    explanationWrong:
      "A bare `string` for `name` means any string compiles, so typos like `\"emial\"` are invisible until runtime. A lone generic `V` for value has no connection to the form type, so a number field could receive a string with no error.\n\nTwo generics (`TForm` + `K`) tie every field to its form, catching name typos and type mismatches at compile time.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html",
    sourceLabel: "TypeScript: Indexed Access Types",
  },
];
