import fs from "node:fs";
import path from "node:path";

import { ImageResponse } from "next/og";

import { getHackathon } from "@/data/hackatons";

export const size = { height: 630, width: 1200 };
export const contentType = "image/webp";

// ── Geist Mono fonts (terminal aesthetic, TTF for satori compatibility) ────────
// Copied to public/fonts/ so they're accessible in production (Vercel)

const geistMonoRegular = fs.readFileSync(
  path.join(process.cwd(), "public", "fonts", "GeistMono-Regular.ttf")
);
const geistMonoBold = fs.readFileSync(
  path.join(process.cwd(), "public", "fonts", "GeistMono-Bold.ttf")
);

const fontOptions = [
  {
    data: geistMonoRegular,
    name: "GeistMono",
    style: "normal" as const,
    weight: 400 as const,
  },
  {
    data: geistMonoBold,
    name: "GeistMono",
    style: "normal" as const,
    weight: 700 as const,
  },
];

// ── Status helpers ─────────────────────────────────────────────────────────────

const statusConfig: Record<
  string,
  { bg: string; label: string; text: string }
> = {
  CANCELLED: { bg: "#EF4444", label: "CANCELLED", text: "#ffffff" },
  DRAFT: { bg: "#525252", label: "DRAFT", text: "#a3a3a3" },
  ENDED: { bg: "#525252", label: "ENDED", text: "#a3a3a3" },
  LIVE: { bg: "#00E676", label: "LIVE", text: "#0a0a0a" },
  UPCOMING: { bg: "#3B82F6", label: "UPCOMING", text: "#ffffff" },
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Pixel grid dots (SVG data URI) ─────────────────────────────────────────────

const pixelGridSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
  <circle cx="8" cy="8" r="1" fill="rgba(255,255,255,0.06)" />
</svg>`;
const pixelGridDataUri = `data:image/svg+xml,${encodeURIComponent(pixelGridSvg)}`;

// ── Scanlines (SVG data URI) ───────────────────────────────────────────────────

const scanlinesSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4">
  <rect width="4" height="2" fill="rgba(0,0,0,0.04)" />
</svg>`;
const scanlinesDataUri = `data:image/svg+xml,${encodeURIComponent(scanlinesSvg)}`;

// ── OG Image Component ─────────────────────────────────────────────────────────

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hackathon = await getHackathon(slug);

  if (!hackathon) {
    // Fallback OG image
    return new ImageResponse(
      <div
        style={{
          alignItems: "center",
          background: "#171717",
          color: "#e5e5e5",
          display: "flex",
          flexDirection: "column",
          fontFamily: "GeistMono",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: 4 }}>
          HACKRA
        </div>
        <div style={{ color: "#737373", fontSize: 18, marginTop: 8 }}>
          Hackathon not found
        </div>
      </div>,
      { ...size, fonts: fontOptions }
    );
  }

  const status = statusConfig[hackathon.status] || statusConfig.DRAFT;
  const participantCount = hackathon.participants.length;
  const displayTags = hackathon.tags.slice(0, 3);

  return new ImageResponse(
    <div
      style={{
        background: "#171717",
        color: "#e5e5e5",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter",
        height: "100%",
        overflow: "hidden",
        padding: 48,
        position: "relative",
        width: "100%",
      }}
    >
      {/* Pixel grid overlay for cyber theme */}
      {hackathon.themeStyle === "cyber" && (
        <div
          style={{
            backgroundImage: `url("${pixelGridDataUri}")`,
            backgroundSize: "16px 16px",
            inset: 0,
            opacity: 0.3,
            pointerEvents: "none",
            position: "absolute",
          }}
        />
      )}

      {/* Scanlines overlay for cyber theme */}
      {hackathon.themeStyle === "cyber" && (
        <div
          style={{
            backgroundImage: `url("${scanlinesDataUri}")`,
            backgroundSize: "4px 4px",
            inset: 0,
            opacity: 0.5,
            pointerEvents: "none",
            position: "absolute",
          }}
        />
      )}

      {/* Top bar: branding + status */}
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 40,
        }}
      >
        {/* HACKRA branding */}
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: 12,
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: "#00E676",
              color: "#0a0a0a",
              display: "flex",
              fontSize: 18,
              fontWeight: 700,
              height: 32,
              justifyContent: "center",
              width: 32,
            }}
          >
            H
          </div>
          <span
            style={{
              color: "#00E676",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 6,
            }}
          >
            HACKRA
          </span>
        </div>

        {/* Status pill */}
        <div
          style={{
            alignItems: "center",
            background: status.bg,
            color: status.text,
            display: "flex",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 2,
            padding: "6px 16px",
          }}
        >
          {hackathon.status === "LIVE" && (
            <div
              style={{
                background: status.text,
                borderRadius: "50%",
                height: 8,
                marginRight: 8,
                width: 8,
              }}
            />
          )}
          {status.label}
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            letterSpacing: 1,
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          {hackathon.title}
        </div>

        {/* Meta info */}
        <div
          style={{
            color: "#a3a3a3",
            display: "flex",
            flexDirection: "column",
            fontSize: 18,
            gap: 12,
          }}
        >
          {/* Dates */}
          <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
            <span
              style={{
                color: "#00E676",
                fontSize: 16,
                fontWeight: 700,
                marginRight: 2,
              }}
            >
              ▸
            </span>
            <span>
              {formatDate(new Date(hackathon.startDate))} —{" "}
              {formatDate(new Date(hackathon.endDate))}
            </span>
          </div>

          {/* Location */}
          <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
            <span
              style={{
                color: "#00E676",
                fontSize: 16,
                fontWeight: 700,
                marginRight: 2,
              }}
            >
              ▸
            </span>
            <span>
              {hackathon.isOnline ? "Online Event" : hackathon.location}
            </span>
          </div>
        </div>

        {/* Tags */}
        {displayTags.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 8,
            }}
          >
            {displayTags.map((tag) => (
              <div
                key={tag}
                style={{
                  alignItems: "center",
                  background: "rgba(0, 230, 118, 0.08)",
                  border: "1px solid rgba(0, 230, 118, 0.3)",
                  color: "#00E676",
                  display: "flex",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: 1,
                  padding: "6px 14px",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          alignItems: "flex-end",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "space-between",
          marginTop: 24,
          paddingTop: 20,
        }}
      >
        <div style={{ color: "#737373", fontSize: 14, letterSpacing: 1 }}>
          hackra.dev
        </div>

        {/* Participants count */}
        {hackathon.maxParticipants ? (
          <div
            style={{
              alignItems: "center",
              color: "#a3a3a3",
              display: "flex",
              fontSize: 16,
              gap: 8,
            }}
          >
            {/* Simple participant avatars with overlap */}
            {Array.from({ length: Math.min(participantCount, 5) }, (_, i) => {
              const letter = String.fromCodePoint(65 + i);
              return (
                <div
                  key={letter}
                  style={{
                    alignItems: "center",
                    background: `hsl(${145 + i * 20}, 60%, ${40 + i * 5}%)`,
                    border: "2px solid rgba(255,255,255,0.1)",
                    borderRadius: "50%",
                    color: "#fff",
                    display: "flex",
                    fontSize: 10,
                    fontWeight: 700,
                    height: 24,
                    justifyContent: "center",
                    marginLeft: i > 0 ? -6 : 0,
                    width: 24,
                  }}
                >
                  {letter}
                </div>
              );
            })}
            <span>
              {participantCount} / {hackathon.maxParticipants} participants
            </span>
          </div>
        ) : (
          <div style={{ color: "#a3a3a3", fontSize: 16 }}>
            {participantCount} participant{participantCount !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>,
    {
      ...size,
      fonts: fontOptions,
    }
  );
}
