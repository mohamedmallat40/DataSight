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

        // Create clean, minimal icons
        const CustomIcon = L.icon({
          iconUrl:
            "data:image/svg+xml;base64," +
            btoa(`
            <svg width="24" height="36" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.4 0 0 5.4 0 12C0 21 12 36 12 36S24 21 24 12C24 5.4 18.6 0 12 0Z" fill="#006FEE"/>
              <circle cx="12" cy="12" r="6" fill="white"/>
              <circle cx="12" cy="12" r="3" fill="#006FEE"/>
            </svg>
          `),
          iconSize: [24, 36],
          iconAnchor: [12, 36],
          popupAnchor: [0, -36],
        });

        const FallbackIcon = L.icon({
          iconUrl:
            "data:image/svg+xml;base64," +
            btoa(`
            <svg width="24" height="36" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.4 0 0 5.4 0 12C0 21 12 36 12 36S24 21 24 12C24 5.4 18.6 0 12 0Z" fill="#71717A"/>
              <circle cx="12" cy="12" r="6" fill="white"/>
              <circle cx="12" cy="12" r="3" fill="#71717A"/>
            </svg>
          `),
          iconSize: [24, 36],
          iconAnchor: [12, 36],
          popupAnchor: [0, -36],
        });

        // Initialize map with enhanced styling
        const map = L.map(mapRef.current, {
          zoomControl: false,
          attributionControl: false,
        }).setView([coordinates.lat, coordinates.lng], zoom);

        // Add custom zoom control
        L.control
          .zoom({
            position: "topright",
          })
          .addTo(map);

        // Add custom attribution
        L.control
          .attribution({
            position: "bottomright",
            prefix: false,
          })
          .addTo(map);

        // Add tile layer with better styling
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
          maxZoom: 19,
          className: "map-tiles",
        }).addTo(map);

        // Add marker with animation
        const marker = L.marker([coordinates.lat, coordinates.lng], {
          icon: isPrecise ? CustomIcon : FallbackIcon,
          riseOnHover: true,
        }).addTo(map);

        // Clean popup styling
        const popupContent = `
          <div style="
            font-family: inherit;
            padding: 12px;
            max-width: 200px;
          ">
            <div style="
              font-weight: 600;
              font-size: 14px;
              color: #18181b;
              margin-bottom: 4px;
            ">${contactName || "Location"}</div>
            <div style="
              color: #71717a;
              font-size: 12px;
              line-height: 1.4;
              margin-bottom: 8px;
            ">${address}</div>
            <div style="
              font-size: 10px;
              color: #a1a1aa;
              font-weight: 500;
            ">
              ${isPrecise ? "Precise location" : "Approximate area"}
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          closeButton: true,
          autoClose: false,
          className: "custom-popup",
        });

        // Add a subtle circle for approximate locations
        if (!isPrecise) {
          L.circle([coordinates.lat, coordinates.lng], {
            color: "#71717a",
            fillColor: "#a1a1aa",
            fillOpacity: 0.1,
            radius: 500,
            weight: 1,
            dashArray: "3, 3",
          }).addTo(map);
        }

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
