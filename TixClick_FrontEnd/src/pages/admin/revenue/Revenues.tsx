import { Calendar, DollarSign, Filter, Loader2, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

import { addDays, format } from "date-fns"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"

const generateRevenueData = (days:any) => {
  return Array.from({ length: days }, (_, i) => ({
    date: format(addDays(new Date(), i - days + 1), "MMM dd"),
    totalRevenue: Math.floor(Math.random() * 10000) + 5000,
    ticketSales: Math.floor(Math.random() * 8000) + 3000,
    merchandiseSales: Math.floor(Math.random() * 2000) + 1000,
    foodAndBeverageSales: Math.floor(Math.random() * 1500) + 500,
  }))
}

const revenueByEventType = [
  { name: "Concerts", value: 120000 },
  { name: "Conferences", value: 80000 },
  { name: "Sports Events", value: 100000 },
  { name: "Theater Shows", value: 60000 },
  { name: "Exhibitions", value: 40000 },
]

const topEvents = [
  { id: 1, name: "Summer Music Festival", revenue: 75000, ticketsSold: 1500 },
  { id: 2, name: "Tech Conference 2023", revenue: 50000, ticketsSold: 1000 },
  { id: 3, name: "International Sports Cup", revenue: 100000, ticketsSold: 5000 },
  { id: 4, name: "Broadway Show", revenue: 30000, ticketsSold: 600 },
  { id: 5, name: "Art Exhibition", revenue: 25000, ticketsSold: 2000 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function RevenuePage() {
  const [timeRange, setTimeRange] = useState("30")
  const [isLoading, setIsLoading] = useState(false)
  const [revenueData, setRevenueData] = useState([
    {
      date: "Jan 01",
      totalRevenue: 0,
      ticketSales: 0,
      merchandiseSales: 0,
      foodAndBeverageSales: 0,
    },
  ])
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  useEffect(() => {
    fetchRevenueData()
  }, [timeRange, dateRange]) 

  const fetchRevenueData = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRevenueData(generateRevenueData(Number.parseInt(timeRange)))
    setIsLoading(false)
    console.log(setDateRange)
  }

  const totalRevenue = revenueData.reduce((sum, day) => sum + day.totalRevenue, 0)
  const averageDailyRevenue = totalRevenue / revenueData.length

  return (
    <div className="p-6 bg-[#1E1E1E] text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Revenue Analytics</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px] bg-[#3A3A3A] border-[#4A4A4A] text-white">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-[#00B14F]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Average Daily Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#00B14F]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${averageDailyRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-[#00B14F]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{topEvents.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Revenue Growth</CardTitle>
            <Filter className="h-4 w-4 text-[#00B14F]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+12.5%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle className="text-white">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip contentStyle={{ backgroundColor: "#333", border: "none" }} />
                    <Legend />
                    <Line type="monotone" dataKey="totalRevenue" name="Total Revenue" stroke="#00B14F" />
                    <Line type="monotone" dataKey="ticketSales" name="Ticket Sales" stroke="#0088FE" />
                    <Line type="monotone" dataKey="merchandiseSales" name="Merchandise" stroke="#FFBB28" />
                    <Line type="monotone" dataKey="foodAndBeverageSales" name="Food & Beverage" stroke="#FF8042" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle className="text-white">Revenue by Event Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueByEventType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {revenueByEventType.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#333", border: "none" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#2A2A2A] border-[#3A3A3A] mb-6">
        <CardHeader>
          <CardTitle className="text-white">Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: "#333", border: "none" }} />
                <Legend />
                <Bar dataKey="ticketSales" name="Ticket Sales" stackId="a" fill="#0088FE" />
                <Bar dataKey="merchandiseSales" name="Merchandise Sales" stackId="a" fill="#00C49F" />
                <Bar dataKey="foodAndBeverageSales" name="Food & Beverage" stackId="a" fill="#FFBB28" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#2A2A2A] border-[#3A3A3A] text-white">
        <CardHeader>
          <CardTitle className="text-white">Top Performing Events</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white font-bold">Event Name</TableHead>
                <TableHead className="text-white font-bold">Revenue</TableHead>
                <TableHead className="text-white font-bold">Tickets Sold</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>${event.revenue.toLocaleString()}</TableCell>
                  <TableCell>{event.ticketsSold.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

