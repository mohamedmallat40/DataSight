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
    <Progress value={value} color={color} size={size} className={className} />
  );
};
