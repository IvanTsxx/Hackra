import { getUserByUsername } from "@/data/user";
import { createOgImage, OG_COLORS, OgLayout } from "@/shared/lib/og";

export const dynamic = "force-dynamic";

export default async function Image({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUserByUsername(username);

  const { textLight, brandGreen } = OG_COLORS;

  return createOgImage(({ avatarSrc: _avatarSrc }) => (
    <OgLayout
      // Use user's avatar if available, fallback to null for initials
      avatarSrc={user?.image || null}
      topBar={{ label: "HACKRA", right: "PROFILE" }}
      authorName={user?.name || username}
      url={`https://https://hackra.bongi.dev/user/${username}`}
    >
      {/* Name */}
      <div style={{ color: brandGreen, fontSize: 44, fontWeight: 700 }}>
        {user?.name || username}
      </div>

      {/* Username */}
      <div style={{ color: textLight, fontSize: 28 }}>@{username}</div>

      {/* Bio */}
      {user?.bio && (
        <div style={{ color: textLight, fontSize: 24, maxWidth: 700 }}>
          {user.bio}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
        <div style={{ color: textLight, fontSize: 20 }}>
          <span style={{ color: brandGreen }}>*</span>{" "}
          {user?.organizedHackathons.length || 0} HACKATHONS
        </div>
        <div style={{ color: textLight, fontSize: 20 }}>
          <span style={{ color: brandGreen }}>*</span>{" "}
          {user?.participations.length || 0} PARTICIPATED
        </div>
        <div style={{ color: textLight, fontSize: 20 }}>
          <span style={{ color: brandGreen }}>*</span> {user?.karmaPoints || 0}{" "}
          KARMA
        </div>
      </div>
    </OgLayout>
  ));
}
