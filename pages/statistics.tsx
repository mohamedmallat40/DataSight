"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tabs, Tab } from "@heroui/tabs";
import { Select, SelectItem } from "@heroui/select";
import { DateRangePicker } from "@heroui/date-picker";
import { Progress } from "@heroui/progress";
import { Divider } from "@heroui/divider";
import { Badge } from "@heroui/badge";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
  Legend
} from "recharts";

import DefaultLayout from "@/layouts/default";

// Enhanced Analytics Data Structure
interface AnalyticsData {
  overview: {
    totalContacts: number;
    growthRate: number;
    avgContactsPerDay: number;
    dataQuality: number;
    reachabilityScore: number;
    enrichmentRate: number;
  };
  trends: {
    daily: Array<{
      date: string;
      contacts: number;
      emails: number;
      phones: number;
      social: number;
    }>;
    monthly: Array<{
      month: string;
      contacts: number;
      quality: number;
      enriched: number;
    }>;
  };
  demographics: {
    countries: Array<{
      name: string;
      count: number;
      percentage: number;
      flag: string;
      growth: number;
    }>;
    industries: Array<{
      name: string;
      count: number;
      percentage: number;
      avgRevenue: string;
      color: string;
    }>;
    jobLevels: Array<{
      level: string;
      count: number;
      percentage: number;
      color: string;
    }>;
    genderDistribution: {
      male: number;
      female: number;
      unknown: number;
    };
  };
  dataQuality: {
    completeness: Array<{
      field: string;
      percentage: number;
      critical: boolean;
    }>;
    enrichment: Array<{
      source: string;
      count: number;
      accuracy: number;
      color: string;
    }>;
    reachability: {
      emailDeliverability: number;
      phoneValidity: number;
      socialProfiles: number;
      websiteStatus: number;
    };
  };
  performance: {
    aiInsights: {
      totalQueries: number;
      avgResponseTime: number;
      accuracy: number;
      usageGrowth: number;
    };
    systemMetrics: {
      dataProcessingSpeed: number;
      storageEfficiency: number;
      apiPerformance: number;
      uptime: number;
    };
  };
}

