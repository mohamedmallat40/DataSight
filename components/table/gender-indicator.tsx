import React from "react";
import { Chip, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";

interface GenderIndicatorProps {
  gender: boolean | null;
  variant?: "chip" | "badge" | "icon" | "minimal";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const GenderIndicator: React.FC<GenderIndicatorProps> = ({
  gender,
  variant = "chip",
  size = "sm",
  className = "",
}) => {
  // Don't render anything if gender is not specified
  if (gender === null) {
    return null;
  }

  const getGenderInfo = () => {
    if (gender === true) {
      return {
        icon: "solar:men-outline",
        label: "Male",
        shortLabel: "M",
        color: "primary",
        bgColor: "bg-blue-50 dark:bg-blue-950/30",
        textColor: "text-blue-600 dark:text-blue-400",
        iconColor: "text-blue-500",
        emoji: "👨",
      };
    } else if (gender === false) {
      return {
        icon: "solar:women-outline",
        label: "Female",
        shortLabel: "F",
        color: "secondary",
        bgColor: "bg-pink-50 dark:bg-pink-950/30",
        textColor: "text-pink-600 dark:text-pink-400",
        iconColor: "text-pink-500",
        emoji: "👩",
      };
    } else {
      return {
        icon: "solar:user-outline",
        label: "Not specified",
        shortLabel: "?",
        color: "default",
        bgColor: "bg-gray-50 dark:bg-gray-950/30",
        textColor: "text-gray-500 dark:text-gray-400",
        iconColor: "text-gray-400",
        emoji: "👤",
      };
    }
  };

  const genderInfo = getGenderInfo();

  // Icon-only minimal design
  if (variant === "minimal") {
    return (
      <Tooltip content={genderInfo.label}>
        <div className={`inline-flex items-center justify-center ${className}`}>
          <Icon
            className={`w-3.5 h-3.5 ${genderInfo.iconColor}`}
            icon={genderInfo.icon}
          />
        </div>
      </Tooltip>
    );
  }

  // Icon only with subtle background
  if (variant === "icon") {
    return (
      <Tooltip content={genderInfo.label}>
        <div
          className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${genderInfo.bgColor} ${className}`}
        >
          <Icon
            className={`w-3 h-3 ${genderInfo.iconColor}`}
            icon={genderInfo.icon}
          />
        </div>
      </Tooltip>
    );
  }

  // Badge style with emoji
  if (variant === "badge") {
    return (
      <Tooltip content={genderInfo.label}>
        <div
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${genderInfo.bgColor} ${className}`}
        >
          <span className="text-sm">{genderInfo.emoji}</span>
          <span className={`text-xs font-medium ${genderInfo.textColor}`}>
            {genderInfo.shortLabel}
          </span>
        </div>
      </Tooltip>
    );
  }

  // Default chip variant
  return (
    <Chip
      className={className}
      color={genderInfo.color as any}
      size={size}
      startContent={<Icon className="w-3 h-3" icon={genderInfo.icon} />}
      variant="flat"
    >
      <span className="text-xs font-medium">{genderInfo.label}</span>
    </Chip>
  );
};

GenderIndicator.displayName = "GenderIndicator";
