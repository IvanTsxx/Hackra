import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { getHackathonStats } from "@/data/admin-hackatons";

import { AdminCharts } from "./_components/admin-charts";

const statusColors: Record<string, string> = {
  CANCELLED: "var(--chart-5)",
  DRAFT: "var(--muted-foreground)",
  ENDED: "var(--chart-3)",
  LIVE: "var(--chart-2)",
  UPCOMING: "var(--chart-1)",
};

const sourceColors: Record<string, string> = {
  luma: "var(--chart-1)",
  manual: "var(--chart-2)",
};

export default async function AdminDashboardPage() {
  const stats = await getHackathonStats();

  const lumaCount = stats.bySource.find((s) => s.source === "luma")?.count ?? 0;
  const manualCount =
    stats.bySource.find((s) => s.source === "manual" || !s.source)?.count ?? 0;

  const statusData = stats.byStatus.map((s) => ({
    count: s.count,
    fill: statusColors[s.status] ?? "hsl(var(--muted-foreground))",
    status: s.status,
  }));

  const sourceData = [
    { count: lumaCount, fill: sourceColors.luma, source: "Luma" },
    { count: manualCount, fill: sourceColors.manual, source: "Manual" },
  ].filter((d) => d.count > 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your hackathon platform.
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Total Hackathons" value={stats.total} />
        <MetricCard title="Imported from Luma" value={lumaCount} />
        <MetricCard title="Manual" value={manualCount} />
      </div>

      {/* Charts — extracted to client component (recharts uses createContext) */}
      <AdminCharts statusData={statusData} sourceData={sourceData} />
    </div>
  );
}

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
