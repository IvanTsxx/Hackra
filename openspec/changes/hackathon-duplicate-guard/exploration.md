# Exploration: hackathon-duplicate-guard

## Current State

The Hackra platform currently allows creating hackathons without any duplicate or similarity checking. Two hackathons can have the exact same title and nearly identical descriptions, leading to confusion and clutter.

### Key Findings

1. **Prisma schema** (`prisma/schema.prisma`): The `Hackathon` model has:
   - `title: String` — NO unique constraint
   - `slug: String @unique` — unique, but auto-generated as `slugify(title)-timestamp`, so duplicates get different slugs
   - `description: String` — no constraints
   - No database-level check for title uniqueness

2. **Server action** (`app/(private)/(user)/create/_actions.ts`): `createHackathonAction` validates with Zod, but does NOT check for duplicates before calling `createHackathon(dto)`.

3. **DAL** (`data/admin-hackatons.ts`): `createHackathon()` directly calls `prisma.hackathon.create()` with no duplicate guard. There IS a `getHackathonByExternalUrl()` function for Luma dedup, but no title/description similarity check.

4. **Validation schema** (`shared/lib/validation.ts`): `createHackathonSchema` validates `title: z.string().min(1)` and `description: z.string().min(1)` — no uniqueness or similarity validation.

5. **Form** (`create-hackathon-form.tsx`): TanStack Form with 4-step wizard. Errors shown via `toast.error()`. No client-side duplicate checking.

6. **No text similarity library** is installed in `package.json`. Will need to add one.

7. **Error handling pattern**: Server actions return `{ success: boolean; error?: string }`. Form shows errors via `toast.error("Deploy failed", { description: result.error })`.

## Affected Areas

- `shared/lib/validation.ts` — Zod schema for creation, needs similarity validation support
- `app/(private)/(user)/create/_actions.ts` — Server action, needs duplicate check before creation
- `data/admin-hackatons.ts` — DAL, needs a similarity search function
- `prisma/schema.prisma` — May need an index on `title` for fast lookups
- `app/(private)/(user)/create/_components/create-hackathon-form.tsx` — Form UI, needs to show duplicate warnings
- `package.json` — Needs a text similarity dependency
- New file: `shared/lib/similarity.ts` — Core similarity scoring utility

## Approaches

### 1. Levenshtein Distance (Server-side)

Add a server action that checks title exact match + description similarity using Levenshtein distance. Block if title is identical OR description similarity score >= threshold.

- **Pros**: Simple algorithm, no external service dependency, well-understood
- **Cons**: Levenshtein on long descriptions is O(n\*m) which can be slow; not great for semantic similarity
- **Effort**: Low

### 2. Dice Coefficient / Bigram Similarity (Server-side)

Use Dice coefficient (bigram-based) for description comparison. Normalized title comparison (slugify + compare) for exact match. Block if title matches OR description similarity >= threshold (e.g., 0.85).

- **Pros**: Fast O(n) comparison, works well for detecting near-duplicates, easy to implement
- **Cons**: Doesn't catch semantic similarity (paraphrased descriptions)
- **Effort**: Low-Medium

### 3. Server Action + Real-time Check (Client + Server)

Add a debounced server action called from the form (while typing) that checks for similar hackathons and shows warnings. On submit, enforce block if score exceeds threshold.

- **Pros**: Better UX (user sees similar hackathons before submitting), prevents wasted form fills
- **Pros**: Can show which hackathons are similar
- **Cons**: More complex, needs debouncing, more server calls
- **Effort**: Medium

### 4. Database Index + Trigram Similarity (PostgreSQL-specific)

Add a PostgreSQL trigram index (`pg_trgm`) and use similarity queries directly in the database.

- **Pros**: Most performant at scale, database-native, handles fuzzy search well
- **Cons**: Requires PostgreSQL extension (`pg_trgm`), Prisma doesn't support trigram queries natively (raw SQL needed), adds DB dependency
- **Effort**: Medium

## Recommendation

**Approach 2 (Dice Coefficient) + Approach 3 (Real-time check UX)** — The best balance of simplicity and UX:

1. **Server-side**: Create `shared/lib/similarity.ts` with Dice coefficient for description and slugified comparison for title
2. **DAL**: Add `findSimilarHackathons(title, description, threshold)` to the hackathon data layer
3. **Server action**: Add a `checkDuplicateHackathon` server action (called client-side with debounce) and a hard block in `createHackathonAction`
4. **Client**: Show similar hackathons in the form when duplicates are detected, and block submission
5. **Validation**: Extend `createHackathonSchema` or add a separate check

No external DB extension needed. Pure TypeScript implementation. Score threshold configurable (start at 0.85 for description, exact match for slugified title).

## Risks

- **Threshold tuning**: Too strict = legitimate variations blocked. Too loose = duplicates get through. Start conservative (0.85) and adjust based on feedback.
- **Performance**: Querying all hackathons for similarity comparison could be slow at scale. Mitigate by limiting to recent hackathons + title pre-filter.
- **Unicode/encoding**: Description is Markdown. Need to strip Markdown before comparing to avoid false positives from formatting differences.
- **False sense of security**: Text similarity won't catch semantic duplicates ("AI Hackathon 2025" vs "Artificial Intelligence Coding Challenge"). Document this limitation.

## Ready for Proposal

Yes — the scope is clear: block creation of hackathons with identical/similar title and description using a similarity score. The recommendation is Approach 2+3 (dice coefficient + real-time check UX).
