import { Building2, DollarSign, Trophy, Users, Zap } from "lucide-react";

const mapIcon = (icon: string) => {
  switch (icon) {
    case "Trophy": {
      return <Trophy className="w-4 h-4 text-primary" />;
    }
    case "Users": {
      return <Users className="w-4 h-4 text-primary" />;
    }
    case "Zap": {
      return <Zap className="w-4 h-4 text-primary" />;
    }
    case "DollarSign": {
      return <DollarSign className="w-4 h-4 text-primary" />;
    }
    case "Building2": {
      return <Building2 className="w-4 h-4 text-primary" />;
    }
    default: {
      return null;
    }
  }
};

export const Stats = ({
  stats,
}: {
  stats: { icon: string; label: string; value: string }[];
}) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-reveal-up [animation-delay:300ms]">
    {stats.map((stat) => (
      <div
        key={stat.label}
        className="flex flex-col items-center gap-2 p-4 border border-border bg-card/50 backdrop-blur-sm"
      >
        {mapIcon(stat.icon)}
        <span className="text-xl md:text-2xl font-bold  ">{stat.value}</span>
        <span className="text-xs text-muted-foreground uppercase tracking-widest  ">
          {stat.label}
        </span>
      </div>
    ))}
  </div>
);
