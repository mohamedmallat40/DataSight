import React from "react";
import { Icon } from "@iconify/react";

interface CountryFlagProps {
  countryCode?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  showFallback?: boolean;
}

/**
 * Validates and formats country code for flag icon
 * @param countryCode - The alpha-2 country code (e.g., "US", "GB", "DE")
 * @returns Formatted country code or null if invalid
 */
const validateCountryCode = (countryCode: string): string | null => {
  if (!countryCode || countryCode.length !== 2) {
    return null;
  }

  // Convert alpha-2 code to lowercase for iconify
  const code = countryCode.toLowerCase();

  // Validate that it contains only letters
  if (!/^[a-z]{2}$/.test(code)) {
    return null;
  }

  return code;
};

/**
 * Component that displays a country flag based on alpha-2 country code
 * Uses iconify flag icons for reliable cross-platform display
 */
export const CountryFlag: React.FC<CountryFlagProps> = ({
  countryCode,
  size = "md",
  className = "",
  showFallback = true,
}) => {
  const validCode = countryCode ? validateCountryCode(countryCode) : null;

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  if (validCode) {
    return (
      <Icon
        aria-label={`Flag of ${countryCode?.toUpperCase()}`}
        className={`${sizeClasses[size]} ${className} rounded-[2px] border border-default-100`}
        icon={`flag:${validCode}-4x3`}
        style={{
          objectFit: "cover",
          flexShrink: 0,
        }}
        title={`Flag of ${countryCode?.toUpperCase()}`}
      />
    );
  }

  // Fallback to globe icon if flag is not available
  if (showFallback) {
    return (
      <Icon
        aria-label="Country flag not available"
        className={`text-default-400 ${sizeClasses[size]} ${className}`}
        icon="lucide:globe"
        title="Country flag not available"
      />
    );
  }

  return null;
};

export default CountryFlag;
