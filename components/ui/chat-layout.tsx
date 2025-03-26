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
  Circle,
  CheckCircle,
  Filter
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
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/ui/logo";

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
  /** Function to set input message */
  setInputMessage?: (message: string) => void;
  /** Function called when a recommended prompt is selected */
  onRecommendedPrompt?: (prompt: string) => void;
  /** Function called when a recommended prompt is selected (alternate name) */
  onUsePrompt?: (prompt: string) => void;
  /** Function called when an AI tool is selected */
  onAITool?: (prompt: string) => void;
  /** Function called when an AI tool is selected (alternate name) */
  onUseTool?: (prompt: string) => void;
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
  /** Custom header action element */
  headerAction?: React.ReactNode;
  /** Model status indicator element */
  modelStatus?: React.ReactNode;
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
  setInputMessage,
  onRecommendedPrompt,
  onUsePrompt,
  onAITool,
  onUseTool,
  onSavePrompt,
  onDeleteSavedPrompt,
  isUsingGemini = false,
  apiSettingsLink,
  onExportPDF,
  headerAction,
  modelStatus,
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
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportableSessions, setExportableSessions] = useState<{[key: string]: boolean}>({});
  const [exportFormat, setExportFormat] = useState<'pdf' | 'text'>('pdf');
  const [exportLoading, setExportLoading] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Prepare exportable sessions when dialog opens
  useEffect(() => {
    if (exportDialogOpen && sessions.length > 0) {
      const sessionsMap = sessions.reduce((acc, session) => {
        // Only include active session by default
        acc[session.id] = session.id === activeSession?.id;
        return acc;
      }, {} as {[key: string]: boolean});
      
      setExportableSessions(sessionsMap);
    }
  }, [exportDialogOpen, sessions, activeSession]);

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

  // Handler for recommended prompts that supports both naming conventions
  const handleRecommendedPrompt = (prompt: string) => {
    if (onUsePrompt) {
      onUsePrompt(prompt);
    } else if (onRecommendedPrompt) {
      onRecommendedPrompt(prompt);
    }
  };
  
  // Handler for AI tools that supports both naming conventions
  const handleAITool = (tool: string) => {
    if (onUseTool) {
      onUseTool(tool);
    } else if (onAITool) {
      onAITool(tool);
    }
  };
  
  // Handler for input changes that supports both setInputMessage and onInputChange
  const handleInputChange = (value: string) => {
    if (setInputMessage) {
      setInputMessage(value);
    } else if (onInputChange) {
      onInputChange(value);
    }
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

  // Enhanced PDF export function with improved formatting and multi-session support
  const handleExportPDF = async () => {
    if (!isMounted) return;
    
    if (onExportPDF) {
      onExportPDF();
      return;
    }

    // Open export dialog
    setExportDialogOpen(true);
  };
  
  // Actual export function
  const executeExport = async () => {
    setExportLoading(true);
    
    try {
      const selectedSessionIds = Object.entries(exportableSessions)
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);
      
      if (selectedSessionIds.length === 0) {
        alert("Please select at least one chat to export");
        setExportLoading(false);
        return;
      }
      
      const selectedSessions = sessions.filter(session => 
        selectedSessionIds.includes(session.id)
      );
      
      if (exportFormat === 'pdf') {
        // Create PDF
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: "a4",
        });
        
        let yOffset = 40;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 40;
        const contentWidth = pageWidth - (margin * 2);
        
        // PDF styles
        const headerFontSize = 18;
        const subheaderFontSize = 14;
        const normalFontSize = 12;
        const smallFontSize = 10;
        const lineHeight = 5;
        
        // Add title
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(22);
        pdf.text("Atena Chat Export", pageWidth / 2, yOffset, { align: "center" });
        yOffset += 30;
        
        // Add date
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(smallFontSize);
        pdf.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, yOffset, { align: "center" });
        yOffset += 30;
        
        // Process each selected session
        for (let sessionIndex = 0; sessionIndex < selectedSessions.length; sessionIndex++) {
          const session = selectedSessions[sessionIndex];
          
          // Check if we need a new page
          if (sessionIndex > 0) {
            pdf.addPage();
            yOffset = 40;
          }
          
          // Add session title
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(headerFontSize);
          pdf.text(session.title, margin, yOffset);
          yOffset += headerFontSize + lineHeight;
          
          // Add creation date
          pdf.setFont("helvetica", "italic");
          pdf.setFontSize(smallFontSize);
          pdf.text(`Created: ${new Date(session.createdAt).toLocaleString()}`, margin, yOffset);
          yOffset += smallFontSize + 20;
          
          // Process each message
          for (const message of session.messages) {
            const isUser = message.role === "user";
            
            // Add role indicator
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(subheaderFontSize);
            pdf.text(isUser ? "You:" : "AI Assistant:", margin, yOffset);
            yOffset += subheaderFontSize + lineHeight;
            
            // Add message content with word wrapping
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(normalFontSize);
            
            const textLines = pdf.splitTextToSize(message.content, contentWidth);
            
            // Check if we need to add a new page
            if (yOffset + (textLines.length * (normalFontSize + lineHeight)) > pageHeight - margin) {
              pdf.addPage();
              yOffset = 40;
            }
            
            // Add text lines
            for (const line of textLines) {
              pdf.text(line, margin, yOffset);
              yOffset += normalFontSize + lineHeight;
              
              // Check if we need a new page
              if (yOffset > pageHeight - margin) {
                pdf.addPage();
                yOffset = 40;
              }
            }
            
            // Add spacer between messages
            yOffset += 20;
            
            // Check if we need a new page
            if (yOffset > pageHeight - 100) {
              pdf.addPage();
              yOffset = 40;
            }
          }
        }
        
        // Save the PDF with custom filename
        const filename = selectedSessions.length === 1 
          ? `${selectedSessions[0].title}_chat.pdf` 
          : `Atena_Chats_${new Date().toISOString().split('T')[0]}.pdf`;
        
        pdf.save(filename);
      } else {
        // Plain text export
        let textContent = "ATENA CHAT EXPORT\n";
        textContent += `Generated on ${new Date().toLocaleString()}\n\n`;
        
        selectedSessions.forEach(session => {
          textContent += `CHAT: ${session.title}\n`;
          textContent += `Created: ${new Date(session.createdAt).toLocaleString()}\n\n`;
          
          session.messages.forEach(message => {
            textContent += `${message.role === "user" ? "You" : "AI Assistant"}: ${message.content}\n\n`;
          });
          
          textContent += "\n---\n\n";
        });
        
        // Create and download text file
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        const filename = selectedSessions.length === 1 
          ? `${selectedSessions[0].title}_chat.txt` 
          : `Atena_Chats_${new Date().toISOString().split('T')[0]}.txt`;
        
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      setExportDialogOpen(false);
    } catch (error) {
      console.error("Error exporting:", error);
      alert("An error occurred while exporting your chats. Please try again.");
    } finally {
      setExportLoading(false);
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
          "w-full max-w-[280px] flex-col border-r border-gray-800 bg-[#1a1a1a] transition-all duration-300 ease-in-out z-10",
          sidebarOpen ? "flex lg:w-72 translate-x-0" : "hidden lg:flex lg:w-0 lg:-translate-x-full"
        )}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      >
        {/* App branding */}
        <div className="flex h-16 items-center px-5 border-b border-gray-800 bg-[#151515]">
          <Logo size="md" textClassName="text-gray-100" />
        </div>

        {/* Simplified new chat button */}
        <div className="p-4">
          <Button 
            variant="default" 
            className="w-full bg-[#3b5bdb] hover:bg-[#364fc7] text-white flex items-center justify-center gap-2 h-10 px-4"
            onClick={onNewSession}
          >
            <MessageSquarePlus size={16} />
            <span>New Chat</span>
          </Button>
        </div>
        
        {/* Search box */}
        <div className="px-4 pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border-gray-700 pl-10 py-5 h-10 text-gray-100 rounded-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        {/* Chat sections */}
        <ScrollArea className="flex-1 px-2">
          <div className="pt-2 pb-4">
            <div className="px-4 pb-2 pt-3 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Conversations</h3>
              <span className="text-xs text-gray-500">{filteredSessions.length}</span>
            </div>
            <div className="space-y-1.5 px-2">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session) => (
                  <div key={session.id} className="relative">
                    {editingSession === session.id ? (
                      <div className="flex items-center p-2 gap-1 bg-gray-800/60 rounded-lg">
                        <Input 
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveSessionTitle();
                            if (e.key === "Escape") setEditingSession(null);
                          }}
                          onBlur={saveSessionTitle}
                          autoFocus
                          className="h-9 text-sm bg-gray-800 border-gray-700 text-gray-100"
                        />
                      </div>
                    ) : (
                      <button
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                          activeSession?.id === session.id 
                            ? "bg-gradient-to-r from-blue-900/50 to-blue-800/30 text-gray-100 border border-blue-800/50" 
                            : "text-gray-300 hover:bg-gray-800/60"
                        )}
                        onClick={() => onSelectSession?.(session.id)}
                      >
                        <div className="flex items-center gap-3 max-w-[82%]">
                          <div className="flex-shrink-0 rounded-full bg-gray-700 h-8 w-8 flex items-center justify-center">
                            <MessageSquare size={15} className="text-gray-300" />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="truncate font-medium">{session.title}</span>
                            <span className="text-xs text-gray-500 truncate">
                              {session.messages.length} messages • {new Date(session.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-full">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-800 text-gray-100 border-gray-700">
                            <DropdownMenuItem onClick={() => startEditingSession(session.id, session.title)} className="hover:bg-gray-700">
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Rename</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="hover:bg-gray-700"
                              onClick={() => {
                                // Set up export dialog with just this session
                                const singleSessionExport = { [session.id]: true };
                                setExportableSessions(singleSessionExport);
                                setExportDialogOpen(true);
                              }}
                            >
                              <FileDown className="mr-2 h-4 w-4" />
                              <span>Export</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
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
                <div className="px-2 py-8 text-center">
                  <div className="mb-3 flex justify-center">
                    <div className="rounded-full bg-gray-800 p-3">
                      <MessageSquare size={20} className="text-gray-400" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    {searchQuery ? "No chats found" : "No chat history"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {searchQuery ? "Try a different search" : "Start a new conversation"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Settings area */}
        <div className="mt-auto border-t border-gray-800 p-4 bg-[#151515]">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-gray-300 hover:bg-gray-800 hover:text-gray-100 py-5 rounded-lg"
          >
            <Settings className="h-4 w-4" />
            <span className="font-medium">Settings</span>
          </Button>
        </div>
      </div>

      {/* Main chat area - expanded to take full screen */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Chat header - simplified for more screen space */}
        <div className="flex h-14 items-center justify-between border-b border-gray-800 px-4 lg:px-6 bg-[#111111] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium text-gray-100 truncate max-w-[200px] sm:max-w-xs">
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
            
            {/* Custom header action */}
            {headerAction}
            
            {/* API indicator or custom model status */}
            {modelStatus ? (
              modelStatus
            ) : apiSettingsLink ? (
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
            ) : null}
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
                        <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white overflow-hidden">
                          <Logo showText={false} size="sm" />
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
                  <Logo size="lg" textClassName="text-[#3b5bdb]" />
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
                        onClick={() => handleRecommendedPrompt(prompt.text)}
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
                  onChange={(e) => handleInputChange(e.target.value)}
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
                    onClick={() => handleRecommendedPrompt(prompt.text)}
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
      
      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-[550px] p-0 gap-0 overflow-hidden rounded-xl bg-[#1a1a1a] border border-gray-800 shadow-lg">
          <DialogHeader className="px-6 pt-6 pb-2 border-b border-gray-800">
            <DialogTitle className="text-xl text-gray-100">Export Chats</DialogTitle>
            <DialogDescription className="text-gray-400">
              Select the chats you want to export and choose your preferred format.
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-200">Select Chats</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-gray-300"
                onClick={() => {
                  // Toggle all sessions
                  const allSelected = Object.values(exportableSessions).every(Boolean);
                  const updatedSessions = Object.keys(exportableSessions).reduce((acc, key) => {
                    acc[key] = !allSelected;
                    return acc;
                  }, {} as {[key: string]: boolean});
                  
                  setExportableSessions(updatedSessions);
                }}
              >
                {Object.values(exportableSessions).every(Boolean) ? "Deselect All" : "Select All"}
              </Button>
            </div>
            
            <div className="space-y-3">
              {sessions.map(session => (
                <div key={session.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/40 hover:bg-gray-800/80 transition-colors">
                  <Checkbox
                    id={`export-${session.id}`}
                    checked={exportableSessions[session.id] || false}
                    onCheckedChange={(checked) => {
                      setExportableSessions({
                        ...exportableSessions,
                        [session.id]: !!checked
                      });
                    }}
                    className="border-gray-500 data-[state=checked]:bg-blue-600"
                  />
                  <label
                    htmlFor={`export-${session.id}`}
                    className="flex-1 text-sm font-medium text-gray-200 cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="truncate">{session.title}</span>
                      <span className="text-xs text-gray-400">
                        {session.messages.length} messages • {new Date(session.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-200 mb-3">Export Format</h3>
              <div className="flex gap-4">
                <div
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-lg border border-gray-700 cursor-pointer transition-all",
                    exportFormat === 'pdf' ? "bg-blue-600/20 border-blue-500" : "bg-gray-800/40 hover:bg-gray-800/80"
                  )}
                  onClick={() => setExportFormat('pdf')}
                >
                  <FileDown className="h-6 w-6 mb-2 text-gray-200" />
                  <span className="text-sm font-medium text-gray-200">PDF Document</span>
                  <span className="text-xs text-gray-400 mt-1">Formatted layout</span>
                </div>
                
                <div
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-lg border border-gray-700 cursor-pointer transition-all",
                    exportFormat === 'text' ? "bg-blue-600/20 border-blue-500" : "bg-gray-800/40 hover:bg-gray-800/80"
                  )}
                  onClick={() => setExportFormat('text')}
                >
                  <FileDown className="h-6 w-6 mb-2 text-gray-200" />
                  <span className="text-sm font-medium text-gray-200">Text File</span>
                  <span className="text-xs text-gray-400 mt-1">Plain text format</span>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="p-6 pt-4 border-t border-gray-800 bg-gray-800/30">
            <Button variant="outline" onClick={() => setExportDialogOpen(false)} className="border-gray-700 text-gray-200 hover:bg-gray-700 hover:text-white">
              Cancel
            </Button>
            <Button 
              onClick={executeExport} 
              disabled={exportLoading || Object.values(exportableSessions).every(v => !v)}
              className="bg-[#3b5bdb] text-white border-none hover:bg-[#364fc7]"
            >
              {exportLoading ? "Exporting..." : "Export"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
                      handleRecommendedPrompt(prompt.text);
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
                            handleAITool(tool.prompt);
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
                            handleRecommendedPrompt(prompt.text);
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