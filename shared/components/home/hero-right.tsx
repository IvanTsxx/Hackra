import { getFeaturedHackatonsForMap } from "@/data/hackatons";

import { HackathonGlobe } from "./globe-3d";

export async function HeroRight() {
  const hackathons = await getFeaturedHackatonsForMap();

  return (
    <div className="relative w-full">
      <HackathonGlobe hackathons={hackathons} />
    </div>
  );
}
