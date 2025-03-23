'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

// Types
export interface PomodoroContext {
  time_of_day: number;
  day_of_week: number;
  subject: string;
  difficulty: number;
  energy_level: number;
  focus_score?: number;
}

export interface PomodoroRecommendation {
  pomodoro_minutes: number;
  break_minutes: number;
  long_break_minutes: number;
  sessions_until_long_break: number;
  confidence: number;
}

export interface PomodoroFeedback extends PomodoroContext {
  session_length: number;
  break_length: number;
  effectiveness: number;
}

export interface PomodoroResponse {
  recommendation: PomodoroRecommendation;
  user_context?: PomodoroContext;
  success?: boolean;
}

// Default fallback values if ML service is unavailable
const DEFAULT_RECOMMENDATION: PomodoroRecommendation = {
  pomodoro_minutes: 25,
  break_minutes: 5,
  long_break_minutes: 15,
  sessions_until_long_break: 4,
  confidence: 0.5,
};

/**
 * Hook for interacting with Pomodoro ML service
 */
export function usePomodoroAI() {
  const [isServiceAvailable, setIsServiceAvailable] = useState<boolean>(true);

  // Health check query
  const healthCheck = useQuery({
    queryKey: ['pomodoro', 'health'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/ml/pomodoro');
        const data = await response.json();
        setIsServiceAvailable(data.status === 'healthy');
        return data;
      } catch (error) {
        console.error('Error checking ML service health:', error);
        setIsServiceAvailable(false);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Get recommendations mutation
  const getRecommendation = useMutation({
    mutationFn: async (context: PomodoroContext): Promise<PomodoroResponse> => {
      if (!isServiceAvailable) {
        console.warn('ML service unavailable, using default recommendation');
        return { 
          success: true, 
          recommendation: DEFAULT_RECOMMENDATION,
          user_context: context
        };
      }
      
      try {
        const response = await fetch('/api/ml/pomodoro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            operation: 'recommend',
            context
          }),
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error getting recommendation:', error);
        // Return default values on error
        return { 
          success: true, 
          recommendation: DEFAULT_RECOMMENDATION,
          user_context: context
        };
      }
    }
  });

  // Submit feedback mutation
  const submitFeedback = useMutation({
    mutationFn: async (feedback: PomodoroFeedback) => {
      if (!isServiceAvailable) {
        console.warn('ML service unavailable, feedback not submitted');
        return { status: 'error', message: 'ML service unavailable' };
      }

      const response = await fetch('/api/ml/pomodoro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'feedback',
          ...feedback,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      return response.json();
    },
  });

  // Helper function to create current context from user state
  const getCurrentContext = (
    subject: string,
    difficulty: number,
    energy_level: number,
    focus_score?: number
  ): PomodoroContext => {
    const now = new Date();
    return {
      time_of_day: now.getHours(),
      day_of_week: now.getDay(),
      subject,
      difficulty,
      energy_level,
      focus_score,
    };
  };

  // Convert standard time (minutes) to customized pomodoro settings
  const applyUserPreferences = (
    recommendation: PomodoroRecommendation,
    userSpeedFactor: number = 1.0
  ): PomodoroRecommendation => {
    // userSpeedFactor: 0.8 for slower pace, 1.2 for faster pace
    if (userSpeedFactor === 1.0) return recommendation;

    return {
      ...recommendation,
      pomodoro_minutes: Math.round(recommendation.pomodoro_minutes * userSpeedFactor),
      break_minutes: Math.round(recommendation.break_minutes * userSpeedFactor),
      long_break_minutes: Math.round(recommendation.long_break_minutes * userSpeedFactor),
    };
  };

  return {
    isServiceAvailable,
    isLoading: healthCheck.isLoading,
    healthCheck,
    getRecommendation,
    submitFeedback,
    getCurrentContext,
    applyUserPreferences,
  };
} 