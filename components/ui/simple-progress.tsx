interface SimpleProgressProps {
  value: number;
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const SimpleProgress = ({
  value,
  color = "primary",
  size = "sm",
  className = "",
}: SimpleProgressProps) => {
  const colorClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
  };

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div
      className={`w-full bg-default-200 rounded-full overflow-hidden ${sizeClasses[size]} ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ${colorClasses[color]}`}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
};
