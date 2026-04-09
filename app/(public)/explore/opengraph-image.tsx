import { createOgImage, OG_COLORS, OgLayout } from "@/shared/lib/og";

export const dynamic = "force-dynamic";

export default function Image() {
  const { textLight, brandGreen } = OG_COLORS;

  return createOgImage(({ avatarSrc }) => (
    <OgLayout
      avatarSrc={avatarSrc}
      topBar={{ label: "HACKRA", right: "EXPLORE" }}
      authorName="Hackra"
      url="https://hackra.vercel.app/explore"
    >
      {/* Main heading */}
      <div style={{ color: brandGreen, fontSize: 44, fontWeight: 700 }}>
        DISCOVER HACKATHONS
      </div>

      {/* Subtitle */}
      <div style={{ color: textLight, fontSize: 28, maxWidth: 700 }}>
        Find your next coding competition
      </div>

      {/* Features */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginTop: 8,
        }}
      >
        <div style={{ color: textLight, fontSize: 22 }}>
          <span style={{ color: brandGreen }}>*</span> Filter by technology
        </div>
        <div style={{ color: textLight, fontSize: 22 }}>
          <span style={{ color: brandGreen }}>*</span> Search by location
        </div>
        <div style={{ color: textLight, fontSize: 22 }}>
          <span style={{ color: brandGreen }}>*</span> Join teams
        </div>
        <div style={{ color: textLight, fontSize: 22 }}>
          <span style={{ color: brandGreen }}>*</span> Win prizes
        </div>
      </div>

      {/* CTA */}
      <div style={{ color: brandGreen, fontSize: 24, marginTop: 16 }}>
        Start exploring →
      </div>
    </OgLayout>
  ));
}
