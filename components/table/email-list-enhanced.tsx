import { Button } from "@heroui/button";
import { Tooltip, Chip } from "@heroui/react";
import React, { memo, useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";
import {
  HighlightedText,
  containsSearchTerm,
} from "../../utils/search-highlight";

interface EmailListEnhancedProps {
  emails: string[];
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
    <Tooltip content={copied ? "Copied!" : "Copy email"}>
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

export const EmailListEnhanced = memo(
  ({
    emails,
    className,
    maxVisible = 3,
    searchTerm = "",
  }: EmailListEnhancedProps) => {
    const [showAll, setShowAll] = useState(false);

    const filteredEmails = emails.filter(
      (email) => email && email.trim() !== "",
    );
    const visibleEmails = showAll
      ? filteredEmails
      : filteredEmails.slice(0, maxVisible);
    const hasMore = filteredEmails.length > maxVisible;

    if (filteredEmails.length === 0) {
      return <span className="text-default-400 text-small">No emails</span>;
    }

    return (
      <div className={cn("flex flex-col gap-1.5 min-w-0", className)}>
        {visibleEmails.map((email, index) => {
          const isHighlighted =
            searchTerm && containsSearchTerm(email, searchTerm);

          return (
            <div key={index} className="flex items-center gap-2 min-w-0">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <a
                    href={`mailto:${email}`}
                    className={cn(
                      "text-small hover:text-primary transition-colors truncate block",
                      isHighlighted ? "text-default-900" : "text-default-700",
                    )}
                    title={email}
                  >
                    <HighlightedText
                      text={email}
                      searchTerm={searchTerm}
                      highlightClassName="bg-yellow-200 text-yellow-900 px-0.5 rounded-sm font-medium"
                    />
                  </a>
                  {index === 0 && filteredEmails.length > 1 && (
                    <Chip
                      size="sm"
                      variant="flat"
                      color="primary"
                      className="text-tiny"
                    >
                      Primary
                    </Chip>
                  )}
                </div>
              </div>
              <CopyButton text={email} />
            </div>
          );
        })}

        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-tiny text-primary hover:text-primary-600 transition-colors self-start flex items-center gap-1"
          >
            <Icon
              icon={showAll ? "lucide:chevron-up" : "lucide:chevron-down"}
              width={12}
              height={12}
            />
            {showAll
              ? "Show less"
              : `+${filteredEmails.length - maxVisible} more`}
          </button>
        )}
      </div>
    );
  },
);

EmailListEnhanced.displayName = "EmailListEnhanced";
