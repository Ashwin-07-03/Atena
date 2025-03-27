"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, MoreHorizontal, X, Filter, Users, UserPlus, MessageSquare, Pin, ChevronRight, Clock, Bell, BellOff, MoreVertical, UserCircle, UserPlus2, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Logo } from "@/components/ui/logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Conversation, 
  User, 
  createDirectConversation, 
  getConversationById as getGroupConversation,
  getCurrentUser,
  getConversations 
} from '@/lib/services/collaboration-service';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  onCreateConversation: (participantIds: string[], title?: string) => void;
  availableUsers: Array<{
    id: string;
    name: string;
    avatar?: string;
    isOnline?: boolean;
  }>;
  currentUserId: string;
}

export function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onCreateConversation,
  availableUsers,
  currentUserId,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupTitle, setGroupTitle] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "direct" | "group">("all");
  const [newGroupName, setNewGroupName] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load conversations
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    
    // Mock implementation of getAllUsers
    const getAllUsers = (): User[] => {
      // This function should normally come from the collaboration service
      // For now, we're creating a minimal implementation
      return [
        {
          id: 'user-2',
          name: 'Emma S',
          email: 'emma@example.com',
          avatar: '/avatars/emma.jpg',
          status: 'online',
          isOnline: true
        },
        {
          id: 'user-3',
          name: 'Liam K',
          email: 'liam@example.com',
          avatar: '/avatars/liam.jpg',
          status: 'busy',
          isOnline: false
        },
        {
          id: 'user-4',
          name: 'Sophia T',
          email: 'sophia@example.com',
          avatar: '/avatars/sophia.jpg',
          status: 'offline',
          isOnline: true
        },
        {
          id: 'user-5',
          name: 'Noah P',
          email: 'noah@example.com',
          avatar: '/avatars/noah.jpg',
          status: 'away',
          isOnline: true
        }
      ];
    };
    
    const allUsers = getAllUsers();
    setSelectedUsers(allUsers.filter((u: User) => u.id !== user.id).map((u: User) => u.id));
  }, []);

  // Filter conversations based on search query and selected filter
  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = conversation.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      conversation.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    switch (filter) {
      case "unread":
        return conversation.unreadCount > 0;
      case "direct":
        return conversation.type === "direct";
      case "group":
        return conversation.type === "group";
      default:
        return true;
    }
  });

  // Sort conversations: pinned first, then by last message timestamp
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.messages[b.messages.length - 1].timestamp).getTime() - new Date(a.messages[a.messages.length - 1].timestamp).getTime();
  });

  const handleCreateConversation = () => {
    if (selectedUsers.length === 0) return;
    
    if (selectedUsers.length === 1) {
      // Create direct conversation
      const conversation = createDirectConversation(selectedUsers[0]);
      onSelectConversation(conversation.id);
    } else {
      // Create group conversation
      if (!newGroupName.trim()) return;
      
      // Mock implementation of createGroupConversation
      const createGroupConversation = (name: string, participantIds: string[]): Conversation => {
        // This function should normally come from the collaboration service
        const groupId = `group-${Date.now()}`;
        const participants = participantIds.map(id => {
          const user = availableUsers.find(u => u.id === id);
          if (!user) throw new Error(`User with ID ${id} not found`);
          
          return {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            email: `${user.id}@example.com`, // Mock email
            status: (user.isOnline ? 'online' : 'offline') as 'online' | 'offline' | 'busy' | 'away',
            isOnline: user.isOnline,
            lastSeen: new Date()
          } as User;
        });
        
        // Include current user in the participants
        if (currentUser && !participantIds.includes(currentUser.id)) {
          participants.push(currentUser);
        }
        
        const conversation: Conversation = {
          id: `conv-${Date.now()}`,
          type: 'group',
          title: name,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: currentUser?.id || 'user-1',
          participants,
          messages: [],
          unreadCount: 0,
          groupId
        };
        
        return conversation;
      };
      
      const conversation = createGroupConversation(newGroupName, selectedUsers);
      onSelectConversation(conversation.id);
    }
    
    setSelectedUsers([]);
    setGroupTitle("");
    setCreateDialogOpen(false);
    setNewGroupName("");
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Format timestamp for the last message
  const formatLastMessageTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    
    // If message is from today, show only time
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If message is from this week, show day name
    const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show date
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Get other user from direct conversation
  const getOtherParticipant = (conversation: Conversation) => {
    if (conversation.type === "direct") {
      return conversation.participants.find(p => p.id !== currentUserId);
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-background">
      {/* Header with search and new conversation button */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-lg font-semibold flex-1">Conversations</h2>
          <Button 
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setCreateDialogOpen(true)}
          >
            <UserPlus className="h-4 w-4" />
            <span className="sr-only">New conversation</span>
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Filter buttons */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs"
            onClick={() => setFilter("unread")}
          >
            Unread
          </Button>
          <Button
            variant={filter === "direct" ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs"
            onClick={() => setFilter("direct")}
          >
            Direct
          </Button>
          <Button
            variant={filter === "group" ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs"
            onClick={() => setFilter("group")}
          >
            Groups
          </Button>
        </div>
      </div>
      
      {/* Conversation list */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {sortedConversations.length > 0 ? (
            sortedConversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              const conversationTitle = conversation.type === "direct"
                ? otherParticipant?.name
                : conversation.title || `Group (${conversation.participants.length})`;
              
              const lastMessageSender = conversation.messages[conversation.messages.length - 1].senderId === currentUserId
                ? "You"
                : conversation.participants.find(p => p.id === conversation.messages[conversation.messages.length - 1].senderId)?.name || "Unknown";
              
              return (
                <button
                  key={conversation.id}
                  className={`flex items-start w-full p-3 rounded-lg text-left mb-1 hover:bg-accent/50 transition-colors ${
                    activeConversationId === conversation.id ? "bg-accent" : ""
                  }`}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="relative mr-3">
                    {conversation.type === "direct" ? (
                      <Avatar className="h-10 w-10">
                        {otherParticipant?.avatar ? (
                          <img src={otherParticipant.avatar} alt={otherParticipant.name} />
                        ) : (
                          <div className="bg-primary/10 text-primary flex items-center justify-center w-full h-full text-sm font-medium">
                            {otherParticipant?.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </Avatar>
                    ) : (
                      <Avatar className="h-10 w-10">
                        <div className="bg-primary/20 text-primary flex items-center justify-center w-full h-full text-sm font-medium">
                          <Logo showText={false} size="sm" />
                        </div>
                      </Avatar>
                    )}
                    {conversation.type === "direct" && otherParticipant?.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background"></span>
                    )}
                    {conversation.pinned && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[8px] flex items-center justify-center text-primary-foreground">
                        📌
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium truncate">{conversationTitle}</span>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {formatLastMessageTime(conversation.messages[conversation.messages.length - 1].timestamp)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                        <span className="font-medium">{lastMessageSender}:</span> {conversation.messages[conversation.messages.length - 1].content}
                      </p>
                      
                      {conversation.unreadCount > 0 && (
                        <Badge variant="default" className="ml-2 shrink-0">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-3 bg-primary/10 p-3 rounded-full">
                <MessageIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">No conversations found</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {searchQuery
                  ? "Try a different search term"
                  : "Start a new conversation to collaborate"}
              </p>
              <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                New Conversation
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Create new conversation dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Conversation</DialogTitle>
            <DialogDescription>
              Select people to start a new conversation. Select multiple users to create a group.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <Input
                placeholder="Search users..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-3"
              />
              
              {selectedUsers.length > 1 && (
                <Input
                  placeholder="Group name (optional)"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="mt-3"
                />
              )}
            </div>
            
            <div className="mb-2">
              <strong className="text-sm font-medium">Selected ({selectedUsers.length})</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedUsers.map(userId => {
                  const user = availableUsers.find(u => u.id === userId);
                  if (!user) return null;
                  
                  return (
                    <Badge key={userId} variant="secondary" className="flex items-center gap-1 py-1 px-2">
                      {user.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => toggleUserSelection(userId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                })}
              </div>
            </div>
            
            <div className="max-h-[200px] overflow-y-auto">
              <strong className="text-sm font-medium">Available Users</strong>
              <div className="space-y-2 mt-2">
                {availableUsers
                  .filter(user => user.id !== currentUserId)
                  .filter(user => 
                    user.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(user => (
                    <div
                      key={user.id}
                      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${
                        selectedUsers.includes(user.id) ? "bg-accent" : "hover:bg-accent/50"
                      }`}
                      onClick={() => toggleUserSelection(user.id)}
                    >
                      <Avatar className="h-8 w-8">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} />
                        ) : (
                          <div className="bg-primary/10 text-primary flex items-center justify-center w-full h-full text-sm font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </Avatar>
                      <span className="font-medium text-sm">{user.name}</span>
                      {user.isOnline && (
                        <span className="ml-auto text-xs text-green-500">Online</span>
                      )}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateConversation}
              disabled={selectedUsers.length === 0 || (selectedUsers.length > 1 && !newGroupName.trim())}
            >
              {selectedUsers.length > 1 ? "Create Group" : "Start Chat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Message icon component
function MessageIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
} 