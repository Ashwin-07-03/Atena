"use client"

import * as React from "react"
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
  endOfDay,
  startOfDay,
} from "date-fns"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { CalendarEvent, CalendarService, EventPriority } from "@/lib/services/calendar-service"
import { CalendarEventForm } from "./calendar-event-form"

interface TimeSlotProps {
  hour: number
  day: Date
  events: CalendarEvent[]
  onEventClick?: (event: CalendarEvent) => void
}

interface UnifiedCalendarProps {
  initialView?: "month" | "week" | "day"
}

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
]

const HOURS = Array.from({ length: 15 }, (_, i) => i + 8); // 8:00 - 22:00

// Function to get color based on priority
function getPriorityColor(priority: EventPriority): string {
  switch (priority) {
    case EventPriority.LESS_IMPORTANT:
      return "bg-green-500"
    case EventPriority.IMPORTANT:
      return "bg-blue-500"
    case EventPriority.MANDATORY:
      return "bg-red-500"
    default:
      return "bg-muted-foreground"
  }
}

const TimeSlot = ({ hour, day, events, onEventClick }: TimeSlotProps) => {
  const relevantEvents = events.filter(event => {
    const eventHour = new Date(event.start).getHours();
    return isSameDay(new Date(event.start), day) && eventHour === hour;
  });

  return (
    <div className={cn(
      "border-r border-b h-12 relative",
      isToday(day) && "bg-yellow-50"
    )}>
      {relevantEvents.map(event => (
        <div 
          key={event.id}
          className={cn(
            "absolute inset-x-0 mx-0.5 rounded text-white text-xs p-1 overflow-hidden cursor-pointer",
            getPriorityColor(event.priority)
          )}
          style={{
            top: "2px",
            height: "calc(100% - 4px)"
          }}
          onClick={() => onEventClick?.(event)}
        >
          {event.title}
        </div>
      ))}
    </div>
  );
};

