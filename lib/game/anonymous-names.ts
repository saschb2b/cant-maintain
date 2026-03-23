const ADJECTIVES = [
  "async",
  "static",
  "abstract",
  "generic",
  "readonly",
  "mutable",
  "lazy",
  "strict",
  "recursive",
  "polymorphic",
  "nullable",
  "virtual",
  "atomic",
  "volatile",
  "idempotent",
  "deterministic",
  "declarative",
  "composable",
  "immutable",
  "ephemeral",
];

const NOUNS = [
  "dev",
  "node",
  "ref",
  "hook",
  "prop",
  "lint",
  "diff",
  "fork",
  "patch",
  "stack",
  "cache",
  "pixel",
  "cursor",
  "module",
  "socket",
  "thread",
  "kernel",
  "lambda",
  "tensor",
  "vertex",
];

export function generateAnonymousName(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]!;
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]!;
  return `${adj}_${noun}`;
}
