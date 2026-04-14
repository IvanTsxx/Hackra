# Spec: hackathon-duplicate-guard

## Requirements

### REQ-1: Title Duplicate Detection

The system SHALL block creation of a hackathon when its title, after normalization (slugified, lowercased), matches an existing hackathon's slugified title exactly.

- **REQ-1.1**: Title comparison MUST be case-insensitive and whitespace-normalized (slugified).
- **REQ-1.2**: The check MUST consider all hackathon statuses (DRAFT, UPCOMING, LIVE, ENDED, CANCELLED) — status does not exempt from the check.
- **REQ-1.3**: Only the title text is compared; metadata like dates, location, or organizer is irrelevant.

### REQ-2: Description Similarity Detection

The system SHALL block creation of a hackathon when its description similarity score exceeds a threshold compared to any existing hackathon.

- **REQ-2.1**: The similarity algorithm MUST use Dice coefficient (bigram-based) for comparison.
- **REQ-2.2**: Markdown formatting MUST be stripped from descriptions before comparison.
- **REQ-2.3**: The default similarity threshold SHALL be 0.85 (configurable).
- **REQ-2.4**: Only descriptions longer than 20 characters (after stripping) SHALL be compared — very short descriptions produce unreliable bigram scores.
- **REQ-2.5**: The score MUST be calculated against ALL existing hackathons, and the highest score determines the result.

### REQ-3: Hard Block on Submit

The `createHackathonAction` server action SHALL reject the creation if a duplicate is detected.

- **REQ-3.1**: The error response MUST include a clear message: "A hackathon with a similar title or description already exists."
- **REQ-3.2**: The error response MUST include the list of similar hackathons (id, title, slug, score) so the UI can display them.

### REQ-4: Real-Time Duplicate Check (Client-Side)

The creation form SHALL provide a debounced check while the user fills in the title and description.

- **REQ-4.1**: The check SHALL fire 500ms after the user stops typing in the title or description fields.
- **REQ-4.2**: The check SHALL call `checkDuplicateHackathonAction` server action.
- **REQ-4.3**: When duplicates are found, the form SHALL display a warning panel listing the similar hackathons (title, truncated description, similarity score).
- **REQ-4.4**: The submit button SHALL be disabled when a duplicate is detected.
- **REQ-4.5**: Each similar hackathon in the list SHALL link to its detail page (`/hackathon/{slug}`).

### REQ-5: Similarity Utility

A new module `shared/lib/similarity.ts` SHALL provide pure functions for text comparison.

- **REQ-5.1**: `slugifyForComparison(text: string): string` — normalize text for title comparison.
- **REQ-5.2**: `stripMarkdown(md: string): string` — remove markdown formatting.
- **REQ-5.3**: `diceCoefficient(a: string, b: string): number` — return similarity score between 0 and 1.
- **REQ-5.4**: `isSimilarHackathon(newTitle: string, newDescription: string, existing: { title: string; description: string }, opts?: { threshold?: number }): SimilarityResult` — combined check.

### REQ-6: DAL Function

The data access layer SHALL expose a function to find similar hackathons.

- **REQ-6.1**: `findSimilarHackathons(title: string, description: string, opts?: { threshold?: number; limit?: number }): Promise<SimilarHackathon[]>` — query existing hackathons and return those with title match or description score above threshold.
- **REQ-6.2**: Performance optimization: first filter by title substring (first 3 words) in the database query, then compute similarity in application layer.
- **REQ-6.3**: Limit results to the top 5 most similar hackathons.

## Scenarios

### Scenario 1: Exact Title Match

**Given** a hackathon titled "AI Agents Hackathon 2025" exists
**When** a user creates a hackathon titled "AI Agents Hackathon 2025"
**Then** creation is blocked with message "A hackathon with a similar title or description already exists"
**And** the existing hackathon is listed in the warning panel

### Scenario 2: Title Match with Case/Spacing Differences

**Given** a hackathon titled "AI Agents Hackathon 2025" exists
**When** a user creates a hackathon titled "ai-agents hackathon 2025"
**Then** creation is blocked (slugified titles match: "ai-agents-hackathon-2025")

### Scenario 3: Description Similarity Above Threshold

**Given** a hackathon exists with description "## Overview\n\nBuild AI agents that solve real-world problems.\n\n## What to Build\n\nUse any AI framework.\n\n## Judging\n\nInnovation, Execution, Design"
**When** a user creates a hackathon with description "## Overview\n\nBuild AI agents that solve real world problems.\n\n## What to Build\n\nUse any AI framework.\n\n## Judging Criteria\n\nInnovation, Technical Execution"
**Then** the dice coefficient after stripping markdown is approximately 0.88 (> 0.85 threshold)
**And** creation is blocked

### Scenario 4: Description Similarity Below Threshold

**Given** a hackathon exists with description "A hackathon focused on blockchain and Web3 technologies for building decentralized applications"
**When** a user creates a hackathon with description "A design systems hackathon for building modern component libraries with accessibility"
**Then** the dice coefficient is well below 0.85
**And** creation is allowed

### Scenario 5: Short Description Exemption

**Given** a hackathon exists with description "Short event"
**When** a user creates a hackathon with description "Short hack"
**Then** both descriptions are shorter than 20 characters after stripping
**And** description similarity check is SKIPPED (only title check applies)

### Scenario 6: Real-Time UI Warning

**Given** the user is on the hackathon creation form
**When** the user types a title identical to an existing hackathon
**And** 500ms passes without further typing
**Then** a warning panel appears listing the matching hackathon
**And** the submit button is disabled

### Scenario 7: No Duplicates Found

**Given** no existing hackathons have similar titles or descriptions
**When** the creation form checks for duplicates
**Then** no warning is shown
**And** the submit button remains enabled
**And** creation succeeds

## Types

```typescript
interface SimilarityResult {
  titleMatch: boolean;
  descriptionScore: number;
  isBlocked: boolean;
}

interface SimilarHackathon {
  id: string;
  title: string;
  slug: string;
  description: string;
  titleMatch: boolean;
  descriptionScore: number;
  isBlocked: boolean;
}
```
