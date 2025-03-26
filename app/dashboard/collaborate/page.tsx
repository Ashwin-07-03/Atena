"use client";

import { useState } from "react";
import { Metadata } from "next";
import { Users, Plus, UserPlus, File, MessageSquare, Calendar, Clock, Link, Search, MoreHorizontal, Grid3X3, ListFilter, Brain, UserRound, FileText, UserPlusIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

// Import our custom components
import Chat from "@/components/collaborate/chat";
import { ConversationList } from "@/components/collaborate/conversation-list";
import { SharedResources } from "@/components/collaborate/shared-resources";

// Import collaboration service
import { 
  getStudyGroups, 
  createStudyGroup, 
  joinStudyGroup, 
  getUserStudyGroups, 
  getSharedCalendarEvents,
  getSharedResources,
  addSharedResource,
  createCalendarEvent, 
  getCurrentUser,
  getConversations,
  getDirectConversation, 
  getGroupConversation, 
  createDirectConversation,
  getFriends,
  sendFriendRequest,
  getPendingFriendRequests,
  respondToFriendRequest,
  getUserById,
  User,
  StudyGroup,
  SharedCalendarEvent
} from "@/lib/services/collaboration-service";

// Sample data
const studyGroups = [
  {
    id: "1",
    name: "Physics Study Group",
    description: "Weekly sessions covering quantum mechanics and relativity",
    members: 8,
    nextSession: "Today, 5:30 PM",
    activity: "high",
    resources: 12,
    subject: "Physics",
    avatars: [
      { name: "Emma S", image: "/avatars/emma.jpg" },
      { name: "Liam K", image: "/avatars/liam.jpg" },
      { name: "Sophia T", image: "/avatars/sophia.jpg" },
    ],
  },
  {
    id: "2",
    name: "Computer Science Club",
    description: "Algorithm practice and project collaborations",
    members: 12,
    nextSession: "Tomorrow, 6:00 PM",
    activity: "medium",
    resources: 24,
    subject: "Computer Science",
    avatars: [
      { name: "Noah P", image: "/avatars/noah.jpg" },
      { name: "Olivia M", image: "/avatars/olivia.jpg" },
      { name: "James L", image: "/avatars/james.jpg" },
    ],
  },
  {
    id: "3",
    name: "Literature Analysis",
    description: "Discussions on classic literature and essay techniques",
    members: 6,
    nextSession: "Mar 29, 3:00 PM",
    activity: "low",
    resources: 8,
    subject: "Literature",
    avatars: [
      { name: "Amelia R", image: "/avatars/amelia.jpg" },
      { name: "Benjamin W", image: "/avatars/benjamin.jpg" },
    ],
  },
  {
    id: "4",
    name: "Calculus Masters",
    description: "Advanced calculus problem solving and exam prep",
    members: 9,
    nextSession: "Apr 2, 4:00 PM",
    activity: "medium",
    resources: 15,
    subject: "Mathematics",
    avatars: [
      { name: "Charlotte G", image: "/avatars/charlotte.jpg" },
      { name: "Henry B", image: "/avatars/henry.jpg" },
      { name: "Mia Z", image: "/avatars/mia.jpg" },
    ],
  },
];

const sharedResources = [
  {
    id: "1",
    name: "Quantum Physics Notes.pdf",
    type: "PDF",
    size: "2.4 MB",
    sharedBy: "Emma S",
    sharedOn: "Today",
    group: "Physics Study Group",
    avatar: "/avatars/emma.jpg",
    downloads: 6,
  },
  {
    id: "2",
    name: "Algorithm Cheat Sheet.xlsx",
    type: "Spreadsheet",
    size: "1.8 MB",
    sharedBy: "Noah P",
    sharedOn: "Yesterday",
    group: "Computer Science Club",
    avatar: "/avatars/noah.jpg",
    downloads: 8,
  },
  {
    id: "3",
    name: "Literary Devices Reference.docx",
    type: "Document",
    size: "950 KB",
    sharedBy: "Amelia R",
    sharedOn: "2 days ago",
    group: "Literature Analysis",
    avatar: "/avatars/amelia.jpg",
    downloads: 4,
  },
  {
    id: "4",
    name: "Integration Techniques.pdf",
    type: "PDF",
    size: "3.2 MB",
    sharedBy: "Charlotte G",
    sharedOn: "Mar 24",
    group: "Calculus Masters",
    avatar: "/avatars/charlotte.jpg",
    downloads: 12,
  },
  {
    id: "5",
    name: "Programming Project Files.zip",
    type: "Archive",
    size: "8.7 MB",
    sharedBy: "James L",
    sharedOn: "Mar 22",
    group: "Computer Science Club",
    avatar: "/avatars/james.jpg",
    downloads: 5,
  },
];

const upcomingSessions = [
  {
    id: "1",
    title: "Quantum Mechanics Review",
    group: "Physics Study Group",
    date: "Today",
    time: "5:30 - 7:00 PM",
    location: "Zoom Meeting",
    attendees: 7,
  },
  {
    id: "2",
    title: "Algorithmic Problem Solving",
    group: "Computer Science Club",
    date: "Tomorrow",
    time: "6:00 - 8:00 PM",
    location: "Room 302, Science Building",
    attendees: 10,
  },
  {
    id: "3",
    title: "Literary Analysis: Hamlet",
    group: "Literature Analysis",
    date: "Mar 29",
    time: "3:00 - 4:30 PM",
    location: "Library Study Room B",
    attendees: 5,
  },
];

// Helper function to get color classes based on subject
const getSubjectColor = (subject: string) => {
  const colorMap: Record<string, string> = {
    "Physics": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "Computer Science": "bg-green-500/10 text-green-500 border-green-500/20",
    "Literature": "bg-purple-500/10 text-purple-500 border-purple-500/20",
    "Mathematics": "bg-amber-500/10 text-amber-500 border-amber-500/20",
    "Biology": "bg-rose-500/10 text-rose-500 border-rose-500/20",
    "History": "bg-orange-500/10 text-orange-500 border-orange-500/20",
  };
  return colorMap[subject] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
};

// Mock user data to support getUserById if it's not working
const mockUserData: Record<string, { name: string, avatar?: string }> = {
  'user-1': { name: 'Current User', avatar: '/avatars/user.jpg' },
  'user-2': { name: 'Emma S', avatar: '/avatars/emma.jpg' },
  'user-3': { name: 'Liam K', avatar: '/avatars/liam.jpg' },
  'user-4': { name: 'Sophia T', avatar: '/avatars/sophia.jpg' },
  'user-5': { name: 'Noah P', avatar: '/avatars/noah.jpg' },
};

// Fallback implementation for getUserById if the imported one fails
const getUserByIdFallback = (userId: string) => {
  const mockUser = mockUserData[userId];
  return mockUser ? {
    id: userId,
    name: mockUser.name,
    avatar: mockUser.avatar,
    email: `${mockUser.name.toLowerCase().replace(' ', '.')}@example.com`,
    status: 'online' as const,
  } : undefined;
};

// Wrapper component for SharedResources to handle data fetching and state
function ResourcesSection({ groupId }: { groupId?: string }) {
  const resources = getSharedResources(groupId);
  const currentUser = getCurrentUser();

  const handleAddResource = (resource: { name: string; url: string; type: string; tags: string[] }) => {
    addSharedResource({
      ...resource,
      type: resource.type as "document" | "image" | "link",
      thumbnailUrl: resource.type === "image" ? resource.url : undefined,
    });
    // If we had local state, we would update it here
  };

  const handleDeleteResource = (id: string) => {
    // Implementation for deleting resources would go here
    console.log(`Delete resource: ${id}`);
  };

  return (
    <SharedResources 
      resources={resources}
      groupId={groupId}
      onAddResource={handleAddResource}
      onDeleteResource={handleDeleteResource}
      currentUserId={currentUser.id}
    />
  );
}

export default function CollaboratePage() {
  const [activeTab, setActiveTab] = useState<"messages" | "groups" | "resources" | "calendar">("messages");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [userStudyGroups, setUserStudyGroups] = useState<StudyGroup[]>(getUserStudyGroups());
  const [allStudyGroups, setAllStudyGroups] = useState<StudyGroup[]>(getStudyGroups());
  const [calendarEvents, setCalendarEvents] = useState<SharedCalendarEvent[]>(getSharedCalendarEvents());
  const [friends, setFriends] = useState<User[]>(getFriends());
  const [pendingRequests, setPendingRequests] = useState(getPendingFriendRequests());
  const [conversationView, setConversationView] = useState<"list" | "chat">("list");
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupSubject, setNewGroupSubject] = useState("Computer Science");
  
  // Handle creating a new group
  const handleCreateGroup = () => {
    if (!newGroupName.trim() || !newGroupSubject.trim()) return;
    
    const newGroup = createStudyGroup({
      name: newGroupName.trim(),
      description: newGroupDescription.trim() || `A study group for ${newGroupSubject}`,
      subject: newGroupSubject,
      members: [getCurrentUser().id],
      isPublic: true,
      tags: [newGroupSubject.toLowerCase()],
    });
    
    setAllStudyGroups([...allStudyGroups, newGroup]);
    setUserStudyGroups([...userStudyGroups, newGroup]);
    setNewGroupName("");
    setNewGroupDescription("");
  };
  
  // Handle joining a group
  const handleJoinGroup = (groupId: string) => {
    const success = joinStudyGroup(groupId);
    if (success) {
      const group = allStudyGroups.find(g => g.id === groupId);
      if (group && !userStudyGroups.some(g => g.id === groupId)) {
        setUserStudyGroups([...userStudyGroups, group]);
      }
    }
  };
  
  // Handle selecting a conversation
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setConversationView("chat");
  };
  
  // Handle selecting a group
  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
    setShowGroupInfo(true);
  };
  
  // Handle friend request
  const handleSendFriendRequest = (userId: string) => {
    sendFriendRequest(userId);
    // In a real app, we would update the UI or show a notification
  };
  
  // Handle responding to friend request
  const handleRespondToRequest = (requestId: string, accept: boolean) => {
    respondToFriendRequest(requestId, accept);
    setPendingRequests(getPendingFriendRequests());
    if (accept) {
      setFriends(getFriends());
    }
  };
  
  // Get the right content to display based on active tab and view state
  const renderContent = () => {
    switch (activeTab) {
      case "messages":
        if (conversationView === "list") {
          return (
            <div className="border rounded-lg overflow-hidden">
              <ConversationList 
                conversations={getConversations()}
                activeConversationId={selectedConversationId || undefined}
                onSelectConversation={handleSelectConversation}
                onCreateConversation={(participants, title) => {
                  // Implementation would go here
                  console.log(`Create conversation with ${participants.length} users`);
                }}
                availableUsers={getFriends()}
                currentUserId={getCurrentUser().id}
              />
            </div>
          );
        } else if (selectedConversationId) {
          return (
            <div className="border rounded-lg overflow-hidden">
              <Chat 
                conversationId={selectedConversationId}
                onBack={() => setConversationView("list")}
              />
            </div>
          );
        }
        return null;
        
      case "groups":
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userStudyGroups.map(group => (
                <Card key={group.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{group.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => handleSelectGroup(group.id)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {group.members.slice(0, 3).map((memberId, index) => (
                            <Avatar key={index} className="border-2 border-background">
                              <AvatarFallback>U{index + 1}</AvatarFallback>
                            </Avatar>
                          ))}
                          {group.members.length > 3 && (
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-medium border-2 border-background">
                              +{group.members.length - 3}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => {
                            const groupConv = getGroupConversation(group.id);
                            if (groupConv) {
                              setSelectedConversationId(groupConv.id);
                              setActiveTab("messages");
                              setConversationView("chat");
                            }
                          }}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Chat
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => {
                            setSelectedGroupId(group.id);
                            setActiveTab("resources");
                          }}>
                            <FileText className="h-4 w-4 mr-2" />
                            Resources
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="overflow-hidden border-dashed cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors">
                    <CardContent className="p-0">
                      <div className="flex flex-col items-center justify-center p-6 h-full min-h-[220px]">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <Plus className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-medium">Create Study Group</h3>
                        <p className="text-sm text-muted-foreground text-center mt-1">
                          Start a new study group to collaborate with peers
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a Study Group</DialogTitle>
                    <DialogDescription>
                      Create a new study group to collaborate with your peers.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="name" className="text-right">
                        Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Group name"
                        className="col-span-3"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="description" className="text-right">
                        Description
                      </label>
                      <Input
                        id="description"
                        placeholder="Group description"
                        className="col-span-3"
                        value={newGroupDescription}
                        onChange={(e) => setNewGroupDescription(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="subject" className="text-right">
                        Subject
                      </label>
                      <select
                        id="subject"
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newGroupSubject}
                        onChange={(e) => setNewGroupSubject(e.target.value)}
                      >
                        <option>Computer Science</option>
                        <option>Mathematics</option>
                        <option>Physics</option>
                        <option>Literature</option>
                        <option>Biology</option>
                        <option>Chemistry</option>
                        <option>History</option>
                        <option>Art</option>
                        <option>Music</option>
                        <option>Languages</option>
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateGroup} disabled={!newGroupName.trim()}>
                      Create Group
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Discover Study Groups</h2>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search for study groups..."
                  className="pl-9"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {allStudyGroups
                  .filter(group => !userStudyGroups.some(g => g.id === group.id))
                  .map(group => (
                    <Card key={group.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{group.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                            </div>
                            <div 
                              className={`px-2 py-1 text-xs rounded-full ${
                                group.subject === "Computer Science" ? "bg-green-100 text-green-800" :
                                group.subject === "Mathematics" ? "bg-blue-100 text-blue-800" :
                                group.subject === "Physics" ? "bg-purple-100 text-purple-800" :
                                group.subject === "Literature" ? "bg-amber-100 text-amber-800" :
                                "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {group.subject}
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">
                              {group.members.length} members
                            </div>
                            <Button size="sm" onClick={() => handleJoinGroup(group.id)}>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Join Group
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        );
        
      case "resources":
        return <ResourcesSection groupId={selectedGroupId || undefined} />;
        
      case "calendar":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Study Sessions Calendar</h2>
              <Button>
                <Calendar className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </div>
            
            <div className="grid gap-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Upcoming Sessions</h3>
                  <div className="space-y-4">
                    {calendarEvents.length === 0 ? (
                      <p className="text-muted-foreground">No upcoming sessions scheduled.</p>
                    ) : (
                      calendarEvents.map(event => (
                        <div key={event.id} className="flex justify-between items-start pb-4 border-b">
                          <div className="flex gap-4">
                            <div className="w-14 h-14 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                              <span className="text-xs text-muted-foreground">
                                {new Date(event.startTime).toLocaleDateString(undefined, { month: 'short' })}
                              </span>
                              <span className="text-xl font-bold">
                                {new Date(event.startTime).getDate()}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium">{event.title}</h4>
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center text-xs">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(event.startTime).toLocaleDateString()}
                                </div>
                                <div className="flex items-center text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                  {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Join
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Collaborate</h1>
          <p className="text-muted-foreground">
            Study together, share resources, and learn from peers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UserPlusIcon className="mr-2 h-4 w-4" />
                Find Friends
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect with Other Students</DialogTitle>
                <DialogDescription>
                  Find and connect with other students to study together.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search for other students..."
                    className="pl-9"
                  />
                </div>
                
                {pendingRequests.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Pending Requests</h3>
                    {pendingRequests.map(request => {
                      const sender = getUserById(request.senderId) || getUserByIdFallback(request.senderId);
                      return (
                        <div key={request.id} className="flex items-center justify-between p-2 rounded-md border">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{sender?.name?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{sender?.name || "Unknown User"}</p>
                              <p className="text-xs text-muted-foreground">Sent a friend request</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleRespondToRequest(request.id, false)}>
                              Decline
                            </Button>
                            <Button size="sm" onClick={() => handleRespondToRequest(request.id, true)}>
                              Accept
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <div className="grid gap-2">
                  <h3 className="text-sm font-medium">People you may know</h3>
                  {allStudyGroups.flatMap(group => group.members)
                    .filter((memberId, index, self) => 
                      self.indexOf(memberId) === index && // Deduplicate
                      memberId !== getCurrentUser().id && // Not current user
                      !friends.some(f => f.id === memberId) // Not already friends
                    )
                    .slice(0, 5) // Limit to 5 suggestions
                    .map(memberId => {
                      const user = getUserById(memberId) || getUserByIdFallback(memberId);
                      if (!user) return null;
                      
                      return (
                        <div key={user.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">Student</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => handleSendFriendRequest(user.id)}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Connect
                          </Button>
                        </div>
                      );
                    })}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Group
          </Button>
        </div>
      </div>

      {/* Main content */}
      <Tabs defaultValue="messages" value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
        <TabsList>
          <TabsTrigger value="messages">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="groups">
            <Users className="h-4 w-4 mr-2" />
            Study Groups
          </TabsTrigger>
          <TabsTrigger value="resources">
            <FileText className="h-4 w-4 mr-2" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages">
          {renderContent()}
        </TabsContent>
        
        <TabsContent value="groups">
          {renderContent()}
        </TabsContent>
        
        <TabsContent value="resources">
          {renderContent()}
        </TabsContent>
        
        <TabsContent value="calendar">
          {renderContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
} 