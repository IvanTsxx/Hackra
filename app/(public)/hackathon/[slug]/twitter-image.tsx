import { getHackathon } from "@/data/hackatons";
import { createOgImage, OG_COLORS, OgLayout } from "@/shared/lib/og";

export const dynamic = "force-dynamic";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hackathon = await getHackathon(slug);

  const { textLight, brandGreen } = OG_COLORS;

  return createOgImage(() => (
    <OgLayout
      avatarSrc={null}
      topBar={{ label: "HACKRA", right: "HACKATHON" }}
      authorName={hackathon?.title || "Hackathon"}
      url={`https://hackra.dev/hackathon/${slug}`}
    >
      {/* Title */}
      <div style={{ color: brandGreen, fontSize: 44, fontWeight: 700 }}>
        {hackathon?.title || "Hackathon"}
      </div>

      {/* Description */}
      {hackathon?.description && (
        <div style={{ color: textLight, fontSize: 24, maxWidth: 800 }}>
          {hackathon.description.slice(0, 150)}
          {hackathon.description.length > 150 ? "..." : ""}
        </div>
      )}

      {/* Dates */}
      {hackathon && (
        <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
          <div style={{ color: textLight, fontSize: 20 }}>
            <span style={{ color: brandGreen }}>*</span>{" "}
            {new Date(hackathon.startDate).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
          <div style={{ color: textLight, fontSize: 20 }}>
            <span style={{ color: brandGreen }}>*</span>{" "}
            {new Date(hackathon.endDate).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
          <div style={{ color: textLight, fontSize: 20 }}>
            <span style={{ color: brandGreen }}>*</span>{" "}
            {hackathon.isOnline ? "ONLINE" : hackathon.location}
          </div>
        </div>
      )}

      {/* Prizes */}
      {hackathon?.prizes && hackathon.prizes.length > 0 && (
        <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
          {hackathon.prizes.slice(0, 3).map((prize) => (
            <div
              key={prize.place}
              style={{
                border: `1px solid ${brandGreen}`,
                fontSize: 18,
                padding: "8px 16px",
              }}
            >
              <span style={{ color: brandGreen }}>{prize.place}</span>
              <span style={{ color: textLight, marginLeft: 8 }}>
                {prize.amount}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      {hackathon?.tags && hackathon.tags.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 8,
          }}
        >
          {hackathon.tags.slice(0, 5).map((tag) => (
            <div
              key={tag}
              style={{
                background: "rgba(255,255,255,0.06)",
                color: textLight,
                fontSize: 16,
                padding: "4px 12px",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      )}
    </OgLayout>
  ));
}
