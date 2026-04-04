"use client";

import { Bar, BarChart, Pie, PieChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

/* const statusColors: Record<string, string> = {
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
 */
interface StatusChartData {
  status: string;
  count: number;
  fill: string;
}

interface SourceChartData {
  source: string;
  count: number;
  fill: string;
}

interface AdminChartsProps {
  statusData: StatusChartData[];
  sourceData: SourceChartData[];
}

export function AdminCharts({ statusData, sourceData }: AdminChartsProps) {
  // oxlint-disable-next-line unicorn/prefer-object-from-entries
  const statusChartConfig = statusData.reduce(
    (acc, s) => ({
      // oxlint-disable-next-line oxc/no-accumulating-spread
      ...acc,
      [s.status]: {
        color: s.fill,
        label: s.status,
      },
    }),
    {} as Record<string, { label: string; color: string }>
  );

  const sourceChartConfig: Record<string, { color: string; label: string }> =
    {};
  for (const d of sourceData) {
    sourceChartConfig[d.source] = { color: d.fill, label: d.source };
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Hackathons by Status</CardTitle>
          <CardDescription>Distribution across all states</CardDescription>
        </CardHeader>
        <CardContent>
          {statusData.length > 0 ? (
            <ChartContainer
              config={statusChartConfig}
              className="min-h-[200px]"
            >
              <BarChart data={statusData}>
                <XAxis dataKey="status" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="count" fill="var(--color-chart-1)" radius={4} />
              </BarChart>
            </ChartContainer>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No hackathons yet.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hackathons by Source</CardTitle>
          <CardDescription>Where events come from</CardDescription>
        </CardHeader>
        <CardContent>
          {sourceData.length > 0 ? (
            <ChartContainer
              config={sourceChartConfig}
              className="min-h-[200px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Pie
                  data={sourceData}
                  dataKey="count"
                  nameKey="source"
                  outerRadius={80}
                  label
                />
              </PieChart>
            </ChartContainer>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No hackathons yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
