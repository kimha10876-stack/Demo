import { Calendar, DollarSign, Ticket, Users } from "lucide-react"
import { useEffect, useState } from "react"

import { Select } from "@radix-ui/react-select"
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import DashboardCard from "./DashboardCard"


const generateDailyData = (days:any) => {
  return Array.from({ length: days }, (_, i) => ({
    name: `Day ${i + 1}`,
    revenue: Math.floor(Math.random() * 1000) + 500,
    tickets: Math.floor(Math.random() * 100) + 50,
  }))
}

const generateMonthlyData = (months:any) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return Array.from({ length: months }, (_, i) => ({
    name: monthNames[i],
    revenue: Math.floor(Math.random() * 10000) + 5000,
    tickets: Math.floor(Math.random() * 1000) + 500,
  }))
}

const generateYearlyData = (years:any) => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: years }, (_, i) => ({
    name: `${currentYear - years + i + 1}`,
    revenue: Math.floor(Math.random() * 100000) + 50000,
    tickets: Math.floor(Math.random() * 10000) + 5000,
  }))
}



export default function AdminDashboard() {
  // const [sidebarOpen, setSidebarOpen] = useState(false)
  const [timeRange, setTimeRange] = useState("month")
  const [chartData, setChartData] = useState([
    {
      name: "Jan",
      revenue: 5000,
      tickets: 500,
    }
  ])

  useEffect(() => {
    switch (timeRange) {
      case "day":
        setChartData(generateDailyData(30))
        break
      case "month":
        setChartData(generateMonthlyData(12))
        break
      case "year":
        setChartData(generateYearlyData(5))
        break
      default:
        setChartData(generateMonthlyData(12))
    }
  }, [timeRange])

  const eventTypeData = [
    { name: "Concerts", value: 400 },
    { name: "Conferences", value: 300 },
    { name: "Sports", value: 300 },
    { name: "Theater", value: 200 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  const upcomingEvents = [
    { id: 1, name: "Summer Music Festival", date: "2023-07-15", ticketsSold: 1500, revenue: 75000 },
    { id: 2, name: "Tech Conference 2023", date: "2023-08-22", ticketsSold: 800, revenue: 40000 },
    { id: 3, name: "Comedy Night", date: "2023-06-30", ticketsSold: 300, revenue: 9000 },
    { id: 4, name: "Local Theater Play", date: "2023-07-08", ticketsSold: 200, revenue: 5000 },
  ]

  return (
    // <div className="flex h-screen bg-[#1E1E1E] text-white">
      <>

      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="flex items-center justify-between p-4 bg-[#2A2A2A]">
          {/* <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button> */}
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] bg-[#3A3A3A] border-[#4A4A4A] text-white">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Daily</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="year">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Overview Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard
              title="Total Tickets Sold"
              value={chartData.reduce((sum, item) => sum + item.tickets, 0).toLocaleString()}
              icon={Ticket}
            />
            <DashboardCard
              title="Total Revenue"
              value={`$${chartData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}`}
              icon={DollarSign}
            />
            <DashboardCard title="Upcoming Events" value={upcomingEvents.length.toString()} icon={Calendar} />
            <DashboardCard
              title="Average Ticket Price"
              value={`$${Math.round(chartData.reduce((sum, item) => sum + item.revenue, 0) / chartData.reduce((sum, item) => sum + item.tickets, 0)).toLocaleString()}`}
              icon={Users}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-white">Revenue and Ticket Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis yAxisId="left" stroke="#888" />
                      <YAxis yAxisId="right" orientation="right" stroke="#888" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#333", border: "none" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#00B14F" />
                      <Bar yAxisId="right" dataKey="tickets" name="Tickets" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-white">Event Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={eventTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {eventTypeData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#333", border: "none" }}
                        labelStyle={{ color: "#fff" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#2A2A2A] border-[#3A3A3A] mb-8">
            <CardHeader>
              <CardTitle className="text-white">Ticket Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#333", border: "none" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="tickets" name="Tickets Sold" stroke="#00B14F" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle className="text-white">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white font-bold">Event Name</TableHead>
                    <TableHead className="text-white font-bold">Date</TableHead>
                    <TableHead className="text-white font-bold">Tickets Sold</TableHead>
                    <TableHead className="text-white font-bold">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-white">
                  {upcomingEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>{event.ticketsSold}</TableCell>
                      <TableCell>${event.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    {/* </div> */}
    </>
  )
}








