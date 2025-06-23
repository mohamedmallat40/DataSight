import { Button } from "@heroui/button";
import { Tooltip, Chip } from "@heroui/react";
import React, { memo, useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

import {
  HighlightedText,
  containsSearchTerm,
} from "../../utils/search-highlight";

interface PhoneListEnhancedProps {
  phones: string[];
  className?: string;
  maxVisible?: number;
  searchTerm?: string;
}

interface CopyButtonProps {
  text: string;
  className?: string;
}

const CopyButton = memo(({ text, className }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const [copyTimeout, setCopyTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const handleClick = () => {
    if (copyTimeout) {
      clearTimeout(copyTimeout);
    }

    navigator.clipboard.writeText(text);
    setCopied(true);

    setCopyTimeout(
      setTimeout(() => {
        setCopied(false);
      }, 2000),
    );
  };

  return (
    <Tooltip content={copied ? "Copied!" : "Copy phone"}>
      <Button
        isIconOnly
        className={cn(
          "h-6 w-6 min-w-6 text-default-400 hover:text-primary",
          className,
        )}
        size="sm"
        variant="light"
        onPress={handleClick}
      >
        {!copied && <Icon className="h-3 w-3" icon="solar:copy-linear" />}
        {copied && (
          <Icon
            className="h-3 w-3 text-success"
            icon="solar:check-read-linear"
          />
        )}
      </Button>
    </Tooltip>
  );
});

CopyButton.displayName = "CopyButton";

export const PhoneListEnhanced = memo(
  ({
    phones,
    className,
    maxVisible = 3,
    searchTerm = "",
  }: PhoneListEnhancedProps) => {
    const [showAll, setShowAll] = useState(false);

    const filteredPhones = phones.filter(
      (phone) => phone && phone.trim() !== "",
    );
    const visiblePhones = showAll
      ? filteredPhones
      : filteredPhones.slice(0, maxVisible);
    const hasMore = filteredPhones.length > maxVisible;

    if (filteredPhones.length === 0) {
      return <span className="text-default-400 text-small">No phones</span>;
    }

    return (
      <div className={cn("flex flex-col gap-1.5 min-w-0", className)}>
        {visiblePhones.map((phone, index) => {
          const isHighlighted =
            searchTerm && containsSearchTerm(phone, searchTerm);

          return (
            <div key={index} className="flex items-center gap-2 min-w-0">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <a
                    className={cn(
                      "text-small hover:text-primary transition-colors truncate block",
                      isHighlighted ? "text-default-900" : "text-default-700",
                    )}
                    href={`tel:${phone}`}
                    title={phone}
                  >
                    <HighlightedText
                      highlightClassName="bg-yellow-200 text-yellow-900 px-0.5 rounded-sm font-medium"
                      searchTerm={searchTerm}
                      text={phone}
                    />
                  </a>
                  {index === 0 && filteredPhones.length > 1 && (
                    <Chip
                      className="text-tiny"
                      color="primary"
                      size="sm"
                      variant="flat"
                    >
                      Primary
                    </Chip>
                  )}
                </div>
              </div>
              <CopyButton text={phone} />
            </div>
          );
        })}

        {hasMore && (
          <button
            className="text-tiny text-primary hover:text-primary-600 transition-colors self-start flex items-center gap-1"
            onClick={() => setShowAll(!showAll)}
          >
            <Icon
              height={12}
              icon={showAll ? "lucide:chevron-up" : "lucide:chevron-down"}
              width={12}
            />
            {showAll
              ? "Show less"
              : `+${filteredPhones.length - maxVisible} more`}
          </button>
        )}
      </div>
    );
  },
);

PhoneListEnhanced.displayName = "PhoneListEnhanced";
