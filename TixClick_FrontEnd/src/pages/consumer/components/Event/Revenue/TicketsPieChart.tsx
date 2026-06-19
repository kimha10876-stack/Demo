import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../../../components/ui/card";
import { EventActivityDashbroadResponseList } from "../../../../../interface/revenue/Revenue";

type Props = {
  data: EventActivityDashbroadResponseList[] | undefined;
};

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"];

// ✅ Tooltip hiển thị phần trăm đúng
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    const { name, value, __total } = item.payload;
    const percent = ((value / __total) * 100).toFixed(1);

    return (
      <div className="rounded-md bg-background px-3 py-2 text-sm shadow-md border border-border">
        <div>
          <span className="font-medium">{name}</span>: <span>{value} vé</span> (
          <span className="text-muted-foreground">{percent}%</span>)
        </div>
      </div>
    );
  }

  return null;
};

const TicketsPieChart = ({ data }: Props) => {
  // console.log(data);
  if (data == undefined) return <div>Không có dữ liệu</div>;
  return (
    <div className="grid grid-rows-1 md:grid-rows-2 gap-8">
      {data.map((activity, index) => {
        const total = activity.ticketDashBoardResponseList.reduce(
          (sum, t) => sum + t.value,
          0
        );
        const pieData = activity.ticketDashBoardResponseList.map((t) => ({
          ...t,
          __total: total,
        }));

        return (
          <Card
            key={index}
            className="bg-background text-foreground shadow-md rounded-2xl border"
          >
            <CardHeader>
              <CardTitle>{activity.eventActivity}</CardTitle>
              <CardDescription>Tỉ lệ vé bán ra</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) =>
                      `${name}: ${((value / total) * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TicketsPieChart;
