import dynamic from "next/dynamic";

const TechStackMarqueeContent = dynamic(
  async () => {
    const mod = await import("@/shared/components/home/tech-stack-content");
    return { default: mod.TechStackMarqueeContent };
  },
  {
    loading: () => (
      <div className="flex items-center justify-center py-8 text-muted-foreground/30 animate-pulse">
        <span className=" text-xs tracking-widest">LOADING TECH STACK...</span>
      </div>
    ),
  }
);

export const TechStackMarquee = () => <TechStackMarqueeContent />;
