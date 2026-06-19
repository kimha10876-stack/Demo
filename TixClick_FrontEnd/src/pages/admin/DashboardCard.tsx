import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export default function DashboardCard({ title, value, icon: Icon } :any) {
    return (
      <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
          <Icon className="h-4 w-4 text-[#00B14F]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{value}</div>
        </CardContent>
      </Card>
    )
  }
  