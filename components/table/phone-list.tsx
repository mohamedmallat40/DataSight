import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/react";
import React, { memo, useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

interface PhoneListProps {
  phones: string[];
  className?: string;
  maxVisible?: number;
}

interface CopyButtonProps {
  text: string;
  className?: string;
}

interface WhatsAppButtonProps {
  phone: string;
  className?: string;
}

interface CallButtonProps {
  phone: string;
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

const WhatsAppButton = memo(({ phone, className }: WhatsAppButtonProps) => {
  const handleWhatsAppClick = () => {
    // Clean the phone number (remove spaces, dashes, parentheses, etc.)
    const cleanPhone = phone.replace(/[^\d+]/g, "");

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${cleanPhone}`;

    // Open in new tab
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Tooltip content="Open WhatsApp chat">
      <Button
        isIconOnly
        className={cn(
          "h-6 w-6 min-w-6 text-success-500 hover:text-success-600",
          className,
        )}
        size="sm"
        variant="light"
        onPress={handleWhatsAppClick}
      >
        <Icon className="h-3 w-3" icon="ic:baseline-whatsapp" />
      </Button>
    </Tooltip>
  );
});

WhatsAppButton.displayName = "WhatsAppButton";

const CallButton = memo(({ phone, className }: CallButtonProps) => {
  const handleCallClick = () => {
    // Use tel: protocol for direct calling
    window.location.href = `tel:${phone}`;
  };

  return (
    <Tooltip content="Make a call">
      <Button
        isIconOnly
        className={cn(
          "h-6 w-6 min-w-6 text-blue-500 hover:text-blue-600",
          className,
        )}
        size="sm"
        variant="light"
        onPress={handleCallClick}
      >
        <Icon className="h-3 w-3" icon="solar:phone-calling-outline" />
      </Button>
    </Tooltip>
  );
});

CallButton.displayName = "CallButton";

export const PhoneList = memo(
  ({ phones, className, maxVisible = 3 }: PhoneListProps) => {
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
        {visiblePhones.map((phone, index) => (
          <div key={index} className="flex items-center gap-2 min-w-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <a
                  className="text-small text-default-700 hover:text-primary transition-colors truncate block"
                  href={`tel:${phone}`}
                  title={phone}
                >
                  {phone}
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <CallButton phone={phone} />
              <WhatsAppButton className="-ml-1" phone={phone} />
              <CopyButton className="-ml-1" text={phone} />
            </div>
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
              : `+${filteredPhones.length - maxVisible} more`}
          </button>
        )}
      </div>
    );
  },
);

PhoneList.displayName = "PhoneList";
