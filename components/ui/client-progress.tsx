"use client";

import { Progress } from "@heroui/progress";

interface ClientProgressProps {
  value: number;
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ClientProgress = ({
  value,
  color = "primary",
  size = "sm",
  className,
}: ClientProgressProps) => {
  return (
    <Progress className={className} color={color} size={size} value={value} />
  );
};
