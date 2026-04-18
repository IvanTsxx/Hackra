import { NextResponse } from "next/server";

import { getLeaderboard } from "@/data/user";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page")
    ? Number.parseInt(searchParams.get("page") ?? "1", 10)
    : 1;

  const data = await getLeaderboard(page);

  return NextResponse.json(data);
}
