import { createOgImage, OG_COLORS, OgLayout } from "@/shared/lib/og";

export const dynamic = "force-dynamic";

export default function Image() {
  const { textLight, brandGreen } = OG_COLORS;

  return createOgImage(({ avatarSrc }) => (
    <OgLayout
      avatarSrc={avatarSrc}
      topBar={{ label: "HACKRA", right: "ABOUT" }}
      authorName="Hackra"
      url="https://hackra.vercel.app/about"
    >
      {/* Main heading */}
      <div style={{ color: brandGreen, fontSize: 44, fontWeight: 700 }}>
        BUILD TOGETHER
      </div>

      {/* Subtitle */}
      <div style={{ color: textLight, fontSize: 28, maxWidth: 700 }}>
        The platform where developers connect, compete, and create
      </div>

      {/* Mission */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginTop: 8,
        }}
      >
        <div style={{ color: textLight, fontSize: 22 }}>
          <span style={{ color: brandGreen }}>*</span> Democratizing hackathons
        </div>
        <div style={{ color: textLight, fontSize: 22 }}>
          <span style={{ color: brandGreen }}>*</span> Connecting organizers
          with developers
        </div>
        <div style={{ color: textLight, fontSize: 22 }}>
          <span style={{ color: brandGreen }}>*</span> Launchpads for careers
          and ideas
        </div>
      </div>

      {/* CTA */}
      <div style={{ color: brandGreen, fontSize: 24, marginTop: 16 }}>
        Join the movement →
      </div>
    </OgLayout>
  ));
}
