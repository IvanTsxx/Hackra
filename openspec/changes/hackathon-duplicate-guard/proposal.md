# Proposal: hackathon-duplicate-guard

## Intent

Prevent users from creating hackathons that duplicate existing ones. The platform currently allows creating hackathons with identical or very similar titles and descriptions, leading to confusion, clutter, and potential abuse. This change adds a similarity guard that **blocks** creation when the title matches an existing hackathon exactly (case-insensitive, slugified) OR when the description similarity score exceeds a configurable threshold.

## Scope

### In Scope

- **Similarity utility** (`shared/lib/similarity.ts`): Dice coefficient (bigram) implementation for description comparison, slug-based comparison for titles
- **DAL function**: `findSimilarHackathons(title, description, threshold)` to query and score existing hackathons
- **Server action**: `checkDuplicateHackathonAction` for client-side real-time checks (debounced), plus hard block in `createHackathonAction`
- **Form UX**: Show similar hackathons in the creation form when duplicates are detected, disable submit button
- **Validation enhancement**: Zod schema or separate validation layer for the duplicate check

### Out of Scope

- **Semantic similarity** (NLP/embeddings): catches paraphrased titles but is overkill for v1
- **Admin bypass**: admins creating hackathons via admin panel are NOT affected (future consideration)
- **Edit/update flow**: only applies to creation, not editing existing hackathons (future consideration)
- **Database-level constraints**: no `@@unique` on title (different organizers CAN create same-named hackathons — this is a similarity check, not a uniqueness constraint)

## Approach

1. **Create `shared/lib/similarity.ts`** with pure TypeScript functions:
   - `slugify(text)` — normalize text for comparison
   - `diceCoefficient(a, b)` — bigram-based similarity (0-1 score)
   - `stripMarkdown(md)` — remove markdown formatting before comparison
   - `isSimilarHackathon(newTitle, newDesc, existing)` — combined check returning `{ titleMatch: boolean, descriptionScore: number, isBlocked: boolean }`

2. **Add DAL function** in `data/admin-hackatons.ts`:
   - `findSimilarHackathons(title, description, opts?)` — queries recent hackathons, filters by title slug match or description similarity

3. **Add server action** in `create/_actions.ts`:
   - `checkDuplicateHackathonAction({ title, description })` — returns `{ isDuplicate: boolean, similarHackathons: [...] }`
   - Modify `createHackathonAction` to call the check and block if `isDuplicate === true`

4. **Update form** `create-hackathon-form.tsx`:
   - Add debounced check (500ms after title/description changes)
   - Show warning panel listing similar hackathons
   - Disable submit when blocked

## Affected Areas

| File                                                                | Change                                                              |
| ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `shared/lib/similarity.ts`                                          | **NEW** — Dice coefficient, slugify, stripMarkdown utilities        |
| `shared/lib/validation.ts`                                          | Possible enhancement to add async duplicate validation              |
| `data/admin-hackatons.ts`                                           | Add `findSimilarHackathons()` function                              |
| `app/(private)/(user)/create/_actions.ts`                           | Add `checkDuplicateHackathonAction`, modify `createHackathonAction` |
| `app/(private)/(user)/create/_components/create-hackathon-form.tsx` | Add duplicate check UI, disable submit when duplicates found        |

## Rollback Plan

1. Remove the similarity check call from `createHackathonAction` (restore original flow)
2. Remove `checkDuplicateHackathonAction` from server actions
3. Remove the duplicate check UI from the form component
4. The `shared/lib/similarity.ts` file can remain (no dependencies harm) or be deleted

## Risks

1. **Threshold tuning**: 0.85 may be too strict or too loose. Start conservative and add an admin-configurable threshold later.
2. **Performance at scale**: Querying all hackathons is O(n). Mitigate by pre-filtering with title substring match and limiting to recent hackathons (last 12 months).
3. **Markdown formatting noise**: Descriptions contain markdown — must strip before comparison.
4. **False negatives on semantic duplicates**: "AI Hackathon 2025" vs "Artificial Intelligence Coding Challenge" won't be caught. Document as known limitation.
5. **Luma-imported hackathons**: The Luma scraper creates hackathons with `source: "luma"` — these should also be checked for duplicates.
