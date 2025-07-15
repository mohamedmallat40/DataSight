"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";

interface CountryData {
  country: string;
  code: string;
  users: number;
  flag: string;
}

interface SVGWorldMapProps {
  countryData: CountryData[];
  onCountryHover?: (country: string | null) => void;
  hoveredCountry?: string | null;
}

// Simplified world map paths for key countries
const countryPaths = {
  US: "M200 230L240 220L280 225L320 240L340 260L330 290L300 310L250 315L200 300L180 280L185 250Z",
  SA: "M520 280L580 275L600 290L595 320L570 335L540 330L525 310L520 280Z",
  GB: "M450 180L465 175L470 185L460 195L445 190L450 180Z",
  DE: "M480 190L500 185L510 200L505 215L485 210L480 190Z",
  FR: "M460 200L485 195L490 220L470 225L455 215L460 200Z",
  JP: "M720 240L740 235L750 250L745 270L725 265L720 240Z",
  CA: "M180 150L280 140L350 160L340 190L280 200L200 195L180 150Z",
  AU: "M680 380L720 375L750 390L745 420L710 425L680 410L680 380Z",
  BR: "M280 340L320 335L340 360L330 400L300 415L270 400L280 340Z",
  IN: "M580 260L620 255L635 280L625 310L590 315L580 260Z",
  CN: "M620 200L680 195L700 220L690 250L650 255L620 200Z",
  RU: "M500 120L650 115L700 140L680 180L520 185L500 120Z",
};

export const SVGWorldMap = ({
  countryData,
  onCountryHover,
  hoveredCountry,
}: SVGWorldMapProps) => {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    country: CountryData | null;
  }>({
    x: 0,
    y: 0,
    country: null,
  });

  // Get color intensity based on user count
  const getCountryColor = (countryCode: string) => {
    const country = countryData.find((c) => c.code === countryCode);
    if (!country) return "#e5e7eb"; // Default gray for countries without data

    const maxUsers = Math.max(...countryData.map((c) => c.users));
    const intensity = country.users / maxUsers;

    // Create color gradient from light blue to dark blue
    const baseColor = [59, 130, 246]; // Blue color
    const opacity = 0.3 + intensity * 0.7; // 30% to 100% opacity

    return `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${opacity})`;
  };

  const handleCountryMouseEnter = (
    countryCode: string,
    event: React.MouseEvent,
  ) => {
    const country = countryData.find((c) => c.code === countryCode);
    if (country) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltip({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        country,
      });
      onCountryHover?.(country.country);
    }
  };

  const handleCountryMouseLeave = () => {
    setTooltip({ x: 0, y: 0, country: null });
    onCountryHover?.(null);
  };

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-blue-50 to-slate-100 dark:from-blue-950/20 dark:to-slate-900/20 rounded-lg overflow-hidden">
      <svg
        viewBox="0 0 900 500"
        className="w-full h-full"
        style={{ backgroundColor: "#f8fafc" }}
      >
        {/* Ocean background */}
        <rect width="900" height="500" fill="#e0f2fe" />

        {/* Grid lines for geography reference */}
        <defs>
          <pattern
            id="grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect width="900" height="500" fill="url(#grid)" />

        {/* Countries */}
        {Object.entries(countryPaths).map(([countryCode, path]) => {
          const country = countryData.find((c) => c.code === countryCode);
          const isHovered = hoveredCountry === country?.country;

          return (
            <motion.path
              key={countryCode}
              d={path}
              fill={getCountryColor(countryCode)}
              stroke="#1e293b"
              strokeWidth={isHovered ? 2 : 1}
              className="cursor-pointer transition-all duration-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.random() * 0.5 }}
              whileHover={{
                scale: 1.05,
                filter: "brightness(1.1)",
              }}
              onMouseEnter={(e) => handleCountryMouseEnter(countryCode, e)}
              onMouseLeave={handleCountryMouseLeave}
            />
          );
        })}

        {/* Country labels for major countries */}
        {countryData.slice(0, 6).map((country) => {
          const paths = countryPaths[country.code as keyof typeof countryPaths];
          if (!paths) return null;

          // Extract rough center coordinates from path (simplified)
          const coords = {
            US: { x: 260, y: 270 },
            SA: { x: 560, y: 300 },
            GB: { x: 458, y: 185 },
            DE: { x: 495, y: 200 },
            FR: { x: 475, y: 212 },
            JP: { x: 735, y: 252 },
            CA: { x: 265, y: 175 },
            AU: { x: 715, y: 400 },
          };

          const coord = coords[country.code as keyof typeof coords];
          if (!coord) return null;

          return (
            <g key={`label-${country.code}`}>
              <circle
                cx={coord.x}
                cy={coord.y}
                r="8"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={coord.x}
                y={coord.y + 4}
                textAnchor="middle"
                fill="white"
                fontSize="10"
                fontWeight="bold"
              >
                {country.users}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {tooltip.country && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute pointer-events-none z-10"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
          }}
        >
          <Card className="shadow-lg border-1 border-primary/20 bg-content1/95 backdrop-blur-sm">
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
              <div className="w-4 h-3 bg-blue-200 rounded"></div>
              <span className="text-default-600">Low</span>
              <div className="w-4 h-3 bg-blue-400 rounded"></div>
              <span className="text-default-600">Medium</span>
              <div className="w-4 h-3 bg-blue-600 rounded"></div>
              <span className="text-default-600">High</span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Regional summary chips */}
      <div className="absolute top-4 right-4 space-y-2">
        <Chip color="primary" variant="flat" size="sm">
          🌍 {countryData.length} Countries
        </Chip>
        <Chip color="success" variant="flat" size="sm">
          👥 {countryData.reduce((sum, c) => sum + c.users, 0)} Total Users
        </Chip>
      </div>
    </div>
  );
};
