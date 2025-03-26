"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Clock, Target, Calendar, TrendingUp, Zap, AlertTriangle, Award } from "lucide-react";
import { SubjectData } from './subject-pie-chart';
import { StudyTimeData } from './study-time-chart';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  action: string;
  icon: React.ElementType;
  priority: 'high' | 'medium' | 'low';
}

interface RecommendationsProps {
  studyData: StudyTimeData[];
  subjectData: SubjectData[];
  customRecommendations?: Recommendation[];
}

export function Recommendations({
  studyData,
  subjectData,
  customRecommendations = []
}: RecommendationsProps) {
  // Generate dynamic recommendations based on the data
  const generateRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    
    // Find subject with lowest progress
    const lowestProgressSubject = [...subjectData].sort((a, b) => a.progress - b.progress)[0];
    if (lowestProgressSubject && lowestProgressSubject.progress < 70) {
      recommendations.push({
        id: 'low-progress',
        title: `Focus on ${lowestProgressSubject.name}`,
        description: `Your progress in ${lowestProgressSubject.name} (${lowestProgressSubject.progress}%) is lower than other subjects.`,
        action: `Allocate 3-5 additional hours this week to improve your understanding.`,
        icon: Target,
        priority: lowestProgressSubject.progress < 60 ? 'high' : 'medium',
      });
    }
    
    // Check for study consistency
    const daysWithNoStudy = studyData.filter(day => day.hours === 0).length;
    if (daysWithNoStudy > 2) {
      recommendations.push({
        id: 'inconsistent-study',
        title: 'Improve Study Consistency',
        description: `You had ${daysWithNoStudy} days without study sessions this week.`,
        action: 'Try to study at least 30 minutes every day to maintain momentum.',
        icon: Calendar,
        priority: daysWithNoStudy > 3 ? 'high' : 'medium',
      });
    }
    
    // Check for focus score
    const avgFocus = studyData.reduce((sum, day) => sum + (day.focus || 0), 0) / studyData.length;
    if (avgFocus < 75) {
      recommendations.push({
        id: 'low-focus',
        title: 'Enhance Focus Quality',
        description: `Your average focus score this week is ${Math.round(avgFocus)}%, which could be improved.`,
        action: 'Try the Pomodoro technique or minimize distractions during study sessions.',
        icon: Brain,
        priority: avgFocus < 65 ? 'high' : 'medium',
      });
    }
    
    // Check for optimal study time
    const morningHours = studyData.slice(0, 3).reduce((sum, day) => sum + day.hours, 0);
    const eveningHours = studyData.slice(4, 7).reduce((sum, day) => sum + day.hours, 0);
    if (morningHours > eveningHours * 1.5) {
      recommendations.push({
        id: 'morning-productivity',
        title: 'Morning Productivity',
        description: 'You seem to be more productive in the morning hours.',
        action: 'Schedule difficult or important study tasks early in the day.',
        icon: Clock,
        priority: 'low',
      });
    }
    
    // Check for subject balance
    const maxHours = Math.max(...subjectData.map(s => s.hours));
    const minHours = Math.min(...subjectData.map(s => s.hours));
    if (maxHours > minHours * 2.5) {
      const neglectedSubject = subjectData.find(s => s.hours === minHours)?.name;
      recommendations.push({
        id: 'subject-balance',
        title: 'Balance Your Studies',
        description: `You're spending significantly more time on some subjects than others.`,
        action: `Try to allocate more time to ${neglectedSubject} to maintain balance.`,
        icon: TrendingUp,
        priority: 'medium',
      });
    }
    
    // Add custom recommendations
    return [...recommendations, ...customRecommendations];
  };

  const allRecommendations = generateRecommendations();
  
  // Sort by priority: high -> medium -> low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedRecommendations = allRecommendations.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Recommendations</CardTitle>
        <CardDescription>Personalized tips to improve your study performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedRecommendations.length > 0 ? (
            sortedRecommendations.map((rec) => (
              <div 
                key={rec.id} 
                className={`p-4 rounded-lg border ${
                  rec.priority === 'high' 
                    ? 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30' 
                    : rec.priority === 'medium'
                    ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/30'
                    : 'border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-900/30'
                }`}
              >
                <div className="flex gap-3">
                  <div className={`
                    flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                    ${
                      rec.priority === 'high' 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' 
                        : rec.priority === 'medium'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    }
                  `}>
                    <rec.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                    <p className={`text-sm mt-2 font-medium ${
                      rec.priority === 'high' 
                        ? 'text-red-700 dark:text-red-400' 
                        : rec.priority === 'medium'
                        ? 'text-amber-700 dark:text-amber-400'
                        : 'text-blue-700 dark:text-blue-400'
                    }`}>
                      Suggestion: {rec.action}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mb-3">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-center">Great job!</h3>
              <p className="text-sm text-muted-foreground text-center mt-1">
                You're doing well with your studies. Keep up the good work!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 