# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint with auto-fix, always run this command after creating/editing files
```

Cypress e2e tests live in `cypress/e2e/`. There is no unit test setup — only Cypress.

## Environment

Requires the backend running locally. The API base URL is set via `NEXT_PUBLIC_API_ENDPOINT` in `.env`. The backend repo is at https://github.com/Aaron-24DucAnh24/Petopia-Backend.git.

`next.config.js` whitelists `localhost:9000` and `127.0.0.1:9000` as image sources (MinIO). Images from `127.0.0.1` are intentionally blocked from rendering in the app itself (see `next.config.js` remote patterns — only `localhost:9000` is trusted at runtime).

## Architecture

### Routing — Next.js App Router with route groups

- `app/(authentication)/` — login, register, password reset. Has its own layout (no navbar/footer).
- `app/(pages)/` — all authenticated pages. Layout wraps every page with `<Navbar>` and `<Footer>`.
- `middleware.ts` guards `/give-pet`, `/user`, `/pet` routes: redirects unauthenticated users to `/login` and stores the intended path in a cookie (`COOKIES_NAME.REDIRECT`) for post-login redirect.

Pages are thin — they import and render a single feature component from `src/components/`.

### Data fetching — react-query v3 via custom wrappers

All queries and mutations use the wrappers in `src/utils/hooks.ts` (`useQuery`, `useMutation`), which type responses as `AxiosResponse<TData>` and errors as `AxiosResponse<IApiErrorResponse>`.

Components that use react-query must be wrapped with `QueryProvider` (a HOC in `src/components/common/QueryProvider.tsx`). It creates a new `QueryClient` per component tree. Usage:

```tsx
export const MyPage = QueryProvider(() => {
  const query = useQuery([QUERY_KEYS.SOMETHING], fetchFn, { ... });
  // ...
});
```

All query key strings are centralised in `QUERY_KEYS` in `src/utils/constants.ts`.

### HTTP client — `src/services/http.ts`

A singleton `Http` class wrapping Axios. Reads `NEXT_PUBLIC_API_ENDPOINT` as `baseURL`. Attaches `accessTokenServer` cookie as Bearer token on every request. On 401, clears auth cookies and redirects to `/login`.

API modules in `src/services/*.api.ts` call `http.get/post/put/delete` with relative paths (no `/api` prefix needed — the backend handles that). Response shape from the backend is `IApiResponse<T>` (`{ data: T, pageSize?, totalNumber?, ... }`), accessed as `response.data.data`.

### State management — MobX

`src/stores/user.store.ts` holds `userContext: ICurrentUserCoreResponse | null` (id, email, image, role, name). It hydrates from `localStorage` on app init and persists there on fetch.

Access in components via `useStores()` from `src/stores/index.ts`. The store is a plain singleton — `useStores()` wraps it in a React context but there is no Provider; the context default value is the singleton itself.

### Image uploads

All file uploads go through `src/services/storage.api.ts` → `POST /Storage/UploadMany`. Build a single `FormData`, append each file under the key `images`, call `uploadMany(formData)`. The response is `string[]` of URLs, cast with `response.data as string[]`. Always upload images first, then include the returned URLs in the entity creation payload.

### Rich text

CKEditor 5 is used for rich text. The editor output is HTML. Always render stored content with `dangerouslySetInnerHTML={{ __html: content }}` — never as a plain text node.

### Forms

Forms use `react-hook-form`. Image upload state (`files`, `showImages`, `images`) is managed in a separate `useForm<IUploadImage>` instance alongside the main data form. The `Dropzone` component writes to this form via `setValue`/`watch` props.

### Validation

Field validation rules live in `src/json/*.json` files. `src/utils/ValidatorManager.ts` / `Validator.ts` consume these rules. The `src/utils/ValueTextManager.ts` / `ValueText.ts` helpers map enum values to display strings.
