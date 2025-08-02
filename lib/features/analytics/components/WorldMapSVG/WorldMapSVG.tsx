"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Icon } from "@iconify/react";

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

interface CountryStats {
  country: string;
  countryCode: string;
  userCount: number;
}

interface WorldMapSVGProps {
  countryStats: CountryStats[];
  onCountryHover: (country: string | null) => void;
  hoveredCountry: string | null;
}

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
          onError={() => setMapError(true)}
          onLoad={() => setMapLoading(false)}
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
        </ComposableMap>
      </div>

      {mapLoading && (
        <div className="absolute inset-0 bg-content1 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Icon
              className="text-primary mx-auto mb-2 animate-spin"
              icon="solar:loading-linear"
              width={48}
            />
            <p className="text-default-500">Loading world map...</p>
          </div>
        </div>
      )}
    </div>
  );
};
