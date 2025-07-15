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
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([0, 20]);

  // Get color intensity based on user count
  const getCountryColor = (geoId: string) => {
    const countryCode = Object.keys(countryCodeMap).find(
      (code) => countryCodeMap[code] === geoId,
    );

    if (!countryCode) return "#e5e7eb";

    const country = countryData.find((c) => c.code === countryCode);
    if (!country) return "#e5e7eb";

    const maxUsers = Math.max(...countryData.map((c) => c.users));
    const intensity = country.users / maxUsers;

    // Blue gradient based on user density
    const blues = [
      "#dbeafe", // Very light blue
      "#bfdbfe", // Light blue
      "#93c5fd", // Medium light blue
      "#60a5fa", // Medium blue
      "#3b82f6", // Blue
      "#2563eb", // Dark blue
      "#1d4ed8", // Very dark blue
    ];

    const colorIndex = Math.min(
      Math.floor(intensity * blues.length),
      blues.length - 1,
    );
    return blues[colorIndex];
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
    setZoom(1);
    setCenter([0, 20]);
  };

  // Show fallback if map fails to load
  if (mapError) {
    return (
      <div className="relative w-full h-[500px] bg-gradient-to-br from-blue-50 to-slate-100 dark:from-blue-950/20 dark:to-slate-900/20 rounded-lg overflow-hidden flex items-center justify-center">
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
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                    style={{
                      default: {
                        outline: "none",
                      },
                      hover: {
                        fill: country ? "#1d4ed8" : "#e5e7eb",
                        outline: "none",
                        strokeWidth: isHovered ? 1.5 : 0.5,
                        cursor: country ? "pointer" : "default",
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

            const markerSize = 4 + (country.users / maxUsers) * 8; // Size based on user count

            return (
              <Marker key={country.code} coordinates={coordinates}>
                <motion.g
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: Math.random() * 0.5 }}
                >
                  <circle
                    r={markerSize}
                    fill="#1d4ed8"
                    stroke="#ffffff"
                    strokeWidth={2}
                    className="drop-shadow-sm"
                  />
                  <text
                    textAnchor="middle"
                    y={4}
                    fontSize="10"
                    fill="white"
                    fontWeight="bold"
                  >
                    {country.users}
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
