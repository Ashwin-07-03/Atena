"use client";

import { v4 as uuidv4 } from "uuid";

export enum EventPriority {
  LESS_IMPORTANT = "less-important",
  IMPORTANT = "important",
  MANDATORY = "mandatory"
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  priority: EventPriority;
  description?: string;
  location?: string;
}

const STORAGE_KEY = "atena-calendar-events";

export const CalendarService = {
  // Get all events
  getEvents: (): CalendarEvent[] => {
    if (typeof window === "undefined") return [];
    
    const storedEvents = localStorage.getItem(STORAGE_KEY);
    if (!storedEvents) return [];
    
    try {
      // Parse the JSON string and convert string dates back to Date objects
      return JSON.parse(storedEvents, (key, value) => {
        if (key === "start" || key === "end") {
          return new Date(value);
        }
        return value;
      });
    } catch (error) {
      console.error("Error parsing calendar events:", error);
      return [];
    }
  },
  
  // Add a new event
  addEvent: (event: Omit<CalendarEvent, "id">): CalendarEvent => {
    const newEvent = {
      ...event,
      id: uuidv4(),
    };
    
    const events = CalendarService.getEvents();
    events.push(newEvent);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    return newEvent;
  },
  
  // Update an existing event
  updateEvent: (updatedEvent: CalendarEvent): boolean => {
    const events = CalendarService.getEvents();
    const index = events.findIndex(e => e.id === updatedEvent.id);
    
    if (index === -1) return false;
    
    events[index] = updatedEvent;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    return true;
  },
  
  // Delete an event
  deleteEvent: (id: string): boolean => {
    const events = CalendarService.getEvents();
    const filteredEvents = events.filter(e => e.id !== id);
    
    if (filteredEvents.length === events.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEvents));
    return true;
  },
  
  // Clear all events (mainly for testing)
  clearEvents: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  }
}; 