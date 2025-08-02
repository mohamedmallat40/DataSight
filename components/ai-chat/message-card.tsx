"use client";

import React from "react";
import {Avatar, Badge, Button, Link, Tooltip, Chip} from "@heroui/react";
import {useClipboard} from "@heroui/use-clipboard";
import {Icon} from "@iconify/react";
import {cn} from "@heroui/react";
import type { Company, Contact } from "@/hooks/use-ai-chat";

export type MessageCardProps = React.HTMLAttributes<HTMLDivElement> & {
  avatar?: string;
  showFeedback?: boolean;
  message?: React.ReactNode;
  currentAttempt?: number;
  status?: "success" | "failed";
  attempts?: number;
  messageClassName?: string;
  taggedCompanies?: Company[];
  taggedContacts?: Contact[];
  suggestions?: string[];
  onAttemptChange?: (attempt: number) => void;
  onMessageCopy?: (content: string | string[]) => void;
  onFeedback?: (feedback: "like" | "dislike") => void;
  onAttemptFeedback?: (feedback: "like" | "dislike" | "same") => void;
  onSuggestionClick?: (suggestion: string) => void;
};

const MessageCard = React.forwardRef<HTMLDivElement, MessageCardProps>(
  (
    {
      avatar,
      message,
      showFeedback,
      attempts = 1,
      currentAttempt = 1,
      status,
      taggedCompanies = [],
      taggedContacts = [],
      suggestions = [],
      onMessageCopy,
      onAttemptChange,
      onFeedback,
      onAttemptFeedback,
      onSuggestionClick,
      className,
      messageClassName,
      ...props
    },
    ref,
  ) => {
    const [feedback, setFeedback] = React.useState<"like" | "dislike">();
    const [attemptFeedback, setAttemptFeedback] = React.useState<"like" | "dislike" | "same">();

    const messageRef = React.useRef<HTMLDivElement>(null);

    const {copied, copy} = useClipboard();

    const failedMessageClassName =
      status === "failed" ? "bg-danger-100/50 border border-danger-100 text-foreground" : "";
    const failedMessage = (
      <p>
        Something went wrong, if the issue persists please contact us through our help center
        at&nbsp;
        <Link href="mailto:support@datasight.com" size="sm">
          support@datasight.com
        </Link>
      </p>
    );

    const hasFailed = status === "failed";

    const handleCopy = React.useCallback(() => {
      let stringValue = "";

      if (typeof message === "string") {
        stringValue = message;
      } else if (Array.isArray(message)) {
        message.forEach((child) => {
          // @ts-ignore
          const childString =
            typeof child === "string" ? child : child?.props?.children?.toString();

          if (childString) {
            stringValue += childString + "\n";
          }
        });
      }

      const valueToCopy = stringValue || messageRef.current?.textContent || "";

      copy(valueToCopy);

      onMessageCopy?.(valueToCopy);
    }, [copy, message, onMessageCopy]);

    const handleFeedback = React.useCallback(
      (liked: boolean) => {
        setFeedback(liked ? "like" : "dislike");

        onFeedback?.(liked ? "like" : "dislike");
      },
      [onFeedback],
    );

    const handleAttemptFeedback = React.useCallback(
      (feedback: "like" | "dislike" | "same") => {
        setAttemptFeedback(feedback);

        onAttemptFeedback?.(feedback);
      },
      [onAttemptFeedback],
    );

    return (
      <div {...props} ref={ref} className={cn("flex gap-3", className)}>
        <div className="relative flex-none">
          <Badge
            isOneChar
            color="danger"
            content={<Icon className="text-background" icon="solar:danger-triangle-bold" />}
            isInvisible={!hasFailed}
            placement="bottom-right"
            shape="circle"
          >
            <Avatar src={avatar} />
          </Badge>
        </div>
        <div className="flex w-full flex-col gap-4">
          <div
            className={cn(
              "relative w-full rounded-medium bg-content2 px-4 py-3 text-default-600",
              failedMessageClassName,
              messageClassName,
            )}
          >
            <div ref={messageRef} className={"pr-20 text-small"}>
              {hasFailed ? failedMessage : message}
            </div>
            
            {/* Tagged entities */}
            {(taggedCompanies.length > 0 || taggedContacts.length > 0) && (
              <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-divider">
                {taggedCompanies.map((company) => (
                  <Chip key={company.id} size="sm" variant="flat" color="primary">
                    <Icon icon="solar:buildings-bold" width={12} className="mr-1" />
                    {company.name}
                  </Chip>
                ))}
                {taggedContacts.map((contact) => (
                  <Chip key={contact.id} size="sm" variant="flat" color="secondary">
                    <Icon icon="solar:user-bold" width={12} className="mr-1" />
                    {contact.name}
                  </Chip>
                ))}
              </div>
            )}

            {showFeedback && !hasFailed && (
              <div className="absolute right-2 top-2 flex rounded-full bg-content2 shadow-small">
                <Button isIconOnly radius="full" size="sm" variant="light" onPress={handleCopy}>
                  {copied ? (
                    <Icon className="text-lg text-default-600" icon="solar:check-circle-bold" />
                  ) : (
                    <Icon className="text-lg text-default-600" icon="solar:copy-linear" />
                  )}
                </Button>
                <Button
                  isIconOnly
                  radius="full"
                  size="sm"
                  variant="light"
                  onPress={() => handleFeedback(true)}
                >
                  {feedback === "like" ? (
                    <Icon className="text-lg text-success" icon="solar:like-bold" />
                  ) : (
                    <Icon className="text-lg text-default-600" icon="solar:like-linear" />
                  )}
                </Button>
                <Button
                  isIconOnly
                  radius="full"
                  size="sm"
                  variant="light"
                  onPress={() => handleFeedback(false)}
                >
                  {feedback === "dislike" ? (
                    <Icon className="text-lg text-danger" icon="solar:dislike-bold" />
                  ) : (
                    <Icon className="text-lg text-default-600" icon="solar:dislike-linear" />
                  )}
                </Button>
              </div>
            )}
            {attempts > 1 && !hasFailed && (
              <div className="flex w-full items-center justify-end">
                <button
                  onClick={() => onAttemptChange?.(currentAttempt > 1 ? currentAttempt - 1 : 1)}
                >
                  <Icon
                    className="cursor-pointer text-default-400 hover:text-default-500"
                    icon="solar:arrow-left-circle-linear"
                  />
                </button>
                <button
                  onClick={() =>
                    onAttemptChange?.(currentAttempt < attempts ? currentAttempt + 1 : attempts)
                  }
                >
                  <Icon
                    className="cursor-pointer text-default-400 hover:text-default-500"
                    icon="solar:arrow-right-circle-linear"
                  />
                </button>
                <p className="px-1 text-tiny font-medium text-default-500">
                  {currentAttempt}/{attempts}
                </p>
              </div>
            )}
          </div>
          
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="bordered"
                  className="h-auto text-xs p-2 justify-start"
                  onPress={() => onSuggestionClick?.(suggestion)}
                >
                  <Icon icon="solar:arrow-right-linear" width={12} className="mr-1" />
                  {suggestion}
                </Button>
              ))}
            </div>
          )}

          {showFeedback && attempts > 1 && (
            <div className="flex items-center justify-between rounded-medium border-small border-default-100 px-4 py-3 shadow-small">
              <p className="text-small text-default-600">Was this response better or worse?</p>
              <div className="flex gap-1">
                <Tooltip content="Better">
                  <Button
                    isIconOnly
                    radius="full"
                    size="sm"
                    variant="light"
                    onPress={() => handleAttemptFeedback("like")}
                  >
                    {attemptFeedback === "like" ? (
                      <Icon className="text-lg text-primary" icon="solar:like-bold" />
                    ) : (
                      <Icon className="text-lg text-default-600" icon="solar:like-linear" />
                    )}
                  </Button>
                </Tooltip>
                <Tooltip content="Worse">
                  <Button
                    isIconOnly
                    radius="full"
                    size="sm"
                    variant="light"
                    onPress={() => handleAttemptFeedback("dislike")}
                  >
                    {attemptFeedback === "dislike" ? (
                      <Icon
                        className="text-lg text-danger"
                        icon="solar:dislike-bold"
                      />
                    ) : (
                      <Icon className="text-lg text-default-600" icon="solar:dislike-linear" />
                    )}
                  </Button>
                </Tooltip>
                <Tooltip content="Same">
                  <Button
                    isIconOnly
                    radius="full"
                    size="sm"
                    variant="light"
                    onPress={() => handleAttemptFeedback("same")}
                  >
                    {attemptFeedback === "same" ? (
                      <Icon className="text-lg text-warning" icon="solar:face-sad-bold" />
                    ) : (
                      <Icon className="text-lg text-default-600" icon="solar:face-sad-linear" />
                    )}
                  </Button>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
);

export default MessageCard;

MessageCard.displayName = "MessageCard";