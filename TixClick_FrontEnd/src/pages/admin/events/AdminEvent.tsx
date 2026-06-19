import React from "react"

import { Badge, BarChart3, Calendar, DollarSign, Map, PieChart, Ticket, TrendingUp, Users } from "lucide-react"
import { useEffect, useState } from "react"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Progress } from "../../../components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"

const eventsByMonth = [
  { name: "Jan", events: 4, revenue: 12000 },
  { name: "Feb", events: 3, revenue: 10000 },
  { name: "Mar", events: 5, revenue: 15000 },
  { name: "Apr", events: 7, revenue: 22000 },
  { name: "May", events: 2, revenue: 8000 },
  { name: "Jun", events: 6, revenue: 18000 },
  { name: "Jul", events: 8, revenue: 25000 },
  { name: "Aug", events: 9, revenue: 30000 },
  { name: "Sep", events: 5, revenue: 17000 },
  { name: "Oct", events: 4, revenue: 14000 },
  { name: "Nov", events: 6, revenue: 20000 },
  { name: "Dec", events: 10, revenue: 35000 },
]

const eventTypeData = [
  { name: "Concerts", value: 35, color: "#0088FE" },
  { name: "Conferences", value: 25, color: "#00C49F" },
  { name: "Sports", value: 20, color: "#FFBB28" },
  { name: "Theater", value: 15, color: "#FF8042" },
  { name: "Exhibitions", value: 5, color: "#8884D8" },
]

const attendanceData = [
  { name: "Mon", morning: 40, afternoon: 60, evening: 80 },
  { name: "Tue", morning: 30, afternoon: 50, evening: 70 },
  { name: "Wed", morning: 45, afternoon: 70, evening: 90 },
  { name: "Thu", morning: 50, afternoon: 60, evening: 95 },
  { name: "Fri", morning: 60, afternoon: 80, evening: 120 },
  { name: "Sat", morning: 90, afternoon: 110, evening: 150 },
  { name: "Sun", morning: 70, afternoon: 90, evening: 130 },
]

const locationData = [
  { name: "New York", value: 30 },
  { name: "Los Angeles", value: 25 },
  { name: "Chicago", value: 15 },
  { name: "Miami", value: 10 },
  { name: "Austin", value: 20 },
]

