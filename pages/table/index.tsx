"use client";

import type { Selection, SortDescriptor } from "@heroui/react";
import type { ColumnsKey, Users } from "../../types/data";
import type { Key } from "@react-types/shared";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Chip,
  User,
  Pagination,
  Tooltip,
  useDisclosure,
  ModalContent,
  Modal,
  ModalBody,
} from "@heroui/react";

import { SearchIcon } from "@heroui/shared-icons";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

import { CopyText } from "../../components/table/copy-text";
import { EyeFilledIcon } from "../../components/table/eye";
import { EditLinearIcon } from "../../components/table/edit";
import { DeleteFilledIcon } from "../../components/table/delete";
import { ArrowDownIcon } from "../../components/table/arrow-down";
import { ArrowUpIcon } from "../../components/table/arrow-up";

import { useMemoizedCallback } from "../../components/table/use-memoized-callback";
import { columns, INITIAL_VISIBLE_COLUMNS } from "../../types/data";
import apiClient from "@/config/api";
import MultiStepWizard from "./add-card/multi-step-wizard";

export default function Component(): JSX.Element {
  // States
  const [userList, setUserList] = useState<Users[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "full_name",
    direction: "ascending",
  });
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set<Key>());
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set<ColumnsKey>(INITIAL_VISIBLE_COLUMNS)
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Fetch users on page change
  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const { data } = await apiClient.get(`/card-info?page=${page}`);
      if (data?.success && data?.data) {
        setUserList(data.data);
        setTotalPages(data.pagination?.totalPages ?? 1);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUserList([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Prepare columns with sorting applied
  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns
      .map((item) =>
        item.uid === sortDescriptor.column
          ? { ...item, sortDirection: sortDescriptor.direction }
          : item
      )
      .filter((column) => (visibleColumns as Set<Key>).has(column.uid));
  }, [visibleColumns, sortDescriptor]);

  // Calculate pagination items slice
  const rowsPerPage = 10;
  const pages = Math.ceil(userList.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return userList.slice(start, start + rowsPerPage);
  }, [page, userList]);

  // Sort items by descriptor
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const col = sortDescriptor.column as keyof Users;
      let first = a[col];
      let second = b[col];

      // Handle email and phone arrays
      if (col === "email" || col === "phone_number") {
        first = Array.isArray(a[col]) ? (a[col][0] ?? "") : "";
        second = Array.isArray(b[col]) ? (b[col][0] ?? "") : "";
      }

      // Compare string/number safely
      const cmp = first! < second! ? -1 : first! > second! ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [items, sortDescriptor]);

  // Selection keys filtered by visible items
  const filterSelectedKeys = useMemo(() => {
    if (selectedKeys === "all") return selectedKeys;

    const resultKeys = new Set<Key>();
    const selected = selectedKeys as Set<string>;

    for (const item of userList) {
      if (selected.has(String(item.id))) {
        resultKeys.add(String(item.id));
      }
    }

    return resultKeys;
  }, [selectedKeys, userList]);

  // Callbacks
  const onSelectionChange = useMemoizedCallback((keys: Selection) => {
    setSelectedKeys(keys);
  });

  const renderCell = useMemoizedCallback(
    (user: Users, columnKey: Key): React.ReactNode => {
      const userKey = columnKey as ColumnsKey;

      switch (userKey) {
        case "full_name":
          return (
            <User
              avatarProps={{ radius: "lg", name: user.full_name }}
              name={user.full_name}
              description={
                Array.isArray(user.email) ? (user.email[0] ?? "") : ""
              }
            />
          );
        case "email":
        case "phone_number":
          return (
            <CopyText>
              {Array.isArray(user[userKey]) ? user[userKey].join(", ") : "N/A"}
            </CopyText>
          );
        case "actions":
          return (
            <div className="flex gap-2 justify-end">
              <EyeFilledIcon className="text-default-400 cursor-pointer" />
              <EditLinearIcon className="text-default-400 cursor-pointer" />
              <DeleteFilledIcon className="text-default-400 cursor-pointer" />
            </div>
          );
        default:
          return user[userKey as keyof Users] ?? "N/A";
      }
    }
  );

  const topBar = useMemo(
    () => (
      <div className="mb-[18px] flex items-center justify-between">
        <div className="flex w-[226px] items-center gap-2">
          <h1 className="text-2xl font-[700] leading-[32px]">Team Members</h1>
          <Chip
            className="hidden items-center text-default-500 sm:flex"
            size="sm"
            variant="flat"
          >
            {userList.length}
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
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "end" : "start"}
              className={cn([
                column.uid === "actions"
                  ? "flex items-center justify-end px-[20px]"
                  : "",
              ])}
            >
              {column.name}
              {/* {column.sortDirection === "ascending" ? (
                <ArrowUpIcon className="text-default-400" />
              ) : column.sortDirection === "descending" ? (
                <ArrowDownIcon className="text-default-400" />
              ) : null} */}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent="No users found" items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal
        isOpen={isOpen}
        shouldBlockScroll
        onOpenChange={onOpenChange}
        className="rounded-[16px]"
      >
        <ModalContent className="max-w-[1200px] rounded-[16px] p-0">
          <ModalBody className="p-0">
            <MultiStepWizard onClose={onOpenChange} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
