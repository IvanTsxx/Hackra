"use client";

import dynamic from "next/dynamic";

const Globe3D = dynamic(
  async () => {
    const mod = await import("./globe-3d");
    return mod.Globe3D;
  },
  { ssr: false }
);

export const HeroRight = () => (
  <div className="relative hidden lg:flex items-center justify-center h-[600px] w-full">
    <Globe3D />
  </div>
);
