"use client";

import type {TextAreaProps} from "@heroui/react";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {Textarea, Card, CardBody, Avatar, User, Chip} from "@heroui/react";
import {cn} from "@heroui/react";
import { Icon } from "@iconify/react";
import type { Company, Contact } from "@/hooks/use-ai-chat";
import { mockCompanies, mockContacts } from "@/hooks/use-ai-chat";

interface MentionableEntity {
  id: string;
  name: string;
  type: 'company' | 'contact';
  company?: string;
  industry?: string;
  role?: string;
}

interface PromptInputWithMentionsProps extends TextAreaProps {
  onEntityMention?: (entity: MentionableEntity) => void;
}

const PromptInput = React.forwardRef<HTMLTextAreaElement, PromptInputWithMentionsProps>(
  ({classNames = {}, onEntityMention, onValueChange, value, ...props}, ref) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [mentionQuery, setMentionQuery] = useState("");
    const [mentionPosition, setMentionPosition] = useState({ start: 0, end: 0 });
    const [suggestions, setSuggestions] = useState<MentionableEntity[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const suggestionRef = useRef<HTMLDivElement>(null);

    // Combine companies and contacts into mentionable entities
    const allEntities: MentionableEntity[] = [
      ...mockCompanies.map(company => ({
        id: company.id,
        name: company.name,
        type: 'company' as const,
        industry: company.industry,
      })),
      ...mockContacts.map(contact => ({
        id: contact.id,
        name: contact.name,
        type: 'contact' as const,
        company: contact.company,
        role: contact.role,
      })),
    ];

    const filterSuggestions = useCallback((query: string) => {
      if (!query) return allEntities.slice(0, 5);
      
      return allEntities
        .filter(entity => 
          entity.name.toLowerCase().includes(query.toLowerCase()) ||
          (entity.type === 'company' && entity.industry?.toLowerCase().includes(query.toLowerCase())) ||
          (entity.type === 'contact' && entity.company?.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 5);
    }, []);

    const handleInputChange = useCallback((newValue: string) => {
      if (onValueChange) {
        onValueChange(newValue);
      }

      // Check for @ mentions
      const textarea = textareaRef.current;
      if (!textarea) return;

      const cursorPosition = textarea.selectionStart;
      const textBeforeCursor = newValue.slice(0, cursorPosition);
      const lastAtIndex = textBeforeCursor.lastIndexOf('@');

      if (lastAtIndex !== -1) {
        const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
        const hasSpaceAfterAt = textAfterAt.includes(' ');

        if (!hasSpaceAfterAt) {
          setMentionQuery(textAfterAt);
          setMentionPosition({ start: lastAtIndex, end: cursorPosition });
          setSuggestions(filterSuggestions(textAfterAt));
          setShowSuggestions(true);
          setSelectedIndex(0);
          return;
        }
      }

      setShowSuggestions(false);
    }, [onValueChange, filterSuggestions]);

    const insertMention = useCallback((entity: MentionableEntity) => {
      const currentValue = (value || "") as string;
      const beforeMention = currentValue.slice(0, mentionPosition.start);
      const afterMention = currentValue.slice(mentionPosition.end);
      const newValue = `${beforeMention}@${entity.name} ${afterMention}`;

      if (onValueChange) {
        onValueChange(newValue);
      }

      if (onEntityMention) {
        onEntityMention(entity);
      }

      setShowSuggestions(false);
      
      // Focus back to textarea and set cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPosition = beforeMention.length + entity.name.length + 2;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
        }
      }, 0);
    }, [value, mentionPosition, onValueChange, onEntityMention]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (showSuggestions) {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % suggestions.length);
            break;
          case 'ArrowUp':
            e.preventDefault();
            setSelectedIndex(prev => prev === 0 ? suggestions.length - 1 : prev - 1);
            break;
          case 'Enter':
          case 'Tab':
            e.preventDefault();
            if (suggestions[selectedIndex]) {
              insertMention(suggestions[selectedIndex]);
            }
            break;
          case 'Escape':
            setShowSuggestions(false);
            break;
        }
      }
    }, [showSuggestions, suggestions, selectedIndex, insertMention]);

    // Handle clicking outside to close suggestions
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
          setShowSuggestions(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div className="relative">
        <Textarea
          ref={(el) => {
            if (typeof ref === 'function') {
              ref(el);
            } else if (ref) {
              ref.current = el;
            }
            textareaRef.current = el;
          }}
          aria-label="Prompt"
          className="min-h-[40px]"
          classNames={{
            ...classNames,
            label: cn("hidden", classNames?.label),
            input: cn("py-0", classNames?.input),
          }}
          minRows={1}
          placeholder="Ask about companies, contacts, or business insights... Use @ to mention entities"
          radius="lg"
          variant="bordered"
          value={value}
          onValueChange={handleInputChange}
          onKeyDown={handleKeyDown}
          {...props}
        />
        
        {showSuggestions && suggestions.length > 0 && (
          <Card 
            ref={suggestionRef}
            className="absolute bottom-full left-0 mb-2 w-80 max-h-60 overflow-y-auto z-50 shadow-lg"
          >
            <CardBody className="p-2">
              <div className="flex items-center gap-2 mb-2 px-2">
                <Icon icon="solar:at-linear" width={16} className="text-default-500" />
                <span className="text-xs text-default-500 font-medium">
                  Mention {mentionQuery ? `"${mentionQuery}"` : 'companies or contacts'}
                </span>
              </div>
              {suggestions.map((entity, index) => (
                <div
                  key={entity.id}
                  className={cn(
                    "p-2 rounded-lg cursor-pointer transition-colors flex items-center gap-3",
                    index === selectedIndex 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-default-100"
                  )}
                  onClick={() => insertMention(entity)}
                >
                  <Avatar
                    size="sm"
                    fallback={
                      <Icon 
                        icon={entity.type === 'company' ? "solar:buildings-linear" : "solar:user-linear"} 
                        width={16}
                        className="text-default-500"
                      />
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{entity.name}</span>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={entity.type === 'company' ? 'primary' : 'secondary'}
                        className="text-xs"
                      >
                        {entity.type}
                      </Chip>
                    </div>
                    <p className="text-xs text-default-500 truncate">
                      {entity.type === 'company' ? entity.industry : `${entity.role} at ${entity.company}`}
                    </p>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        )}
      </div>
    );
  },
);

export default PromptInput;

PromptInput.displayName = "PromptInput";