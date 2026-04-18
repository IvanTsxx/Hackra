import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { updateHackathonStatuses } from "@/data/admin-hackatons";
import { CACHE_TAGS } from "@/data/cache-constants";

/**
 * Cron endpoint to update hackathon statuses.
 * Invoked by Vercel Cron (see vercel.json).
 *
 * - UPCOMING → LIVE when startDate is reached
 * - LIVE → ENDED when endDate is reached
 *
 * Also revalidates cache tags for affected hackathons.
 */
export async function GET() {
  const result = await updateHackathonStatuses();

  // Collect all hackathon IDs and organizer IDs to revalidate
  const allHackathons = [...result.toLive, ...result.toEnded];

  // Revalidate per-hackathon caches
  for (const h of allHackathons) {
    revalidateTag(CACHE_TAGS.HACKATHON_BY_SLUG(h.slug), "max");
    revalidateTag(CACHE_TAGS.TEAMS_BY_HACKATHON(h.id), "max");
    revalidateTag(CACHE_TAGS.HACKATHON_PRIZES(h.id), "max");
    revalidateTag(CACHE_TAGS.HACKATHON_PARTICIPANTS(h.id), "max");
    revalidateTag(CACHE_TAGS.SPONSORS_BY_HACKATHON(h.id), "max");
    revalidateTag(CACHE_TAGS.ORGANIZER_HACKATHONS(h.organizerId), "max");
  }

  // Revalidate global list caches
  revalidateTag(CACHE_TAGS.HACKATHONS_LIST, "max");
  revalidateTag(CACHE_TAGS.FEATURED_HACKATHONS, "max");
  revalidateTag(CACHE_TAGS.HOME_DATA, "max");
  revalidateTag(CACHE_TAGS.ADMIN_ALL_HACKATHONS, "max");
  revalidateTag(CACHE_TAGS.ADMIN_HACKATHON_STATS, "max");

  return NextResponse.json({
    ended: result.ended,
    revalidated: allHackathons.length,
    started: result.started,
    success: true,
  });
}
