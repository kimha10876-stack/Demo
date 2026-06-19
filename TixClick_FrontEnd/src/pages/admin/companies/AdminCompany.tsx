"use client"

import { Badge, BarChart3, Briefcase, Building, DollarSign, Globe, PieChart, TrendingUp, Users } from "lucide-react"
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
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"

const companiesByIndustry = [
  { name: "Technology", count: 45, revenue: 12000000 },
  { name: "Healthcare", count: 30, revenue: 8000000 },
  { name: "Finance", count: 25, revenue: 15000000 },
  { name: "Retail", count: 35, revenue: 7000000 },
  { name: "Manufacturing", count: 20, revenue: 9000000 },
  { name: "Energy", count: 15, revenue: 11000000 },
  { name: "Education", count: 10, revenue: 3000000 },
  { name: "Entertainment", count: 12, revenue: 5000000 },
]

const companySizeData = [
  { name: "1-10", value: 25, color: "#0088FE" },
  { name: "11-50", value: 35, color: "#00C49F" },
  { name: "51-200", value: 20, color: "#FFBB28" },
  { name: "201-500", value: 12, color: "#FF8042" },
  { name: "500+", value: 8, color: "#8884D8" },
]

const companyGrowthData = [
  { name: "Jan", companies: 120, revenue: 5000000 },
  { name: "Feb", companies: 125, revenue: 5200000 },
  { name: "Mar", companies: 130, revenue: 5500000 },
  { name: "Apr", companies: 140, revenue: 6000000 },
  { name: "May", companies: 145, revenue: 6200000 },
  { name: "Jun", companies: 155, revenue: 6800000 },
  { name: "Jul", companies: 165, revenue: 7200000 },
  { name: "Aug", companies: 175, revenue: 7800000 },
  { name: "Sep", companies: 180, revenue: 8000000 },
  { name: "Oct", companies: 190, revenue: 8500000 },
  { name: "Nov", companies: 195, revenue: 8800000 },
  { name: "Dec", companies: 200, revenue: 9000000 },
]

const locationData = [
  { name: "North America", value: 40 },
  { name: "Europe", value: 30 },
  { name: "Asia", value: 20 },
  { name: "South America", value: 5 },
  { name: "Africa", value: 3 },
  { name: "Australia", value: 2 },
]

const topCompanies = [
  {
    id: 1,
    name: "TechGiant Inc.",
    industry: "Technology",
    employees: 1500,
    revenue: 12000000,
    growth: 15,
    founded: 2010,
    location: "San Francisco, CA",
    logo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "MediHealth Solutions",
    industry: "Healthcare",
    employees: 800,
    revenue: 8000000,
    growth: 12,
    founded: 2008,
    location: "Boston, MA",
    logo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Global Finance Group",
    industry: "Finance",
    employees: 1200,
    revenue: 15000000,
    growth: 8,
    founded: 2005,
    location: "New York, NY",
    logo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "RetailMaster",
    industry: "Retail",
    employees: 600,
    revenue: 7000000,
    growth: 10,
    founded: 2012,
    location: "Chicago, IL",
    logo: "/placeholder.svg?height=100&width=100",
  },
]

const companyPerformanceData = [
  { subject: "Revenue", A: 120, B: 110, C: 90, D: 80, fullMark: 150 },
  { subject: "Growth", A: 98, B: 130, C: 100, D: 70, fullMark: 150 },
  { subject: "Employees", A: 86, B: 130, C: 70, D: 60, fullMark: 150 },
  { subject: "Innovation", A: 99, B: 100, C: 110, D: 85, fullMark: 150 },
  { subject: "Market Share", A: 85, B: 90, C: 100, D: 70, fullMark: 150 },
  { subject: "Customer Satisfaction", A: 65, B: 85, C: 100, D: 95, fullMark: 150 },
]

