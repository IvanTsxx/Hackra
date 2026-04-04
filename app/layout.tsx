import "./globals.css";
import {
  GeistPixelSquare,
  GeistPixelCircle,
  GeistPixelGrid,
  GeistPixelLine,
  GeistPixelTriangle,
} from "geist/font/pixel";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { AuthModalDialog } from "@/shared/components/auth/auth-modal-dialog";
import { Toaster } from "@/shared/components/ui/sonner";
import { AuthProvider } from "@/shared/lib/auth-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        GeistPixelCircle.variable,
        GeistPixelGrid.variable,
        GeistPixelLine.variable,
        GeistPixelSquare.variable,
        GeistPixelTriangle.variable,
        "font-pixel-grid"
      )}
    >
      <body>
        <ThemeProvider>
          <NuqsAdapter>
            <AuthProvider>
              {children}
              <Toaster position="top-right" richColors />
              <AuthModalDialog />
            </AuthProvider>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
