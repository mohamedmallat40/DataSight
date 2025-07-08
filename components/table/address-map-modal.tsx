import React, { useEffect, useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Spinner,
  Chip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";
import { smartGeocode, type Coordinates } from "@/utils/geocoding";
import { CustomIcon, FallbackIcon, initLeaflet } from "@/utils/leaflet-config";

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface AddressMapModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  address: string;
  street?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
  contactName?: string;
}

export const AddressMapModal: React.FC<AddressMapModalProps> = ({
  isOpen,
  onOpenChange,
  address,
  street,
  city,
  state,
  postal_code,
  country,
  contactName,
}) => {
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [mapError, setMapError] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [geocodeSource, setGeocodeSource] = useState<"api" | "fallback" | null>(
    null,
  );
  const mapRef = useRef<any>(null);

  // Combine all address components into a full address
  const fullAddress = [address || street, city, state, postal_code, country]
    .filter(Boolean)
    .join(", ");

  // Default coordinates (centered on Europe)
  const defaultCoords: Coordinates = { lat: 50.1109, lng: 8.6821 };

  // Copy address to clipboard
  const copyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
  };

  // Open in Google Maps
  const openInGoogleMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
  };

  // Open in Apple Maps
  const openInAppleMaps = () => {
    const appleMapsUrl = `https://maps.apple.com/?q=${encodedAddress}`;
    window.open(appleMapsUrl, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (isOpen && city && country) {
      setIsLoadingMap(true);
      setMapError(false);
      setCoordinates(null);
      setGeocodeSource(null);

      // Initialize Leaflet configuration
      initLeaflet();

      const geocodeAddress = async () => {
        try {
          const result = await smartGeocode(fullAddress, city, country);
          if (result) {
            setCoordinates(result.coordinates);
            setGeocodeSource(result.source);
          } else {
            // Use default coordinates if geocoding fails completely
            setCoordinates(defaultCoords);
            setGeocodeSource("fallback");
          }
        } catch (error) {
          console.error("Geocoding failed:", error);
          setMapError(true);
          setCoordinates(defaultCoords);
          setGeocodeSource("fallback");
        } finally {
          setIsLoadingMap(false);
        }
      };

      // Add a small delay to show loading state
      const timer = setTimeout(geocodeAddress, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, fullAddress, city, country]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      classNames={{
        base: "bg-background",
        header: "border-b border-default-200",
        footer: "border-t border-default-200",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Icon
                    icon="solar:map-point-outline"
                    className="w-6 h-6 text-primary-600"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Location</h3>
                  {contactName && (
                    <p className="text-sm text-default-500">{contactName}</p>
                  )}
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="px-6 py-4">
              <div className="space-y-4">
                {/* Address Information */}
                <Card>
                  <CardBody className="p-4">
                    <div className="flex items-start gap-3">
                      <Icon
                        icon="solar:home-outline"
                        className="w-5 h-5 text-default-500 mt-0.5"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-default-700 mb-2">
                          Address
                        </h4>
                        <p className="text-sm text-default-600 leading-relaxed">
                          {fullAddress}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            startContent={
                              <Icon
                                icon="solar:copy-outline"
                                className="w-4 h-4"
                              />
                            }
                            onPress={copyAddress}
                          >
                            Copy
                          </Button>
                          <Chip size="sm" variant="flat" color="default">
                            <Icon
                              icon="solar:map-point-outline"
                              className="w-3 h-3 mr-1"
                            />
                            {city}, {country}
                          </Chip>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Map Container */}
                <Card>
                  <CardBody className="p-0">
                    <div className="relative w-full h-80 bg-default-50 rounded-lg overflow-hidden">
                      {isLoadingMap && (
                        <div className="absolute inset-0 flex items-center justify-center bg-default-50 z-10">
                          <div className="flex flex-col items-center gap-3">
                            <div className="relative">
                              <Spinner size="lg" color="primary" />
                              <div className="absolute inset-0 animate-ping">
                                <Spinner
                                  size="lg"
                                  color="primary"
                                  className="opacity-20"
                                />
                              </div>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium text-default-700">
                                Loading map...
                              </p>
                              <p className="text-xs text-default-500">
                                Locating address
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {!isLoadingMap && !mapError && coordinates && (
                        <div className="w-full h-full relative">
                          <MapContainer
                            ref={mapRef}
                            center={[coordinates.lat, coordinates.lng]}
                            zoom={geocodeSource === "api" ? 16 : 12}
                            className="w-full h-full rounded-lg"
                            style={{ minHeight: "320px" }}
                          >
                            <TileLayer
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker
                              position={[coordinates.lat, coordinates.lng]}
                              icon={
                                geocodeSource === "api"
                                  ? CustomIcon
                                  : FallbackIcon
                              }
                            >
                              <Popup>
                                <div className="text-sm">
                                  <div className="font-semibold mb-1">
                                    {contactName}
                                  </div>
                                  <div className="text-gray-600">
                                    {fullAddress}
                                  </div>
                                  {geocodeSource === "fallback" && (
                                    <div className="text-xs text-orange-500 mt-1">
                                      📍 Approximate location
                                    </div>
                                  )}
                                  {geocodeSource === "api" && (
                                    <div className="text-xs text-green-600 mt-1">
                                      📍 Precise location
                                    </div>
                                  )}
                                </div>
                              </Popup>
                            </Marker>
                          </MapContainer>

                          {geocodeSource === "fallback" && (
                            <div className="absolute top-2 right-2 z-[1000]">
                              <Chip size="sm" color="warning" variant="flat">
                                <Icon
                                  icon="solar:info-circle-outline"
                                  className="w-3 h-3 mr-1"
                                />
                                Approximate
                              </Chip>
                            </div>
                          )}
                        </div>
                      )}

                      {mapError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-danger-50">
                          <div className="text-center">
                            <Icon
                              icon="solar:map-point-remove-outline"
                              className="w-12 h-12 text-danger-400 mx-auto mb-2"
                            />
                            <p className="text-sm font-medium text-danger-700">
                              Unable to load map
                            </p>
                            <p className="text-xs text-danger-500">
                              Please try opening in external map app
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="flat"
                    color="primary"
                    startContent={
                      <Icon
                        icon="simple-icons:googlemaps"
                        className="w-4 h-4"
                      />
                    }
                    onPress={openInGoogleMaps}
                  >
                    Open in Google Maps
                  </Button>
                  <Button
                    variant="flat"
                    color="default"
                    startContent={
                      <Icon icon="simple-icons:apple" className="w-4 h-4" />
                    }
                    onPress={openInAppleMaps}
                  >
                    Open in Apple Maps
                  </Button>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

AddressMapModal.displayName = "AddressMapModal";
