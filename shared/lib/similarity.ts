/**
 * Similarity utilities for hackathon duplicate detection.
 * Pure functions for text comparison using Dice coefficient (bigram-based).
 */

// ─── Config ───────────────────────────────────────────────────────────────────

export const SIMILARITY_CONFIG = {
  DEBOUNCE_MS: 500,
  DESCRIPTION_THRESHOLD: 0.85,
  MAX_RESULTS: 5,
  MIN_DESCRIPTION_LENGTH: 20,
  TITLE_WORDS_FILTER: 3,
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SimilarityResult {
  titleMatch: boolean;
  descriptionScore: number;
  isBlocked: boolean;
}

export interface SimilarHackathon {
  id: string;
  title: string;
  slug: string;
  description: string;
  titleMatch: boolean;
  descriptionScore: number;
  isBlocked: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Generate bigrams (2-char substrings) from a string.
 */
function getBigrams(str: string): Set<string> {
  const bigrams = new Set<string>();
  for (let i = 0; i < str.length - 1; i += 1) {
    bigrams.add(str.slice(i, i + 2));
  }
  return bigrams;
}

/**
 * Normalize text for title comparison: lowercase, remove non-alphanumeric,
 * collapse whitespace to hyphens.
 */
export function slugifyForComparison(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replaceAll(/[^\w\s]/g, "")
    .replaceAll(/[\s_]+/g, "-")
    .replaceAll(/^-+|-+$/g, "");
}

/**
 * Strip markdown formatting from text for description comparison.
 * Removes: ## headers, **bold**, *italic*, [links](urls), ![images](urls),
 * --- horizontal rules, leading - and * from list items.
 */
export function stripMarkdown(md: string): string {
  return (
    md
      // Remove ## headers
      .replaceAll(/^#{1,6}\s+/gm, "")
      // Remove bold **text** and __text__
      .replaceAll(/\*\*(.+?)\*\*/g, "$1")
      .replaceAll(/__(.+?)__/g, "$1")
      // Remove italic *text* and _text_
      .replaceAll(/\*(.+?)\*/g, "$1")
      .replaceAll(/_(.+?)_/g, "$1")
      // Remove [links](urls)
      .replaceAll(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // Remove ![images](urls)
      .replaceAll(/!\[[^\]]*\]\([^)]+\)/g, "")
      // Remove --- horizontal rules
      .replaceAll(/^[-*_]{3,}\s*$/gm, "")
      // Remove leading - and * from list items
      .replaceAll(/^[-*]\s+/gm, "")
      // Remove > blockquotes
      .replaceAll(/^>\s+/gm, "")
      // Remove `code` and ```code blocks```
      .replaceAll(/`{1,3}[^`]*`{1,3}/g, "")
      // Collapse multiple whitespace
      .replaceAll(/\s+/g, " ")
      .trim()
  );
}

/**
 * Compute Dice coefficient (bigram-based similarity) between two strings.
 * Returns a value between 0 and 1, where 1 is identical.
 * Returns 0 if either string has fewer than 2 bigrams.
 */
export function diceCoefficient(a: string, b: string): number {
  if (!a || !b) return 0;

  const bigramsA = getBigrams(a);
  const bigramsB = getBigrams(b);

  // Need at least 2 bigrams for meaningful comparison
  if (bigramsA.size < 2 || bigramsB.size < 2) {
    return 0;
  }

  // Count intersection
  let intersectionSize = 0;
  for (const bigram of bigramsA) {
    if (bigramsB.has(bigram)) {
      intersectionSize += 1;
    }
  }

  // Dice coefficient formula: 2 * |A ∩ B| / |A| + |B|
  const score = (2 * intersectionSize) / (bigramsA.size + bigramsB.size);

  return Math.min(1, Math.max(0, score));
}

/**
 * Combined similarity check for a new hackathon against an existing one.
 * - titleMatch: true if slugified titles are identical
 * - descriptionScore: Dice coefficient of stripped descriptions (0 if skipped)
 * - isBlocked: true if title matches OR description score >= threshold
 */
export function isSimilarHackathon(
  newTitle: string,
  newDescription: string,
  existing: { title: string; description: string },
  opts?: { threshold?: number; minDescriptionLength?: number }
): SimilarityResult {
  const threshold = opts?.threshold ?? SIMILARITY_CONFIG.DESCRIPTION_THRESHOLD;
  const minLength =
    opts?.minDescriptionLength ?? SIMILARITY_CONFIG.MIN_DESCRIPTION_LENGTH;

  // Title comparison (slugified)
  const slugifiedNew = slugifyForComparison(newTitle);
  const slugifiedExisting = slugifyForComparison(existing.title);
  const titleMatch = slugifiedNew === slugifiedExisting;

  // Description comparison (stripped markdown)
  const strippedNew = stripMarkdown(newDescription);
  const strippedExisting = stripMarkdown(existing.description);

  let descriptionScore = 0;

  // Only compare if both descriptions are long enough
  if (strippedNew.length >= minLength && strippedExisting.length >= minLength) {
    descriptionScore = diceCoefficient(strippedNew, strippedExisting);
  }

  const isBlocked = titleMatch || descriptionScore >= threshold;

  return {
    descriptionScore,
    isBlocked,
    titleMatch,
  };
}
