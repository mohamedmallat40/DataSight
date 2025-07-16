"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
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

// Coordinates for country markers (approximate centers)
const countryCoordinates: Record<string, [number, number]> = {
  US: [-95.7, 37.1],
  SA: [45.0, 24.0],
  GB: [-2.0, 54.0],
  DE: [10.0, 51.0],
  FR: [2.0, 46.0],
  JP: [138.0, 36.0],
  CA: [-106.0, 56.0],
  AU: [133.0, -27.0],
  BR: [-55.0, -10.0],
  IN: [78.0, 20.0],
  CN: [104.0, 35.0],
  RU: [105.0, 61.0],
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
  const [center, setCenter] = useState<[number, number]>([0, 20]);

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

  const maxUsers = Math.max(...countryData.map((c) => c.users));

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
    setCenter([0, 20]);
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 dark:bg-slate-800/90 p-3 rounded-lg text-center cursor-pointer hover:scale-105 transition-transform"
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
          scale: 147,
          center: center,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <ZoomableGroup zoom={zoom} center={center}>
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
                    geography={geo}
                    fill={getCountryColor(geo.id)}
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

          {/* Country markers with user counts */}
          {countryData.map((country) => {
            const coordinates = countryCoordinates[country.code];
            if (!coordinates) return null;

            const maxUsers = Math.max(...countryData.map((c) => c.users));
            const intensity = country.users / maxUsers;

            // More proportional markers
            const baseSize = 6;
            const markerSize = baseSize + intensity * 8; // Size 6-14 based on user count
            const fontSize = Math.max(8, 6 + intensity * 4); // Font size 6-10

            // Dynamic colors based on intensity
            const markerColor =
              intensity > 0.7
                ? "#dc2626" // Red for high
                : intensity > 0.4
                  ? "#ea580c" // Orange for medium
                  : "#2563eb"; // Blue for low

            return (
              <Marker key={country.code} coordinates={coordinates}>
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: Math.random() * 0.8, duration: 0.6 }}
                  whileHover={{ scale: 1.2 }}
                  className="cursor-pointer"
                >
                  {/* Outer glow ring */}
                  <circle
                    r={markerSize + 3}
                    fill={markerColor}
                    opacity="0.3"
                    className="animate-pulse"
                  />
                  {/* Main marker circle */}
                  <circle
                    r={markerSize}
                    fill={markerColor}
                    stroke="#ffffff"
                    strokeWidth={3}
                    className="drop-shadow-lg"
                  />
                  {/* Inner white circle for better number contrast */}
                  <circle
                    r={markerSize - 2}
                    fill="rgba(255, 255, 255, 0.9)"
                    stroke="none"
                  />
                  {/* User count text */}
                  <text
                    textAnchor="middle"
                    y={fontSize * 0.35}
                    fontSize={fontSize}
                    fill={markerColor}
                    fontWeight="bold"
                    className="select-none"
                    style={{ textShadow: "0 0 3px rgba(255,255,255,0.8)" }}
                  >
                    {country.users}
                  </text>
                  {/* Country flag below marker */}
                  <text
                    textAnchor="middle"
                    y={markerSize + 18}
                    fontSize="14"
                    className="select-none"
                  >
                    {country.flag}
                  </text>
                </motion.g>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip.country && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed pointer-events-none z-50"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
          }}
        >
          <Card className="shadow-lg border-1 border-primary/20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
            <CardBody className="p-3">
              <div className="flex items-center gap-2">
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
                <div className="w-3 h-3 bg-blue-200 rounded"></div>
                <span className="text-default-600">Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-400 rounded"></div>
                <span className="text-default-600">Med</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span className="text-default-600">High</span>
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
            size="sm"
            variant="flat"
            color="primary"
            onPress={handleZoomIn}
            disabled={zoom >= 4}
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
          >
            <Icon icon="solar:add-linear" width={16} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            color="primary"
            onPress={handleZoomOut}
            disabled={zoom <= 0.5}
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
          >
            <Icon icon="solar:minus-linear" width={16} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            color="secondary"
            onPress={handleResetZoom}
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
          >
            <Icon icon="solar:refresh-linear" width={16} />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute top-4 right-4 space-y-2">
        <Chip color="primary" variant="flat" size="sm">
          🌍 {countryData.length} Countries
        </Chip>
        <Chip color="success" variant="flat" size="sm">
          👥 {countryData.reduce((sum, c) => sum + c.users, 0)} Total Users
        </Chip>
        <Chip color="warning" variant="flat" size="sm">
          🔍 Zoom: {Math.round(zoom * 100)}%
        </Chip>
      </div>
    </div>
  );
};
