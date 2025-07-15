export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  joinDate: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
}

export interface CountryStats {
  country: string;
  countryCode: string;
  userCount: number;
  lat: number;
  lng: number;
  flag: string;
}

export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
}

export interface AnalyticsMetrics {
  totalUsers: number;
  totalCountries: number;
  growthRate: number;
  activeUsers: number;
}

export interface GeographicData {
  countryStats: CountryStats[];
  userDistribution: User[];
  metrics: AnalyticsMetrics;
}
