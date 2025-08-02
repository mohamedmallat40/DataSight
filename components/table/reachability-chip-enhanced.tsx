import React from "react";

import { ReachabilityChip } from "./reachability-chip";
import { WebsitePreview } from "./website-preview";

interface ReachabilityChipEnhancedProps {
  type: "email" | "website";
  value: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "subtle" | "bold";
  enablePreview?: boolean;
}

export const ReachabilityChipEnhanced: React.FC<
  ReachabilityChipEnhancedProps
> = ({
  type,
  value,
  className,
  size = "sm",
  variant = "subtle",
  enablePreview = true,
}) => {
  const reachabilityChip = (
    <ReachabilityChip
      className={className}
      size={size}
      type={type}
      value={value}
      variant={variant}
    />
  );

  // Only wrap website chips with preview functionality
  if (type === "website" && enablePreview && value?.trim()) {
    return (
      <WebsitePreview className={className} url={value}>
        {reachabilityChip}
      </WebsitePreview>
    );
  }

  return reachabilityChip;
};

ReachabilityChipEnhanced.displayName = "ReachabilityChipEnhanced";
