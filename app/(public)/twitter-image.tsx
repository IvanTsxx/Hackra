import { createOgImage, OG_COLORS, OgLayout } from "@/shared/lib/og";

export const dynamic = "force-dynamic";

export default function Image() {
  const { textLight, brandGreen } = OG_COLORS;

  return createOgImage(({ avatarSrc }) => (
    <OgLayout
      avatarSrc={avatarSrc}
      topBar={{ label: "HACKRA", right: "HOME" }}
      authorName="Hackra"
      url="https://hackra.vercel.app"
    >
      {/* Main heading */}
      <div
        style={{
          color: brandGreen,
          fontSize: 44,
          fontWeight: 700,
        }}
      >
        BUILD. COMPETE. TOGETHER.
      </div>

      {/* Subtitle */}
      <div style={{ color: textLight, fontSize: 28, maxWidth: 700 }}>
        The platform for hackathons worldwide
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          gap: 24,
          marginTop: 16,
        }}
      >
        <span style={{ color: textLight, fontSize: 24 }}>
          <span style={{ color: brandGreen }}>*</span> 150+ HACKATHONS
        </span>
        <span style={{ color: textLight, fontSize: 24 }}>
          <span style={{ color: brandGreen }}>*</span> 50K+ DEVELOPERS
        </span>
        <span style={{ color: textLight, fontSize: 24 }}>
          <span style={{ color: brandGreen }}>*</span> $2M+ PRIZES
        </span>
      </div>

      {/* CTA */}
      <div
        style={{
          color: brandGreen,
          fontSize: 24,
          marginTop: 16,
        }}
      >
        Join the community →
      </div>
    </OgLayout>
  ));
}
