"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { 
  MessageSquarePlus, 
  MessageSquare, 
  Send, 
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash,
  MoreHorizontal,
  Search,
  X,
  BookmarkPlus,
  Grid3X3,
  Wand2,
  Sparkles,
  Moon,
  Sun
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ChatSession, 
  Message,
  SavedPrompt
} from "@/lib/services/ai-assistant-service";
import Link from "next/link";
import { useTheme } from "next-themes";

export interface RecommendedPrompt {
  id: string;
  text: string;
  icon?: React.ReactNode;
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon?: React.ReactNode;
  color?: string;
}

export interface ChatLayoutProps {
  /** All available chat sessions */
  sessions: ChatSession[];
  /** Currently active session */
  activeSession: ChatSession | null;
  /** Loading state for AI responses */
  isLoading?: boolean;
  /** Current input message */
  inputMessage?: string;
  /** Whether the sidebar should be shown by default on mobile */
  defaultSidebarOpen?: boolean;
  /** Suggested prompts to show in the interface */
  recommendedPrompts?: RecommendedPrompt[];
  /** AI tools to show in the interface */
  aiTools?: AITool[];
  /** Saved prompts by the user */
  savedPrompts?: SavedPrompt[];
  /** Function to create a new chat session */
  onNewSession?: () => void;
  /** Function to switch to a different chat session */
  onSelectSession?: (sessionId: string) => void;
  /** Function to edit a session title */
  onEditSessionTitle?: (sessionId: string, title: string) => void;
  /** Function to delete a session */
  onDeleteSession?: (sessionId: string) => void;
  /** Function to send a message */
  onSendMessage?: (message: string) => void;
  /** Function called when input message changes */
  onInputChange?: (message: string) => void;
  /** Function called when a recommended prompt is selected */
  onRecommendedPrompt?: (prompt: string) => void;
  /** Function called when an AI tool is selected */
  onAITool?: (prompt: string) => void;
  /** Function to save a prompt */
  onSavePrompt?: (text: string) => void;
  /** Function to delete a saved prompt */
  onDeleteSavedPrompt?: (id: string) => void;
  /** Whether the assistant is using Gemini API */
  isUsingGemini?: boolean;
  /** Link to API settings page */
  apiSettingsLink?: string;
}

// Custom hook to handle sidebar hover effect
function useSidebarHover(defaultOpen: boolean) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [hoverTimerId, setHoverTimerId] = useState<NodeJS.Timeout | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const hoverAreaRef = useRef<HTMLDivElement>(null);
  
  const handleMouseEnter = () => {
    if (hoverTimerId) clearTimeout(hoverTimerId);
    if (!isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 300); // Delay to prevent accidental triggers
      setHoverTimerId(timer);
    }
  };
  
  const handleMouseLeave = () => {
    if (hoverTimerId) clearTimeout(hoverTimerId);
    if (isOpen && window.innerWidth > 1024) { // Only for desktop
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 500); // Delay before closing
      setHoverTimerId(timer);
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerId) clearTimeout(hoverTimerId);
    };
  }, [hoverTimerId]);
  
  return {
    isOpen,
    setIsOpen,
    sidebarRef,
    hoverAreaRef,
    handleMouseEnter,
    handleMouseLeave
  };
}

