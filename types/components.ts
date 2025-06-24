import { ReactNode } from "react";
import { Selection, SortDescriptor } from "@heroui/react";

import { Users } from "./data";

// Layout component interfaces
export interface DefaultLayoutProps {
  children: ReactNode;
}

export interface HeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

// Table component interfaces
export interface TableComponentProps {
  initialData?: Users[];
  pageSize?: number;
  enableSearch?: boolean;
  enableFilters?: boolean;
  enableSorting?: boolean;
  onUserSelect?: (user: Users) => void;
  onBulkAction?: (action: string, users: Users[]) => void;
}

export interface TableState {
  userList: Users[];
  loading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  sortDescriptor: SortDescriptor;
  selectedKeys: Selection;
  visibleColumns: Selection;
  selectedUser: Users | null;
}

export interface FilterState {
  filterValue: string;
  industryFilter: string;
  countryFilter: string;
  dateFilter: string;
}

// Email/Phone list component interfaces
export interface EmailListProps {
  emails: string[];
  className?: string;
  maxVisible?: number;
}

export interface PhoneListProps {
  phones: string[];
  className?: string;
  maxVisible?: number;
}

export interface CopyButtonProps {
  text: string;
  className?: string;
  onCopy?: (text: string) => void;
}

// User details drawer interfaces
export interface UserDetailsDrawerProps {
  isOpen: boolean;
  onOpenChange: () => void;
  userData: Users | null;
  onEdit?: (user: Users) => void;
  onDelete?: (user: Users) => void;
}

export interface ImageModalState {
  url: string;
  title: string;
  alt: string;
}

// Scrolling banner interfaces
export interface ScrollingBannerProps {
  children: ReactNode;
  shouldPauseOnHover?: boolean;
  gap?: string;
  speed?: number;
  direction?: "left" | "right";
}

// Multi-step wizard interfaces
export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  component: ReactNode;
  isValid?: boolean;
  isComplete?: boolean;
}

export interface MultiStepWizardProps {
  onClose: () => void;
  onComplete?: (data: unknown) => void;
  initialStep?: string;
}

// Form interfaces
export interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "url" | "password";
}

export interface FormData {
  [key: string]: string | string[] | number | boolean | null;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormState<T = FormData> {
  data: T;
  errors: FormErrors;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// Navigation interfaces
export interface NavbarProps {
  setLocale: (locale: string) => void;
}

export interface LanguageSwitcherProps {
  onChange: (locale: string) => void;
  currentLocale?: string;
}

export interface ThemeSwitchProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Modal interfaces
export interface ModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: () => void;
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: "danger" | "warning" | "info";
}

// Loading and error interfaces
export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
  progress?: number;
}

export interface ErrorState {
  hasError: boolean;
  error?: Error | string;
  errorCode?: string | number;
}

export interface AsyncState<T = unknown> extends LoadingState, ErrorState {
  data: T | null;
}

// Search and filter interfaces
export interface SearchState {
  query: string;
  results: Users[];
  isSearching: boolean;
  totalResults: number;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterConfig {
  label: string;
  key: string;
  options: FilterOption[];
  defaultValue: string;
}

// Pagination interfaces
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  showSizeSelector?: boolean;
  showInfo?: boolean;
}

// Action interfaces
export interface TableAction {
  key: string;
  label: string;
  icon?: ReactNode;
  handler: (users: Users[]) => void;
  variant?: "default" | "primary" | "danger" | "warning";
  confirmMessage?: string;
}

export interface BulkActionConfig {
  actions: TableAction[];
  enableSelectAll?: boolean;
  maxSelection?: number;
}

// Export all component prop types for easy usage
export type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
