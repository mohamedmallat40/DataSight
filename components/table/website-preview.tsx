import React, { useState, useRef, useEffect } from "react";
import { Card, CardBody, Spinner, Image } from "@heroui/react";
import { Icon } from "@iconify/react";
import { getWebsitePreview } from "@/config/api";
import { normalizeUrl } from "@/utils/reachability";

interface WebsitePreviewProps {
  url: string;
  children: React.ReactNode;
  className?: string;
}

export const WebsitePreview: React.FC<WebsitePreviewProps> = ({
  url,
  children,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const cleanUrl = url?.trim();
  const hasValidUrl = cleanUrl && cleanUrl.length > 0;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Clean up blob URL if it exists
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const fetchPreview = async () => {
    if (!hasValidUrl || previewImage || isLoading) return;

    setIsLoading(true);
    setHasError(false);

    try {
      const normalizedUrl = normalizeUrl(cleanUrl);
      const blob = await getWebsitePreview(normalizedUrl);

      // Create object URL from blob
      const imageUrl = URL.createObjectURL(blob);
      setPreviewImage(imageUrl);
    } catch (error) {
      console.error("Failed to fetch website preview:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseEnter = () => {
    if (!hasValidUrl) return;

    setIsHovered(true);

    // Show preview with delay
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      fetchPreview();
    }, 300); // 300ms delay before showing preview
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Hide preview with delay
    setTimeout(() => {
      if (!isHovered) {
        setIsVisible(false);
      }
    }, 200); // 200ms delay before hiding
  };

  const getPreviewPosition = () => {
    if (!containerRef.current) return { top: "100%", left: "0" };

    const rect = containerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Default position below the element
    let top = "100%";
    let left = "0";

    // If too close to right edge, align to right
    if (rect.right + 300 > viewportWidth) {
      left = "auto";
      right = "0";
    }

    // If too close to bottom edge, show above
    if (rect.bottom + 200 > viewportHeight) {
      top = "auto";
      bottom = "100%";
    }

    return { top, left, right };
  };

  const position = getPreviewPosition();

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {/* Preview Popover */}
      {hasValidUrl && isVisible && (
        <div
          className="absolute z-50 mt-2 transition-all duration-300 ease-out"
          style={{
            ...position,
            transform: isVisible
              ? "scale(1) translateY(0)"
              : "scale(0.95) translateY(-5px)",
            opacity: isVisible ? 1 : 0,
          }}
        >
          <Card className="w-80 shadow-xl border border-default-200 bg-background backdrop-blur-md">
            <CardBody className="p-4">
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-primary-50 rounded-md">
                  <Icon
                    icon="solar:global-outline"
                    className="w-4 h-4 text-primary-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-foreground block truncate">
                    Website Preview
                  </span>
                  <span className="text-xs text-default-500 block truncate">
                    {normalizeUrl(cleanUrl)}
                  </span>
                </div>
              </div>

              {/* Preview Content */}
              <div className="relative">
                {isLoading && (
                  <div className="flex items-center justify-center h-44 bg-default-50 rounded-lg border border-default-200">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative">
                        <Spinner size="md" color="primary" />
                        <div className="absolute inset-0 animate-ping">
                          <Spinner
                            size="md"
                            color="primary"
                            className="opacity-20"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-medium text-default-700">
                          Generating preview
                        </span>
                        <span className="text-xs text-default-500">
                          This may take a few seconds...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {hasError && !isLoading && (
                  <div className="flex items-center justify-center h-44 bg-default-50 rounded-lg border border-default-200">
                    <div className="flex flex-col items-center gap-3 text-default-400">
                      <div className="p-3 bg-danger-50 rounded-full">
                        <Icon
                          icon="solar:close-circle-outline"
                          className="w-6 h-6 text-danger-400"
                        />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-medium">
                          Preview unavailable
                        </span>
                        <span className="text-xs">
                          Unable to generate website preview
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {previewImage && !isLoading && !hasError && (
                  <div className="rounded-lg overflow-hidden border border-default-200 shadow-sm">
                    <Image
                      src={previewImage}
                      alt={`Preview of ${cleanUrl}`}
                      className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300"
                      classNames={{
                        wrapper: "w-full bg-default-50",
                        img: "w-full h-44 object-cover",
                      }}
                      loading="lazy"
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              {previewImage && !isLoading && (
                <div className="mt-3 pt-3 border-t border-default-200">
                  <div className="flex items-center justify-center gap-2 text-xs text-default-500">
                    <Icon icon="solar:cursor-outline" className="w-3 h-3" />
                    <span>Hover to preview • Click link to visit</span>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

WebsitePreview.displayName = "WebsitePreview";
