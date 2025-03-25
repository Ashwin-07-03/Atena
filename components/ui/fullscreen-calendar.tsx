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
} from "date-fns"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  SearchIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useMediaQuery } from "@/hooks/use-media-query"

// Added event priority for color coding
export enum EventPriority {
  LESS_IMPORTANT = "less-important",
  IMPORTANT = "important",
  MANDATORY = "mandatory"
}

interface Event {
  id: number
  name: string
  time: string
  datetime: string
  priority: EventPriority // Added priority field
}

interface CalendarData {
  day: Date
  events: Event[]
}

interface FullScreenCalendarProps {
  data: CalendarData[]
  onAddEvent?: () => void
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

export function FullScreenCalendar({ data, onAddEvent }: FullScreenCalendarProps) {
  const today = startOfToday()
  const [selectedDay, setSelectedDay] = React.useState(today)
  const [currentMonth, setCurrentMonth] = React.useState(
    format(today, "MMM-yyyy"),
  )
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date())
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth, { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth), { weekStartsOn: 0 }),
  })

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function goToToday() {
    setCurrentMonth(format(today, "MMM-yyyy"))
    setSelectedDay(today)
  }

  // Get all event dates for the current month for quick checking
  const eventDates = React.useMemo(() => {
    const dates = new Map()
    data.forEach(item => {
      if (isSameMonth(item.day, firstDayCurrentMonth)) {
        dates.set(format(item.day, 'yyyy-MM-dd'), 
          item.events.reduce((acc, event) => {
            acc[event.priority] = (acc[event.priority] || 0) + 1
            return acc
          }, {} as Record<EventPriority, number>)
        )
      }
    })
    return dates
  }, [data, firstDayCurrentMonth])

  // Function to get dot display classes
  const getEventDisplay = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd')
    const eventData = eventDates.get(dateKey)
    
    if (!eventData) return null
    
    // Determine which priority colors to show
    const hasLessImportant = eventData[EventPriority.LESS_IMPORTANT] > 0
    const hasImportant = eventData[EventPriority.IMPORTANT] > 0
    const hasMandatory = eventData[EventPriority.MANDATORY] > 0
    
    return (
      <div className="flex justify-center mt-1 gap-1">
        {hasLessImportant && <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>}
        {hasImportant && <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>}
        {hasMandatory && <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>}
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
      {/* Calendar Header - simplified to match the image */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          {/* Date display on left side */}
          <div className="flex flex-col items-center justify-center rounded-lg border bg-muted p-1 md:w-20">
            <h1 className="p-1 text-xs uppercase text-muted-foreground">
              {format(today, "MMM")}
            </h1>
            <div className="flex w-full items-center justify-center rounded-lg font-bold text-xl">
              <span>{format(today, "d")}</span>
            </div>
          </div>
          
          {/* Month and date range */}
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-foreground">
              {format(firstDayCurrentMonth, "MMMM, yyyy")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {format(firstDayCurrentMonth, "MMM d, yyyy")} -{" "}
              {format(endOfMonth(firstDayCurrentMonth), "MMM d, yyyy")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Navigation controls */}
          <div className="flex rounded-lg border overflow-hidden">
            <Button
              onClick={previousMonth}
              className="rounded-none border-0 hover:bg-muted"
              variant="ghost"
              size="sm"
            >
              <ChevronLeftIcon size={16} />
            </Button>
            <Button
              onClick={goToToday}
              className="rounded-none border-x border-0 hover:bg-muted px-4"
              variant="ghost"
            >
              Today
            </Button>
            <Button
              onClick={nextMonth}
              className="rounded-none border-0 hover:bg-muted"
              variant="ghost"
              size="sm"
            >
              <ChevronRightIcon size={16} />
            </Button>
          </div>

          {/* New Event button */}
          <Button 
            className="gap-2"
            variant="default"
            onClick={onAddEvent}
          >
            <PlusCircleIcon size={16} strokeWidth={2} />
            <span>New Event</span>
          </Button>
        </div>
      </div>

      {/* Legend - kept from original design */}
      <div className="flex justify-end px-4 gap-4 text-xs py-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Less Important</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Important</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Mandatory</span>
        </div>
      </div>

      {/* Calendar Grid - simplified to match the image */}
      <div className="flex-grow">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 text-center text-sm font-medium">
          <div className="py-2 border-b">Sun</div>
          <div className="py-2 border-b">Mon</div>
          <div className="py-2 border-b">Tue</div>
          <div className="py-2 border-b">Wed</div>
          <div className="py-2 border-b">Thu</div>
          <div className="py-2 border-b">Fri</div>
          <div className="py-2 border-b">Sat</div>
        </div>

        {/* Calendar Days - simplified to match image */}
        <div className="grid grid-cols-7 auto-rows-fr border-b">
          {days.map((day, dayIdx) => {
            // Determine the styling for the day cell
            const isSelected = isEqual(day, selectedDay);
            const isCurrentMonth = isSameMonth(day, firstDayCurrentMonth);
            const hasDot = eventDates.has(format(day, 'yyyy-MM-dd'));
            
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
                
                {/* Dot indicators for events */}
                {getEventDisplay(day)}
                
                {/* For non-mobile views, show first event if any */}
                {isDesktop && data.some(item => isSameDay(item.day, day)) && (
                  <div className="mt-1 text-xs">
                    {data
                      .filter(item => isSameDay(item.day, day))
                      .slice(0, 1)
                      .map(item => item.events.slice(0, 1).map(event => (
                        <div 
                          key={event.id}
                          className={cn(
                            "p-1 rounded-sm mt-1 truncate",
                            event.priority === EventPriority.LESS_IMPORTANT && "border-l-2 border-green-500 bg-green-50",
                            event.priority === EventPriority.IMPORTANT && "border-l-2 border-blue-500 bg-blue-50",
                            event.priority === EventPriority.MANDATORY && "border-l-2 border-red-500 bg-red-50",
                          )}
                        >
                          {event.name}
                        </div>
                      )))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
} 