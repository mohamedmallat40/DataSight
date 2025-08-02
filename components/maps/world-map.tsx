"use client";

import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";

import { CountryStats } from "@/data/users-by-country";

interface WorldMapProps {
  countryStats: CountryStats[];
  onCountryHover: (country: string | null) => void;
  hoveredCountry: string | null;
}

// Dynamically import the ClientMap component with no SSR
const ClientMap = dynamic(
  () => import("./client-map").then((mod) => ({ default: mod.ClientMap })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-content1 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Icon
            className="text-primary mx-auto mb-2"
            icon="solar:map-linear"
            width={48}
          />
          <p className="text-default-500">Loading world map...</p>
        </div>
      </div>
    ),
  },
);

export const WorldMap = (props: WorldMapProps) => {
  return <ClientMap {...props} />;
};
