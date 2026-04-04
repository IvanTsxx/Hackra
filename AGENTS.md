# Hackra — Agent Guidelines

Hackra is a hackathon platform built with Next.js 16, React 19, TypeScript, Prisma 7 (PostgreSQL), Better Auth, Tailwind CSS 4, and shadcn/ui. Package manager: **Bun**.

## Commands

| Command               | Description                                |
| --------------------- | ------------------------------------------ |
| `bun run dev`         | Start dev server (Turbopack)               |
| `bun run build`       | Production build                           |
| `bun run start`       | Start production server                    |
| `bun run typecheck`   | TypeScript check (`tsc --noEmit`)          |
| `bun run check`       | Ultracite lint + format check              |
| `bun run fix`         | Ultracite auto-fix (run before committing) |
| `bun run db:push`     | Push Prisma schema to DB                   |
| `bun run db:generate` | Generate Prisma client                     |
| `bun run db:migrate`  | Run Prisma migrations                      |
| `bun run db:studio`   | Open Prisma Studio                         |
| `bun run db:seed`     | Seed database                              |
| `bun run db:reset`    | Reset DB + regenerate + seed               |

**Tests**: No test framework installed. When adding tests, prefer Vitest. Use `it()`/`test()` with async/await (no `done` callbacks). Don't commit `.only` or `.skip`.

**Husky + lint-staged**: Pre-commit hook runs `bun x ultracite fix` on `*.{js,jsx,ts,tsx,json,jsonc,css,scss,md,mdx}`.

## Code Style

**Ultracite** (Oxlint + Oxfmt) is the single source of truth. Run `bun run fix` before committing.

### Formatting (Oxfmt)

- 80 char print width, 2-space indent, spaces (no tabs)
- Double quotes, semicolons required, trailing commas (ES5)
- LF line endings, bracket spacing enabled, arrow parens always
- Imports auto-sorted ascending, case-insensitive, grouped with blank lines
- `bracketSameLine: false`, `quoteProps: "as-needed"`

### Disabled Oxlint Rules

`func-style`, `curly`, `no-nested-ternary`, `no-use-before-define`, `complexity`, `no-shadow`, `nextjs/no-img-element`, `max-statements`, `no-negated-condition`, `unicorn/catch-error-name`, `unicorn/no-array-reduce`, `unicorn/no-nested-ternary`

### TypeScript

- Strict mode, `noEmit`, `moduleResolution: bundler`, `target: ES2017`
- Prefer explicit types for function signatures and return values
- Use `unknown` over `any`; leverage type narrowing over assertions
- Use `as const` for immutable values and literal types
- Extract magic numbers into named constants

### React

- Function components only (no classes), `"use client"` for client components
- Server components by default (no directive needed)
- Hooks at top level only, never conditionally — specify all dependencies
- React 19: use `ref` as prop (no `forwardRef`), define props via `interface`
- Use `key` prop on iterables (prefer unique IDs over indices)
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility

### Naming Conventions

- **Files**: kebab-case (`hackathon-card.tsx`, `use-auth.ts`)
- **Components**: PascalCase (`HackathonCard`, `ThemeProvider`)
- **Functions/variables**: camelCase (`getHackathons`, `isLoading`)
- **Types/interfaces**: PascalCase (`HackathonCardProps`, `TeamMember`)
- **Database models**: PascalCase in Prisma, snake_case tables via `@@map()`
- **Constants**: UPPER_SNAKE_CASE for true constants

### Import Order

1. External packages (`next`, `react`, `@prisma/client`)
2. Internal `@/` aliased imports
3. Relative imports (`./`, `../`)

### Error Handling

- Throw `Error` objects with descriptive messages, never strings
- Use `try-catch` meaningfully — don't catch just to rethrow
- Prefer early returns over nested conditionals
- Remove `console.log`/`debugger`/`alert` from production code
- Validate/sanitize user input with Zod schemas

### Security

- Add `rel="noopener"` on `target="_blank"` links
- Avoid `dangerouslySetInnerHTML`; never use `eval()`
- Never assign directly to `document.cookie`

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals, not inside loops
- Prefer specific imports over namespace imports (`import { foo }` not `import * as`)
- Avoid barrel files (index files that re-export everything)
- Use Next.js `<Image>` over `<img>` tags

## Project Structure

```
app/                    — Next.js App Router (routes, layouts, API)
  api/auth/[...all]/    — Better Auth catch-all route
  generated/prisma/     — Auto-generated Prisma client (gitignored)
shared/                 — Shared code
  components/           — Feature components (navbar, cards, etc.)
  components/ui/        — shadcn/ui primitives
  lib/                  — Utilities (auth, prisma, utils, email)
prisma/                 — Database schema + migrations
emails/                 — React Email templates
```

## Path Aliases

- `@/*` → root
- `@/shared/*` → `./shared/*`
- `@/components/*` → `./shared/components/*`
- `@/ui/*` → `./shared/components/ui/*`
- `@/lib/*` → `./shared/lib/*`
- `@/hooks/*` → `./shared/hooks/*`
- `@/utils/*` → `./shared/utils/*`

## Data Security (Next.js Best Practices)

### Data Access Layer (DAL) Pattern

For new features, create a dedicated **Data Access Layer** — internal `server-only` modules that control data access:

