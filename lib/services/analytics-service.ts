"use client";

import { StudyTimeData } from "@/components/analytics/study-time-chart";
import { SubjectData } from "@/components/analytics/subject-pie-chart";
import { TaskCategory } from "@/components/analytics/task-breakdown-chart";
import { ProgressData } from "@/components/analytics/progress-chart";
import { Recommendation } from "@/components/analytics/recommendations";
import { Clock, TrendingUp } from "lucide-react";

// Sample Data (this would be replaced with actual API calls to a backend)
export const weeklyData: StudyTimeData[] = [
  { day: "Mon", hours: 3.5, focus: 75 },
  { day: "Tue", hours: 4.2, focus: 82 },
  { day: "Wed", hours: 2.0, focus: 65 },
  { day: "Thu", hours: 5.0, focus: 85 },
  { day: "Fri", hours: 3.8, focus: 80 },
  { day: "Sat", hours: 1.5, focus: 70 },
  { day: "Sun", hours: 2.5, focus: 78 },
];

export const prevWeeklyData: StudyTimeData[] = [
  { day: "Mon", hours: 2.8, focus: 70 },
  { day: "Tue", hours: 3.5, focus: 75 },
  { day: "Wed", hours: 3.0, focus: 68 },
  { day: "Thu", hours: 4.2, focus: 80 },
  { day: "Fri", hours: 2.5, focus: 72 },
  { day: "Sat", hours: 2.0, focus: 65 },
  { day: "Sun", hours: 1.6, focus: 60 },
];

export const subjectData: SubjectData[] = [
  { name: "Physics", hours: 8.5, progress: 78, color: "bg-blue-500" },
  { name: "Computer Science", hours: 7.2, progress: 65, color: "bg-green-500" },
  { name: "Mathematics", hours: 6.5, progress: 72, color: "bg-amber-500" },
  { name: "Literature", hours: 4.0, progress: 85, color: "bg-purple-500" },
  { name: "Biology", hours: 3.8, progress: 60, color: "bg-rose-500" },
];

export const taskCategories: TaskCategory[] = [
  {
    name: "Physics",
    color: "bg-blue-500",
    tasks: [
      { name: "Thermodynamics Review", hours: 3.5, completed: true },
      { name: "Mechanics Problem Set", hours: 2.0, completed: true },
      { name: "Electromagnetism Readings", hours: 3.0, completed: false },
    ],
  },
  {
    name: "Computer Science",
    color: "bg-green-500",
    tasks: [
      { name: "Algorithm Analysis", hours: 2.5, completed: true },
      { name: "Database Project", hours: 3.0, completed: true },
      { name: "Web Development", hours: 1.7, completed: false },
    ],
  },
  {
    name: "Mathematics",
    color: "bg-amber-500",
    tasks: [
      { name: "Calculus Problems", hours: 2.0, completed: true },
      { name: "Linear Algebra", hours: 2.5, completed: true },
      { name: "Statistics Exercise", hours: 2.0, completed: false },
    ],
  },
  {
    name: "Literature",
    color: "bg-purple-500",
    tasks: [
      { name: "Essay Preparation", hours: 2.0, completed: true },
      { name: "Novel Analysis", hours: 2.0, completed: false },
    ],
  },
  {
    name: "Biology",
    color: "bg-rose-500",
    tasks: [
      { name: "Cell Structure Notes", hours: 1.8, completed: true },
      { name: "Genetics Study", hours: 2.0, completed: false },
    ],
  },
];

export const progressData: ProgressData[] = [
  { date: "Jan 5", studyHours: 2.5, grade: 72, performance: 65 },
  { date: "Jan 12", studyHours: 3.0, grade: 75, performance: 68 },
  { date: "Jan 19", studyHours: 2.8, grade: 73, performance: 70 },
  { date: "Jan 26", studyHours: 3.5, grade: 78, performance: 72 },
  { date: "Feb 2", studyHours: 4.0, grade: 80, performance: 75 },
  { date: "Feb 9", studyHours: 3.7, grade: 79, performance: 76 },
  { date: "Feb 16", studyHours: 4.5, grade: 83, performance: 80 },
  { date: "Feb 23", studyHours: 5.0, grade: 85, performance: 82 },
  { date: "Mar 2", studyHours: 4.8, grade: 84, performance: 81 },
  { date: "Mar 9", studyHours: 5.2, grade: 88, performance: 85 },
  { date: "Mar 16", studyHours: 5.5, grade: 90, performance: 87 },
  { date: "Mar 23", studyHours: 5.0, grade: 89, performance: 86 },
];

export const customRecommendations: Recommendation[] = [
  {
    id: "1",
    title: "Best Focus Time",
    description: "You achieve your highest focus scores between 9am-11am",
    action: "Schedule important study sessions in the morning",
    icon: Clock,
    priority: "medium",
  },
  {
    id: "2",
    title: "Subject Improvement",
    description: "Your Physics performance has improved by 15% this month",
    action: "Continue with your current study approach",
    icon: TrendingUp,
    priority: "low",
  },
];

// Analytics Interface
export interface AnalyticsData {
  weeklyData: StudyTimeData[];
  prevWeeklyData: StudyTimeData[];
  subjectData: SubjectData[];
  taskCategories: TaskCategory[];
  progressData: ProgressData[];
  recommendations: Recommendation[];
  studyStats: {
    totalHours: number;
    averageFocus: number;
    currentStreak: number;
    bestStreak: number;
    completedSessions: number;
  };
}

