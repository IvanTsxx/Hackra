import type { ReactNode } from "react";

import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
interface PublicLayoutFormProps {
  children: ReactNode;
}

const PublicLayout: React.FC<PublicLayoutFormProps> = ({ children }) => (
  <main className="relative">
    <Navbar />
    {/* Pixel Grid Background */}
    <div className="absolute inset-0 pixel-grid opacity-40 -z-10" />

    {/* Scanline overlay */}
    <div className="absolute inset-0 scanlines pointer-events-none -z-10" />
    {children}
    <Footer />
  </main>
);

export default PublicLayout;
