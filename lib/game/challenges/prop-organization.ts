import type { Challenge } from "../types";

export const propOrganizationChallenges: Challenge[] = [
  {
    id: "po-001",
    category: "prop-organization",
    difficulty: "easy",
    title: "Group related data props",
    badCode: `interface ProfileCardProps {
  userName: string;
  userEmail: string;
  userAvatar: string;
  userRole: 'admin' | 'member' | 'viewer';
  onEdit: () => void;
}`,
    goodCode: `interface User {
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'member' | 'viewer';
}

interface ProfileCardProps {
  user: User;
  onEdit: () => void;
}`,
    correctSide: "right",
    explanationCorrect:
      "Four `user*` props that always travel together belong in a `User` type. The component receives one structured object instead of four loose strings. If User gains a `phone` field later, only the type changes — not every component that forwards user data.",
    explanationWrong:
      "Flat props with a shared prefix (`userName`, `userEmail`, `userAvatar`, `userRole`) are a sign they belong to one concept. Passing them individually means every consumer must destructure and forward four props instead of one. Group related data into a typed object.",
    sourceUrl: "https://react.dev/learn/passing-props-to-a-component",
    sourceLabel: "React Docs: Passing Props",
  },
  {
    id: "po-002",
    category: "prop-organization",
    difficulty: "easy",
    title: "Remove derived props",
    badCode: `interface ProductListProps {
  products: Product[];
  productCount: number;
  hasProducts: boolean;
  isEmpty: boolean;
  onProductSelect: (product: Product) => void;
}`,
    goodCode: `interface ProductListProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

// Derive inside the component:
// const isEmpty = products.length === 0;
// const productCount = products.length;`,
    correctSide: "right",
    explanationCorrect:
      "Three of the five props are derivable from `products`. `productCount` is `products.length`, `hasProducts` is `products.length > 0`, and `isEmpty` is its inverse. Redundant props invite bugs: what happens when `products` has 3 items but `isEmpty` is `true`?",
    explanationWrong:
      "`productCount`, `hasProducts`, and `isEmpty` are all computable from `products.length`. Passing them as separate props creates three extra sources of truth for the same data. Derive values inside the component to eliminate the possibility of inconsistency.",
    sourceUrl:
      "https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state",
    sourceLabel: "React Docs: Avoid Redundant State",
  },
  {
    id: "po-003",
    category: "prop-organization",
    difficulty: "medium",
    title: "Boolean flag explosion",
    badCode: `interface ButtonProps {
  children: React.ReactNode;
  isPrimary?: boolean;
  isSecondary?: boolean;
  isDanger?: boolean;
  isOutlined?: boolean;
  isGhost?: boolean;
  isSmall?: boolean;
  isLarge?: boolean;
  onClick?: () => void;
}`,
    goodCode: `interface ButtonProps {
  children: React.ReactNode;
  /** @default 'primary' */
  variant?: 'primary' | 'secondary' | 'danger';
  /** @default 'filled' */
  appearance?: 'filled' | 'outlined' | 'ghost';
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}`,
    correctSide: "right",
    explanationCorrect:
      "Seven booleans collapsed into three union props. Unions enforce mutual exclusivity — a button can't be both `primary` and `danger`. Booleans allow impossible combos like `<Button isPrimary isDanger isOutlined isGhost />`. Each union prop represents one independent design axis.",
    explanationWrong:
      "Mutually exclusive options should never be separate booleans. `isPrimary` and `isDanger` can't both be true, but nothing prevents `<Button isPrimary isDanger />`. Union types like `variant: 'primary' | 'danger'` enforce exactly one choice. Seven boolean props become three self-documenting unions.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types",
    sourceLabel: "TypeScript: Union Types",
  },
  {
    id: "po-004",
    category: "prop-organization",
    difficulty: "medium",
    title: "Structure flat coordinate props",
    badCode: `interface MapViewProps {
  centerLat: number;
  centerLng: number;
  zoomLevel: number;
  minZoom: number;
  maxZoom: number;
  markerLat?: number;
  markerLng?: number;
  markerLabel?: string;
  onMapClick: (lat: number, lng: number) => void;
}`,
    goodCode: `interface LatLng {
  lat: number;
  lng: number;
}

interface MapViewProps {
  center: LatLng;
  zoom: number;
  zoomRange?: { min: number; max: number };
  marker?: { position: LatLng; label: string };
  onMapClick: (position: LatLng) => void;
}`,
    correctSide: "right",
    explanationCorrect:
      "Nine flat props become five structured ones. `center` groups lat/lng into a reusable `LatLng` type. `marker` is optional as a whole — you don't need three independent optional props that are only valid together. The callback receives a `LatLng` instead of two loose numbers, consistent with the rest of the API.",
    explanationWrong:
      "Flat props with shared prefixes (`centerLat`/`centerLng`, `markerLat`/`markerLng`) signal missing structure. A marker always has both a position and a label — three independent optionals allow passing `markerLabel` without a position. Grouping into typed objects makes relationships explicit and the API smaller.",
    sourceUrl: "https://react.dev/learn/passing-props-to-a-component",
    sourceLabel: "React Docs: Passing Props",
  },
  {
    id: "po-005",
    category: "prop-organization",
    difficulty: "hard",
    title: "Extract sub-component via slot",
    badCode: `interface ArticlePageProps {
  title: string;
  content: string;
  author: string;
  publishedAt: Date;
  toolbarPosition?: 'top' | 'bottom';
  isShareVisible?: boolean;
  isBookmarkVisible?: boolean;
  isPrintVisible?: boolean;
  onShare?: () => void;
  onBookmark?: () => void;
  onPrint?: () => void;
}`,
    goodCode: `interface ArticlePageProps {
  title: string;
  content: string;
  author: string;
  publishedAt: Date;
  /** Toolbar rendered above the content. */
  toolbar?: React.ReactNode;
}

// Usage:
// <ArticlePage title="..." content="..."
//   toolbar={
//     <ArticleToolbar
//       onShare={handleShare}
//       onBookmark={handleBookmark}
//     />
//   }
// />`,
    correctSide: "right",
    explanationCorrect:
      "Six out of eleven original props belonged to the toolbar, not the article. Extracting the toolbar into a `ReactNode` slot cuts the interface in half. Consumers compose their own toolbar — or omit it entirely. The ArticlePage no longer needs to know what toolbar actions exist.",
    explanationWrong:
      "When half your props share a concern (`toolbar*`, `is*Visible`, `on*`), that's a sub-component trying to escape. Each new action (export, translate) adds two more props. A `ReactNode` slot delegates toolbar composition to the consumer, keeping ArticlePage focused on displaying the article.",
    sourceUrl:
      "https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children",
    sourceLabel: "React Docs: Passing JSX as children",
  },
  {
    id: "po-006",
    category: "prop-organization",
    difficulty: "hard",
    title: "Encapsulate internal state",
    badCode: `interface SearchInputProps {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder?: string;
  results: SearchResult[];
  onResultSelect: (result: SearchResult) => void;
  isDropdownOpen: boolean;
  onDropdownToggle: () => void;
  highlightedIndex: number;
  onHighlightChange: (index: number) => void;
  isLoading?: boolean;
}`,
    goodCode: `interface SearchInputProps {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder?: string;
  results: SearchResult[];
  onResultSelect: (result: SearchResult) => void;
  isLoading?: boolean;
}

// Dropdown open state, highlighted index, and
// keyboard navigation are managed internally.
// The parent controls data and selection only.`,
    correctSide: "right",
    explanationCorrect:
      "Not every piece of state needs to be a prop. Dropdown visibility and keyboard-highlighted index are UI interaction details — the parent doesn't care which item is highlighted. Exposing internal state as props forces the parent to reimplement dropdown behavior. Keep the API to what the parent actually needs: data in, selection out.",
    explanationWrong:
      "Exposing `isDropdownOpen`, `highlightedIndex`, and their callbacks makes the parent responsible for reimplementing dropdown keyboard navigation. This isn't flexibility — it's leaking implementation details. A SearchInput should manage its own dropdown state, just like a native `<select>` manages its own open state.",
    sourceUrl:
      "https://react.dev/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state",
    sourceLabel: "React Docs: Minimal UI State",
  },
];
