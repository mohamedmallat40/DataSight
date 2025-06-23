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
}

export const ReachabilityChip: React.FC<ReachabilityChipProps> = ({
  type,
  value,
  className,
  size = "sm",
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

  return (
    <Tooltip content={getTooltipText()} delay={500} className="text-xs">
      <Chip
        className={`${className} transition-all duration-200 hover:scale-105 cursor-help`}
        color={color}
        size={size}
        variant="flat"
        startContent={
          <Icon
            className={`w-3 h-3 ${reachability.status === "checking" ? "animate-spin" : ""}`}
            icon={icon}
          />
        }
      >
        <span className="text-xs font-medium">{text}</span>
      </Chip>
    </Tooltip>
  );
};

ReachabilityChip.displayName = "ReachabilityChip";
