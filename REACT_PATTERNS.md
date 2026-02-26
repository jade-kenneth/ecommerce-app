# React Patterns Guide

This document summarizes practical React patterns used in modern apps and highlights which ones fit this codebase (Next.js App Router + monorepo).

## How To Use This Guide

- Use this as a reference when designing new features.
- Prefer simple patterns first; add abstraction only when repetition becomes real.
- Match the existing project structure and conventions before introducing new patterns.

## Patterns That Matter Most In This Project

For this repo, these patterns are the most useful day-to-day:

1. Custom Hooks
2. Provider Pattern
3. Colocation by Feature
4. Server State Pattern (Apollo / query hooks)
5. HOC Pattern (admin guards/layout wrappers)
6. Suspense + Client/Server boundaries (Next.js App Router)

## 1. Custom Hooks Pattern

Custom hooks extract reusable logic out of UI components.

### Why it is powerful

- Reusable logic
- Cleaner components
- Better separation of concerns
- Easier testing

### Example

```tsx
function useAuth() {
  const [user, setUser] = useState(null);

  const login = async (data: unknown) => {
    // auth logic
  };

  const logout = () => {
    // logout logic
  };

  return { user, login, logout };
}
```

```tsx
function LoginPage() {
  const { user, login } = useAuth();

  return <button onClick={() => login({})}>{user ? 'Continue' : 'Login'}</button>;
}
```

### Project note

- This repo already uses hook-driven patterns (for example auth/session and store selectors).
- Prefer adding hooks under the relevant feature/module instead of a global `hooks/` dump when the hook is feature-specific.

## 2. Compound Component Pattern

Compound components expose a declarative API by grouping related subcomponents.

### Example

```tsx
<Modal>
  <Modal.Header />
  <Modal.Body />
  <Modal.Footer />
</Modal>
```

### Why it is useful

- Flexible API
- Clean composition
- Reduces prop drilling
- Great for shared UI libraries/design systems

## 3. Controlled vs Uncontrolled Pattern

This pattern is foundational for forms.

### Controlled input

```tsx
<input value={value} onChange={(e) => setValue(e.target.value)} />
```

### Uncontrolled input

```tsx
<input ref={inputRef} />
```

### Notes

- Controlled inputs are easier to validate and synchronize with UI state.
- Uncontrolled inputs can be more performant in large forms.
- Libraries like React Hook Form often combine both approaches.

## 4. Render Props Pattern

Render props are less common in new code (hooks often replace them), but the concept is still important.

### Example

```tsx
<DataFetcher>{(data) => <UI data={data} />}</DataFetcher>
```

### When to use

- Headless/logic-heavy components that need flexible rendering
- Legacy codebases
- Interop with libraries that still expose render-prop APIs

## 5. Higher-Order Component (HOC) Pattern

HOCs wrap a component and add behavior (auth, layout, permissions, analytics, etc.).

### Example

```tsx
const withAuth = (Component: React.ComponentType) => {
  return function Wrapped(props: Record<string, unknown>) {
    const user = null;

    if (!user) return <Login />;
    return <Component {...props} />;
  };
};
```

### Project note

- This repo uses an admin layout/guard HOC (`withLayout`) for access control and layout composition.
- Use HOCs when the concern is cross-cutting and page-level (auth, roles, route wrapper behavior).
- Prefer hooks for local reusable logic.

## 6. Provider Pattern (Beyond Basic Context)

Providers inject app-wide dependencies/services.

### Examples

- Redux Provider
- Apollo Provider
- TanStack Query Provider
- Auth Provider
- Theme Provider

