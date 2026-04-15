import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import {
  GeistPixelSquare,
  GeistPixelCircle,
  GeistPixelGrid,
  GeistPixelLine,
  GeistPixelTriangle,
} from "geist/font/pixel";
import dynamic from "next/dynamic";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

import { cn } from "@/lib/utils";
import { ModalProviders } from "@/shared/components/providers/modal-privders";
import { Toaster } from "@/shared/components/ui/sonner";

const ThemeProvider = dynamic(async () => {
  const mod = await import("@/components/theme-provider");
  return mod.ThemeProvider;
});
const TooltipProvider = dynamic(async () => {
  const mod = await import("@/shared/components/ui/tooltip");
  return mod.TooltipProvider;
});

function ProvidersLoader() {
  return <div className="min-h-screen" />;
}

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
        "font-pixel-triangle"
      )}
    >
      <body>
        <Suspense fallback={<ProvidersLoader />}>
          <ThemeProvider>
            <TooltipProvider>
              <NuqsAdapter>
                {children}
                <Toaster position="top-right" richColors />
                <ModalProviders />
              </NuqsAdapter>
            </TooltipProvider>
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
