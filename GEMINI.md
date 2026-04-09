# Hackra — Agent Guidelines

Hackra is a hackathon platform built with Next.js 16, React 19, TypeScript, Prisma 7 (PostgreSQL), Better Auth, Tailwind CSS 4, and shadcn/ui. Package manager: **Bun**.

---

## Design System & References

> **⚠️ IMPORTANTE**: Antes de hacer cualquier cambio de diseño, lee `@DESIGN.md` para entender el sistema de diseño de Hackra (fuentes pixel, bordes sharp, efectos glow, etc.).

### References

- **AGENTS.md**: Contains the same guidelines as this file — [ver AGENTS.md](./AGENTS.md)
- **CLAUDE.md**: Version for Claude Code with `.claude/skills` paths — [ver CLAUDE.md](./CLAUDE.md)
- **DESIGN.md**: Complete design system documentation — [ver DESIGN.md](./DESIGN.md)

---

## Skills Registry

> **¿Cuándo usar skills?** Las siguientes skills están registradas y disponibles. Carga la skill relevante ANTES de escribir código en esos dominios.

### Core Skills (auto-load when relevant)

| Skill                   | When to Load                                                         | Location                                        |
| ----------------------- | -------------------------------------------------------------------- | ----------------------------------------------- |
| `architect-nextjs`      | Setting up new features, deciding component placement                | `.agents/skills/architect-nextjs/SKILL.md`      |
| `ultracite`             | Writing any TS/TSX code, linting, formatting                         | `.agents/skills/ultracite/SKILL.md`             |
| `next-cache-components` | Using Next.js 16 caching (PPR, `use cache`, `cacheLife`, `cacheTag`) | `.agents/skills/next-cache-components/SKILL.md` |
| `next-best-practices`   | Writing Next.js pages, layouts, API routes, metadata                 | `.agents/skills/next-best-practices/SKILL.md`   |
| `shadcn`                | Adding, fixing, or composing UI components                           | `.agents/skills/shadcn/SKILL.md`                |
| `web-design-guidelines` | Reviewing UI code for accessibility/design compliance                | `.agents/skills/web-design-guidelines/SKILL.md` |
| `find-skills`           | User asks "how do I do X", "is there a skill for X"                  | `.agents/skills/find-skills/SKILL.md`           |

### Domain-Specific Skills

| Skill                                  | When to Load                                           | Location                                                       |
| -------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------- |
| `better-auth-best-practices`           | Configuring Better Auth server/client, OAuth, sessions | `.agents/skills/better-auth-best-practices/SKILL.md`           |
| `better-auth-security-best-practices`  | Securing auth setup, rate limiting, CSRF               | `.agents/skills/better-auth-security-best-practices/SKILL.md`  |
| `prisma-cli`                           | Running Prisma CLI commands, migrations, schema        | `.agents/skills/prisma-cli/SKILL.md`                           |
| `prisma-client-api`                    | Writing database queries, CRUD operations              | `.agents/skills/prisma-client-api/SKILL.md`                    |
| `prisma-database-setup`                | Setting up or changing database connections            | `.agents/skills/prisma-database-setup/SKILL.md`                |
| `prisma-postgres`                      | Prisma Postgres specific operations                    | `.agents/skills/prisma-postgres/SKILL.md`                      |
| `prisma-driver-adapter-implementation` | Prisma v7 driver adapter work                          | `.agents/skills/prisma-driver-adapter-implementation/SKILL.md` |
| `vercel-composition-patterns`          | Refactoring components with prop proliferation         | `.agents/skills/vercel-composition-patterns/SKILL.md`          |
| `emil-design-eng`                      | UI polish, component design, animation                 | `.agents/skills/emil-design-eng/SKILL.md`                      |
| `frontend-design`                      | Creating distinctive, production-grade frontend        | `.agents/skills/frontend-design/SKILL.md`                      |
| `brand-guidelines`                     | Applying Anthropic's brand colors and typography       | `.agents/skills/brand-guidelines/SKILL.md`                     |
| `testing-next-stack`                   | Setting up tests, Vitest, Playwright, RTL              | `.agents/skills/testing-next-stack/SKILL.md`                   |
| `better-upload`                        | File uploads with better-upload                        | `.agents/skills/better-upload/SKILL.md`                        |
| `ai-seo`                               | AI-powered SEO optimization and analysis               | `.agents/skills/ai-seo/SKILL.md`                               |
| `seo-content-writer`                   | SEO content writing, meta tags, keywords               | `.agents/skills/seo-content-writer/SKILL.md`                   |