// Local Storage Keys
const ANALYTICS_DATA_KEY = 'atena_analytics_data';

// Get analytics data with persistence
export function getAnalyticsData(): AnalyticsData {
  // Try to get data from localStorage in client-side environments
  if (typeof window !== 'undefined') {
    try {
      const savedData = localStorage.getItem(ANALYTICS_DATA_KEY);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Error loading analytics data from localStorage:', error);
    }
  }

  // Calculate derived statistics
  const totalHours = weeklyData.reduce((sum, day) => sum + day.hours, 0);
  const averageFocus = Math.round(
    weeklyData.reduce((sum, day) => sum + (day.focus || 0), 0) / weeklyData.length
  );

  // Default data if no saved data exists
  return {
    weeklyData,
    prevWeeklyData,
    subjectData,
    taskCategories,
    progressData,
    recommendations: customRecommendations,
    studyStats: {
      totalHours,
      averageFocus,
      currentStreak: 5,
      bestStreak: 8,
      completedSessions: 18,
    }
  };
}

// Update the analytics data
export function updateAnalyticsData(newData: Partial<AnalyticsData>): AnalyticsData {
  const currentData = getAnalyticsData();
  const updatedData = { ...currentData, ...newData };
  
  // Save to localStorage in client-side environments
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ANALYTICS_DATA_KEY, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error saving analytics data to localStorage:', error);
    }
  }
  
  return updatedData;
}

// Add a new study session
export function addStudySession(
  duration: number, 
  focusScore: number, 
  subject: string,
  date = new Date()
): AnalyticsData {
  const currentData = getAnalyticsData();
  
  // Update weekly data for the appropriate day
  const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1; // Convert to 0-6 (Mon-Sun)
  const updatedWeeklyData = [...currentData.weeklyData];
  updatedWeeklyData[dayIndex].hours += duration;
  
  // Recalculate focus score as weighted average
  const oldHours = updatedWeeklyData[dayIndex].hours - duration;
  const oldFocusScore = updatedWeeklyData[dayIndex].focus || 0;
  const newFocusScore = oldHours > 0
    ? Math.round(((oldHours * oldFocusScore) + (duration * focusScore)) / updatedWeeklyData[dayIndex].hours)
    : focusScore;
  updatedWeeklyData[dayIndex].focus = newFocusScore;
  
  // Update subject data
  const updatedSubjectData = [...currentData.subjectData];
  const subjectIndex = updatedSubjectData.findIndex(s => s.name === subject);
  if (subjectIndex >= 0) {
    updatedSubjectData[subjectIndex].hours += duration;
    // Update progress based on focus score (simplified for demo)
    const progressIncrement = (focusScore / 100) * 5; // Max 5% improvement per session
    updatedSubjectData[subjectIndex].progress = Math.min(
      100, 
      Math.round(updatedSubjectData[subjectIndex].progress + progressIncrement)
    );
  }
  
  // Update progress data
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const existingDateIndex = currentData.progressData.findIndex(p => p.date === dateStr);
  let updatedProgressData = [...currentData.progressData];
  
  if (existingDateIndex >= 0) {
    // Update existing entry
    updatedProgressData[existingDateIndex] = {
      ...updatedProgressData[existingDateIndex],
      studyHours: updatedProgressData[existingDateIndex].studyHours + duration,
      performance: Math.min(100, Math.round(
        (updatedProgressData[existingDateIndex].performance || 0) + (focusScore / 20)
      ))
    };
  } else {
    // Add new entry
    // Get last grade and performance for continuity
    const lastEntry = updatedProgressData[updatedProgressData.length - 1];
    updatedProgressData.push({
      date: dateStr,
      studyHours: duration,
      grade: lastEntry?.grade || 75,
      performance: Math.min(100, Math.round((lastEntry?.performance || 70) + (focusScore / 20)))
    });
    
    // Keep only the last 12 entries
    if (updatedProgressData.length > 12) {
      updatedProgressData = updatedProgressData.slice(-12);
    }
  }
  
  // Update study stats
  const updatedStats = {
    ...currentData.studyStats,
    totalHours: currentData.studyStats.totalHours + duration,
    averageFocus: Math.round(
      updatedWeeklyData.reduce((sum, day) => sum + (day.focus || 0), 0) / updatedWeeklyData.length
    ),
    completedSessions: currentData.studyStats.completedSessions + 1
  };
  
  return updateAnalyticsData({
    weeklyData: updatedWeeklyData,
    subjectData: updatedSubjectData,
    progressData: updatedProgressData,
    studyStats: updatedStats
  });
}

// Complete a task
export function completeTask(categoryName: string, taskName: string): AnalyticsData {
  const currentData = getAnalyticsData();
  
  const updatedTaskCategories = currentData.taskCategories.map(category => {
    if (category.name === categoryName) {
      const updatedTasks = category.tasks.map(task => {
        if (task.name === taskName) {
          return { ...task, completed: true };
        }
        return task;
      });
      return { ...category, tasks: updatedTasks };
    }
    return category;
  });
  
  return updateAnalyticsData({
    taskCategories: updatedTaskCategories
  });
}

// Reset analytics data (for testing)
export function resetAnalyticsData(): AnalyticsData {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ANALYTICS_DATA_KEY);
  }
  
  return getAnalyticsData();
} 