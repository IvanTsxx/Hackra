# Tasks: hackathon-duplicate-guard

## Phase 1: Core Similarity Utility

- [x] T1.1: Create `shared/lib/similarity.ts` with `slugifyForComparison()` function
- [x] T1.2: Add `stripMarkdown()` function to `shared/lib/similarity.ts`
- [x] T1.3: Add `diceCoefficient()` function to `shared/lib/similarity.ts`
- [x] T1.4: Add `SIMILARITY_CONFIG` constants (threshold, min length, max results, debounce)
- [x] T1.5: Add `isSimilarHackathon()` function combining title and description checks
- [x] T1.6: Export `SimilarityResult` and `SimilarHackathon` types

## Phase 2: DAL Function

- [x] T2.1: Add `SimilarHackathon` interface to `data/admin-hackatons.ts`
- [x] T2.2: Add `findSimilarHackathons()` function with pre-filter query + application-layer scoring
- [x] T2.3: Ensure function uses `import "server-only"` and follows DAL pattern

## Phase 3: Server Actions

- [x] T3.1: Add `checkDuplicateHackathonAction` server action in `create/_actions.ts`
- [x] T3.2: Modify `createHackathonAction` to call `findSimilarHackathons` and block if duplicates found
- [x] T3.3: Return meaningful error messages in Spanish (matching existing i18n pattern)
- [x] T3.4: Include similar hackathons list in error response for UI display

## Phase 4: Form UI

- [x] T4.1: Add `duplicateCheck` state to `CreateHackathonForm` component
- [x] T4.2: Add debounced effect (500ms) calling `checkDuplicateHackathonAction` on title/description changes
- [x] T4.3: Create `DuplicateWarning` sub-component showing similar hackathons list
- [x] T4.4: Disable submit button when `isDuplicate === true`
- [x] T4.5: Style warning panel with pixel-art aesthetic matching design system
- [x] T4.6: Link each similar hackathon to `/hackathon/{slug}`

## Phase 5: Polish & Edge Cases

- [x] T5.1: Handle loading state while duplicate check is in progress (spinner or subtle indicator)
- [x] T5.2: Handle server action errors gracefully (fall back to allowing creation if check itself fails)
- [x] T5.3: Ensure Luma-imported hackathons also go through the duplicate check
- [x] T5.4: Run `bun run fix` to ensure code style compliance
