import { notFound } from "next/navigation";

import { CreateForm } from "@/app/(public)/hackathon/[slug]/teams/create/_components/create-form";
import { getAllHackathons, getHackathon } from "@/data/hackatons";

export const generateStaticParams = async () => {
  const hackathons = await getAllHackathons();
  return hackathons.length > 0
    ? hackathons.map((hackathon) => ({ slug: hackathon.slug }))
    : [{ slug: "fallback" }];
};

export default async function CreateTeamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hackathon = await getHackathon(slug);
  if (!hackathon) notFound();

  return <CreateForm hackathon={hackathon} />;
}
