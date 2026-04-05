import { HeroLeft } from "./hero-left";
import { HeroRight } from "./hero-right";

export function HeroSection({
  stats,
}: {
  stats: { icon: string; label: string; value: string }[];
}) {
  return (
    <section className="flex flex-col">
      <div className="flex-1 flex items-center relative z-10">
        <div className="px-4 py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left column — Main Content */}
            <HeroLeft stats={stats} />

            {/* Right column — 3D Globe */}
            <HeroRight />
          </div>
        </div>
      </div>
    </section>
  );
}
