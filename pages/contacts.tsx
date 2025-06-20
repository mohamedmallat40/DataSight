"use client";

import type { Selection, SortDescriptor } from "@heroui/react";
import type { ColumnsKey, Users, ColumnDefinition } from "../types/data";
import type { Key } from "@react-types/shared";
import type {
  TableState,
  FilterState,
  TableAction,
  PaginationState,
  AsyncState,
  ModalState,
} from "../types/components";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  User,
  Pagination,
  useDisclosure,
  ModalContent,
  Modal,
  ModalBody,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  RadioGroup,
  Radio,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Divider,
} from "@heroui/react";
import { SearchIcon } from "@heroui/shared-icons";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";
import { useRouter } from "next/router";

import { CopyText } from "../components/table/copy-text";
import { EmailList } from "../components/table/email-list";
import { EmailListEnhanced } from "../components/table/email-list-enhanced";
import { PhoneList } from "../components/table/phone-list";
import { PhoneListEnhanced } from "../components/table/phone-list-enhanced";
import { EyeFilledIcon } from "../components/table/eye";
import { EditLinearIcon } from "../components/table/edit";
import { DeleteFilledIcon } from "../components/table/delete";
import { useMemoizedCallback } from "../components/table/use-memoized-callback";
import { columns, INITIAL_VISIBLE_COLUMNS } from "../types/data";
import { HighlightedText, containsSearchTerm } from "../utils/search-highlight";
import SearchInput from "../components/SearchInput";

import MultiStepWizard from "./table/add-card/multi-step-wizard";
import UserDetailsDrawer from "../components/user-details-drawer";
import apiClient from "@/config/api";
import DefaultLayout from "@/layouts/default";

// Enhanced type definitions for API responses
interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    totalPages: number;
    total: number;
    currentPage: number;
    pageSize: number;
  };
  message?: string;
}

interface TableComponentState extends TableState, FilterState {
  // Modal states
  isAddModalOpen: boolean;
  isDrawerOpen: boolean;
}

// Filter types for better type safety
type FilterValue = string;
type FilterKey = "all" | "last7Days" | "last30Days" | "last60Days";

// Enhanced column definition with sort information
interface ExtendedColumnDefinition extends ColumnDefinition {
  sortDirection?: "ascending" | "descending";
}

