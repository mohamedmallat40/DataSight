import { useState, useEffect } from "react";
import { GeographicData, User } from "../types";
import { analyticsService } from "../services/analytics.service";

export function useAnalytics() {
  const [data, setData] = useState<GeographicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const analyticsData = await analyticsService.getGeographicData();
      setData(analyticsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load analytics data",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch: loadAnalyticsData,
  };
}

export function useCountryUsers(countryCode: string | null) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!countryCode) {
      setUsers([]);
      return;
    }

    const loadUsers = async () => {
      try {
        setLoading(true);
        const countryUsers =
          await analyticsService.getUsersByCountry(countryCode);
        setUsers(countryUsers);
      } catch (error) {
        console.error("Failed to load country users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [countryCode]);

  return { users, loading };
}
