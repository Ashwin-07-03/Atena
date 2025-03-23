'use client';

import { useState } from 'react';
import { Calendar, Plus, Clock, Pencil, CheckSquare, BookOpen, Calendar as CalendarIcon, ChevronLeft, ChevronRight, MoreHorizontal, X, Brain } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Simplified events for demo purposes
const INITIAL_EVENTS = [
  {
    id: '1',
    title: 'Introduction to Computer Science',
    start: new Date(new Date().setHours(10, 0)).toISOString(),
    end: new Date(new Date().setHours(11, 30)).toISOString(),
    color: 'primary',
    location: 'Room 302B',
    description: 'Weekly lecture on computer science fundamentals'
  },
  {
    id: '2',
    title: 'Mathematics Assignment Due',
    start: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), // Tomorrow
    allDay: true,
    color: 'accent',
    description: 'Submit assignment online through the portal'
  },
  {
    id: '3',
    title: 'Study Group: Physics',
    start: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(), // 3 days later
    end: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    color: 'secondary',
    location: 'Library, Table 12',
    description: 'Group study session for upcoming physics exam'
  }
];

// Sample data from existing file
const today = new Date();
const currentMonth = today.toLocaleString('default', { month: 'long' });
const currentYear = today.getFullYear();

const upcomingEvents = [
  {
    id: "1",
    title: "Physics Quiz",
    date: "Today",
    time: "2:30 PM",
    location: "Room 305",
    type: "quiz",
    subject: "Physics",
    completed: false,
  },
  {
    id: "2",
    title: "Literature Essay Deadline",
    date: "Today",
    time: "11:59 PM",
    location: "Online Submission",
    type: "assignment",
    subject: "Literature",
    completed: false,
  },
  {
    id: "3",
    title: "Math Study Group",
    date: "Tomorrow",
    time: "4:00 PM",
    location: "Library",
    type: "study",
    subject: "Mathematics",
    completed: false,
  },
  {
    id: "4",
    title: "Computer Science Midterm",
    date: "Mar 28, 2023",
    time: "10:00 AM",
    location: "Room 401",
    type: "exam",
    subject: "Computer Science",
    completed: false,
  },
  {
    id: "5",
    title: "Biology Lab Report",
    date: "Mar 30, 2023",
    time: "11:59 PM",
    location: "Online Submission",
    type: "assignment",
    subject: "Biology",
    completed: false,
  },
];

const tasks = [
  {
    id: "1",
    title: "Review quantum mechanics formulas",
    dueDate: "Today",
    status: "in-progress",
    priority: "high",
    subject: "Physics",
  },
  {
    id: "2",
    title: "Complete calculus problem set",
    dueDate: "Today",
    status: "in-progress",
    priority: "medium",
    subject: "Mathematics",
  },
  {
    id: "3",
    title: "Read chapters 7-8 of Hamlet",
    dueDate: "Tomorrow",
    status: "not-started",
    priority: "medium",
    subject: "Literature",
  },
  {
    id: "4",
    title: "Prepare slides for history presentation",
    dueDate: "Mar 29, 2023",
    status: "not-started",
    priority: "high",
    subject: "History",
  },
  {
    id: "5",
    title: "Debug programming assignment",
    dueDate: "Mar 30, 2023",
    status: "not-started",
    priority: "medium",
    subject: "Computer Science",
  },
  {
    id: "6",
    title: "Study cellular respiration",
    dueDate: "Apr 2, 2023",
    status: "not-started",
    priority: "low",
    subject: "Biology",
  },
];

// Calendar data (simplified for example)
const calendarDays = Array.from({ length: 35 }, (_, i) => {
  const day = i - 2; // Offset to start calendar on Monday
  return {
    date: day,
    isCurrentMonth: day > 0 && day <= 31,
    isToday: day === today.getDate(),
    events: day === today.getDate() ? 2 : 
            day === today.getDate() + 1 ? 1 : 
            day === 10 ? 1 : 
            day === 15 ? 3 : 
            day === 20 ? 1 : 
            day === 28 ? 1 : 0
  };
});

