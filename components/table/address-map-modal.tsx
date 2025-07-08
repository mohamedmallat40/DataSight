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

// Dynamically import our custom map component to avoid SSR issues
const LeafletMap = dynamic(() => import("./leaflet-map"), { ssr: false });

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
    const encodedAddress = encodeURIComponent(fullAddress);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
  };

  // Open in Apple Maps
  const openInAppleMaps = () => {
    const encodedAddress = encodeURIComponent(fullAddress);
    const appleMapsUrl = `https://maps.apple.com/?q=${encodedAddress}`;
    window.open(appleMapsUrl, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (isOpen && city && country) {
      setIsLoadingMap(true);
      setMapError(false);
      setCoordinates(null);
      setGeocodeSource(null);

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
      size="4xl"
      classNames={{
        base: "bg-background",
        header: "border-b border-default-200",
        footer: "border-t border-default-200",
        body: "p-0",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 p-6">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Icon
                      icon="solar:map-point-bold"
                      className="w-5 h-5 text-white"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Location
                    </h3>
                    {contactName && (
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="solar:user-bold"
                          className="w-3 h-3 text-emerald-500"
                        />
                        <p className="text-sm text-default-500">
                          {contactName}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isLoadingMap && coordinates && (
                    <Chip
                      size="sm"
                      variant="flat"
                      color={geocodeSource === "api" ? "success" : "warning"}
                      startContent={
                        <Icon
                          icon={
                            geocodeSource === "api"
                              ? "solar:check-circle-bold"
                              : "solar:info-circle-bold"
                          }
                          className="w-3 h-3"
                        />
                      }
                    >
                      {geocodeSource === "api" ? "Precise" : "Approximate"}
                    </Chip>
                  )}
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                {/* Address Information Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                  <Card>
                    <CardBody className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-md flex items-center justify-center">
                            <Icon
                              icon="solar:home-bold"
                              className="w-3 h-3 text-white"
                            />
                          </div>
                          <h4 className="font-medium text-foreground">
                            Address
                          </h4>
                        </div>

                        <div className="p-3 bg-default-50 rounded-lg border-l-3 border-orange-400">
                          <p className="text-sm text-default-700 leading-relaxed">
                            {fullAddress}
                          </p>
                        </div>

                        {/* Location Details with Icons */}
                        {(city || state || postal_code || country) && (
                          <div className="grid grid-cols-2 gap-2">
                            {city && (
                              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md">
                                <Icon
                                  icon="solar:buildings-bold"
                                  className="w-3 h-3 text-blue-600"
                                />
                                <span className="text-xs text-blue-700 font-medium">
                                  {city}
                                </span>
                              </div>
                            )}
                            {state && (
                              <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-md">
                                <Icon
                                  icon="solar:map-bold"
                                  className="w-3 h-3 text-purple-600"
                                />
                                <span className="text-xs text-purple-700 font-medium">
                                  {state}
                                </span>
                              </div>
                            )}
                            {postal_code && (
                              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-md">
                                <Icon
                                  icon="solar:letter-bold"
                                  className="w-3 h-3 text-green-600"
                                />
                                <span className="text-xs text-green-700 font-medium">
                                  {postal_code}
                                </span>
                              </div>
                            )}
                            {country && (
                              <div className="flex items-center gap-2 p-2 bg-indigo-50 rounded-md">
                                <Icon
                                  icon="solar:globe-bold"
                                  className="w-3 h-3 text-indigo-600"
                                />
                                <span className="text-xs text-indigo-700 font-medium">
                                  {country}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-2">
                          <Button
                            size="sm"
                            variant="flat"
                            fullWidth
                            className="justify-start"
                            startContent={
                              <Icon
                                icon="solar:copy-outline"
                                className="w-4 h-4"
                              />
                            }
                            onPress={copyAddress}
                          >
                            Copy Address
                          </Button>

                          <Button
                            size="sm"
                            variant="flat"
                            fullWidth
                            className="justify-start"
                            startContent={
                              <Icon
                                icon="solar:global-outline"
                                className="w-4 h-4"
                              />
                            }
                            onPress={openInGoogleMaps}
                          >
                            Open in Maps
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Coordinates Info */}
                  {coordinates && !isLoadingMap && (
                    <Card>
                      <CardBody className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Icon
                            icon="solar:target-outline"
                            className="w-4 h-4 text-default-500"
                          />
                          <h5 className="font-medium text-foreground">
                            Coordinates
                          </h5>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-default-500">Lat:</span>
                            <span className="font-mono text-default-700">
                              {coordinates.lat.toFixed(4)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-default-500">Lng:</span>
                            <span className="font-mono text-default-700">
                              {coordinates.lng.toFixed(4)}
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  )}
                </div>

                {/* Map Container */}
                <div className="lg:col-span-2">
                  <Card className="h-full">
                    <CardBody className="p-0 h-full">
                      <div className="relative w-full h-full bg-default-50 rounded-lg overflow-hidden min-h-[500px]">
                        {isLoadingMap && (
                          <div className="absolute inset-0 flex items-center justify-center bg-default-50 z-10">
                            <div className="flex flex-col items-center gap-3">
                              <Spinner size="lg" />
                              <div className="text-center">
                                <p className="text-sm font-medium text-foreground">
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
                            <LeafletMap
                              coordinates={coordinates}
                              zoom={geocodeSource === "api" ? 16 : 12}
                              height="100%"
                              contactName={contactName}
                              address={fullAddress}
                              isPrecise={geocodeSource === "api"}
                            />
                          </div>
                        )}

                        {mapError && (
                          <div className="absolute inset-0 flex items-center justify-center bg-default-100">
                            <div className="text-center p-8">
                              <Icon
                                icon="solar:map-point-remove-outline"
                                className="w-12 h-12 text-default-400 mx-auto mb-4"
                              />
                              <h4 className="font-medium text-foreground mb-2">
                                Unable to load map
                              </h4>
                              <p className="text-sm text-default-500 mb-4">
                                Please try opening in external map app
                              </p>
                              <Button
                                variant="flat"
                                size="sm"
                                startContent={
                                  <Icon
                                    icon="solar:refresh-outline"
                                    className="w-4 h-4"
                                  />
                                }
                                onPress={() => window.location.reload()}
                              >
                                Try Again
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              {coordinates && (
                <Button
                  color="primary"
                  onPress={() => {
                    const shareData = {
                      title: `Location: ${contactName || "Address"}`,
                      text: fullAddress,
                      url: `https://www.openstreetmap.org/?mlat=${coordinates.lat}&mlon=${coordinates.lng}&zoom=16`,
                    };
                    if (navigator.share) {
                      navigator.share(shareData);
                    } else {
                      navigator.clipboard.writeText(shareData.url);
                    }
                  }}
                >
                  Share
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

AddressMapModal.displayName = "AddressMapModal";