// Generate realistic mock data
const generateAnalyticsData = (): AnalyticsData => {
  const now = new Date();
  const dailyData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      contacts: Math.floor(Math.random() * 50) + 20,
      emails: Math.floor(Math.random() * 40) + 15,
      phones: Math.floor(Math.random() * 35) + 10,
      social: Math.floor(Math.random() * 25) + 5,
    };
  });

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(now);
    date.setMonth(date.getMonth() - (11 - i));
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      contacts: Math.floor(Math.random() * 1000) + 500,
      quality: Math.floor(Math.random() * 30) + 70,
      enriched: Math.floor(Math.random() * 40) + 60,
    };
  });

  return {
    overview: {
      totalContacts: 12847,
      growthRate: 23.5,
      avgContactsPerDay: 42,
      dataQuality: 87,
      reachabilityScore: 92,
      enrichmentRate: 78,
    },
    trends: {
      daily: dailyData,
      monthly: monthlyData,
    },
    demographics: {
      countries: [
        { name: "Saudi Arabia", count: 3421, percentage: 26.6, flag: "🇸🇦", growth: 15.2 },
        { name: "United States", count: 2846, percentage: 22.1, flag: "🇺🇸", growth: 8.7 },
        { name: "United Kingdom", count: 1923, percentage: 15.0, flag: "🇬🇧", growth: 12.3 },
        { name: "Germany", count: 1564, percentage: 12.2, flag: "🇩🇪", growth: 6.8 },
        { name: "France", count: 1205, percentage: 9.4, flag: "🇫🇷", growth: 9.1 },
        { name: "Others", count: 1888, percentage: 14.7, flag: "🌍", growth: 11.5 },
      ],
      industries: [
        { name: "Technology", count: 3842, percentage: 29.9, avgRevenue: "$2.5M", color: "#0066FF" },
        { name: "Healthcare", count: 2654, percentage: 20.6, avgRevenue: "$1.8M", color: "#00CC66" },
        { name: "Finance", count: 2156, percentage: 16.8, avgRevenue: "$3.2M", color: "#FF6B35" },
        { name: "Manufacturing", count: 1734, percentage: 13.5, avgRevenue: "$1.2M", color: "#9B59B6" },
        { name: "Education", count: 1289, percentage: 10.0, avgRevenue: "$800K", color: "#F39C12" },
        { name: "Others", count: 1172, percentage: 9.2, avgRevenue: "$950K", color: "#95A5A6" },
      ],
      jobLevels: [
        { level: "C-Level", count: 1854, percentage: 14.4, color: "#FF6B35" },
        { level: "VP/Director", count: 3289, percentage: 25.6, color: "#0066FF" },
        { level: "Manager", count: 4235, percentage: 33.0, color: "#00CC66" },
        { level: "Senior", count: 2194, percentage: 17.1, color: "#9B59B6" },
        { level: "Individual", count: 1275, percentage: 9.9, color: "#F39C12" },
      ],
      genderDistribution: {
        male: 7328,
        female: 4819,
        unknown: 700,
      },
    },
    dataQuality: {
      completeness: [
        { field: "Email", percentage: 94, critical: true },
        { field: "Phone", percentage: 87, critical: true },
        { field: "Company", percentage: 96, critical: true },
        { field: "Job Title", percentage: 89, critical: false },
        { field: "Industry", percentage: 78, critical: false },
        { field: "Social Profiles", percentage: 65, critical: false },
        { field: "Address", percentage: 72, critical: false },
      ],
      enrichment: [
        { source: "LinkedIn", count: 8945, accuracy: 94, color: "#0066FF" },
        { source: "Company Database", count: 7235, accuracy: 89, color: "#00CC66" },
        { source: "Social Media", count: 5672, accuracy: 78, color: "#FF6B35" },
        { source: "Public Records", count: 4321, accuracy: 92, color: "#9B59B6" },
        { source: "AI Enhancement", count: 6543, accuracy: 85, color: "#F39C12" },
      ],
      reachability: {
        emailDeliverability: 91,
        phoneValidity: 86,
        socialProfiles: 73,
        websiteStatus: 88,
      },
    },
    performance: {
      aiInsights: {
        totalQueries: 15423,
        avgResponseTime: 1.2,
        accuracy: 94,
        usageGrowth: 156,
      },
      systemMetrics: {
        dataProcessingSpeed: 89,
        storageEfficiency: 92,
        apiPerformance: 96,
        uptime: 99.8,
      },
    },
  };
};

const CHART_COLORS = ['#0066FF', '#00CC66', '#FF6B35', '#9B59B6', '#F39C12', '#E74C3C', '#1ABC9C', '#34495E'];

