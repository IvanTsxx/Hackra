"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { signIn } from "@/lib/auth-client";

import { CodeText } from "../code-text";
import { GithubIcon, GoogleIcon } from "../icons";

export function SignupForm() {
  const searchParams = useSearchParams();
  const defaultType =
    searchParams.get("type") === "organizer" ? "organizer" : "participant";

  const [socialLoading, setSocialLoading] = useState<
    "google" | "github" | null
  >(null);
  const [userType, setUserType] = useState<"participant" | "organizer">(
    defaultType
  );

  const handleSocialLogin = async (provider: "google" | "github") => {
    setSocialLoading(provider);
    try {
      // Store userType in sessionStorage to retrieve after OAuth callback
      sessionStorage.setItem("pendingUserType", userType);
      await signIn.social({
        callbackURL: "/api/auth/onboarding-check",
        provider,
      });
    } catch {
      toast.error(`Failed to sign up with ${provider}`);
      setSocialLoading(null);
    }
  };

  const isDisabled = socialLoading !== null;

  return (
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl  uppercase tracking-wider">
          {">"} CREATE ACCOUNT
        </CardTitle>
        <CardDescription className=" text-xs">
          <CodeText>Join the hackathon community</CodeText>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Type Selection */}
        <div className="space-y-2">
          <CodeText as="label">I want to join as</CodeText>
          <Select
            value={userType}
            onValueChange={(v) => setUserType(v as "participant" | "organizer")}
            disabled={isDisabled}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="participant" className="">
                Participant — Join hackathons
              </SelectItem>
              <SelectItem value="organizer" className="">
                Organizer — Host hackathons
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Social Login Buttons Only */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialLogin("google")}
            disabled={isDisabled}
            className="gap-2 text-xs uppercase tracking-wider "
          >
            {socialLoading === "google" ? (
              <Spinner className="w-4 h-4" />
            ) : (
              <GoogleIcon />
            )}
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialLogin("github")}
            disabled={isDisabled}
            className="gap-2 text-xs uppercase tracking-wider "
          >
            {socialLoading === "github" ? (
              <Spinner className="w-4 h-4" />
            ) : (
              <GithubIcon />
            )}
            GitHub
          </Button>
        </div>

        <CodeText as="p" className="text-center">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            sign_in()
          </Link>
        </CodeText>
      </CardContent>
    </Card>
  );
}
