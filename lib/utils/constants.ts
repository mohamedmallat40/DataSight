// Application Constants
export const APP_CONFIG = {
  name: "ALL CARE MEDICAL",
  description: "OCR Contact Management System",
  version: "1.0.0",
  author: "Perla IT",
} as const;

// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 10000,
  retryAttempts: 3,
} as const;

// Pagination
export const PAGINATION = {
  defaultPageSize: 10,
  maxPageSize: 100,
  pageSizeOptions: [5, 10, 20, 50, 100],
} as const;

// OCR Configuration
export const OCR_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFormats: ["image/jpeg", "image/png", "image/webp"],
  minConfidence: 0.7,
} as const;

// Countries and Regions
export const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
] as const;

// Contact Tags
export const CONTACT_TAGS = [
  "prospect",
  "customer",
  "partner",
  "vendor",
  "lead",
  "hot",
  "cold",
  "warm",
  "vip",
  "priority",
] as const;

// User Roles
export const USER_ROLES = ["admin", "manager", "user", "viewer"] as const;

// Theme Colors
export const THEME_COLORS = {
  primary: "#006FEE",
  secondary: "#9353D3",
  success: "#17C964",
  warning: "#F5A524",
  danger: "#F31260",
} as const;
