import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCurrentUser } from "@/data/auth-dal";
import { getUserCertificates } from "@/data/certificates";

import { MyCertificatesClient } from "./_components/my-certificates-client";

export const metadata: Metadata = {
  title: "My Certificates | Hackra",
};

export default async function MyCertificatesPage() {
  const user = await getCurrentUser();
  if (!user?.id) notFound();

  const certificates = await getUserCertificates(user.id);

  return <MyCertificatesClient certificates={certificates} />;
}
