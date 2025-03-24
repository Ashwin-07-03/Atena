'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, Plus, Clock, Pencil, CheckSquare, BookOpen, Calendar as CalendarIcon, ChevronLeft, ChevronRight, MoreHorizontal, X, Brain } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useScheduleStore, ScheduleEvent } from "@/lib/services/schedule-service";
import { ScheduleCalendar } from "@/components/dashboard/schedule-calendar";
import { ScheduleEventForm } from "@/components/dashboard/schedule-event-form";
import { formatDate, formatTimeAgo } from "@/lib/utils";

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
  const { events, addEvent, updateEvent, deleteEvent, getEvents } = useScheduleStore();
  
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [isEditEventDialogOpen, setIsEditEventDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar");
  const [calendarEvents, setCalendarEvents] = useState<ScheduleEvent[]>([]);
  const [isCalendarCompact, setIsCalendarCompact] = useState(false);
  
  // Check screen size for responsive layout
  useEffect(() => {
    const checkScreenSize = () => {
      setIsCalendarCompact(window.innerWidth < 1024);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add listener for resize
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Initialize with demo events if no events exist
  useEffect(() => {
    if (events.length === 0) {
      try {
        // Add some sample events with proper error handling
        const INITIAL_EVENTS = [
          {
            title: 'Introduction to Computer Science',
            start: new Date(new Date().setHours(10, 0)),
            end: new Date(new Date().setHours(11, 30)),
            allDay: false,
            color: 'primary',
            location: 'Room 302B',
            description: 'Weekly lecture on computer science fundamentals'
          },
          {
            title: 'Mathematics Assignment Due',
            start: new Date(new Date().setDate(new Date().getDate() + 1)),
            end: new Date(new Date().setDate(new Date().getDate() + 1)),
            allDay: true,
            color: 'accent',
            description: 'Submit assignment online through the portal'
          },
          {
            title: 'Study Group: Physics',
            start: new Date(new Date().setDate(new Date().getDate() + 3)),
            end: new Date(new Date().setDate(new Date().getDate() + 3)),
            allDay: false,
            color: 'secondary',
            location: 'Library, Table 12',
            description: 'Group study session for upcoming physics exam'
          }
        ];
        
        INITIAL_EVENTS.forEach(event => {
          addEvent(event);
        });
      } catch (error) {
        console.error('Error initializing events:', error);
      }
    }
  }, [addEvent, events.length]);
  
  // Update calendar events when the store changes, with memoization
  useEffect(() => {
    const formattedEvents = events.map(event => ({
      ...event,
      className: `fc-event-${event.color || 'primary'}`
    }));
    setCalendarEvents(formattedEvents);
  }, [events]);
  
  // Get the upcoming events (next 7 days)
  const upcomingEvents = getEvents(new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  
  // Handle event selection in the calendar
  const handleEventClick = useCallback((info: any) => {
    const eventId = info.event.id;
    const selectedEvent = events.find(event => event.id === eventId);
    if (selectedEvent) {
      setSelectedEvent(selectedEvent);
      setIsEditEventDialogOpen(true);
    }
  }, [events]);
  
  // Handle date selection in the calendar
  const handleDateSelect = useCallback((info: any) => {
    try {
      const startDate = new Date(info.start);
      // Ensure end date is valid, or use start date + 1 hour as fallback
      let endDate;
      try {
        endDate = info.end ? new Date(info.end) : new Date(startDate.getTime() + 60 * 60 * 1000);
      } catch (e) {
        console.error('Error parsing end date:', e);
        endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      }
      
      // Check if dates are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error('Invalid date selection');
        return;
      }
      
      // Create default event with selected dates
      const defaultEvent = {
        title: "",
        start: startDate,
        end: endDate,
        allDay: info.allDay,
        color: "primary",
        location: "",
        description: ""
      } as any; // Use type assertion to avoid TS errors with the ScheduleEvent interface
      
      setSelectedEvent(defaultEvent);
      setIsAddEventDialogOpen(true);
    } catch (error) {
      console.error('Error handling date selection:', error);
    }
  }, []);
  
  // Handle save event
  const handleSaveEvent = (eventData: any) => {
    addEvent(eventData);
    setIsAddEventDialogOpen(false);
  };
  
  // Handle update event
  const handleUpdateEvent = (eventData: any) => {
    if (selectedEvent) {
      updateEvent(selectedEvent.id, eventData);
    }
    setIsEditEventDialogOpen(false);
    setSelectedEvent(null);
  };
  
  // Handle delete event
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
    }
    setIsEditEventDialogOpen(false);
    setSelectedEvent(null);
  };
  
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Schedule</h1>
          <p className="text-muted-foreground">
            Plan your study sessions, assignments, and deadlines
          </p>
        </div>
        <Button onClick={() => setIsAddEventDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>
      
      {/* Main content */}
      <Tabs defaultValue="calendar" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardContent className="p-0 sm:p-2">
              <div className={isCalendarCompact ? "h-[450px]" : "h-[550px]"}>
                <ScheduleCalendar
                  events={calendarEvents}
                  onEventClick={handleEventClick}
                  onDateSelect={handleDateSelect}
                  onEventChange={(updatedEvent) => {
                    if (updatedEvent.id) {
                      updateEvent(updatedEvent.id, updatedEvent);
                    }
                  }}
                  compact={isCalendarCompact}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Events scheduled for the next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div 
                      key={event.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsEditEventDialogOpen(true);
                      }}
                    >
                      <div className={`w-10 h-10 rounded-full bg-${event.color || 'primary'}/10 flex items-center justify-center`}>
                        <Calendar className={`h-5 w-5 text-${event.color || 'primary'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {event.allDay 
                            ? formatDate(event.start, 'PPP') 
                            : `${formatDate(event.start, 'PPP')} • ${formatDate(event.start, 'p')} - ${formatDate(event.end, 'p')}`}
                        </div>
                        {event.location && (
                          <div className="text-sm mt-1">{event.location}</div>
                        )}
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-medium text-lg mb-1">No upcoming events</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Plan your week by adding events to your schedule
                  </p>
                  <Button onClick={() => setIsAddEventDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
              <CardDescription>
                Track your assignments and deadlines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events
                  .filter(event => event.title.toLowerCase().includes('assignment') || event.description?.toLowerCase().includes('assignment'))
                  .map((event) => (
                    <div 
                      key={event.id}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsEditEventDialogOpen(true);
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-0.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckSquare className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Due: {formatDate(event.start, 'PPP')}
                          </div>
                        </div>
                      </div>
                      <Badge>Pending</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Event Dialog */}
      <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Create a new event in your schedule
            </DialogDescription>
          </DialogHeader>
          <ScheduleEventForm
            onSave={handleSaveEvent}
            onCancel={() => setIsAddEventDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Event Dialog */}
      <Dialog open={isEditEventDialogOpen} onOpenChange={setIsEditEventDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Make changes to your scheduled event
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <ScheduleEventForm
              event={selectedEvent}
              isEditing={true}
              onSave={handleUpdateEvent}
              onCancel={() => setIsEditEventDialogOpen(false)}
              onDelete={handleDeleteEvent}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}