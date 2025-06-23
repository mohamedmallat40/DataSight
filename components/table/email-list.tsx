import { Button } from "@heroui/button";
import { Tooltip, Chip } from "@heroui/react";
import React, { memo, useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

interface EmailListProps {
  emails: string[];
  className?: string;
  maxVisible?: number;
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

export const EmailList = memo(
  ({ emails, className, maxVisible = 3 }: EmailListProps) => {
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
        {visibleEmails.map((email, index) => (
          <div key={index} className="flex items-center gap-2 min-w-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <a
                  className="text-small text-default-700 hover:text-primary transition-colors truncate block"
                  href={`mailto:${email}`}
                  title={email}
                >
                  {email}
                </a>
                {index === 0 && filteredEmails.length > 1 && (
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
            <CopyButton text={email} />
          </div>
        ))}

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
              : `+${filteredEmails.length - maxVisible} more`}
          </button>
        )}
      </div>
    );
  },
);

EmailList.displayName = "EmailList";
