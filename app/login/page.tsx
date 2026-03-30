import { Code2 } from "lucide-react";
import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  description: "Sign in to your Hackathon Hub account",
  title: "Sign In - Hackathon Hub",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <div className="absolute inset-0 dot-grid opacity-30" />

      <div className="w-full px-4 relative z-10 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Code2 className="w-8 h-8" />
            <span className="text-xl font-bold">Hackathon Hub</span>
          </Link>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
