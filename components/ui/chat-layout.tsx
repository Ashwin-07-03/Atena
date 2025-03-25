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
  Wand2
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
}: ChatLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(defaultSidebarOpen);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [featuresTab, setFeaturesTab] = useState<string>("recommended");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex h-[calc(100vh-10rem)] overflow-hidden rounded-lg border bg-background shadow">
      {/* Mobile sidebar toggle */}
      <button 
        className="absolute left-2 top-2 z-10 rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Chat sessions sidebar */}
      <div 
        className={cn(
          "w-full max-w-xs flex-col border-r bg-muted/30 transition-all duration-300 ease-in-out",
          sidebarOpen ? "flex" : "hidden lg:flex"
        )}
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
        <div className="flex h-14 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium">
              {activeSession ? activeSession.title : "New Chat"}
            </h2>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-auto p-4">
          {activeSession && activeSession.messages.length > 0 ? (
            <div className="space-y-6">
              {activeSession.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "flex max-w-[80%] rounded-lg px-4 py-3",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {message.role === "assistant" && (
                          <Avatar className="h-6 w-6">
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground">
                              A
                            </div>
                          </Avatar>
                        )}
                        <p className={cn(
                          "text-xs",
                          message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                        )}>
                          {message.role === "assistant" ? "Assistant" : "You"}
                        </p>
                        
                        {message.role === "user" && onSavePrompt && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 text-primary-foreground/50 hover:text-primary-foreground rounded-full ml-auto"
                            onClick={() => onSavePrompt(message.content)}
                            title="Save prompt"
                          >
                            <BookmarkPlus className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="whitespace-pre-wrap break-words">{message.content}</div>
                      <p className={cn(
                        "text-xs text-right mt-1",
                        message.role === "user" ? "text-primary-foreground/50" : "text-muted-foreground/60"
                      )}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex max-w-[80%] items-center gap-3 rounded-lg bg-muted px-4 py-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted-foreground/20 text-muted-foreground">
                      A
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="h-2 w-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: "200ms" }}></div>
                      <div className="h-2 w-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: "400ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
                
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Start a new conversation</h3>
                <p className="text-sm text-muted-foreground">
                  Ask a question or start a conversation with the AI assistant.
                </p>
              </div>
              {(recommendedPrompts.length > 0 || aiTools.length > 0) && (
                <div className="flex flex-wrap gap-2 justify-center mt-4 max-w-md">
                  {recommendedPrompts.slice(0, 2).map((prompt) => (
                    <Button
                      key={prompt.id}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => onRecommendedPrompt?.(prompt.text)}
                    >
                      {prompt.icon}
                      <span className="ml-1 truncate max-w-[160px]">{prompt.text}</span>
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100"
                    onClick={() => openFeatures('recommended')}
                  >
                    <Wand2 className="h-3 w-3 mr-1 text-purple-500" />
                    <span>More Prompts</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 bg-gradient-to-r from-amber-50 to-emerald-50 border-amber-200 hover:bg-gradient-to-r hover:from-amber-100 hover:to-emerald-100"
                    onClick={() => openFeatures('tools')}
                  >
                    <Grid3X3 className="h-3 w-3 mr-1 text-amber-500" />
                    <span>AI Tools</span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t">
          {/* Feature chips (recommended prompts, saved prompts) */}
          {(recommendedPrompts.length > 0 || aiTools.length > 0 || savedPrompts.length > 0) && (
            <div className="p-2 px-4 border-b flex items-center overflow-x-auto scrollbar-hide">
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-purple-600 hover:bg-purple-50 hover:text-purple-700 flex items-center"
                  onClick={() => openFeatures('recommended')}
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  <span>Prompts</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-amber-600 hover:bg-amber-50 hover:text-amber-700 flex items-center"
                  onClick={() => openFeatures('tools')}
                >
                  <Grid3X3 className="h-3 w-3 mr-1" />
                  <span>Tools</span>
                </Button>
                {savedPrompts.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700 flex items-center"
                    onClick={() => openFeatures('saved')}
                  >
                    <BookmarkPlus className="h-3 w-3 mr-1" />
                    <span>Saved ({savedPrompts.length})</span>
                  </Button>
                )}
              </div>
              <div className="ml-auto flex gap-1">
                {recommendedPrompts.slice(0, 2).map((prompt) => (
                  <Button
                    key={prompt.id}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 bg-muted/50 truncate max-w-[200px]"
                    onClick={() => onRecommendedPrompt?.(prompt.text)}
                  >
                    {prompt.icon && <span className="mr-1">{prompt.icon}</span>}
                    {prompt.text}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <div className="p-4">
            <div className="flex items-end gap-2">
              <div className="relative flex-1">
                <Textarea
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => onInputChange?.(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-24 resize-none rounded-lg border-input bg-background pr-12 text-sm focus-visible:ring-offset-background"
                />
                <Button
                  size="icon"
                  className="absolute bottom-3 right-3 h-8 w-8 rounded-full"
                  disabled={!inputMessage?.trim() || isLoading}
                  onClick={handleSendMessage}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              The AI assistant will respond based on the context of your conversation.
            </p>
          </div>
        </div>
      </div>
      
      {/* AI Features Dialog */}
      <Dialog open={featuresOpen} onOpenChange={setFeaturesOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>AI Assistant Features</DialogTitle>
            <DialogDescription>
              Explore recommended prompts, AI tools and your saved prompts
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={featuresTab} onValueChange={setFeaturesTab} className="mt-2">
            <TabsList className="w-full">
              <TabsTrigger value="recommended" className="flex-1">Recommended Prompts</TabsTrigger>
              <TabsTrigger value="tools" className="flex-1">AI Tools</TabsTrigger>
              <TabsTrigger value="saved" className="flex-1">Saved Prompts</TabsTrigger>
            </TabsList>
            
            {/* Recommended Prompts Tab */}
            <TabsContent value="recommended" className="max-h-[60vh] overflow-y-auto space-y-2 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {recommendedPrompts.map((prompt) => (
                  <Button
                    key={prompt.id}
                    variant="outline"
                    className="justify-start h-auto py-2 px-3"
                    onClick={() => {
                      onRecommendedPrompt?.(prompt.text);
                      setFeaturesOpen(false);
                    }}
                  >
                    {prompt.icon && <span className="mr-2">{prompt.icon}</span>}
                    <span className="truncate">{prompt.text}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>
            
            {/* AI Tools Tab */}
            <TabsContent value="tools" className="max-h-[60vh] overflow-y-auto space-y-4 mt-4">
              <div className="grid grid-cols-1 gap-3">
                {aiTools.map((tool) => (
                  <div 
                    key={tool.id}
                    className={cn(
                      "relative rounded-lg border p-4 transition-all hover:shadow",
                      tool.color ? tool.color : "bg-muted/30"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {tool.icon && (
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full bg-background",
                          tool.color ? tool.color.replace("bg-", "border-").replace("/10", "/30") : "border-primary"
                        )}>
                          {tool.icon}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{tool.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={cn(
                            "text-xs",
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
            <TabsContent value="saved" className="max-h-[60vh] overflow-y-auto mt-4">
              {savedPrompts.length > 0 ? (
                <div className="space-y-3">
                  {savedPrompts.map((prompt) => (
                    <div key={prompt.id} className="relative rounded-lg border p-3">
                      <p className="text-sm mr-8 mb-3">{prompt.text}</p>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          onClick={() => {
                            onRecommendedPrompt?.(prompt.text);
                            setFeaturesOpen(false);
                          }}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          <span className="text-xs">Use</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-destructive hover:text-destructive"
                          onClick={() => onDeleteSavedPrompt?.(prompt.id)}
                        >
                          <Trash className="h-3 w-3 mr-1" />
                          <span className="text-xs">Delete</span>
                        </Button>
                      </div>
                      <span className="absolute top-3 right-3 text-xs text-muted-foreground">
                        {new Date(prompt.savedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No saved prompts yet. Click the bookmark icon on any of your messages to save them for later use.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 