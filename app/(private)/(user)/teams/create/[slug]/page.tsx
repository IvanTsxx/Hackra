import { notFound } from "next/navigation";

import { getHackathon } from "@/data/hackatons";

import { CreateForm } from "./_components/create-form";

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
