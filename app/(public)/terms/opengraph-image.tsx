import { createOgImage, OG_COLORS, OgLayout } from "@/shared/lib/og";

export const dynamic = "force-dynamic";

export default function Image() {
  const { textLight, brandGreen } = OG_COLORS;

  return createOgImage(({ avatarSrc }) => (
    <OgLayout
      avatarSrc={avatarSrc}
      topBar={{ label: "HACKRA", right: "TERMS" }}
      authorName="Hackra"
      url="https://hackra.vercel.app/terms"
    >
      {/* Main heading */}
      <div style={{ color: brandGreen, fontSize: 44, fontWeight: 700 }}>
        TERMS OF SERVICE
      </div>

      {/* Subtitle */}
      <div style={{ color: textLight, fontSize: 28, maxWidth: 700 }}>
        Read our terms and conditions for using the platform
      </div>

      {/* Key points */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginTop: 8,
        }}
      >
        <div style={{ color: textLight, fontSize: 22 }}>
          <span style={{ color: brandGreen }}>*</span> User accounts & OAuth
        </div>
        <div style={{ color: textLight, fontSize: 22 }}>
          <span style={{ color: brandGreen }}>*</span> Organizer
          responsibilities
        </div>
        <div style={{ color: textLight, fontSize: 22 }}>
          <span style={{ color: brandGreen }}>*</span> Participant rules
        </div>
        <div style={{ color: textLight, fontSize: 22 }}>
          <span style={{ color: brandGreen }}>*</span> Intellectual property
        </div>
      </div>

      {/* CTA */}
      <div style={{ color: brandGreen, fontSize: 24, marginTop: 16 }}>
        Read more →
      </div>
    </OgLayout>
  ));
}
