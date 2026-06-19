import { Calendar, DollarSign, Menu, Ticket, Users, X } from "lucide-react"
import { useState } from "react"

import { Select } from "@radix-ui/react-select"
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import DashboardCard from "./DashboardCard"

const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4500 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 5500 },
]

const eventTypeData = [
  { name: "Concerts", value: 400 },
  { name: "Conferences", value: 300 },
  { name: "Sports", value: 300 },
  { name: "Theater", value: 200 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const ticketSalesData = [
  { name: "Week 1", sales: 400 },
  { name: "Week 2", sales: 300 },
  { name: "Week 3", sales: 500 },
  { name: "Week 4", sales: 450 },
]

const upcomingEvents = [
  { id: 1, name: "Summer Music Festival", date: "2023-07-15", ticketsSold: 1500, revenue: 75000 },
  { id: 2, name: "Tech Conference 2023", date: "2023-08-22", ticketsSold: 800, revenue: 40000 },
  { id: 3, name: "Comedy Night", date: "2023-06-30", ticketsSold: 300, revenue: 9000 },
  { id: 4, name: "Local Theater Play", date: "2023-07-08", ticketsSold: 200, revenue: 5000 },
]

export default function ProfessionalDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#1E1E1E] text-white">
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-[#2A2A2A] transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Event Admin</h1>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        {/* <nav className="mt-8">
          <Link to="chart">
            <NavItem icon={BarChartIcon} label="Dashboard" active />
          </Link>
          <Link to="events">
            <NavItem icon={Calendar} label="Events" />
          </Link>
          <Link to="tickets">
            <NavItem icon={Ticket} label="Tickets" />
          </Link>
          <Link to="attendees">
            <NavItem icon={Users} label="Attendees" />
          </Link>
          <Link to="revenue">
            <NavItem icon={DollarSign} label="Revenue" />
          </Link>
        </nav> */}
      </aside>

      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="flex items-center justify-between p-4 bg-[#2A2A2A]">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center space-x-4">
            <Select>
              <SelectTrigger className="w-[180px] bg-[#3A3A3A] border-[#4A4A4A] text-white">
                <SelectValue placeholder="Select event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="concert">Summer Concert</SelectItem>
                <SelectItem value="conference">Tech Conference</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" className="w-40 bg-[#3A3A3A] border-[#4A4A4A] text-white" />
            <Button className="bg-[#00B14F] hover:bg-[#00963F] text-white">Generate Report</Button>
          </div>
        </header>

        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Event Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard title="Total Tickets Sold" value="1,234" icon={Ticket} />
            <DashboardCard title="Total Revenue" value="$45,678" icon={DollarSign} />
            <DashboardCard title="Upcoming Events" value="5" icon={Calendar} />
            <DashboardCard title="Total Attendees" value="2,567" icon={Users} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-white">Revenue by Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#333", border: "none" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Bar dataKey="revenue" fill="#00B14F" />
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
                      >
                        {eventTypeData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
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
                  <LineChart data={ticketSalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#333", border: "none" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Line type="monotone" dataKey="sales" stroke="#00B14F" />
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
                  <TableRow className="font-medium bg-white text-black">
                    <TableHead className="text-black font-bold">Event Name</TableHead>
                    <TableHead className="text-black font-bold">Date</TableHead>
                    <TableHead className="text-black font-bold">Tickets Sold</TableHead>
                    <TableHead className="text-black font-bold">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium bg-white">{event.name}</TableCell>
                      <TableCell className="font-medium bg-white">{event.date}</TableCell>
                      <TableCell className="font-medium bg-white">{event.ticketsSold}</TableCell>
                      <TableCell className="font-medium bg-white">${event.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}




