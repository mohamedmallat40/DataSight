"use client";

import type { SwitchProps } from "@heroui/react";

import React from "react";
import { extendVariants, Switch } from "@heroui/react";
import { cn } from "@heroui/react";

const CustomSwitch = extendVariants(Switch, {
  variants: {
    color: {
      foreground: {
        wrapper: [
          "group-data-[selected=true]:bg-foreground",
          "group-data-[selected=true]:text-background",
        ],
      },
    },
  },
});

export type SwitchCellProps = Omit<SwitchProps, "color"> & {
  label: string;
  description: string;
  color?: SwitchProps["color"] | "foreground";
  classNames?: SwitchProps["classNames"] & {
    description?: string | string[];
  };
};

const SwitchCell = React.forwardRef<HTMLInputElement, SwitchCellProps>(
  ({ label, description, classNames, ...props }, ref) => (
    <CustomSwitch
      ref={ref}
      classNames={{
        ...classNames,
        base: cn(
          "inline-flex bg-content2 flex-row-reverse w-full max-w-full items-center",
          "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary",
          classNames?.base,
        ),
        wrapper: cn("p-0 h-4 overflow-visible", classNames?.wrapper),
        thumb: cn(
          "w-6 h-6 border-2 shadow-lg",
          "group-data-[hover=true]:border-primary",
          "group-data-[selected=true]:ml-6",
          "group-data-[pressed=true]:w-7",
          "group-data-[selected]:group-data-[pressed]:ml-4",
          classNames?.thumb,
        ),
      }}
      {...props}
    >
      <div className="flex flex-col gap-1">
        <p className="text-medium">{label}</p>
        <p
          className={cn("text-tiny text-default-400", classNames?.description)}
        >
          {description}
        </p>
      </div>
    </CustomSwitch>
  ),
);

SwitchCell.displayName = "SwitchCell";

export default SwitchCell;
