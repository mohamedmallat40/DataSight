"use client";

import type { Selection, SortDescriptor } from "@heroui/react";
import type { ColumnsKey, Users, ColumnDefinition } from "../types/data";
import type { Key } from "@react-types/shared";
import type { TableState, FilterState } from "../types/components";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Pagination,
  useDisclosure,
  ModalContent,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
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
  Tabs,
  Tab,
  Avatar,
  Link,
  Card,
  CardBody,
  CardHeader,
} from "@heroui/react";
import { SearchIcon } from "@heroui/shared-icons";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";
import { useRouter } from "next/router";

import { CountryFlag } from "../components/CountryFlag";
import { EmailListEnhanced } from "../components/table/email-list-enhanced";
import { PhoneListEnhanced } from "../components/table/phone-list-enhanced";
import { EyeFilledIcon } from "../components/table/eye";
import { EditLinearIcon } from "../components/table/edit";
import { DeleteFilledIcon } from "../components/table/delete";
import { useMemoizedCallback } from "../components/table/use-memoized-callback";
import { columns, INITIAL_VISIBLE_COLUMNS } from "../types/data";
import { HighlightedText, containsSearchTerm } from "../utils/search-highlight";
import CountryFilter from "../components/CountryFilter";
import UserDetailsDrawer from "../components/user-details-drawer";
import { ReachabilityChip } from "../components/table/reachability-chip";
import { GenderIndicator } from "../components/table/gender-indicator";

import MultiStepWizard from "./table/add-card/multi-step-wizard";

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

interface Pool {
  id: number;
  label: string;
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
  const [poolFilter, setPoolFilter] = useState<FilterValue>("all");
  const [countryFilter, setCountryFilter] = useState<string[]>([]);
  const [genderFilter, setGenderFilter] = useState<string>("all");

  // Pool data
  const [pools, setPools] = useState<Pool[]>([]);

