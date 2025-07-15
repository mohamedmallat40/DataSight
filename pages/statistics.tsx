"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Progress } from "@heroui/progress";

import DefaultLayout from "@/layouts/default";

// Mock data for demonstration
const mockCountryData = [
  { country: "Saudi Arabia", code: "SA", users: 45, flag: "🇸🇦" },
  { country: "United States", code: "US", users: 38, flag: "🇺🇸" },
  { country: "United Kingdom", code: "GB", users: 25, flag: "🇬🇧" },
  { country: "Germany", code: "DE", users: 22, flag: "🇩🇪" },
  { country: "France", code: "FR", users: 18, flag: "🇫🇷" },
  { country: "Japan", code: "JP", users: 15, flag: "🇯🇵" },
  { country: "Canada", code: "CA", users: 12, flag: "🇨🇦" },
  { country: "Australia", code: "AU", users: 10, flag: "🇦🇺" },
];

const mockRoleData = [
  { role: "Doctor", count: 85, color: "primary" },
  { role: "Nurse", count: 62, color: "success" },
  { role: "Administrator", count: 28, color: "warning" },
  { role: "Technician", count: 15, color: "secondary" },
];

export default function StatisticsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "week" | "month" | "year"
  >("month");
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const totalUsers = mockCountryData.reduce(
    (sum, country) => sum + country.users,
    0,
  );
  const totalCountries = mockCountryData.length;
  const maxUsers = Math.max(...mockCountryData.map((c) => c.users));

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
              icon="solar:global-linear"
              className="text-primary"
              width={32}
            />
            <h1 className="text-3xl font-bold text-foreground">
              Global Statistics Dashboard
            </h1>
          </div>
          <p className="text-lg text-default-600 max-w-2xl mx-auto">
            Comprehensive analytics and insights about our worldwide healthcare
            network
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
                <span className="text-xs text-success">+12.5%</span>
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
                <span className="text-xs text-success">+2 new</span>
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
                +{Math.round(totalUsers * 0.15)}
              </h3>
              <p className="text-sm text-default-600">New This Month</p>
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

        {/* Interactive Map Placeholder */}
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
                  Global User Distribution
                </h2>
              </div>
            </CardHeader>
            <CardBody className="p-6">
              <div className="w-full h-[400px] bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border-2 border-dashed border-primary/20 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Icon
                      icon="solar:global-linear"
                      className="text-primary/40 mx-auto"
                      width={80}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Interactive Map
                      </h3>
                      <p className="text-default-500 max-w-md">
                        World map with geographic data visualization showing
                        user distribution across countries.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Regional indicators */}
                <div className="absolute top-4 left-4">
                  <Chip color="primary" variant="flat" size="sm">
                    Middle East: 45 users
                  </Chip>
                </div>
                <div className="absolute top-4 right-4">
                  <Chip color="success" variant="flat" size="sm">
                    North America: 50 users
                  </Chip>
                </div>
                <div className="absolute bottom-4 left-4">
                  <Chip color="warning" variant="flat" size="sm">
                    Europe: 65 users
                  </Chip>
                </div>
                <div className="absolute bottom-4 right-4">
                  <Chip color="secondary" variant="flat" size="sm">
                    Asia-Pacific: 25 users
                  </Chip>
                </div>
              </div>
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
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Icon
                  icon="solar:chart-square-linear"
                  className="text-primary"
                  width={24}
                />
                <h3 className="text-xl font-semibold text-foreground">
                  Top Countries by Users
                </h3>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {mockCountryData.map((country, index) => (
                <motion.div
                  key={country.code}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-default-50 transition-colors cursor-pointer"
                  onMouseEnter={() => setHoveredCountry(country.country)}
                  onMouseLeave={() => setHoveredCountry(null)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <p className="font-medium text-foreground">
                        {country.country}
                      </p>
                      <p className="text-sm text-default-500">
                        {country.users} users
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress
                      value={(country.users / maxUsers) * 100}
                      color="primary"
                      size="sm"
                      className="w-20"
                    />
                    <Chip color="primary" variant="flat" size="sm">
                      {country.users}
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
              {mockRoleData.map((role, index) => {
                const totalRoleUsers = mockRoleData.reduce(
                  (sum, r) => sum + r.count,
                  0,
                );
                const percentage = (role.count / totalRoleUsers) * 100;

                return (
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
                                  ? "solar:shield-user-linear"
                                  : "solar:settings-linear"
                          }
                          className={`text-${role.color}`}
                          width={20}
                        />
                        <span className="font-medium text-foreground">
                          {role.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-default-500">
                          {role.count} users
                        </span>
                        <Chip
                          color={role.color as any}
                          variant="flat"
                          size="sm"
                        >
                          {Math.round(percentage)}%
                        </Chip>
                      </div>
                    </div>
                    <Progress
                      value={percentage}
                      color={role.color as any}
                      size="sm"
                    />
                  </motion.div>
                );
              })}
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
                icon="solar:heart-pulse-linear"
                className="text-primary mx-auto mb-3"
                width={32}
              />
              <h3 className="font-semibold text-foreground mb-2">
                Active Users
              </h3>
              <p className="text-default-600">
                {Math.round(totalUsers * 0.85)} users active this week
              </p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Icon
                  icon="solar:arrow-up-linear"
                  className="text-success"
                  width={16}
                />
                <span className="text-sm text-success">85% activity rate</span>
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
                +{Math.round(totalUsers * 0.15)} new users this month
              </p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Icon
                  icon="solar:arrow-up-linear"
                  className="text-success"
                  width={16}
                />
                <span className="text-sm text-success">+12.5%</span>
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
                {mockRoleData[0]?.role} ({mockRoleData[0]?.count} users)
              </p>
              <div className="flex justify-center mt-3">
                <Progress
                  value={
                    (mockRoleData[0]?.count /
                      mockRoleData.reduce((sum, r) => sum + r.count, 0)) *
                    100
                  }
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
