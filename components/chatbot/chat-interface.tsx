"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Edit, MoreHorizontal, Settings, KeyRound } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ChatbotMessage, ChatbotConversation, studySubjects } from '@/lib/services/chatbot-service';
import { formatTimeAgo, cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';

interface ChatInterfaceProps {
  conversation: ChatbotConversation;
  isLoading?: boolean;
  onSendMessage: (message: string) => void;
  onEditTitle: (conversationId: string, title: string) => void;
  onOpenApiSettings?: () => void;
  isModelInitialized?: boolean;
}

export default function ChatInterface({ 
  conversation, 
  isLoading = false, 
  onSendMessage, 
  onEditTitle,
  onOpenApiSettings,
  isModelInitialized = false
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(conversation.title);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);
  
  // Focus input on load
  useEffect(() => {
    if (!editingTitle) {
      inputRef.current?.focus();
    }
  }, [editingTitle]);
  
  // Focus title input when editing
  useEffect(() => {
    if (editingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [editingTitle]);
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue("");
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleStartEditingTitle = () => {
    setTitleInput(conversation.title);
    setEditingTitle(true);
  };
  
  const handleSaveTitle = () => {
    if (titleInput.trim()) {
      onEditTitle(conversation.id, titleInput);
    } else {
      setTitleInput(conversation.title);
    }
    setEditingTitle(false);
  };
  
  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setTitleInput(conversation.title);
      setEditingTitle(false);
    }
  };
  
  // Get the icon for the subject
  const subjectIcon = studySubjects.find(s => s.id === conversation.subject)?.icon || "📝";
  
  // Show a welcome message if there are no messages
  const showWelcomeMessage = conversation.messages.length === 0;
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center justify-between bg-muted/50">
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-full bg-primary/10 h-10 w-10 flex items-center justify-center text-xl">
            {subjectIcon}
          </div>
          <div className="ml-3">
            {editingTitle ? (
              <div className="flex items-center">
                <Input
                  ref={titleInputRef}
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={handleTitleKeyDown}
                  className="h-8 text-base font-medium"
                />
              </div>
            ) : (
              <div className="flex items-center">
                <h2 className="text-base font-medium mr-2">{conversation.title}</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={handleStartEditingTitle}
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              {studySubjects.find(s => s.id === conversation.subject)?.name} • {
                conversation.messages.length === 0 
                  ? 'New conversation'
                  : `${conversation.messages.length} messages`
              }
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleStartEditingTitle}>
              <Edit className="h-4 w-4 mr-2" />
              <span>Rename</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onOpenApiSettings}>
              <KeyRound className="h-4 w-4 mr-2" />
              <span>API Settings</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6 max-w-3xl mx-auto">
          {showWelcomeMessage ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <Logo showText={false} size="lg" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Welcome to your {studySubjects.find(s => s.id === conversation.subject)?.name} Study Session
              </h3>
              <p className="text-muted-foreground max-w-md">
                Ask any {studySubjects.find(s => s.id === conversation.subject)?.name.toLowerCase()} questions, 
                request explanations, or get help with specific problems. I'm here to assist your learning!
              </p>
            </div>
          ) : (
            conversation.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div className="flex items-start gap-4 max-w-[85%]">
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 mt-1">
                      <div className="h-full w-full rounded-full bg-primary flex items-center justify-center">
                        <Logo showText={false} size="sm" className="text-white" />
                      </div>
                    </Avatar>
                  )}
                  
                  <div className="flex flex-col">
                    <div
                      className={cn(
                        "rounded-lg px-4 py-3 shadow-sm",
                        message.role === "user" 
                          ? "bg-primary text-primary-foreground ml-auto" 
                          : "bg-muted"
                      )}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                    <div
                      className={cn(
                        "text-xs text-muted-foreground mt-1",
                        message.role === "user" ? "text-right" : "text-left"
                      )}
                    >
                      {formatTimeAgo(new Date(message.timestamp))}
                    </div>
                  </div>
                  
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 mt-1">
                      <div className="h-full w-full rounded-full bg-muted flex items-center justify-center text-primary-foreground">
                        U
                      </div>
                    </Avatar>
                  )}
                </div>
              </div>
            ))
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8">
                  <div className="h-full w-full rounded-full bg-primary flex items-center justify-center">
                    <Logo showText={false} size="sm" className="text-white" />
                  </div>
                </Avatar>
                <div className="bg-muted rounded-lg px-4 py-3 flex items-center">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce" 
                      style={{ animationDelay: "0ms" }}></div>
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce" 
                      style={{ animationDelay: "150ms" }}></div>
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce" 
                      style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Input Area */}
      <div className="p-4 border-t bg-muted/50">
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isModelInitialized ? 
              `Ask about ${studySubjects.find(s => s.id === conversation.subject)?.name}...` : 
              "Configure API key to start chatting..."
            }
            className="flex-1 bg-background"
            disabled={isLoading || !isModelInitialized}
          />
          {!isModelInitialized ? (
            <Button 
              onClick={onOpenApiSettings}
              size="icon"
              variant="outline"
            >
              <KeyRound className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 