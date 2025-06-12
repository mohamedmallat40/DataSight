"use client";

import type { Selection, SortDescriptor } from "@heroui/react";
import type { ColumnsKey, StatusOptions, Users } from "./data";
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
  RadioGroup,
  Radio,
  Chip,
  User,
  Pagination,
  Divider,
  Tooltip,
  useButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  ModalContent,
  Modal,
  useDisclosure,
  ModalBody,
} from "@heroui/react";
import { SearchIcon } from "@heroui/shared-icons";
import React, {
  useMemo,
  useRef,
  useCallback,
  useState,
  useEffect,
} from "react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

import { CopyText } from "./copy-text";
import { EyeFilledIcon } from "./eye";
import { EditLinearIcon } from "./edit";
import { DeleteFilledIcon } from "./delete";
import { ArrowDownIcon } from "./arrow-down";
import { ArrowUpIcon } from "./arrow-up";

import { useMemoizedCallback } from "./use-memoized-callback";
import { columns, INITIAL_VISIBLE_COLUMNS } from "./data";
import { Status } from "./status";
import apiClient from "@/config/api";
import MultiStepWizard from "./add-card/multi-step-wizard";

export default function Component() {
  const [userList, setUserList] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "full_name",
    direction: "ascending",
  });

  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage] = useState(10);
  const [workerTypeFilter, setWorkerTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDateFilter, setStartDateFilter] = useState("all");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get(`/card-info?page=${page}`);
      if (data?.success && data?.data) {
        setUserList(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
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
          : item
      )
      .filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns, sortDescriptor]);

  const itemFilter = useCallback(
    (col: Users) => {
      let allWorkerType = workerTypeFilter === "all";
      let allStatus = statusFilter === "all";
      let allStartDate = startDateFilter === "all";

      return (
        (allWorkerType || workerTypeFilter === col.workerType?.toLowerCase()) &&
        (allStatus || statusFilter === col.status?.toLowerCase()) &&
        (allStartDate ||
          new Date(
            Date.now() -
              +(startDateFilter.match(/(\d+)(?=Days)/)?.[0] ?? 0) *
                24 *
                60 *
                60 *
                1000
          ) <= new Date(col.startDate))
      );
    },
    [startDateFilter, statusFilter, workerTypeFilter]
  );

  const filteredItems = useMemo(() => {
    let filtered = [...userList];

    if (filterValue) {
      filtered = filtered.filter((user) =>
        user.memberInfo?.name?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filtered.filter(itemFilter);
  }, [filterValue, itemFilter, userList]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const col = sortDescriptor.column as keyof Users;
      let first = a[col];
      let second = b[col];

      if (col === "email" || col === "phone_number") {
        first = Array.isArray(a[col]) ? a[col][0] : "";
        second = Array.isArray(b[col]) ? b[col][0] : "";
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;
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

  const onSearchChange = useMemoizedCallback((value?: string) => {
    setFilterValue(value ?? "");
    setPage(1);
  });

  const onSelectionChange = useMemoizedCallback((keys: Selection) => {
    setSelectedKeys(keys);
  });

  const handleMemberClick = useMemoizedCallback(() => {
    console.log("Clicked member");
  });

  const getMemberInfoProps = useMemoizedCallback(() => ({
    onClick: handleMemberClick,
  }));

  const renderCell = useMemoizedCallback(
    (user: Users, columnKey: React.Key) => {
      const userKey = columnKey as ColumnsKey;

      switch (userKey) {
        case "full_name":
          return (
            <User
              avatarProps={{ radius: "lg", name: user.full_name }}
              name={user.full_name}
              description={Array.isArray(user.email) ? user.email[0] : ""}
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
          return user[userKey as keyof Users] || "N/A";
      }
    },
    []
  );

  const topBar = useMemo(() => {
    return (
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
    );
  }, []);

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
        classNames={{
          td: "before:bg-transparent",
        }}
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
              {column.uid === "memberInfo" ? (
                <div
                  {...getMemberInfoProps()}
                  className="flex w-full cursor-pointer items-center justify-between"
                >
                  {column.name}
                  {column.sortDirection === "ascending" ? (
                    <ArrowUpIcon className="text-default-400" />
                  ) : (
                    <ArrowDownIcon className="text-default-400" />
                  )}
                </div>
              ) : column.info ? (
                <div className="flex min-w-[108px] items-center justify-between">
                  {column.name}
                  <Tooltip content={column.info}>
                    <Icon
                      className="text-default-300"
                      height={16}
                      icon="solar:info-circle-linear"
                      width={16}
                    />
                  </Tooltip>
                </div>
              ) : (
                column.name
              )}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No users found"} items={sortedItems}>
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
        shouldBlockScroll={true}
        onOpenChange={onOpenChange}
        className="h-[90vh] w-full max-w-[90vw] p-6 overflow-hidden"
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <ModalBody>
              <MultiStepWizard onClose={onClose} />
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

// "use client";

// import type { Selection, SortDescriptor } from "@heroui/react";
// import type { ColumnsKey, StatusOptions, Users } from "./data";
// import type { Key } from "@react-types/shared";

// import {
//   Dropdown,
//   DropdownTrigger,
//   DropdownMenu,
//   DropdownItem,
//   Table,
//   TableHeader,
//   TableColumn,
//   TableBody,
//   TableRow,
//   TableCell,
//   Input,
//   Button,
//   RadioGroup,
//   Radio,
//   Chip,
//   User,
//   Pagination,
//   Divider,
//   Tooltip,
//   useButton,
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
//   useDisclosure,
//   Modal,
//   ModalContent,
//   ModalBody,
//   ModalHeader,
// } from "@heroui/react";

// import { SearchIcon } from "@heroui/shared-icons";
// import React, { useMemo, useRef, useCallback, useState } from "react";
// import { Icon } from "@iconify/react";
// import { cn } from "@heroui/react";

// import { CopyText } from "./copy-text";
// import { EyeFilledIcon } from "./eye";
// import { EditLinearIcon } from "./edit";
// import { DeleteFilledIcon } from "./delete";
// import { ArrowDownIcon } from "./arrow-down";
// import { ArrowUpIcon } from "./arrow-up";

// import { useMemoizedCallback } from "./use-memoized-callback";

// import { columns, INITIAL_VISIBLE_COLUMNS, users } from "./data";
// import { Status } from "./status";
// import { Textarea } from "@heroui/input";
// import { Link } from "lucide-react";
// import MultiStepWizard from "./add-card/multi-step-wizard";

// export default function Network() {
//   const [filterValue, setFilterValue] = useState("");
//   const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
//   const [visibleColumns, setVisibleColumns] = useState<Selection>(
//     new Set(INITIAL_VISIBLE_COLUMNS)
//   );

//   const [rowsPerPage] = useState(10);
//   const [page, setPage] = useState(1);
//   const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
//     column: "memberInfo",
//     direction: "ascending",
//   });

//   const [workerTypeFilter, setWorkerTypeFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [startDateFilter, setStartDateFilter] = useState("all");

//   const { isOpen, onOpen, onOpenChange } = useDisclosure();

//   const headerColumns = useMemo(() => {
//     if (visibleColumns === "all") return columns;

//     return columns
//       .map((item) => {
//         if (item.uid === sortDescriptor.column) {
//           return {
//             ...item,
//             sortDirection: sortDescriptor.direction,
//           };
//         }

//         return item;
//       })
//       .filter((column) => Array.from(visibleColumns).includes(column.uid));
//   }, [visibleColumns, sortDescriptor]);

//   const itemFilter = useCallback(
//     (col: Users) => {
//       let allWorkerType = workerTypeFilter === "all";
//       let allStatus = statusFilter === "all";
//       let allStartDate = startDateFilter === "all";

//       return (
//         (allWorkerType || workerTypeFilter === col.workerType.toLowerCase()) &&
//         (allStatus || statusFilter === col.status.toLowerCase()) &&
//         (allStartDate ||
//           new Date(
//             new Date().getTime() -
//               +(startDateFilter.match(/(\d+)(?=Days)/)?.[0] ?? 0) *
//                 24 *
//                 60 *
//                 60 *
//                 1000
//           ) <= new Date(col.startDate))
//       );
//     },
//     [startDateFilter, statusFilter, workerTypeFilter]
//   );

//   const filteredItems = useMemo(() => {
//     let filteredUsers = [...users];

//     if (filterValue) {
//       filteredUsers = filteredUsers.filter((user) =>
//         user.memberInfo.name.toLowerCase().includes(filterValue.toLowerCase())
//       );
//     }

//     filteredUsers = filteredUsers.filter(itemFilter);

//     return filteredUsers;
//   }, [filterValue, itemFilter]);

//   const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

//   const items = useMemo(() => {
//     const start = (page - 1) * rowsPerPage;
//     const end = start + rowsPerPage;

//     return filteredItems.slice(start, end);
//   }, [page, filteredItems, rowsPerPage]);

//   const sortedItems = useMemo(() => {
//     return [...items].sort((a: Users, b: Users) => {
//       const col = sortDescriptor.column as keyof Users;

//       let first = a[col];
//       let second = b[col];

//       if (col === "memberInfo" || col === "country") {
//         first = a[col].name;
//         second = b[col].name;
//       } else if (sortDescriptor.column === "externalWorkerID") {
//         first = +a.externalWorkerID.split("EXT-")[1];
//         second = +b.externalWorkerID.split("EXT-")[1];
//       }

//       const cmp = first < second ? -1 : first > second ? 1 : 0;

//       return sortDescriptor.direction === "descending" ? -cmp : cmp;
//     });
//   }, [sortDescriptor, items]);

//   const filterSelectedKeys = useMemo(() => {
//     if (selectedKeys === "all") return selectedKeys;
//     let resultKeys = new Set<Key>();

//     if (filterValue) {
//       filteredItems.forEach((item) => {
//         const stringId = String(item.id);

//         if ((selectedKeys as Set<string>).has(stringId)) {
//           resultKeys.add(stringId);
//         }
//       });
//     } else {
//       resultKeys = selectedKeys;
//     }

//     return resultKeys;
//   }, [selectedKeys, filteredItems, filterValue]);

//   const eyesRef = useRef<HTMLButtonElement | null>(null);
//   const editRef = useRef<HTMLButtonElement | null>(null);
//   const deleteRef = useRef<HTMLButtonElement | null>(null);
//   const { getButtonProps: getEyesProps } = useButton({ ref: eyesRef });
//   const { getButtonProps: getEditProps } = useButton({ ref: editRef });
//   const { getButtonProps: getDeleteProps } = useButton({ ref: deleteRef });
//   const getMemberInfoProps = useMemoizedCallback(() => ({
//     onClick: handleMemberClick,
//   }));

//   const renderCell = useMemoizedCallback(
//     (user: Users, columnKey: React.Key) => {
//       const userKey = columnKey as ColumnsKey;

//       const cellValue = user[userKey as unknown as keyof Users] as string;

//       switch (userKey) {
//         case "workerID":
//         case "externalWorkerID":
//           return <CopyText>{cellValue}</CopyText>;
//         case "memberInfo":
//           return (
//             <User
//               avatarProps={{ radius: "lg", src: user[userKey].avatar }}
//               classNames={{
//                 name: "text-default-foreground",
//                 description: "text-default-500",
//               }}
//               description={user[userKey].email}
//               name={user[userKey].name}
//             >
//               {user[userKey].email}
//             </User>
//           );
//         case "startDate":
//           return (
//             <div className="flex items-center gap-1">
//               <Icon
//                 className="h-[16px] w-[16px] text-default-300"
//                 icon="solar:calendar-minimalistic-linear"
//               />
//               <p className="text-nowrap text-small capitalize text-default-foreground">
//                 {new Intl.DateTimeFormat("en-US", {
//                   month: "long",
//                   day: "numeric",
//                   year: "numeric",
//                 }).format(cellValue as unknown as Date)}
//               </p>
//             </div>
//           );
//         case "country":
//           return (
//             <div className="flex items-center gap-2">
//               <div className="h-[16px] w-[16px]">{user[userKey].icon}</div>
//               <p className="text-nowrap text-small text-default-foreground">
//                 {user[userKey].name}
//               </p>
//             </div>
//           );
//         case "teams":
//           return (
//             <div className="float-start flex gap-1">
//               {user[userKey].map((team, index) => {
//                 if (index < 3) {
//                   return (
//                     <Chip
//                       key={team}
//                       className="rounded-xl bg-default-100 px-[6px] capitalize text-default-800"
//                       size="sm"
//                       variant="flat"
//                     >
//                       {team}
//                     </Chip>
//                   );
//                 }
//                 if (index < 4) {
//                   return (
//                     <Chip
//                       key={team}
//                       className="text-default-500"
//                       size="sm"
//                       variant="flat"
//                     >
//                       {`+${team.length - 3}`}
//                     </Chip>
//                   );
//                 }

//                 return null;
//               })}
//             </div>
//           );
//         case "role":
//           return (
//             <div className="text-nowrap text-small capitalize text-default-foreground">
//               {cellValue}
//             </div>
//           );
//         case "workerType":
//           return <div className="text-default-foreground">{cellValue}</div>;
//         case "status":
//           return <Status status={cellValue as StatusOptions} />;
//         case "actions":
//           return (
//             <div className="flex items-center justify-end gap-2">
//               <EyeFilledIcon
//                 {...getEyesProps()}
//                 className="cursor-pointer text-default-400"
//                 height={18}
//                 width={18}
//               />
//               <EditLinearIcon
//                 {...getEditProps()}
//                 className="cursor-pointer text-default-400"
//                 height={18}
//                 width={18}
//               />
//               <DeleteFilledIcon
//                 {...getDeleteProps()}
//                 className="cursor-pointer text-default-400"
//                 height={18}
//                 width={18}
//               />
//             </div>
//           );
//         default:
//           return cellValue;
//       }
//     }
//   );

//   const onNextPage = useMemoizedCallback(() => {
//     if (page < pages) {
//       setPage(page + 1);
//     }
//   });

//   const onPreviousPage = useMemoizedCallback(() => {
//     if (page > 1) {
//       setPage(page - 1);
//     }
//   });

//   const onSearchChange = useMemoizedCallback((value?: string) => {
//     if (value) {
//       setFilterValue(value);
//       setPage(1);
//     } else {
//       setFilterValue("");
//     }
//   });

//   const onSelectionChange = useMemoizedCallback((keys: Selection) => {
//     if (keys === "all") {
//       if (filterValue) {
//         const resultKeys = new Set(
//           filteredItems.map((item) => String(item.id))
//         );

//         setSelectedKeys(resultKeys);
//       } else {
//         setSelectedKeys(keys);
//       }
//     } else if (keys.size === 0) {
//       setSelectedKeys(new Set());
//     } else {
//       const resultKeys = new Set<Key>();

//       keys.forEach((v) => {
//         resultKeys.add(v);
//       });
//       const selectedValue =
//         selectedKeys === "all"
//           ? new Set(filteredItems.map((item) => String(item.id)))
//           : selectedKeys;

//       selectedValue.forEach((v) => {
//         if (items.some((item) => String(item.id) === v)) {
//           return;
//         }
//         resultKeys.add(v);
//       });
//       setSelectedKeys(new Set(resultKeys));
//     }
//   });

//   const topContent = useMemo(() => {
//     return (
//       <div className="flex items-center gap-4 overflow-auto px-[6px] py-[4px]">
//         <div className="flex items-center gap-3">
//           <div className="flex items-center gap-4">
//             <Input
//               className="min-w-[200px]"
//               endContent={
//                 <SearchIcon className="text-default-400" width={16} />
//               }
//               placeholder="Search"
//               size="sm"
//               value={filterValue}
//               onValueChange={onSearchChange}
//             />
//             <div>
//               <Popover placement="bottom">
//                 <PopoverTrigger>
//                   <Button
//                     className="bg-default-100 text-default-800"
//                     size="sm"
//                     startContent={
//                       <Icon
//                         className="text-default-400"
//                         icon="solar:tuning-2-linear"
//                         width={16}
//                       />
//                     }
//                   >
//                     Filter
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-80">
//                   <div className="flex w-full flex-col gap-6 px-2 py-4">
//                     <RadioGroup
//                       label="Worker Type"
//                       value={workerTypeFilter}
//                       onValueChange={setWorkerTypeFilter}
//                     >
//                       <Radio value="all">All</Radio>
//                       <Radio value="employee">Employee</Radio>
//                       <Radio value="contractor">Contractor</Radio>
//                     </RadioGroup>

//                     <RadioGroup
//                       label="Status"
//                       value={statusFilter}
//                       onValueChange={setStatusFilter}
//                     >
//                       <Radio value="all">All</Radio>
//                       <Radio value="active">Active</Radio>
//                       <Radio value="inactive">Inactive</Radio>
//                       <Radio value="paused">Paused</Radio>
//                       <Radio value="vacation">Vacation</Radio>
//                     </RadioGroup>

//                     <RadioGroup
//                       label="Start Date"
//                       value={startDateFilter}
//                       onValueChange={setStartDateFilter}
//                     >
//                       <Radio value="all">All</Radio>
//                       <Radio value="last7Days">Last 7 days</Radio>
//                       <Radio value="last30Days">Last 30 days</Radio>
//                       <Radio value="last60Days">Last 60 days</Radio>
//                     </RadioGroup>
//                   </div>
//                 </PopoverContent>
//               </Popover>
//             </div>
//             <div>
//               <Dropdown>
//                 <DropdownTrigger>
//                   <Button
//                     className="bg-default-100 text-default-800"
//                     size="sm"
//                     startContent={
//                       <Icon
//                         className="text-default-400"
//                         icon="solar:sort-linear"
//                         width={16}
//                       />
//                     }
//                   >
//                     Sort
//                   </Button>
//                 </DropdownTrigger>
//                 <DropdownMenu
//                   aria-label="Sort"
//                   items={headerColumns.filter(
//                     (c) => !["actions", "teams"].includes(c.uid)
//                   )}
//                 >
//                   {(item) => (
//                     <DropdownItem
//                       key={item.uid}
//                       onPress={() => {
//                         setSortDescriptor({
//                           column: item.uid,
//                           direction:
//                             sortDescriptor.direction === "ascending"
//                               ? "descending"
//                               : "ascending",
//                         });
//                       }}
//                     >
//                       {item.name}
//                     </DropdownItem>
//                   )}
//                 </DropdownMenu>
//               </Dropdown>
//             </div>
//             <div>
//               <Dropdown closeOnSelect={false}>
//                 <DropdownTrigger>
//                   <Button
//                     className="bg-default-100 text-default-800"
//                     size="sm"
//                     startContent={
//                       <Icon
//                         className="text-default-400"
//                         icon="solar:sort-horizontal-linear"
//                         width={16}
//                       />
//                     }
//                   >
//                     Columns
//                   </Button>
//                 </DropdownTrigger>
//                 <DropdownMenu
//                   disallowEmptySelection
//                   aria-label="Columns"
//                   items={columns.filter((c) => !["actions"].includes(c.uid))}
//                   selectedKeys={visibleColumns}
//                   selectionMode="multiple"
//                   onSelectionChange={setVisibleColumns}
//                 >
//                   {(item) => (
//                     <DropdownItem key={item.uid}>{item.name}</DropdownItem>
//                   )}
//                 </DropdownMenu>
//               </Dropdown>
//             </div>
//           </div>

//           <Divider className="h-5" orientation="vertical" />

//           <div className="whitespace-nowrap text-sm text-default-800">
//             {filterSelectedKeys === "all"
//               ? "All items selected"
//               : `${filterSelectedKeys.size} Selected`}
//           </div>

//           {(filterSelectedKeys === "all" || filterSelectedKeys.size > 0) && (
//             <Dropdown>
//               <DropdownTrigger>
//                 <Button
//                   className="bg-default-100 text-default-800"
//                   endContent={
//                     <Icon
//                       className="text-default-400"
//                       icon="solar:alt-arrow-down-linear"
//                     />
//                   }
//                   size="sm"
//                   variant="flat"
//                 >
//                   Selected Actions
//                 </Button>
//               </DropdownTrigger>
//               <DropdownMenu aria-label="Selected Actions">
//                 <DropdownItem key="send-email">Send email</DropdownItem>
//                 <DropdownItem key="pay-invoices">Pay invoices</DropdownItem>
//                 <DropdownItem key="bulk-edit">Bulk edit</DropdownItem>
//                 <DropdownItem key="end-contract">End contract</DropdownItem>
//               </DropdownMenu>
//             </Dropdown>
//           )}
//         </div>
//       </div>
//     );
//   }, [
//     filterValue,
//     visibleColumns,
//     filterSelectedKeys,
//     headerColumns,
//     sortDescriptor,
//     statusFilter,
//     workerTypeFilter,
//     startDateFilter,
//     setWorkerTypeFilter,
//     setStatusFilter,
//     setStartDateFilter,
//     onSearchChange,
//     setVisibleColumns,
//   ]);

//   const topBar = useMemo(() => {
//     return (
//       <div className="mb-[18px] flex items-center justify-between">
//         <div className="flex w-[226px] items-center gap-2">
//           <h1 className="text-2xl font-[700] leading-[32px]">Team Members</h1>
//           <Chip
//             className="hidden items-center text-default-500 sm:flex"
//             size="sm"
//             variant="flat"
//           >
//             {users.length}
//           </Chip>
//         </div>
//         <Button
//           color="primary"
//           endContent={<Icon icon="solar:add-circle-bold" width={20} />}
//           onPress={onOpen}
//         >
//           Add Member
//         </Button>
//       </div>
//     );
//   }, []);

//   const bottomContent = useMemo(() => {
//     return (
//       <div className="flex flex-col items-center justify-between gap-2 px-2 py-2 sm:flex-row">
//         <Pagination
//           isCompact
//           showControls
//           showShadow
//           color="primary"
//           page={page}
//           total={pages}
//           onChange={setPage}
//         />
//         <div className="flex items-center justify-end gap-6">
//           <span className="text-small text-default-400">
//             {filterSelectedKeys === "all"
//               ? "All items selected"
//               : `${filterSelectedKeys.size} of ${filteredItems.length} selected`}
//           </span>
//           <div className="flex items-center gap-3">
//             <Button
//               isDisabled={page === 1}
//               size="sm"
//               variant="flat"
//               onPress={onPreviousPage}
//             >
//               Previous
//             </Button>
//             <Button
//               isDisabled={page === pages}
//               size="sm"
//               variant="flat"
//               onPress={onNextPage}
//             >
//               Next
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }, [
//     filterSelectedKeys,
//     page,
//     pages,
//     filteredItems.length,
//     onPreviousPage,
//     onNextPage,
//   ]);

//   const handleMemberClick = useMemoizedCallback(() => {
//     setSortDescriptor({
//       column: "memberInfo",
//       direction:
//         sortDescriptor.direction === "ascending" ? "descending" : "ascending",
//     });
//   });

//   return (
//     <div className="h-full w-full p-6">
//       {topBar}
//       <Table
//         isHeaderSticky
//         aria-label="Example table with custom cells, pagination and sorting"
//         bottomContent={bottomContent}
//         bottomContentPlacement="outside"
//         classNames={{
//           td: "before:bg-transparent",
//         }}
//         selectedKeys={filterSelectedKeys}
//         selectionMode="multiple"
//         sortDescriptor={sortDescriptor}
//         topContent={topContent}
//         topContentPlacement="outside"
//         onSelectionChange={onSelectionChange}
//         onSortChange={setSortDescriptor}
//       >
//         <TableHeader columns={headerColumns}>
//           {(column) => (
//             <TableColumn
//               key={column.uid}
//               align={column.uid === "actions" ? "end" : "start"}
//               className={cn([
//                 column.uid === "actions"
//                   ? "flex items-center justify-end px-[20px]"
//                   : "",
//               ])}
//             >
//               {column.uid === "memberInfo" ? (
//                 <div
//                   {...getMemberInfoProps()}
//                   className="flex w-full cursor-pointer items-center justify-between"
//                 >
//                   {column.name}
//                   {column.sortDirection === "ascending" ? (
//                     <ArrowUpIcon className="text-default-400" />
//                   ) : (
//                     <ArrowDownIcon className="text-default-400" />
//                   )}
//                 </div>
//               ) : column.info ? (
//                 <div className="flex min-w-[108px] items-center justify-between">
//                   {column.name}
//                   <Tooltip content={column.info}>
//                     <Icon
//                       className="text-default-300"
//                       height={16}
//                       icon="solar:info-circle-linear"
//                       width={16}
//                     />
//                   </Tooltip>
//                 </div>
//               ) : (
//                 column.name
//               )}
//             </TableColumn>
//           )}
//         </TableHeader>
//         <TableBody emptyContent={"No users found"} items={sortedItems}>
//           {(item) => (
//             <TableRow key={item.id}>
//               {(columnKey) => (
//                 <TableCell>{renderCell(item, columnKey)}</TableCell>
//               )}
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//       <Modal
//         isOpen={isOpen}
//         shouldBlockScroll={true}
//         onOpenChange={onOpenChange}
//         className="h-[90vh] w-full max-w-[90vw] p-6 overflow-hidden"
//         isDismissable={false}
//       >
//         <ModalContent>
//           {(onClose) => (
//             <ModalBody>
//               <MultiStepWizard onClose={onClose} />
//             </ModalBody>
//           )}
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// }