const subjectColors: Record<string, string> = {
  "Physics": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "Mathematics": "bg-amber-500/10 text-amber-500 border-amber-500/20",
  "Literature": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "Computer Science": "bg-green-500/10 text-green-500 border-green-500/20",
  "Biology": "bg-rose-500/10 text-rose-500 border-rose-500/20",
  "History": "bg-orange-500/10 text-orange-500 border-orange-500/20",
};

const typeIcons: Record<string, string> = {
  "quiz": "Clock",
  "assignment": "Pencil",
  "study": "BookOpen",
  "exam": "Calendar",
};

export default function SchedulePage() {
  const [events] = useState(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [currentDate] = useState(new Date());

  // Calculate days for the current week
  const getDaysInWeek = () => {
    const days = [];
    const day = new Date(currentDate);
    day.setDate(day.getDate() - day.getDay()); // Start with Sunday
    
    for (let i = 0; i < 7; i++) {
      days.push(new Date(day));
      day.setDate(day.getDate() + 1);
    }
    return days;
  };
  
  const days = getDaysInWeek();
  
  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === date.getDate() && 
             eventDate.getMonth() === date.getMonth() && 
             eventDate.getFullYear() === date.getFullYear();
    });
  };
  
  // Format time from date string
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Schedule</h1>
          <p className="text-muted-foreground">
            Manage your assignments, exams, and study sessions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <span className="mr-2">+</span>
            Add Event
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Calendar */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>
                  {currentMonth} {currentYear}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <span className="sr-only">Previous month</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <span className="sr-only">Next month</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="sm" className="ml-2">
                    Today
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Week View */}
              <div className="calendar-container overflow-x-auto">
                <div className="grid grid-cols-7 border-b border-border">
                  {days.map((day, index) => (
                    <div 
                      key={index}
                      className={`text-center py-2 font-medium ${
                        day.getDate() === new Date().getDate() ? 
                        'bg-primary/10 text-primary' : 
                        'text-foreground/70'
                      }`}
                    >
                      <div className="text-xs text-foreground/70">
                        {day.toLocaleDateString(undefined, { weekday: 'short' })}
                      </div>
                      <div className="text-lg">{day.getDate()}</div>
                    </div>
                  ))}
                </div>
                
                {/* Time slots */}
                <div className="relative min-h-[600px]">
                  {Array.from({ length: 12 }).map((_, hourIndex) => (
                    <div 
                      key={hourIndex} 
                      className="grid grid-cols-7 border-b border-border"
                      style={{ height: '100px' }}
                    >
                      {days.map((day, dayIndex) => {
                        const dayEvents = getEventsForDate(day);
                        const hourEvents = dayEvents.filter(event => {
                          const eventDate = new Date(event.start);
                          return eventDate.getHours() === hourIndex + 8; // 8 AM to 8 PM
                        });
                        
                        return (
                          <div 
                            key={dayIndex} 
                            className="relative border-r border-border hover:bg-secondary/30 transition-colors"
                          >
                            {hourIndex === 0 && (
                              <div className="absolute top-0 left-0 w-full text-xs text-foreground/70 p-1">
                                {day.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </div>
                            )}
                            
                            <div className="absolute top-0 left-0 text-xs text-foreground/70 p-1">
                              {`${hourIndex + 8}:00`}
                            </div>
                            
                            {hourEvents.map(event => (
                              <div 
                                key={event.id}
                                className={`absolute top-5 left-0 right-0 mx-1 p-1 rounded-md cursor-pointer overflow-hidden ${
                                  event.color === 'primary' ? 'bg-primary/10 border-l-4 border-primary' :
                                  event.color === 'accent' ? 'bg-accent/20 border-l-4 border-accent' :
                                  'bg-secondary border-l-4 border-foreground/30'
                                }`}
                                style={{ 
                                  height: '70px',
                                  zIndex: 10
                                }}
                                onClick={() => setSelectedEvent(event)}
                              >
                                <div className="font-medium text-xs truncate">
                                  {event.title}
                                </div>
                                <div className="text-xs text-foreground/70 truncate">
                                  {formatTime(event.start)} {event.end && `- ${formatTime(event.end)}`}
                                </div>
                                {event.location && (
                                  <div className="text-xs text-foreground/70 truncate">
                                    {event.location}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Schedule legend */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                  Quiz
                </Badge>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                  Assignment
                </Badge>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Exam
                </Badge>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                  Study Session
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Event Details & Quick Add */}
        <div className="lg:col-span-1 space-y-6">
          {/* Event Details */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedEvent ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="text-sm text-foreground/70">Title</div>
                    <div className="font-medium">{selectedEvent.title}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-foreground/70">Date & Time</div>
                    <div className="font-medium">
                      {selectedEvent.allDay 
                        ? new Date(selectedEvent.start).toLocaleDateString() 
                        : `${new Date(selectedEvent.start).toLocaleDateString()} ${formatTime(selectedEvent.start)}`
                      }
                      {selectedEvent.end && !selectedEvent.allDay && ` - ${formatTime(selectedEvent.end)}`}
                    </div>
                  </div>
                  
                  {selectedEvent.location && (
                    <div className="space-y-1">
                      <div className="text-sm text-foreground/70">Location</div>
                      <div className="font-medium">{selectedEvent.location}</div>
                    </div>
                  )}
                  
                  {selectedEvent.description && (
                    <div className="space-y-1">
                      <div className="text-sm text-foreground/70">Description</div>
                      <div className="font-medium">{selectedEvent.description}</div>
                    </div>
                  )}
                  
                  <div className="pt-2 flex space-x-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Select an event to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Upcoming events column */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Upcoming</CardTitle>
              <CardDescription>Your schedule for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <Tabs defaultValue="events">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                </TabsList>
                <TabsContent value="events" className="pt-4">
                  <div className="space-y-2">
                    {upcomingEvents.slice(0, 3).map((event) => {
                      const colorClass = subjectColors[event.subject] || "bg-gray-100 text-gray-800";
                      
                      return (
                        <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass.split(' ')[0]}`}>
                            <span className={`h-5 w-5 ${colorClass.split(' ')[1]}`}>📅</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-sm">{event.title}</h4>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {event.date} • {event.time} • {event.location}
                                </div>
                              </div>
                              <Button variant="ghost" size="icon" className="h-7 w-7 -mt-1 -mr-1">
                                <span className="sr-only">Options</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4"
                                >
                                  <circle cx="12" cy="12" r="1" />
                                  <circle cx="19" cy="12" r="1" />
                                  <circle cx="5" cy="12" r="1" />
                                </svg>
                              </Button>
                            </div>
                            <div className="mt-2 flex items-center gap-1">
                              <Badge variant="outline" className={colorClass}>
                                {event.subject}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
                <TabsContent value="tasks" className="pt-4">
                  <div className="space-y-2">
                    {tasks.slice(0, 3).map((task) => {
                      const colorClass = subjectColors[task.subject] || "bg-gray-100 text-gray-800";
                      const priorityColors = {
                        high: "bg-red-500/10 text-red-500 border-red-500/20",
                        medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
                        low: "bg-green-500/10 text-green-500 border-green-500/20",
                      };
                      
                      return (
                        <div key={task.id} className="flex items-start gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="pt-0.5">
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <rect width="16" height="16" x="4" y="4" rx="2" />
                                <path d="m9 12 2 2 4-4" />
                              </svg>
                            </Button>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-sm">{task.title}</h4>
                              <Button variant="ghost" size="icon" className="h-7 w-7 -mt-1 -mr-1">
                                <span className="sr-only">Options</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4"
                                >
                                  <circle cx="12" cy="12" r="1" />
                                  <circle cx="19" cy="12" r="1" />
                                  <circle cx="5" cy="12" r="1" />
                                </svg>
                              </Button>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Due: {task.dueDate}
                            </div>
                            <div className="mt-2 flex items-center gap-1">
                              <Badge variant="outline" className={colorClass}>
                                {task.subject}
                              </Badge>
                              <Badge variant="outline" className={priorityColors[task.priority as keyof typeof priorityColors]}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                              </Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button className="w-full" variant="outline" size="sm">
                <span className="mr-1">+</span>
                Add New Task
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}