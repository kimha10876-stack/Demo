"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { useEffect, useMemo, useState } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../../../../components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { EventActivityRevenueReportResponseList } from "../../../../../interface/revenue/Revenue";

type Props = {
  data: EventActivityRevenueReportResponseList[] | undefined;
};

const chartConfig = {
  revenue: {
    label: "Doanh thu",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function RevenueLineChart({ data }: Props) {
  const [selectedActivityName, setSelectedActivityName] = useState<string>("");

  useEffect(() => {
    if (data && data.length > 0 && !selectedActivityName) {
      setSelectedActivityName(data[0].eventActivityName);
    }
  }, [data, selectedActivityName]);

  const activities = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((activity) => ({
      label: activity.eventActivityName,
      value: activity.eventActivityName,
      revenueData: activity.eventActivityDateReportResponseList
        .filter((entry) => entry.revenue > 0) // Chỉ lấy ngày có doanh thu
        .map((entry) => ({
          date: entry.date,
          revenue: entry.revenue,
        })),
    }));
  }, [data]);

  const selectedActivity = useMemo(() => {
    return activities.find((act) => act.value === selectedActivityName);
  }, [selectedActivityName, activities]);

  return (
    <Card className="mt-8 bg-background text-foreground shadow-md rounded-2xl border">
      <div className="flex justify-left mt-4 mx-4">
        <Select
          onValueChange={setSelectedActivityName}
          value={selectedActivityName}
        >
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Chọn hoạt động" />
          </SelectTrigger>
          <SelectContent>
            {activities.map((activity) => (
              <SelectItem key={activity.value} value={activity.value}>
                {activity.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <CardHeader>
        <CardTitle>Doanh thu theo hoạt động</CardTitle>
        <CardDescription>Biểu đồ doanh thu từ các hoạt động</CardDescription>
      </CardHeader>

      <CardContent>
        {selectedActivity ? (
          <ChartContainer config={chartConfig}>
            <LineChart
              data={selectedActivity.revenueData}
              margin={{ top: 20, left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                dataKey="revenue"
                type="monotone"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={{ fill: "var(--color-revenue)" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="text-muted-foreground">
            Vui lòng chọn một hoạt động
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Tổng doanh thu theo từng hoạt động
        </div>
      </CardFooter>
    </Card>
  );
}
