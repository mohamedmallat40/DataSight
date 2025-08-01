"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";

interface CountryData {
  country: string;
  code: string;
  users: number;
  flag: string;
}

interface ProfessionalWorldMapProps {
  countryData: CountryData[];
  onCountryHover?: (country: string | null) => void;
  hoveredCountry?: string | null;
}

// World map topology URL (Natural Earth data)
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Country code mappings (ISO Alpha-2 to ISO Numeric used by the topology)
const countryCodeMap: Record<string, string> = {
  US: "840", // United States
  SA: "682", // Saudi Arabia
  GB: "826", // United Kingdom
  DE: "276", // Germany
  FR: "250", // France
  JP: "392", // Japan
  CA: "124", // Canada
  AU: "036", // Australia
  BR: "076", // Brazil
  IN: "356", // India
  CN: "156", // China
  RU: "643", // Russia
};

// Mock user data for each country to display on hover
const countryUsers: Record<
  string,
  Array<{ name: string; role: string; department: string }>
> = {
  US: [
    { name: "John Smith", role: "Doctor", department: "Cardiology" },
    { name: "Sarah Johnson", role: "Nurse", department: "Emergency" },
    { name: "Mike Wilson", role: "Administrator", department: "Operations" },
  ],
  SA: [
    { name: "Ahmed Al-Rashid", role: "Doctor", department: "Orthopedics" },
    { name: "Fatima Al-Zahra", role: "Nurse", department: "Pediatrics" },
    { name: "Omar Hassan", role: "Administrator", department: "Finance" },
  ],
  GB: [
    { name: "James Brown", role: "Doctor", department: "Neurology" },
    { name: "Emma Davis", role: "Nurse", department: "Surgery" },
  ],
  DE: [
    { name: "Hans Mueller", role: "Doctor", department: "Radiology" },
    { name: "Anna Schmidt", role: "Technician", department: "Lab" },
  ],
  FR: [
    { name: "Pierre Dubois", role: "Doctor", department: "Oncology" },
    { name: "Marie Martin", role: "Nurse", department: "ICU" },
  ],
  JP: [
    { name: "Hiroshi Tanaka", role: "Doctor", department: "Gastroenterology" },
    { name: "Yuki Sato", role: "Administrator", department: "IT" },
  ],
  CA: [
    { name: "Robert Taylor", role: "Doctor", department: "Family Medicine" },
    { name: "Jennifer Lee", role: "Nurse", department: "Maternity" },
  ],
  AU: [
    { name: "David Wilson", role: "Doctor", department: "Dermatology" },
    { name: "Lisa Thompson", role: "Technician", department: "Pharmacy" },
  ],
};

