import type { Metadata } from "next";

import { CodeText } from "@/shared/components/code-text";

export const metadata: Metadata = {
  description:
    "Hackra Privacy Policy. Learn how we collect, use, and protect your personal information when using our hackathon platform.",
  keywords: [
    "privacy policy",
    "data protection",
    "hackathon privacy",
    "personal data",
    "information security",
  ],
  openGraph: {
    description:
      "Hackra Privacy Policy. Learn how we collect, use, and protect your personal information.",
    title: "Privacy Policy | Hackra",
    type: "website",
  },
  title: "Privacy Policy | Hackra",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 relative">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <CodeText
              as="p"
              className="text-xs text-brand-green  uppercase tracking-widest mb-4"
            >
              privacy_policy
            </CodeText>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 ">
              {">"} PRIVACY POLICY
            </h1>
            <p className="text-muted-foreground  text-sm mb-8">
              {"/* Last updated: March 2026 */"}
            </p>

            <div className="prose prose-invert prose-sm  max-w-none space-y-8">
              <section>
                <h2 className="text-lg font-bold  uppercase tracking-wider mb-4">
                  1. Information We Collect
                </h2>
                <p className="text-muted-foreground  text-sm mb-4">
                  {
                    "/* We collect information you provide directly to us, including: */"
                  }
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground  text-sm">
                  <li>Account information (name, email, profile picture)</li>
                  <li>OAuth information from GitHub</li>
                  <li>Organizer details (company, bio)</li>
                  <li>Participation data in hackathons</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold  uppercase tracking-wider mb-4">
                  2. How We Use Information
                </h2>
                <p className="text-muted-foreground  text-sm mb-4">
                  {"/* We use the information we collect to: */"}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground  text-sm">
                  <li>Provide and improve our services</li>
                  <li>Authenticate your account</li>
                  <li>Communicate with you about events</li>
                  <li>Send you important updates</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold  uppercase tracking-wider mb-4">
                  3. Information Sharing
                </h2>
                <p className="text-muted-foreground  text-sm">
                  {
                    "/* We do not sell your personal information. We may share information with: Service providers who assist us in operating our platform. Hackathon organizers (only your name and profile for events you join). */"
                  }
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold  uppercase tracking-wider mb-4">
                  4. Data Security
                </h2>
                <p className="text-muted-foreground  text-sm">
                  {
                    "/* We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, destruction, or disclosure. */"
                  }
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold  uppercase tracking-wider mb-4">
                  5. Your Rights
                </h2>
                <p className="text-muted-foreground  text-sm mb-4">
                  {"/* You have the right to: */"}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground  text-sm">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Delete your account and data</li>
                  <li>Export your data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold  uppercase tracking-wider mb-4">
                  6. Contact Us
                </h2>
                <p className="text-muted-foreground  text-sm">
                  {
                    "/* If you have questions about this Privacy Policy, please contact us at privacy@hackra.dev */"
                  }
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