### SDD (Spec-Driven Development) Skills

| Skill         | When to Load                      | Location                                  |
| ------------- | --------------------------------- | ----------------------------------------- |
| `sdd-init`    | Initialize SDD context in project | `~/.opencode/skills/sdd-init/SKILL.md`    |
| `sdd-explore` | Explore and investigate ideas     | `~/.opencode/skills/sdd-explore/SKILL.md` |
| `sdd-propose` | Create change proposals           | `~/.opencode/skills/sdd-propose/SKILL.md` |
| `sdd-spec`    | Write specifications              | `~/.opencode/skills/sdd-spec/SKILL.md`    |
| `sdd-design`  | Create technical design           | `~/.opencode/skills/sdd-design/SKILL.md`  |
| `sdd-tasks`   | Break down into tasks             | `~/.opencode/skills/sdd-tasks/SKILL.md`   |
| `sdd-apply`   | Implement tasks                   | `~/.opencode/skills/sdd-apply/SKILL.md`   |
| `sdd-verify`  | Validate implementation           | `~/.opencode/skills/sdd-verify/SKILL.md`  |
| `sdd-archive` | Archive completed change          | `~/.opencode/skills/sdd-archive/SKILL.md` |
| `sdd-onboard` | Guided SDD walkthrough            | `~/.opencode/skills/sdd-onboard/SKILL.md` |

### Workflow Skills

| Skill            | When to Load                        | Location                                     |
| ---------------- | ----------------------------------- | -------------------------------------------- |
| `branch-pr`      | Creating pull requests, PR workflow | `~/.opencode/skills/branch-pr/SKILL.md`      |
| `issue-creation` | Creating GitHub issues              | `~/.opencode/skills/issue-creation/SKILL.md` |
| `judgment-day`   | Adversarial code review             | `~/.opencode/skills/judgment-day/SKILL.md`   |
| `skill-creator`  | Creating new AI agent skills        | `~/.opencode/skills/skill-creator/SKILL.md`  |
| `skill-registry` | Update skill registry               | `~/.opencode/skills/skill-registry/SKILL.md` |
| `go-testing`     | Go testing patterns                 | `~/.opencode/skills/go-testing/SKILL.md`     |

### Skill Loading Rules

1. **Detect context first** — match the task to a skill before writing code
2. **Load the skill** — use the `skill` tool to load full instructions
3. **Apply ALL patterns** from the loaded skill — they are your coding standards
4. **Multiple skills can apply** — load all relevant ones (e.g., `shadcn` + `next-best-practices` for a new page)
5. **For unknown domains** — use `find-skills` to search the ecosystem

---

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

## Animations (motion / framer-motion)

**`motion` components (`motion.div`, `motion.span`, etc.) are CLIENT-ONLY.** They use browser APIs and hooks that crash in Server Components.

### Rule: ALWAYS wrap motion in `"use client"` components

1. **Never import `motion` in a Server Component** — no `motion/*` imports in files without `"use client"`
2. **Extract animated sections into dedicated client components** — create a reusable component (e.g., `animated-header.tsx`) with `"use client"`, import motion there, then use that component in your server page
3. **Prefer reusable animated wrappers** — if you animate a pattern (fade-in, slide-up), make it reusable (e.g., `<FadeIn>`, `<SlideUp>`) instead of sprinkling `motion.div` everywhere
4. **Import path**: use `motion/react` (not `framer-motion` directly) — the project depends on `motion` package

```tsx
// ❌ WRONG: motion in a server component (page.tsx)
import { motion } from "motion/react";
export default function SettingsPage() {
  return <motion.div initial={{ opacity: 0 }}>...</motion.div>;
}

// ✅ CORRECT: extract to a client component
// components/animated-section.tsx
("use client");
import { motion } from "motion/react";
export function AnimatedSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
      {children}
    </motion.div>
  );
}

// page.tsx (server component)
import { AnimatedSection } from "./_components/animated-section";
export default function SettingsPage() {
  return <AnimatedSection>...</AnimatedSection>;
}
```

