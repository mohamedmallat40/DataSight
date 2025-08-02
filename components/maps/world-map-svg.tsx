"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { Card, CardBody, Avatar, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

import { CountryStats, User, getUsersByCountry } from "@/data/users-by-country";

// World map data URL - using a simple world topology
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@3/countries-110m.json";

// Country code mappings for the map data
const countryCodeMap: Record<string, string> = {
  US: "840", // United States
  SA: "682", // Saudi Arabia
  CA: "124", // Canada
  GB: "826", // United Kingdom
  DE: "276", // Germany
  FR: "250", // France
  AU: "036", // Australia
  JP: "392", // Japan
  BR: "076", // Brazil
  IN: "356", // India
};

interface WorldMapSVGProps {
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

export const WorldMapSVG = ({
  countryStats,
  onCountryHover,
  hoveredCountry,
}: WorldMapSVGProps) => {
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(false);

  // Get color intensity based on user count
  const getCountryColor = (countryCode: string) => {
    const country = countryStats.find(
      (c) => countryCodeMap[c.countryCode] === countryCode,
    );

    if (!country) return "#f1f5f9"; // Default light gray

    const maxUsers = Math.max(...countryStats.map((c) => c.userCount));
    const intensity = country.userCount / maxUsers;

    // Create gradient from light to dark primary color
    if (intensity > 0.8) return "#006FEE"; // Dark primary
    if (intensity > 0.6) return "#338EF7"; // Medium primary
    if (intensity > 0.4) return "#66A3FF"; // Light primary
    if (intensity > 0.2) return "#99B8FF"; // Very light primary

    return "#CCE0FF"; // Lightest primary
  };

  const getCountryByCode = (countryCode: string) => {
    return countryStats.find(
      (c) => countryCodeMap[c.countryCode] === countryCode,
    );
  };

  const hoveredUsers = hoveredCountry ? getUsersByCountry(hoveredCountry) : [];

  if (mapError) {
    return (
      <div className="w-full h-[500px] bg-content1 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Icon
            className="text-danger mx-auto mb-2"
            icon="solar:danger-triangle-linear"
            width={48}
          />
          <p className="text-danger">Failed to load map</p>
          <p className="text-sm text-default-500">Please refresh the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="w-full h-[500px] bg-content1 rounded-lg overflow-hidden">
        <ComposableMap
          projectionConfig={{
            scale: 147,
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) => (
              <>
                {geographies.map((geo) => {
                  const country = getCountryByCode(geo.id);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      fill={getCountryColor(geo.id)}
                      geography={geo}
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      style={{
                        default: {
                          outline: "none",
                          transition: "all 0.2s ease",
                        },
                        hover: {
                          fill: country ? "#0052CC" : "#f1f5f9",
                          stroke: "#FFFFFF",
                          strokeWidth: 1,
                          outline: "none",
                          cursor: country ? "pointer" : "default",
                        },
                        pressed: {
                          outline: "none",
                        },
                      }}
                      onMouseEnter={() => {
                        if (country) {
                          onCountryHover(country.country);
                        }
                      }}
                      onMouseLeave={() => {
                        onCountryHover(null);
                      }}
                    />
                  );
                })}
              </>
            )}
          </Geographies>

          {countryStats.map((country) => (
            <Marker
              key={country.country}
              coordinates={[country.lng, country.lat]}
            >
              <circle
                fill="#006FEE"
                r={Math.min(Math.max(country.userCount * 2, 4), 12)}
                stroke="#FFFFFF"
                strokeWidth={2}
                style={{
                  cursor: "pointer",
                  filter:
                    hoveredCountry === country.country
                      ? "drop-shadow(0 0 8px #006FEE)"
                      : "none",
                }}
                onMouseEnter={() => onCountryHover(country.country)}
                onMouseLeave={() => onCountryHover(null)}
              />
              <text
                style={{
                  fontFamily: "system-ui",
                  fontSize: "10px",
                  fill: "#374151",
                  fontWeight: "500",
                  pointerEvents: "none",
                }}
                textAnchor="middle"
                y={-15}
              >
                {country.userCount}
              </text>
            </Marker>
          ))}
        </ComposableMap>

        {mapLoading && (
          <div className="absolute inset-0 bg-content1 flex items-center justify-center">
            <div className="text-center">
              <Icon
                className="text-primary mx-auto mb-2"
                icon="solar:map-linear"
                width={48}
              />
              <p className="text-default-500">Loading world map...</p>
            </div>
          </div>
        )}
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
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-[#CCE0FF]" />
            <span className="text-default-600">Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-[#66A3FF]" />
            <span className="text-default-600">Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-[#006FEE]" />
            <span className="text-default-600">High</span>
          </div>
        </div>
      </div>
    </div>
  );
};
