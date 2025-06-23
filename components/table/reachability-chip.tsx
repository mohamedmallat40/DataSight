import React, { useState, useEffect } from "react";
import { Chip } from "@heroui/react";
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

  const { color, text } = getReachabilityColor(reachability.status);

  // Don't render if status is unknown and we're not checking
  if (reachability.status === "unknown" && !value?.trim()) {
    return null;
  }

  return (
    <Chip className={className} color={color} size={size} variant="flat">
      {text}
    </Chip>
  );
};

ReachabilityChip.displayName = "ReachabilityChip";
