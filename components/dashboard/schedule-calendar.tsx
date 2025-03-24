"use client"

import { useState, useEffect, useCallback } from "react"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useToast } from "@/components/ui/use-toast"
import { formatDate } from "@/lib/utils"

interface ScheduleCalendarProps {
  events: any[]
  onEventClick?: (info: any) => void
  onDateSelect?: (info: any) => void
  onEventAdd?: (event: any) => void
  onEventChange?: (event: any) => void
  onEventRemove?: (eventId: string) => void
  compact?: boolean
}

export function ScheduleCalendar({
  events = [],
  onEventClick,
  onDateSelect,
  onEventAdd,
  onEventChange,
  onEventRemove,
  compact = false
}: ScheduleCalendarProps) {
  const { toast } = useToast()
  const [calendarEvents, setCalendarEvents] = useState(events)
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  )
  
  // Update calendar when events prop changes
  useEffect(() => {
    setCalendarEvents(events)
  }, [events])
  
  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Determine view based on screen size and compact prop
  const getInitialView = () => {
    if (compact) return 'dayGridMonth'
    if (windowWidth < 768) return 'dayGridWeek'
    return 'timeGridWeek'
  }
  
  // Determine height based on compact prop
  const calendarHeight = compact ? 'auto' : 600
  
  // Handle event click
  const handleEventClick = useCallback((info: any) => {
    if (onEventClick) {
      onEventClick(info)
    }
  }, [onEventClick])
  
  // Handle date selection
  const handleDateSelect = useCallback((info: any) => {
    if (onDateSelect) {
      onDateSelect(info)
    }
  }, [onDateSelect])
  
  // Handle event changes (drag & drop)
  const handleEventChange = useCallback((info: any) => {
    if (onEventChange) {
      onEventChange({
        id: info.event.id,
        title: info.event.title,
        start: info.event.start,
        end: info.event.end,
        allDay: info.event.allDay,
        extendedProps: info.event.extendedProps
      })
    }
    
    toast({
      title: "Event updated",
      description: `"${info.event.title}" has been rescheduled.`,
    })
  }, [onEventChange, toast])
  
  return (
    <div className={`h-full calendar-container ${compact ? 'compact-calendar' : ''}`}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={getInitialView()}
        headerToolbar={{
          left: compact ? 'prev,next' : 'prev,next today',
          center: 'title',
          right: compact ? 'dayGridMonth' : 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={calendarEvents}
        nowIndicator={true}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={compact ? 2 : true}
        weekends={true}
        eventClick={handleEventClick}
        select={handleDateSelect}
        eventDrop={handleEventChange}
        eventResize={handleEventChange}
        height={calendarHeight}
        stickyHeaderDates={true}
        aspectRatio={compact ? 1.2 : 1.5}
        firstDay={1} // Monday as first day
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: false
        }}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          omitZeroMinute: false,
          meridiem: false,
          hour12: false
        }}
        slotDuration={compact ? '01:00:00' : '00:30:00'}
        slotMinTime="08:00:00"
        slotMaxTime="22:00:00"
        views={{
          dayGrid: {
            dayMaxEventRows: compact ? 2 : 4
          },
          timeGrid: {
            dayMaxEventRows: compact ? 2 : 6
          }
        }}
      />
    </div>
  )
} 