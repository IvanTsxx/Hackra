# Design: hackathon-duplicate-guard

## Architecture Decisions

### AD-1: Dice Coefficient over Levenshtein or pg_trgm

**Decision**: Use Dice coefficient (bigram similarity) for description comparison, implemented in pure TypeScript.

**Rationale**:

- Levenshtein is O(n\*m) and slow on long descriptions — Dice is O(n) and fast
- pg_trgm requires a PostgreSQL extension and raw SQL queries, breaking the DAL pattern
- Dice coefficient provides good-enough similarity detection for near-duplicate descriptions
- Pure TypeScript = no external dependencies, testable, works everywhere

**Alternatives considered**:

- Levenshtein distance: too slow for long text
- pg_trgm: breaks DAL pattern, adds DB dependency
- Cosine similarity: requires tokenization overhead for marginal improvement
- Semantic embeddings: overkill for v1, requires external service

### AD-2: Two-Phase Check (Client Debounced + Server Hard Block)

**Decision**: Implement both a debounced client-side check (UX) and a server-side hard block (security).

**Rationale**:

- Client-side check provides immediate feedback before form submission
- Server-side check is the security boundary — never trust client-only checks
- Debounce at 500ms balances responsiveness vs. server load

### AD-3: DAL Query Strategy — Pre-filter + Application-Layer Scoring

**Decision**: Query all hackathons with a title substring filter from DB, then compute similarity scores in the application layer.

**Rationale**:

- Prisma doesn't support full-text similarity queries natively
- Pre-filtering by title words narrows the result set before expensive comparison
- Application-layer scoring is more maintainable and unit-testable
- At current scale (dozens-hundreds of hackathons), this is performant enough
- Future optimization: add `@@index` on title or migrate to pg_trgm if scale requires

### AD-4: Hard Block, Not Warning

**Decision**: If a duplicate is detected, creation is **blocked** (not just warned).

**Rationale**:

- User explicitly requested "no permitir directamente" — hard block
- Prevents the platform from becoming cluttered with duplicates
- Admin override can be added as a future enhancement

## Component Design

### 1. Similarity Utility (`shared/lib/similarity.ts`)

```typescript
// Pure functions, no side effects, fully testable

export interface SimilarityResult {
  titleMatch: boolean;
  descriptionScore: number;
  isBlocked: boolean;
}

export function slugifyForComparison(text: string): string;
// Lowercase, remove non-alphanumeric, collapse whitespace to hyphens

export function stripMarkdown(md: string): string;
// Remove ## headers, **bold**, *italic*, [links](urls), etc.

export function diceCoefficient(a: string, b: string): number;
// Bigram-based similarity. Returns 0-1.
// 1. Generate bigrams for each string
// 2. Count intersection size
// 3. Score = 2 * intersection / (bigramsA + bigramsB)

export function isSimilarHackathon(
  newTitle: string,
  newDescription: string,
  existing: { title: string; description: string },
  opts?: { threshold?: number; minDescriptionLength?: number }
): SimilarityResult;
// Returns { titleMatch, descriptionScore, isBlocked }
```

### 2. DAL Function (`data/admin-hackatons.ts`)

```typescript
export interface SimilarHackathon {
  id: string;
  title: string;
  slug: string;
  description: string;
  titleMatch: boolean;
  descriptionScore: number;
  isBlocked: boolean;
}

export async function findSimilarHackathons(
  title: string,
  description: string,
  opts?: { threshold?: number; limit?: number }
): Promise<SimilarHackathon[]>;
```

**Query strategy**:

1. Fetch hackathons where slugified title contains any of the first 3 words of the input title, OR limit to recent hackathons (last 24 months)
2. For each result, compute `isSimilarHackathon()` in the application layer
3. Filter to blocked results only
4. Sort by score descending
5. Return top `limit` (default 5)

### 3. Server Actions (`app/(private)/(user)/create/_actions.ts`)

**New action**: `checkDuplicateHackathonAction`

```typescript
export async function checkDuplicateHackathonAction(raw: {
  title: string;
  description: string;
}): Promise<{
  isDuplicate: boolean;
  similarHackathons: SimilarHackathon[];
}>;
```

**Modified**: `createHackathonAction`

- After Zod validation and auth check, call `findSimilarHackathons(data.title, data.description)`
- If any result has `isBlocked === true`, return error with the similar hackathons list
- Otherwise proceed with creation as before

### 4. Form UI (`create-hackathon-form.tsx`)

**New state**:

```typescript
const [duplicateCheck, setDuplicateCheck] = useState<{
  isChecking: boolean;
  isDuplicate: boolean;
  similarHackathons: SimilarHackathon[];
}>({ isChecking: false, isDuplicate: false, similarHackathons: [] });
```

**Debounced check**:

- useEffect with 500ms debounce on `title` and `description` changes
- Calls `checkDuplicateHackathonAction({ title, description })`
- Updates `duplicateCheck` state

**Warning panel** (shown when `isDuplicate === true`):

- Pixel-art styled alert box matching the design system
- Lists similar hackathons with title, truncated description, and score
- Each item links to `/hackathon/{slug}`
- Submit button is disabled when `isDuplicate === true`

## Data Flow

```
User types title/description
         │
         ▼
  500ms debounce
         │
         ▼
checkDuplicateHackathonAction ──────► findSimilarHackathons()
         │                                    │
         │                                    ├─ DB query (title pre-filter)
         │                                    ├─ Application-layer scoring
         │                                    └─ Return top 5 SimilarHackathon[]
         │
         ▼
  Update form state
  ├─ isDuplicate? → Show warning panel + disable submit
  └─ No duplicate? → Clear warning + enable submit

User clicks submit
         │
         ▼
createHackathonAction
         │
         ├─ Auth check
         ├─ Zod validation
         ├─ findSimilarHackathons() ← HARD BLOCK (server-side enforcement)
         │     ├─ Blocked? → Return error with similar list
         │     └─ Not blocked? → Proceed
         ├─ createHackathon()
         └─ Return success
```

## Error Messages

| Condition                          | User Message (ES)                                               |
| ---------------------------------- | --------------------------------------------------------------- |
| Title matches exactly              | "Ya existe un hackathon con un título similar."                 |
| Description similarity ≥ threshold | "La descripción es muy similar a un hackathon existente."       |
| Both title and description match   | "Ya existe un hackathon con un título y descripción similares." |

The UI will also show: "Hackathons similares: {list with links}"

## Configuration

```typescript
// shared/lib/similarity.ts
export const SIMILARITY_CONFIG = {
  DESCRIPTION_THRESHOLD: 0.85, // Dice coefficient threshold
  MIN_DESCRIPTION_LENGTH: 20, // Skip comparison for short descriptions
  MAX_RESULTS: 5, // Max similar hackathons to return
  DEBOUNCE_MS: 500, // Client-side debounce
  TITLE_WORDS_FILTER: 3, // Words from title used for DB pre-filter
};
```
