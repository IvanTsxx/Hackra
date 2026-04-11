import { requireUser } from "@/data/auth-dal";

import { CreateHackathonForm } from "./_components/create-hackathon-form";

export default async function CreateHackathonPage() {
  const currentUser = await requireUser();

  return <CreateHackathonForm username={currentUser?.username} />;
}
