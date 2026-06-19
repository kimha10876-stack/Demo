import { Building2, CalendarDays, ClipboardSignature, CreditCard } from "lucide-react"
import { useState } from "react"

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Progress } from "../../../components/ui/progress"
import { ManagerHeader } from "./ManagerHeader"

// const data = [
//   { name: "Jan", value: 400 },
//   { name: "Feb", value: 300 },
//   { name: "Mar", value: 200 },
//   { name: "Apr", value: 278 },
//   { name: "May", value: 189 },
//   { name: "Jun", value: 239 },
//   { name: "Jul", value: 349 },
// ]

const revenueData = {
  "7D": {
    data: [
      { name: "Mon", value: 12400 },
      { name: "Tue", value: 15600 },
      { name: "Wed", value: 14200 },
      { name: "Thu", value: 16800 },
      { name: "Fri", value: 19500 },
      { name: "Sat", value: 21300 },
      { name: "Sun", value: 22400 },
    ],
    total: "5,231.89 VND",
    change: "+20.1%",
  },
  "1M": {
    data: [
      { name: "Week 1", value: 42000 },
      { name: "Week 2", value: 48500 },
      { name: "Week 3", value: 54200 },
      { name: "Week 4", value: 61800 },
    ],
    total: "206,500.00 VND",
    change: "+15.3%",
  },
  "3M": {
    data: [
      { name: "Jan", value: 400000 },
      { name: "Feb", value: 300000 },
      { name: "Mar", value: 200000 },
      { name: "Apr", value: 278000 },
      { name: "May", value: 189000 },
      { name: "Jun", value: 239000 },
      { name: "Jul", value: 349000 },
    ],
    total: "1,955,000.00 VND",
    change: "+8.7%",
  },
  "1Y": {
    data: [
      { name: "Jan", value: 400000 },
      { name: "Feb", value: 300000 },
      { name: "Mar", value: 200000 },
      { name: "Apr", value: 278000 },
      { name: "May", value: 189000 },
      { name: "Jun", value: 239000 },
      { name: "Jul", value: 349000 },
      { name: "Aug", value: 410000 },
      { name: "Sep", value: 380000 },
      { name: "Oct", value: 430000 },
      { name: "Nov", value: 510000 },
      { name: "Dec", value: 580000 },
    ],
    total: "4,265,000.00 VND",
    change: "+12.5%",
  },
}

const recentActivity = [
  { id: 1, action: "New contract signed", company: "Tech Solutions Inc.", time: "2 hours ago" },
  { id: 2, action: "Payment confirmed", company: "Global Innovations Co.", time: "5 hours ago" },
  { id: 3, action: "New event created", name: "Tech Summit 2023", time: "1 day ago" },
  { id: 4, action: "New company approved", company: "Future Systems LLC", time: "2 days ago" },
]

export default function ManagerOverview() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7D")

  
  const currentRevenueData = revenueData[selectedTimeRange as keyof typeof revenueData]

  return (
    <>
      <ManagerHeader heading="Overview" text="Welcome to your manager dashboard" />

      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-100 to-gray-200 p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Companies</CardTitle>
              <Building2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">128</div>
              {/* <p className="text-xs text-gray-600">
                <span className="text-green-500 font-medium">+5.4%</span> from last month
              </p> */}
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Scheduled Events</CardTitle>
              <CalendarDays className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">15</div>
              {/* <p className="text-xs text-gray-600">Next event in 3 days</p> */}
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Approved Contracts</CardTitle>
              <ClipboardSignature className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">92</div>
              {/* <p className="text-xs text-gray-600">3 pending approval</p> */}
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">1,429,242 VND</div>
              <p className="text-xs text-gray-600">
                {/* <span className="text-green-500 font-medium">+12.5%</span> from last month */}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
          <Card className="col-span-4 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-800">Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-gray-800">5,231.89 VND</p>
                  <p className="text-sm text-gray-600">
                    {/* <span className="text-green-500 font-medium">+20.1%</span> from previous period */}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {["7D", "1M", "3M", "1Y"].map((range) => (
                    <Button
                      key={range}
                      variant={selectedTimeRange === range ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTimeRange(range)}
                    >
                      {range}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentRevenueData.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-800">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.company || activity.name}</p>
                    </div>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-gray-800">New Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">57</div>
              <p className="text-sm text-gray-600 mb-4">
                {/* <span className="text-green-500 font-medium">+11.4%</span> from last month */}
              </p>
              <Progress value={57} className="h-2" />
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-gray-800">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">3.6%</div>
              <p className="text-sm text-gray-600 mb-4">
                {/* <span className="text-red-500 font-medium">-0.8%</span> from last month */}
              </p>
              <Progress value={36} className="h-2" />
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-gray-800">Satisfaction Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">98.2%</div>
              <p className="text-sm text-gray-600 mb-4">
                {/* <span className="text-green-500 font-medium">+2.1%</span> from last month */}
              </p>
              <Progress value={98} className="h-2" />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}

