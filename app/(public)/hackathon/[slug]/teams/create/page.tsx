import { notFound } from "next/navigation";

import { CreateForm } from "@/app/(public)/hackathon/[slug]/teams/create/_components/create-form";
import { getHackathon } from "@/data/hackatons";

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