const marketShareData = [
  {
    name: "Technology",
    children: [
      { name: "TechGiant Inc.", size: 4000 },
      { name: "InnovateTech", size: 3000 },
      { name: "FutureSoft", size: 2000 },
      { name: "SmartSolutions", size: 1500 },
    ],
  },
  {
    name: "Healthcare",
    children: [
      { name: "MediHealth Solutions", size: 3500 },
      { name: "HealthPlus", size: 2500 },
      { name: "CareCorp", size: 1800 },
    ],
  },
  {
    name: "Finance",
    children: [
      { name: "Global Finance Group", size: 5000 },
      { name: "InvestCorp", size: 3500 },
      { name: "MoneyWise", size: 2200 },
    ],
  },
  {
    name: "Retail",
    children: [
      { name: "RetailMaster", size: 3000 },
      { name: "ShopSmart", size: 2800 },
      { name: "BuyNow", size: 2000 },
    ],
  },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

export default function AdminCompany() {
  const [timeRange, setTimeRange] = useState("year")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Simulate data loading when filters change
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 800)
  }, [])

  return (
    <div className="p-6 bg-[#1E1E1E] text-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Company Analytics Dashboard</h1>
          <p className="text-gray-400 mt-1">Visual overview of your company portfolio and performance metrics</p>
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
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-[180px] bg-[#3A3A3A] border-[#4A4A4A] text-white">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Total Companies"
          value="200"
          icon={Building}
          trend="+15%"
          description="vs. previous period"
          trendDirection="up"
        />
        <MetricCard
          title="Total Employees"
          value="45,500"
          icon={Users}
          trend="+8%"
          description="vs. previous period"
          trendDirection="up"
        />
        <MetricCard
          title="Average Company Age"
          value="7.5 years"
          icon={Briefcase}
          trend="+0.5"
          description="vs. previous period"
          trendDirection="up"
        />
        <MetricCard
          title="Total Revenue"
          value="$75M"
          icon={DollarSign}
          trend="+12%"
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
            value="companies"
            className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#00B14F] px-6 py-3"
          >
            Companies
          </TabsTrigger>
          {/* <TabsTrigger
            value="performance"
            className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#00B14F] px-6 py-3"
          >
            Performance
          </TabsTrigger> */}
          {/* <TabsTrigger
            value="geography"
            className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#00B14F] px-6 py-3"
          >
            Geography
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-[#00B14F]" />
                  Companies by Industry
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
                      <BarChart data={companiesByIndustry}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis yAxisId="left" stroke="#888" />
                        <YAxis yAxisId="right" orientation="right" stroke="#888" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#333", border: "none" }}
                          labelStyle={{ color: "#fff" }}
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="count" name="Companies" fill="#00B14F" />
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
                  Company Size Distribution
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
                          data={companySizeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {companySizeData.map((entry, index) => (
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
                Company Growth Trends
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
                    <AreaChart data={companyGrowthData}>
                      <defs>
                        <linearGradient id="colorCompanies" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00B14F" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#00B14F" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#0088FE" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#333", border: "none" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="companies"
                        stroke="#00B14F"
                        fillOpacity={1}
                        fill="url(#colorCompanies)"
                        name="Companies"
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#0088FE"
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

        <TabsContent value="companies" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {topCompanies.map((company) => (
              <Card key={company.id} className="bg-[#2A2A2A] border-[#3A3A3A] overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[#3A3A3A] mr-3 flex-shrink-0">
                      <img
                        src={company.logo || "/placeholder.svg"}
                        alt={company.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{company.name}</h3>
                      <Badge
                        className={`
                        ${company.industry === "Technology" ? "bg-blue-500" : ""}
                        ${company.industry === "Healthcare" ? "bg-green-500" : ""}
                        ${company.industry === "Finance" ? "bg-purple-500" : ""}
                        ${company.industry === "Retail" ? "bg-orange-500" : ""}
                      `}
                      >
                        {company.industry}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Founded</span>
                      <span>{company.founded}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Employees</span>
                      <span>{company.employees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Revenue</span>
                      <span>${(company.revenue / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Growth</span>
                      <span className="text-green-500">+{company.growth}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Location</span>
                      <span className="text-right">{company.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle className="text-white">Market Share by Industry</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B14F]"></div>
                </div>
              ) : (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                      data={marketShareData}
                      dataKey="size"
                      stroke="#fff"
                      fill="#8884d8"
                      content={<CustomizedContent colors={COLORS} />}
                    />
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-white">Company Performance Comparison</CardTitle>
                <CardDescription>Radar chart comparing key performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B14F]"></div>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={90} data={companyPerformanceData}>
                        <PolarGrid stroke="#444" />
                        <PolarAngleAxis dataKey="subject" stroke="#888" />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#888" />
                        <Radar name="TechGiant Inc." dataKey="A" stroke="#00B14F" fill="#00B14F" fillOpacity={0.6} />
                        <Radar
                          name="MediHealth Solutions"
                          dataKey="B"
                          stroke="#0088FE"
                          fill="#0088FE"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="Global Finance Group"
                          dataKey="C"
                          stroke="#FFBB28"
                          fill="#FFBB28"
                          fillOpacity={0.6}
                        />
                        <Radar name="RetailMaster" dataKey="D" stroke="#FF8042" fill="#FF8042" fillOpacity={0.6} />
                        <Legend />
                        <Tooltip contentStyle={{ backgroundColor: "#333", border: "none" }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-white">Revenue vs Growth</CardTitle>
                <CardDescription>Comparing company revenue against growth rate</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B14F]"></div>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topCompanies} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis yAxisId="left" orientation="left" stroke="#888" />
                        <YAxis yAxisId="right" orientation="right" stroke="#888" />
                        <Tooltip contentStyle={{ backgroundColor: "#333", border: "none" }} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="revenue" name="Revenue ($)" fill="#00B14F" />
                        <Bar yAxisId="right" dataKey="growth" name="Growth (%)" fill="#0088FE" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle className="text-white">Performance Metrics Over Time</CardTitle>
              <CardDescription>Tracking key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B14F]"></div>
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={companyGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip contentStyle={{ backgroundColor: "#333", border: "none" }} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="companies"
                        name="Companies"
                        stroke="#00B14F"
                        activeDot={{ r: 8 }}
                      />
                      <Line type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#0088FE" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geography Tab */}
        <TabsContent value="geography" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-white">Companies by Region</CardTitle>
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
                        <Bar dataKey="value" name="Companies" fill="#00B14F" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-white">Regional Distribution</CardTitle>
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
                          formatter={(value, name) => [`${value} companies`, name]}
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
              <CardTitle className="text-white">Global Company Map</CardTitle>
              <CardDescription>Geographic distribution of companies worldwide</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-[400px] bg-[#333] rounded-md overflow-hidden">
                {/* This would be replaced with an actual map component in a real application */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Globe className="h-16 w-16 text-gray-600" />
                  <span className="absolute text-gray-400">Interactive global map would be displayed here</span>
                </div>

                {/* Sample location markers */}
                <div className="absolute top-1/4 left-1/4 h-4 w-4 bg-[#00B14F] rounded-full animate-pulse"></div>
                <div className="absolute top-1/3 left-1/2 h-4 w-4 bg-[#00B14F] rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-3/4 h-4 w-4 bg-[#00B14F] rounded-full animate-pulse"></div>
                <div className="absolute top-2/3 left-1/3 h-4 w-4 bg-[#00B14F] rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-1/5 h-4 w-4 bg-[#00B14F] rounded-full animate-pulse"></div>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <RegionCard region="North America" count="80" color="#0088FE" />
                <RegionCard region="Europe" count="60" color="#00C49F" />
                <RegionCard region="Asia" count="40" color="#FFBB28" />
                <RegionCard region="South America" count="10" color="#FF8042" />
                <RegionCard region="Africa" count="6" color="#8884D8" />
                <RegionCard region="Australia" count="4" color="#82ca9d" />
              </div>
            </CardContent>
          </Card>
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

function RegionCard({ region, count, color }:any) {
  return (
    <div className="bg-[#3A3A3A] rounded-md p-3 flex flex-col items-center">
      <div className="w-3 h-3 rounded-full mb-2" style={{ backgroundColor: color }}></div>
      <span className="text-sm font-medium">{region}</span>
      <span className="text-xs text-gray-400">{count} companies</span>
    </div>
  )
}

const CustomizedContent = (props:any) => {
  const { depth, x, y, width, height, index, colors, name} = props

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 ? colors[Math.floor(index / 2) % colors.length] : "none",
          stroke: "#fff",
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {depth === 1 ? (
        <text x={x + width / 2} y={y + height / 2 + 7} textAnchor="middle" fill="#fff" fontSize={14}>
          {name}
        </text>
      ) : null}
      {depth === 1 ? (
        <text x={x + 4} y={y + 18} fill="#fff" fontSize={12} fillOpacity={0.9}>
          {index + 1}
        </text>
      ) : null}
    </g>
  )
}

