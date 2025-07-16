import { Card, CardBody, CardHeader } from "@heroui/card";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  gradient?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  gradient = "from-primary/10 to-secondary/10",
  trend,
  className = "",
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`bg-gradient-to-r ${gradient} ${className}`}>
        <CardBody className="text-center py-4 px-6">
          {icon && (
            <Icon
              icon={icon}
              className="text-primary mx-auto mb-2"
              width={24}
            />
          )}
          <h3 className="text-2xl font-bold text-primary mb-1">{value}</h3>
          <p className="text-sm text-default-600 mb-1">{title}</p>
          {subtitle && <p className="text-xs text-default-500">{subtitle}</p>}
          {trend && (
            <div
              className={`flex items-center justify-center gap-1 mt-2 text-xs ${
                trend.isPositive ? "text-success" : "text-danger"
              }`}
            >
              <Icon
                icon={
                  trend.isPositive
                    ? "solar:arrow-up-linear"
                    : "solar:arrow-down-linear"
                }
                width={12}
              />
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
}
