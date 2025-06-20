import React from "react";
import { Icon } from "@iconify/react";

interface CountryFlagProps {
  countryCode?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  showFallback?: boolean;
}

/**
 * Converts alpha-2 country code to Unicode flag emoji
 * @param countryCode - The alpha-2 country code (e.g., "US", "GB", "DE")
 * @returns Unicode flag emoji or null if invalid
 */
const getCountryFlag = (countryCode: string): string | null => {
  if (!countryCode || countryCode.length !== 2) {
    return null;
  }

  // Convert alpha-2 code to uppercase
  const code = countryCode.toUpperCase();

  // Validate that it contains only letters
  if (!/^[A-Z]{2}$/.test(code)) {
    return null;
  }

  try {
    // Convert to Unicode flag emoji
    // Each letter is offset by 127397 (0x1F1E6 - 0x41) to get regional indicator symbols
    const codePoints = code
      .split("")
      .map((char) => 0x1f1e6 - 0x41 + char.charCodeAt(0));

    return String.fromCodePoint(...codePoints);
  } catch {
    return null;
  }
};

/**
 * Component that displays a country flag based on alpha-2 country code
 */
export const CountryFlag: React.FC<CountryFlagProps> = ({
  countryCode,
  size = "md",
  className = "",
  showFallback = true,
}) => {
  const flag = countryCode ? getCountryFlag(countryCode) : null;

  const sizeClasses = {
    sm: "text-sm w-4 h-4",
    md: "text-base w-5 h-5",
    lg: "text-lg w-6 h-6",
  };

  if (flag) {
    return (
      <span
        className={`inline-block ${sizeClasses[size]} ${className}`}
        title={`Flag of ${countryCode?.toUpperCase()}`}
        role="img"
        aria-label={`Flag of ${countryCode?.toUpperCase()}`}
      >
        {flag}
      </span>
    );
  }

  // Fallback to globe icon if flag is not available
  if (showFallback) {
    return (
      <Icon
        icon="lucide:globe"
        className={`text-default-400 ${sizeClasses[size]} ${className}`}
        title="Country flag not available"
        aria-label="Country flag not available"
      />
    );
  }

  return null;
};

export default CountryFlag;
