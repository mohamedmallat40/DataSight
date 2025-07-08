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
                  <div className="w-10 h-10 bg-default-100 rounded-lg flex items-center justify-center">
                    <Icon
                      icon="solar:map-point-outline"
                      className="w-5 h-5 text-blue-600"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Location
                    </h3>
                    {contactName && (
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="solar:user-outline"
                          className="w-3 h-3 text-emerald-600"
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
                              ? "solar:check-circle-outline"
                              : "solar:info-circle-outline"
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
                          <div className="w-6 h-6 bg-default-100 rounded-md flex items-center justify-center">
                            <Icon
                              icon="solar:home-outline"
                              className="w-3 h-3 text-orange-600"
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
                              <div className="flex items-center gap-2 p-2 bg-default-50 rounded-md">
                                <Icon
                                  icon="solar:buildings-outline"
                                  className="w-3 h-3 text-blue-600"
                                />
                                <span className="text-xs text-default-700 font-medium">
                                  {city}
                                </span>
                              </div>
                            )}
                            {state && (
                              <div className="flex items-center gap-2 p-2 bg-default-50 rounded-md">
                                <Icon
                                  icon="solar:map-outline"
                                  className="w-3 h-3 text-purple-600"
                                />
                                <span className="text-xs text-default-700 font-medium">
                                  {state}
                                </span>
                              </div>
                            )}
                            {postal_code && (
                              <div className="flex items-center gap-2 p-2 bg-default-50 rounded-md">
                                <Icon
                                  icon="solar:letter-outline"
                                  className="w-3 h-3 text-green-600"
                                />
                                <span className="text-xs text-default-700 font-medium">
                                  {postal_code}
                                </span>
                              </div>
                            )}
                            {country && (
                              <div className="flex items-center gap-2 p-2 bg-default-50 rounded-md">
                                <Icon
                                  icon="solar:globe-outline"
                                  className="w-3 h-3 text-indigo-600"
                                />
                                <span className="text-xs text-default-700 font-medium">
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
                            color="primary"
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
                            color="success"
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
                          <div className="w-6 h-6 bg-default-100 rounded-md flex items-center justify-center">
                            <Icon
                              icon="solar:target-outline"
                              className="w-3 h-3 text-pink-600"
                            />
                          </div>
                          <h5 className="font-medium text-foreground">
                            Coordinates
                          </h5>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-2 bg-default-50 rounded-md">
                            <div className="flex items-center gap-2">
                              <Icon
                                icon="solar:square-arrow-up-outline"
                                className="w-3 h-3 text-pink-600"
                              />
                              <span className="text-xs text-default-700 font-medium">
                                Lat:
                              </span>
                            </div>
                            <span className="font-mono text-xs text-default-800 bg-white px-2 py-1 rounded border">
                              {coordinates.lat.toFixed(4)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-default-50 rounded-md">
                            <div className="flex items-center gap-2">
                              <Icon
                                icon="solar:square-arrow-right-outline"
                                className="w-3 h-3 text-rose-600"
                              />
                              <span className="text-xs text-default-700 font-medium">
                                Lng:
                              </span>
                            </div>
                            <span className="font-mono text-xs text-default-800 bg-white px-2 py-1 rounded border">
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
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 z-10">
                            <div className="flex flex-col items-center gap-4">
                              <div className="relative">
                                <Spinner size="lg" color="primary" />
                                <div className="absolute -top-2 -right-2">
                                  <div className="w-6 h-6 bg-default-100 rounded-full flex items-center justify-center animate-pulse border">
                                    <Icon
                                      icon="solar:map-outline"
                                      className="w-3 h-3 text-blue-600"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center gap-2 justify-center mb-1">
                                  <Icon
                                    icon="solar:radar-outline"
                                    className="w-4 h-4 text-blue-600 animate-ping"
                                  />
                                  <p className="text-sm font-medium text-foreground">
                                    Loading map...
                                  </p>
                                </div>
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
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
                            <div className="text-center p-8">
                              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Icon
                                  icon="solar:map-point-remove-bold"
                                  className="w-8 h-8 text-white"
                                />
                              </div>
                              <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2 justify-center">
                                <Icon
                                  icon="solar:danger-triangle-bold"
                                  className="w-4 h-4 text-red-600"
                                />
                                Unable to load map
                              </h4>
                              <p className="text-sm text-red-600 mb-4">
                                Please try opening in external map app
                              </p>
                              <Button
                                color="danger"
                                variant="flat"
                                size="sm"
                                startContent={
                                  <Icon
                                    icon="solar:refresh-bold"
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
              <div className="flex items-center gap-2 text-xs text-default-500">
                <Icon
                  icon="solar:copyright-outline"
                  className="w-3 h-3 text-emerald-600"
                />
                <span>OpenStreetMap</span>
              </div>
              <div className="flex gap-2">
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  startContent={
                    <Icon
                      icon="solar:close-circle-outline"
                      className="w-4 h-4"
                    />
                  }
                >
                  Close
                </Button>
                {coordinates && (
                  <Button
                    color="primary"
                    startContent={
                      <Icon icon="solar:share-outline" className="w-4 h-4" />
                    }
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
                    Share Location
                  </Button>
                )}
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

AddressMapModal.displayName = "AddressMapModal";
