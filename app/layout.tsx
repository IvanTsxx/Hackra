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
import { ModalProviders } from "@/shared/components/providers/modal-privders";
import { Toaster } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";

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
          <TooltipProvider>
            <NuqsAdapter>
              {children}
              <Toaster position="top-right" richColors />
              <ModalProviders />
            </NuqsAdapter>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
