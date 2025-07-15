"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, Avatar, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";

import { CountryStats, User, getUsersByCountry } from "@/data/users-by-country";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface WorldMapProps {
  countryStats: CountryStats[];
  onCountryHover: (country: string | null) => void;
  hoveredCountry: string | null;
}

// Custom marker icon
const createCustomIcon = (userCount: number) => {
  const size = Math.min(Math.max(userCount * 8, 20), 50);
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background: linear-gradient(135deg, #006FEE, #7828C8);
        border: 3px solid white;
        border-radius: 50%;
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${Math.max(size / 3, 10)}px;
        box-shadow: 0 4px 12px rgba(0, 111, 238, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
      ">${userCount}</div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// User card component for hover
const UserCard = ({ user }: { user: User }) => (
  <Card className="w-72 shadow-lg border-1 border-primary/20">
    <CardBody className="p-4">
      <div className="flex items-center gap-3">
        <Avatar
          src={user.avatar}
          alt={user.name}
          size="md"
          className="flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate">
            {user.name}
          </h4>
          <p className="text-sm text-default-500 truncate">{user.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <Chip size="sm" variant="flat" color="primary" className="text-xs">
              {user.role}
            </Chip>
            <span className="text-xs text-default-400">
              {new Date(user.joinDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </CardBody>
  </Card>
);

// Animated user cards component
const AnimatedUserCards = ({ users }: { users: User[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (users.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % users.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [users.length]);

  if (users.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[1000] pointer-events-none">
      <div
        key={currentIndex}
        className="animate-in slide-in-from-right-4 fade-in duration-500"
      >
        <UserCard user={users[currentIndex]} />
      </div>
    </div>
  );
};

export const WorldMap = ({
  countryStats,
  onCountryHover,
  hoveredCountry,
}: WorldMapProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
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
    );
  }

  const hoveredUsers = hoveredCountry ? getUsersByCountry(hoveredCountry) : [];

  return (
    <div className="relative">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "500px", width: "100%" }}
        className="rounded-lg z-0"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {countryStats.map((country) => (
          <Marker
            key={country.country}
            position={[country.lat, country.lng]}
            icon={createCustomIcon(country.userCount)}
            eventHandlers={{
              mouseover: () => onCountryHover(country.country),
              mouseout: () => onCountryHover(null),
            }}
          >
            <Popup>
              <div className="text-center p-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{country.flag}</span>
                  <h3 className="font-semibold">{country.country}</h3>
                </div>
                <p className="text-sm text-default-600">
                  {country.userCount}{" "}
                  {country.userCount === 1 ? "user" : "users"}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Animated user cards on hover */}
      <AnimatedUserCards users={hoveredUsers} />
    </div>
  );
};
