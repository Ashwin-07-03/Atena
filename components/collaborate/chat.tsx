"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, PaperclipIcon, SmilePlus, X, MoreVertical, Download, FileText, Image, Play, Paperclip } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Conversation, 
  Message,
  User, 
  getCurrentUser, 
  getConversationById, 
  markMessagesAsRead, 
  sendMessage 
} from '@/lib/services/collaboration-service';

interface ChatProps {
  conversationId: string;
  onBack?: () => void;
}

interface ChatMessage extends Message {
  isCurrentUser: boolean;
}

export default function Chat({ conversationId, onBack }: ChatProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Load conversation and user data
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    
    const loadedConversation = getConversationById(conversationId);
    if (loadedConversation) {
      setConversation(loadedConversation);
      
      const formattedMessages = loadedConversation.messages.map(message => ({
        ...message,
        isCurrentUser: message.senderId === user.id
      }));
      
      setMessages(formattedMessages);
      
      // Mark messages as read
      markMessagesAsRead(conversationId);
    }
  }, [conversationId]);
  
  // Scroll to bottom when messages change if we're already at the bottom
  useEffect(() => {
    if (isScrolledToBottom) {
      scrollToBottom();
    }
  }, [messages, isScrolledToBottom]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputValue.trim() && attachments.length === 0) return;
    if (!currentUser || !conversation) return;
    
    const newMessage = sendMessage(conversationId, inputValue);
    if (newMessage) {
      const chatMessage: ChatMessage = {
        ...newMessage,
        isCurrentUser: true
      };
      
      setMessages([...messages, chatMessage]);
      setInputValue('');
      setAttachments([]);
    }
  };
  
  // Handle key press in input field
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setAttachments([...attachments, ...filesArray]);
    }
  };
  
  // Format timestamp for display
  const formatTimestamp = (timestamp: Date) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let timeString = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (diffInDays > 0) {
      if (diffInDays === 1) {
        return `Yesterday at ${timeString}`;
      } else if (diffInDays < 7) {
        return `${messageDate.toLocaleDateString([], { weekday: 'short' })} at ${timeString}`;
      } else {
        return `${messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${timeString}`;
      }
    }
    
    return timeString;
  };
  
  // Group messages by sender and time (within 5 minutes)
  const groupedMessages = messages.reduce((groups: ChatMessage[][], message, index) => {
    const prevMessage = messages[index - 1];
    
    // Start a new group if:
    // 1. This is the first message
    // 2. The sender changed
    // 3. Time gap is more than 5 minutes
    const shouldStartNewGroup = 
      !prevMessage || 
      prevMessage.senderId !== message.senderId ||
      Math.abs(new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime()) > 5 * 60 * 1000;
    
    if (shouldStartNewGroup) {
      groups.push([message]);
    } else {
      groups[groups.length - 1].push(message);
    }
    
    return groups;
  }, []);
  
  // Get the title and participants for the conversation
  const getConversationTitle = () => {
    if (!conversation || !currentUser) return '';
    
    if (conversation.type === 'group') {
      return conversation.title || 'Group Chat';
    } else {
      // For direct conversations, show the other person's name
      const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
      return otherParticipant?.name || 'Chat';
    }
  };
  
  const getParticipants = () => {
    if (!conversation) return [];
    return conversation.participants.filter(p => p.id !== currentUser?.id);
  };
  
  if (!conversation || !currentUser) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          {onBack && (
            <Button variant="ghost" size="icon" className="mr-2 lg:hidden" onClick={onBack}>
              <X className="h-4 w-4" />
            </Button>
          )}
          
          <div className="flex items-center">
            {conversation.type === 'direct' ? (
              <Avatar className="h-9 w-9 mr-3">
                <AvatarImage src={getParticipants()[0]?.avatar} />
                <AvatarFallback>
                  {getParticipants()[0]?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="bg-primary/10 h-9 w-9 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
            )}
            
            <div>
              <div className="font-medium">{getConversationTitle()}</div>
              {conversation.type === 'group' && (
                <div className="text-xs text-muted-foreground">
                  {conversation.participants.length} participants
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View shared files</DropdownMenuItem>
            <DropdownMenuItem>Search in conversation</DropdownMenuItem>
            {conversation.type === 'group' && (
              <DropdownMenuItem>Manage participants</DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Delete conversation</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <ScrollArea 
        className="flex-1 p-4" 
        ref={scrollAreaRef}
        onScroll={(e) => {
          const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
          const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
          setIsScrolledToBottom(isAtBottom);
        }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-12 w-12 mb-4 text-muted-foreground/50"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <h3 className="font-medium text-lg">No messages yet</h3>
            <p className="text-sm mt-1 max-w-sm">
              {conversation.type === 'direct'
                ? `Start a conversation with ${getParticipants()[0]?.name}`
                : `Start a conversation in ${getConversationTitle()}`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedMessages.map((group, groupIndex) => {
              const firstMessage = group[0];
              const isCurrentUser = firstMessage.isCurrentUser;
              
              return (
                <div key={groupIndex} className="flex flex-col">
                  <div className="flex items-end gap-2 mb-1">
                    {!isCurrentUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={conversation.participants.find(p => p.id === firstMessage.senderId)?.avatar} />
                        <AvatarFallback>
                          {conversation.participants.find(p => p.id === firstMessage.senderId)?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`flex flex-col gap-2 ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-2">
                        {!isCurrentUser && (
                          <span className="font-medium text-sm">
                            {conversation.participants.find(p => p.id === firstMessage.senderId)?.name}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(firstMessage.timestamp)}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        {group.map((message, messageIndex) => (
                          <div
                            key={messageIndex}
                            className={`rounded-lg px-3 py-2 max-w-[80%] break-words ${
                              isCurrentUser
                                ? 'bg-primary text-primary-foreground self-end'
                                : 'bg-muted self-start'
                            }`}
                          >
                            {message.content}
                            
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {message.attachments.map((attachment, index) => {
                                  const isImage = attachment.type === 'image';
                                  
                                  return (
                                    <div key={index} className="rounded overflow-hidden border">
                                      {isImage ? (
                                        <div className="relative">
                                          <img 
                                            src={attachment.url} 
                                            alt={attachment.name} 
                                            className="max-h-48 w-auto object-contain bg-black/5"
                                          />
                                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                                            {attachment.name}
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="flex items-center p-2 gap-2 bg-background/80">
                                          <FileText className="h-5 w-5 text-blue-500" />
                                          <div className="flex-1 truncate text-xs">
                                            {attachment.name}
                                          </div>
                                          <Button size="icon" variant="ghost" className="h-6 w-6">
                                            <Download className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
      
      <div className="p-4 border-t">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center gap-2 border rounded-md p-2 bg-muted">
                {file.type.startsWith('image/') ? (
                  <Image className="h-4 w-4 text-green-500" />
                ) : (
                  <FileText className="h-4 w-4 text-blue-500" />
                )}
                <span className="text-xs truncate max-w-[120px]">{file.name}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5" 
                  onClick={() => {
                    setAttachments(attachments.filter((_, i) => i !== index));
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach file</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            onChange={handleFileChange}
          />
          
          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          
          <Button 
            variant="default" 
            size="icon" 
            className="rounded-full"
            disabled={!inputValue.trim() && attachments.length === 0}
            onClick={handleSendMessage}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 