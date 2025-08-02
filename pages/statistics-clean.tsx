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
              className="text-primary mx-auto mb-4 animate-spin"
              icon="solar:loading-linear"
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
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon
              className="text-primary"
              icon="solar:chart-square-linear"
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
              gradient="from-primary/10 to-primary/20"
              icon="solar:users-group-rounded-linear"
              title="Total Users"
              trend={{ value: 12.5, isPositive: true }}
              value={analyticsData.metrics.totalUsers}
            />
            <StatCard
              gradient="from-secondary/10 to-secondary/20"
              icon="solar:global-linear"
              title="Countries"
              value={analyticsData.metrics.totalCountries}
            />
            <StatCard
              gradient="from-success/10 to-success/20"
              icon="solar:eye-linear"
              title="Active Users"
              trend={{ value: 8.3, isPositive: true }}
              value={analyticsData.metrics.activeUsers}
            />
            <StatCard
              gradient="from-warning/10 to-warning/20"
              icon="solar:chart-linear"
              title="Growth Rate"
              trend={{
                value: analyticsData.metrics.growthRate,
                isPositive: true,
              }}
              value={`${analyticsData.metrics.growthRate}%`}
            />
          </div>
        )}

        {/* World Map */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.2 }}
        >
          <WorldMapContainer />
        </motion.div>
      </div>
    </DefaultLayout>
  );
}
