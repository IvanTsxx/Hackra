import {
  GeistPixelSquare,
  GeistPixelCircle,
  GeistPixelGrid,
  GeistPixelLine,
  GeistPixelTriangle,
} from "geist/font/pixel";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/shared/components/ui/sonner";

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
      <body className="relative">
        <ThemeProvider>
          <NuqsAdapter>
            <Navbar />
            {/* Pixel Grid Background */}
            <div className="absolute inset-0 pixel-grid opacity-40 -z-10" />

            {/* Scanline overlay */}
            <div className="absolute inset-0 scanlines pointer-events-none -z-10" />
            {children}
            <Footer />
            <Toaster position="top-right" richColors />
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
