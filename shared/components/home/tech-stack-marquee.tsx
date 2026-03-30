import { Marquee } from "@/components/ui/marquee";

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
  <div className="relative z-10 border-y border-border bg-card/50 backdrop-blur-sm py-3">
    <Marquee speed="slow" pauseOnHover>
      {techStack.map((tech, idx) => (
        <span
          key={idx}
          className="px-6 py-1 text-xs font-mono text-muted-foreground hover:text-primary transition-colors cursor-default uppercase tracking-widest"
        >
          [{tech}]
        </span>
      ))}
    </Marquee>
  </div>
);
