"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {ScrollShadow, Tab, Tabs, Card, CardBody, Button, Avatar, Chip, Divider, Input, Spinner} from "@heroui/react";
import { SearchIcon } from "@heroui/shared-icons";
import { Icon } from "@iconify/react";

import DefaultLayout from "@/layouts/default";
import Conversation from "@/components/ai-chat/conversation";
import PromptInputWithActions from "@/components/ai-chat/prompt-input-with-actions";
import { useAIChat } from "@/hooks/use-ai-chat";
import type { Company, Contact } from "@/hooks/use-ai-chat";

interface MentionableEntity {
  id: string;
  name: string;
  type: 'company' | 'contact';
  company?: string;
  industry?: string;
  role?: string;
}

interface ConversationData {
  id: string;
  title: string;
  date: string;
  time: string;
  messages: number;
  lastMessage: string;
  status: string;
  taggedEntities?: MentionableEntity[];
}

// Generate mock conversation history with more data for infinite scroll
const generateMockConversations = (count: number, offset: number = 0): ConversationData[] => {
  const titles = [
    "TechCorp Analysis", "Market Research Q4", "Client Insights Review", "Competitor Analysis", 
    "Revenue Optimization", "Customer Segmentation", "Product Launch Strategy", "Sales Performance Review",
    "Digital Transformation", "Supply Chain Analysis", "Financial Forecasting", "Brand Positioning Study",
    "Operational Efficiency", "Risk Assessment", "Market Entry Strategy", "Partnership Evaluation",
    "User Experience Research", "Investment Analysis", "Regulatory Compliance", "Innovation Pipeline"
  ];
  
  const lastMessages = [
    "Based on the data, this shows strong growth potential...",
    "The quarterly analysis reveals interesting trends in...",
    "Customer satisfaction metrics indicate...",
    "Key competitors are positioning themselves...",
    "The new pricing strategy could increase revenue by...",
    "Market segmentation data suggests...",
    "Product development timeline shows...",
    "Sales team performance metrics reveal...",
    "Digital adoption rates are increasing...",
    "Supply chain optimization could reduce costs by..."
  ];
  
  const statuses = ["active", "completed", "draft"];
  
  return Array.from({ length: count }, (_, i) => {
    const index = (i + offset) % titles.length;
    const date = new Date();
    date.setDate(date.getDate() - Math.floor((i + offset) / 2));
    
    return {
      id: `${i + offset + 1}`,
      title: `${titles[index]} ${offset + i > 19 ? `(${Math.floor((offset + i) / 20) + 1})` : ''}`,
      date: date.toISOString().split('T')[0],
      time: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
      messages: Math.floor(Math.random() * 25) + 1,
      lastMessage: lastMessages[index % lastMessages.length],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      taggedEntities: []
    };
  });
};

const CONVERSATIONS_PER_PAGE = 10;
const initialConversations = generateMockConversations(CONVERSATIONS_PER_PAGE);

