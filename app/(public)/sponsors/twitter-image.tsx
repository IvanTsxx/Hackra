import { createOgImage, OG_COLORS, OgLayout } from "@/shared/lib/og";

export const dynamic = "force-dynamic";

export default function Image() {
  const { textLight, brandGreen } = OG_COLORS;

  return createOgImage(({ avatarSrc }) => (
    <OgLayout
      avatarSrc={avatarSrc}
      topBar={{ label: "HACKRA", right: "SPONSORS" }}
      authorName="Hackra"
      url="https://hackra.dev/sponsors"
    >
      {/* Main heading */}
      <div style={{ color: brandGreen, fontSize: 44, fontWeight: 700 }}>
        OUR SPONSORS
      </div>

      {/* Subtitle */}
      <div style={{ color: textLight, fontSize: 28, maxWidth: 700 }}>
        Companies powering hackathons
      </div>

      {/* Tiers */}
      <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
        <div style={{ color: "#E5E5E5", fontSize: 22 }}>PLATINUM</div>
        <div style={{ color: "#FBBF24", fontSize: 22 }}>GOLD</div>
        <div style={{ color: "#A3A3A3", fontSize: 22 }}>SILVER</div>
        <div style={{ color: "#B45309", fontSize: 22 }}>BRONZE</div>
      </div>

      {/* CTA */}
      <div style={{ color: brandGreen, fontSize: 24, marginTop: 16 }}>
        Become a sponsor →
      </div>
    </OgLayout>
  ));
}
