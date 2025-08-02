import { User, CountryStats, GeographicData, AnalyticsMetrics } from "../types";

// This would typically connect to your backend API
class AnalyticsService {
  private readonly baseUrl = "/api/analytics";

  async getGeographicData(): Promise<GeographicData> {
    // Mock implementation - replace with actual API call
    const users = await this.getUsers();
    const countryStats = this.calculateCountryStats(users);
    const metrics = this.calculateMetrics(users, countryStats);

    return {
      countryStats,
      userDistribution: users,
      metrics,
    };
  }

  async getUsers(): Promise<User[]> {
    // This would be an API call to your backend
    // For now, using mock data
    return this.getMockUsers();
  }

  async getUsersByCountry(countryCode: string): Promise<User[]> {
    const users = await this.getUsers();

    return users.filter((user) => user.countryCode === countryCode);
  }

  private calculateCountryStats(users: User[]): CountryStats[] {
    const countryMap = new Map<string, CountryStats>();

    users.forEach((user) => {
      const existing = countryMap.get(user.countryCode);

      if (existing) {
        existing.userCount++;
      } else {
        countryMap.set(user.countryCode, {
          country: user.country,
          countryCode: user.countryCode,
          userCount: 1,
          lat: user.lat,
          lng: user.lng,
          flag: this.getCountryFlag(user.countryCode),
        });
      }
    });

    return Array.from(countryMap.values()).sort(
      (a, b) => b.userCount - a.userCount,
    );
  }

  private calculateMetrics(
    users: User[],
    countryStats: CountryStats[],
  ): AnalyticsMetrics {
    return {
      totalUsers: users.length,
      totalCountries: countryStats.length,
      growthRate: 12.5, // This would come from time-series data
      activeUsers: Math.floor(users.length * 0.8), // Mock active user calculation
    };
  }

  private getCountryFlag(countryCode: string): string {
    const flagMap: Record<string, string> = {
      US: "🇺🇸",
      GB: "🇬🇧",
      CA: "🇨🇦",
      DE: "🇩🇪",
      FR: "🇫🇷",
      JP: "🇯🇵",
      AU: "🇦🇺",
      BR: "🇧🇷",
      IN: "🇮🇳",
      CN: "🇨🇳",
      SA: "🇸🇦",
      AE: "🇦🇪",
    };

    return flagMap[countryCode] || "🏳️";
  }

  private getMockUsers(): User[] {
    // Mock data - replace with actual data fetching
    return [
      {
        id: "1",
        name: "John Smith",
        email: "john.smith@example.com",
        avatar: "https://ui-avatars.com/api/?name=John+Smith&background=random",
        role: "Manager",
        joinDate: "2024-01-15",
        country: "United States",
        countryCode: "US",
        lat: 39.8283,
        lng: -98.5795,
      },
      {
        id: "2",
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        avatar:
          "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random",
        role: "Doctor",
        joinDate: "2024-01-20",
        country: "United Kingdom",
        countryCode: "GB",
        lat: 55.3781,
        lng: -3.436,
      },
      // Add more mock users as needed
    ];
  }
}

export const analyticsService = new AnalyticsService();
