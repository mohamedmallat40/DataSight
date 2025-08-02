"use client";

import React from "react";
import MessageCard from "./message-card";
import type { ChatMessage } from "@/hooks/use-ai-chat";

interface ConversationProps {
  messages: ChatMessage[];
  onMessageCopy?: (content: string) => void;
  onFeedback?: (messageId: string, feedback: "like" | "dislike") => void;
}

export default function Conversation({ 
  messages, 
  onMessageCopy, 
  onFeedback 
}: ConversationProps) {
  return (
    <div className="flex flex-col gap-4 px-1">
      {messages.map((message, index) => (
        <MessageCard
          key={message.id}
          avatar={
            message.type === "ai"
              ? "https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatar_ai.png"
              : "https://d2u8k2ocievbld.cloudfront.net/memojis/male/6.png"
          }
          message={message.content}
          messageClassName={
            message.type === "user" 
              ? "bg-content3 text-content3-foreground" 
              : undefined
          }
          showFeedback={message.type === "ai"}
          taggedCompanies={message.taggedCompanies}
          taggedContacts={message.taggedContacts}
          suggestions={message.suggestions}
          onMessageCopy={onMessageCopy}
          onFeedback={(feedback) => onFeedback?.(message.id, feedback)}
          onSuggestionClick={(suggestion) => console.log("Suggestion clicked:", suggestion)}
        />
      ))}
    </div>
  );
}