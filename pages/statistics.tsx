"use client";

import type { ButtonProps } from "@heroui/react";
import type { Users } from "../types/data";

import React, { useState, useEffect, useMemo } from "react";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  LineChart,
  Line,
} from "recharts";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Select,
  SelectItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  cn,
  Chip,
  Skeleton,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import DefaultLayout from "@/layouts/default";
import { CountryFlag } from "../components/CountryFlag";
import apiClient from "@/config/api";

type ChartData = {
  name: string;
  value: number;
  valueText: string;
  [key: string]: string | number;
};

type StatCardProps = {
  title: string;
  color: ButtonProps["color"];
  categories: string[];
  chartData: ChartData[];
  unit?: string;
  unitTitle?: string;
  total?: number;
  chartType?: "radial" | "bar" | "pie" | "line";
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  pagination?: {
    totalPages: number;
    total: number;
    currentPage: number;
    pageSize: number;
  };
  message?: string;
};

const colorIndexMap = (index: number) => {
  const mapIndex: Record<number, number> = {
    0: 300,
    1: 500,
    2: 700,
    3: 900,
  };
  return mapIndex[index] ?? 200;
};

const formatTotal = (value: number | undefined) => {
  return value?.toLocaleString() ?? "0";
};

export default function StatisticsPage(): JSX.Element {
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("all");

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      // Fetch multiple pages to get all users for statistics
      let allUsers: Users[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await apiClient.get<ApiResponse<Users[]>>(
          `/card-info?page=${page}&per_page=100`,
        );

        if (response.data?.success && Array.isArray(response.data?.data)) {
          allUsers = [...allUsers, ...response.data.data];
          const totalPages = response.data.pagination?.totalPages ?? 1;
          hasMore = page < totalPages;
          page++;
        } else {
          hasMore = false;
        }
      }

      setUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users for statistics:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (!users.length) return null;

    // Gender distribution
    const genderStats = users.reduce(
      (acc, user) => {
        if (user.gender === true) acc.male++;
        else if (user.gender === false) acc.female++;
        else acc.unknown++;
        return acc;
      },
      { male: 0, female: 0, unknown: 0 },
    );

    // Industry distribution (top 5)
    const industryCount = users.reduce(
      (acc, user) => {
        const industry = user.industry || "Unknown";
        acc[industry] = (acc[industry] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const topIndustries = Object.entries(industryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Country distribution (top 5)
    const countryCount = users.reduce(
      (acc, user) => {
        const country = user.country || "Unknown";
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const topCountries = Object.entries(countryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Contact completeness
    const completeness = users.reduce(
      (acc, user) => {
        const hasEmail = user.email && user.email.length > 0 && user.email[0];
        const hasPhone =
          user.phone_number &&
          user.phone_number.length > 0 &&
          user.phone_number[0];
        const hasJobTitle = user.job_title;
        const hasCompany = user.company_name;

        if (hasEmail) acc.withEmail++;
        if (hasPhone) acc.withPhone++;
        if (hasJobTitle) acc.withJobTitle++;
        if (hasCompany) acc.withCompany++;

        return acc;
      },
      { withEmail: 0, withPhone: 0, withJobTitle: 0, withCompany: 0 },
    );

    // Monthly collection trends (last 6 months)
    const monthlyTrends = users
      .filter((user) => user.date_collected)
      .reduce(
        (acc, user) => {
          const date = new Date(user.date_collected!);
          const monthKey = date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
          acc[monthKey] = (acc[monthKey] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

    const trendData = Object.entries(monthlyTrends)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(-6);

    return {
      total: users.length,
      genderStats,
      topIndustries,
      topCountries,
      completeness,
      trendData,
    };
  }, [users]);

  const chartData: StatCardProps[] = useMemo(() => {
    if (!stats) return [];

    return [
      {
        title: "Gender Distribution",
        color: "primary",
        categories: ["Male", "Female", "Unknown"],
        chartType: "radial" as const,
        unit: "contacts",
        unitTitle: "Total",
        total: stats.total,
        chartData: [
          {
            name: "Male",
            value: stats.genderStats.male,
            valueText: `${stats.genderStats.male} contacts`,
          },
          {
            name: "Female",
            value: stats.genderStats.female,
            valueText: `${stats.genderStats.female} contacts`,
          },
          {
            name: "Unknown",
            value: stats.genderStats.unknown,
            valueText: `${stats.genderStats.unknown} contacts`,
          },
        ],
      },
      {
        title: "Top Industries",
        color: "secondary",
        categories: stats.topIndustries.map(([name]) => name),
        chartType: "bar" as const,
        unit: "contacts",
        unitTitle: "Total",
        total: stats.topIndustries.reduce((sum, [, count]) => sum + count, 0),
        chartData: stats.topIndustries.map(([name, count]) => ({
          name,
          value: count,
          valueText: `${count} contacts`,
        })),
      },
      {
        title: "Top Countries",
        color: "warning",
        categories: stats.topCountries.map(([name]) => name),
        chartType: "pie" as const,
        unit: "contacts",
        unitTitle: "Total",
        total: stats.topCountries.reduce((sum, [, count]) => sum + count, 0),
        chartData: stats.topCountries.map(([name, count]) => ({
          name,
          value: count,
          valueText: `${count} contacts`,
        })),
      },
    ];
  }, [stats]);

  if (loading) {
    return (
      <DefaultLayout>
        <div className="h-full w-full p-6">
          <div className="mb-6">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[300px] rounded-lg" />
            ))}
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <DefaultLayout>
        <div className="h-full w-full p-6">
          <div className="text-center py-12">
            <Icon
              icon="solar:chart-square-linear"
              width={80}
              className="mx-auto mb-4 text-default-400"
            />
            <h2 className="text-2xl font-bold text-default-600 mb-2">
              No Data Available
            </h2>
            <p className="text-default-500 mb-6">
              Add some contacts to see beautiful analytics and insights
            </p>
            <Button color="primary" size="lg">
              Add Your First Contact
            </Button>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="h-full w-full p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Analytics Dashboard
              </h1>
              <p className="text-default-600 mt-1">
                Comprehensive insights from {formatTotal(stats.total)} contacts
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Chip color="primary" variant="flat">
                {formatTotal(stats.total)} Total Contacts
              </Chip>
              <Select
                aria-label="Time Range"
                classNames={{
                  trigger: "min-w-[120px]",
                }}
                defaultSelectedKeys={["all"]}
                size="sm"
                value={timeRange}
                onSelectionChange={(keys) =>
                  setTimeRange(Array.from(keys)[0] as string)
                }
              >
                <SelectItem key="all">All Time</SelectItem>
                <SelectItem key="month">This Month</SelectItem>
                <SelectItem key="quarter">This Quarter</SelectItem>
                <SelectItem key="year">This Year</SelectItem>
              </Select>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon
                  icon="solar:users-group-two-rounded-bold"
                  className="text-primary"
                  width={24}
                />
              </div>
              <div>
                <p className="text-small text-default-500">Total Contacts</p>
                <p className="text-2xl font-bold text-primary">
                  {formatTotal(stats.total)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Icon
                  icon="solar:check-circle-bold"
                  className="text-success"
                  width={24}
                />
              </div>
              <div>
                <p className="text-small text-default-500">With Email</p>
                <p className="text-2xl font-bold text-success">
                  {Math.round(
                    (stats.completeness.withEmail / stats.total) * 100,
                  )}
                  %
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Icon
                  icon="solar:phone-bold"
                  className="text-warning"
                  width={24}
                />
              </div>
              <div>
                <p className="text-small text-default-500">With Phone</p>
                <p className="text-2xl font-bold text-warning">
                  {Math.round(
                    (stats.completeness.withPhone / stats.total) * 100,
                  )}
                  %
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Icon
                  icon="solar:buildings-2-bold"
                  className="text-secondary"
                  width={24}
                />
              </div>
              <div>
                <p className="text-small text-default-500">Industries</p>
                <p className="text-2xl font-bold text-secondary">
                  {stats.topIndustries.length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          {chartData.map((item, index) => (
            <StatChartCard key={index} {...item} />
          ))}
        </div>

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Countries Detailed */}
          <Card className="p-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between w-full">
                <div>
                  <h3 className="text-lg font-semibold">
                    Geographic Distribution
                  </h3>
                  <p className="text-small text-default-500">
                    Contacts by country
                  </p>
                </div>
                <Icon
                  icon="solar:global-bold"
                  className="text-default-400"
                  width={24}
                />
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {stats.topCountries
                  .slice(0, 8)
                  .map(([country, count], index) => {
                    const percentage = Math.round((count / stats.total) * 100);
                    return (
                      <div
                        key={country}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <CountryFlag
                            countryCode={
                              users.find((u) => u.country === country)
                                ?.country_code
                            }
                            size="sm"
                          />
                          <span className="text-small font-medium">
                            {country}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-small text-default-500">
                            {percentage}%
                          </span>
                          <span className="text-small font-medium">
                            {count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardBody>
          </Card>

          {/* Top Industries Detailed */}
          <Card className="p-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between w-full">
                <div>
                  <h3 className="text-lg font-semibold">Industry Breakdown</h3>
                  <p className="text-small text-default-500">
                    Contacts by industry
                  </p>
                </div>
                <Icon
                  icon="solar:buildings-3-bold"
                  className="text-default-400"
                  width={24}
                />
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {stats.topIndustries
                  .slice(0, 8)
                  .map(([industry, count], index) => {
                    const percentage = Math.round((count / stats.total) * 100);
                    return (
                      <div
                        key={industry}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            icon="solar:briefcase-bold"
                            className="text-default-400 w-4 h-4"
                          />
                          <span className="text-small font-medium truncate">
                            {industry}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-small text-default-500">
                            {percentage}%
                          </span>
                          <span className="text-small font-medium">
                            {count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </DefaultLayout>
  );
}

const StatChartCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({
    title,
    categories,
    color,
    chartData,
    unit,
    total,
    unitTitle,
    chartType = "radial",
  }) => {
    const renderChart = () => {
      switch (chartType) {
        case "bar":
          return (
            <ResponsiveContainer height={260} width="100%">
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--heroui-default-200))"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--heroui-default-500))"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--heroui-default-500))"
                />
                <Tooltip
                  content={({ payload, label }) => (
                    <div className="bg-background border border-default-200 rounded-lg p-3 shadow-lg">
                      <p className="text-small font-medium">{label}</p>
                      {payload?.map((p, i) => (
                        <p key={i} className="text-small text-default-600">
                          {p.value} contacts
                        </p>
                      ))}
                    </div>
                  )}
                />
                <Bar
                  dataKey="value"
                  fill={`hsl(var(--heroui-${color}-500))`}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          );

        case "pie":
          return (
            <ResponsiveContainer height={260} width="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(var(--heroui-${color}-${colorIndexMap(index)}))`}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ payload }) => (
                    <div className="bg-background border border-default-200 rounded-lg p-3 shadow-lg">
                      {payload?.map((p, i) => (
                        <div key={i}>
                          <p className="text-small font-medium">{p.name}</p>
                          <p className="text-small text-default-600">
                            {p.value} contacts
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          );

        default: // radial
          return (
            <ResponsiveContainer height={260} width="100%">
              <RadialBarChart
                barSize={12}
                cx="50%"
                cy="50%"
                data={chartData}
                endAngle={-270}
                innerRadius={90}
                outerRadius={60}
                startAngle={90}
              >
                <Tooltip
                  content={({ payload }) => (
                    <div className="bg-background border border-default-200 rounded-lg p-3 shadow-lg">
                      {payload?.map((p) => (
                        <div key={p.payload.name}>
                          <p className="text-small font-medium">
                            {p.payload.name}
                          </p>
                          <p className="text-small text-default-600">
                            {p.payload.valueText}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  cursor={false}
                />
                <RadialBar
                  animationDuration={1000}
                  animationEasing="ease"
                  background={{ fill: "hsl(var(--heroui-default-100))" }}
                  cornerRadius={8}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(var(--heroui-${color}-${colorIndexMap(index)}))`}
                    />
                  ))}
                </RadialBar>
                <g>
                  <text textAnchor="middle" x="50%" y="48%">
                    <tspan
                      className="fill-default-500 text-sm"
                      dy="-0.5em"
                      x="50%"
                    >
                      {unitTitle}
                    </tspan>
                    <tspan
                      className="fill-foreground text-lg font-semibold"
                      dy="1.5em"
                      x="50%"
                    >
                      {formatTotal(total)} {unit}
                    </tspan>
                  </text>
                </g>
              </RadialBarChart>
            </ResponsiveContainer>
          );
      }
    };

    return (
      <Card className="min-h-[420px] border border-transparent dark:border-default-100">
        <div className="flex flex-col gap-y-2 p-6 pb-0">
          <div className="flex items-center justify-between gap-x-2">
            <dt>
              <h3 className="text-base font-semibold text-default-700">
                {title}
              </h3>
            </dt>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <Icon height={16} icon="solar:menu-dots-bold" width={16} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu variant="flat">
                <DropdownItem key="view-details">View Details</DropdownItem>
                <DropdownItem key="export-data">Export Data</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        <div className="flex h-full flex-col flex-col-reverse flex-wrap gap-4 sm:flex-row sm:flex-nowrap">
          <div className="flex flex-col justify-center gap-y-3 pb-6 pl-6 text-tiny text-default-500 lg:pb-0">
            {categories.slice(0, 4).map((category, index) => {
              const data = chartData.find((c) => c.name === category);
              return (
                <div key={index} className="flex flex-col items-start gap-y-1">
                  <span className="text-small font-medium capitalize text-default-500">
                    {category}
                  </span>
                  <span className="text-small font-semibold text-foreground">
                    {data?.valueText || "0 contacts"}
                  </span>
                </div>
              );
            })}
          </div>
          {renderChart()}
        </div>
      </Card>
    );
  },
);

StatChartCard.displayName = "StatChartCard";
