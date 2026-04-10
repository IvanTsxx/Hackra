import { getHomeStats } from "@/data/home";
import { createOgImage, OG_COLORS, OgLayout } from "@/shared/lib/og";
import { SITE_URL } from "@/shared/lib/site";

export const dynamic = "force-dynamic";

export default async function Image() {
  const { textLight, brandGreen } = OG_COLORS;
  const stats = await getHomeStats();

  const hasStats =
    stats.totalHackathons > 0 ||
    stats.totalDevelopers > 0 ||
    stats.totalPrizeAmount > 0;

  return createOgImage(({ avatarSrc }) => (
    <OgLayout
      avatarSrc={avatarSrc}
      topBar={{ label: "HACKRA", right: "HOME" }}
      authorName="Hackra"
      url={SITE_URL}
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

      {/* Stats - only show if there are stats */}
      {hasStats && (
        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 16,
          }}
        >
          {stats.totalHackathons > 0 && (
            <span style={{ color: textLight, fontSize: 24 }}>
              <span style={{ color: brandGreen }}>*</span>{" "}
              {stats.totalHackathons}+ HACKATHONS
            </span>
          )}
          {stats.totalDevelopers > 0 && (
            <span style={{ color: textLight, fontSize: 24 }}>
              <span style={{ color: brandGreen }}>*</span>{" "}
              {stats.totalDevelopers.toLocaleString()}+ DEVELOPERS
            </span>
          )}
          {stats.totalPrizeAmount > 0 && (
            <span style={{ color: textLight, fontSize: 24 }}>
              <span style={{ color: brandGreen }}>*</span> $
              {stats.totalPrizeAmount.toLocaleString()}+ PRIZES
            </span>
          )}
        </div>
      )}
    </OgLayout>
  ));
}
