import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import DefaultLayout from "@/layouts/default";
import { WorldMap } from "@/components/maps/world-map";
import { CountryStatsComponent } from "@/components/maps/country-stats";
import { getCountryStats, mockUsers } from "@/data/users-by-country";

export default function MapsPage() {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const countryStats = getCountryStats();
  const totalUsers = mockUsers.length;
  const totalCountries = countryStats.length;

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
              Global User Distribution
            </h1>
          </div>
          <p className="text-lg text-default-600 max-w-2xl mx-auto">
            Explore our worldwide user base with interactive map visualization
            and detailed country statistics
          </p>

          {/* Summary Stats */}
          <div className="flex justify-center gap-6 mt-6">
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardBody className="text-center py-4 px-6">
                <h3 className="text-2xl font-bold text-primary">
                  {totalUsers}
                </h3>
                <p className="text-sm text-default-600">Total Users</p>
              </CardBody>
            </Card>
            <Card className="bg-gradient-to-r from-success/10 to-warning/10">
              <CardBody className="text-center py-4 px-6">
                <h3 className="text-2xl font-bold text-success">
                  {totalCountries}
                </h3>
                <p className="text-sm text-default-600">Countries</p>
              </CardBody>
            </Card>
            <Card className="bg-gradient-to-r from-secondary/10 to-primary/10">
              <CardBody className="text-center py-4 px-6">
                <h3 className="text-2xl font-bold text-secondary">
                  {Math.round((totalUsers / totalCountries) * 10) / 10}
                </h3>
                <p className="text-sm text-default-600">Avg. Users/Country</p>
              </CardBody>
            </Card>
          </div>
        </motion.div>

        {/* Interactive Instructions */}
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-1 border-primary/20">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <Icon
                  className="text-primary flex-shrink-0"
                  icon="solar:info-circle-linear"
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
                  Interactive World Map
                </h2>
                {hoveredCountry && (
                  <Chip
                    className="ml-auto"
                    color="primary"
                    size="sm"
                    variant="flat"
                  >
                    Viewing: {hoveredCountry}
                  </Chip>
                )}
              </div>
            </CardHeader>
            <CardBody className="p-6">
              <WorldMap
                countryStats={countryStats}
                hoveredCountry={hoveredCountry}
                onCountryHover={setHoveredCountry}
              />
            </CardBody>
          </Card>
        </motion.div>

        {/* Country Statistics */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="shadow-lg">
            <CardBody className="p-6">
              <CountryStatsComponent
                countryStats={countryStats}
                hoveredCountry={hoveredCountry}
                onCountryHover={setHoveredCountry}
              />
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
                +{Math.round(totalUsers * 0.15)} new users this month
              </p>
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
                Doctor ({mockUsers.filter((u) => u.role === "Doctor").length}{" "}
                users)
              </p>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </DefaultLayout>
  );
}
