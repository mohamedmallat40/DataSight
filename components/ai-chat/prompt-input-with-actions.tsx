"use client";

import React from "react";
import {Button, Tooltip, ScrollShadow} from "@heroui/react";
import {Icon} from "@iconify/react";
import {cn} from "@heroui/react";

import PromptInput from "./prompt-input";
import { mockCompanies, mockContacts } from "@/hooks/use-ai-chat";
import type { Company, Contact } from "@/hooks/use-ai-chat";

interface MentionableEntity {
  id: string;
  name: string;
  type: 'company' | 'contact';
  company?: string;
  industry?: string;
  role?: string;
}

interface PromptInputWithActionsProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  onCompanyTag: (company: Company) => void;
  onContactTag: (contact: Contact) => void;
  isLoading?: boolean;
  taggedEntities?: MentionableEntity[];
  onEntityMention?: (entity: MentionableEntity) => void;
}

export default function PromptInputWithActions({
  prompt,
  onPromptChange,
  onSubmit,
  onCompanyTag,
  onContactTag,
  isLoading = false,
  taggedEntities = [],
  onEntityMention,
}: PromptInputWithActionsProps) {
  const ideas = [
    {
      title: "Show me Tech Corp's financial overview",
      description: "revenue, employees, and growth metrics",
      tags: [mockCompanies[0]],
    },
    {
      title: "Who should I contact at Health Plus?",
      description: "find decision makers and key contacts",
      tags: [mockCompanies[1]],
    },
    {
      title: "Compare companies in renewable energy",
      description: "market analysis and positioning",
      tags: [mockCompanies[2]],
    },
    {
      title: "Find contacts in technology sector",
      description: "CTOs and technical leadership",
      tags: [],
    },
  ];

  const handleIdeaClick = (idea: typeof ideas[0]) => {
    onPromptChange(idea.title);
    // Auto-tag associated entities
    idea.tags.forEach((entity) => {
      if ('industry' in entity) {
        onCompanyTag(entity as Company);
      } else {
        onContactTag(entity as Contact);
      }
    });
  };

  const handleEntityMention = (entity: MentionableEntity) => {
    // Auto-tag the entity when mentioned
    if (entity.type === 'company') {
      const company = mockCompanies.find(c => c.id === entity.id);
      if (company) {
        onCompanyTag(company);
      }
    } else {
      const contact = mockContacts.find(c => c.id === entity.id);
      if (contact) {
        onContactTag(contact);
      }
    }
    
    if (onEntityMention) {
      onEntityMention(entity);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit();
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <ScrollShadow hideScrollBar className="flex flex-nowrap gap-2" orientation="horizontal">
        <div className="flex gap-2">
          {ideas.map((idea, index) => (
            <Button 
              key={index} 
              className="flex h-14 flex-col items-start gap-0 min-w-[200px]" 
              variant="flat"
              onPress={() => handleIdeaClick(idea)}
            >
              <p className="text-left text-xs font-medium">{idea.title}</p>
              <p className="text-default-500 text-xs">{idea.description}</p>
            </Button>
          ))}
        </div>
      </ScrollShadow>
      
      <form 
        className="flex w-full flex-col rounded-medium bg-default-100 transition-colors hover:bg-default-200/70"
        onSubmit={handleSubmit}
      >
        <div className="w-full">
          <PromptInput
            classNames={{
              base: "w-full",
              inputWrapper: "!bg-transparent shadow-none w-full",
              innerWrapper: "relative w-full",
              input: "pt-1 pl-2 pb-6 !pr-10 text-medium w-full",
            }}
            endContent={
              <div className="flex items-end gap-2">
                <Tooltip showArrow content="Send message">
                  <Button
                    type="submit"
                    isIconOnly
                    color={!prompt ? "default" : "primary"}
                    isDisabled={!prompt || isLoading}
                    isLoading={isLoading}
                    radius="lg"
                    size="sm"
                    variant="solid"
                  >
                    <Icon
                      className={cn(
                        "[&>path]:stroke-[2px]",
                        !prompt ? "text-default-600" : "text-primary-foreground",
                      )}
                      icon="solar:arrow-up-linear"
                      width={20}
                    />
                  </Button>
                </Tooltip>
              </div>
            }
            minRows={3}
            radius="lg"
            value={prompt}
            variant="flat"
            onValueChange={onPromptChange}
            onEntityMention={handleEntityMention}
          />
        </div>
        <div className="flex w-full items-center justify-between gap-2 overflow-auto px-4 pb-4">
          <div className="flex gap-1 md:gap-3">
            <Button
              size="sm"
              startContent={
                <Icon className="text-default-500" icon="solar:buildings-linear" width={18} />
              }
              variant="flat"
            >
              Companies
            </Button>
            <Button
              size="sm"
              startContent={
                <Icon className="text-default-500" icon="solar:users-group-rounded-linear" width={18} />
              }
              variant="flat"
            >
              Contacts
            </Button>
            <Button
              size="sm"
              startContent={
                <Icon className="text-default-500" icon="solar:microphone-linear" width={18} />
              }
              variant="flat"
            >
              Voice
            </Button>
          </div>
          <p className="py-1 text-tiny text-default-400">{prompt.length}/2000</p>
        </div>
      </form>
    </div>
  );
}