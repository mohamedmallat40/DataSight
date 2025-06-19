import { useState, useCallback, useMemo, useEffect } from "react";
import type { Selection, SortDescriptor } from "@heroui/react";
import type { Key } from "@react-types/shared";
import type { Users, ColumnsKey } from "@/types/data";
import type { FilterState, TableState } from "@/types/components";

export interface UseTableOptions {
  initialPage?: number;
  pageSize?: number;
  enableFilters?: boolean;
  enableSearch?: boolean;
  defaultSort?: {
    column: ColumnsKey;
    direction: "ascending" | "descending";
  };
}

export interface UseTableReturn extends TableState, FilterState {
  // Data management
  setUserList: (users: Users[]) => void;
  setLoading: (loading: boolean) => void;
  setTotalPages: (pages: number) => void;
  setTotalItems: (items: number) => void;

  // Selection management
  onSelectionChange: (keys: Selection) => void;
  filterSelectedKeys: Selection;
  clearSelection: () => void;
  selectAll: () => void;
  getSelectedUsers: () => Users[];

  // Sorting
  onSortChange: (descriptor: SortDescriptor) => void;
  sortedItems: Users[];

  // Filtering and search
  filteredItems: Users[];
  onSearchChange: (value: string) => void;
  setIndustryFilter: (value: string) => void;
  setCountryFilter: (value: string) => void;
  setDateFilter: (value: string) => void;
  clearFilters: () => void;

  // Column management
  setVisibleColumns: (columns: Selection) => void;
  headerColumns: Array<{ name: string; uid: string; sortDirection?: string }>;

  // Derived data
  uniqueIndustries: string[];
  uniqueCountries: string[];
  hasActiveFilters: boolean;

  // User management
  setSelectedUser: (user: Users | null) => void;
}

