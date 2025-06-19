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
} from "@heroui/react";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

import { CopyText } from "../../components/table/copy-text";
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

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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

  const items = useMemo(() => userList, [userList]); // FIX: no slicing here

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

    for (const item of userList) {
      if (selected.has(String(item.id))) {
        resultKeys.add(String(item.id));
      }
    }

    return resultKeys;
  }, [selectedKeys, userList]);

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
    },
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
    [onOpen, userList.length],
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
    [page, totalPages],
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
          {(column: any) => (
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
    </div>
  );
}
