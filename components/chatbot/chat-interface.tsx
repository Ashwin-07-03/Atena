"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Edit, MoreHorizontal, Settings, KeyRound, Sparkles } from 'lucide-react';
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
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/90">
      {/* Chat Header */}
      <div className="p-4 border-b border-primary/20 backdrop-blur-md flex items-center justify-between bg-background/90 rounded-b-xl shadow-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-full bg-primary/30 h-11 w-11 flex items-center justify-center text-xl shadow-inner animate-soft-bounce">
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
                  className="h-9 text-base font-medium rounded-full shadow-inner focus-ring"
                />
              </div>
            ) : (
              <div className="flex items-center">
                <h2 className="text-base font-medium mr-2 text-foreground">{conversation.title}</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-full hover:bg-primary/20 hover:text-primary-foreground transition-colors" 
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
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border border-primary/20 shadow-lg backdrop-blur-md">
            <DropdownMenuItem onClick={handleStartEditingTitle} className="rounded-lg focus:bg-primary/20">
              <Edit className="h-4 w-4 mr-2" />
              <span>Rename</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onOpenApiSettings} className="rounded-lg focus:bg-primary/20">
              <KeyRound className="h-4 w-4 mr-2" />
              <span>API Settings</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6 overflow-auto">
        <div className="space-y-6 max-w-3xl mx-auto">
          {showWelcomeMessage ? (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
              <div className="fluffy-bubble p-5 mb-6 animate-soft-bounce">
                <Logo showText={false} size="lg" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                Welcome to your {studySubjects.find(s => s.id === conversation.subject)?.name} Study Session
              </h3>
              <p className="text-muted-foreground max-w-md px-4 py-3 rounded-xl bg-muted/30 backdrop-blur-sm border border-primary/10 shadow-sm">
                Ask any {studySubjects.find(s => s.id === conversation.subject)?.name.toLowerCase()} questions, 
                request explanations, or get help with specific problems. I'm here to assist your learning!
              </p>
            </div>
          ) : (
            conversation.messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex animate-fade-in",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4 max-w-[85%]">
                  {message.role === "assistant" && (
                    <Avatar className="h-9 w-9 mt-1 border-2 border-accent/30 p-0.5 shadow-md">
                      <div className="h-full w-full rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </Avatar>
                  )}
                  
                  <div className="flex flex-col">
                    <div
                      className={cn(
                        "shadow-md",
                        message.role === "user" 
                          ? "message-bubble-user text-primary-foreground" 
                          : "message-bubble-assistant text-accent-foreground"
                      )}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                    <div
                      className={cn(
                        "text-xs text-muted-foreground mt-1.5 px-2",
                        message.role === "user" ? "text-right" : "text-left"
                      )}
                    >
                      {formatTimeAgo(new Date(message.timestamp))}
                    </div>
                  </div>
                  
                  {message.role === "user" && (
                    <Avatar className="h-9 w-9 mt-1 border-2 border-primary/30 p-0.5 shadow-md">
                      <div className="h-full w-full rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-primary-foreground font-medium">
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
            <div className="flex justify-start animate-fade-in">
              <div className="flex items-start gap-4">
                <Avatar className="h-9 w-9 border-2 border-accent/30 p-0.5 shadow-md">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                  </div>
                </Avatar>
                <div className="message-bubble-assistant flex items-center">
                  <div className="flex space-x-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-current animate-bounce opacity-75" 
                      style={{ animationDelay: "0ms" }}></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-current animate-bounce opacity-75" 
                      style={{ animationDelay: "150ms" }}></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-current animate-bounce opacity-75" 
                      style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Input Area */}
      <div className="p-4 border-t border-primary/20 bg-background/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto relative">
          <div className="relative flex items-center">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="pr-12 rounded-full shadow-inner border-primary/30 focus-ring"
              disabled={!isModelInitialized}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || !isModelInitialized}
              className="absolute right-1 h-9 w-9 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md hover:shadow-lg transition-all"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {!isModelInitialized && (
            <div className="mt-2 text-center text-sm text-muted-foreground bg-accent/30 rounded-lg p-2 shadow-sm border border-accent/20">
              <KeyRound className="h-4 w-4 inline mr-1" />
              <span>Please set up your API key in settings to start chatting</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 