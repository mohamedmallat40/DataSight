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

        // Create enhanced custom icons with better styling
        const CustomIcon = L.icon({
          iconUrl:
            "data:image/svg+xml;base64," +
            btoa(`
            <svg width="32" height="45" viewBox="0 0 32 45" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/>
                </filter>
                <linearGradient id="gradientBlue" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#0070F3;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#006FEE;stop-opacity:1" />
                </linearGradient>
              </defs>
              <path d="M16 0C7.2 0 0 7.2 0 16C0 28 16 45 16 45S32 28 32 16C32 7.2 24.8 0 16 0Z" fill="url(#gradientBlue)" filter="url(#shadow)"/>
              <circle cx="16" cy="16" r="8" fill="white" opacity="0.9"/>
              <circle cx="16" cy="16" r="5" fill="#006FEE"/>
              <circle cx="16" cy="16" r="2" fill="white"/>
            </svg>
          `),
          iconSize: [32, 45],
          iconAnchor: [16, 45],
          popupAnchor: [0, -45],
        });

        const FallbackIcon = L.icon({
          iconUrl:
            "data:image/svg+xml;base64," +
            btoa(`
            <svg width="32" height="45" viewBox="0 0 32 45" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/>
                </filter>
                <linearGradient id="gradientOrange" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#FF8C00;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#F5A524;stop-opacity:1" />
                </linearGradient>
              </defs>
              <path d="M16 0C7.2 0 0 7.2 0 16C0 28 16 45 16 45S32 28 32 16C32 7.2 24.8 0 16 0Z" fill="url(#gradientOrange)" filter="url(#shadow)"/>
              <circle cx="16" cy="16" r="8" fill="white" opacity="0.9"/>
              <circle cx="16" cy="16" r="5" fill="#F5A524"/>
              <circle cx="16" cy="16" r="2" fill="white"/>
            </svg>
          `),
          iconSize: [32, 45],
          iconAnchor: [16, 45],
          popupAnchor: [0, -45],
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

        // Enhanced popup with better styling
        const popupContent = `
          <div style="
            font-family: system-ui, -apple-system, sans-serif;
            padding: 8px;
            max-width: 250px;
          ">
            <div style="
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 8px;
              padding-bottom: 6px;
              border-bottom: 1px solid #e5e7eb;
            ">
              <div style="
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: ${isPrecise ? "#10b981" : "#f59e0b"};
              "></div>
              <div style="
                font-weight: 600;
                font-size: 14px;
                color: #1f2937;
              ">${contactName || "Location"}</div>
            </div>
            <div style="
              color: #6b7280;
              font-size: 12px;
              line-height: 1.4;
              margin-bottom: 6px;
            ">${address}</div>
            <div style="
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 11px;
              color: ${isPrecise ? "#10b981" : "#f59e0b"};
              font-weight: 500;
            ">
              <span>${isPrecise ? "🎯" : "📍"}</span>
              ${isPrecise ? "Exact location" : "Approximate area"}
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          closeButton: true,
          autoClose: false,
          className: "custom-popup",
        });

        // Add a subtle circle to show the area
        if (!isPrecise) {
          L.circle([coordinates.lat, coordinates.lng], {
            color: "#f59e0b",
            fillColor: "#fbbf24",
            fillOpacity: 0.1,
            radius: 500,
            weight: 2,
            dashArray: "5, 5",
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
