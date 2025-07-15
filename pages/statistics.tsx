"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { ClientProgress } from "@/components/ui/client-progress";
import { Avatar, AvatarGroup } from "@heroui/avatar";
import dynamic from "next/dynamic";

import DefaultLayout from "@/layouts/default";
import {
  getCountryStats,
  mockUsers,
  getUsersByCountry,
} from "@/data/users-by-country";

// Dynamically import components that might have SSR issues
const WorldMap = dynamic(
  () =>
    import("@/components/maps/world-map").then((mod) => ({
      default: mod.WorldMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-content1 rounded-lg flex items-center justify-center">
        <Icon
          icon="solar:map-linear"
          className="text-primary mx-auto mb-2"
          width={48}
        />
        <p className="text-default-500">Loading world map...</p>
      </div>
    ),
  },
);

const CountryStatsComponent = dynamic(
  () =>
    import("@/components/maps/country-stats").then((mod) => ({
      default: mod.CountryStatsComponent,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] bg-content1 rounded-lg flex items-center justify-center">
        <Icon
          icon="solar:chart-square-linear"
          className="text-primary mx-auto mb-2"
          width={48}
        />
        <p className="text-default-500">Loading statistics...</p>
      </div>
    ),
  },
);

export default function StatisticsPage() {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "week" | "month" | "year"
  >("month");

  const countryStats = getCountryStats();
  const totalUsers = mockUsers.length;
  const totalCountries = countryStats.length;

  // Calculate role distribution
  const roleStats = mockUsers.reduce(
    (acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const roleStatsArray = Object.entries(roleStats)
    .map(([role, count]) => ({
      role,
      count,
      percentage: (count / totalUsers) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  // Calculate growth metrics (simulated)
  const growthData = {
    week: { new: 3, percentage: 18.7 },
    month: { new: Math.round(totalUsers * 0.15), percentage: 12.5 },
    year: { new: Math.round(totalUsers * 0.75), percentage: 45.2 },
  };

  const currentGrowth = growthData[selectedTimeframe];

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon
              icon="solar:chart-square-linear"
              className="text-primary"
              width={32}
            />
            <h1 className="text-3xl font-bold text-foreground">
              Global Statistics Dashboard
            </h1>
          </div>
          <p className="text-lg text-default-600 max-w-2xl mx-auto">
            Comprehensive analytics and insights about our global user base with
            interactive visualizations
          </p>
        </motion.div>

        {/* Key Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-1 border-primary/20">
            <CardBody className="text-center py-6">
              <Icon
                icon="solar:users-group-rounded-linear"
                className="text-primary mx-auto mb-3"
                width={32}
              />
              <h3 className="text-3xl font-bold text-primary mb-1">
                {totalUsers}
              </h3>
              <p className="text-sm text-default-600">Total Users</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Icon
                  icon="solar:arrow-up-linear"
                  className="text-success"
                  width={16}
                />
                <span className="text-xs text-success">
                  +{currentGrowth.percentage}%
                </span>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-success/10 to-warning/10 border-1 border-success/20">
            <CardBody className="text-center py-6">
              <Icon
                icon="solar:global-linear"
                className="text-success mx-auto mb-3"
                width={32}
              />
              <h3 className="text-3xl font-bold text-success mb-1">
                {totalCountries}
              </h3>
              <p className="text-sm text-default-600">Countries</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Icon
                  icon="solar:arrow-up-linear"
                  className="text-success"
                  width={16}
                />
                <span className="text-xs text-success">+2 this month</span>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-secondary/10 to-primary/10 border-1 border-secondary/20">
            <CardBody className="text-center py-6">
              <Icon
                icon="solar:user-plus-linear"
                className="text-secondary mx-auto mb-3"
                width={32}
              />
              <h3 className="text-3xl font-bold text-secondary mb-1">
                +{currentGrowth.new}
              </h3>
              <p className="text-sm text-default-600">
                New This {selectedTimeframe}
              </p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Icon
                  icon="solar:arrow-up-linear"
                  className="text-success"
                  width={16}
                />
                <span className="text-xs text-success">Growing</span>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-warning/10 to-danger/10 border-1 border-warning/20">
            <CardBody className="text-center py-6">
              <Icon
                icon="solar:chart-2-linear"
                className="text-warning mx-auto mb-3"
                width={32}
              />
              <h3 className="text-3xl font-bold text-warning mb-1">
                {Math.round((totalUsers / totalCountries) * 10) / 10}
              </h3>
              <p className="text-sm text-default-600">Avg. Users/Country</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Icon
                  icon="solar:arrow-up-linear"
                  className="text-success"
                  width={16}
                />
                <span className="text-xs text-success">Optimized</span>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Timeframe Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-2"
        >
          {(["week", "month", "year"] as const).map((timeframe) => (
            <Button
              key={timeframe}
              size="sm"
              variant={selectedTimeframe === timeframe ? "solid" : "flat"}
              color="primary"
              onPress={() => setSelectedTimeframe(timeframe)}
              className="capitalize"
            >
              {timeframe}
            </Button>
          ))}
        </motion.div>

        {/* Interactive Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-1 border-primary/20">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <Icon
                  icon="solar:info-circle-linear"
                  className="text-primary flex-shrink-0"
                  width={24}
                />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">
                    Interactive Features:
                  </p>
                  <ul className="text-default-600 space-y-1">
                    <li>
                      • <strong>Hover over map markers</strong> to see user
                      cards with detailed information
                    </li>
                    <li>
                      • <strong>Hover over country stats</strong> to highlight
                      the corresponding country on the map
                    </li>
                    <li>
                      • <strong>Click on markers</strong> to view country
                      details and user count
                    </li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* World Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Icon
                  icon="solar:map-linear"
                  className="text-primary"
                  width={24}
                />
                <h2 className="text-xl font-semibold text-foreground">
                  Interactive World Map
                </h2>
                {hoveredCountry && (
                  <Chip
                    color="primary"
                    variant="flat"
                    size="sm"
                    className="ml-auto"
                  >
                    Viewing: {hoveredCountry}
                  </Chip>
                )}
              </div>
            </CardHeader>
            <CardBody className="p-6">
              <WorldMap
                countryStats={countryStats}
                onCountryHover={setHoveredCountry}
                hoveredCountry={hoveredCountry}
              />
            </CardBody>
          </Card>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Country Statistics */}
          <Card className="shadow-lg">
            <CardBody className="p-6">
              <CountryStatsComponent
                countryStats={countryStats}
                hoveredCountry={hoveredCountry}
                onCountryHover={setHoveredCountry}
              />
            </CardBody>
          </Card>

          {/* Role Distribution */}
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Icon
                  icon="solar:pie-chart-3-linear"
                  className="text-primary"
                  width={24}
                />
                <h3 className="text-xl font-semibold text-foreground">
                  Role Distribution
                </h3>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {roleStatsArray.map((role, index) => (
                <motion.div
                  key={role.role}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Icon
                        icon={
                          role.role === "Doctor"
                            ? "solar:user-speak-linear"
                            : role.role === "Nurse"
                              ? "solar:user-heart-linear"
                              : role.role === "Administrator"
                                ? "solar:user-linear"
                                : role.role === "Manager"
                                  ? "solar:user-bold-linear"
                                  : "solar:user-check-linear"
                        }
                        className="text-primary"
                        width={20}
                      />
                      <span className="font-medium text-foreground">
                        {role.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <AvatarGroup max={3} size="sm">
                        {mockUsers
                          .filter((u) => u.role === role.role)
                          .slice(0, 3)
                          .map((user) => (
                            <Avatar
                              key={user.id}
                              src={user.avatar}
                              alt={user.name}
                              size="sm"
                            />
                          ))}
                      </AvatarGroup>
                      <Chip
                        size="sm"
                        variant="flat"
                        color="primary"
                        className="text-xs"
                      >
                        {role.count}
                      </Chip>
                    </div>
                  </div>
                  <Progress
                    value={role.percentage}
                    color="primary"
                    className="w-full"
                    size="sm"
                  />
                  <p className="text-xs text-default-500">
                    {role.percentage.toFixed(1)}% of total users
                  </p>
                </motion.div>
              ))}
            </CardBody>
          </Card>
        </motion.div>

        {/* Additional Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <Card className="bg-gradient-to-br from-primary/5 to-transparent">
            <CardBody className="text-center p-6">
              <Icon
                icon="solar:users-group-rounded-linear"
                className="text-primary mx-auto mb-3"
                width={32}
              />
              <h3 className="font-semibold text-foreground mb-2">
                Most Active Region
              </h3>
              <p className="text-default-600">
                {countryStats[0]?.country} with {countryStats[0]?.userCount}{" "}
                users
              </p>
              <div className="flex justify-center mt-3">
                <AvatarGroup max={4} size="sm">
                  {getUsersByCountry(countryStats[0]?.country || "")
                    .slice(0, 4)
                    .map((user) => (
                      <Avatar
                        key={user.id}
                        src={user.avatar}
                        alt={user.name}
                        size="sm"
                      />
                    ))}
                </AvatarGroup>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-success/5 to-transparent">
            <CardBody className="text-center p-6">
              <Icon
                icon="solar:chart-square-linear"
                className="text-success mx-auto mb-3"
                width={32}
              />
              <h3 className="font-semibold text-foreground mb-2">
                Growth Trend
              </h3>
              <p className="text-default-600">
                +{currentGrowth.new} new users this {selectedTimeframe}
              </p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Icon
                  icon="solar:arrow-up-linear"
                  className="text-success"
                  width={16}
                />
                <span className="text-sm text-success">
                  +{currentGrowth.percentage}%
                </span>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/5 to-transparent">
            <CardBody className="text-center p-6">
              <Icon
                icon="solar:medal-star-linear"
                className="text-secondary mx-auto mb-3"
                width={32}
              />
              <h3 className="font-semibold text-foreground mb-2">Top Role</h3>
              <p className="text-default-600">
                {roleStatsArray[0]?.role} ({roleStatsArray[0]?.count} users)
              </p>
              <div className="flex justify-center mt-3">
                <Progress
                  value={roleStatsArray[0]?.percentage || 0}
                  color="secondary"
                  className="w-20"
                  size="sm"
                />
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </DefaultLayout>
  );
}