export default function EnhancedStatisticsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [dateRange, setDateRange] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const analyticsData = useMemo(() => generateAnalyticsData(), []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const timeframeOptions = [
    { key: "7d", label: "Last 7 days" },
    { key: "30d", label: "Last 30 days" },
    { key: "90d", label: "Last 3 months" },
    { key: "1y", label: "Last year" },
    { key: "custom", label: "Custom range" },
  ];

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-xl font-semibold text-foreground">Loading Analytics</h2>
            <p className="text-default-500">Preparing comprehensive insights...</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="max-w-full mx-auto p-6 space-y-6">
        {/* Header with Controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-default-600 mt-1">
              Comprehensive insights into your contact data and performance metrics
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select
              className="min-w-[160px]"
              selectedKeys={[selectedTimeframe]}
              size="sm"
              onSelectionChange={(keys) => setSelectedTimeframe(Array.from(keys)[0] as string)}
            >
              {timeframeOptions.map((option) => (
                <SelectItem key={option.key}>{option.label}</SelectItem>
              ))}
            </Select>

            <Button
              isIconOnly
              isLoading={refreshing}
              size="sm"
              variant="flat"
              onPress={handleRefresh}
            >
              <Icon icon="solar:refresh-linear" width={18} />
            </Button>

            <Button
              size="sm"
              startContent={<Icon icon="solar:export-linear" width={16} />}
              variant="flat"
            >
              Export
            </Button>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
            classNames={{
              tabList: "grid w-full grid-cols-4 gap-0 relative rounded-lg p-1 bg-default-100",
              cursor: "w-full bg-white shadow-sm rounded-md",
              tab: "max-w-fit h-10",
              tabContent: "group-data-[selected=true]:text-primary"
            }}
          >
            <Tab
              key="overview"
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="solar:chart-2-linear" width={18} />
                  <span>Overview</span>
                </div>
              }
            />
            <Tab
              key="demographics"
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="solar:users-group-rounded-linear" width={18} />
                  <span>Demographics</span>
                </div>
              }
            />
            <Tab
              key="quality"
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="solar:shield-check-linear" width={18} />
                  <span>Data Quality</span>
                </div>
              }
            />
            <Tab
              key="performance"
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="solar:speed-linear" width={18} />
                  <span>Performance</span>
                </div>
              }
            />
          </Tabs>
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  {
                    title: "Total Contacts",
                    value: analyticsData.overview.totalContacts.toLocaleString(),
                    change: `+${analyticsData.overview.growthRate}%`,
                    positive: true,
                    icon: "solar:users-group-rounded-linear",
                    color: "primary"
                  },
                  {
                    title: "Daily Average",
                    value: analyticsData.overview.avgContactsPerDay.toString(),
                    change: "+12%",
                    positive: true,
                    icon: "solar:calendar-linear",
                    color: "success"
                  },
                  {
                    title: "Data Quality",
                    value: `${analyticsData.overview.dataQuality}%`,
                    change: "+5%",
                    positive: true,
                    icon: "solar:shield-check-linear",
                    color: "warning"
                  },
                  {
                    title: "Reachability",
                    value: `${analyticsData.overview.reachabilityScore}%`,
                    change: "+8%",
                    positive: true,
                    icon: "solar:target-linear",
                    color: "secondary"
                  },
                  {
                    title: "Enrichment Rate",
                    value: `${analyticsData.overview.enrichmentRate}%`,
                    change: "+15%",
                    positive: true,
                    icon: "solar:magic-stick-3-linear",
                    color: "primary"
                  },
                  {
                    title: "AI Accuracy",
                    value: `${analyticsData.performance.aiInsights.accuracy}%`,
                    change: "+3%",
                    positive: true,
                    icon: "solar:cpu-linear",
                    color: "success"
                  }
                ].map((metric, index) => (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardBody className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-default-600 mb-1">{metric.title}</p>
                            <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                            <div className="flex items-center gap-1 mt-2">
                              <Icon
                                icon={metric.positive ? "solar:arrow-up-linear" : "solar:arrow-down-linear"}
                                className={metric.positive ? "text-success" : "text-danger"}
                                width={14}
                              />
                              <span className={`text-sm ${metric.positive ? "text-success" : "text-danger"}`}>
                                {metric.change}
                              </span>
                            </div>
                          </div>
                          <div className={`p-2 rounded-lg bg-${metric.color}/10`}>
                            <Icon
                              icon={metric.icon}
                              className={`text-${metric.color}`}
                              width={20}
                            />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Growth Trend */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Contact Growth Trend</h3>
                      <Chip size="sm" variant="flat" color="primary">
                        30 Days
                      </Chip>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={analyticsData.trends.daily}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e4e4e7',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="contacts"
                          stroke="#0066FF"
                          fill="url(#colorGradient)"
                          strokeWidth={2}
                        />
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0066FF" stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>

                {/* Contact Sources */}
                <Card>
                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold">Data Enrichment Sources</h3>
                  </CardHeader>
                  <CardBody>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analyticsData.dataQuality.enrichment}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="count"
                          nameKey="source"
                        >
                          {analyticsData.dataQuality.enrichment.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name) => [value.toLocaleString(), name]}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e4e4e7',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>
              </div>

              {/* Multi-metric Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-semibold">Contact Data Breakdown</h3>
                </CardHeader>
                <CardBody>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={analyticsData.trends.daily.slice(-14)}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e4e4e7',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="contacts" name="Total Contacts" fill="#0066FF" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="emails" name="Emails" fill="#00CC66" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="phones" name="Phones" fill="#FF6B35" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="social" name="Social" fill="#9B59B6" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardBody>
              </Card>
            </motion.div>
          )}

          {selectedTab === "demographics" && (
            <motion.div
              key="demographics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Geographic Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Geographic Distribution</h3>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    {analyticsData.demographics.countries.map((country, index) => (
                      <motion.div
                        key={country.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-default-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{country.flag}</span>
                          <div>
                            <p className="font-medium text-foreground">{country.name}</p>
                            <p className="text-sm text-default-500">
                              {country.count.toLocaleString()} contacts
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress
                            className="w-24"
                            value={country.percentage}
                            color="primary"
                            size="sm"
                          />
                          <div className="text-right">
                            <p className="text-sm font-medium">{country.percentage}%</p>
                            <p className="text-xs text-success">+{country.growth}%</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardBody>
                </Card>

                {/* Industry Breakdown */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Industry Breakdown</h3>
                  </CardHeader>
                  <CardBody>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analyticsData.demographics.industries}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="count"
                          nameKey="name"
                        >
                          {analyticsData.demographics.industries.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name) => [value.toLocaleString(), name]}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e4e4e7',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>
              </div>

              {/* Job Levels and Gender Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Job Level Distribution</h3>
                  </CardHeader>
                  <CardBody>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={analyticsData.demographics.jobLevels} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis type="number" tick={{ fontSize: 12 }} />
                        <YAxis dataKey="level" type="category" tick={{ fontSize: 12 }} width={80} />
                        <Tooltip 
                          formatter={(value, name) => [value.toLocaleString(), "Contacts"]}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e4e4e7',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                          {analyticsData.demographics.jobLevels.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Gender Distribution</h3>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    {[
                      { label: "Male", count: analyticsData.demographics.genderDistribution.male, color: "primary", icon: "material-symbols:male" },
                      { label: "Female", count: analyticsData.demographics.genderDistribution.female, color: "secondary", icon: "material-symbols:female" },
                      { label: "Unknown", count: analyticsData.demographics.genderDistribution.unknown, color: "default", icon: "solar:question-circle-linear" },
                    ].map((item, index) => {
                      const total = analyticsData.demographics.genderDistribution.male + 
                                   analyticsData.demographics.genderDistribution.female + 
                                   analyticsData.demographics.genderDistribution.unknown;
                      const percentage = (item.count / total) * 100;
                      
                      return (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-lg bg-default-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-${item.color}/10`}>
                              <Icon icon={item.icon} className={`text-${item.color} w-5 h-5`} />
                            </div>
                            <div>
                              <p className="font-medium">{item.label}</p>
                              <p className="text-sm text-default-500">{item.count.toLocaleString()} contacts</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">{percentage.toFixed(1)}%</p>
                            <Progress value={percentage} color={item.color} size="sm" className="w-16" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </CardBody>
                </Card>
              </div>
            </motion.div>
          )}

          {selectedTab === "quality" && (
            <motion.div
              key="quality"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Data Completeness */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Data Completeness</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  {analyticsData.dataQuality.completeness.map((field, index) => (
                    <motion.div
                      key={field.field}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg border border-default-200"
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          size="sm"
                          color={field.critical ? "danger" : "default"}
                          variant={field.critical ? "solid" : "flat"}
                        >
                          {field.critical ? "Critical" : "Optional"}
                        </Badge>
                        <span className="font-medium">{field.field}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={field.percentage}
                          color={field.percentage >= 90 ? "success" : field.percentage >= 70 ? "warning" : "danger"}
                          size="sm"
                          className="w-32"
                        />
                        <span className="font-semibold min-w-[3rem] text-right">{field.percentage}%</span>
                      </div>
                    </motion.div>
                  ))}
                </CardBody>
              </Card>

              {/* Reachability Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { 
                    title: "Email Deliverability", 
                    value: analyticsData.dataQuality.reachability.emailDeliverability,
                    icon: "solar:mailbox-linear",
                    color: "primary"
                  },
                  { 
                    title: "Phone Validity", 
                    value: analyticsData.dataQuality.reachability.phoneValidity,
                    icon: "solar:phone-linear",
                    color: "success"
                  },
                  { 
                    title: "Social Profiles", 
                    value: analyticsData.dataQuality.reachability.socialProfiles,
                    icon: "solar:share-linear",
                    color: "secondary"
                  },
                  { 
                    title: "Website Status", 
                    value: analyticsData.dataQuality.reachability.websiteStatus,
                    icon: "solar:global-linear",
                    color: "warning"
                  },
                ].map((metric, index) => (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardBody className="text-center p-6">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${metric.color}/10 flex items-center justify-center`}>
                          <Icon icon={metric.icon} className={`text-${metric.color} w-8 h-8`} />
                        </div>
                        <h4 className="font-semibold text-foreground mb-2">{metric.title}</h4>
                        <div className="space-y-2">
                          <p className="text-3xl font-bold text-foreground">{metric.value}%</p>
                          <Progress value={metric.value} color={metric.color} size="sm" />
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Enrichment Sources Performance */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Enrichment Sources Performance</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {analyticsData.dataQuality.enrichment.map((source, index) => (
                      <motion.div
                        key={source.source}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-default-50"
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: source.color }}
                          />
                          <div>
                            <p className="font-medium">{source.source}</p>
                            <p className="text-sm text-default-500">
                              {source.count.toLocaleString()} records
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">Accuracy</p>
                            <p className="text-lg font-bold">{source.accuracy}%</p>
                          </div>
                          <Progress value={source.accuracy} color="success" size="sm" className="w-24" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}

          {selectedTab === "performance" && (
            <motion.div
              key="performance"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* AI Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: "Total AI Queries",
                    value: analyticsData.performance.aiInsights.totalQueries.toLocaleString(),
                    subtitle: "This month",
                    icon: "solar:cpu-linear",
                    color: "primary"
                  },
                  {
                    title: "Avg Response Time",
                    value: `${analyticsData.performance.aiInsights.avgResponseTime}s`,
                    subtitle: "Lightning fast",
                    icon: "solar:speed-linear",
                    color: "success"
                  },
                  {
                    title: "AI Accuracy",
                    value: `${analyticsData.performance.aiInsights.accuracy}%`,
                    subtitle: "Highly reliable",
                    icon: "solar:target-linear",
                    color: "warning"
                  },
                  {
                    title: "Usage Growth",
                    value: `+${analyticsData.performance.aiInsights.usageGrowth}%`,
                    subtitle: "Month over month",
                    icon: "solar:chart-2-linear",
                    color: "secondary"
                  },
                ].map((metric, index) => (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardBody className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl bg-${metric.color}/10`}>
                            <Icon icon={metric.icon} className={`text-${metric.color} w-6 h-6`} />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-default-600 mb-1">{metric.title}</p>
                          <p className="text-2xl font-bold text-foreground mb-1">{metric.value}</p>
                          <p className="text-xs text-default-500">{metric.subtitle}</p>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* System Health */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">System Health Metrics</h3>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { 
                        name: "Data Processing Speed", 
                        value: analyticsData.performance.systemMetrics.dataProcessingSpeed,
                        color: "#0066FF"
                      },
                      { 
                        name: "Storage Efficiency", 
                        value: analyticsData.performance.systemMetrics.storageEfficiency,
                        color: "#00CC66"
                      },
                      { 
                        name: "API Performance", 
                        value: analyticsData.performance.systemMetrics.apiPerformance,
                        color: "#FF6B35"
                      },
                      { 
                        name: "System Uptime", 
                        value: analyticsData.performance.systemMetrics.uptime,
                        color: "#9B59B6"
                      },
                    ].map((metric, index) => (
                      <motion.div
                        key={metric.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center"
                      >
                        <ResponsiveContainer width="100%" height={120}>
                          <RadialBarChart 
                            cx="50%" 
                            cy="50%" 
                            innerRadius="60%" 
                            outerRadius="90%" 
                            data={[{ value: metric.value }]}
                          >
                            <RadialBar
                              dataKey="value"
                              cornerRadius={10}
                              fill={metric.color}
                            />
                          </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="text-center -mt-4">
                          <p className="text-2xl font-bold">{metric.value}%</p>
                          <p className="text-sm text-default-600">{metric.name}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Monthly Performance Trends */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Monthly Performance Trends</h3>
                </CardHeader>
                <CardBody>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={analyticsData.trends.monthly}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e4e4e7',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="contacts" 
                        stroke="#0066FF" 
                        strokeWidth={3}
                        name="Total Contacts"
                        dot={{ fill: '#0066FF', strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="quality" 
                        stroke="#00CC66" 
                        strokeWidth={3}
                        name="Data Quality %"
                        dot={{ fill: '#00CC66', strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="enriched" 
                        stroke="#FF6B35" 
                        strokeWidth={3}
                        name="Enrichment %"
                        dot={{ fill: '#FF6B35', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardBody>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DefaultLayout>
  );
}