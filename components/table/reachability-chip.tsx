import React, { useState, useEffect } from "react";
import { Chip, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import {
  ReachabilityStatus,
  ReachabilityResult,
  getReachabilityColor,
  checkEmailReachability,
  checkWebsiteReachability,
} from "../../utils/reachability";

interface ReachabilityChipProps {
  type: "email" | "website";
  value: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "subtle" | "bold";
}

export const ReachabilityChip: React.FC<ReachabilityChipProps> = ({
  type,
  value,
  className,
  size = "sm",
  variant = "subtle",
}) => {
  const [reachability, setReachability] = useState<ReachabilityResult>({
    status: "checking" as ReachabilityStatus,
    checkedAt: new Date(),
  });

  useEffect(() => {
    let isMounted = true;

    const checkReachability = async () => {
      try {
        const result =
          type === "email"
            ? await checkEmailReachability(value)
            : await checkWebsiteReachability(value);

        if (isMounted) {
          setReachability(result);
        }
      } catch (error) {
        console.error(`Error checking ${type} reachability:`, error);
        if (isMounted) {
          setReachability({
            status: "unknown",
            checkedAt: new Date(),
          });
        }
      }
    };

    if (value && value.trim()) {
      checkReachability();
    } else {
      setReachability({
        status: "unknown",
        checkedAt: new Date(),
      });
    }

    return () => {
      isMounted = false;
    };
  }, [type, value]);

  const { color, text, icon } = getReachabilityColor(reachability.status);

  // Don't render if status is unknown and we're not checking
  if (reachability.status === "unknown" && !value?.trim()) {
    return null;
  }

  const getTooltipText = () => {
    switch (reachability.status) {
      case "reachable":
        return `${type === "email" ? "Email" : "Website"} appears to be valid and reachable`;
      case "unreachable":
        return `${type === "email" ? "Email" : "Website"} appears to be invalid or unreachable`;
      case "checking":
        return `Checking ${type} reachability...`;
      default:
        return `${type === "email" ? "Email" : "Website"} status unknown`;
    }
  };

  const getChipStyling = () => {
    if (variant === "subtle") {
      return {
        className: `${className} transition-all duration-300 hover:scale-105 cursor-help opacity-75 hover:opacity-100`,
        variant: "dot" as const,
        size: size === "sm" ? ("sm" as const) : size,
      };
    }
    return {
      className: `${className} transition-all duration-200 hover:scale-105 cursor-help shadow-sm`,
      variant: "flat" as const,
      size: size,
    };
  };

  const chipStyling = getChipStyling();

  return (
    <Tooltip
      content={getTooltipText()}
      delay={500}
      className="text-xs max-w-xs"
      placement="top"
    >
      <Chip
        className={chipStyling.className}
        color={color}
        size={chipStyling.size}
        variant={chipStyling.variant}
        startContent={
          reachability.status !== "checking" ? (
            <Icon className={`w-2.5 h-2.5`} icon={icon} />
          ) : (
            <Icon className="w-2.5 h-2.5 animate-spin" icon={icon} />
          )
        }
      >
        {variant === "bold" && (
          <span className="text-xs font-medium">{text}</span>
        )}
        {variant === "subtle" && <span className="text-xs">{text}</span>}
      </Chip>
    </Tooltip>
  );
};

ReachabilityChip.displayName = "ReachabilityChip";
