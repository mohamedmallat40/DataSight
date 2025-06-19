import { ReactElement, SVGProps } from "react";

// Icon types
export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
  height?: number;
  width?: number;
};

// Logo types
export interface LogoItem {
  readonly key: string;
  readonly logo: ReactElement;
}

export type ThemeType = "light" | "dark" | undefined;

// Component props types
export interface ScrollingBannerProps {
  shouldPauseOnHover?: boolean;
  gap?: string;
  children: React.ReactNode;
}

export interface DefaultLayoutProps {
  children: React.ReactNode;
}

// API Response types
export interface PaginationInfo {
  totalPages: number;
  total: number;
  currentPage: number;
  perPage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: PaginationInfo;
  message?: string;
  error?: string;
}

// Filter types
export type FilterValue = "all" | string;

export interface FilterState {
  filterValue: string;
  industryFilter: FilterValue;
  countryFilter: FilterValue;
  dateFilter: FilterValue;
}

// Table types
export interface TableColumn {
  readonly name: string;
  readonly uid: string;
  readonly sortable?: boolean;
  readonly width?: number;
  readonly minWidth?: number;
  readonly maxWidth?: number;
}

export interface SortState {
  column: string;
  direction: "ascending" | "descending";
}

// Component state types
export interface TableState {
  loading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  selectedKeys: Set<string> | "all";
  visibleColumns: Set<string> | "all";
}

// Error types
export interface AppError {
  message: string;
  code?: string | number;
  details?: unknown;
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type NonEmptyArray<T> = [T, ...T[]];

// Re-export all component types
export * from "./components";
export * from "./data";

// Form types
export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Modal types
export interface ModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: () => void;
}

// Search and filter types
export interface SearchOptions {
  searchFields: string[];
  caseSensitive?: boolean;
  exactMatch?: boolean;
}

export interface FilterOptions<T> {
  field: keyof T;
  value: unknown;
  operator: "equals" | "contains" | "startsWith" | "endsWith" | "in";
}
