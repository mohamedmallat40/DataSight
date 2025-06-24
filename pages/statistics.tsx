"use client";

import type { ButtonProps } from "@heroui/react";

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
  Chip,
  Skeleton,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import { CountryFlag } from "../components/CountryFlag";

import DefaultLayout from "@/layouts/default";
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

type StatsApiResponse = {
  success: boolean;
  data: {
    total_contacts: string;
    with_email_percentage: string;
    with_phone_percentage: string;
    total_industries: string;
    male: string;
    female: string;
    unknown: string;
    top_industries: Array<{
      industry: string;
      count: number;
    }>;
    top_countries: Array<{
      code: string;
      count: number;
    }>;
    industry_breakdown: Record<string, number>;
    geographic_distribution: Record<string, number>;
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
  const [statsData, setStatsData] = useState<StatsApiResponse["data"] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("all");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<StatsApiResponse>("/stats");

      if (response.data?.success && response.data?.data) {
        setStatsData(response.data.data);
      } else {
        setStatsData(null);
        console.warn("API response does not contain valid stats data");
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setStatsData(null);
    } finally {
      setLoading(false);
    }
  };

  // Process API statistics data
  const stats = useMemo(() => {
    if (!statsData) return null;

    const total = parseInt(statsData.total_contacts);
    const emailPercentage = parseFloat(statsData.with_email_percentage);
    const phonePercentage = parseFloat(statsData.with_phone_percentage);

    return {
      total,
      emailPercentage,
      phonePercentage,
      totalIndustries: parseInt(statsData.total_industries),
      genderStats: {
        male: parseInt(statsData.male),
        female: parseInt(statsData.female),
        unknown: parseInt(statsData.unknown),
      },
      topIndustries: statsData.top_industries.slice(0, 5),
      topCountries: statsData.top_countries.slice(0, 5),
      industryBreakdown: statsData.industry_breakdown,
      geographicDistribution: statsData.geographic_distribution,
    };
  }, [statsData]);

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
        categories: stats.topIndustries.map((item) => item.industry),
        chartType: "bar" as const,
        unit: "contacts",
        unitTitle: "Total",
        total: stats.topIndustries.reduce((sum, item) => sum + item.count, 0),
        chartData: stats.topIndustries.map((item) => ({
          name: item.industry,
          value: item.count,
          valueText: `${item.count} contacts`,
        })),
      },
      {
        title: "Top Countries",
        color: "warning",
        categories: stats.topCountries.map((item) => item.code),
        chartType: "pie" as const,
        unit: "contacts",
        unitTitle: "Total",
        total: stats.topCountries.reduce((sum, item) => sum + item.count, 0),
        chartData: stats.topCountries.map((item) => ({
          name: item.code,
          value: item.count,
          valueText: `${item.count} contacts`,
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
              className="mx-auto mb-4 text-default-400"
              icon="solar:chart-square-linear"
              width={80}
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
                  className="text-primary"
                  icon="solar:users-group-two-rounded-bold"
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
                  className="text-success"
                  icon="solar:check-circle-bold"
                  width={24}
                />
              </div>
              <div>
                <p className="text-small text-default-500">With Email</p>
                <p className="text-2xl font-bold text-success">
                  {stats.emailPercentage}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Icon
                  className="text-warning"
                  icon="solar:phone-bold"
                  width={24}
                />
              </div>
              <div>
                <p className="text-small text-default-500">With Phone</p>
                <p className="text-2xl font-bold text-warning">
                  {stats.phonePercentage}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Icon
                  className="text-secondary"
                  icon="solar:buildings-2-bold"
                  width={24}
                />
              </div>
              <div>
                <p className="text-small text-default-500">Industries</p>
                <p className="text-2xl font-bold text-secondary">
                  {stats.totalIndustries}
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
                  className="text-default-400"
                  icon="solar:global-bold"
                  width={24}
                />
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {stats.topCountries.slice(0, 8).map((country, index) => {
                  const percentage = Math.round(
                    (country.count / stats.total) * 100,
                  );

                  return (
                    <div
                      key={country.code}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <CountryFlag countryCode={country.code} size="sm" />
                        <span className="text-small font-medium">
                          {country.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-small text-default-500">
                          {percentage}%
                        </span>
                        <span className="text-small font-medium">
                          {country.count}
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
                  className="text-default-400"
                  icon="solar:buildings-3-bold"
                  width={24}
                />
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {stats.topIndustries.slice(0, 8).map((industry, index) => {
                  const percentage = Math.round(
                    (industry.count / stats.total) * 100,
                  );

                  return (
                    <div
                      key={industry.industry}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className="text-default-400 w-4 h-4"
                          icon="solar:briefcase-bold"
                        />
                        <span className="text-small font-medium truncate">
                          {industry.industry}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-small text-default-500">
                          {percentage}%
                        </span>
                        <span className="text-small font-medium">
                          {industry.count}
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
  (
    {
      title,
      categories,
      color,
      chartData,
      unit,
      total,
      unitTitle,
      chartType = "radial",
    },
    ref,
  ) => {
    const renderChart = () => {
      switch (chartType) {
        case "bar":
          return (
            <ResponsiveContainer height={260} width="100%">
              <BarChart data={chartData}>
                <CartesianGrid
                  stroke="hsl(var(--heroui-default-200))"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--heroui-default-500))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="hsl(var(--heroui-default-500))"
                  tick={{ fontSize: 12 }}
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
                  cx="50%"
                  cy="50%"
                  data={chartData}
                  dataKey="value"
                  outerRadius={90}
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
      <Card
        ref={ref}
        className="min-h-[420px] border border-transparent dark:border-default-100"
      >
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
