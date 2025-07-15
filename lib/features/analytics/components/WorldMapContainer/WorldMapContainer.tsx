"use client";

import { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";

import { useAnalytics, useCountryUsers } from "../../hooks/useAnalytics";
import { UserList } from "../UserList/UserList";

// Dynamically import map component to avoid SSR issues
const WorldMapSVG = dynamic(
  () =>
    import("../WorldMapSVG/WorldMapSVG").then((mod) => ({
      default: mod.WorldMapSVG,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-content1 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Icon
            icon="solar:map-linear"
            className="text-primary mx-auto mb-2"
            width={48}
          />
          <p className="text-default-500">Loading world map...</p>
        </div>
      </div>
    ),
  },
);

export function WorldMapContainer() {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const { data: analyticsData, loading, error } = useAnalytics();
  const { users: hoveredUsers } = useCountryUsers(hoveredCountry);

  if (loading) {
    return (
      <Card>
        <CardBody className="h-[500px] flex items-center justify-center">
          <div className="text-center">
            <Icon
              icon="solar:loading-linear"
              className="text-primary mx-auto mb-2 animate-spin"
              width={48}
            />
            <p className="text-default-500">Loading analytics data...</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardBody className="h-[500px] flex items-center justify-center">
          <div className="text-center">
            <Icon
              icon="solar:danger-triangle-linear"
              className="text-danger mx-auto mb-2"
              width={48}
            />
            <p className="text-danger">Failed to load analytics data</p>
            <p className="text-default-500 text-sm">{error}</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!analyticsData) {
    return null;
  }

  return (
    <div className="relative">
      <Card>
        <CardBody className="p-0">
          <WorldMapSVG
            countryStats={analyticsData.countryStats}
            onCountryHover={setHoveredCountry}
            hoveredCountry={hoveredCountry}
          />
        </CardBody>
      </Card>

      {hoveredCountry && hoveredUsers.length > 0 && (
        <UserList users={hoveredUsers} country={hoveredCountry} />
      )}
    </div>
  );
}
