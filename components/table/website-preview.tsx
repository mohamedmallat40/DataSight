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

      {/* Preview Tooltip */}
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
          <Card className="w-80 shadow-lg border border-gray-200 bg-white">
            <CardBody className="p-3">
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <Icon
                  icon="solar:global-outline"
                  className="w-4 h-4 text-gray-500"
                />
                <span className="text-sm font-medium text-gray-700 truncate">
                  {normalizeUrl(cleanUrl)}
                </span>
              </div>

              {/* Preview Content */}
              <div className="relative">
                {isLoading && (
                  <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg">
                    <div className="flex flex-col items-center gap-2">
                      <Spinner size="sm" color="primary" />
                      <span className="text-xs text-gray-500">
                        Generating preview...
                      </span>
                    </div>
                  </div>
                )}

                {hasError && !isLoading && (
                  <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Icon
                        icon="solar:close-circle-outline"
                        className="w-8 h-8"
                      />
                      <span className="text-xs">Preview unavailable</span>
                    </div>
                  </div>
                )}

                {previewImage && !isLoading && !hasError && (
                  <div className="rounded-lg overflow-hidden">
                    <Image
                      src={previewImage}
                      alt={`Preview of ${cleanUrl}`}
                      className="w-full h-40 object-cover"
                      classNames={{
                        wrapper: "w-full",
                        img: "w-full h-40 object-cover",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              {previewImage && !isLoading && (
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Hover to preview • Click to visit
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
