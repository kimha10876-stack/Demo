import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import { TrendingUp } from "lucide-react";
import { EventActivityDashbroadResponseList } from "../../../../../interface/revenue/Revenue";
import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltipContent,
} from "../../../../../components/ui/chart";

type Props = {
  data: EventActivityDashbroadResponseList[] | undefined;
};

// Tạo mảng màu để dùng luân phiên
const COLOR_PALETTE = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

// 1. Tạo chartConfig động
const generateChartConfig = (data: EventActivityDashbroadResponseList[]) => {
  const ticketTypes = new Set<string>();

  data.forEach((item) => {
    item.ticketDashBoardResponseList.forEach((ticket) =>
      ticketTypes.add(ticket.name)
    );
  });

  const config: Record<string, { label: string; color: string }> = {};
  Array.from(ticketTypes).forEach((ticketName, index) => {
    config[ticketName] = {
      label: ticketName,
      color: COLOR_PALETTE[index % COLOR_PALETTE.length],
    };
  });

  return config;
};

// 2. Biến đổi dữ liệu sang dạng Recharts hiểu được
const transformData = (
  rawData: EventActivityDashbroadResponseList[]
): Record<string, any>[] => {
  return rawData.map((item) => {
    const formatted: Record<string, any> = {
      eventActivity: item.eventActivity,
    };

    item.ticketDashBoardResponseList.forEach((ticket) => {
      formatted[ticket.name] = ticket.value;
    });

    return formatted;
  });
};

const TicketsBarChart = ({ data }: Props) => {
  if (!data || data.length === 0) return <>Không có dữ liệu</>;

  const chartConfig = generateChartConfig(data);
  const chartData = transformData(data);

  return (
    <Card className="text-black max-w-2xl bg-background text-foreground shadow-md rounded-2xl border">
      <CardHeader>
        <CardTitle>Số vé bán được theo hoạt động</CardTitle>
        <CardDescription>Thống kê vé đã bán</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart width={400} height={250} data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="eventActivity"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />

            {Object.keys(chartConfig).map((ticketName, index) => (
              <Bar
                key={ticketName}
                dataKey={ticketName}
                stackId="a"
                fill={chartConfig[ticketName].color}
                radius={index === 0 ? [0, 0, 4, 4] : [4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Tổng vé bán được theo từng hoạt động
        </div>
      </CardFooter>
    </Card>
  );
};

export default TicketsBarChart;