const upcomingEvents = [
  {
    id: 1,
    name: "Summer Music Festival",
    date: "2023-07-15",
    type: "Concert",
    location: "Central Park",
    ticketsSold: 1500,
    capacity: 2000,
    revenue: 75000,
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 2,
    name: "Tech Conference 2023",
    date: "2023-08-22",
    type: "Conference",
    location: "Convention Center",
    ticketsSold: 800,
    capacity: 1000,
    revenue: 40000,
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 3,
    name: "Basketball Championship",
    date: "2023-09-05",
    type: "Sports",
    location: "Sports Arena",
    ticketsSold: 5000,
    capacity: 6000,
    revenue: 150000,
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 4,
    name: "Broadway Show",
    date: "2023-07-30",
    type: "Theater",
    location: "Grand Theater",
    ticketsSold: 600,
    capacity: 800,
    revenue: 30000,
    image: "/placeholder.svg?height=100&width=200",
  },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function AdminEvent() {
  const [timeRange, setTimeRange] = useState("year")
  const [eventType, setEventType] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 800)
  }, [])

  return (
    <div className="p-6 bg-[#1E1E1E] text-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Event Analytics Dashboard</h1>
          <p className="text-gray-400 mt-1">Visual overview of your events performance and metrics</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] bg-[#3A3A3A] border-[#4A4A4A] text-white">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger className="w-[180px] bg-[#3A3A3A] border-[#4A4A4A] text-white">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="concert">Concerts</SelectItem>
              <SelectItem value="conference">Conferences</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="theater">Theater</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 text-white">
        <MetricCard
          title="Total Events"
          value="65"
          icon={Calendar}
          trend="+12%"
          description="vs. previous period"
          trendDirection="up"
        />
        <MetricCard
          title="Total Attendees"
          value="24,500"
          icon={Users}
          trend="+18%"
          description="vs. previous period"
          trendDirection="up"
        />
        <MetricCard
          title="Tickets Sold"
          value="22,345"
          icon={Ticket}
          trend="+8%"
          description="vs. previous period"
          trendDirection="up"
        />
        <MetricCard
          title="Total Revenue"
          value="$226,000"
          icon={DollarSign}
          trend="+15%"
          description="vs. previous period"
          trendDirection="up"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-[#2A2A2A] border-b border-[#3A3A3A] w-full justify-start rounded-none h-auto p-0">
          <TabsTrigger
            value="overview"
            className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#00B14F] px-6 py-3"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#00B14F] px-6 py-3"
          >
            Events
          </TabsTrigger>
          <TabsTrigger
            value="attendance"
            className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#00B14F] px-6 py-3"
          >
            Attendance
          </TabsTrigger>
          <TabsTrigger
            value="locations"
            className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#00B14F] px-6 py-3"
          >
            Locations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-[#00B14F]" />
                  Events & Revenue by Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B14F]"></div>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={eventsByMonth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis yAxisId="left" stroke="#888" />
                        <YAxis yAxisId="right" orientation="right" stroke="#888" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#333", border: "none" }}
                          labelStyle={{ color: "#fff" }}
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="events" name="Events" fill="#00B14F" />
                        <Bar yAxisId="right" dataKey="revenue" name="Revenue ($)" fill="#0088FE" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <PieChart className="mr-2 h-5 w-5 text-[#00B14F]" />
                  Event Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B14F]"></div>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={eventTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {eventTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: "#333", border: "none" }}
                          formatter={(value, name) => [`${value}%`, name]}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-[#00B14F]" />
                Revenue Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B14F]"></div>
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={eventsByMonth}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00B14F" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#00B14F" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#333", border: "none" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#00B14F"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        name="Revenue ($)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="bg-[#2A2A2A] border-[#3A3A3A] overflow-hidden">
                <div className="relative h-40">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge
                      className={`
                      ${event.type === "Concert" ? "bg-blue-500" : ""}
                      ${event.type === "Conference" ? "bg-green-500" : ""}
                      ${event.type === "Sports" ? "bg-orange-500" : ""}
                      ${event.type === "Theater" ? "bg-purple-500" : ""}
                    `}
                    >
                      {event.type}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">{event.name}</h3>
                  <div className="text-sm text-gray-400 mb-3">
                    <div className="flex items-center mb-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center">
                      <Map className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Ticket Sales</span>
                        <span>{Math.round((event.ticketsSold / event.capacity) * 100)}%</span>
                      </div>
                      <Progress value={(event.ticketsSold / event.capacity) * 100} className="h-2" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Revenue</span>
                      <span className="font-medium">${event.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle className="text-white">Event Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B14F]"></div>
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={upcomingEvents} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis type="number" stroke="#888" />
                      <YAxis dataKey="name" type="category" stroke="#888" width={150} tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#333", border: "none" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Legend />
                      <Bar dataKey="ticketsSold" name="Tickets Sold" fill="#00B14F" />
                      <Bar dataKey="revenue" name="Revenue ($)" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-white">Attendance by Time of Day</CardTitle>
                <CardDescription>Average attendance patterns throughout the week</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B14F]"></div>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#333", border: "none" }}
                          labelStyle={{ color: "#fff" }}
                        />
                        <Legend />
                        <Bar dataKey="morning" name="Morning" fill="#8884d8" />
                        <Bar dataKey="afternoon" name="Afternoon" fill="#82ca9d" />
                        <Bar dataKey="evening" name="Evening" fill="#ffc658" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-white">Attendance Growth Trend</CardTitle>
                <CardDescription>Monthly attendance growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B14F]"></div>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={eventsByMonth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#333", border: "none" }}
                          labelStyle={{ color: "#fff" }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="events" name="Events" stroke="#00B14F" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle className="text-white">Attendance Heatmap</CardTitle>
              <CardDescription>Visual representation of attendance patterns</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-7 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium mb-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 24 }).map((_, hourIndex) => {
                  const hour = hourIndex % 12 === 0 ? 12 : hourIndex % 12
                  const period = hourIndex < 12 ? "AM" : "PM"

                  if (hourIndex % 3 === 0) {
                    return (
                      <React.Fragment key={hourIndex}>
                        <div className="text-xs text-right pr-2 col-span-7 mt-2 first:mt-0">{`${hour} ${period}`}</div>
                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                          // Generate random attendance values for the heatmap
                          const attendance = Math.floor(Math.random() * 100)
                          let bgColor = "bg-green-900/20"

                          if (attendance > 30) bgColor = "bg-green-700/30"
                          if (attendance > 60) bgColor = "bg-green-500/40"
                          if (attendance > 80) bgColor = "bg-green-400/50"

                          return (
                            <div
                              key={`${hourIndex}-${dayIndex}`}
                              className={`h-6 rounded ${bgColor} hover:opacity-80 transition-opacity cursor-pointer`}
                              title={`${attendance} attendees`}
                            />
                          )
                        })}
                      </React.Fragment>
                    )
                  }
                  return null
                })}
              </div>
              <div className="flex justify-end items-center mt-4 text-sm">
                <span className="mr-2">Attendance:</span>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-900/20 rounded mr-1"></div>
                  <span className="mr-2">Low</span>
                  <div className="w-4 h-4 bg-green-700/30 rounded mr-1"></div>
                  <span className="mr-2">Medium</span>
                  <div className="w-4 h-4 bg-green-500/40 rounded mr-1"></div>
                  <span className="mr-2">High</span>
                  <div className="w-4 h-4 bg-green-400/50 rounded mr-1"></div>
                  <span>Peak</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-white">Events by Location</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B14F]"></div>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={locationData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis type="number" stroke="#888" />
                        <YAxis dataKey="name" type="category" stroke="#888" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#333", border: "none" }}
                          labelStyle={{ color: "#fff" }}
                        />
                        <Bar dataKey="value" name="Events" fill="#00B14F" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-white">Location Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B14F]"></div>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={locationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {locationData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: "#333", border: "none" }}
                          formatter={(value, name) => [`${value} events`, name]}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCard({ title, value, icon: Icon, trend, description, trendDirection }:any) {
  return (
    <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className="bg-[#3A3A3A] p-2 rounded-md">
            <Icon className="h-5 w-5 text-[#00B14F]" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${trendDirection === "up" ? "text-green-500" : "text-red-500"}`}>
            {trend}
          </span>
          <span className="text-xs text-gray-400 ml-2">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}

