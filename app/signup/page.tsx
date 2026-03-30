import { Code2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { SignupForm } from "@/components/auth/signup-form";

export const metadata = {
  description: "Create a new Hackra account",
  title: "Sign Up - Hackra",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative py-12">
      <div className="absolute inset-0 dot-grid opacity-30" />

      <div className="w-full px-4 relative z-10 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Code2 className="w-8 h-8" />
            <span className="text-xl font-bold">Hackra</span>
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="w-full max-w-md mx-auto h-96 bg-card/50 rounded-lg animate-pulse" />
          }
        >
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
