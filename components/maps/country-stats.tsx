"use client";

import { Card, CardBody, Avatar, Chip, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { CountryStats, getUsersByCountry } from "@/data/users-by-country";

interface CountryStatsProps {
  countryStats: CountryStats[];
  hoveredCountry: string | null;
  onCountryHover: (country: string | null) => void;
}

export const CountryStatsComponent = ({
  countryStats,
  hoveredCountry,
  onCountryHover,
}: CountryStatsProps) => {
  const maxUsers = Math.max(...countryStats.map((c) => c.userCount));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Icon
          icon="solar:chart-square-linear"
          className="text-primary"
          width={24}
        />
        <h2 className="text-xl font-semibold text-foreground">
          Top 10 Countries by Users
        </h2>
      </div>

      <div className="grid gap-3">
        {countryStats.map((country, index) => {
          const users = getUsersByCountry(country.country);
          const isHovered = hoveredCountry === country.country;

          return (
            <motion.div
              key={country.country}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 ${
                  isHovered
                    ? "border-2 border-primary shadow-lg scale-[1.02]"
                    : "border-1 border-divider hover:border-primary/50 hover:shadow-md"
                }`}
                onMouseEnter={() => onCountryHover(country.country)}
                onMouseLeave={() => onCountryHover(null)}
              >
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Rank */}
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        {index + 1}
                      </div>

                      {/* Country Info */}
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{country.flag}</span>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {country.country}
                          </h3>
                          <p className="text-sm text-default-500">
                            {country.userCount}{" "}
                            {country.userCount === 1 ? "user" : "users"}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="flex-1 max-w-[200px]">
                        <Progress
                          value={(country.userCount / maxUsers) * 100}
                          color="primary"
                          size="sm"
                          className="w-full"
                        />
                      </div>

                      {/* User Count */}
                      <Chip
                        color="primary"
                        variant="flat"
                        size="sm"
                        className="font-semibold"
                      >
                        {country.userCount}
                      </Chip>
                    </div>
                  </div>

                  {/* User Avatars Preview */}
                  {isHovered && users.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-divider"
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm text-default-600 font-medium">
                          Users:
                        </span>
                        <div className="flex -space-x-2">
                          {users.slice(0, 5).map((user, idx) => (
                            <Avatar
                              key={user.id}
                              src={user.avatar}
                              alt={user.name}
                              size="sm"
                              className="border-2 border-background z-10"
                              style={{ zIndex: 10 - idx }}
                            />
                          ))}
                          {users.length > 5 && (
                            <div className="flex items-center justify-center w-8 h-8 bg-default-100 rounded-full border-2 border-background text-xs font-medium text-default-600">
                              +{users.length - 5}
                            </div>
                          )}
                        </div>

                        {/* Role Distribution */}
                        <div className="flex gap-1 ml-4">
                          {Array.from(new Set(users.map((u) => u.role)))
                            .slice(0, 3)
                            .map((role) => (
                              <Chip
                                key={role}
                                size="sm"
                                variant="dot"
                                className="text-xs"
                              >
                                {role}
                              </Chip>
                            ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardBody>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
