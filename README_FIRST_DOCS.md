# Feature Development Standards

The following are required standards when creating new features:

1. Ensure mobile responsiveness.
2. For frontend forms, use `useForm`.
3. For frontend form validation, use `zod`.
4. For frontend forms with array fields, use `useFieldArray`.
5. Consider and optimize for Lighthouse metrics: Performance, Accessibility, Best Practices, and SEO.

6. When adding or updating GraphQL operations in this repo, follow these rules:
   1. Create all queries/mutations/fragments as `.gql` documents under `libs/graphql/src` (domain-based files like `cart.gql`, `products.gql`, etc.).
   2. Do not write inline GraphQL (`gql` template literals) inside `.ts`/`.tsx` files.
   3. After updating `.gql` files, regenerate client types/hooks and use only generated hooks/types from `~/graphql/generated`.
   4. Keep operation names unique and PascalCase (e.g., `CheckoutMethodSettings`, `UpdatePaymentMethodStatus`).
   5. If you find existing inline GraphQL in UI code, migrate it into `libs/graphql/src/*.gql` and replace usage with generated hooks.

   Acceptance criteria:
   - New/changed operations exist in `libs/graphql/src/*.gql`.
   - UI code imports generated hooks, not inline `gql`.
   - GraphQL codegen/typecheck passes.
