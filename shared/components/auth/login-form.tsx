"use client";

import Link from "next/link";
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
import { Spinner } from "@/components/ui/spinner";
import { signIn } from "@/lib/auth-client";

import { CodeText } from "../code-text";
import { GithubIcon, GoogleIcon } from "../icons";

export function LoginForm() {
  const [socialLoading, setSocialLoading] = useState<
    "google" | "github" | null
  >(null);

  const handleSocialLogin = async (provider: "google" | "github") => {
    setSocialLoading(provider);
    try {
      await signIn.social({
        callbackURL: "/api/auth/onboarding-check",
        provider,
      });
    } catch {
      toast.error(`Failed to sign in with ${provider}`);
      setSocialLoading(null);
    }
  };

  const isDisabled = socialLoading !== null;

  return (
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl  uppercase tracking-wider">
          {">"} LOGIN
        </CardTitle>
        <CardDescription className=" text-xs">
          <CodeText>Sign in to your account to continue</CodeText>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Social Login */}
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
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            sign_up()
          </Link>
        </CodeText>
      </CardContent>
    </Card>
  );
}