export const ProfessionalWorldMap = ({
  countryData,
  onCountryHover,
  hoveredCountry,
}: ProfessionalWorldMapProps) => {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    country: CountryData | null;
  }>({
    x: 0,
    y: 0,
    country: null,
  });

  const [mapError, setMapError] = useState(false);
  const [zoom, setZoom] = useState(2.25);
  const [center, setCenter] = useState<[number, number]>([15, 45]);

  // Get color intensity based on user count
  const getCountryColor = (geoId: string) => {
    const countryCode = Object.keys(countryCodeMap).find(
      (code) => countryCodeMap[code] === geoId,
    );

    if (!countryCode) return "#e2e8f0"; // Light gray for countries without data

    const country = countryData.find((c) => c.code === countryCode);

    if (!country) return "#e2e8f0";

    const maxUsers = Math.max(...countryData.map((c) => c.users));
    const intensity = country.users / maxUsers;

    // Enhanced color gradient with better contrast
    const colors = [
      "#e0f2fe", // Very light blue
      "#bae6fd", // Light blue
      "#7dd3fc", // Medium light blue
      "#38bdf8", // Medium blue
      "#0ea5e9", // Blue
      "#0284c7", // Dark blue
      "#0369a1", // Very dark blue
      "#075985", // Darkest blue
    ];

    // Use more dynamic color mapping with minimum intensity
    const minIntensity = 0.2; // Ensure minimum visibility
    const adjustedIntensity = minIntensity + intensity * (1 - minIntensity);
    const colorIndex = Math.min(
      Math.floor(adjustedIntensity * colors.length),
      colors.length - 1,
    );

    return colors[colorIndex];
  };

  const handleCountryClick = (geo: any) => {
    const countryCode = Object.keys(countryCodeMap).find(
      (code) => countryCodeMap[code] === geo.id,
    );

    if (countryCode) {
      const country = countryData.find((c) => c.code === countryCode);

      if (country) {
        onCountryHover?.(country.country);
      }
    }
  };

  const handleCountryMouseEnter = (geo: any, event: React.MouseEvent) => {
    const countryCode = Object.keys(countryCodeMap).find(
      (code) => countryCodeMap[code] === geo.id,
    );

    if (countryCode) {
      const country = countryData.find((c) => c.code === countryCode);

      if (country) {
        setTooltip({
          x: event.clientX,
          y: event.clientY,
          country,
        });
        onCountryHover?.(country.country);
      }
    }
  };

  const handleCountryMouseLeave = () => {
    setTooltip({ x: 0, y: 0, country: null });
    onCountryHover?.(null);
  };

  // Zoom control functions
  const handleZoomIn = () => {
    if (zoom < 4) {
      setZoom(zoom * 1.5);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 0.5) {
      setZoom(zoom / 1.5);
    }
  };

  const handleResetZoom = () => {
    setZoom(2.25);
    setCenter([15, 45]);
  };

  // Show fallback if map fails to load
  if (mapError) {
    return (
      <div className="relative w-full h-[600px] bg-gradient-to-br from-blue-50 to-slate-100 dark:from-blue-950/20 dark:to-slate-900/20 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="grid grid-cols-3 gap-4 max-w-md">
            {countryData.slice(0, 9).map((country, index) => (
              <motion.div
                key={country.code}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 dark:bg-slate-800/90 p-3 rounded-lg text-center cursor-pointer hover:scale-105 transition-transform"
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onCountryHover?.(country.country)}
              >
                <div className="text-2xl mb-1">{country.flag}</div>
                <div className="text-xs font-medium text-foreground">
                  {country.country.split(" ")[0]}
                </div>
                <div className="text-xs text-primary font-bold">
                  {country.users}
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-sm text-default-500">
            Interactive country grid view
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-blue-50 to-slate-100 dark:from-blue-950/20 dark:to-slate-900/20 rounded-lg overflow-hidden">
      <ComposableMap
        projectionConfig={{
          scale: 160,
          center: center,
          rotation: [-10, 0, 0],
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <ZoomableGroup center={center} zoom={zoom}>
          <Geographies geography={geoUrl} onError={() => setMapError(true)}>
            {({ geographies }) => {
              if (mapError) {
                return null;
              }

              return geographies.map((geo) => {
                const countryCode = Object.keys(countryCodeMap).find(
                  (code) => countryCodeMap[code] === geo.id,
                );
                const country = countryCode
                  ? countryData.find((c) => c.code === countryCode)
                  : null;
                const isHovered = hoveredCountry === country?.country;

                return (
                  <Geography
                    key={geo.rsmKey}
                    fill={getCountryColor(geo.id)}
                    geography={geo}
                    stroke={country ? "#1e293b" : "#e2e8f0"}
                    strokeWidth={country ? (isHovered ? 2 : 1) : 0.3}
                    style={{
                      default: {
                        outline: "none",
                      },
                      hover: {
                        fill: country ? "#075985" : "#f1f5f9",
                        outline: "none",
                        cursor: country ? "pointer" : "default",
                        filter: country ? "brightness(0.9)" : "none",
                      },
                      pressed: {
                        outline: "none",
                      },
                    }}
                    onClick={() => handleCountryClick(geo)}
                    onMouseEnter={(event) =>
                      handleCountryMouseEnter(geo, event)
                    }
                    onMouseLeave={handleCountryMouseLeave}
                  />
                );
              });
            }}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip.country && (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="fixed pointer-events-none z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
          }}
        >
          <Card className="shadow-lg border-1 border-primary/20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm max-w-xs">
            <CardBody className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{tooltip.country.flag}</span>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {tooltip.country.country}
                  </p>
                  <p className="text-xs text-default-500">
                    {tooltip.country.users} users
                  </p>
                </div>
              </div>

              {/* Display sample users if available */}
              {countryUsers[tooltip.country.code] && (
                <div className="border-t border-default-200 pt-2">
                  <p className="text-xs font-medium text-default-700 mb-1">
                    Sample Users:
                  </p>
                  <div className="space-y-1">
                    {countryUsers[tooltip.country.code]
                      .slice(0, 3)
                      .map((user, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-xs"
                        >
                          <span className="font-medium text-foreground">
                            {user.name}
                          </span>
                          <span className="text-default-500">{user.role}</span>
                        </div>
                      ))}
                    {countryUsers[tooltip.country.code].length > 3 && (
                      <p className="text-xs text-default-400 italic">
                        +{countryUsers[tooltip.country.code].length - 3} more...
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4">
        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <CardBody className="p-3">
            <p className="text-xs font-semibold text-foreground mb-2">
              User Distribution
            </p>
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-100 rounded" />
                <span className="text-default-600">Very Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-300 rounded" />
                <span className="text-default-600">Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span className="text-default-600">Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-700 rounded" />
                <span className="text-default-600">High</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-900 rounded" />
                <span className="text-default-600">Very High</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="flex flex-col gap-2">
          <Button
            isIconOnly
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
            color="primary"
            disabled={zoom >= 4}
            size="sm"
            variant="flat"
            onPress={handleZoomIn}
          >
            <Icon icon="solar:add-linear" width={16} />
          </Button>
          <Button
            isIconOnly
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
            color="primary"
            disabled={zoom <= 0.5}
            size="sm"
            variant="flat"
            onPress={handleZoomOut}
          >
            <Icon icon="solar:minus-linear" width={16} />
          </Button>
          <Button
            isIconOnly
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
            color="secondary"
            size="sm"
            variant="flat"
            onPress={handleResetZoom}
          >
            <Icon icon="solar:refresh-linear" width={16} />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute top-4 right-4 space-y-2">
        <Chip color="primary" size="sm" variant="flat">
          🌍 {countryData.length} Countries
        </Chip>
        <Chip color="success" size="sm" variant="flat">
          👥 {countryData.reduce((sum, c) => sum + c.users, 0)} Total Users
        </Chip>
        <Chip color="warning" size="sm" variant="flat">
          🔍 Zoom: {Math.round(zoom * 100)}%
        </Chip>
      </div>
    </div>
  );
};
