"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface StudySession {
  id: string
  date: string // Changed from Date to string for ISO format
  subject: string
  duration: number // in milliseconds
  focusScore: number
  technique: string
  completed: boolean
  notes?: string
  startTime: string // Added for ISO format start time
  endTime?: string // Added for ISO format end time (optional)
}

interface StudySessionState {
  sessions: StudySession[]
  currentSession: {
    isActive: boolean
    startTime: string | null // Changed from Date to string
    subject: string
    technique: string
    targetDuration: number
    elapsedTime: number
    pausedAt: string | null // Changed from Date to string
  }
  // Actions
  addSession: (session: Omit<StudySession, 'id'>) => void
  updateSession: (id: string, updates: Partial<Omit<StudySession, 'id'>>) => void
  deleteSession: (id: string) => void
  startSession: (subject: string, technique: string, targetDuration: number) => void
  pauseSession: () => void
  resumeSession: () => void
  endSession: (focusScore: number, notes?: string) => string | null
  resetCurrentSession: () => void
}

// Helper to safely convert date string to Date object
const safelyParseDate = (dateString: string | Date | null): Date => {
  if (dateString === null) return new Date();
  if (dateString instanceof Date) return dateString;
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date() : date;
  } catch (e) {
    return new Date();
  }
};

export const useStudySessionStore = create<StudySessionState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSession: {
        isActive: false,
        startTime: null,
        subject: '',
        technique: '',
        targetDuration: 0,
        elapsedTime: 0,
        pausedAt: null
      },
      
      addSession: (sessionData) => set((state) => {
        const id = `session_${Date.now()}_${Math.floor(Math.random() * 1000)}`
        // Ensure the session has all required fields
        const newSession: StudySession = { 
          id, 
          ...sessionData,
          // Provide defaults for required fields if they're missing
          date: sessionData.date || new Date().toISOString().split('T')[0],
          startTime: sessionData.startTime || new Date().toISOString(),
          focusScore: sessionData.focusScore !== undefined ? sessionData.focusScore : 80,
          completed: sessionData.completed !== undefined ? sessionData.completed : false
        }
        return { sessions: [...state.sessions, newSession] }
      }),
      
      updateSession: (id, updates) => set((state) => ({
        sessions: state.sessions.map(session => 
          session.id === id ? { ...session, ...updates } : session
        )
      })),
      
      deleteSession: (id) => set((state) => ({
        sessions: state.sessions.filter(session => session.id !== id)
      })),
      
      startSession: (subject, technique, targetDuration) => set({
        currentSession: {
          isActive: true,
          startTime: new Date().toISOString(), // Store as ISO string
          subject,
          technique,
          targetDuration,
          elapsedTime: 0,
          pausedAt: null
        }
      }),
      
      pauseSession: () => set((state) => ({
        currentSession: {
          ...state.currentSession,
          isActive: false,
          pausedAt: new Date().toISOString() // Store as ISO string
        }
      })),
      
      resumeSession: () => set((state) => ({
        currentSession: {
          ...state.currentSession,
          isActive: true,
          pausedAt: null
        }
      })),
      
      endSession: (focusScore, notes) => {
        const { currentSession } = get()
        
        if (!currentSession.startTime) {
          return null
        }
        
        const endTime = new Date()
        // Convert ISO string to Date object
        const sessionStartTime = safelyParseDate(currentSession.startTime)
        
        let calculatedDuration = 0
        
        // Calculate duration based on whether the session is active or paused
        if (currentSession.isActive) {
          // For active sessions, duration is from start time to now
          calculatedDuration = endTime.getTime() - sessionStartTime.getTime()
        } else if (currentSession.pausedAt) {
          // For paused sessions, use the elapsed time up to the pause point
          const pauseTime = safelyParseDate(currentSession.pausedAt)
          calculatedDuration = pauseTime.getTime() - sessionStartTime.getTime()
        } else {
          // Fallback: use estimated duration from current session's elapsed time
          calculatedDuration = currentSession.elapsedTime || 0
        }
        
        // Ensure we have a positive duration
        calculatedDuration = Math.max(0, calculatedDuration)
        
        const sessionData: Omit<StudySession, 'id'> = {
          date: sessionStartTime.toISOString().split('T')[0], // Store date as ISO date string
          subject: currentSession.subject,
          technique: currentSession.technique,
          duration: calculatedDuration,
          focusScore,
          completed: true,
          notes,
          startTime: currentSession.startTime,
          endTime: endTime.toISOString() // Store end time as ISO string
        }
        
        const id = `session_${Date.now()}_${Math.floor(Math.random() * 1000)}`
        set((state) => ({
          sessions: [...state.sessions, { id, ...sessionData }],
          currentSession: {
            isActive: false,
            startTime: null,
            subject: '',
            technique: '',
            targetDuration: 0,
            elapsedTime: 0,
            pausedAt: null
          }
        }))
        
        return id
      },
      
      resetCurrentSession: () => set({
        currentSession: {
          isActive: false,
          startTime: null,
          subject: '',
          technique: '',
          targetDuration: 0,
          elapsedTime: 0,
          pausedAt: null
        }
      })
    }),
    {
      name: 'study-sessions',
    }
  )
) 