export function useTable(options: UseTableOptions = {}): UseTableReturn {
  const {
    initialPage = 1,
    enableFilters = true,
    enableSearch = true,
    defaultSort = { column: "full_name", direction: "ascending" },
  } = options;

  // Table state
  const [userList, setUserList] = useState<Users[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);

  // Selection state
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set<Key>());
  const [visibleColumns, setVisibleColumns] = useState<Selection>("all");

  // Sort state
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: defaultSort.column,
    direction: defaultSort.direction,
  });

  // Filter state
  const [filterValue, setFilterValue] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Memoized derived data
  const uniqueIndustries = useMemo(() => {
    return userList
      .map((user) => user.industry)
      .filter((industry): industry is string => Boolean(industry))
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
  }, [userList]);

  const uniqueCountries = useMemo(() => {
    return userList
      .map((user) => user.country)
      .filter((country): country is string => Boolean(country))
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
  }, [userList]);

  // Filter logic
  const itemFilter = useCallback(
    (user: Users): boolean => {
      if (!enableFilters) return true;

      const allIndustry = industryFilter === "all";
      const allCountry = countryFilter === "all";
      const allDate = dateFilter === "all";

      // Industry filter
      if (
        !allIndustry &&
        (!user.industry ||
          user.industry.toLowerCase() !== industryFilter.toLowerCase())
      ) {
        return false;
      }

      // Country filter
      if (
        !allCountry &&
        (!user.country ||
          user.country.toLowerCase() !== countryFilter.toLowerCase())
      ) {
        return false;
      }

      // Date filter
      if (!allDate && user.date_collected) {
        const userDate = new Date(user.date_collected);
        const now = new Date();
        const daysDiff = Math.floor(
          (now.getTime() - userDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (dateFilter === "last7Days" && daysDiff > 7) return false;
        if (dateFilter === "last30Days" && daysDiff > 30) return false;
        if (dateFilter === "last60Days" && daysDiff > 60) return false;
      }

      return true;
    },
    [industryFilter, countryFilter, dateFilter, enableFilters],
  );

  // Search and filter
  const filteredItems = useMemo(() => {
    let filtered = [...userList];

    // Apply search filter
    if (enableSearch && filterValue) {
      filtered = filtered.filter(
        (user) =>
          user.full_name.toLowerCase().includes(filterValue.toLowerCase()) ||
          (user.company_name &&
            user.company_name
              .toLowerCase()
              .includes(filterValue.toLowerCase())) ||
          (user.job_title &&
            user.job_title.toLowerCase().includes(filterValue.toLowerCase())) ||
          (Array.isArray(user.email)
            ? user.email.some((email) =>
                email.toLowerCase().includes(filterValue.toLowerCase()),
              )
            : false),
      );
    }

    // Apply other filters
    filtered = filtered.filter(itemFilter);

    return filtered;
  }, [userList, filterValue, itemFilter, enableSearch]);

  // Sorted items
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const col = sortDescriptor.column as keyof Users;
      let first = a[col];
      let second = b[col];

      if (col === "email" || col === "phone_number") {
        first = Array.isArray(a[col]) ? (a[col][0] ?? "") : "";
        second = Array.isArray(b[col]) ? (b[col][0] ?? "") : "";
      }

      const cmp = first! < second! ? -1 : first! > second! ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [filteredItems, sortDescriptor]);

  // Selected keys filtering
  const filterSelectedKeys = useMemo(() => {
    if (selectedKeys === "all") return selectedKeys;

    const resultKeys = new Set<Key>();
    const selected = selectedKeys as Set<string>;

    for (const item of filteredItems) {
      if (selected.has(String(item.id))) {
        resultKeys.add(String(item.id));
      }
    }

    return resultKeys;
  }, [selectedKeys, filteredItems]);

  // Header columns (simplified for typing)
  const headerColumns = useMemo(() => {
    // This would be imported from your columns config
    const allColumns = [
      { name: "Full Name", uid: "full_name" },
      { name: "Job Title", uid: "job_title" },
      { name: "Company", uid: "company_name" },
      { name: "Email", uid: "email" },
      { name: "Phone", uid: "phone_number" },
      { name: "Country", uid: "country" },
      { name: "Industry", uid: "industry" },
      { name: "Date Collected", uid: "date_collected" },
      { name: "Actions", uid: "actions" },
    ];

    if (visibleColumns === "all") return allColumns;

    return allColumns
      .map((item) =>
        item.uid === sortDescriptor.column
          ? { ...item, sortDirection: sortDescriptor.direction }
          : item,
      )
      .filter((column) => (visibleColumns as Set<Key>).has(column.uid));
  }, [visibleColumns, sortDescriptor]);

  // Callbacks
  const onSelectionChange = useCallback((keys: Selection) => {
    setSelectedKeys(keys);
  }, []);

  const onSortChange = useCallback((descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  }, []);

  const onSearchChange = useCallback((value: string) => {
    setFilterValue(value);
    setPage(1); // Reset to first page when searching
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedKeys(new Set<Key>());
  }, []);

  const selectAll = useCallback(() => {
    setSelectedKeys("all");
  }, []);

  const getSelectedUsers = useCallback((): Users[] => {
    if (selectedKeys === "all") {
      return filteredItems;
    }
    const selected = selectedKeys as Set<string>;
    return filteredItems.filter((user) => selected.has(String(user.id)));
  }, [selectedKeys, filteredItems]);

  const clearFilters = useCallback(() => {
    setFilterValue("");
    setIndustryFilter("all");
    setCountryFilter("all");
    setDateFilter("all");
    setPage(1);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filterValue !== "" ||
      industryFilter !== "all" ||
      countryFilter !== "all" ||
      dateFilter !== "all"
    );
  }, [filterValue, industryFilter, countryFilter, dateFilter]);

  return {
    // State
    userList,
    loading,
    page,
    totalPages,
    totalItems,
    sortDescriptor,
    selectedKeys,
    visibleColumns,
    selectedUser,
    filterValue,
    industryFilter,
    countryFilter,
    dateFilter,

    // Setters
    setUserList,
    setLoading,
    setTotalPages,
    setTotalItems,
    setVisibleColumns,
    setSelectedUser,
    setIndustryFilter,
    setCountryFilter,
    setDateFilter,

    // Callbacks
    onSelectionChange,
    onSortChange,
    onSearchChange,
    clearSelection,
    selectAll,
    getSelectedUsers,
    clearFilters,

    // Derived data
    filteredItems,
    sortedItems,
    filterSelectedKeys,
    headerColumns,
    uniqueIndustries,
    uniqueCountries,
    hasActiveFilters,
  };
}

// Types are already exported above
