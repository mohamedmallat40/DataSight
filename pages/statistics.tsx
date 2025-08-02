"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
// Removed Progress import - using custom CSS progress bar

import DefaultLayout from "@/layouts/default";
import { ProfessionalWorldMap } from "@/components/maps/professional-world-map";

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
  { country: "Brazil", code: "BR", users: 8, flag: "🇧🇷" },
  { country: "India", code: "IN", users: 6, flag: "🇮🇳" },
  { country: "China", code: "CN", users: 5, flag: "🇨🇳" },
  { country: "Russia", code: "RU", users: 4, flag: "🇷🇺" },
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
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon
              className="text-primary"
              icon="solar:global-linear"
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
                <span className="text-xs text-success">+12.5%</span>
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
                <span className="text-xs text-success">+2 new</span>
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
                +{Math.round(totalUsers * 0.15)}
              </h3>
              <p className="text-sm text-default-600">New This Month</p>
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

        {/* Interactive Map Placeholder */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.4 }}
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
              <ProfessionalWorldMap
                countryData={mockCountryData}
                hoveredCountry={hoveredCountry}
                onCountryHover={setHoveredCountry}
              />
            </CardBody>
          </Card>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.5 }}
        >
          {/* Country Statistics */}
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Icon
                  className="text-primary"
                  icon="solar:chart-square-linear"
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
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-default-50 transition-colors cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
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
                    <div className="w-20 h-2 bg-default-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{
                          width: `${(country.users / maxUsers) * 100}%`,
                        }}
                      />
                    </div>
                    <Chip color="primary" size="sm" variant="flat">
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
              {mockRoleData.map((role, index) => {
                const totalRoleUsers = mockRoleData.reduce(
                  (sum, r) => sum + r.count,
                  0,
                );
                const percentage = (role.count / totalRoleUsers) * 100;

                return (
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
                          className={`text-${role.color}`}
                          icon={
                            role.role === "Doctor"
                              ? "solar:user-speak-linear"
                              : role.role === "Nurse"
                                ? "solar:user-heart-linear"
                                : role.role === "Administrator"
                                  ? "solar:shield-user-linear"
                                  : "solar:settings-linear"
                          }
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
                          size="sm"
                          variant="flat"
                        >
                          {Math.round(percentage)}%
                        </Chip>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-default-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          role.color === "primary"
                            ? "bg-primary"
                            : role.color === "success"
                              ? "bg-success"
                              : role.color === "warning"
                                ? "bg-warning"
                                : "bg-secondary"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </motion.div>
                );
              })}
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
                icon="solar:heart-pulse-linear"
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
                  className="text-success"
                  icon="solar:arrow-up-linear"
                  width={16}
                />
                <span className="text-sm text-success">85% activity rate</span>
              </div>
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
                +{Math.round(totalUsers * 0.15)} new users this month
              </p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Icon
                  className="text-success"
                  icon="solar:arrow-up-linear"
                  width={16}
                />
                <span className="text-sm text-success">+12.5%</span>
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
                {mockRoleData[0]?.role} ({mockRoleData[0]?.count} users)
              </p>
              <div className="flex justify-center mt-3">
                <div className="w-20 h-2 bg-default-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full transition-all duration-300"
                    style={{
                      width: `${(mockRoleData[0]?.count / mockRoleData.reduce((sum, r) => sum + r.count, 0)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </DefaultLayout>
  );
}
