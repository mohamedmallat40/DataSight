"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Avatar, AvatarGroup } from "@heroui/avatar";

import DefaultLayout from "@/layouts/default";
import { SimpleProgress } from "@/components/ui/simple-progress";
import { getCountryStats, mockUsers } from "@/data/users-by-country";

export default function StatisticsPage() {
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
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon
              className="text-primary"
              icon="solar:chart-square-linear"
              width={32}
            />
            <h1 className="text-3xl font-bold text-foreground">
              Statistics Dashboard
            </h1>
          </div>
          <p className="text-lg text-default-600 max-w-2xl mx-auto">
            Comprehensive analytics and insights about our global user base
          </p>
        </motion.div>

        {/* Key Metrics Cards */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-1 border-primary/20">
            <CardBody className="text-center py-6">
              <Icon
                className="text-primary mx-auto mb-3"
                icon="solar:users-group-rounded-linear"
                width={32}
              />
              <h3 className="text-3xl font-bold text-primary mb-1">
                {totalUsers}
              </h3>
              <p className="text-sm text-default-600">Total Users</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Icon
                  className="text-success"
                  icon="solar:arrow-up-linear"
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
                className="text-success mx-auto mb-3"
                icon="solar:global-linear"
                width={32}
              />
              <h3 className="text-3xl font-bold text-success mb-1">
                {totalCountries}
              </h3>
              <p className="text-sm text-default-600">Countries</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Icon
                  className="text-success"
                  icon="solar:arrow-up-linear"
                  width={16}
                />
                <span className="text-xs text-success">+2 this month</span>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-secondary/10 to-primary/10 border-1 border-secondary/20">
            <CardBody className="text-center py-6">
              <Icon
                className="text-secondary mx-auto mb-3"
                icon="solar:user-plus-linear"
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
                  className="text-success"
                  icon="solar:arrow-up-linear"
                  width={16}
                />
                <span className="text-xs text-success">Growing</span>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-warning/10 to-danger/10 border-1 border-warning/20">
            <CardBody className="text-center py-6">
              <Icon
                className="text-warning mx-auto mb-3"
                icon="solar:chart-2-linear"
                width={32}
              />
              <h3 className="text-3xl font-bold text-warning mb-1">
                {Math.round((totalUsers / totalCountries) * 10) / 10}
              </h3>
              <p className="text-sm text-default-600">Avg. Users/Country</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Icon
                  className="text-success"
                  icon="solar:arrow-up-linear"
                  width={16}
                />
                <span className="text-xs text-success">Optimized</span>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Timeframe Selector */}
        <motion.div
          animate={{ opacity: 1 }}
          className="flex justify-center gap-2"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.2 }}
        >
          {(["week", "month", "year"] as const).map((timeframe) => (
            <Button
              key={timeframe}
              className="capitalize"
              color="primary"
              size="sm"
              variant={selectedTimeframe === timeframe ? "solid" : "flat"}
              onPress={() => setSelectedTimeframe(timeframe)}
            >
              {timeframe}
            </Button>
          ))}
        </motion.div>

        {/* Map Placeholder */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Icon
                  className="text-primary"
                  icon="solar:map-linear"
                  width={24}
                />
                <h2 className="text-xl font-semibold text-foreground">
                  Global User Distribution
                </h2>
              </div>
            </CardHeader>
            <CardBody className="p-6">
              <div className="w-full h-[500px] bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Icon
                    className="text-primary mx-auto mb-4"
                    icon="solar:map-linear"
                    width={64}
                  />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Interactive World Map
                  </h3>
                  <p className="text-default-600 mb-4">
                    Visualize user distribution across {totalCountries}{" "}
                    countries
                  </p>
                  <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {countryStats[0]?.userCount}
                      </p>
                      <p className="text-sm text-default-500">
                        {countryStats[0]?.country}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-secondary">
                        {totalUsers}
                      </p>
                      <p className="text-sm text-default-500">Total Users</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.4 }}
        >
          {/* Country Statistics */}
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Icon
                  className="text-primary"
                  icon="solar:ranking-linear"
                  width={24}
                />
                <h3 className="text-xl font-semibold text-foreground">
                  Top Countries
                </h3>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {countryStats.slice(0, 5).map((country, index) => (
                <motion.div
                  key={country.country}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <p className="font-medium text-foreground">
                        {country.country}
                      </p>
                      <p className="text-sm text-default-500">
                        {country.userCount} users
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Chip
                      className="text-xs"
                      color="primary"
                      size="sm"
                      variant="flat"
                    >
                      #{index + 1}
                    </Chip>
                  </div>
                </motion.div>
              ))}
            </CardBody>
          </Card>

          {/* Role Distribution */}
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Icon
                  className="text-primary"
                  icon="solar:pie-chart-3-linear"
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
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Icon
                        className="text-primary"
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
                              alt={user.name}
                              size="sm"
                              src={user.avatar}
                            />
                          ))}
                      </AvatarGroup>
                      <Chip
                        className="text-xs"
                        color="primary"
                        size="sm"
                        variant="flat"
                      >
                        {role.count}
                      </Chip>
                    </div>
                  </div>
                  <SimpleProgress
                    className="w-full"
                    color="primary"
                    size="sm"
                    value={role.percentage}
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
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-gradient-to-br from-primary/5 to-transparent">
            <CardBody className="text-center p-6">
              <Icon
                className="text-primary mx-auto mb-3"
                icon="solar:users-group-rounded-linear"
                width={32}
              />
              <h3 className="font-semibold text-foreground mb-2">
                Most Active Region
              </h3>
              <p className="text-default-600">
                {countryStats[0]?.country} with {countryStats[0]?.userCount}{" "}
                users
              </p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-success/5 to-transparent">
            <CardBody className="text-center p-6">
              <Icon
                className="text-success mx-auto mb-3"
                icon="solar:chart-square-linear"
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
                  className="text-success"
                  icon="solar:arrow-up-linear"
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
                className="text-secondary mx-auto mb-3"
                icon="solar:medal-star-linear"
                width={32}
              />
              <h3 className="font-semibold text-foreground mb-2">Top Role</h3>
              <p className="text-default-600">
                {roleStatsArray[0]?.role} ({roleStatsArray[0]?.count} users)
              </p>
              <div className="flex justify-center mt-3">
                <SimpleProgress
                  className="w-20"
                  color="secondary"
                  size="sm"
                  value={roleStatsArray[0]?.percentage || 0}
                />
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </DefaultLayout>
  );
}
