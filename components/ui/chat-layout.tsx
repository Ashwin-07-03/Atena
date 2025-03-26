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
  Copy,
  FileDown,
  Circle
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
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

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
  /** Function to export chat as PDF */
  onExportPDF?: () => void;
}

// Updated hover effect for the sidebar with more responsive behavior
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
      }, 200); // Reduced delay for more responsive feeling
      setHoverTimerId(timer);
    }
  };
  
  const handleMouseLeave = () => {
    if (hoverTimerId) clearTimeout(hoverTimerId);
    if (isOpen && window.innerWidth > 1024) { // Only for desktop
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 400); // Reduced delay before closing
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
  onExportPDF,
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
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Added for client-side only rendering
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  // Updated PDF export function with improved error handling and client-side only execution
  const handleExportPDF = async () => {
    if (!isMounted) return;
    
    if (onExportPDF) {
      onExportPDF();
      return;
    }

    if (!chatContainerRef.current || !activeSession) return;
    
    try {
      // Create a clone of the chat container to avoid modifying the original
      const element = chatContainerRef.current.cloneNode(true) as HTMLElement;
      
      // Set background to white for better print quality
      element.style.backgroundColor = "white";
      element.style.color = "black";
      element.style.padding = "20px";
      
      // Make sure all SVG elements are properly set for export
      const svgElements = element.querySelectorAll('svg');
      svgElements.forEach(svg => {
        if (!svg.hasAttribute('xmlns')) {
          svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        }
      });
      
      // Convert node to PNG
      const dataUrl = await toPng(element, {
        backgroundColor: "white",
        quality: 0.95,
        skipAutoScale: true,
        pixelRatio: 2
      });
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [element.offsetWidth, element.offsetHeight]
      });
      
      // Add image to PDF (with slight margin)
      pdf.addImage(dataUrl, "PNG", 10, 10, element.offsetWidth - 20, element.offsetHeight - 20);
      
      // Download PDF with chat title as filename
      pdf.save(`${activeSession.title || 'Chat'}_summary.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  // Don't render anything on server or during hydration
  if (!isMounted) {
    return (
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-[#111111] text-gray-100 shadow-lg transition-all duration-300 ease-in-out">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-[#111111] text-gray-100 shadow-lg transition-all duration-300 ease-in-out">
      {/* Wider hover area for easier sidebar access */}
      <div 
        ref={hoverAreaRef}
        className="hidden lg:block w-4 h-full absolute left-0 z-20" 
        onMouseEnter={handleSidebarMouseEnter}
      />

      {/* Mobile sidebar toggle */}
      <button 
        className="absolute left-3 top-3 z-30 rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Chat sessions sidebar - improved sidebar */}
      <div 
        ref={sidebarRef}
        className={cn(
          "w-full max-w-xs flex-col border-r border-gray-800 bg-[#1a1a1a] transition-all duration-300 ease-in-out z-10",
          sidebarOpen ? "flex lg:w-64 translate-x-0" : "hidden lg:flex lg:w-0 lg:-translate-x-full"
        )}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      >
        {/* App branding */}
        <div className="flex h-14 items-center px-5 border-b border-gray-800">
          <h2 className="text-xl font-semibold tracking-tight text-gray-100">Atena</h2>
        </div>

        {/* Fixed new chat button */}
        <div className="flex flex-col p-3 border-b border-gray-800">
          <Button 
            variant="default" 
            className="flex w-full items-center justify-center gap-2 bg-[#3b5bdb] text-white hover:bg-[#364fc7] border-0 shadow-md h-10"
            onClick={onNewSession}
          >
            <MessageSquarePlus size={16} />
            <span className="text-sm font-medium">New Chat</span>
          </Button>
        </div>
        
        {/* Chat sections */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            <h3 className="px-3 py-2 text-xs font-medium text-gray-400">Conversations</h3>
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

        {/* Settings area */}
        <div className="mt-auto border-t border-gray-800 p-3">
          <Button variant="ghost" className="w-full justify-start gap-2 text-gray-300 hover:bg-gray-800 hover:text-gray-100">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Button>
        </div>
      </div>

      {/* Main chat area - expanded to take full screen */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Chat header - simplified for more screen space */}
        <div className="flex h-14 items-center justify-between border-b border-gray-800 px-4 lg:px-6 bg-[#111111] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium text-gray-100">
              {activeSession ? activeSession.title : "New Chat"}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Export PDF button */}
            {activeSession && activeSession.messages.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1.5 text-gray-300 hover:bg-gray-800 hover:text-gray-100"
                onClick={handleExportPDF}
              >
                <FileDown className="h-4 w-4" />
                <span className="text-xs">Export PDF</span>
              </Button>
            )}
            
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

        {/* Messages area - improved size and contrast */}
        <div className="flex-1 overflow-auto p-3 lg:p-5 bg-[#111111]">
          <div ref={chatContainerRef} className="space-y-6 max-w-4xl mx-auto">
            {activeSession && activeSession.messages.length > 0 ? (
              activeSession.messages.map((message, index) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex animate-fade-in",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div className="flex items-start gap-4 max-w-[90%] md:max-w-[85%]">
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white">
                          A
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-col">
                      <div className={cn(
                        "rounded-xl px-5 py-4 shadow-md",
                        message.role === "user" 
                          ? "bg-[#3b5bdb] text-white" 
                          : "bg-[#1d1d1d] text-gray-100 border border-gray-800"
                      )}>
                        <div className="whitespace-pre-wrap break-words text-base leading-relaxed">
                          {message.content}
                        </div>
                      </div>
                      
                      {/* Message reactions - DeepSeek style */}
                      {message.role === "assistant" && (
                        <div className="flex gap-2 mt-2 ml-1">
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
                        <div className="h-9 w-9 rounded-full bg-gray-700 flex items-center justify-center text-white">
                          U
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
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
            
            {/* Loading indicator - improved */}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      A
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#1d1d1d] border border-gray-800 rounded-xl px-5 py-4 shadow-md">
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
        </div>

        {/* Input area - completely redesigned for better UX */}
        <div className="border-t border-gray-800 bg-[#151515] p-4 lg:p-5">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="flex items-center p-3 rounded-xl bg-[#212121] border border-gray-700 shadow-lg transition-all focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/30">
                <Textarea
                  placeholder="Type your message here..."
                  value={inputMessage}
                  onChange={(e) => onInputChange?.(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[56px] max-h-[250px] resize-none bg-transparent border-0 text-base text-gray-100 focus-visible:ring-0 p-0 shadow-none flex-1 placeholder-gray-400"
                />
                
                <Button
                  size="default"
                  className="h-10 min-w-[80px] px-4 rounded-lg bg-[#3b5bdb] text-white hover:bg-[#364fc7] flex-shrink-0 shadow-md transition-colors"
                  disabled={!inputMessage?.trim() || isLoading}
                  onClick={handleSendMessage}
                >
                  {isLoading ? "Sending..." : "Send"}
                </Button>
              </div>
            </div>
            
            {/* Quick access chips */}
            {recommendedPrompts.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                <div className="text-xs text-gray-400 px-2 flex items-center">
                  Suggestions:
                </div>
                {recommendedPrompts.slice(0, 3).map((prompt) => (
                  <Button
                    key={prompt.id}
                    variant="outline"
                    size="sm"
                    className="text-sm h-8 bg-[#212121] hover:bg-gray-700 border-gray-700 text-gray-300 transition-colors"
                    onClick={() => onRecommendedPrompt?.(prompt.text)}
                  >
                    {prompt.icon && <span className="mr-1.5">{prompt.icon}</span>}
                    <span className="truncate max-w-[200px]">{prompt.text}</span>
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm h-8 bg-[#212121] hover:bg-gray-700 border-gray-700 text-gray-300 transition-colors"
                  onClick={() => openFeatures('tools')}
                >
                  <Wand2 className="h-3.5 w-3.5 mr-1.5" />
                  <span>More</span>
                </Button>
              </div>
            )}
            
            {/* Mode indicator */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <div className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-gray-800/80 text-gray-400">
                <span className="flex items-center gap-1">
                  {isUsingGemini ? (
                    <>
                      <Sparkles className="h-3 w-3 text-blue-400" />
                      <span className="text-blue-400">AI Assistant</span>
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
        <DialogContent className="sm:max-w-[700px] p-0 gap-0 overflow-hidden rounded-xl bg-[#1a1a1a] border border-gray-800 shadow-lg">
          <DialogHeader className="px-6 pt-6 pb-2 border-b border-gray-800">
            <DialogTitle className="text-xl text-gray-100">AI Assistant Features</DialogTitle>
            <DialogDescription className="text-gray-400">
              Explore recommended prompts and AI tools to enhance your experience
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={featuresTab} onValueChange={setFeaturesTab} className="mt-2">
            <TabsList className="w-full px-3 bg-gray-800/50 border-b border-gray-800">
              <TabsTrigger 
                value="recommended" 
                className="flex-1 py-3 rounded-none text-gray-300 data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-blue-400 data-[state=active]:shadow-sm transition-all"
              >
                Recommended Prompts
              </TabsTrigger>
              <TabsTrigger 
                value="tools" 
                className="flex-1 py-3 rounded-none text-gray-300 data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-blue-400 data-[state=active]:shadow-sm transition-all"
              >
                AI Tools
              </TabsTrigger>
              <TabsTrigger 
                value="saved" 
                className="flex-1 py-3 rounded-none text-gray-300 data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-blue-400 data-[state=active]:shadow-sm transition-all"
              >
                Saved Prompts
              </TabsTrigger>
            </TabsList>
            
            {/* Recommended Prompts Tab */}
            <TabsContent value="recommended" className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recommendedPrompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    className="flex items-center text-left py-3 px-4 rounded-lg border border-gray-700 bg-[#212121] hover:bg-gray-800 text-gray-200 transition-all"
                    onClick={() => {
                      onRecommendedPrompt?.(prompt.text);
                      setFeaturesOpen(false);
                    }}
                  >
                    {prompt.icon && (
                      <span className="mr-3 p-2 rounded-full bg-[#3b5bdb]/20 text-[#3b5bdb]">{prompt.icon}</span>
                    )}
                    <span className="truncate text-base">{prompt.text}</span>
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
                    className="relative rounded-lg border border-gray-700 bg-[#212121] p-5 transition-all hover:bg-gray-800"
                  >
                    <div className="flex items-start gap-4">
                      {tool.icon && (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1a1a1a] border border-gray-700 text-[#3b5bdb]">
                          {tool.icon}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-lg mb-2 text-gray-100">{tool.name}</h3>
                        <p className="text-sm text-gray-400 mb-4">{tool.description}</p>
                        <Button 
                          variant="outline" 
                          size="default"
                          className="bg-[#3b5bdb] text-white border-none hover:bg-[#364fc7]"
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
                      className="relative rounded-lg border border-gray-700 bg-[#212121] p-4 hover:bg-gray-800 transition-all shadow-sm"
                    >
                      <p className="text-base mr-8 mb-4 text-gray-200">{prompt.text}</p>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 px-4 bg-[#3b5bdb]/90 border-none text-white hover:bg-[#3b5bdb] shadow-sm"
                          onClick={() => {
                            onRecommendedPrompt?.(prompt.text);
                            setFeaturesOpen(false);
                          }}
                        >
                          <Send className="h-3.5 w-3.5 mr-1.5" />
                          <span>Use</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 px-4 bg-gray-700 border-gray-600 text-red-400 hover:bg-gray-600"
                          onClick={() => onDeleteSavedPrompt?.(prompt.id)}
                        >
                          <Trash className="h-3.5 w-3.5 mr-1.5" />
                          <span>Delete</span>
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
              <Button size="default" className="bg-[#3b5bdb] text-white border-none hover:bg-[#364fc7]">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 