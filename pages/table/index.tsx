"use client";

import type { Selection, SortDescriptor } from "@heroui/react";
import type { ColumnsKey, Users, Column } from "../../types/data";
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
  Skeleton,
} from "@heroui/react";

import { SearchIcon } from "@heroui/shared-icons";
import React, { useMemo, useState, useEffect, useCallback, JSX } from "react";

import { CopyText } from "../../components/table/copy-text";
import { EyeFilledIcon } from "../../components/table/eye";
import { EditLinearIcon } from "../../components/table/edit";
import { DeleteFilledIcon } from "../../components/table/delete";
import { useMemoizedCallback } from "../../components/table/use-memoized-callback";
import { columns, INITIAL_VISIBLE_COLUMNS } from "../../types/data";

import MultiStepWizard from "./add-card/multi-step-wizard";
import UserDetailsDrawer from "../../components/user-details-drawer";

import apiClient from "@/config/api";
import { Icon } from "@iconify/react";

const getPrimary = (list?: string[]): string =>
  Array.isArray(list) && list.length > 0 ? list[0] : "N/A";

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
    new Set<ColumnsKey>(INITIAL_VISIBLE_COLUMNS)
  );
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onOpenChange: onDrawerOpenChange,
  } = useDisclosure();

  const fetchUsers = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const { data } = await apiClient.get(`/card-info?page=${page}`);

      if (data?.success && Array.isArray(data?.data)) {
        setUserList(data.data);
        setTotalPages(data.pagination?.totalPages ?? 1);
        setTotalItems(data.pagination?.total ?? 0);
      } else {
        console.log("No data or unsuccessful response"); // Debug log
        setUserList([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUserList([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Fixed: Call fetchUsers on initial mount and page changes
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const headerColumns = useMemo((): Column[] => {
    if (visibleColumns === "all") return [...columns];

    return columns
      .map((item) =>
        item.uid === sortDescriptor.column
          ? { ...item, sortDirection: sortDescriptor.direction }
          : item
      )
      .filter((col) => (visibleColumns as Set<Key>).has(col.uid));
  }, [visibleColumns, sortDescriptor]);

  const sortedItems = useMemo((): Users[] => {
    return [...userList].sort((a, b) => {
      const col = sortDescriptor.column as keyof Users;
      let first = a[col];
      let second = b[col];

      if (col === "email" || col === "phone_number") {
        first = getPrimary(a[col] as string[]);
        second = getPrimary(b[col] as string[]);
      }

      const cmp = first! < second! ? -1 : first! > second! ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [userList, sortDescriptor]);

  const filterSelectedKeys = useMemo((): Selection => {
    if (selectedKeys === "all") return selectedKeys;

    const resultKeys = new Set<Key>();
    for (const item of userList) {
      if ((selectedKeys as Set<string>).has(String(item.id))) {
        resultKeys.add(String(item.id));
      }
    }
    return resultKeys;
  }, [selectedKeys, userList]);

  const onSelectionChange = useMemoizedCallback((keys: Selection): void => {
    setSelectedKeys(keys);
  });

  const handleViewUser = useMemoizedCallback((user: Users) => {
    setSelectedUser(user);
    onDrawerOpen();
  });

  const renderCell = useMemoizedCallback(
    (user: Users, columnKey: Key): React.ReactNode => {
      const key = columnKey as ColumnsKey;

      // If this is a skeleton item (loading state), return appropriate placeholder content
      if (user.id.startsWith("skeleton-")) {
        switch (key) {
          case "full_name":
            return (
              <User
                avatarProps={{ radius: "lg", name: "" }}
                name=""
                description=""
                className="skeleton-placeholder"
              />
            );
          case "email":
          case "phone_number":
            return <CopyText>---</CopyText>;
          case "actions":
            return (
              <div className="flex gap-2 justify-end">
                <EyeFilledIcon className="text-default-400 cursor-pointer" />
                <EditLinearIcon className="text-default-400 cursor-pointer" />
                <DeleteFilledIcon className="text-default-400 cursor-pointer" />
              </div>
            );
          default:
            return "---";
        }
      }

      // Regular rendering for actual data
      switch (key) {
        case "full_name":
          return (
            <User
              avatarProps={{ radius: "lg", name: user.full_name }}
              description={
                Array.isArray(user.email) ? (user.email[0] ?? "") : ""
              }
              name={user.full_name}
            />
          );
        case "email":
        case "phone_number":
          return (
            <CopyText>
              {Array.isArray(user[key]) ? user[key].join(", ") : "N/A"}
            </CopyText>
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
          return user[key] ?? "N/A";
      }
    }
  );

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
            {totalItems}
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
    [onOpen, userList.length]
  );

  const bottomContent = useMemo(
    () => (
      <div className="flex justify-between items-center px-2 py-2">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={totalPages}
          onChange={setPage}
        />
        <span className="text-sm text-default-400">
          Page {page} of {totalPages}
        </span>
      </div>
    ),
    [page, totalPages]
  );

  // Create skeleton items for loading state that match Users type
  const skeletonItems = useMemo((): Users[] => {
    return Array.from({ length: 5 }).map((_, idx) => ({
      id: `skeleton-${idx}`,
      full_name: "",
      first_name: null,
      last_name: null,
      job_title: "",
      company_name: "",
      website: "",
      linkedin: "",
      twitter: null,
      facebook: null,
      address: "",
      street: null,
      city: "",
      state: null,
      postal_code: null,
      country: "",
      industry: null,
      logo_url: null,
      notes: null,
      source: null,
      date_collected: null,
      ocr_confidence: null,
      card_image_url: null,
      email: [],
      phone_number: [],
      raw_text: "",
      gender: null,
      front_image_link: null,
      back_image_link: null,
      collected_at: null,
    }));
  }, []);

  // Use skeleton items when loading AND no data, otherwise use sorted items
  const tableItems =
    loading && sortedItems.length === 0 ? skeletonItems : sortedItems;

  return (
    <div className="h-full w-full p-6">
      {topBar}
      <Table
        isHeaderSticky
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{ td: "before:bg-transparent" }}
        selectedKeys={filterSelectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContentPlacement="outside"
        onSelectionChange={onSelectionChange}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column: Column) => (
            <TableColumn
              key={column.uid}
              style={{
                width: column.width ?? "auto",
                minWidth: column.width,
                ...(column.uid === "actions"
                  ? {
                      position: "sticky",
                      right: 0,
                      background: "white",
                      zIndex: 10,
                    }
                  : {}),
              }}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody
          emptyContent={loading ? "Loading..." : "No users found"}
          items={tableItems}
        >
          {(item: Users) => (
            <TableRow key={item.id}>
              {(columnKey: Key) => (
                <TableCell>
                  <Skeleton
                    isLoaded={!loading || !item.id.startsWith("skeleton-")}
                    className="rounded-lg"
                  >
                    {renderCell(item, columnKey)}
                  </Skeleton>
                </TableCell>
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
