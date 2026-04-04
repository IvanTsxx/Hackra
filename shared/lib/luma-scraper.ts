import * as cheerio from "cheerio";

const TIMEOUT_MS = 10_000;
const RATE_LIMIT_DELAY_MS = 1000;

let lastRequestAt = 0;

export interface LumaEventData {
  title: string;
  description: string;
  image?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  organizerName?: string;
  participantCount?: number;
}

function isValidLumaUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === "luma.com" || parsed.hostname.endsWith(".luma.com")
    );
  } catch {
    return false;
  }
}

function sleep(ms: number): Promise<void> {
  // oxlint-disable-next-line promise/avoid-new
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function rateLimit(): Promise<void> {
  const elapsed = Date.now() - lastRequestAt;
  if (elapsed < RATE_LIMIT_DELAY_MS) {
    await sleep(RATE_LIMIT_DELAY_MS - elapsed);
  }
  lastRequestAt = Date.now();
}

function parseDate(text: string | null): Date | null {
  if (!text) return null;
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseTimeFromRange(timeText: string): { start: string; end?: string } | null {
  if (!timeText) return null;
  const trimmed = timeText.trim();
  // Patterns: "4:00 PM - 7:00 PM", "4:00PM-7:00PM", "16:00 - 19:00"
  const rangeMatch = trimmed.match(
    /(\d{1,2}:\d{2}\s*(?:[AP]M)?)(?:\s*[-–—]\s*(\d{1,2}:\d{2}\s*(?:[AP]M)?))?/i
  );
  if (!rangeMatch) return null;
  return {
    end: rangeMatch[2]?.trim(),
    start: rangeMatch[1].trim(),
  };
}

function constructDateFromParts(
  monthStr: string,
  dayStr: string,
  timeStr: string
): { startDate: Date; endDate: Date } | null {
  if (!monthStr || !dayStr) return null;

  const now = new Date();
  const currentYear = now.getFullYear();

  // Try current year first
  let year = currentYear;
  let candidateDate: Date;

  // Parse month abbreviation (e.g., "Apr")
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthIndex = monthNames.findIndex(
    (m) => m.toLowerCase() === monthStr.toLowerCase()
  );
  if (monthIndex === -1) return null;

  const day = Number.parseInt(dayStr, 10);
  if (Number.isNaN(day) || day < 1 || day > 31) return null;

  candidateDate = new Date(year, monthIndex, day);

  // If this date has already passed, try next year
  if (candidateDate < now) {
    year = currentYear + 1;
    candidateDate = new Date(year, monthIndex, day);
  }

  // Parse time and set hours/minutes
  const timeParts = parseTimeFromRange(timeStr);
  if (timeParts) {
    const startTime = parseTimeString(timeParts.start);
    if (startTime) {
      candidateDate.setHours(startTime.hours, startTime.minutes, 0, 0);
    }

    // Calculate end date
    let endDate: Date;
    if (timeParts.end) {
      const endTime = parseTimeString(timeParts.end);
      if (endTime) {
        endDate = new Date(candidateDate);
        endDate.setHours(endTime.hours, endTime.minutes, 0, 0);
        // Handle overnight events (end time is earlier than start time)
        if (endDate <= candidateDate) {
          endDate = new Date(endDate.getTime() + 86_400_000);
        }
      } else {
        endDate = new Date(candidateDate.getTime() + 3 * 60 * 60 * 1000);
      }
    } else {
      // Default to 3 hours if no end time
      endDate = new Date(candidateDate.getTime() + 3 * 60 * 60 * 1000);
    }

    return { endDate, startDate: candidateDate };
  }

  // No time found, use midnight
  return {
    endDate: new Date(candidateDate.getTime() + 86_400_000),
    startDate: candidateDate,
  };
}

function parseTimeString(timeStr: string): { hours: number; minutes: number } | null {
  if (!timeStr) return null;
  const trimmed = timeStr.trim();

  // Try 12-hour format: "4:00 PM" or "4:00PM"
  const match12 = trimmed.match(
    /(\d{1,2}):(\d{2})\s*([AP]M)/i
  );
  if (match12) {
    let hours = Number.parseInt(match12[1], 10);
    const minutes = Number.parseInt(match12[2], 10);
    const period = match12[3].toUpperCase();

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return { hours, minutes };
  }

  // Try 24-hour format: "16:00"
  const match24 = trimmed.match(/(\d{1,2}):(\d{2})/);
  if (match24) {
    return {
      hours: Number.parseInt(match24[1], 10),
      minutes: Number.parseInt(match24[2], 10),
    };
  }

  return null;
}

function extractParticipantCount(text: string | null): number | undefined {
  if (!text) return undefined;
  const match = text.match(/(\d[\d,]*)/);
  if (!match) return undefined;
  return Number.parseInt(match[1].replaceAll(",", ""), 10);
}

export async function scrapeLumaEvent(url: string): Promise<LumaEventData> {
  if (!isValidLumaUrl(url)) {
    throw new Error(`Invalid Luma URL: ${url}`);
  }

  await rateLimit();

  let response: Response;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; HackraBot/1.0)",
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timed out after ${TIMEOUT_MS}ms`, {
        cause: error,
      });
    }
    throw new Error(
      `Failed to fetch Luma event: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error }
    );
  }

  if (!response.ok) {
    throw new Error(`Luma returned ${response.status} for ${url}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Title: try og:title, then h1, then title tag
  const title =
    $('meta[property="og:title"]').attr("content") ||
    $("h1").first().text().trim() ||
    $("title").text().trim() ||
    "";

  if (!title) {
    throw new Error("Could not find event title on page");
  }

  // Description: try og:description, then meta description, then first paragraph
  const description =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    $("p").first().text().trim() ||
    "";

  // Image: try og:image
  const image = $('meta[property="og:image"]').attr("content") || undefined;

  // Dates: try to find date-related meta tags or structured data
  const startDateRaw =
    $('meta[property="event:start_time"]').attr("content") ||
    $('script[type="application/ld+json"]')
      .toArray()
      .map((el) => {
        try {
          const data = JSON.parse($(el).html() ?? "");
          return data.startDate ?? null;
        } catch {
          return null;
        }
      })
      // oxlint-disable-next-line unicorn/prefer-array-find
      .filter(Boolean)[0] ||
    $('[data-testid="event-date"]').text().trim() ||
    "";

  const startDate = parseDate(startDateRaw);
  if (!startDate) {
    throw new Error("Could not parse event start date");
  }

  // End date: similar approach, fallback to startDate + 1 day
  const endDateRaw =
    $('meta[property="event:end_time"]').attr("content") ||
    $('script[type="application/ld+json"]')
      .toArray()
      .map((el) => {
        try {
          const data = JSON.parse($(el).html() ?? "");
          return data.endDate ?? null;
        } catch {
          return null;
        }
      })
      // oxlint-disable-next-line unicorn/prefer-array-find
      .filter(Boolean)[0];

  const endDate =
    parseDate(endDateRaw) || new Date(startDate.getTime() + 86_400_000);

  // Location: try structured data or text content
  const location =
    $('script[type="application/ld+json"]')
      .toArray()
      .map((el) => {
        try {
          const data = JSON.parse($(el).html() ?? "");
          if (data.location) {
            return typeof data.location === "string"
              ? data.location
              : (data.location.name ?? null);
          }
          return null;
        } catch {
          return null;
        }
      })
      // oxlint-disable-next-line unicorn/prefer-array-find
      .filter(Boolean)[0] ||
    $('[data-testid="event-location"]').text().trim() ||
    undefined;

  // Organizer name
  const organizerName =
    $('meta[property="event:organizer"]').attr("content") ||
    $('[data-testid="organizer-name"]').text().trim() ||
    undefined;

  // Participant count
  const participantText =
    $('[data-testid="going-count"]').text().trim() ||
    $('[data-testid="attendee-count"]').text().trim() ||
    undefined;
  const participantCount = extractParticipantCount(participantText ?? null);

  return {
    description,
    endDate,
    image,
    location,
    organizerName,
    participantCount,
    startDate,
    title,
  };
}