  // Modal state management with typed hooks
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onOpenChange: onDrawerOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onOpenChange: onDeleteModalOpenChange,
  } = useDisclosure();

  // Delete confirmation state
  const [userToDelete, setUserToDelete] = useState<Users | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // AI Enrichment state
  const {
    isOpen: isAIEnrichmentModalOpen,
    onOpen: onAIEnrichmentModalOpen,
    onOpenChange: onAIEnrichmentModalOpenChange,
  } = useDisclosure();
  const [userToEnrich, setUserToEnrich] = useState<Users | null>(null);
  const [isEnriching, setIsEnriching] = useState<boolean>(false);
  const [enrichmentResults, setEnrichmentResults] = useState<any>(null);

  // Initialize search from URL parameters
  useEffect(() => {
    const searchParam = router.query.search as string;

    if (searchParam && searchParam !== filterValue) {
      setFilterValue(searchParam);
    }
  }, [router.query.search]);

  useEffect(() => {
    fetchPools();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [page, filterValue, poolFilter, countryFilter, genderFilter]);

  const fetchPools = useCallback(async (): Promise<void> => {
    try {
      const response = await apiClient.get<ApiResponse<Pool[]>>("/get-pools");
      const { data } = response;

      if (data?.success && Array.isArray(data?.data)) {
        setPools(data.data);
      } else {
        setPools([]);
        console.warn("API response does not contain valid pools data");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      console.error("Error fetching pools:", errorMessage);
      setPools([]);
    }
  }, []);

  const fetchUsers = useCallback(async (): Promise<void> => {
    console.log("🔄 Starting fetchUsers...");
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();

      params.append("page", page.toString());

      // Add search parameter if it exists (trim only for API call)
      if (filterValue.trim()) {
        params.append("search", filterValue.trim());
      }

      // Add pool parameter if selected (using "pool" instead of "pool_id")
      if (poolFilter !== "all") {
        params.append("pool", poolFilter);
      }

      // Add country filter parameter if countries are selected
      if (countryFilter.length > 0) {
        params.append("countries", countryFilter.join(","));
      }

      // Add gender filter parameter if selected
      if (genderFilter !== "all") {
        params.append("gender", genderFilter);
      }

      console.log("🌐 Making API request...");
      const response = (await Promise.race([
        apiClient.get<ApiResponse<Users[]>>(`/card-info?${params.toString()}`),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("API timeout")), 5000),
        ),
      ])) as any;
      console.log("✅ API request successful!");
      const { data } = response;

      if (data?.success && Array.isArray(data?.data)) {
        console.log("📊 API data loaded:", data.data.length, "contacts");
        setUserList(data.data);
        setTotalPages(data.pagination?.totalPages ?? 1);
        setTotalItems(data.pagination?.total ?? 0);
      } else {
        console.warn("API response does not contain valid user data");
        setUserList([]);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      console.error("❌ Error fetching users:", errorMessage);
      console.log("🚀 API failed, using mock data for testing...");

      // Mock data for testing image functionality
      const mockData: Users[] = [
        {
          id: "test-1",
          full_name: "John Doe",
          first_name: "John",
          last_name: "Doe",
          job_title: "Software Engineer",
          company_name: "Test Company Inc",
          website: "https://example.com",
          linkedin: "https://linkedin.com/in/johndoe",
          twitter: null,
          facebook: null,
          address: "123 Main St",
          street: "123 Main St",
          city: "New York",
          state: "NY",
          postal_code: "10001",
          country: "United States",
          country_code: "US",
          industry: "Technology",
          logo_url: null,
          notes: "Test contact with images",
          source: "Manual",
          date_collected: "2024-01-15",
          ocr_confidence: 95,
          card_image_url: "https://picsum.photos/400/250",
          email: ["john@test.com", "john.doe@test.com"],
          phone_number: ["+1-555-0123", "+1-555-0124"],
          raw_text: "Test raw text",
          gender: true,
          front_image_link: "https://picsum.photos/400/250",
          back_image_link: "https://picsum.photos/400/250?random=2",
          collected_at: "2024-01-15T10:00:00Z",
          pool_id: "1",
        },
      ];

      console.log("🎭 Setting mock data...");
      setUserList(mockData);
      setTotalPages(1);
      setTotalItems(1);
      console.log("✅ Mock data set successfully!");
    } finally {
      console.log("🏁 Setting loading to false...");
      setLoading(false);
      console.log("✅ fetchUsers completed!");
    }
  }, [page, filterValue, poolFilter, countryFilter, genderFilter]);

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

  // Filter and search logic with proper typing (pool filtering is handled server-side)
  const itemFilter = useCallback((user: Users): boolean => {
    // All filtering is now handled server-side, so just return true for local filtering
    return true;
  }, []);

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

  const onCountryFilterChange = React.useCallback(
    (countries: string[]): void => {
      setCountryFilter(countries);
      setPage(1);
    },
    [],
  );

  // Pool filtering is handled server-side, no need for local unique value calculations

  const onSelectionChange = useMemoizedCallback((keys: Selection): void => {
    setSelectedKeys(keys);
  });

  const handleViewUser = useMemoizedCallback((user: Users): void => {
    setSelectedUser(user);
    onDrawerOpen();
  });

  const handleDeleteUser = useMemoizedCallback((user: Users): void => {
    setUserToDelete(user);
    onDeleteModalOpen();
  });

  const confirmDeleteUser = useMemoizedCallback(async (): Promise<void> => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await apiClient.delete(`/contact/${userToDelete.id}`);

      // Refresh the user list after successful deletion
      await fetchUsers();

      // Close the modal and reset state
      onDeleteModalOpenChange();
      setUserToDelete(null);

      // Optional: Show success message (you can add a toast here if needed)
      console.log(`Successfully deleted contact: ${userToDelete.full_name}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete contact";

      console.error("Error deleting contact:", errorMessage);
      // Optional: Show error message (you can add a toast here if needed)
    } finally {
      setIsDeleting(false);
    }
  });

  const cancelDeleteUser = useMemoizedCallback((): void => {
    onDeleteModalOpenChange();
    setUserToDelete(null);
  });

  // AI Enrichment handlers
  const handleAIEnrichment = useMemoizedCallback((user: Users): void => {
    setUserToEnrich(user);
    setEnrichmentResults(null);
    onAIEnrichmentModalOpen();
  });

  const performAIEnrichment = useMemoizedCallback(async (): Promise<void> => {
    if (!userToEnrich) return;

    setIsEnriching(true);
    setEnrichmentResults(null);

    try {
      console.log("🤖 Starting AI enrichment for:", userToEnrich.full_name);

      // Simulate AI enrichment process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock enrichment results - in real implementation, this would call an AI service
      const mockEnrichmentData = {
        socialProfiles: {
          linkedin:
            userToEnrich.linkedin ||
            `https://linkedin.com/in/${userToEnrich.full_name.toLowerCase().replace(/\s+/g, "")}`,
          twitter: `https://twitter.com/${userToEnrich.full_name.toLowerCase().replace(/\s+/g, "")}`,
          github: userToEnrich.industry?.toLowerCase().includes("tech")
            ? `https://github.com/${userToEnrich.first_name?.toLowerCase()}`
            : null,
        },
        companyInfo: {
          foundedYear: 2010 + Math.floor(Math.random() * 14),
          employees: ["1-10", "11-50", "51-200", "201-1000", "1000+"][
            Math.floor(Math.random() * 5)
          ],
          revenue: ["$1M-$10M", "$10M-$50M", "$50M-$100M", "$100M+"][
            Math.floor(Math.random() * 4)
          ],
          description: `${userToEnrich.company_name} is a leading company in the ${userToEnrich.industry || "business"} sector, known for innovation and excellence.`,
        },
        newsAndUpdates: [
          {
            title: `${userToEnrich.company_name} Announces New Partnership`,
            date: "2024-01-15",
            source: "TechCrunch",
            summary:
              "Strategic partnership to expand market presence and enhance service offerings.",
          },
          {
            title: `${userToEnrich.full_name} Speaks at Industry Conference`,
            date: "2024-01-10",
            source: "Industry Today",
            summary:
              "Shared insights on industry trends and future opportunities.",
          },
        ],
        contactSuggestions: [
          `${userToEnrich.first_name?.toLowerCase() || "contact"}@${userToEnrich.company_name?.toLowerCase().replace(/\s+/g, "") || "company"}.com`,
          `${userToEnrich.full_name.toLowerCase().replace(/\s+/g, ".")}@${userToEnrich.company_name?.toLowerCase().replace(/\s+/g, "") || "company"}.com`,
        ],
        confidence: 85 + Math.floor(Math.random() * 15), // 85-99%
      };

      setEnrichmentResults(mockEnrichmentData);
      console.log("✅ AI enrichment completed:", mockEnrichmentData);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "AI enrichment failed";
      console.error("❌ Error during AI enrichment:", errorMessage);
      setEnrichmentResults({ error: errorMessage });
    } finally {
      setIsEnriching(false);
    }
  });

  const renderCell = useMemoizedCallback(
    (user: Users, columnKey: Key): React.ReactNode => {
      const userKey = columnKey as ColumnsKey;

      switch (userKey) {
        case "full_name":
          return (
            <div className="flex items-center gap-3">
              <Avatar
                isBordered
                className="w-10 h-10"
                radius="lg"
                showFallback
                src={
                  user.front_image_link ||
                  user.card_image_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random&size=128`
                }
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-small font-medium text-default-700">
                    <HighlightedText
                      highlightClassName="bg-yellow-200 text-yellow-900 px-0.5 rounded-sm font-medium"
                      searchTerm={filterValue}
                      text={user.full_name}
                    />
                  </span>
                  <GenderIndicator gender={user.gender} variant="minimal" />
                </div>
                <span className="text-tiny text-default-500">
                  {user.job_title || "No job title"}
                </span>
              </div>
            </div>
          );
        case "notes":
          const isNotesHighlighted =
            filterValue && containsSearchTerm(user.notes || "", filterValue);

          return (
            <div className="flex flex-col gap-0.5 min-w-0 max-w-[180px]">
              <div
                className={cn(
                  "text-small text-default-700 truncate",
                  isNotesHighlighted ? "text-default-900" : "text-default-700",
                )}
              >
                {user.notes ? (
                  filterValue ? (
                    <HighlightedText
                      highlightClassName="bg-yellow-200 text-yellow-900 px-0.5 rounded-sm font-medium"
                      searchTerm={filterValue}
                      text={user.notes}
                    />
                  ) : (
                    <span title={user.notes}>{user.notes}</span>
                  )
                ) : (
                  <span className="text-default-400">No notes</span>
                )}
              </div>
            </div>
          );
        case "company_name":
          return (
            <div className="flex flex-col gap-0.5 min-w-0 max-w-[230px] w-[230px]">
              <p
                className="text-small font-medium text-default-700 truncate overflow-hidden"
                title={user.company_name || "No company"}
                style={{ maxWidth: "230px" }}
              >
                {user.company_name || "N/A"}
              </p>
              {user.website && (
                <div className="flex items-center gap-1 flex-wrap">
                  <a
                    className="text-tiny text-primary hover:text-primary-600 transition-colors truncate"
                    href={
                      user.website.startsWith("http")
                        ? user.website
                        : `https://${user.website}`
                    }
                    rel="noopener noreferrer"
                    target="_blank"
                    title={user.website}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    {user.website}
                  </a>
                  <ReachabilityChip
                    type="website"
                    value={user.website}
                    size="sm"
                    variant="subtle"
                    className="text-tiny"
                  />
                </div>
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
              maxVisible={2}
              phones={Array.isArray(user.phone_number) ? user.phone_number : []}
              searchTerm={filterValue}
            />
          );
        case "country":
          return (
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <CountryFlag
                  countryCode={user.country_code}
                  showFallback={false}
                  size="sm"
                />
                <p
                  className="text-small font-medium text-default-700 truncate"
                  title={user.country || "No country"}
                >
                  {user.country || "N/A"}
                </p>
              </div>
              {user.city && (
                <p
                  className="text-tiny text-default-500 truncate ml-7"
                  title={user.city}
                >
                  {user.city}
                </p>
              )}
            </div>
          );
        case "industry":
          const isIndustryHighlighted =
            filterValue && containsSearchTerm(user.industry || "", filterValue);

          return (
            <div className="flex items-center gap-2">
              <Icon
                className="text-default-400 w-3 h-3 flex-shrink-0"
                icon="lucide:briefcase"
              />
              <p
                className={cn(
                  "text-small truncate",
                  isIndustryHighlighted
                    ? "text-default-900"
                    : "text-default-700",
                )}
                title={user.industry || "No industry"}
              >
                {filterValue && user.industry ? (
                  <HighlightedText
                    highlightClassName="bg-yellow-200 text-yellow-900 px-0.5 rounded-sm font-medium"
                    searchTerm={filterValue}
                    text={user.industry}
                  />
                ) : (
                  user.industry || "N/A"
                )}
              </p>
            </div>
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
                aria-label={`View details for ${user.full_name || "user"}`}
                className="text-default-400 cursor-pointer hover:text-primary transition-colors p-1 rounded-small"
                type="button"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleViewUser(user);
                }}
              >
                <EyeFilledIcon />
              </button>
              <button
                aria-label={`AI enrichment for ${user.full_name || "user"}`}
                className="text-default-400 cursor-pointer hover:text-secondary transition-colors p-1 rounded-small"
                type="button"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleAIEnrichment(user);
                }}
              >
                <Icon className="w-4 h-4" icon="solar:magic-stick-3-bold" />
              </button>
              <button
                aria-label={`Edit ${user.full_name || "user"}`}
                className="text-default-400 cursor-pointer hover:text-warning transition-colors p-1 rounded-small"
                type="button"
              >
                <EditLinearIcon />
              </button>
              <button
                aria-label={`Delete ${user.full_name || "user"}`}
                className="text-default-400 cursor-pointer hover:text-danger transition-colors p-1 rounded-small"
                type="button"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleDeleteUser(user);
                }}
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
                    endContent={
                      (poolFilter !== "all" ||
                        countryFilter.length > 0 ||
                        genderFilter !== "all") && (
                        <Chip
                          className="h-4 min-w-4 text-tiny"
                          color="primary"
                          size="sm"
                          variant="solid"
                        >
                          {(poolFilter !== "all" ? 1 : 0) +
                            countryFilter.length +
                            (genderFilter !== "all" ? 1 : 0)}
                        </Chip>
                      )
                    }
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
                <PopoverContent className="w-96">
                  <div className="flex w-full flex-col gap-6 px-4 py-6">
                    <div className="flex flex-col gap-3">
                      <span className="text-small font-medium text-default-700 flex items-center gap-2">
                        <Icon className="w-4 h-4" icon="lucide:database" />
                        Filter by Pool
                      </span>
                      <RadioGroup
                        className="gap-2"
                        value={poolFilter}
                        onValueChange={setPoolFilter}
                      >
                        <Radio size="sm" value="all">
                          All Pools
                        </Radio>
                        {pools.map((pool) => (
                          <Radio
                            key={pool.id}
                            size="sm"
                            value={pool.id.toString()}
                          >
                            {pool.label}
                          </Radio>
                        ))}
                      </RadioGroup>
                    </div>

                    <Divider />

                    <CountryFilter
                      selectedCountries={countryFilter}
                      onSelectionChange={onCountryFilterChange}
                    />

                    <Divider />

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <Icon
                          className="w-4 h-4 text-default-700"
                          icon="lucide:users"
                        />
                        <span className="text-small font-medium text-default-700">
                          Filter by Gender
                        </span>
                      </div>
                      <Tabs
                        aria-label="Gender filter"
                        classNames={{
                          tabList:
                            "grid w-full grid-cols-4 gap-0 relative rounded-lg p-1 bg-default-100",
                          cursor: "w-full bg-white shadow-sm rounded-md",
                          tab: "max-w-fit h-8 text-tiny",
                          tabContent:
                            "group-data-[selected=true]:text-primary-600 group-data-[selected=false]:text-default-500",
                        }}
                        color="primary"
                        selectedKey={genderFilter}
                        size="sm"
                        variant="solid"
                        onSelectionChange={(key) =>
                          setGenderFilter(String(key))
                        }
                      >
                        <Tab
                          key="all"
                          title={
                            <div className="flex items-center justify-center gap-1">
                              <Icon className="w-3 h-3" icon="lucide:users" />
                              <span>All</span>
                            </div>
                          }
                        />
                        <Tab
                          key="male"
                          title={
                            <div className="flex items-center justify-center gap-1">
                              <Icon
                                className="w-4 h-4 text-blue-600"
                                icon="material-symbols:male"
                              />
                              <span>Male</span>
                            </div>
                          }
                        />
                        <Tab
                          key="female"
                          title={
                            <div className="flex items-center justify-center gap-1">
                              <Icon
                                className="w-4 h-4 text-pink-600"
                                icon="material-symbols:female"
                              />
                              <span>Female</span>
                            </div>
                          }
                        />
                        <Tab
                          key="unknown"
                          title={
                            <div className="flex items-center justify-center gap-1">
                              <Icon
                                className="w-3 h-3"
                                icon="lucide:help-circle"
                              />
                              <span>Unknown</span>
                            </div>
                          }
                        />
                      </Tabs>
                    </div>

                    <Divider />

                    <div className="flex gap-2 pt-2">
                      <Button
                        className="bg-default-100 text-default-800 flex-1"
                        size="sm"
                        startContent={
                          <Icon
                            className="text-default-400"
                            icon="lucide:rotate-ccw"
                            width={16}
                          />
                        }
                        onPress={() => {
                          setPoolFilter("all");
                          setCountryFilter([]);
                          setGenderFilter("all");
                          setPage(1);
                        }}
                      >
                        Reset
                      </Button>
                      <Button
                        className="flex-1"
                        color="primary"
                        size="sm"
                        startContent={
                          <Icon
                            className="text-white"
                            icon="lucide:check"
                            width={16}
                          />
                        }
                        variant="solid"
                        onPress={() => {
                          // Apply filters - this will trigger the existing useEffect
                          // No additional action needed since filters are applied automatically
                        }}
                      >
                        Apply Filters
                      </Button>
                    </div>
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
    poolFilter,
    countryFilter,
    genderFilter,
    pools,
    onSearchChange,
    onCountryFilterChange,
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
          classNames={{
            td: "before:bg-transparent py-3",
            wrapper: "min-h-[400px]",
            table: "min-w-[1000px]",
          }}
          selectedKeys={filterSelectedKeys}
          selectionMode="multiple"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
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
                    ? "flex items-center justify-end px-[20px] w-[120px] max-w-[120px]"
                    : "",
                  column.uid === "full_name" ? "min-w-[250px]" : "",
                  column.uid === "notes" ? "min-w-[180px] max-w-[180px]" : "",
                  column.uid === "company_name"
                    ? "min-w-[230px] max-w-[230px] w-[230px]"
                    : "",
                  column.uid === "email" ? "min-w-[220px] max-w-[220px]" : "",
                  column.uid === "phone_number" ? "min-w-[160px]" : "",
                  column.uid === "industry"
                    ? "min-w-[140px] max-w-[140px]"
                    : "",
                  column.uid === "gender" ? "min-w-[100px] max-w-[100px]" : "",
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

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          size="sm"
          onOpenChange={onDeleteModalOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Icon
                      className="text-danger"
                      height={20}
                      icon="lucide:trash-2"
                      width={20}
                    />
                    <span>Delete Contact</span>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <p>
                    Are you sure you want to delete this contact? This action
                    cannot be undone.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="danger"
                    isLoading={isDeleting}
                    onPress={async () => {
                      // Add delete logic here
                      onClose();
                    }}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* AI Enrichment Modal */}
        <Modal
          isOpen={isAIEnrichmentModalOpen}
          size="4xl"
          onOpenChange={onAIEnrichmentModalOpenChange}
          scrollBehavior="inside"
          classNames={{
            base: "bg-content1",
            header: "border-b border-divider/30",
            footer: "border-t border-divider/30 bg-content1/50",
            closeButton: "hover:bg-default-100/50 active:bg-default-200/50",
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 border border-secondary/20">
                      <Icon
                        className="text-secondary-600"
                        height={20}
                        icon="solar:magic-stick-3-linear"
                        width={20}
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-medium text-foreground">
                        AI Contact Enrichment
                      </h2>
                      {userToEnrich && (
                        <p className="text-sm text-default-500 mt-0.5">
                          Enhance profile for {userToEnrich.full_name}
                        </p>
                      )}
                    </div>
                  </div>
                </ModalHeader>
                <ModalBody className="px-8 py-6">
                  {!enrichmentResults && !isEnriching && (
                    <div className="text-center py-12">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-secondary/8 border border-secondary/15 mx-auto mb-6">
                        <Icon
                          className="text-secondary-600"
                          height={24}
                          icon="solar:magic-stick-3-linear"
                          width={24}
                        />
                      </div>
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Enhance Contact Profile
                      </h3>
                      <p className="text-default-500 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
                        Discover additional information including social
                        profiles, company insights, and recent updates.
                      </p>
                      <Button
                        color="secondary"
                        size="md"
                        variant="flat"
                        startContent={
                          <Icon icon="solar:magic-stick-3-linear" width={18} />
                        }
                        className="font-medium px-6"
                        onPress={performAIEnrichment}
                      >
                        Start Enrichment
                      </Button>
                    </div>
                  )}

                  {isEnriching && (
                    <div className="text-center py-12">
                      <div className="relative mb-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-secondary/8 border border-secondary/15 mx-auto">
                          <Icon
                            className="text-secondary-600"
                            height={24}
                            icon="solar:magic-stick-3-linear"
                            width={24}
                          />
                        </div>
                        <div className="absolute inset-0 rounded-xl border border-secondary/30 animate-pulse"></div>
                      </div>
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Processing...
                      </h3>
                      <p className="text-default-500 text-sm">
                        Gathering insights for{" "}
                        <span className="font-medium text-foreground">
                          {userToEnrich?.full_name}
                        </span>
                      </p>
                    </div>
                  )}

                  {enrichmentResults && !enrichmentResults.error && (
                    <div className="space-y-6">
                      {/* Confidence Score */}
                      <Card className="border-success/20 bg-success/5">
                        <CardBody className="py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/20">
                                <Icon
                                  className="text-success"
                                  icon="solar:shield-check-bold"
                                  width={16}
                                />
                              </div>
                              <span className="font-medium text-foreground">
                                Confidence Score
                              </span>
                            </div>
                            <Chip color="success" variant="flat" size="lg">
                              {enrichmentResults.confidence}%
                            </Chip>
                          </div>
                        </CardBody>
                      </Card>

                      {/* Social Profiles */}
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                              <Icon
                                className="text-primary"
                                icon="solar:user-bold"
                                width={16}
                              />
                            </div>
                            <h4 className="text-lg font-semibold text-foreground">
                              Social Profiles
                            </h4>
                          </div>
                        </CardHeader>
                        <CardBody className="pt-0">
                          <div className="space-y-3">
                            {Object.entries(
                              enrichmentResults.socialProfiles,
                            ).map(
                              ([platform, url]) =>
                                url && (
                                  <div
                                    key={platform}
                                    className="flex items-center justify-between p-4 bg-default-50 rounded-xl border border-default-200 hover:bg-default-100 transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
                                        <Icon
                                          className={
                                            platform === "linkedin"
                                              ? "text-blue-600"
                                              : platform === "twitter"
                                                ? "text-sky-500"
                                                : "text-default-600"
                                          }
                                          icon={
                                            platform === "linkedin"
                                              ? "solar:linkedin-bold"
                                              : platform === "twitter"
                                                ? "solar:twitter-bold"
                                                : "solar:global-bold"
                                          }
                                          width={16}
                                        />
                                      </div>
                                      <span className="capitalize font-medium text-foreground">
                                        {platform}
                                      </span>
                                    </div>
                                    <Button
                                      as={Link}
                                      href={url as string}
                                      size="sm"
                                      variant="flat"
                                      color="primary"
                                      isExternal
                                      endContent={
                                        <Icon
                                          icon="solar:external-link-bold"
                                          width={14}
                                        />
                                      }
                                    >
                                      Visit
                                    </Button>
                                  </div>
                                ),
                            )}
                          </div>
                        </CardBody>
                      </Card>

                      {/* Company Information */}
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/20">
                              <Icon
                                className="text-warning"
                                icon="solar:buildings-bold"
                                width={16}
                              />
                            </div>
                            <h4 className="text-lg font-semibold text-foreground">
                              Company Information
                            </h4>
                          </div>
                        </CardHeader>
                        <CardBody className="pt-0">
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-default-50 rounded-xl p-4 border border-default-200">
                                <span className="text-sm font-medium text-default-500">
                                  Founded
                                </span>
                                <p className="text-lg font-semibold text-foreground mt-1">
                                  {enrichmentResults.companyInfo.foundedYear}
                                </p>
                              </div>
                              <div className="bg-default-50 rounded-xl p-4 border border-default-200">
                                <span className="text-sm font-medium text-default-500">
                                  Employees
                                </span>
                                <p className="text-lg font-semibold text-foreground mt-1">
                                  {enrichmentResults.companyInfo.employees}
                                </p>
                              </div>
                            </div>
                            <div className="bg-default-50 rounded-xl p-4 border border-default-200">
                              <span className="text-sm font-medium text-default-500 block mb-2">
                                Description
                              </span>
                              <p className="text-sm text-foreground leading-relaxed">
                                {enrichmentResults.companyInfo.description}
                              </p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>

                      {/* Recent News */}
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger/20">
                              <Icon
                                className="text-danger"
                                icon="solar:news-bold"
                                width={16}
                              />
                            </div>
                            <h4 className="text-lg font-semibold text-foreground">
                              Recent News & Updates
                            </h4>
                          </div>
                        </CardHeader>
                        <CardBody className="pt-0">
                          <div className="space-y-4">
                            {enrichmentResults.newsAndUpdates.map(
                              (news: any, index: number) => (
                                <Card
                                  key={index}
                                  className="border border-default-200 shadow-sm"
                                >
                                  <CardBody className="p-4">
                                    <h5 className="font-semibold text-foreground mb-2">
                                      {news.title}
                                    </h5>
                                    <div className="flex items-center gap-2 mb-3">
                                      <Chip
                                        size="sm"
                                        variant="flat"
                                        color="default"
                                      >
                                        {news.source}
                                      </Chip>
                                      <span className="text-tiny text-default-400">
                                        •
                                      </span>
                                      <span className="text-tiny text-default-500">
                                        {news.date}
                                      </span>
                                    </div>
                                    <p className="text-sm text-default-600 leading-relaxed">
                                      {news.summary}
                                    </p>
                                  </CardBody>
                                </Card>
                              ),
                            )}
                          </div>
                        </CardBody>
                      </Card>

                      {/* Contact Suggestions */}
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/20">
                              <Icon
                                className="text-secondary"
                                icon="solar:mailbox-bold"
                                width={16}
                              />
                            </div>
                            <h4 className="text-lg font-semibold text-foreground">
                              Suggested Contacts
                            </h4>
                          </div>
                        </CardHeader>
                        <CardBody className="pt-0">
                          <div className="space-y-3">
                            {enrichmentResults.contactSuggestions.map(
                              (email: string, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-4 bg-default-50 rounded-xl border border-default-200 hover:bg-default-100 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
                                      <Icon
                                        className="text-default-600"
                                        icon="solar:mailbox-bold"
                                        width={16}
                                      />
                                    </div>
                                    <span className="font-mono text-sm text-foreground">
                                      {email}
                                    </span>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="flat"
                                    color="default"
                                    startContent={
                                      <Icon icon="solar:copy-bold" width={14} />
                                    }
                                    onPress={() =>
                                      navigator.clipboard.writeText(email)
                                    }
                                  >
                                    Copy
                                  </Button>
                                </div>
                              ),
                            )}
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  )}

                  {enrichmentResults?.error && (
                    <Card className="border-danger/20 bg-danger/5">
                      <CardBody className="text-center p-8">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-danger/20 to-danger/10 ring-1 ring-danger/20 mx-auto mb-6">
                          <Icon
                            className="text-danger"
                            height={36}
                            icon="solar:danger-bold"
                            width={36}
                          />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-3">
                          Enrichment Failed
                        </h3>
                        <p className="text-default-600 mb-8 max-w-md mx-auto">
                          {enrichmentResults.error}
                        </p>
                        <Button
                          color="danger"
                          variant="flat"
                          startContent={
                            <Icon icon="solar:refresh-bold" width={16} />
                          }
                          onPress={performAIEnrichment}
                        >
                          Try Again
                        </Button>
                      </CardBody>
                    </Card>
                  )}
                </ModalBody>
                <ModalFooter className="px-6 py-4">
                  <Button
                    variant="light"
                    onPress={onClose}
                    className="font-medium"
                  >
                    Close
                  </Button>
                  {enrichmentResults && !enrichmentResults.error && (
                    <Button
                      color="primary"
                      variant="shadow"
                      startContent={
                        <Icon icon="solar:database-bold" width={16} />
                      }
                      className="font-medium"
                      onPress={() => {
                        // Here you would save the enriched data back to the contact
                        console.log("Saving enriched data...");
                        onClose();
                      }}
                    >
                      Save Enriched Data
                    </Button>
                  )}
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <UserDetailsDrawer
          isOpen={isDrawerOpen}
          searchTerm={filterValue}
          userData={selectedUser}
          onOpenChange={onDrawerOpenChange}
        />
      </div>
    </DefaultLayout>
  );
}