export default function AIChatPage() {
  const { messages, isLoading, sendMessage, clearMessages } = useAIChat();
  const [prompt, setPrompt] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [chatMode, setChatMode] = useState("creative");
  
  // Conversation management
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversation, setActiveConversation] = useState(initialConversations[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreConversations, setHasMoreConversations] = useState(true);
  
  // Entity mentions for current conversation
  const [currentConversationEntities, setCurrentConversationEntities] = useState<MentionableEntity[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationsEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCompanySelect = (company: Company) => {
    if (!selectedCompanies.find((c) => c.id === company.id)) {
      setSelectedCompanies([...selectedCompanies, company]);
    }
  };

  const handleContactSelect = (contact: Contact) => {
    if (!selectedContacts.find((c) => c.id === contact.id)) {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleCompanyRemove = (companyId: string) => {
    setSelectedCompanies(selectedCompanies.filter((c) => c.id !== companyId));
  };

  const handleContactRemove = (contactId: string) => {
    setSelectedContacts(selectedContacts.filter((c) => c.id !== contactId));
  };

  const handleEntityMention = (entity: MentionableEntity) => {
    // Add entity to current conversation
    if (!currentConversationEntities.find(e => e.id === entity.id)) {
      const newEntities = [...currentConversationEntities, entity];
      setCurrentConversationEntities(newEntities);
      
      // Update the active conversation with tagged entities
      const updatedConversation = {
        ...activeConversation,
        taggedEntities: newEntities
      };
      setActiveConversation(updatedConversation);
      
      // Update the conversation in the list
      setConversations(prev => 
        prev.map(conv => 
          conv.id === activeConversation.id 
            ? updatedConversation
            : conv
        )
      );
    }
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    await sendMessage(prompt, selectedCompanies, selectedContacts);
    setPrompt("");
    setSelectedCompanies([]);
    setSelectedContacts([]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const handleMessageCopy = (content: string) => {
    console.log("Copied message:", content);
  };

  const handleFeedback = (messageId: string, feedback: "like" | "dislike") => {
    console.log("Message feedback:", messageId, feedback);
  };

  // Load more conversations for infinite scroll
  const loadMoreConversations = useCallback(async () => {
    if (isLoadingMore || !hasMoreConversations) return;
    
    setIsLoadingMore(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newConversations = generateMockConversations(CONVERSATIONS_PER_PAGE, conversations.length);
    
    if (conversations.length >= 100) { // Limit for demo
      setHasMoreConversations(false);
    } else {
      setConversations(prev => [...prev, ...newConversations]);
    }
    
    setIsLoadingMore(false);
  }, [conversations.length, isLoadingMore, hasMoreConversations]);

  // Handle scroll for infinite loading
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    // Load more when scrolled to bottom
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      loadMoreConversations();
    }
  }, [loadMoreConversations]);

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => 
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle conversation selection
  const handleConversationSelect = useCallback(async (conversation: ConversationData) => {
    setActiveConversation(conversation);
    
    // Load tagged entities for this conversation
    setCurrentConversationEntities(conversation.taggedEntities || []);
    
    // Simulate loading conversation messages
    console.log('Loading conversation:', conversation.id);
    
    // Clear current messages and load new ones
    clearMessages();
    
    // You would typically load messages from API here
    // For demo purposes, we'll just show the conversation is selected
  }, [clearMessages]);

  return (
    <DefaultLayout>
      <div className="flex h-[calc(100vh-180px)] gap-6 max-h-[calc(100vh-180px)]">
        {/* Conversation History Sidebar */}
        <Card className="w-80 flex-shrink-0 h-full">
          <CardBody className="p-0 h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-divider">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground">Conversations</h3>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-default-400 hover:text-foreground"
                  onPress={() => {
                    // Create new conversation
                    const newConv: ConversationData = {
                      id: `new-${Date.now()}`,
                      title: "New Conversation",
                      date: new Date().toISOString().split('T')[0],
                      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
                      messages: 0,
                      lastMessage: "Start a new conversation...",
                      status: "draft",
                      taggedEntities: []
                    };
                    setConversations(prev => [newConv, ...prev]);
                    setActiveConversation(newConv);
                    setCurrentConversationEntities([]);
                    clearMessages();
                  }}
                >
                  <Icon icon="solar:add-circle-linear" width={18} />
                </Button>
              </div>
              
              {/* Search Input */}
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                startContent={<SearchIcon className="text-default-400" width={18} />}
                classNames={{
                  base: "max-w-full",
                  mainWrapper: "h-full",
                  input: "text-small",
                  inputWrapper: "h-8 font-normal text-default-500 bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100",
                }}
                size="sm"
                type="search"
              />
            </div>
            
            {/* Conversations List */}
            <ScrollShadow 
              ref={scrollContainerRef}
              className="flex-1 min-h-0"
              onScroll={handleScroll}
            >
              <div className="p-2">
                {filteredConversations.map((conv) => {
                  const isActive = activeConversation.id === conv.id;
                  const formatDate = (dateStr: string) => {
                    const date = new Date(dateStr);
                    const today = new Date();
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    
                    if (date.toDateString() === today.toDateString()) {
                      return "Today";
                    } else if (date.toDateString() === yesterday.toDateString()) {
                      return "Yesterday";
                    } else {
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }
                  };
                  
                  return (
                    <div
                      key={conv.id}
                      className={`group p-3 m-1 rounded-lg cursor-pointer transition-all duration-200 border ${
                        isActive
                          ? "bg-content2 border-divider"
                          : "border-transparent hover:bg-content1"
                      }`}
                      onClick={() => handleConversationSelect(conv)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          {/* Title */}
                          <h4 className="font-medium text-sm text-foreground truncate mb-1">
                            {conv.title}
                          </h4>
                          
                          {/* Last message preview */}
                          <p className="text-xs text-default-500 line-clamp-2 leading-relaxed mb-2">
                            {conv.lastMessage}
                          </p>
                          
                          {/* Tagged entities preview */}
                          {conv.taggedEntities && conv.taggedEntities.length > 0 && (
                            <div className="flex items-center gap-1 mb-2">
                              <Icon icon="solar:at-linear" width={10} className="text-default-400" />
                              <div className="flex gap-1">
                                {conv.taggedEntities.slice(0, 2).map((entity) => (
                                  <Chip
                                    key={entity.id}
                                    size="sm"
                                    variant="flat"
                                    color={entity.type === 'company' ? 'primary' : 'secondary'}
                                    className="text-xs h-4 px-1"
                                  >
                                    {entity.name}
                                  </Chip>
                                ))}
                                {conv.taggedEntities.length > 2 && (
                                  <span className="text-xs text-default-400">+{conv.taggedEntities.length - 2}</span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Footer with date only */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-default-400">
                              {formatDate(conv.date)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="w-6 h-6 min-w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Icon icon="solar:menu-dots-linear" width={14} className="text-default-400" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Loading indicator for infinite scroll */}
                {isLoadingMore && (
                  <div className="flex justify-center items-center p-4">
                    <Spinner size="sm" />
                    <span className="ml-2 text-sm text-default-500">Loading more...</span>
                  </div>
                )}
                
                {/* End indicator */}
                {!hasMoreConversations && filteredConversations.length > 0 && (
                  <div className="flex justify-center items-center p-4">
                    <span className="text-xs text-default-400">No more conversations</span>
                  </div>
                )}
                
                {/* No search results */}
                {searchQuery && filteredConversations.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Icon icon="solar:magnifer-linear" width={32} className="text-default-300 mb-2" />
                    <p className="text-sm text-default-500">No conversations found</p>
                    <p className="text-xs text-default-400 mt-1">Try adjusting your search terms</p>
                  </div>
                )}
                
                <div ref={conversationsEndRef} />
              </div>
            </ScrollShadow>
            
          </CardBody>
        </Card>

        {/* Main Chat Area */}
        <Card className="flex-1 h-full">
          <CardBody className="p-0 h-full flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-divider">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    size="sm"
                    src="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatar_ai.png"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{activeConversation.title}</h2>
                    <p className="text-sm text-default-500">AI Assistant</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="text-default-400 hover:text-foreground"
                  >
                    <Icon icon="solar:settings-linear" width={18} />
                  </Button>
                  <Tabs 
                    size="sm"
                    selectedKey={chatMode}
                    onSelectionChange={(key) => setChatMode(key as string)}
                  >
                    <Tab key="creative" title="Creative" />
                    <Tab key="analytical" title="Analytical" />
                    <Tab key="precise" title="Precise" />
                  </Tabs>
                </div>
              </div>
              
              {/* Tagged entities */}
              {(selectedCompanies.length > 0 || selectedContacts.length > 0 || currentConversationEntities.length > 0) && (
                <div className="mt-4">
                  <p className="text-xs text-default-600 font-medium mb-2">Tagged for Analysis</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompanies.map((company) => (
                      <Chip
                        key={company.id}
                        size="sm"
                        variant="flat"
                        color="primary"
                        onClose={() => handleCompanyRemove(company.id)}
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
                        onClose={() => handleContactRemove(contact.id)}
                      >
                        {contact.name}
                      </Chip>
                    ))}
                    {currentConversationEntities.map((entity) => (
                      <Chip
                        key={`conv-${entity.id}`}
                        size="sm"
                        variant="flat"
                        color={entity.type === 'company' ? 'primary' : 'secondary'}
                        startContent={<Icon icon="solar:at-linear" width={12} />}
                      >
                        {entity.name}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col min-h-0">
              <ScrollShadow className="flex-1 p-4 min-h-0">
                <Conversation 
                  messages={messages}
                  onMessageCopy={handleMessageCopy}
                  onFeedback={handleFeedback}
                />
                {isLoading && (
                  <div className="flex gap-3 px-1 mt-4">
                    <div className="relative flex-none">
                      <Avatar 
                        size="sm"
                        src="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatar_ai.png"
                      />
                    </div>
                    <div className="flex w-full flex-col gap-4">
                      <div className="relative w-full rounded-medium bg-content2 px-4 py-3 text-default-600">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-default-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-default-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 bg-default-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                          <span className="text-sm text-default-600">AI is analyzing...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </ScrollShadow>
              
              {/* Input Area */}
              <div className="p-4 border-t border-divider">
                <PromptInputWithActions
                  prompt={prompt}
                  onPromptChange={setPrompt}
                  onSubmit={handleSubmit}
                  onCompanyTag={handleCompanySelect}
                  onContactTag={handleContactSelect}
                  isLoading={isLoading}
                  taggedEntities={currentConversationEntities}
                  onEntityMention={handleEntityMention}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </DefaultLayout>
  );
}