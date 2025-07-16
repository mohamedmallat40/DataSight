"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import DefaultLayout from "@/layouts/default";
import { StatCard } from "@/components/ui/atoms";
import { WorldMapContainer } from "@/lib/features/analytics";
import { useAnalytics } from "@/lib/features/analytics";

export default function StatisticsCleanPage() {
  const { data: analyticsData, loading } = useAnalytics();

  if (loading) {
    return (
      <DefaultLayout>
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center">
            <Icon
              icon="solar:loading-linear"
              className="text-primary mx-auto mb-4 animate-spin"
              width={48}
            />
            <p className="text-default-500">Loading analytics...</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon
              icon="solar:chart-square-linear"
              className="text-primary"
              width={32}
            />
            <h1 className="text-3xl font-bold text-foreground">
              Analytics Dashboard
            </h1>
          </div>
          <p className="text-lg text-default-600 max-w-2xl mx-auto">
            Comprehensive insights into user engagement and global reach
          </p>
        </motion.div>

        {/* Stats Grid */}
        {analyticsData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={analyticsData.metrics.totalUsers}
              icon="solar:users-group-rounded-linear"
              gradient="from-primary/10 to-primary/20"
              trend={{ value: 12.5, isPositive: true }}
            />
            <StatCard
              title="Countries"
              value={analyticsData.metrics.totalCountries}
              icon="solar:global-linear"
              gradient="from-secondary/10 to-secondary/20"
            />
            <StatCard
              title="Active Users"
              value={analyticsData.metrics.activeUsers}
              icon="solar:eye-linear"
              gradient="from-success/10 to-success/20"
              trend={{ value: 8.3, isPositive: true }}
            />
            <StatCard
              title="Growth Rate"
              value={`${analyticsData.metrics.growthRate}%`}
              icon="solar:chart-linear"
              gradient="from-warning/10 to-warning/20"
              trend={{
                value: analyticsData.metrics.growthRate,
                isPositive: true,
              }}
            />
          </div>
        )}

        {/* World Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <WorldMapContainer />
        </motion.div>
      </div>
    </DefaultLayout>
  );
}