```tsx
<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

### Why it is useful

- Centralized dependency injection
- Shared app services (auth, API clients, cache)
- Cleaner component trees than prop-threading global dependencies

### Project note

- Your app root already composes multiple providers (`AuthProvider`, Apollo client/provider, cart, license, etc.).
- Keep provider responsibilities narrow and explicit.

## 7. State Machine Pattern

State machines (or reducer-driven finite states) help prevent impossible UI states.

### Instead of scattered booleans

```ts
isLoading;
isError;
isSuccess;
```

### Prefer explicit state

```ts
status: 'idle' | 'loading' | 'success' | 'error';
```

### Where this helps most

- Multi-step forms
- Payment flows
- Authentication flows
- Complex async UI with retries/cancel states

## 8. Headless Component Pattern

Headless components provide logic/behavior without enforcing styling.

### Used by libraries like

- Radix UI
- TanStack Table
- Downshift

### Example

```tsx
const { getInputProps } = useAutocomplete();
```

You own the UI; the library owns the interaction logic.

## 9. Colocation Pattern (Feature-First Organization)

Colocate files by feature, not by file type.

### Avoid (type-based folders only)

```txt
components/
hooks/
types/
```

### Prefer (feature-based)

```txt
features/
  auth/
    AuthProvider.tsx
    useAuth.ts
    types.ts
```

### Why it scales better

- Easier navigation
- Better encapsulation
- Cleaner ownership boundaries
- Especially useful in monorepos

### Project note

- This repo already leans toward feature modules (`libs/features/src/...`).
- Continue colocating hooks, types, and helpers with the feature that owns them.

## 10. Atomic Design Pattern

Atomic design is a UI architecture approach.

### Layers

- Atoms
- Molecules
- Organisms
- Templates
- Pages

### When it helps

- Shared design systems
- Large UI libraries
- Teams that need strong naming consistency

### Caution

- Do not force atomic naming everywhere if feature-based organization is clearer.

## 11. Server State Pattern (Apollo / TanStack Query Style)

Server state is not the same as local UI state.

### Avoid manual async state everywhere

```tsx
useEffect(() => {
  // fetch + loading + error + retry manually
}, []);
```

### Prefer data hooks

```tsx
const { data, loading, error } = useProductsQuery();
```

or

```tsx
const query = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
});
```

### Why it is powerful

- Cache management
- Refetching and invalidation
- Better loading/error consistency
- Clear separation of server vs client state

### Project note

- This app already uses generated GraphQL hooks (`useProductsQuery`, `useMyOrdersQuery`, etc.).
- Prefer extending that pattern rather than adding ad-hoc fetch logic in components.

## 12. Suspense Pattern (Concurrent React / App Router)

Suspense is useful for loading boundaries and async UI composition.

### Example

```tsx
<Suspense fallback={<Spinner />}>
  <Component />
</Suspense>
```

### Often combined with

- `React.lazy`
- Next.js App Router streaming
- Server/Client component boundaries

### Project note

- In Next.js App Router, be careful with hydration mismatches.
- Ensure server-rendered and client-rendered markup stays stable during hydration.

## 13. Inversion of Control Pattern

Let consumers provide behavior or rendering details instead of hardcoding them.

### Examples

```tsx
<Modal onClose={handleClose} />
```

```tsx
<Dropdown renderItem={(item) => <CustomItem item={item} />} />
```

### Why it helps

- Flexibility
- Reusability
- Better composition APIs

## Practical Rules For This Codebase

### Prefer

- Feature-colocated files
- Custom hooks for reusable logic
- Provider composition for app-wide services
- Generated GraphQL hooks for server data
- HOCs only for page-level cross-cutting concerns (auth/layout/permissions)

### Avoid

- Repeating async fetch logic in multiple components
- Over-abstracting early
- Mixing unrelated feature logic in global utility folders
- Hydration-unstable UI (random values, browser-only branches in render)

## Pattern Selection Cheat Sheet

- Need reusable behavior inside components: use a custom hook
- Need global dependency/service: use a provider
- Need page wrapper/auth gate/layout: use a HOC
- Need flexible subcomponent API: use compound components
- Need complex state transitions: use reducer/state machine
- Need customizable logic with no styling: use headless component pattern

## Summary

React patterns are tools, not rules. The best pattern is the one that:

- solves a real problem,
- matches the scale of the feature,
- fits the existing codebase conventions, and
- keeps components easier to reason about.
