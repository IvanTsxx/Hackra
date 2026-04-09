import { notFound } from "next/navigation";

import { getTeamById } from "@/data/teams";
import { createOgImage, OG_COLORS, OgLayout } from "@/shared/lib/og";

export const dynamic = "force-dynamic";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const team = await getTeamById(id);
  if (!team) notFound();

  const { textLight, brandGreen } = OG_COLORS;

  return createOgImage(({ avatarSrc }) => (
    <OgLayout
      avatarSrc={avatarSrc}
      topBar={{ label: "HACKRA", right: "TEAM" }}
      authorName={team.name}
      url={`https://hackra.dev/team/${id}`}
    >
      {/* Team name */}
      <div style={{ color: brandGreen, fontSize: 44, fontWeight: 700 }}>
        {team.name}
      </div>

      {/* Hackathon */}
      {team.hackathon && (
        <div style={{ color: textLight, fontSize: 24 }}>
          {team.hackathon.title}
        </div>
      )}

      {/* Description */}
      {team?.description && (
        <div style={{ color: textLight, fontSize: 20, maxWidth: 700 }}>
          {team.description.slice(0, 100)}
          {team.description.length > 100 ? "..." : ""}
        </div>
      )}

      {/* Stats */}
      {team && (
        <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
          <div style={{ color: textLight, fontSize: 20 }}>
            <span style={{ color: brandGreen }}>*</span> {team.members.length}/
            {team.maxMembers} MEMBERS
          </div>
          <div style={{ color: textLight, fontSize: 20 }}>
            <span style={{ color: brandGreen }}>*</span>{" "}
            {team.maxMembers - team.members.length} OPEN SPOTS
          </div>
        </div>
      )}

      {/* Tech stack */}
      {team.techs && team.techs.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 8,
          }}
        >
          {team.techs.slice(0, 5).map((tech) => (
            <div
              key={tech}
              style={{
                background: "rgba(255,255,255,0.06)",
                color: textLight,
                fontSize: 16,
                padding: "4px 12px",
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      )}
    </OgLayout>
  ));
}
