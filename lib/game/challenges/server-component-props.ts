import type { Challenge } from "../types";

export const serverComponentPropsChallenges: Challenge[] = [
  {
    id: "sc-001",
    category: "server-component-props",
    difficulty: "easy",
    title: "Serializable callback props",
    badCode: `// ServerPage.tsx (Server Component)

<ClientForm
  onSubmit={(data: FormData) => {
    saveToDatabase(data);
  }}
/>`,
    goodCode: `// ServerPage.tsx (Server Component)
import { saveFormAction } from './actions';

<ClientForm
  action={saveFormAction}
/>`,
    correctSide: "right",
    explanationCorrect:
      "Functions can't be passed from Server Components to Client Components — they aren't serializable. Server Actions (declared with `'use server'`) are the exception: they get a serializable reference that the client can invoke.\n\nUsing `action` instead of `onSubmit` follows React 19's form action convention.",
    explanationWrong:
      "Inline functions aren't serializable. When a Server Component renders a Client Component, all props are serialized and sent over the network. Regular functions, class instances, and Symbols can't survive this serialization.\n\nServer Actions solve this by generating a serializable reference. The `action` prop name follows React 19's `<form action={...}>` convention.",
    sourceUrl:
      "https://react.dev/reference/rsc/server-actions",
    sourceLabel: "React Docs: Server Actions",
  },
  {
    id: "sc-002",
    category: "server-component-props",
    difficulty: "easy",
    title: "Passing server content to client wrappers",
    badCode: `// page.tsx (Server Component)

<AnimatedContainer
  title={article.title}
  body={article.body}
  author={article.author}
  publishedAt={article.publishedAt}
/>`,
    goodCode: `// page.tsx (Server Component)

<AnimatedContainer>
  <ArticleContent article={article} />
</AnimatedContainer>`,
    correctSide: "right",
    explanationCorrect:
      "The \"donut pattern\": a Client Component (`AnimatedContainer`) wraps Server Component children. The client handles interactivity (animations), while the server renders the data-heavy content. All article data stays server-side — no serialization needed.\n\nPassing raw data forces the client to render the article, losing the benefits of Server Components.",
    explanationWrong:
      "Passing all article fields as props means every field must be serialized and sent to the client. The `AnimatedContainer` becomes a Client Component that now needs to render article content, pulling that logic client-side.\n\nWith the donut pattern, `ArticleContent` stays a Server Component (rendered on the server) and is passed as `children` to the Client Component that only handles animation.",
    sourceUrl:
      "https://nextjs.org/docs/app/getting-started/server-and-client-components",
    sourceLabel: "Next.js: Server and Client Components",
  },
  {
    id: "sc-003",
    category: "server-component-props",
    difficulty: "medium",
    title: "Form action vs onSubmit",
    badCode: `'use client';

interface ContactFormProps {
  /** Called when the form is submitted. */
  onSubmit: (data: FormData) => Promise<void>;
  /** Shows a loading spinner. */
  isPending: boolean;
}`,
    goodCode: `'use client';

interface ContactFormProps {
  /**
   * Server Action invoked on form submission.
   * Passed to <form action={...}>.
   */
  action: (formData: FormData) => Promise<void>;
}

// isPending comes from useActionState:
// const [state, formAction, isPending] =
//   useActionState(action, initialState);`,
    correctSide: "right",
    explanationCorrect:
      "React 19's `<form action={...}>` pattern handles pending state automatically via `useActionState` or `useFormStatus`. Passing `isPending` as a prop duplicates what the framework already provides.\n\nNaming the prop `action` (not `onSubmit`) signals it's a Server Action, not a client-side event handler.",
    explanationWrong:
      "Manually managing `isPending` as a prop is the pre-React 19 pattern. With `useActionState`, pending state is derived automatically from the action's Promise lifecycle. The `action` naming convention distinguishes Server Actions from client callbacks — `onSubmit` implies client-side handling.",
    sourceUrl: "https://react.dev/reference/react/useActionState",
    sourceLabel: "React Docs: useActionState",
  },
  {
    id: "sc-004",
    category: "server-component-props",
    difficulty: "medium",
    title: "Non-serializable prop types",
    badCode: `// Server Component
<ClientEditor
  pattern={highlightPattern}
  metadata={documentMeta}
/>

// Client Component
interface ClientEditorProps {
  pattern: RegExp;
  metadata: DocumentMeta; // class instance
}`,
    goodCode: `// Server Component
<ClientEditor
  pattern={highlightPattern.source}
  metadata={{
    title: documentMeta.title,
    wordCount: documentMeta.wordCount,
  }}
/>

// Client Component
interface ClientEditorProps {
  pattern: string;
  metadata: { title: string; wordCount: number };
}`,
    correctSide: "right",
    explanationCorrect:
      "`RegExp` and class instances are not serializable across the server/client boundary. Convert to serializable equivalents: `RegExp` → its `.source` string, class instances → plain objects with only the needed fields.\n\nSerializable types include: primitives, `Date`, `Map`, `Set`, `BigInt`, typed arrays, plain objects, and arrays. NOT serializable: `RegExp`, class instances, `WeakMap`, `Symbol`, and functions.",
    explanationWrong:
      "Props crossing the server/client boundary must be serializable by React's RSC protocol. `RegExp` and custom class instances can't survive serialization — TypeScript compiles fine but the runtime throws.\n\nConvert to plain serializable equivalents: extract `.source` from RegExp, destructure class instances into plain objects. Reconstruct on the client if needed.",
    sourceUrl:
      "https://react.dev/reference/rsc/use-client#serializable-types",
    sourceLabel: "React Docs: Serializable Types",
  },
  {
    id: "sc-005",
    category: "server-component-props",
    difficulty: "hard",
    title: "Avoiding unnecessary client boundaries",
    badCode: `'use client';

interface ProductPageProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    reviews: Review[];
  };
  onAddToCart: () => void;
  onToggleWishlist: () => void;
}`,
    goodCode: `// ProductPage — Server Component
interface ProductPageProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    reviews: Review[];
  };
}

// AddToCartButton — Client Component
interface AddToCartButtonProps {
  productId: string;
  action: (id: string) => Promise<void>;
}`,
    correctSide: "right",
    explanationCorrect:
      "Making the entire page a Client Component just because two buttons need interactivity forces all product data to be serialized and sent to the client. Instead, keep the page as a Server Component and push `'use client'` to the smallest leaf components.\n\nOnly the button needs to be a Client Component — it receives just a `productId` and a Server Action, not the full product object.",
    explanationWrong:
      "A single `onAddToCart` callback forces the entire page to `'use client'`, serializing the full product object, all reviews, and every nested field. This defeats Server Components.\n\nPush the client boundary down to the interactive leaf: the button only needs a `productId` and a Server Action. The product details, reviews, and description stay server-rendered with zero client JavaScript.",
    sourceUrl:
      "https://nextjs.org/docs/app/getting-started/server-and-client-components",
    sourceLabel: "Next.js: Server and Client Components",
  },
];
