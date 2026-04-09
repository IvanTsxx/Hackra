import { createOgImage, OG_COLORS, OgLayout } from "@/shared/lib/og";

export const dynamic = "force-dynamic";

export default function Image() {
  const { textLight, brandGreen } = OG_COLORS;

  return createOgImage(({ avatarSrc }) => (
    <OgLayout
      avatarSrc={avatarSrc}
      topBar={{ label: "HACKRA", right: "PRIVACY" }}
      authorName="Hackra"
      url="https://hackra.dev/privacy"
    >
      {/* Main heading */}
      <div style={{ color: brandGreen, fontSize: 44, fontWeight: 700 }}>
        PRIVACY POLICY
      </div>

      {/* Subtitle */}
      <div style={{ color: textLight, fontSize: 28, maxWidth: 700 }}>
        Learn how we collect, use, and protect your data
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
          <span style={{ color: brandGreen }}>*</span> Information we collect
        </div>
        <div style={{ color: textLight, fontSize: 22 }}>
          <span style={{ color: brandGreen }}>*</span> How we use your data
        </div>
        <div style={{ color: textLight, fontSize: 22 }}>
          <span style={{ color: brandGreen }}>*</span> Data security
        </div>
        <div style={{ color: textLight, fontSize: 22 }}>
          <span style={{ color: brandGreen }}>*</span> Your rights
        </div>
      </div>

      {/* CTA */}
      <div style={{ color: brandGreen, fontSize: 24, marginTop: 16 }}>
        Read more →
      </div>
    </OgLayout>
  ));
}
