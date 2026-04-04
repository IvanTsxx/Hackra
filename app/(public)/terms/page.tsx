import { CodeText } from "@/shared/components/code-text";

export const metadata = {
  description: "Terms of Service - Hackra",
  title: "Terms of Service - Hackra",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 relative">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <CodeText
              as="p"
              className="text-xs text-primary  uppercase tracking-widest mb-4"
            >
              terms_of_service
            </CodeText>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 ">
              {">"} TERMS OF SERVICE
            </h1>
            <p className="text-muted-foreground  text-sm mb-8">
              {"/* Last updated: March 2026 */"}
            </p>

            <div className="prose prose-invert prose-sm  max-w-none space-y-8">
              <section>
                <h2 className="text-lg font-bold  uppercase tracking-wider mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground  text-sm">
                  {
                    "/* By accessing and using Hackra, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, you should not use our services. */"
                  }
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold  uppercase tracking-wider mb-4">
                  2. Description of Service
                </h2>
                <p className="text-muted-foreground  text-sm">
                  {
                    "/* Hackra is a platform for organizing and participating in hackathons. We provide tools for organizers to create events and for developers to discover and join them. */"
                  }
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold  uppercase tracking-wider mb-4">
                  3. User Accounts
                </h2>
                <p className="text-muted-foreground  text-sm mb-4">
                  {
                    "/* To use Hackra, you must create an account using Google or GitHub OAuth. You agree to: */"
                  }
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground  text-sm">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account</li>
                  <li>Promptly update any changes to your information</li>
                  <li>
                    Accept responsibility for all activities under your account
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold  uppercase tracking-wider mb-4">
                  4. Organizer Responsibilities
                </h2>
                <p className="text-muted-foreground  text-sm mb-4">
                  {"/* Organizers who create hackathons agree to: */"}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground  text-sm">
                  <li>Provide accurate event information</li>
                  <li>Follow all applicable laws and regulations</li>
                  <li>Treat all participants respectfully</li>
                  <li>Fulfill promised prizes and rewards</li>
                  <li>Respect participant privacy and data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold  uppercase tracking-wider mb-4">
                  5. Participant Responsibilities
                </h2>
                <p className="text-muted-foreground  text-sm mb-4">
                  {"/* Participants agree to: */"}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground  text-sm">
                  <li>Follow event rules and guidelines</li>
                  <li>Submit original work</li>
                  <li>Respect other participants and organizers</li>
                  <li>Not engage in cheating or misconduct</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold  uppercase tracking-wider mb-4">
                  6. Intellectual Property
                </h2>
                <p className="text-muted-foreground  text-sm">
                  {
                    "/* Participants retain ownership of their project submissions. Organizers retain ownership of their hackathon content. By submitting content to Hackra, you grant us a license to use it for platform purposes. */"
                  }
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold  uppercase tracking-wider mb-4">
                  7. Limitation of Liability
                </h2>
                <p className="text-muted-foreground  text-sm">
                  {
                    "/* Hackra is not responsible for any disputes between organizers and participants. We do not guarantee the quality, safety, or legality of any hackathon. */"
                  }
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold  uppercase tracking-wider mb-4">
                  8. Termination
                </h2>
                <p className="text-muted-foreground  text-sm">
                  {
                    "/* We reserve the right to terminate accounts that violate these terms or engage in illegal or harmful activities. */"
                  }
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold  uppercase tracking-wider mb-4">
                  9. Changes to Terms
                </h2>
                <p className="text-muted-foreground  text-sm">
                  {
                    "/* We may modify these terms at any time. Continued use of Hackra after changes constitutes acceptance of the new terms. */"
                  }
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold  uppercase tracking-wider mb-4">
                  10. Contact
                </h2>
                <p className="text-muted-foreground  text-sm">
                  {
                    "/* Questions about these Terms of Service should be sent to terms@hackra.dev */"
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