export default function ContactsPage(): JSX.Element {
  const router = useRouter();

  // Table state management with proper typing
  const [userList, setUserList] = useState<Users[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "full_name" as ColumnsKey,
    direction: "ascending",
  });
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set<Key>());
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set<ColumnsKey>(INITIAL_VISIBLE_COLUMNS),
  );
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);

  // Filter states with specific types
  const [filterValue, setFilterValue] = useState<FilterValue>("");
  const [industryFilter, setIndustryFilter] = useState<FilterValue>("all");
  const [countryFilter, setCountryFilter] = useState<FilterValue>("all");
  const [dateFilter, setDateFilter] = useState<FilterKey>("all");

  // Modal state management with typed hooks
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onOpenChange: onDrawerOpenChange,
  } = useDisclosure();

  // Initialize search from URL parameters
  useEffect(() => {
    const searchParam = router.query.search as string;
    if (searchParam && searchParam !== filterValue) {
      setFilterValue(searchParam);
    }
  }, [router.query.search]);

  useEffect(() => {
    fetchUsers();
  }, [page, filterValue]);

  const fetchUsers = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", page.toString());

      // Add search parameter if it exists (trim only for API call)
      if (filterValue.trim()) {
        params.append("search", filterValue.trim());
      }

      const response = await apiClient.get<ApiResponse<Users[]>>(
        `/card-info?${params.toString()}`,
      );
      const { data } = response;

      if (data?.success && Array.isArray(data?.data)) {
        setUserList(data.data);
        setTotalPages(data.pagination?.totalPages ?? 1);
        setTotalItems(data.pagination?.total ?? 0);
      } else {
        setUserList([]);
        console.warn("API response does not contain valid user data");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error fetching users:", errorMessage);
      setUserList([]);
    } finally {
      setLoading(false);
    }
  }, [page, filterValue]);

  const headerColumns = useMemo((): ExtendedColumnDefinition[] => {
    if (visibleColumns === "all") {
      return columns.map((item) =>
        item.uid === sortDescriptor.column
          ? {
              ...item,
              sortDirection: sortDescriptor.direction as
                | "ascending"
                | "descending",
            }
          : item,
      );
    }

    return columns
      .map(
        (item): ExtendedColumnDefinition =>
          item.uid === sortDescriptor.column
            ? {
                ...item,
                sortDirection: sortDescriptor.direction as
                  | "ascending"
                  | "descending",
              }
            : item,
      )
      .filter((column) => (visibleColumns as Set<Key>).has(column.uid));
  }, [visibleColumns, sortDescriptor]);

  // Filter and search logic with proper typing
  const itemFilter = useCallback(
    (user: Users): boolean => {
      const allIndustry = industryFilter === "all";
      const allCountry = countryFilter === "all";
      const allDate = dateFilter === "all";

      // Industry filter with type safety
      if (
        !allIndustry &&
        (!user.industry ||
          user.industry.toLowerCase() !== industryFilter.toLowerCase())
      ) {
        return false;
      }

      // Country filter with type safety
      if (
        !allCountry &&
        (!user.country ||
          user.country.toLowerCase() !== countryFilter.toLowerCase())
      ) {
        return false;
      }

      // Date filter with proper date handling
      if (!allDate && user.date_collected) {
        const userDate = new Date(user.date_collected);
        const now = new Date();

        // Check for valid dates
        if (isNaN(userDate.getTime()) || isNaN(now.getTime())) {
          return false;
        }

        const daysDiff = Math.floor(
          (now.getTime() - userDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        switch (dateFilter) {
          case "last7Days":
            return daysDiff <= 7;
          case "last30Days":
            return daysDiff <= 30;
          case "last60Days":
            return daysDiff <= 60;
          default:
            return true;
        }
      }

      return true;
    },
    [industryFilter, countryFilter, dateFilter],
  );

  const filteredItems = useMemo((): Users[] => {
    let filtered = [...userList];

    // Apply local filters only (search is now handled server-side)
    filtered = filtered.filter(itemFilter);

    return filtered;
  }, [userList, itemFilter]);

  const items = useMemo((): Users[] => filteredItems, [filteredItems]);

  const sortedItems = useMemo((): Users[] => {
    return [...items].sort((a: Users, b: Users): number => {
      const col = sortDescriptor.column as ColumnsKey;

      // Type-safe property access
      let first: string | number | null | undefined;
      let second: string | number | null | undefined;

      if (col === "email" || col === "phone_number") {
        // Handle array fields
        const aValue = a[col];
        const bValue = b[col];
        first = Array.isArray(aValue) && aValue.length > 0 ? aValue[0] : "";
        second = Array.isArray(bValue) && bValue.length > 0 ? bValue[0] : "";
      } else {
        first = a[col as keyof Users];
        second = b[col as keyof Users];
      }

      // Convert to strings for comparison, handling null/undefined
      const firstStr = String(first ?? "");
      const secondStr = String(second ?? "");

      const cmp = firstStr.localeCompare(secondStr);
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [items, sortDescriptor]);

  const filterSelectedKeys = useMemo((): Selection => {
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

  // Search and filter functions with proper typing
  const onSearchChange = useMemoizedCallback((value?: string): void => {
    const searchValue = value || "";
    setFilterValue(searchValue);
    if (searchValue !== filterValue) {
      setPage(1); // Reset to first page when search changes
    }

    // Update URL with search parameter
    const query = { ...router.query };
    if (searchValue.trim()) {
      // Only trim for empty check
      query.search = searchValue;
    } else {
      delete query.search;
    }

    router.replace(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true },
    );
  });

  // Get unique values for filter options with type safety
  const uniqueIndustries = useMemo((): string[] => {
    const industries = userList
      .map((user: Users) => user.industry)
      .filter((industry): industry is string => Boolean(industry))
      .filter((value, index, self) => self.indexOf(value) === index);
    return industries.sort();
  }, [userList]);

  const uniqueCountries = useMemo((): string[] => {
    const countries = userList
      .map((user: Users) => user.country)
      .filter((country): country is string => Boolean(country))
      .filter((value, index, self) => self.indexOf(value) === index);
    return countries.sort();
  }, [userList]);

  const onSelectionChange = useMemoizedCallback((keys: Selection): void => {
    setSelectedKeys(keys);
  });

  const handleViewUser = useMemoizedCallback((user: Users): void => {
    setSelectedUser(user);
    onDrawerOpen();
  });

  const renderCell = useMemoizedCallback(
    (user: Users, columnKey: Key): React.ReactNode => {
      const userKey = columnKey as ColumnsKey;

      switch (userKey) {
        case "full_name":
          const isNameHighlighted =
            filterValue &&
            containsSearchTerm(user.full_name || "", filterValue);

          return (
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-default-100 text-default-600 font-semibold text-sm">
                {(user.full_name || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <div
                  className={cn(
                    "text-small font-medium truncate max-w-[200px]",
                    isNameHighlighted ? "text-default-900" : "text-default-700",
                  )}
                >
                  {filterValue ? (
                    <HighlightedText
                      text={user.full_name || "N/A"}
                      searchTerm={filterValue}
                      highlightClassName="bg-yellow-200 text-yellow-900 px-0.5 rounded-sm font-medium"
                    />
                  ) : (
                    user.full_name || "N/A"
                  )}
                </div>
                <p className="text-tiny text-default-500 truncate max-w-[200px]">
                  {user.company_name || ""}
                </p>
              </div>
            </div>
          );
        case "job_title":
          return (
            <div className="flex flex-col gap-0.5 min-w-0 max-w-[120px]">
              <p
                className="text-small font-medium text-default-700 truncate"
                title={user.job_title || "No job title"}
              >
                {user.job_title || "N/A"}
              </p>
              {user.industry && (
                <p
                  className="text-tiny text-default-500 truncate"
                  title={user.industry}
                >
                  {user.industry}
                </p>
              )}
            </div>
          );
        case "company_name":
          return (
            <div className="flex flex-col gap-0.5 min-w-0">
              <p
                className="text-small font-medium text-default-700 truncate"
                title={user.company_name || "No company"}
              >
                {user.company_name || "N/A"}
              </p>
              {user.website && (
                <a
                  href={
                    user.website.startsWith("http")
                      ? user.website
                      : `https://${user.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-tiny text-primary hover:text-primary-600 transition-colors truncate"
                  title={user.website}
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  {user.website}
                </a>
              )}
            </div>
          );
        case "email":
          return (
            <EmailListEnhanced
              emails={Array.isArray(user.email) ? user.email : []}
              maxVisible={2}
              searchTerm={filterValue}
            />
          );
        case "phone_number":
          return (
            <PhoneListEnhanced
              phones={Array.isArray(user.phone_number) ? user.phone_number : []}
              maxVisible={2}
              searchTerm={filterValue}
            />
          );
        case "country":
          return (
            <div className="flex flex-col gap-0.5 min-w-0">
              <p
                className="text-small font-medium text-default-700 truncate"
                title={user.country || "No country"}
              >
                {user.country || "N/A"}
              </p>
              {user.city && (
                <p
                  className="text-tiny text-default-500 truncate"
                  title={user.city}
                >
                  {user.city}
                </p>
              )}
            </div>
          );
        case "industry":
          return (
            <p
              className="text-small text-default-700 truncate"
              title={user.industry || "No industry"}
            >
              {user.industry || "N/A"}
            </p>
          );
        case "date_collected":
          return (
            <p
              className="text-small text-default-700 truncate"
              title={user.date_collected || "No date"}
            >
              {user.date_collected
                ? new Date(user.date_collected).toLocaleDateString()
                : "N/A"}
            </p>
          );
        case "actions":
          return (
            <div className="flex gap-2 justify-end">
              <button
                className="text-default-400 cursor-pointer hover:text-primary transition-colors p-1 rounded-small"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleViewUser(user);
                }}
                aria-label={`View details for ${user.full_name || "user"}`}
                type="button"
              >
                <EyeFilledIcon />
              </button>
              <button
                className="text-default-400 cursor-pointer hover:text-warning transition-colors p-1 rounded-small"
                aria-label={`Edit ${user.full_name || "user"}`}
                type="button"
              >
                <EditLinearIcon />
              </button>
              <button
                className="text-default-400 cursor-pointer hover:text-danger transition-colors p-1 rounded-small"
                aria-label={`Delete ${user.full_name || "user"}`}
                type="button"
              >
                <DeleteFilledIcon />
              </button>
            </div>
          );
        default:
          // Type-safe fallback for unknown columns
          const value = user[userKey as keyof Users];
          const displayValue = Array.isArray(value)
            ? value.join(", ")
            : String(value || "N/A");

          return (
            <p
              className="text-small text-default-700 truncate"
              title={displayValue}
            >
              {displayValue}
            </p>
          );
      }
    },
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex items-center gap-4 overflow-auto px-[6px] py-[4px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4">
            <Input
              className="min-w-[200px]"
              endContent={
                <SearchIcon className="text-default-400" width={16} />
              }
              placeholder="Search contacts..."
              size="sm"
              value={filterValue}
              onValueChange={onSearchChange}
            />
            <div>
              <Popover placement="bottom">
                <PopoverTrigger>
                  <Button
                    className="bg-default-100 text-default-800"
                    size="sm"
                    startContent={
                      <Icon
                        className="text-default-400"
                        icon="solar:tuning-2-linear"
                        width={16}
                      />
                    }
                  >
                    Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="flex w-full flex-col gap-6 px-2 py-4">
                    <RadioGroup
                      label="Industry"
                      value={industryFilter}
                      onValueChange={setIndustryFilter}
                    >
                      <Radio value="all">All Industries</Radio>
                      {uniqueIndustries.slice(0, 5).map((industry) => (
                        <Radio key={industry} value={industry || ""}>
                          {industry}
                        </Radio>
                      ))}
                    </RadioGroup>

                    <RadioGroup
                      label="Country"
                      value={countryFilter}
                      onValueChange={setCountryFilter}
                    >
                      <Radio value="all">All Countries</Radio>
                      {uniqueCountries.slice(0, 5).map((country) => (
                        <Radio key={country} value={country || ""}>
                          {country}
                        </Radio>
                      ))}
                    </RadioGroup>

                    <RadioGroup
                      label="Date Collected"
                      value={dateFilter}
                      onValueChange={setDateFilter}
                    >
                      <Radio value="all">All Time</Radio>
                      <Radio value="last7Days">Last 7 days</Radio>
                      <Radio value="last30Days">Last 30 days</Radio>
                      <Radio value="last60Days">Last 60 days</Radio>
                    </RadioGroup>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="bg-default-100 text-default-800"
                    size="sm"
                    startContent={
                      <Icon
                        className="text-default-400"
                        icon="solar:sort-linear"
                        width={16}
                      />
                    }
                  >
                    Sort
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Sort"
                  items={headerColumns.filter(
                    (c) => !["actions"].includes(c.uid),
                  )}
                >
                  {(item) => (
                    <DropdownItem
                      key={item.uid}
                      onPress={() => {
                        setSortDescriptor({
                          column: item.uid,
                          direction:
                            sortDescriptor.direction === "ascending"
                              ? "descending"
                              : "ascending",
                        });
                      }}
                    >
                      {item.name}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
            <div>
              <Dropdown closeOnSelect={false}>
                <DropdownTrigger>
                  <Button
                    className="bg-default-100 text-default-800"
                    size="sm"
                    startContent={
                      <Icon
                        className="text-default-400"
                        icon="solar:sort-horizontal-linear"
                        width={16}
                      />
                    }
                  >
                    Columns
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Columns"
                  items={columns.filter((c) => !["actions"].includes(c.uid))}
                  selectedKeys={visibleColumns}
                  selectionMode="multiple"
                  onSelectionChange={setVisibleColumns}
                >
                  {(item) => (
                    <DropdownItem key={item.uid}>{item.name}</DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          <Divider className="h-5" orientation="vertical" />

          <div className="whitespace-nowrap text-sm text-default-800">
            {filterSelectedKeys === "all"
              ? "All items selected"
              : `${filterSelectedKeys.size} Selected`}
          </div>

          {(filterSelectedKeys === "all" || filterSelectedKeys.size > 0) && (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="bg-default-100 text-default-800"
                  endContent={
                    <Icon
                      className="text-default-400"
                      icon="solar:alt-arrow-down-linear"
                    />
                  }
                  size="sm"
                  variant="flat"
                >
                  Selected Actions
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Selected Actions">
                <DropdownItem key="export">Export contacts</DropdownItem>
                <DropdownItem key="send-email">Send email</DropdownItem>
                <DropdownItem key="bulk-edit">Bulk edit</DropdownItem>
                <DropdownItem key="delete" className="text-danger">
                  Delete contacts
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    filterSelectedKeys,
    headerColumns,
    sortDescriptor,
    industryFilter,
    countryFilter,
    dateFilter,
    uniqueIndustries,
    uniqueCountries,
    onSearchChange,
    setVisibleColumns,
  ]);

  const topBar = useMemo(
    () => (
      <div className="mb-[18px] flex items-center justify-between">
        <div className="flex w-[280px] items-center gap-2">
          <h1 className="text-2xl font-[700] leading-[32px] whitespace-nowrap">
            Contacts
          </h1>
          <Chip
            className="hidden items-center text-default-500 sm:flex"
            size="sm"
            variant="flat"
          >
            {totalItems}
          </Chip>
        </div>
        <Button
          color="primary"
          endContent={<Icon icon="solar:add-circle-bold" width={20} />}
          onPress={onOpen}
        >
          Add Contact
        </Button>
      </div>
    ),
    [onOpen, totalItems],
  );

  const bottomContent = useMemo(() => {
    // Calculate current rows being displayed on this page
    const currentPageRows = userList.length;

    return (
      <div className="flex flex-col items-center justify-between gap-2 px-2 py-2 sm:flex-row">
        <div className="flex items-center gap-4">
          <span className="text-small text-default-400">
            {filterSelectedKeys === "all"
              ? "All items selected"
              : `${filterSelectedKeys.size} of ${currentPageRows} selected`}
          </span>
          <span className="text-small text-default-500">
            {currentPageRows} / {totalItems}
          </span>
        </div>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={totalPages}
          onChange={setPage}
        />
      </div>
    );
  }, [filterSelectedKeys, page, totalPages, userList.length, totalItems]);

  return (
    <DefaultLayout>
      <div className="h-full w-full p-6">
        {topBar}
        <Table
          isHeaderSticky
          aria-label="Enhanced table with improved contact display and filters"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          topContent={topContent}
          topContentPlacement="outside"
          classNames={{
            td: "before:bg-transparent py-3",
            wrapper: "min-h-[400px]",
            table: "min-w-[1200px]",
          }}
          selectedKeys={filterSelectedKeys}
          selectionMode="multiple"
          sortDescriptor={sortDescriptor}
          onSelectionChange={onSelectionChange}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "end" : "start"}
                className={cn([
                  column.uid === "actions"
                    ? "flex items-center justify-end px-[20px] w-[120px]"
                    : "",
                  column.uid === "full_name" ? "min-w-[250px]" : "",
                  column.uid === "job_title"
                    ? "min-w-[120px] max-w-[120px]"
                    : "",
                  column.uid === "company_name" ? "min-w-[200px]" : "",
                  column.uid === "email" ? "min-w-[280px]" : "",
                  column.uid === "phone_number" ? "min-w-[200px]" : "",
                  column.uid === "country" ? "min-w-[150px]" : "",
                ])}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent="No users found"
            items={sortedItems}
            loadingContent="Loading users..."
            loadingState={loading ? "loading" : "idle"}
          >
            {(item: Users) => (
              <TableRow key={item.id}>
                {(columnKey: Key) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Modal
          shouldBlockScroll
          className="rounded-[16px]"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        >
          <ModalContent className="max-w-[1200px] rounded-[16px] p-0">
            <ModalBody className="p-0">
              <MultiStepWizard onClose={onOpenChange} onSuccess={fetchUsers} />
            </ModalBody>
          </ModalContent>
        </Modal>

        <UserDetailsDrawer
          isOpen={isDrawerOpen}
          onOpenChange={onDrawerOpenChange}
          userData={selectedUser}
          searchTerm={filterValue}
        />
      </div>
    </DefaultLayout>
  );
}
