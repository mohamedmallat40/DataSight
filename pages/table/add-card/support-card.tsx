import React from "react";
import { AvatarGroup, Avatar, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

export type SupportCardProps = React.HTMLAttributes<HTMLDivElement>;

const SupportCard = React.forwardRef<HTMLDivElement, SupportCardProps>(
  ({ className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      className={cn(
        "align-center my-2 flex shrink-0 items-center justify-center gap-3 self-stretch rounded-large bg-content1 px-3 py-3 shadow-small",
        className,
      )}
    >
      <AvatarGroup isBordered size="sm">
        <Avatar
          classNames={{
            base: "ring-0 ring-offset-1 w-[25px] h-[25px]",
          }}
          src="https://img.heroui.chat/image/avatar?w=200&h=200&u=1"
        />
        <Avatar
          classNames={{
            base: "ring-0 ring-offset-1 w-[25px] h-[25px]",
          }}
          src="https://img.heroui.chat/image/avatar?w=200&h=200&u=2"
        />
        <Avatar
          classNames={{
            base: "ring-0 ring-offset-1 w-[25px] h-[25px]",
          }}
          src="https://img.heroui.chat/image/avatar?w=200&h=200&u=3"
        />
      </AvatarGroup>
      <div className="line-clamp-2 text-left text-tiny font-medium text-default-700">
        Need help with scanning your business cards?
      </div>
      <Button
        isIconOnly
        className="align-center flex h-[32px] w-[31px] justify-center rounded-[12px] bg-default-100 dark:bg-default-100/40"
        size="sm"
        variant="flat"
      >
        <Icon
          className="text-default-400 dark:text-foreground"
          icon="lucide:message-circle"
          width={20}
        />
      </Button>
    </div>
  ),
);

SupportCard.displayName = "SupportCard";

export default SupportCard;
