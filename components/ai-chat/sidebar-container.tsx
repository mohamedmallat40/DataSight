"use client";

import React from "react";
import {Avatar, Button, ScrollShadow, Spacer, Input, useDisclosure, Chip} from "@heroui/react";
import {Icon} from "@iconify/react";

import Sidebar from "./sidebar";
import SidebarDrawer from "./sidebar-drawer";
import { mockCompanies, mockContacts } from "@/hooks/use-ai-chat";
import type { Company, Contact } from "@/hooks/use-ai-chat";

interface SidebarContainerProps {
  children?: React.ReactNode;
  header?: React.ReactNode;
  title?: string;
  selectedCompanies: Company[];
  selectedContacts: Contact[];
  onCompanySelect: (company: Company) => void;
  onContactSelect: (contact: Contact) => void;
  onCompanyRemove: (companyId: string) => void;
  onContactRemove: (contactId: string) => void;
}

export default function SidebarContainer({
  children,
  header,
  title = "AI Business Intelligence",
  selectedCompanies,
  selectedContacts,
  onCompanySelect,
  onContactSelect,
  onCompanyRemove,
  onContactRemove,
}: SidebarContainerProps) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const sidebarItems = [
    {
      key: "companies",
      title: "Companies",
      items: mockCompanies.map(company => ({
        key: company.id,
        title: company.name,
        icon: "solar:buildings-linear",
        description: company.industry,
        data: company,
        isSelected: selectedCompanies.some(c => c.id === company.id),
      })),
    },
    {
      key: "contacts",
      title: "Contacts",
      items: mockContacts.map(contact => ({
        key: contact.id,
        title: contact.name,
        icon: "solar:user-linear",
        description: `${contact.role} at ${contact.company}`,
        data: contact,
        isSelected: selectedContacts.some(c => c.id === contact.id),
      })),
    },
  ];

  const content = (
    <div className="relative flex h-full w-72 flex-1 flex-col bg-gradient-to-b from-default-100 via-primary-50 to-secondary-50 p-6">
      <div className="flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <Icon className="text-primary" icon="solar:chat-round-dots-bold" width={20} />
        </div>
        <span className="text-small font-medium uppercase text-foreground">DataSight AI</span>
      </div>

      <Spacer y={8} />

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 px-2">
          <Avatar size="sm" src="https://d2u8k2ocievbld.cloudfront.net/memojis/male/6.png" />
          <div className="flex flex-col">
            <p className="text-small text-foreground">Business Analyst</p>
            <p className="text-tiny text-default-500">AI Assistant</p>
          </div>
        </div>
        
        <Input
          fullWidth
          aria-label="search"
          classNames={{
            base: "px-1",
            inputWrapper:
              "bg-default-400/20 data-[hover=true]:bg-default-500/30 group-data-[focus=true]:bg-default-500/20",
            input: "placeholder:text-default-600 group-data-[has-value=true]:text-foreground",
          }}
          labelPlacement="outside"
          placeholder="Search companies & contacts..."
          startContent={
            <Icon
              className="text-default-600 [&>g]:stroke-[2px]"
              icon="solar:magnifer-linear"
              width={18}
            />
          }
        />
      </div>

      {/* Selected entities */}
      {(selectedCompanies.length > 0 || selectedContacts.length > 0) && (
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-xs text-default-600 font-medium px-2">Tagged for Analysis</p>
          <div className="flex flex-wrap gap-1 px-2">
            {selectedCompanies.map((company) => (
              <Chip
                key={company.id}
                size="sm"
                variant="flat"
                color="primary"
                onClose={() => onCompanyRemove(company.id)}
              >
                {company.name}
              </Chip>
            ))}
            {selectedContacts.map((contact) => (
              <Chip
                key={contact.id}
                size="sm"
                variant="flat"
                color="secondary"
                onClose={() => onContactRemove(contact.id)}
              >
                {contact.name}
              </Chip>
            ))}
          </div>
        </div>
      )}

      <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
        <Sidebar
          items={sidebarItems}
          onCompanySelect={onCompanySelect}
          onContactSelect={onContactSelect}
        />
      </ScrollShadow>

      <Spacer y={8} />

      <div className="mt-auto flex flex-col">
        <Button
          fullWidth
          className="justify-start text-default-600 data-[hover=true]:text-black"
          startContent={
            <Icon className="text-default-600" icon="solar:info-circle-line-duotone" width={24} />
          }
          variant="light"
        >
          Help & Tips
        </Button>
        <Button
          className="justify-start text-default-600 data-[hover=true]:text-black"
          startContent={
            <Icon
              className="text-default-600"
              icon="solar:history-linear"
              width={24}
            />
          }
          variant="light"
        >
          Chat History
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-full min-h-[48rem] w-full">
      <SidebarDrawer className="flex-none" isOpen={isOpen} onOpenChange={onOpenChange}>
        {content}
      </SidebarDrawer>
      <div className="flex w-full flex-col gap-y-4 p-4 sm:max-w-[calc(100%_-_288px)]">
        <header className="flex h-16 min-h-16 items-center justify-between gap-2 overflow-x-scroll rounded-medium border-small border-divider px-4 py-2">
          <div className="flex max-w-full items-center gap-2">
            <Button
              isIconOnly
              className="flex sm:hidden"
              size="sm"
              variant="light"
              onPress={onOpen}
            >
              <Icon
                className="text-default-500"
                height={24}
                icon="solar:hamburger-menu-outline"
                width={24}
              />
            </Button>
            <h2 className="truncate text-medium font-medium text-default-700">{title}</h2>
          </div>
          {header}
        </header>
        <main className="flex h-full">
          <div className="flex h-full w-full flex-col gap-4 rounded-medium border-small border-divider p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}