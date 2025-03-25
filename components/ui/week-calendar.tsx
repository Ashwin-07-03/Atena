"use client"

import * as React from "react"
import {
  add,
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addDays,
  isSameDay,
  isToday,
} from "date-fns"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Event priority for color coding
export enum EventPriority {
  LESS_IMPORTANT = "less-important",
  IMPORTANT = "important",
  MANDATORY = "mandatory"
}

interface CalendarEvent {
  id: number
  title: string
  start: Date
  end: Date
  priority: EventPriority
}

interface TimeSlotProps {
  hour: number
  day: Date
  events: CalendarEvent[]
}

interface WeekCalendarProps {
  events: CalendarEvent[]
  onAddEvent?: () => void
}

const HOURS = Array.from({ length: 15 }, (_, i) => i + 8); // 8:00 - 22:00

const TimeSlot = ({ hour, day, events }: TimeSlotProps) => {
  const relevantEvents = events.filter(event => {
    const eventHour = event.start.getHours();
    return isSameDay(event.start, day) && eventHour === hour;
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
            "absolute inset-x-0 mx-0.5 rounded text-white text-xs p-1 overflow-hidden",
            event.priority === EventPriority.LESS_IMPORTANT && "bg-green-500",
            event.priority === EventPriority.IMPORTANT && "bg-blue-500",
            event.priority === EventPriority.MANDATORY && "bg-red-500"
          )}
          style={{
            top: "2px",
            height: "calc(100% - 4px)"
          }}
        >
          {event.title}
        </div>
      ))}
    </div>
  );
};

export function WeekCalendar({ events, onAddEvent }: WeekCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [view, setView] = React.useState<"month" | "week" | "day">("week");
  
  // Calculate the start and end of the current week
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
  const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 0 });
  
  // Get all days in the current week
  const daysInWeek = eachDayOfInterval({
    start: startOfCurrentWeek, 
    end: endOfCurrentWeek
  });

  // Navigation functions
  const previousWeek = () => {
    setCurrentDate(prevDate => add(prevDate, { weeks: -1 }));
  };

  const nextWeek = () => {
    setCurrentDate(prevDate => add(prevDate, { weeks: 1 }));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Tab navigation
  const tabItems = [
    { id: "calendar", label: "Calendar" },
    { id: "upcoming", label: "Upcoming" },
    { id: "assignments", label: "Assignments" },
  ];

  // View switchers
  const viewSwitchers = [
    { id: "month", label: "month" },
    { id: "week", label: "week" },
    { id: "day", label: "day" },
  ];

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
              onClick={previousWeek}
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              onClick={nextWeek}
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
            Mar {format(startOfCurrentWeek, "d")} – {format(endOfCurrentWeek, "d")}, {format(currentDate, "yyyy")}
          </h2>

          <div className="flex rounded-md border overflow-hidden">
            {viewSwitchers.map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id as any)}
                className={cn(
                  "px-3 py-1 text-sm",
                  view === item.id
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-800"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Week Calendar Grid */}
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
          {daysInWeek.map((day, i) => (
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
                {events
                  .filter(event => 
                    isSameDay(event.start, day) &&
                    (event.start.getHours() === 0 || event.end.getHours() === 23)
                  )
                  .map(event => (
                    <div
                      key={event.id}
                      className={cn(
                        "absolute inset-x-0 mx-0.5 rounded text-white text-xs p-1 overflow-hidden",
                        event.priority === EventPriority.LESS_IMPORTANT && "bg-green-500",
                        event.priority === EventPriority.IMPORTANT && "bg-blue-500",
                        event.priority === EventPriority.MANDATORY && "bg-red-500"
                      )}
                      style={{
                        top: "2px",
                        height: "calc(100% - 4px)"
                      }}
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
                  events={events} 
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 