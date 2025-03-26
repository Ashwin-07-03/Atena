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
  Sun,
  Settings,
  ThumbsUp,
  ThumbsDown,
  Copy
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
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-gray-800 bg-[#1e1e1e] text-gray-100 shadow-lg transition-all duration-300 ease-in-out">
      {/* Sidebar hover area for desktop */}
      <div 
        ref={hoverAreaRef}
        className="hidden lg:block w-2 h-full absolute left-0 z-20" 
        onMouseEnter={handleSidebarMouseEnter}
      />

      {/* Mobile sidebar toggle */}
      <button 
        className="absolute left-2 top-2 z-30 rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Chat sessions sidebar - DeepSeek style */}
      <div 
        ref={sidebarRef}
        className={cn(
          "w-full max-w-xs flex-col border-r border-gray-800 bg-[#1e1e1e] transition-all duration-500 ease-in-out z-10",
          sidebarOpen ? "flex lg:w-72 translate-x-0" : "hidden lg:flex lg:w-0 lg:-translate-x-full"
        )}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      >
        {/* App branding */}
        <div className="flex h-16 items-center px-5 border-b border-gray-800">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100">deepseek</h2>
        </div>

        {/* New chat button */}
        <div className="flex flex-col space-y-2 p-4">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 mb-2 bg-[#3b5bdb] text-white border-none hover:bg-[#364fc7]"
            onClick={onNewSession}
          >
            <MessageSquarePlus size={16} />
            <span>New chat</span>
          </Button>
        </div>
        
        {/* Chat sections by time periods */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            <h3 className="px-3 py-2 text-xs font-medium text-gray-400">Today</h3>
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
                          className="h-8 text-sm bg-gray-800 border-gray-700 text-gray-100"
                        />
                      </div>
                    ) : (
                      <button
                        className={cn(
                          "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors",
                          activeSession?.id === session.id ? "bg-gray-800 text-gray-100" : "text-gray-300 hover:bg-gray-800/60"
                        )}
                        onClick={() => onSelectSession?.(session.id)}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <MessageSquare size={16} className="text-gray-400" />
                          <span className="truncate">{session.title}</span>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-gray-300 hover:bg-gray-700">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-800 text-gray-100 border-gray-700">
                            <DropdownMenuItem onClick={() => startEditingSession(session.id, session.title)} className="hover:bg-gray-700">
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Rename</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-400 hover:bg-gray-700 focus:text-red-400"
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
                <div className="px-2 py-4 text-center text-sm text-gray-400">
                  {searchQuery ? "No chats found" : "No chat history"}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* App functions/profile area */}
        <div className="mt-auto border-t border-gray-800 p-4">
          <Button variant="ghost" className="w-full justify-start gap-2 text-gray-300 hover:bg-gray-800 hover:text-gray-100">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Button>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Chat header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-800 px-6 bg-[#1e1e1e] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium text-gray-100">
              {activeSession ? activeSession.title : "New Chat"}
            </h2>
          </div>
          
          <div className="flex gap-2">
            {/* Theme toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full text-gray-400 hover:bg-gray-800 hover:text-gray-200" 
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            
            {/* API indicator */}
            {apiSettingsLink && (
              <Link href={apiSettingsLink} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200">
                {isUsingGemini ? (
                  <span className="flex items-center gap-1 text-blue-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Gemini</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    <span>Using fallback</span>
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {activeSession && activeSession.messages.length > 0 ? (
            <div className="space-y-8 max-w-3xl mx-auto">
              {activeSession.messages.map((message, index) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex animate-fade-in",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div className="flex items-start gap-4 max-w-[85%]">
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                          A
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-col">
                      <div className={cn(
                        "rounded-lg px-4 py-3",
                        message.role === "user" 
                          ? "bg-[#3b5bdb] text-white" 
                          : "bg-gray-800 text-gray-100"
                      )}>
                        <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                          {message.content}
                        </div>
                      </div>
                      
                      {/* Message reactions - DeepSeek style */}
                      {message.role === "assistant" && (
                        <div className="flex gap-2 mt-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0 rounded-full bg-gray-800/50 hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                          >
                            <ThumbsUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0 rounded-full bg-gray-800/50 hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                          >
                            <ThumbsDown className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0 rounded-full bg-gray-800/50 hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {message.role === "user" && (
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
                          U
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        A
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-3">
                      <div className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "200ms" }}></div>
                      <div className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "400ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
                
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center space-y-6 text-center max-w-xl mx-auto">
              <div className="rounded-full bg-[#3b5bdb]/20 p-5">
                <MessageSquare className="h-8 w-8 text-[#3b5bdb]" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-gray-100">How can I assist you today?</h3>
                <p className="text-gray-400">
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
                      className="text-sm h-9 bg-gray-800/60 border-gray-700 text-gray-200 hover:bg-gray-700 hover:text-white transition-all"
                      onClick={() => onRecommendedPrompt?.(prompt.text)}
                    >
                      {prompt.icon}
                      <span className="ml-2 truncate max-w-[180px]">{prompt.text}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-gray-800 bg-[#1e1e1e]">
          <div className="p-4 md:p-6">
            <div className="flex items-end gap-2 max-w-3xl mx-auto">
              <div className="relative flex-1">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800 border border-gray-700">
                  <Textarea
                    placeholder="Message DeepSeek..."
                    value={inputMessage}
                    onChange={(e) => onInputChange?.(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="min-h-[44px] max-h-[200px] resize-none bg-transparent border-0 text-sm text-gray-100 focus-visible:ring-0 p-0 shadow-none"
                  />
                  
                  <Button
                    size="icon"
                    className="h-8 w-8 rounded-full bg-[#3b5bdb] text-white hover:bg-[#364fc7] flex-shrink-0"
                    disabled={!inputMessage?.trim() || isLoading}
                    onClick={handleSendMessage}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Quick access chips */}
            {recommendedPrompts.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mt-4 max-w-3xl mx-auto">
                <div className="text-xs text-gray-400 px-2 flex items-center">
                  Suggestions:
                </div>
                {recommendedPrompts.slice(0, 3).map((prompt) => (
                  <Button
                    key={prompt.id}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 bg-gray-800/60 hover:bg-gray-700 border-gray-700 text-gray-300"
                    onClick={() => onRecommendedPrompt?.(prompt.text)}
                  >
                    {prompt.icon && <span className="mr-1.5">{prompt.icon}</span>}
                    <span className="truncate max-w-[150px]">{prompt.text}</span>
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 bg-gray-800/60 hover:bg-gray-700 border-gray-700 text-gray-300"
                  onClick={() => openFeatures('tools')}
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  <span>More</span>
                </Button>
              </div>
            )}
            
            {/* DeepThink indicator - similar to Gemini indicator */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <div className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md bg-gray-800/80 text-gray-400">
                <span className="flex items-center gap-1">
                  {isUsingGemini ? (
                    <>
                      <Sparkles className="h-3 w-3 text-blue-400" />
                      <span className="text-blue-400">DeepThink (R1)</span>
                    </>
                  ) : (
                    <>
                      <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                      <span>Fallback Mode</span>
                    </>
                  )}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                AI-generated, for reference only
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Features Dialog */}
      <Dialog open={featuresOpen} onOpenChange={setFeaturesOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 gap-0 overflow-hidden rounded-xl bg-[#1e1e1e] border border-gray-800 shadow-lg">
          <DialogHeader className="px-6 pt-6 pb-2 border-b border-gray-800">
            <DialogTitle className="text-xl text-gray-100">DeepSeek Features</DialogTitle>
            <DialogDescription className="text-gray-400">
              Explore recommended prompts and AI tools to enhance your experience
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={featuresTab} onValueChange={setFeaturesTab} className="mt-2">
            <TabsList className="w-full px-3 bg-gray-800/50 border-b border-gray-800">
              <TabsTrigger 
                value="recommended" 
                className="flex-1 py-3 rounded-none text-gray-300 data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-gray-100 data-[state=active]:shadow-sm transition-all"
              >
                Recommended Prompts
              </TabsTrigger>
              <TabsTrigger 
                value="tools" 
                className="flex-1 py-3 rounded-none text-gray-300 data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-gray-100 data-[state=active]:shadow-sm transition-all"
              >
                AI Tools
              </TabsTrigger>
              <TabsTrigger 
                value="saved" 
                className="flex-1 py-3 rounded-none text-gray-300 data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-gray-100 data-[state=active]:shadow-sm transition-all"
              >
                Saved Prompts
              </TabsTrigger>
            </TabsList>
            
            {/* Recommended Prompts Tab */}
            <TabsContent value="recommended" className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recommendedPrompts.map((prompt, index) => (
                  <button
                    key={prompt.id}
                    className="flex items-center text-left py-3 px-4 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-800 text-gray-200 transition-all"
                    onClick={() => {
                      onRecommendedPrompt?.(prompt.text);
                      setFeaturesOpen(false);
                    }}
                  >
                    {prompt.icon && (
                      <span className="mr-3 p-2 rounded-full bg-[#3b5bdb]/20 text-[#3b5bdb]">{prompt.icon}</span>
                    )}
                    <span className="truncate">{prompt.text}</span>
                  </button>
                ))}
              </div>
            </TabsContent>
            
            {/* AI Tools Tab */}
            <TabsContent value="tools" className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {aiTools.map((tool) => (
                  <div 
                    key={tool.id}
                    className="relative rounded-lg border border-gray-700 bg-gray-800/50 p-5 transition-all hover:bg-gray-800"
                  >
                    <div className="flex items-start gap-4">
                      {tool.icon && (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1e1e1e] border border-gray-700 text-[#3b5bdb]">
                          {tool.icon}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-lg mb-2 text-gray-100">{tool.name}</h3>
                        <p className="text-sm text-gray-400 mb-4">{tool.description}</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-sm bg-[#3b5bdb] text-white border-none hover:bg-[#364fc7]"
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
                  {savedPrompts.map((prompt) => (
                    <div 
                      key={prompt.id} 
                      className="relative rounded-lg border border-gray-700 bg-gray-800/50 p-4 hover:bg-gray-800 transition-all"
                    >
                      <p className="text-sm mr-8 mb-4 text-gray-200">{prompt.text}</p>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
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
                          className="h-8 px-3 bg-gray-700 border-gray-600 text-red-400 hover:bg-gray-600"
                          onClick={() => onDeleteSavedPrompt?.(prompt.id)}
                        >
                          <Trash className="h-3.5 w-3.5 mr-1.5" />
                          <span className="text-xs">Delete</span>
                        </Button>
                      </div>
                      <span className="absolute top-4 right-4 text-xs text-gray-400">
                        {new Date(prompt.savedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <BookmarkPlus className="h-10 w-10 mx-auto mb-4 opacity-30" />
                  <p>No saved prompts yet.</p>
                  <p className="text-sm mt-2">Saved prompts will appear here for quick access.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="p-6 pt-4 border-t border-gray-800 bg-gray-800/30">
            <DialogClose asChild>
              <Button size="sm" variant="outline" className="w-full sm:w-auto bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 