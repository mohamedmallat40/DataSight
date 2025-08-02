"use client";

import { Card, CardBody, Avatar, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

import { CountryStats, User, getUsersByCountry } from "@/data/users-by-country";

interface CustomWorldMapProps {
  countryStats: CountryStats[];
  onCountryHover: (country: string | null) => void;
  hoveredCountry: string | null;
}

// User list component for hover
const UserList = ({ users, country }: { users: User[]; country: string }) => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    className="fixed top-20 right-4 z-[1000] pointer-events-none"
    exit={{ opacity: 0, y: -10 }}
    initial={{ opacity: 0, y: 10 }}
  >
    <Card className="w-80 shadow-lg border-1 border-primary/20 bg-content1/95 backdrop-blur-sm">
      <CardBody className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon
            className="text-primary"
            icon="solar:users-group-rounded-linear"
            width={20}
          />
          <h4 className="font-semibold text-foreground">{country}</h4>
          <Chip color="primary" size="sm" variant="flat">
            {users.length} users
          </Chip>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {users.slice(0, 10).map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-2 rounded-md bg-default-50"
            >
              <Avatar alt={user.name} size="sm" src={user.avatar} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-default-500 truncate">
                  {user.email}
                </p>
              </div>
              <Chip
                className="text-xs"
                color="secondary"
                size="sm"
                variant="flat"
              >
                {user.role}
              </Chip>
            </div>
          ))}
          {users.length > 10 && (
            <p className="text-xs text-default-500 text-center py-2">
              +{users.length - 10} more users
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  </motion.div>
);

// Country card component
const CountryCard = ({
  country,
  users,
  position,
}: {
  country: CountryStats;
  users: User[];
  position: { top: string; left: string };
}) => {
  const getColorIntensity = (userCount: number, maxUsers: number) => {
    const intensity = userCount / maxUsers;

    if (intensity > 0.8) return "bg-primary-600";
    if (intensity > 0.6) return "bg-primary-500";
    if (intensity > 0.4) return "bg-primary-400";
    if (intensity > 0.2) return "bg-primary-300";

    return "bg-primary-200";
  };

  const maxUsers = 4; // Based on our data
  const colorClass = getColorIntensity(country.userCount, maxUsers);

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      style={{ top: position.top, left: position.left }}
    >
      <div
        className={`w-6 h-6 rounded-full ${colorClass} border-2 border-white shadow-lg hover:scale-125 transition-all duration-200 flex items-center justify-center`}
      >
        <span className="text-xs font-bold text-white">
          {country.userCount}
        </span>
      </div>
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-foreground whitespace-nowrap">
        {country.flag}
      </div>
    </div>
  );
};

export const CustomWorldMap = ({
  countryStats,
  onCountryHover,
  hoveredCountry,
}: CustomWorldMapProps) => {
  const hoveredUsers = hoveredCountry ? getUsersByCountry(hoveredCountry) : [];

  // Position data for countries (approximate positions on a world map)
  const countryPositions: Record<string, { top: string; left: string }> = {
    "United States": { top: "35%", left: "20%" },
    "Saudi Arabia": { top: "45%", left: "60%" },
    Canada: { top: "25%", left: "18%" },
    "United Kingdom": { top: "30%", left: "48%" },
    Germany: { top: "32%", left: "52%" },
    France: { top: "35%", left: "50%" },
    Australia: { top: "75%", left: "85%" },
    Japan: { top: "40%", left: "85%" },
    Brazil: { top: "65%", left: "30%" },
    India: { top: "45%", left: "72%" },
  };

  return (
    <div className="relative">
      <div className="w-full h-[500px] bg-gradient-to-b from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-lg overflow-hidden relative">
        {/* World map background */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            fill="currentColor"
            viewBox="0 0 1000 500"
          >
            {/* Simplified world continents */}
            {/* North America */}
            <path d="M50 100 Q100 80 200 120 Q250 100 300 140 L280 200 Q200 180 150 200 Q100 190 50 160 Z" />
            {/* South America */}
            <path d="M180 250 Q220 240 250 280 Q260 350 240 400 Q200 420 180 380 Q160 320 180 250 Z" />
            {/* Europe */}
            <path d="M400 80 Q450 70 500 100 Q520 120 510 140 Q480 150 450 140 Q420 130 400 80 Z" />
            {/* Africa */}
            <path d="M450 200 Q500 180 520 220 Q530 280 520 340 Q500 380 480 360 Q460 320 450 280 Q440 240 450 200 Z" />
            {/* Asia */}
            <path d="M550 100 Q650 80 750 120 Q800 100 850 140 Q870 180 850 220 Q800 240 750 220 Q650 200 550 180 Q530 140 550 100 Z" />
            {/* Australia */}
            <path d="M750 350 Q800 340 850 360 Q870 380 850 400 Q800 410 750 400 Q730 380 750 350 Z" />
          </svg>
        </div>

        {/* Country markers */}
        {countryStats.map((country) => {
          const position = countryPositions[country.country];

          if (!position) return null;

          const users = getUsersByCountry(country.country);

          return (
            <div
              key={country.country}
              onMouseEnter={() => onCountryHover(country.country)}
              onMouseLeave={() => onCountryHover(null)}
            >
              <CountryCard
                country={country}
                position={position}
                users={users}
              />
            </div>
          );
        })}

        {/* Grid overlay for better visual reference */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
              backgroundSize: "100px 50px",
            }}
          />
        </div>

        {/* Title overlay */}
        <div className="absolute top-4 left-4 bg-content1/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <Icon
              className="text-primary"
              icon="solar:global-linear"
              width={20}
            />
            <h5 className="text-sm font-semibold text-foreground">
              World Distribution
            </h5>
          </div>
        </div>
      </div>

      {/* User list on hover */}
      <AnimatePresence>
        {hoveredCountry && hoveredUsers.length > 0 && (
          <UserList country={hoveredCountry} users={hoveredUsers} />
        )}
      </AnimatePresence>

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-content1/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h5 className="text-sm font-semibold text-foreground mb-2">
          User Distribution
        </h5>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-primary-200" />
            <span className="text-default-600">1</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-primary-400" />
            <span className="text-default-600">2-3</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-primary-600" />
            <span className="text-default-600">4+</span>
          </div>
        </div>
      </div>

      {/* Interactive instructions */}
      <div className="absolute top-4 right-4 bg-content1/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
        <div className="text-xs text-default-600">
          <Icon className="inline mr-1" icon="solar:cursor-linear" width={12} />
          Hover over country markers to see user details
        </div>
      </div>
    </div>
  );
};
