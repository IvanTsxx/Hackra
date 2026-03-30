import { Code2, Terminal } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { CodeText } from "@/shared/components/code-text";

export default async function OnboardingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If already has userType, redirect to dashboard
  if (session?.user) {
    const { userType } = session.user as { userType?: string };
    if (userType) {
      redirect("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <div className="absolute inset-0 dot-grid opacity-30" />

      <div className="w-full px-4 relative z-10 flex flex-col items-center justify-center max-w-2xl">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Code2 className="w-8 h-8" />
            <span className="text-xl font-bold">Hackra</span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <CodeText
            as="p"
            className="text-xs text-primary  uppercase tracking-widest mb-4"
          >
            onboarding.init()
          </CodeText>
          <h1 className="text-2xl md:text-3xl font-bold mb-4 ">
            {">"} CHOOSE YOUR PATH
          </h1>
          <p className="text-sm text-muted-foreground ">
            {
              "/* Select how you want to participate in the hackathon community */"
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Participant Card */}
          <Card className="bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 transition-colors">
            <CardHeader>
              <Terminal className="w-8 h-8 text-primary mb-2" />
              <CardTitle className=" uppercase tracking-wider">
                Participant
              </CardTitle>
              <CardDescription className=" text-xs">
                <CodeText>Join hackathons and build projects</CodeText>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-xs text-muted-foreground  space-y-2 mb-6">
                <li>• Browse and join hackathons</li>
                <li>• Build teams and projects</li>
                <li>• Submit your work</li>
                <li>• Connect with developers</li>
              </ul>
              <form action="/api/onboarding/set-type" method="POST">
                <input type="hidden" name="userType" value="participant" />
                <Button
                  type="submit"
                  className="w-full gap-2 uppercase tracking-wider text-xs "
                >
                  {">"} Join as Participant
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Organizer Card */}
          <Card className="bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 transition-colors">
            <CardHeader>
              <svg
                className="w-8 h-8 text-primary mb-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <CardTitle className=" uppercase tracking-wider">
                Organizer
              </CardTitle>
              <CardDescription className=" text-xs">
                <CodeText>Host and manage hackathons</CodeText>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-xs text-muted-foreground  space-y-2 mb-6">
                <li>• Create hackathons</li>
                <li>• Manage participants</li>
                <li>• Set prizes and rules</li>
                <li>• Build your community</li>
              </ul>
              <form action="/api/onboarding/set-type" method="POST">
                <input type="hidden" name="userType" value="organizer" />
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full gap-2 uppercase tracking-wider text-xs "
                >
                  {">"} Join as Organizer
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