export function UnifiedCalendar({ initialView = "month" }: UnifiedCalendarProps) {
  // State
  const today = startOfToday()
  const [currentDate, setCurrentDate] = React.useState(today)
  const [selectedDay, setSelectedDay] = React.useState(today)
  const [view, setView] = React.useState<"month" | "week" | "day">(initialView)
  const [events, setEvents] = React.useState<CalendarEvent[]>([])
  const [eventFormOpen, setEventFormOpen] = React.useState(false)
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null)
  
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Effects
  React.useEffect(() => {
    // Load events on component mount
    const loadedEvents = CalendarService.getEvents();
    setEvents(loadedEvents);
  }, []);

  // Calculate date ranges based on view
  const currentMonth = format(currentDate, "MMM-yyyy")
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date())

  // Days for current view
  const days = React.useMemo(() => {
    if (view === "month") {
      return eachDayOfInterval({
        start: startOfWeek(firstDayCurrentMonth),
        end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
      });
    } else if (view === "week") {
      return eachDayOfInterval({
        start: startOfWeek(currentDate),
        end: endOfWeek(currentDate),
      });
    } else {
      // Day view, just return an array with the selected day
      return [currentDate];
    }
  }, [currentDate, firstDayCurrentMonth, view]);

  // Tab navigation
  const tabItems = [
    { id: "calendar", label: "Calendar" },
    { id: "upcoming", label: "Upcoming" },
    { id: "assignments", label: "Assignments" },
  ];

  // Navigation functions
  const previous = () => {
    if (view === "month") {
      setCurrentDate(prevDate => add(prevDate, { months: -1 }));
    } else if (view === "week") {
      setCurrentDate(prevDate => add(prevDate, { weeks: -1 }));
    } else {
      setCurrentDate(prevDate => add(prevDate, { days: -1 }));
    }
  };

  const next = () => {
    if (view === "month") {
      setCurrentDate(prevDate => add(prevDate, { months: 1 }));
    } else if (view === "week") {
      setCurrentDate(prevDate => add(prevDate, { weeks: 1 }));
    } else {
      setCurrentDate(prevDate => add(prevDate, { days: 1 }));
    }
  };

  const goToToday = () => {
    setCurrentDate(today);
    setSelectedDay(today);
  };

  // Get filtered events for the selected date range
  const visibleEvents = React.useMemo(() => {
    if (view === "month") {
      // For month view, we don't filter so we can see all events
      return events;
    } else if (view === "week") {
      // For week view, filter events in the current week
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      return events.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate >= weekStart && eventDate <= weekEnd;
      });
    } else {
      // For day view, filter events on the current day
      return events.filter(event => {
        return isSameDay(new Date(event.start), currentDate);
      });
    }
  }, [events, currentDate, view]);

  // Event handlers
  const handleAddEvent = () => {
    setSelectedEvent(null);
    setEventFormOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEventFormOpen(true);
  };

  const handleSaveEvent = (newEvent: Omit<CalendarEvent, "id">) => {
    if (selectedEvent) {
      // Update existing event
      const updatedEvent = { ...newEvent, id: selectedEvent.id };
      CalendarService.updateEvent(updatedEvent);
      setEvents(prevEvents => 
        prevEvents.map(e => e.id === selectedEvent.id ? updatedEvent : e)
      );
    } else {
      // Add new event
      const addedEvent = CalendarService.addEvent(newEvent);
      setEvents(prevEvents => [...prevEvents, addedEvent]);
    }
  };

  // Helper to get title text based on current view
  const getViewTitle = () => {
    if (view === "month") {
      return format(firstDayCurrentMonth, "MMMM yyyy");
    } else if (view === "week") {
      const startOfCurrentWeek = startOfWeek(currentDate);
      const endOfCurrentWeek = endOfWeek(currentDate);
      return `${format(startOfCurrentWeek, "MMM d")} - ${format(endOfCurrentWeek, "MMM d")}, ${format(currentDate, "yyyy")}`;
    } else {
      return format(currentDate, "MMMM d, yyyy");
    }
  };

  // Get dots for events on a specific day
  const getEventIndicators = (day: Date) => {
    const dayEvents = events.filter(event => isSameDay(new Date(event.start), day));
    
    if (dayEvents.length === 0) return null;
    
    // Group by priority
    const lessImportant = dayEvents.filter(e => e.priority === EventPriority.LESS_IMPORTANT);
    const important = dayEvents.filter(e => e.priority === EventPriority.IMPORTANT);
    const mandatory = dayEvents.filter(e => e.priority === EventPriority.MANDATORY);
    
    return (
      <div className="flex justify-center mt-1 gap-1">
        {lessImportant.length > 0 && <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>}
        {important.length > 0 && <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>}
        {mandatory.length > 0 && <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tabs */}
      <div className="flex border-b">
        {tabItems.map(item => (
          <button
            key={item.id}
            className={cn(
              "px-4 py-2 text-sm font-medium",
              item.id === "calendar" ? "border-b-2 border-blue-500" : "text-gray-500"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Calendar Container */}
      <div className="flex-1 flex flex-col">
        {/* Header Controls */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex space-x-2">
            <Button
              onClick={previous}
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              onClick={next}
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              onClick={goToToday}
              variant="outline"
              className="h-8 text-xs"
            >
              today
            </Button>
          </div>

          <h2 className="text-lg font-semibold">
            {getViewTitle()}
          </h2>

          <div className="flex items-center gap-2">
            <div className="flex rounded-md border overflow-hidden">
              <button
                onClick={() => setView("month")}
                className={cn(
                  "px-3 py-1 text-sm",
                  view === "month"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-800"
                )}
              >
                month
              </button>
              <button
                onClick={() => setView("week")}
                className={cn(
                  "px-3 py-1 text-sm",
                  view === "week"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-800"
                )}
              >
                week
              </button>
              <button
                onClick={() => setView("day")}
                className={cn(
                  "px-3 py-1 text-sm",
                  view === "day"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-800"
                )}
              >
                day
              </button>
            </div>
            
            <Button 
              onClick={handleAddEvent}
              className="h-8 gap-1"
              size="sm"
            >
              <PlusCircleIcon className="h-4 w-4" />
              <span>New Event</span>
            </Button>
          </div>
        </div>

        {/* Calendar Views */}
        {view === "month" && (
          <div className="flex-1 grid grid-cols-7 grid-rows-auto">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 text-center text-sm font-medium border-b">
              <div className="py-2">Sun</div>
              <div className="py-2">Mon</div>
              <div className="py-2">Tue</div>
              <div className="py-2">Wed</div>
              <div className="py-2">Thu</div>
              <div className="py-2">Fri</div>
              <div className="py-2">Sat</div>
            </div>
            
            {/* Month Grid */}
            <div className="col-span-7 grid grid-cols-7 auto-rows-fr">
              {days.map((day, dayIdx) => {
                const isSelected = isEqual(day, selectedDay);
                const isCurrentMonth = isSameMonth(day, firstDayCurrentMonth);
                
                return (
                  <div
                    key={dayIdx}
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      "p-2 border-r border-b relative min-h-[80px] select-none cursor-pointer hover:bg-slate-50",
                      dayIdx % 7 === 6 && "border-r-0", // Remove right border for last column
                      !isCurrentMonth && "bg-slate-50/50 text-slate-400",
                      isSelected && "bg-slate-100",
                    )}
                  >
                    <div 
                      className={cn(
                        "flex items-center justify-center w-8 h-8 mx-auto rounded-full",
                        isToday(day) && "bg-black text-white",
                        isSelected && !isToday(day) && "border border-slate-300"
                      )}
                    >
                      {format(day, "d")}
                    </div>
                    
                    {/* Event indicators */}
                    {getEventIndicators(day)}
                    
                    {/* Show first event on desktop */}
                    {isDesktop && events.some(event => isSameDay(new Date(event.start), day)) && (
                      <div className="mt-1 text-xs">
                        {events
                          .filter(event => isSameDay(new Date(event.start), day))
                          .slice(0, 1)
                          .map(event => (
                            <div 
                              key={event.id}
                              className={cn(
                                "p-1 rounded-sm mt-1 truncate cursor-pointer",
                                event.priority === EventPriority.LESS_IMPORTANT && "border-l-2 border-green-500 bg-green-50",
                                event.priority === EventPriority.IMPORTANT && "border-l-2 border-blue-500 bg-blue-50",
                                event.priority === EventPriority.MANDATORY && "border-l-2 border-red-500 bg-red-50",
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEventClick(event);
                              }}
                            >
                              {event.title}
                            </div>
                          ))}
                        
                        {/* Show "+X more" if more than one event */}
                        {events.filter(event => isSameDay(new Date(event.start), day)).length > 1 && (
                          <div className="text-xs text-center text-gray-500 mt-1">
                            +{events.filter(event => isSameDay(new Date(event.start), day)).length - 1} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === "week" && (
          <div className="flex-1 grid grid-cols-8">
            {/* Time Column */}
            <div className="border-r">
              <div className="h-12 border-b text-right pr-2 text-gray-500 text-sm font-medium">
                all-day
              </div>
              {HOURS.map(hour => (
                <div 
                  key={hour} 
                  className="h-12 border-b text-right pr-2 text-gray-500 text-sm font-medium"
                >
                  {hour.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>

            {/* Days Columns */}
            {days.map((day, i) => (
              <div key={i} className="flex flex-col">
                {/* Day Header */}
                <div className="h-12 border-r border-b p-2">
                  <div className="text-center">
                    <div className="text-sm font-medium">
                      {format(day, "EEE d/M")}
                    </div>
                  </div>
                </div>
                
                {/* All-day Events Row */}
                <div className={cn(
                  "border-r border-b h-12 relative",
                  isToday(day) && "bg-yellow-50"
                )}>
                  {visibleEvents
                    .filter(event => 
                      isSameDay(new Date(event.start), day) &&
                      (new Date(event.start).getHours() === 0 || new Date(event.end).getHours() === 23)
                    )
                    .map(event => (
                      <div
                        key={event.id}
                        className={cn(
                          "absolute inset-x-0 mx-0.5 rounded text-white text-xs p-1 overflow-hidden cursor-pointer",
                          getPriorityColor(event.priority)
                        )}
                        style={{
                          top: "2px",
                          height: "calc(100% - 4px)"
                        }}
                        onClick={() => handleEventClick(event)}
                      >
                        {event.title}
                      </div>
                    ))}
                </div>

                {/* Time Slots */}
                {HOURS.map(hour => (
                  <TimeSlot 
                    key={hour} 
                    hour={hour} 
                    day={day} 
                    events={visibleEvents}
                    onEventClick={handleEventClick}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {view === "day" && (
          <div className="flex-1 grid grid-cols-1">
            {/* Time column - single day view */}
            <div className="grid grid-cols-[60px_1fr]">
              {/* Time labels */}
              <div className="border-r">
                <div className="h-12 border-b text-right pr-2 text-gray-500 text-sm font-medium">
                  all-day
                </div>
                {HOURS.map(hour => (
                  <div 
                    key={hour} 
                    className="h-12 border-b text-right pr-2 text-gray-500 text-sm font-medium"
                  >
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                ))}
              </div>

              {/* Day column */}
              <div className="flex flex-col">
                {/* Day header */}
                <div className="h-12 border-b p-2 text-center font-medium">
                  {format(currentDate, "EEEE, MMMM d")}
                </div>
                
                {/* All-day events */}
                <div className={cn(
                  "border-b h-12 relative",
                  isToday(currentDate) && "bg-yellow-50"
                )}>
                  {visibleEvents
                    .filter(event => 
                      new Date(event.start).getHours() === 0 || new Date(event.end).getHours() === 23
                    )
                    .map(event => (
                      <div
                        key={event.id}
                        className={cn(
                          "absolute inset-x-0 mx-0.5 rounded text-white text-xs p-1 overflow-hidden cursor-pointer",
                          getPriorityColor(event.priority)
                        )}
                        style={{
                          top: "2px",
                          height: "calc(100% - 4px)"
                        }}
                        onClick={() => handleEventClick(event)}
                      >
                        {event.title}
                      </div>
                    ))}
                </div>

                {/* Time slots */}
                {HOURS.map(hour => (
                  <div 
                    key={hour}
                    className={cn(
                      "border-b h-12 relative",
                      isToday(currentDate) && "bg-yellow-50"
                    )}
                  >
                    {visibleEvents
                      .filter(event => new Date(event.start).getHours() === hour)
                      .map(event => (
                        <div 
                          key={event.id}
                          className={cn(
                            "absolute inset-x-0 mx-0.5 rounded text-white text-xs p-1 overflow-hidden cursor-pointer",
                            getPriorityColor(event.priority)
                          )}
                          style={{
                            top: "2px",
                            height: "calc(100% - 4px)"
                          }}
                          onClick={() => handleEventClick(event)}
                        >
                          {event.title}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Event Form Dialog */}
      <CalendarEventForm
        open={eventFormOpen}
        onOpenChange={setEventFormOpen}
        onSave={handleSaveEvent}
        initialEvent={selectedEvent || undefined}
      />
    </div>
  );
} 