import { NextResponse } from "next/server";

import { updateHackathonStatuses } from "@/data/admin-hackatons";

/**
 * Cron endpoint to update hackathon statuses.
 * Invoked by Vercel Cron (see vercel.json).
 *
 * - UPCOMING → LIVE when startDate is reached
 * - LIVE → ENDED when endDate is reached
 */
export async function GET() {
  const result = await updateHackathonStatuses();

  return NextResponse.json({
    ended: result.ended,
    started: result.started,
    success: true,
  });
}
