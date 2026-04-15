import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getCertificateByToken,
  getRecentCertificates,
} from "@/data/certificates";
import { SITE_URL } from "@/shared/lib/site";

import { CertificateView } from "../_components/certificate-view";

interface Props {
  params: Promise<{ token: string }>;
}

// Generate static params for热门 certificates (dynamic for most)
export async function generateStaticParams() {
  // Only pre-render the most recent certificates
  const recentCertificates = await getRecentCertificates();

  if (recentCertificates.length === 0) {
    return [
      {
        token: "fallback",
      },
    ];
  }

  return recentCertificates.map((cert) => ({ token: cert.token }));
}

// Generate metadata with OpenGraph
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;

  const certificate = await getCertificateByToken(token);

  if (!certificate) {
    return {
      title: "Certificate | Hackra",
    };
  }

  const roleLabel =
    certificate.role === "PARTICIPANT"
      ? "Participant"
      : certificate.role === "ORGANIZER"
        ? "Organizer"
        : certificate.role === "WINNER" || certificate.place
          ? `Winner (${certificate.place})`
          : certificate.role;

  const title = `${certificate.user.name} - ${roleLabel} Certificate | ${certificate.hackathon.title}`;
  const description = `Certificate awarded to ${certificate.user.name} for participating in ${certificate.hackathon.title}. Join us in celebrating this achievement!`;

  const images = [`${SITE_URL}/certificate/${token}/og`];

  return {
    description,
    openGraph: {
      description,
      images,
      siteName: "Hackra",
      title,
      type: "profile",
    },
    title,
    twitter: {
      card: "summary_large_image",
      description,
      images,
      title,
    },
  };
}

// Page component
export default async function CertificatePage({ params }: Props) {
  const { token } = await params;

  const certificate = await getCertificateByToken(token);

  if (!certificate) {
    notFound();
  }

  return <CertificateView certificate={certificate} />;
}