- Mark DAL files with `import 'server-only'` at the top
- Perform authorization checks inside the DAL, not in components
- Return minimal **Data Transfer Objects (DTOs)**, not raw database records
- Only the DAL should access `process.env` and database packages
- Use `cache()` from React for shared helpers (e.g., `getCurrentUser`)

```ts
// data/user-dto.ts
import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";

export const getCurrentUser = cache(async () => {
  const token = cookies().get("session");
  // ... validate and return minimal user info
});

export async function getProfileDTO(slug: string) {
  const currentUser = await getCurrentUser();
  const userData = await db.user.findUnique({ where: { slug } });
  return { username: userData?.username, bio: userData?.bio };
}
```

### Server Actions Security

- **Always re-verify auth inside actions** — page-level checks do NOT extend to Server Actions
- **Check authorization (resource ownership)**, not just authentication — prevent IDOR vulnerabilities
- **Validate all client input** — `searchParams`, `formData`, headers are untrusted
- **Return minimal data** — only what the UI needs, never full database records
- **No mutations during rendering** — use Server Actions for all side effects
- **Use DAL for mutations** — keep `"use server"` files thin, delegate auth + DB logic to `server-only` modules

### Server vs Client Security Model

| Server Components                | Client Components                                        |
| -------------------------------- | -------------------------------------------------------- |
| Run only on server               | Run on server (prerender) AND browser                    |
| Can access secrets, DB, env vars | Must NOT access privileged data or `server-only` modules |
| Safe by default                  | Follow browser security assumptions                      |

- Use `import 'server-only'` to prevent server code from leaking to client bundles
- Props passed to client components must be serializable and safe for public exposure
- Avoid passing sensitive data through component trees — read from DAL directly

### Audit Checklist

- **DAL**: Are DB packages and `process.env` only imported in `server-only` modules?
- **`"use client"` files**: Are props expecting private data? Are type signatures overly broad?
- **`"use server"` files**: Are args validated? Is user re-authorized? Does action check resource ownership?
- **`/[param]/` folders**: Are params validated as user input?
- **`route.ts`**: Audit carefully — has elevated power

## Next.js Best Practices

### RSC Boundaries

- **Server Components by default** — only add `"use client"` when needed
- **Never make client components async** — fetch data in parent server component, pass as props
- **Props to client components must be serializable** — no `Date`, `Map`, `Set`, class instances, or functions
- Convert `Date` to `.toISOString()` before passing to client components

### Async Patterns (Next.js 15+)

- `params` and `searchParams` are **Promises** — always `await` them
- `cookies()` and `headers()` are **async**
- Type page props as: `type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ q?: string }> }`

### Data Fetching

- **Reads**: Fetch directly in Server Components (no API layer needed)
- **Mutations**: Use Server Actions (`"use server"`) with `revalidatePath`/`revalidateTag`
- **External APIs/Webhooks**: Use Route Handlers (`route.ts`)
- Use `cache()` from React to deduplicate fetches between `generateMetadata` and page

### Error Handling

- Use `error.tsx` (must be `"use client"`) for route-level errors
- Use `global-error.tsx` (must include `<html>` and `<body>`) for root layout errors
- Use `notFound()` for 404s, `redirect()` for navigation
- **Don't wrap navigation APIs in try-catch** — they throw special errors Next.js handles internally

### Metadata & SEO

- Use `metadata` export for static metadata, `generateMetadata` for dynamic
- Both only work in **Server Components** — move client logic to child components
- Use `cache()` to avoid duplicate fetches between metadata and page content

### Suspense Boundaries

- `useSearchParams()` always requires wrapping in `<Suspense>`
- `usePathname()` requires Suspense in dynamic routes

### Route Handlers

- `route.ts` and `page.tsx` **cannot coexist** in the same folder
- Use Server Actions for UI mutations, Route Handlers for external APIs/webhooks

## Conventions

**Database**: Prisma singleton with `globalForPrisma`. Uses `@prisma/adapter-pg` with `@neondatabase/serverless` for PostgreSQL. All models use `@@map()` for snake_case table names.

**Auth**: Better Auth with OAuth only (GitHub + Google). Session: 7 days. Additional user fields: `username` (required), `bio`, `githubUsername`, `location`, `position`, `techStack`, `karmaPoints`.

**Styling**: Tailwind CSS v4 with `@import "tailwindcss"`. CSS variables with oklch. Brand colors: `--brand-green`, `--brand-purple`. Custom utilities: `.glass`, `.glow-green`, `.pixel-grid`, `.scanlines`, `.pixel-border`. Use `cn()` for conditional classes. `--radius: 0` (sharp corners by default).

**State**: `nuqs` for URL search params (wrapped in `<NuqsAdapter>` in layout). No global state manager.

## Key Files

- `shared/lib/auth.ts` — Better Auth configuration
- `shared/lib/prisma.ts` — Prisma client singleton
- `shared/lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)
- `prisma/schema.prisma` — Database schema
- `next.config.ts` — Next.js configuration
- `app/globals.css` — Tailwind v4 theme, CSS variables
- `app/layout.tsx` — Root layout (ThemeProvider, NuqsAdapter, Navbar, Footer)

Run `bun run fix` before committing. Focus on business logic, naming, architecture, and edge cases — Ultracite handles the rest.
