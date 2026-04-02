import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/ui/marquee";

const techStack = [
  "REACT",
  "NEXT.JS",
  "TYPESCRIPT",
  "NODE.JS",
  "PYTHON",
  "RUST",
  "GO",
  "TAILWIND",
  "POSTGRESQL",
  "REDIS",
  "DOCKER",
  "K8S",
  "AWS",
  "VERCEL",
  "SUPABASE",
];

export const TechStackMarquee = () => (
  <Marquee>
    <MarqueeFade side="left" />
    <MarqueeFade side="right" />

    <MarqueeContent>
      {techStack.map((item) => (
        <MarqueeItem
          key={item}
          className="flex items-center gap-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors shrink-0"
        >
          <span className="uppercase">{item}</span>
        </MarqueeItem>
      ))}
    </MarqueeContent>
  </Marquee>
);