## Conventions

**Database**: Prisma singleton with `globalForPrisma`. Uses `@prisma/adapter-pg` with `@neondatabase/serverless` for PostgreSQL. All models use `@@map()` for snake_case table names.

**Auth**: Better Auth with OAuth only (GitHub + Google). Session: 7 days. Additional user fields: `username` (required), `bio`, `githubUsername`, `location`, `position`, `techStack`, `karmaPoints`.

**Styling**: Tailwind CSS v4 with `@import "tailwindcss"`. CSS variables with oklch. Brand colors: `--brand-green`, `--brand-purple`. Custom utilities: `.glass`, `.glow-green`, `.pixel-grid`, `.scanlines`, `.pixel-border`. Use `cn()` for conditional classes. `--radius: 0` (sharp corners by default).

**State**: `nuqs` for URL search params (wrapped in `<NuqsAdapter>` in layout). No global state manager.

## Forms (TanStack Form + Zod)

**Always use TanStack Form (`@tanstack/react-form`) with Zod for all forms.** No react-hook-form, no manual state.

### Standard Pattern

```tsx
"use client";

import { useForm } from "@tanstack/react-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
});

export function MyForm() {
  const form = useForm({
    defaultValues: { title: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      // handle submit
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="title"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Key Rules

1. **Zod schema first** — define `formSchema` with `z.object()` at module level
2. **`validators.onSubmit`** — pass schema to `useForm({ validators: { onSubmit: formSchema } })`
3. **Render prop pattern** — use `children={(field) => ...}` on `form.Field`, NOT the function-as-child JSX pattern
4. **Invalid state** — `const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid`
5. **Always wire**: `value={field.state.value}`, `onBlur={field.handleBlur}`, `onChange={(e) => field.handleChange(e.target.value)}`
6. **Accessibility**: `data-invalid={isInvalid}` on `<Field>`, `aria-invalid={isInvalid}` on the control
7. **Errors**: `{isInvalid && <FieldError errors={field.state.meta.errors} />}`
8. **Reset**: `<Button type="button" onClick={() => form.reset()}>Reset</Button>`

### Field Type Wiring

| Control                 | Value binding                 | Change handler                                                        |
| ----------------------- | ----------------------------- | --------------------------------------------------------------------- |
| `<Input>`, `<Textarea>` | `value={field.state.value}`   | `onChange={(e) => field.handleChange(e.target.value)}`                |
| `<Select>`              | `value={field.state.value}`   | `onValueChange={field.handleChange}`                                  |
| `<Checkbox>`            | `checked={field.state.value}` | `onCheckedChange={(checked) => field.handleChange(checked === true)}` |
| `<Switch>`              | `checked={field.state.value}` | `onCheckedChange={field.handleChange}`                                |
| `<RadioGroup>`          | `value={field.state.value}`   | `onValueChange={field.handleChange}`                                  |

### Array Fields

Use `mode="array"` on the parent field. Access items via bracket notation:

```tsx
<form.Field name="emails" mode="array">
  {(field) => (
    <FieldGroup>
      {field.state.value.map((_, index) => (
        <form.Field key={index} name={`emails[${index}].address`}>
          {(subField) => {
            /* same pattern as scalar fields */
          }}
        </form.Field>
      ))}
      <Button type="button" onClick={() => field.pushValue({ address: "" })}>
        Add
      </Button>
    </FieldGroup>
  )}
</form.Field>
```

- Add: `field.pushValue(item)`
- Remove: `field.removeValue(index)`
- Zod: `z.array(z.object({...})).min(1, "At least one required")`

## Key Files

- `shared/lib/auth.ts` — Better Auth configuration
- `shared/lib/prisma.ts` — Prisma client singleton
- `shared/lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)
- `prisma/schema.prisma` — Database schema
- `next.config.ts` — Next.js configuration
- `app/globals.css` — Tailwind v4 theme, CSS variables
- `app/layout.tsx` — Root layout (ThemeProvider, NuqsAdapter, Navbar, Footer)

Run `bun run fix` before committing. Focus on business logic, naming, architecture, and edge cases — Ultracite handles the rest.
