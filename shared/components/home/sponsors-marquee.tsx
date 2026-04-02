import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/ui/marquee";
import { SPONSORS } from "@/lib/mock-data";

export const SponsorsMarquee = () => (
  <Marquee>
    <MarqueeFade side="left" />
    <MarqueeFade side="right" />

    <MarqueeContent>
      {SPONSORS.map((item) => (
        <MarqueeItem
          key={item.id}
          className="flex items-center gap-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors shrink-0"
        >
          <span className="uppercase">{item.name}</span>
        </MarqueeItem>
      ))}
    </MarqueeContent>
  </Marquee>
);
