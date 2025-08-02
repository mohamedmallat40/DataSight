"use client";

import React from "react";
import {Listbox, ListboxItem, ListboxSection, Tooltip} from "@heroui/react";
import {Icon} from "@iconify/react";
import {cn} from "@heroui/react";
import type { Company, Contact } from "@/hooks/use-ai-chat";

interface SidebarItem {
  key: string;
  title: string;
  icon?: string;
  description?: string;
  data?: Company | Contact;
  isSelected?: boolean;
}

interface SidebarSection {
  key: string;
  title: string;
  items: SidebarItem[];
}

interface SidebarProps {
  items: SidebarSection[];
  onCompanySelect: (company: Company) => void;
  onContactSelect: (contact: Contact) => void;
  isCompact?: boolean;
  iconClassName?: string;
}

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      items,
      onCompanySelect,
      onContactSelect,
      isCompact = false,
      iconClassName,
    },
    ref,
  ) => {
    const handleItemSelect = (item: SidebarItem) => {
      if (!item.data) return;
      
      if ('industry' in item.data) {
        onCompanySelect(item.data as Company);
      } else {
        onContactSelect(item.data as Contact);
      }
    };

    const renderItem = (item: SidebarItem) => {
      return (
        <ListboxItem
          key={item.key}
          textValue={item.title}
          className={cn(
            "cursor-pointer",
            item.isSelected && "bg-primary/10 text-primary"
          )}
          onPress={() => handleItemSelect(item)}
          startContent={
            isCompact ? null : item.icon ? (
              <Icon
                className={cn(
                  "text-default-500",
                  item.isSelected && "text-primary",
                  iconClassName,
                )}
                icon={item.icon}
                width={18}
              />
            ) : null
          }
        >
          {isCompact ? (
            <Tooltip content={item.title} placement="right">
              <div className="flex w-full items-center justify-center">
                {item.icon ? (
                  <Icon
                    className={cn(
                      "text-default-500",
                      item.isSelected && "text-primary",
                      iconClassName,
                    )}
                    icon={item.icon}
                    width={18}
                  />
                ) : null}
              </div>
            </Tooltip>
          ) : (
            <div className="flex flex-col">
              <span className={cn(
                "text-small font-medium",
                item.isSelected ? "text-primary" : "text-default-600"
              )}>
                {item.title}
              </span>
              {item.description && (
                <span className="text-tiny text-default-400">
                  {item.description}
                </span>
              )}
            </div>
          )}
        </ListboxItem>
      );
    };

    return (
      <div className="space-y-4">
        {items.map((section) => (
          <div key={section.key}>
            {!isCompact && (
              <h3 className="px-3 text-xs font-semibold text-default-500 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
            )}
            <Listbox
              className="list-none"
              color="default"
              variant="flat"
              itemClasses={{
                base: cn(
                  "px-3 min-h-10 rounded-large h-[40px] data-[selected=true]:bg-primary/10",
                  isCompact && "w-11 h-11 gap-0 p-0"
                ),
                title: cn(
                  "text-small font-medium text-default-500 group-data-[selected=true]:text-primary",
                ),
              }}
            >
              {section.items.map(renderItem)}
            </Listbox>
          </div>
        ))}
      </div>
    );
  },
);

Sidebar.displayName = "Sidebar";

export default Sidebar;