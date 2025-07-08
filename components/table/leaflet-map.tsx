"use client";

import React, { useEffect, useRef, useState } from "react";
import { Coordinates } from "@/utils/geocoding";

interface LeafletMapProps {
  coordinates: Coordinates;
  zoom?: number;
  height?: string;
  contactName?: string;
  address: string;
  isPrecise?: boolean;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  coordinates,
  zoom = 16,
  height = "320px",
  contactName,
  address,
  isPrecise = true,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    const loadMap = async () => {
      try {
        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          link.integrity =
            "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
          link.crossOrigin = "";
          document.head.appendChild(link);
        }

        // Dynamically import Leaflet
        const L = (await import("leaflet")).default;

        // Fix default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        // Create custom icons
        const CustomIcon = L.icon({
          iconUrl:
            "data:image/svg+xml;base64," +
            btoa(`
            <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="#006FEE"/>
              <circle cx="12.5" cy="12.5" r="6" fill="white"/>
              <circle cx="12.5" cy="12.5" r="3" fill="#006FEE"/>
            </svg>
          `),
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });

        const FallbackIcon = L.icon({
          iconUrl:
            "data:image/svg+xml;base64," +
            btoa(`
            <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="#F5A524"/>
              <circle cx="12.5" cy="12.5" r="6" fill="white"/>
              <circle cx="12.5" cy="12.5" r="3" fill="#F5A524"/>
            </svg>
          `),
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });

        // Initialize map
        const map = L.map(mapRef.current).setView(
          [coordinates.lat, coordinates.lng],
          zoom,
        );

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Add marker
        const marker = L.marker([coordinates.lat, coordinates.lng], {
          icon: isPrecise ? CustomIcon : FallbackIcon,
        }).addTo(map);

        // Add popup
        const popupContent = `
          <div style="font-size: 14px;">
            <div style="font-weight: 600; margin-bottom: 4px;">${contactName || "Location"}</div>
            <div style="color: #666; margin-bottom: 4px;">${address}</div>
            ${
              !isPrecise
                ? '<div style="color: #f59e0b; font-size: 12px;">📍 Approximate location</div>'
                : '<div style="color: #10b981; font-size: 12px;">📍 Precise location</div>'
            }
          </div>
        `;

        marker.bindPopup(popupContent);

        mapInstance.current = map;
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load map:", error);
      }
    };

    loadMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, [coordinates, zoom, contactName, address, isPrecise]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height,
        borderRadius: "8px",
        overflow: "hidden",
      }}
      className="relative"
    />
  );
};

export default LeafletMap;
