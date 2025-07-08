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
        header:
          "border-b border-default-200 bg-gradient-to-r from-primary-50 to-secondary-50",
        footer: "border-t border-default-200 bg-default-50",
        body: "p-0",
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 p-6">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                      <Icon
                        icon="solar:map-point-bold"
                        className="w-7 h-7 text-white"
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                      Location Details
                    </h3>
                    {contactName && (
                      <div className="flex items-center gap-2 mt-1">
                        <Icon
                          icon="solar:user-outline"
                          className="w-4 h-4 text-default-500"
                        />
                        <p className="text-default-600 font-medium">
                          {contactName}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isLoadingMap && coordinates && (
                    <Chip
                      color={geocodeSource === "api" ? "success" : "warning"}
                      variant="flat"
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
                      {geocodeSource === "api"
                        ? "Precise Location"
                        : "Approximate Location"}
                    </Chip>
                  )}
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                {/* Address Information Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                  <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-default-50">
                    <CardBody className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <Icon
                            icon="solar:home-bold"
                            className="w-5 h-5 text-primary-600"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-default-800 mb-3 flex items-center gap-2">
                            Address Information
                            <Icon
                              icon="solar:verified-check-bold"
                              className="w-4 h-4 text-success-500"
                            />
                          </h4>
                          <div className="space-y-3">
                            <div className="p-3 bg-default-100 rounded-lg">
                              <p className="text-sm text-default-700 leading-relaxed font-medium">
                                {fullAddress}
                              </p>
                            </div>

                            {/* Location Details */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {city && (
                                <div className="flex items-center gap-1">
                                  <Icon
                                    icon="solar:buildings-outline"
                                    className="w-3 h-3 text-default-400"
                                  />
                                  <span className="text-default-600">
                                    {city}
                                  </span>
                                </div>
                              )}
                              {state && (
                                <div className="flex items-center gap-1">
                                  <Icon
                                    icon="solar:map-outline"
                                    className="w-3 h-3 text-default-400"
                                  />
                                  <span className="text-default-600">
                                    {state}
                                  </span>
                                </div>
                              )}
                              {postal_code && (
                                <div className="flex items-center gap-1">
                                  <Icon
                                    icon="solar:letter-outline"
                                    className="w-3 h-3 text-default-400"
                                  />
                                  <span className="text-default-600">
                                    {postal_code}
                                  </span>
                                </div>
                              )}
                              {country && (
                                <div className="flex items-center gap-1">
                                  <Icon
                                    icon="solar:globe-outline"
                                    className="w-3 h-3 text-default-400"
                                  />
                                  <span className="text-default-600">
                                    {country}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2 pt-2">
                              <Button
                                size="sm"
                                variant="flat"
                                color="primary"
                                className="justify-start"
                                startContent={
                                  <Icon
                                    icon="solar:copy-bold"
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
                                className="justify-start"
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
                                size="sm"
                                variant="flat"
                                color="default"
                                className="justify-start"
                                startContent={
                                  <Icon
                                    icon="simple-icons:apple"
                                    className="w-4 h-4"
                                  />
                                }
                                onPress={openInAppleMaps}
                              >
                                Open in Apple Maps
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Coordinates Info */}
                  {coordinates && !isLoadingMap && (
                    <Card className="shadow-lg border-0 bg-gradient-to-br from-primary-50 to-secondary-50">
                      <CardBody className="p-4">
                        <h5 className="font-semibold text-default-800 mb-3 flex items-center gap-2">
                          <Icon
                            icon="solar:target-outline"
                            className="w-4 h-4 text-primary-600"
                          />
                          Coordinates
                        </h5>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-default-500">Latitude:</span>
                            <span className="font-mono text-default-700">
                              {coordinates.lat.toFixed(6)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-default-500">Longitude:</span>
                            <span className="font-mono text-default-700">
                              {coordinates.lng.toFixed(6)}
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  )}
                </div>

                {/* Enhanced Map Container */}
                <div className="lg:col-span-2">
                  <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-default-50 h-full">
                    <CardBody className="p-0 relative h-full">
                      <div className="relative w-full h-full bg-default-50 rounded-lg overflow-hidden min-h-[500px]">
                        {/* Map Header */}
                        <div className="absolute top-0 left-0 right-0 z-[1000] p-4 bg-gradient-to-b from-white/90 to-transparent">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon
                                icon="solar:map-outline"
                                className="w-5 h-5 text-primary-600"
                              />
                              <span className="font-semibold text-default-800">
                                Interactive Map
                              </span>
                            </div>
                            {coordinates && (
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="flat"
                                  color="primary"
                                  isIconOnly
                                  className="bg-white/80 backdrop-blur-sm"
                                  onPress={() => {
                                    // Add functionality to center map or refresh
                                  }}
                                >
                                  <Icon
                                    icon="solar:refresh-outline"
                                    className="w-4 h-4"
                                  />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="flat"
                                  color="default"
                                  isIconOnly
                                  className="bg-white/80 backdrop-blur-sm"
                                  onPress={() => {
                                    // Add functionality to toggle satellite view
                                  }}
                                >
                                  <Icon
                                    icon="solar:layers-outline"
                                    className="w-4 h-4"
                                  />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        {isLoadingMap && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 z-10">
                            <div className="flex flex-col items-center gap-4">
                              <div className="relative">
                                <div className="w-16 h-16 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600"></div>
                                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-primary-400"></div>
                              </div>
                              <div className="text-center">
                                <p className="text-lg font-semibold text-primary-700 mb-1">
                                  Loading map...
                                </p>
                                <p className="text-sm text-primary-600">
                                  Locating address and generating view
                                </p>
                                <div className="flex items-center gap-1 mt-2 justify-center">
                                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                                  <div
                                    className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.1s" }}
                                  ></div>
                                  <div
                                    className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.2s" }}
                                  ></div>
                                </div>
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

                            {/* Map Overlay Info */}
                            <div className="absolute bottom-4 left-4 z-[1000]">
                              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                                <CardBody className="p-3">
                                  <div className="flex items-center gap-2 text-xs">
                                    <Icon
                                      icon="solar:map-point-bold"
                                      className="w-4 h-4 text-primary-600"
                                    />
                                    <span className="font-medium text-default-700">
                                      {geocodeSource === "api"
                                        ? "Exact Location"
                                        : "Approximate Area"}
                                    </span>
                                  </div>
                                </CardBody>
                              </Card>
                            </div>

                            {/* Zoom Info */}
                            <div className="absolute bottom-4 right-4 z-[1000]">
                              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                                <CardBody className="p-2">
                                  <div className="text-xs text-default-600">
                                    Zoom:{" "}
                                    {geocodeSource === "api" ? "16" : "12"}
                                  </div>
                                </CardBody>
                              </Card>
                            </div>
                          </div>
                        )}

                        {mapError && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-danger-50 to-warning-50">
                            <div className="text-center p-8">
                              <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icon
                                  icon="solar:map-point-remove-bold"
                                  className="w-8 h-8 text-danger-500"
                                />
                              </div>
                              <h4 className="text-lg font-semibold text-danger-700 mb-2">
                                Unable to load map
                              </h4>
                              <p className="text-sm text-danger-600 mb-4">
                                There was an issue loading the interactive map
                              </p>
                              <Button
                                color="danger"
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
            <ModalFooter className="p-6 bg-gradient-to-r from-default-50 to-default-100">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 text-sm text-default-600">
                  <Icon icon="solar:info-circle-outline" className="w-4 h-4" />
                  <span>Powered by OpenStreetMap</span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    color="default"
                    variant="flat"
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
                      variant="solid"
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
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

AddressMapModal.displayName = "AddressMapModal";
