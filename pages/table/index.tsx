"use client";

import type { Selection, SortDescriptor } from "@heroui/react";
import type { ColumnsKey, Users } from "../../types/data";
import type { Key } from "@react-types/shared";

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

import { CopyText } from "../../components/table/copy-text";
import { EmailList } from "../../components/table/email-list";
import { PhoneList } from "../../components/table/phone-list";
import { EyeFilledIcon } from "../../components/table/eye";
import { EditLinearIcon } from "../../components/table/edit";
import { DeleteFilledIcon } from "../../components/table/delete";
import { useMemoizedCallback } from "../../components/table/use-memoized-callback";
import { columns, INITIAL_VISIBLE_COLUMNS } from "../../types/data";

import MultiStepWizard from "./add-card/multi-step-wizard";
import UserDetailsDrawer from "../../components/user-details-drawer";

import apiClient from "@/config/api";

export default function Component(): JSX.Element {
  const [userList, setUserList] = useState<Users[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "full_name",
    direction: "ascending",
  });
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set<Key>());
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set<ColumnsKey>(INITIAL_VISIBLE_COLUMNS),
  );
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);

  // Filter states
  const [filterValue, setFilterValue] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onOpenChange: onDrawerOpenChange,
  } = useDisclosure();

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const { data } = await apiClient.get(`/card-info?page=${page}`);

      if (data?.success && Array.isArray(data?.data)) {
        setUserList(data.data);
        setTotalPages(data.pagination?.totalPages ?? 1);
        setTotalItems(data.pagination?.total ?? 0);
      } else {
        setUserList([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUserList([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns
      .map((item) =>
        item.uid === sortDescriptor.column
          ? { ...item, sortDirection: sortDescriptor.direction }
          : item,
      )
      .filter((column) => (visibleColumns as Set<Key>).has(column.uid));
  }, [visibleColumns, sortDescriptor]);

  // Filter and search logic
  const itemFilter = useCallback(
    (user: Users) => {
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
    [industryFilter, countryFilter, dateFilter],
  );

  const filteredItems = useMemo(() => {
    let filtered = [...userList];

    // Apply search filter
    if (filterValue) {
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
  }, [userList, filterValue, itemFilter]);

  const items = useMemo(() => filteredItems, [filteredItems]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
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
  }, [items, sortDescriptor]);

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

  // Search and filter functions
  const onSearchChange = useMemoizedCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  });

  // Get unique values for filter options
  const uniqueIndustries = useMemo(() => {
    const industries = userList
      .map((user) => user.industry)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
    return industries.sort();
  }, [userList]);

  const uniqueCountries = useMemo(() => {
    const countries = userList
      .map((user) => user.country)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
    return countries.sort();
  }, [userList]);

  const onSelectionChange = useMemoizedCallback((keys: Selection) => {
    setSelectedKeys(keys);
  });

  const handleViewUser = useMemoizedCallback((user: Users) => {
    setSelectedUser(user);
    onDrawerOpen();
  });

  const renderCell = useMemoizedCallback(
    (user: Users, columnKey: Key): React.ReactNode => {
      const userKey = columnKey as ColumnsKey;

      switch (userKey) {
        case "full_name":
          return (
            <User
              avatarProps={{ radius: "lg", name: user.full_name }}
              description={user.job_title || user.company_name || ""}
              name={user.full_name}
              classNames={{
                wrapper: "min-w-0",
                description: "truncate max-w-[200px]",
                name: "truncate max-w-[200px]",
              }}
            />
          );
        case "job_title":
          return (
            <div className="flex flex-col gap-0.5 min-w-0 max-w-[120px]">
              <p
                className="text-small font-medium text-default-700 truncate"
                title={user.job_title}
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
                title={user.company_name}
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
                >
                  {user.website}
                </a>
              )}
            </div>
          );
        case "email":
          return (
            <EmailList
              emails={
                Array.isArray(user.email)
                  ? user.email
                  : user.email
                    ? [user.email]
                    : []
              }
              maxVisible={2}
            />
          );
        case "phone_number":
          return (
            <PhoneList
              phones={
                Array.isArray(user.phone_number)
                  ? user.phone_number
                  : user.phone_number
                    ? [user.phone_number]
                    : []
              }
              maxVisible={2}
            />
          );
        case "country":
          return (
            <div className="flex flex-col gap-0.5 min-w-0">
              <p
                className="text-small font-medium text-default-700 truncate"
                title={user.country}
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
        case "actions":
          return (
            <div className="flex gap-2 justify-end">
              <button
                className="text-default-400 cursor-pointer hover:text-primary transition-colors p-1 rounded-small"
                onClick={() => handleViewUser(user)}
                aria-label={`View details for ${user.full_name}`}
              >
                <EyeFilledIcon />
              </button>
              <EditLinearIcon className="text-default-400 cursor-pointer" />
              <DeleteFilledIcon className="text-default-400 cursor-pointer" />
            </div>
          );
        default:
          return (
            <p
              className="text-small text-default-700 truncate"
              title={String(user[userKey as keyof Users] || "")}
            >
              {user[userKey as keyof Users] ?? "N/A"}
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
                        <Radio key={country} value={country}>
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
            Team Members
          </h1>
          <Chip
            className="hidden items-center text-default-500 sm:flex"
            size="sm"
            variant="flat"
          >
            {filteredItems.length}
          </Chip>
        </div>
        <Button
          color="primary"
          endContent={<Icon icon="solar:add-circle-bold" width={20} />}
          onPress={onOpen}
        >
          Add Member
        </Button>
      </div>
    ),
    [onOpen, filteredItems.length],
  );

  const bottomContent = useMemo(
    () => (
      <div className="flex flex-col items-center justify-between gap-2 px-2 py-2 sm:flex-row">
        <div className="flex items-center gap-4">
          <span className="text-small text-default-400">
            {filterSelectedKeys === "all"
              ? "All items selected"
              : `${filterSelectedKeys.size} of ${filteredItems.length} selected`}
          </span>
          {filterValue && (
            <span className="text-small text-default-500">
              Showing {filteredItems.length} of {userList.length} contacts
            </span>
          )}
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
    ),
    [
      filterSelectedKeys,
      page,
      totalPages,
      filteredItems.length,
      userList.length,
      filterValue,
    ],
  );

  return (
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
          {(column: any) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "end" : "start"}
              className={cn([
                column.uid === "actions"
                  ? "flex items-center justify-end px-[20px] w-[120px]"
                  : "",
                column.uid === "full_name" ? "min-w-[250px]" : "",
                column.uid === "job_title" ? "min-w-[120px] max-w-[120px]" : "",
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
        <TableBody emptyContent="No users found" items={sortedItems}>
          {(item: any) => (
            <TableRow key={item.id}>
              {(columnKey: any) => (
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
            <MultiStepWizard onClose={onOpenChange} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <UserDetailsDrawer
        isOpen={isDrawerOpen}
        onOpenChange={onDrawerOpenChange}
        userData={selectedUser}
      />
    </div>
  );
}
