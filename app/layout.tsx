import {
  GeistPixelSquare,
  GeistPixelCircle,
  GeistPixelGrid,
  GeistPixelLine,
  GeistPixelTriangle,
} from "geist/font/pixel";

import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

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
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
