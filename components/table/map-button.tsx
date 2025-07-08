import React, { memo } from "react";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

interface MapButtonProps {
  address: string;
  street?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
  contactName?: string;
  className?: string;
  onPress: () => void;
}

export const MapButton = memo(
  ({
    address,
    street,
    city,
    state,
    postal_code,
    country,
    contactName,
    className,
    onPress,
  }: MapButtonProps) => {
    // Check if we have enough address information to show the map button
    const hasValidAddress = (address || street) && city && country;

    if (!hasValidAddress) {
      return null;
    }

    return (
      <Tooltip content="View on map">
        <Button
          isIconOnly
          className={cn(
            "h-6 w-6 min-w-6 text-orange-500 hover:text-orange-600 transition-colors",
            className,
          )}
          size="sm"
          variant="light"
          onPress={onPress}
        >
          <Icon className="h-3 w-3" icon="solar:map-point-outline" />
        </Button>
      </Tooltip>
    );
  },
);

MapButton.displayName = "MapButton";
