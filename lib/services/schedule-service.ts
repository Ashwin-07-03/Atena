"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ScheduleEvent {
  id: string
  title: string
  start: Date | string // Allow both Date and string types
  end: Date | string
  allDay: boolean
  color?: string
  location?: string
  description?: string
  reminders?: {
    id: string
    time: number // Minutes before event
  }[]
}

interface ScheduleState {
  events: ScheduleEvent[]
  // Actions
  addEvent: (event: Omit<ScheduleEvent, 'id'>) => string
  updateEvent: (id: string, updates: Partial<Omit<ScheduleEvent, 'id'>>) => void
  deleteEvent: (id: string) => void
  getEvents: (start?: Date, end?: Date) => ScheduleEvent[]
}

// Helper function to safely parse dates
const safelyParseDate = (date: Date | string | null | undefined): Date | null => {
  if (!date) return null;
  
  try {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  } catch (e) {
    console.error('Error parsing date:', e);
    return null;
  }
};

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      events: [],
      
      addEvent: (eventData) => {
        const id = `event_${Date.now()}_${Math.floor(Math.random() * 1000)}`
        const newEvent: ScheduleEvent = { id, ...eventData }
        
        set((state) => ({
          events: [...state.events, newEvent]
        }))
        
        return id
      },
      
      updateEvent: (id, updates) => set((state) => ({
        events: state.events.map(event => 
          event.id === id ? { ...event, ...updates } : event
        )
      })),
      
      deleteEvent: (id) => set((state) => ({
        events: state.events.filter(event => event.id !== id)
      })),
      
      getEvents: (start, end) => {
        const { events } = get()
        
        if (!start && !end) {
          return events
        }
        
        return events.filter(event => {
          const eventStart = safelyParseDate(event.start)
          const eventEnd = safelyParseDate(event.end)
          
          if (start && end) {
            // Event overlaps with the date range
            return (
              (eventStart && eventStart >= start && eventStart <= end) || // Event starts in range
              (eventEnd && eventEnd >= start && eventEnd <= end) || // Event ends in range
              (eventStart && eventEnd && eventStart <= start && eventEnd >= end) // Event spans the entire range
            )
          } else if (start) {
            // Event starts on or after the given start date
            return eventStart && eventStart >= start
          } else if (end) {
            // Event ends on or before the given end date
            return eventEnd && eventEnd <= end!
          }
          
          return true
        })
      }
    }),
    {
      name: 'schedule-events',
    }
  )
) 