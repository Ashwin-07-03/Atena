import { Metadata } from "next";
import { Users, Plus, UserPlus, File, MessageSquare, Calendar, Clock, Link, Search, MoreHorizontal, Grid3X3, ListFilter, Brain } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "Collaborate | Atena",
  description: "Study with peers and share resources",
};

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

export default function CollaboratePage() {
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
          <Button variant="outline">
            <UserPlus className="mr-2 h-4 w-4" />
            Join Group
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Group
          </Button>
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search study groups or resources..."
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="sm:w-auto w-full">
          <ListFilter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-10 w-10 bg-muted/50">
            <ListFilter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main content */}
      <Tabs defaultValue="groups" className="space-y-6">
        <TabsList>
          <TabsTrigger value="groups">Study Groups</TabsTrigger>
          <TabsTrigger value="resources">Shared Resources</TabsTrigger>
          <TabsTrigger value="sessions">Upcoming Sessions</TabsTrigger>
        </TabsList>
        
        {/* Study Groups Tab */}
        <TabsContent value="groups">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {studyGroups.map((group) => (
              <Card key={group.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{group.name}</CardTitle>
                      <CardDescription className="mt-1">{group.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className={getSubjectColor(group.subject)}>
                      {group.subject}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex justify-between text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{group.members} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{group.nextSession}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {group.avatars.map((avatar, i) => (
                        <Avatar key={i} className="border-2 border-background h-8 w-8">
                          <AvatarImage src={avatar.image} alt={avatar.name} />
                          <AvatarFallback>{avatar.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ))}
                      {group.members > group.avatars.length && (
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium">
                          +{group.members - group.avatars.length}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`${
                        group.activity === "high" ? "bg-green-500/10 text-green-500" :
                        group.activity === "medium" ? "bg-amber-500/10 text-amber-500" :
                        "bg-red-500/10 text-red-500"
                      }`}>
                        {group.activity.charAt(0).toUpperCase() + group.activity.slice(1)} Activity
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3 flex justify-between">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="mr-1 h-4 w-4" />
                    Chat
                  </Button>
                  <Button size="sm">
                    View Group
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Create Group Card */}
          <Card className="mt-4 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Create Study Group</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Start a new study group for your class, project, or topic of interest.
                Invite peers and share resources to learn together.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New Group
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Shared Resources Tab */}
        <TabsContent value="resources">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Shared Resources</CardTitle>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Resource
                </Button>
              </div>
              <CardDescription>Files and documents shared in your study groups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sharedResources.map((resource) => (
                  <div key={resource.id} className="flex items-start p-3 hover:bg-muted/50 rounded-lg transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mr-3">
                      <File className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium truncate">{resource.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>{resource.type} • {resource.size}</span>
                            <span>•</span>
                            <span>{resource.group}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={resource.avatar} alt={resource.sharedBy} />
                            <AvatarFallback>{resource.sharedBy.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            Shared by {resource.sharedBy}, {resource.sharedOn}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            <Link className="mr-1 h-3 w-3" />
                            Copy Link
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {sharedResources.length} of {sharedResources.length} resources
              </div>
              <Button variant="outline" size="sm">
                View All Resources
              </Button>
            </CardFooter>
          </Card>
          
          {/* AI Resource Recommendations */}
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <CardTitle>Resource Recommendations</CardTitle>
              </div>
              <CardDescription>AI-suggested resources based on your study groups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-card border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500/10 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <File className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">Quantum Physics Lecture Notes</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Comprehensive notes on quantum mechanics principles relevant to your Physics group
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                          Physics
                        </Badge>
                        <span className="text-xs text-muted-foreground">From MIT OpenCourseWare</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-card border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500/10 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <File className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">Algorithm Visualization Tools</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Interactive tools to visualize sorting and pathfinding algorithms for your CS group
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-500/10 text-green-500">
                          Computer Science
                        </Badge>
                        <span className="text-xs text-muted-foreground">From AlgoViz.org</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-primary/10 pt-4">
              <Button size="sm" className="ml-auto">
                Get More Recommendations
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Upcoming Sessions Tab */}
        <TabsContent value="sessions">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Upcoming Study Sessions</CardTitle>
                <CardDescription>Scheduled meetings with your study groups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingSessions.map((session) => {
                  const groupData = studyGroups.find(g => g.name === session.group);
                  const colorClass = groupData ? getSubjectColor(groupData.subject) : "";
                  
                  return (
                    <div key={session.id} className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{session.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{session.group}</p>
                        </div>
                        <Badge variant="outline" className={colorClass}>
                          {groupData?.subject || "Other"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{session.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{session.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{session.attendees} attending</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Group chat available</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4 pt-4 border-t">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Location: </span>
                          <span>{session.location}</span>
                        </div>
                        <Button size="sm">
                          Join Session
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full" size="sm">
                  View All Sessions
                </Button>
              </CardFooter>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Schedule a Session</CardTitle>
                  <CardDescription>Plan a study session with your group</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Select Study Group</label>
                      <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option>Physics Study Group</option>
                        <option>Computer Science Club</option>
                        <option>Literature Analysis</option>
                        <option>Calculus Masters</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Session Title</label>
                      <Input placeholder="e.g., Exam Preparation Session" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Date</label>
                        <Input type="date" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Time</label>
                        <Input type="time" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Location</label>
                      <Input placeholder="e.g., Library Study Room or Zoom Link" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button className="w-full">
                    Schedule Study Session
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <CardTitle>Study Statistics</CardTitle>
                  <CardDescription>Insights from your collaborative study sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <span>Total Collaborative Hours</span>
                      </div>
                      <span className="font-bold">26.5 hours</span>
                    </div>
                    
                    <div className="flex items-center justify-between pb-2 border-b">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <span>Active Groups</span>
                      </div>
                      <span className="font-bold">4 groups</span>
                    </div>
                    
                    <div className="flex items-center justify-between pb-2 border-b">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
                          <File className="h-4 w-4 text-primary" />
                        </div>
                        <span>Shared Resources</span>
                      </div>
                      <span className="font-bold">18 files</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <span>Messages Exchanged</span>
                      </div>
                      <span className="font-bold">342</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 