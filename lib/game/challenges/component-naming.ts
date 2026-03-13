import type { Challenge } from "../types";

export const componentNamingChallenges: Challenge[] = [
  {
    id: "cn-001",
    category: "component-naming",
    difficulty: "easy",
    title: "Over-specific component name",
    badCode: `function HomePageHeroSectionCallToActionButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button className="cta-btn" onClick={onClick}>
      {children}
    </button>
  );
}`,
    goodCode: `function CallToActionButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button className="cta-btn" onClick={onClick}>
      {children}
    </button>
  );
}`,
    correctSide: "right",
    explanationCorrect:
      "The component name should describe **what it is**, not **where it lives**. `CallToActionButton` is reusable anywhere. `HomePageHeroSectionCallToActionButton` bakes in its location, which discourages reuse and makes refactors painful.\n\nIf you move this button to the pricing page, the name becomes a lie.",
    explanationWrong:
      "Embedding the page, section, and layout context into a component name makes it look single-use. Other developers won't reach for `HomePageHeroSectionCallToActionButton` when building the pricing page. They'll just create a duplicate. Name components by **role**, not by **placement**.",
    sourceUrl:
      "https://react.dev/learn/your-first-component#nesting-and-organizing-components",
    sourceLabel: "React Docs: Nesting and Organizing Components",
  },
  {
    id: "cn-002",
    category: "component-naming",
    difficulty: "easy",
    title: "Ambiguous generic name",
    badCode: `function Item({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) {
  return (
    <div className="card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}`,
    goodCode: `function ProductCard({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) {
  return (
    <div className="card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}`,
    correctSide: "right",
    explanationCorrect:
      "`ProductCard` tells you exactly what domain entity it represents and what visual form it takes. `Item` is so generic it could be anything: a list item, a menu entry, a cart line.\n\nGood component names combine the **domain concept** with the **UI pattern**: `ProductCard`, `UserAvatar`, `OrderSummary`.",
    explanationWrong:
      "`Item` forces every developer to open the file and read the implementation to understand what it renders. In a codebase with multiple list-like views, you'd end up with `Item`, `Item2`, `ListItem`, `TheItem`. A specific name like `ProductCard` is self-documenting and searchable.",
    sourceUrl:
      "https://react.dev/learn/your-first-component",
    sourceLabel: "React Docs: Your First Component",
  },
  {
    id: "cn-003",
    category: "component-naming",
    difficulty: "medium",
    title: "Redundant component splitting",
    badCode: `function UserProfileHeader({ name }: { name: string }) {
  return <h2>{name}</h2>;
}

function UserProfileBio({ bio }: { bio: string }) {
  return <p>{bio}</p>;
}

function UserProfileAvatar({ src }: { src: string }) {
  return <img src={src} alt="avatar" />;
}

// Usage
<UserProfileHeader name={user.name} />
<UserProfileAvatar src={user.avatar} />
<UserProfileBio bio={user.bio} />`,
    goodCode: `function UserProfile({
  name,
  bio,
  avatarSrc,
}: {
  name: string;
  bio: string;
  avatarSrc: string;
}) {
  return (
    <div>
      <img src={avatarSrc} alt={name} />
      <h2>{name}</h2>
      <p>{bio}</p>
    </div>
  );
}

// Usage
<UserProfile
  name={user.name}
  bio={user.bio}
  avatarSrc={user.avatar}
/>`,
    correctSide: "right",
    explanationCorrect:
      "When each sub-component wraps a single HTML element and is never used independently, they add naming overhead without value. A single `UserProfile` is easier to understand, use, and maintain.\n\nSplit components when they have **independent reuse value** or **complex internal logic**, not just because the parent has multiple sections.",
    explanationWrong:
      "Three components that each render one HTML element, are always used together, and share the same data source? That's premature decomposition. The naming pattern `UserProfileHeader`, `UserProfileBio`, `UserProfileAvatar` creates the illusion of modularity, but in practice they're tightly coupled and should just be one `UserProfile`.",
    sourceUrl:
      "https://react.dev/learn/thinking-in-react#step-1-break-the-ui-into-a-component-hierarchy",
    sourceLabel: "React Docs: Thinking in React",
  },
  {
    id: "cn-004",
    category: "component-naming",
    difficulty: "easy",
    title: "Naming after implementation",
    badCode: `function StyledFlexRow({
  children,
  gap = 8,
}: {
  children: React.ReactNode;
  gap?: number;
}) {
  return (
    <div style={{ display: "flex", gap }}>
      {children}
    </div>
  );
}

// Usage
<StyledFlexRow gap={16}>
  <Avatar src={user.avatar} />
  <span>{user.name}</span>
  <RoleBadge role={user.role} />
</StyledFlexRow>`,
    goodCode: `function UserInfo({
  children,
  gap = 8,
}: {
  children: React.ReactNode;
  gap?: number;
}) {
  return (
    <div style={{ display: "flex", gap }}>
      {children}
    </div>
  );
}

// Usage
<UserInfo gap={16}>
  <Avatar src={user.avatar} />
  <span>{user.name}</span>
  <RoleBadge role={user.role} />
</UserInfo>`,
    correctSide: "right",
    explanationCorrect:
      "`UserInfo` describes **what** the component represents. `StyledFlexRow` describes **how** it's implemented: a styled div with `display: flex`. If you refactor to CSS Grid tomorrow, the name becomes a lie.\n\nName components after their **purpose in the UI**, not the CSS properties or HTML elements inside them.",
    explanationWrong:
      "`StyledFlexRow` leaks implementation details into the component tree. In JSX, `<StyledFlexRow>` reads like a CSS utility, not a meaningful UI element. Names like `FlexContainer`, `GridWrapper`, `StyledDiv` are symptoms of thinking in CSS rather than in UI concepts.\n\nAsk yourself: \"What does this represent to the user?\" not \"How is this laid out?\"",
    sourceUrl:
      "https://react.dev/learn/your-first-component",
    sourceLabel: "React Docs: Your First Component",
  },
  {
    id: "cn-005",
    category: "component-naming",
    difficulty: "easy",
    title: "Verb-based component name",
    badCode: `function RenderUserList({
  users,
}: {
  users: User[];
}) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}`,
    goodCode: `function UserList({
  users,
}: {
  users: User[];
}) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}`,
    correctSide: "right",
    explanationCorrect:
      "React components are **nouns**, not **verbs**. `UserList` is a thing you place in the tree. `RenderUserList` sounds like a function you call imperatively.\n\nThe `Render` prefix is redundant since every component renders. Reserve verb prefixes like `use` for hooks and `get`/`fetch` for utility functions.",
    explanationWrong:
      "The `Render` prefix suggests this is an imperative function rather than a declarative component. In JSX, `<RenderUserList />` reads oddly. You're not instructing React to render something, you're declaring that a user list exists here.\n\nComponents describe **what** is on screen. Hooks and helpers describe **actions**.",
    sourceUrl:
      "https://react.dev/learn/your-first-component",
    sourceLabel: "React Docs: Your First Component",
  },
  {
    id: "cn-006",
    category: "component-naming",
    difficulty: "medium",
    title: "Merging related components",
    badCode: `function ErrorAlert({
  message,
}: {
  message: string;
}) {
  return <div className="alert error">{message}</div>;
}

function SuccessAlert({
  message,
}: {
  message: string;
}) {
  return <div className="alert success">{message}</div>;
}

function WarningAlert({
  message,
}: {
  message: string;
}) {
  return <div className="alert warning">{message}</div>;
}`,
    goodCode: `function Alert({
  message,
  severity,
}: {
  message: string;
  severity: "error" | "success" | "warning";
}) {
  return (
    <div className={\`alert \${severity}\`}>
      {message}
    </div>
  );
}`,
    correctSide: "right",
    explanationCorrect:
      "Three nearly identical components that differ only in a CSS class should be one component with a `severity` prop. `Alert` is a single concept with variants, not three separate concepts.\n\nThis mirrors how design systems work: MUI has `<Alert severity=\"error\" />`, not `<ErrorAlert />`.",
    explanationWrong:
      "Separate `ErrorAlert`, `SuccessAlert`, and `WarningAlert` components triple the API surface for zero benefit. Every new variant (info, neutral) requires a new component, a new import, and a new entry in your barrel file. A single `Alert` with a `severity` union scales cleanly.",
    sourceUrl: "https://mui.com/material-ui/react-alert/",
    sourceLabel: "MUI: Alert Component",
  },
  {
    id: "cn-007",
    category: "component-naming",
    difficulty: "hard",
    title: "Compound component naming",
    badCode: `function Menu({ children }: { children: React.ReactNode }) {
  return <div role="menu">{children}</div>;
}

function MenuButtonItem({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button role="menuitem" onClick={onClick}>
      {label}
    </button>
  );
}

function MenuSectionDividerLine() {
  return <hr className="menu-divider" />;
}

// Usage
<Menu>
  <MenuButtonItem label="Cut" onClick={cut} />
  <MenuSectionDividerLine />
  <MenuButtonItem label="Paste" onClick={paste} />
</Menu>`,
    goodCode: `function Menu({ children }: { children: React.ReactNode }) {
  return <div role="menu">{children}</div>;
}

Menu.Item = function MenuItem({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button role="menuitem" onClick={onClick}>
      {label}
    </button>
  );
};

Menu.Divider = function MenuDivider() {
  return <hr className="menu-divider" />;
};

// Usage
<Menu>
  <Menu.Item label="Cut" onClick={cut} />
  <Menu.Divider />
  <Menu.Item label="Paste" onClick={paste} />
</Menu>`,
    correctSide: "right",
    explanationCorrect:
      "Dot notation (`Menu.Item`, `Menu.Divider`) makes the parent-child relationship explicit and keeps names concise. `MenuButtonItem` and `MenuSectionDividerLine` try to cram the entire hierarchy into a flat name.\n\nCompound components communicate ownership through **structure**, not through increasingly verbose prefixes.",
    explanationWrong:
      "Flat names like `MenuButtonItem` and `MenuSectionDividerLine` grow unwieldy as the component tree deepens. With dot notation, `Menu.` acts as a namespace, and sub-component names stay short: `Item`, `Divider`, `Group`.\n\nThis also improves discoverability. Type `Menu.` and your editor shows all related parts.",
    sourceUrl: "https://react.dev/learn/passing-props-to-a-component",
    sourceLabel: "React Docs: Passing Props to a Component",
  },
  {
    id: "cn-008",
    category: "component-naming",
    difficulty: "medium",
    title: "Technical suffix pollution",
    badCode: `function NotificationManager({
  notifications,
  onDismiss,
}: {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}) {
  return (
    <ul className="notification-list">
      {notifications.map((n) => (
        <li key={n.id}>
          {n.message}
          <button onClick={() => onDismiss(n.id)}>
            Dismiss
          </button>
        </li>
      ))}
    </ul>
  );
}`,
    goodCode: `function NotificationList({
  notifications,
  onDismiss,
}: {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}) {
  return (
    <ul className="notification-list">
      {notifications.map((n) => (
        <li key={n.id}>
          {n.message}
          <button onClick={() => onDismiss(n.id)}>
            Dismiss
          </button>
        </li>
      ))}
    </ul>
  );
}`,
    correctSide: "right",
    explanationCorrect:
      "`NotificationList` tells you what it renders: a list of notifications. `NotificationManager` implies business logic, state management, scheduling, lifecycle. But this component just maps over an array and renders items.\n\nSuffixes like `Manager`, `Handler`, `Controller`, and `Service` belong in backend code or hooks, not in presentational components.",
    explanationWrong:
      "`Manager` is a backend pattern that implies orchestration and state ownership. But this component receives data via props and renders it. It doesn't manage anything. When every component is a `*Manager` or `*Container`, the names stop conveying information.\n\nAsk yourself: is this component managing state, or displaying it? If it just renders, name it after the **UI element**: `NotificationList`, `NotificationFeed`, `NotificationStack`.",
    sourceUrl:
      "https://react.dev/learn/your-first-component",
    sourceLabel: "React Docs: Your First Component",
  },
];
