import { Code2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  description: "Sign in to your Hackra account",
  title: "Sign In - Hackra",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative py-12">
      {/* Pixel Grid Background */}
      <div className="absolute inset-0 pixel-grid opacity-40" />

      {/* Scanline overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none" />

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
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