export function ChatLayout({
  sessions = [],
  activeSession = null,
  isLoading = false,
  inputMessage = "",
  defaultSidebarOpen = false,
  recommendedPrompts = [],
  aiTools = [],
  savedPrompts = [],
  onNewSession,
  onSelectSession,
  onEditSessionTitle,
  onDeleteSession,
  onSendMessage,
  onInputChange,
  onRecommendedPrompt,
  onAITool,
  onSavePrompt,
  onDeleteSavedPrompt,
  isUsingGemini = false,
  apiSettingsLink,
}: ChatLayoutProps) {
  const {
    isOpen: sidebarOpen,
    setIsOpen: setSidebarOpen,
    sidebarRef,
    hoverAreaRef,
    handleMouseEnter: handleSidebarMouseEnter,
    handleMouseLeave: handleSidebarMouseLeave
  } = useSidebarHover(defaultSidebarOpen);
  
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [featuresTab, setFeaturesTab] = useState<string>("recommended");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  // Filter sessions based on search query
  const filteredSessions = searchQuery 
    ? sessions.filter(session => 
        session.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : sessions;

  // Scroll to bottom of messages on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputMessage?.trim() || !onSendMessage) return;
    onSendMessage(inputMessage);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle editing session title
  const startEditingSession = (sessionId: string, currentTitle: string) => {
    setEditingSession(sessionId);
    setEditTitle(currentTitle);
  };

  const saveSessionTitle = () => {
    if (editingSession && onEditSessionTitle && editTitle.trim()) {
      onEditSessionTitle(editingSession, editTitle);
    }
    setEditingSession(null);
  };

  // Open AI features dialog with specific tab
  const openFeatures = (tab: string) => {
    setFeaturesTab(tab);
    setFeaturesOpen(true);
  };

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border bg-background shadow-lg transition-all duration-300 ease-in-out">
      {/* Sidebar hover area for desktop */}
      <div 
        ref={hoverAreaRef}
        className="hidden lg:block w-2 h-full absolute left-0 z-20" 
        onMouseEnter={handleSidebarMouseEnter}
      />

      {/* Mobile sidebar toggle */}
      <button 
        className="absolute left-2 top-2 z-30 rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Chat sessions sidebar */}
      <div 
        ref={sidebarRef}
        className={cn(
          "w-full max-w-xs flex-col border-r bg-muted/30 transition-all duration-500 ease-in-out z-10",
          sidebarOpen ? "flex lg:w-80 translate-x-0" : "hidden lg:flex lg:w-0 lg:-translate-x-full"
        )}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      >
        {/* New chat button and search */}
        <div className="flex flex-col space-y-2 border-b p-4">
          <Button 
            variant="default" 
            className="w-full justify-start gap-2 mb-2"
            onClick={onNewSession}
          >
            <MessageSquarePlus size={16} />
            <span>New Chat</span>
          </Button>
          
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              className="pl-8 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1.5 h-6 w-6 rounded-full p-0"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Chat sessions list */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            <h3 className="px-2 py-1 text-sm font-medium text-muted-foreground">Chat History</h3>
            <div className="space-y-1">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session) => (
                  <div key={session.id} className="relative">
                    {editingSession === session.id ? (
                      <div className="flex items-center px-2 py-1 gap-1">
                        <Input 
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveSessionTitle();
                            if (e.key === "Escape") setEditingSession(null);
                          }}
                          onBlur={saveSessionTitle}
                          autoFocus
                          className="h-8 text-sm"
                        />
                      </div>
                    ) : (
                      <button
                        className={cn(
                          "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent",
                          activeSession?.id === session.id && "bg-accent text-accent-foreground"
                        )}
                        onClick={() => onSelectSession?.(session.id)}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <MessageSquare size={16} />
                          <span className="truncate">{session.title}</span>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => startEditingSession(session.id, session.title)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Rename</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => onDeleteSession?.(session.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                  {searchQuery ? "No chats found" : "No chat history"}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Chat content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Chat header */}
        <div className="flex h-16 items-center justify-between border-b px-4 md:px-6 bg-background/95 backdrop-blur-sm sticky top-0 z-10 transition-all duration-300">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium">
              {activeSession ? activeSession.title : "New Chat"}
            </h2>
            
            {/* Theme toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 ml-2 rounded-full" 
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Gemini indicator */}
          {apiSettingsLink && (
            <Link href={apiSettingsLink} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              {isUsingGemini ? (
                <>
                  <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                    <Sparkles className="h-3 w-3" />
                    <span>Gemini</span>
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    <span>Using fallback responses</span>
                  </span>
                </>
              )}
            </Link>
          )}
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {activeSession && activeSession.messages.length > 0 ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              {activeSession.messages.map((message, index) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex animate-fade-in",
                    message.role === "user" ? "justify-end" : "justify-start",
                    index > 0 && "animate-slide-up stagger-item"
                  )}
                >
                  <div
                    className={cn(
                      "flex max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 shadow-sm transition-all",
                      message.role === "user"
                        ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
                        : "bg-muted dark:bg-secondary/80 border border-border dark:border-secondary"
                    )}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {message.role === "assistant" && (
                          <Avatar className="h-7 w-7 ring-2 ring-background">
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                              A
                            </div>
                          </Avatar>
                        )}
                        <p className={cn(
                          "text-xs font-medium",
                          message.role === "user" ? "text-primary-foreground/80" : "text-muted-foreground"
                        )}>
                          {message.role === "assistant" ? "Assistant" : "You"}
                        </p>
                        
                        {message.role === "user" && onSavePrompt && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 text-primary-foreground/60 hover:text-primary-foreground/90 rounded-full ml-auto transition-all"
                            onClick={() => onSavePrompt(message.content)}
                            title="Save prompt"
                          >
                            <BookmarkPlus className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="whitespace-pre-wrap break-words text-sm md:text-base leading-relaxed">
                        {message.content}
                      </div>
                      <p className={cn(
                        "text-xs text-right mt-1 opacity-70 transition-opacity group-hover:opacity-100",
                        message.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground/70"
                      )}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex max-w-[85%] md:max-w-[75%] items-center gap-3 rounded-2xl border bg-muted/30 dark:bg-secondary/40 px-5 py-4 shadow-sm">
                    <Avatar className="h-7 w-7 ring-2 ring-background">
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                        A
                      </div>
                    </Avatar>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="h-2 w-2 rounded-full bg-foreground/60 animate-bounce" style={{ animationDelay: "200ms" }}></div>
                      <div className="h-2 w-2 rounded-full bg-foreground/60 animate-bounce" style={{ animationDelay: "400ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
                
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center space-y-6 text-center max-w-xl mx-auto animate-fade-in">
              <div className="rounded-full bg-primary/10 p-5 shadow-inner dark:bg-primary/20">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold">Start a new conversation</h3>
                <p className="text-muted-foreground">
                  Ask a question or start a conversation with the AI assistant.
                </p>
              </div>
              {(recommendedPrompts.length > 0 || aiTools.length > 0) && (
                <div className="flex flex-wrap gap-3 justify-center mt-6 w-full">
                  {recommendedPrompts.slice(0, 2).map((prompt) => (
                    <Button
                      key={prompt.id}
                      variant="outline"
                      size="sm"
                      className="text-sm h-9 shadow-sm hover-lift transition-all duration-300"
                      onClick={() => onRecommendedPrompt?.(prompt.text)}
                    >
                      {prompt.icon}
                      <span className="ml-2 truncate max-w-[180px]">{prompt.text}</span>
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sm h-9 shadow-sm hover-lift bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/40 dark:to-blue-950/40 border-purple-200 dark:border-purple-900 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-950/60 dark:hover:to-blue-950/60 transition-all duration-300"
                    onClick={() => openFeatures('recommended')}
                  >
                    <Wand2 className="h-4 w-4 mr-2 text-purple-500" />
                    <span>More Prompts</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sm h-9 shadow-sm hover-lift bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-amber-950/40 dark:to-emerald-950/40 border-amber-200 dark:border-amber-900 hover:bg-gradient-to-r hover:from-amber-100 hover:to-emerald-100 dark:hover:from-amber-950/60 dark:hover:to-emerald-950/60 transition-all duration-300"
                    onClick={() => openFeatures('tools')}
                  >
                    <Grid3X3 className="h-4 w-4 mr-2 text-amber-500" />
                    <span>AI Tools</span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t bg-background/95 backdrop-blur-sm transition-all duration-300">
          {/* Feature chips (recommended prompts, saved prompts) */}
          {(recommendedPrompts.length > 0 || aiTools.length > 0 || savedPrompts.length > 0) && (
            <div className="p-2 px-4 border-b flex items-center overflow-x-auto scrollbar-hide">
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 flex items-center transition-colors"
                  onClick={() => openFeatures('recommended')}
                >
                  <Wand2 className="h-3.5 w-3.5 mr-1.5" />
                  <span>Prompts</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-700 dark:hover:text-amber-300 flex items-center transition-colors"
                  onClick={() => openFeatures('tools')}
                >
                  <Grid3X3 className="h-3.5 w-3.5 mr-1.5" />
                  <span>Tools</span>
                </Button>
                {savedPrompts.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 flex items-center transition-colors"
                    onClick={() => openFeatures('saved')}
                  >
                    <BookmarkPlus className="h-3.5 w-3.5 mr-1.5" />
                    <span>Saved ({savedPrompts.length})</span>
                  </Button>
                )}
              </div>
              <div className="ml-auto flex gap-2 overflow-x-auto scrollbar-hide">
                {recommendedPrompts.slice(0, 2).map((prompt) => (
                  <Button
                    key={prompt.id}
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 bg-muted/50 dark:bg-muted/30 truncate max-w-[230px] hover-lift transition-all duration-300"
                    onClick={() => onRecommendedPrompt?.(prompt.text)}
                  >
                    {prompt.icon && <span className="mr-1.5">{prompt.icon}</span>}
                    <span className="truncate">{prompt.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <div className="p-4 md:p-6">
            <div className="flex items-end gap-2 max-w-4xl mx-auto">
              <div className="relative flex-1 transition-all duration-300">
                <Textarea
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => onInputChange?.(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-32 resize-none rounded-xl border-input bg-background pr-14 text-sm md:text-base focus-visible:ring-offset-background shadow-sm transition-all duration-300"
                />
                <Button
                  size="icon"
                  className="absolute bottom-3 right-3 h-10 w-10 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                  disabled={!inputMessage?.trim() || isLoading}
                  onClick={handleSendMessage}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground text-center max-w-4xl mx-auto">
              The AI assistant will respond based on the context of your conversation.
            </p>
          </div>
        </div>
      </div>
      
      {/* AI Features Dialog */}
      <Dialog open={featuresOpen} onOpenChange={setFeaturesOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 gap-0 overflow-hidden rounded-xl backdrop-blur-md bg-background/95 shadow-lg border animate-scale-in transition-all duration-300">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl">AI Assistant Features</DialogTitle>
            <DialogDescription>
              Explore recommended prompts, AI tools and your saved prompts
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={featuresTab} onValueChange={setFeaturesTab} className="mt-2">
            <TabsList className="w-full px-3 bg-muted/50 dark:bg-secondary/50 border-y">
              <TabsTrigger value="recommended" className="flex-1 py-3 rounded-none data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">
                Recommended Prompts
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex-1 py-3 rounded-none data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">
                AI Tools
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex-1 py-3 rounded-none data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">
                Saved Prompts
              </TabsTrigger>
            </TabsList>
            
            {/* Recommended Prompts Tab */}
            <TabsContent value="recommended" className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recommendedPrompts.map((prompt, index) => (
                  <Button
                    key={prompt.id}
                    variant="outline"
                    className="justify-start h-auto py-3 px-4 text-left rounded-xl border border-border/80 shadow-sm hover:shadow hover:bg-muted/50 dark:hover:bg-secondary/70 hover-lift stagger-item transition-all duration-300"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => {
                      onRecommendedPrompt?.(prompt.text);
                      setFeaturesOpen(false);
                    }}
                  >
                    {prompt.icon && (
                      <span className="mr-3 p-2 rounded-full bg-primary/10 dark:bg-primary/20 text-primary">{prompt.icon}</span>
                    )}
                    <span className="truncate">{prompt.text}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>
            
            {/* AI Tools Tab */}
            <TabsContent value="tools" className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {aiTools.map((tool, index) => (
                  <div 
                    key={tool.id}
                    className={cn(
                      "relative rounded-xl border p-5 transition-all hover:shadow-md stagger-item",
                      tool.color ? tool.color : "bg-muted/50 dark:bg-secondary/50",
                      "hover-lift"
                    )}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start gap-4">
                      {tool.icon && (
                        <div className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm",
                          tool.color ? tool.color.replace("bg-", "border-").replace("/10", "/30") : "border-primary"
                        )}>
                          {tool.icon}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-lg mb-2">{tool.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={cn(
                            "text-sm transition-all duration-300",
                            tool.color ? tool.color.replace("bg-", "border-").replace("/10", "/30") : ""
                          )}
                          onClick={() => {
                            onAITool?.(tool.prompt);
                            setFeaturesOpen(false);
                          }}
                        >
                          Use Tool
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Saved Prompts Tab */}
            <TabsContent value="saved" className="max-h-[60vh] overflow-y-auto p-6">
              {savedPrompts.length > 0 ? (
                <div className="space-y-4">
                  {savedPrompts.map((prompt, index) => (
                    <div 
                      key={prompt.id} 
                      className="relative rounded-xl border p-4 hover:shadow-sm transition-all stagger-item hover-lift bg-muted/30 dark:bg-secondary/30"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <p className="text-sm mr-8 mb-4">{prompt.text}</p>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 transition-all duration-300"
                          onClick={() => {
                            onRecommendedPrompt?.(prompt.text);
                            setFeaturesOpen(false);
                          }}
                        >
                          <Send className="h-3.5 w-3.5 mr-1.5" />
                          <span className="text-xs">Use</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/80 hover:bg-destructive/10 transition-all duration-300"
                          onClick={() => onDeleteSavedPrompt?.(prompt.id)}
                        >
                          <Trash className="h-3.5 w-3.5 mr-1.5" />
                          <span className="text-xs">Delete</span>
                        </Button>
                      </div>
                      <span className="absolute top-4 right-4 text-xs text-muted-foreground">
                        {new Date(prompt.savedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <BookmarkPlus className="h-10 w-10 mx-auto mb-4 opacity-30" />
                  <p>No saved prompts yet.</p>
                  <p className="text-sm mt-2">Click the bookmark icon on any of your messages to save them for later use.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="p-6 pt-2 border-t bg-muted/30 dark:bg-secondary/30">
            <DialogClose asChild>
              <Button size="sm" variant="outline" className="w-full sm:w-auto">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 