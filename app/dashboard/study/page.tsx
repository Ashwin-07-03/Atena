"use client";

import { useState, useEffect, useRef } from 'react';
import { Clock, BarChart3, Brain, Plus, Calendar, BookOpen, CheckCircle, RotateCcw, Play, Settings, MoreHorizontal, Pause } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate, formatTimeAgo, formatDuration } from '@/lib/utils';
import { PomodoroTimer } from '@/components/dashboard/pomodoro-timer';
import { useStudySessionStore } from '@/lib/services/study-session-service';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// Define study techniques without IDs for easier use
const studyTechniques = [
  {
    name: 'Pomodoro',
    description: '25-minute focused work sessions with 5-minute breaks',
    bestFor: 'Maintaining focus and avoiding burnout',
    icon: Clock
  },
  {
    name: 'Flow State',
    description: 'Deep concentration with minimal distractions',
    bestFor: 'Complex problem-solving and creative work',
    icon: Brain
  },
  {
    name: 'Time Blocking',
    description: 'Dedicating specific time blocks to different subjects',
    bestFor: 'Structured study plans and diverse topics',
    icon: Calendar
  },
  {
    name: 'Feynman Technique',
    description: 'Explaining concepts in simple terms to identify knowledge gaps',
    bestFor: 'Deep understanding of complex topics',
    icon: BookOpen
  }
];

// Add a custom hook for timer functionality
function useTimer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [pausedTime, setPausedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const startTimer = () => {
    if (intervalRef.current !== null) return;
    
    setIsRunning(true);
    startTimeRef.current = Date.now() - pausedTime;
    
    intervalRef.current = setInterval(() => {
      setTime(Date.now() - (startTimeRef.current || Date.now()));
    }, 100);
  };

  const pauseTimer = () => {
    if (intervalRef.current === null) return;
    
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setPausedTime(time);
    setIsRunning(false);
  };

  const resetTimer = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTime(0);
    setPausedTime(0);
    startTimeRef.current = null;
    setIsRunning(false);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { time, isRunning, startTimer, pauseTimer, resetTimer };
}

export default function StudySessionsPage() {
  const { sessions, currentSession, startSession, pauseSession, resumeSession, endSession, resetCurrentSession } = useStudySessionStore();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [focusScore, setFocusScore] = useState(80);
  const [isCompletingSession, setIsCompletingSession] = useState(false);
  const [subject, setSubject] = useState("Mathematics");
  const [technique, setTechnique] = useState("Pomodoro");
  const [sessionNotes, setSessionNotes] = useState("");
  
  // Use the timer hook
  const { time: elapsedTime, isRunning, startTimer, pauseTimer, resetTimer } = useTimer();
  
  // Format elapsed time for display (HH:MM:SS)
  const formatElapsedTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };
  
  // Handle timer based on current session state (use a deep comparison)
  useEffect(() => {
    if (currentSession.isActive && !isRunning) {
      startTimer();
    } else if (!currentSession.isActive && currentSession.pausedAt && isRunning) {
      pauseTimer();
    } else if (!currentSession.startTime) {
      resetTimer();
    }
  }, [currentSession.isActive, currentSession.pausedAt, currentSession.startTime, isRunning, startTimer, pauseTimer, resetTimer]);

  // Calculate statistics with error handling
  const safelyParseDate = (dateString: string | Date | null): Date | null => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      return !isNaN(date.getTime()) ? date : null;
    } catch (e) {
      return null;
    }
  };
  
  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };
  
  const getYesterdayDateString = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };
  
  const todaysSessions = sessions.filter(session => session.date === getTodayDateString() && session.completed);
  const todaysDuration = todaysSessions.reduce((total, session) => 
    total + (typeof session.duration === 'number' ? session.duration : 0), 0);
  
  const yesterdaySessions = sessions.filter(session => session.date === getYesterdayDateString() && session.completed);
  const yesterdayDuration = yesterdaySessions.reduce((total, session) => 
    total + (typeof session.duration === 'number' ? session.duration : 0), 0);
    
  // Weekly statistics
  const weekSessions = sessions.filter(session => {
    if (!session.completed) return false;
    const sessionDate = safelyParseDate(session.date);
    if (!sessionDate) return false;
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return sessionDate >= oneWeekAgo;
  });
  
  const weekDuration = weekSessions.reduce((total, session) => 
    total + (typeof session.duration === 'number' ? session.duration : 0), 0);
  const weekGoal = 20 * 60 * 60 * 1000; // 20 hours in milliseconds
  const weekProgress = Math.min(100, Math.round((weekDuration / weekGoal) * 100));
  
  // Focus score statistics
  const averageFocusScore = sessions.filter(s => s.completed).length > 0
    ? Math.round(sessions.filter(s => s.completed).reduce((total, session) => total + (session.focusScore || 0), 0) / sessions.filter(s => s.completed).length)
    : 0;
  
  const lastWeekFocusScore = weekSessions.length > 0
    ? Math.round(weekSessions.reduce((total, session) => total + (session.focusScore || 0), 0) / weekSessions.length)
    : 0;
  
  // Calculate current streak (consecutive days with at least one completed session)
  const calculateStreak = (): number => {
    // Get all distinct dates with completed sessions (without using Set)
    const distinctDates = sessions
      .filter(s => s.completed)
      .map(s => s.date)
      .filter((date, index, array) => array.indexOf(date) === index)
      .sort();
      
    if (distinctDates.length === 0) return 0;
    
    let streak = 1;
    const today = getTodayDateString();
    
    // Check if the most recent session is from today
    if (distinctDates[distinctDates.length - 1] !== today) {
      return 0; // Streak broken if no session today
    }
    
    // Count consecutive days backwards from today
    for (let i = distinctDates.length - 2; i >= 0; i--) {
      const currentDate = safelyParseDate(distinctDates[i]);
      const nextDate = safelyParseDate(distinctDates[i + 1]);
      
      if (!currentDate || !nextDate) continue;
      
      // Check if dates are consecutive
      const diffTime = nextDate.getTime() - currentDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        streak++;
      } else {
        break; // Streak broken
      }
    }
    
    return streak;
  };
  
  const streakDays = calculateStreak();
  
  // Get subject breakdown
  const subjectBreakdown = weekSessions.reduce((acc, session) => {
    if (!acc[session.subject]) {
      acc[session.subject] = 0;
    }
    acc[session.subject] += session.duration;
    return acc;
  }, {} as Record<string, number>);
  
  const subjectBreakdownArray = Object.entries(subjectBreakdown)
    .map(([subject, duration]) => ({ subject, duration }))
    .sort((a, b) => b.duration - a.duration);
  
  const totalSubjectDuration = Object.values(subjectBreakdown).reduce((a, b) => a + b, 0) || 1; // Avoid division by zero
  
  // For display - only show completed sessions
  const recentSessions = [...sessions.filter(s => s.completed)]
    .sort((a, b) => {
      const dateA = safelyParseDate(a.date);
      const dateB = safelyParseDate(b.date);
      if (!dateA || !dateB) return 0;
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);
  
  // Helper function to format duration in hours and minutes
  const formatDuration = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / (3600 * 1000));
    const minutes = Math.floor((milliseconds % (3600 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m`;
  };
  
  // Handle starting a new session
  const handleStartNewSession = () => {
    if (!subject || !technique) {
      toast.error("Please select a subject and technique before starting a session");
      return;
    }

    // Default durations based on technique (in seconds)
    const techniqueDurations: Record<string, number> = {
      "Pomodoro": 25 * 60,
      "Flow State": 60 * 60,
      "Time Blocking": 45 * 60,
      "Feynman Technique": 30 * 60,
    };

    // Reset any existing session
    resetCurrentSession();
    resetTimer();
    
    // Start a new session
    startSession(
      subject,
      technique,
      techniqueDurations[technique] || 25 * 60
    );
    
    // Start timer and show notification
    startTimer();
    toast.success(`Started a new ${technique} session for ${subject}`);
  };
  
  // Handle completing a session
  const handleCompleteSession = () => {
    if (!currentSession.startTime) {
      toast.error("No active session to complete");
      return;
    }
    
    // End the session and save with focus score and notes
    const sessionId = endSession(focusScore, sessionNotes);
    
    if (sessionId) {
      setIsCompletingSession(false);
      resetTimer();
      setSessionNotes("");
      setFocusScore(80);
      toast.success("Study session completed!");
    } else {
      toast.error("Failed to complete session");
    }
  };
  
  // Handle pausing a session
  const handlePauseSession = () => {
    pauseSession();
    pauseTimer();
    toast.info("Session paused");
  };
  
  // Handle resuming a session
  const handleResumeSession = () => {
    resumeSession();
    startTimer();
    toast.info("Session resumed");
  };
  
  // Handle canceling a session
  const handleCancelSession = () => {
    resetCurrentSession();
    resetTimer();
    toast.info("Session canceled");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Study Sessions</h1>
          <p className="text-muted-foreground">
            Track your study time and boost productivity with focused sessions
          </p>
        </div>
        <Button onClick={handleStartNewSession} disabled={currentSession.isActive}>
          <Plus className="mr-2 h-4 w-4" />
          New Study Session
        </Button>
      </div>

      {/* Main content */}
      <Tabs defaultValue="dashboard" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="sessions">Past Sessions</TabsTrigger>
          <TabsTrigger value="techniques">Study Techniques</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          {/* Active session */}
          {currentSession.isActive || currentSession.pausedAt ? (
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{currentSession.isActive ? "Active Study Session" : "Paused Session"}</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {currentSession.technique}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {currentSession.subject} • {currentSession.isActive ? "In Progress" : "Paused"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center mb-6">
                    <div className="text-2xl font-bold">{formatElapsedTime(elapsedTime)}</div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <div className="mb-2 font-medium">Target Duration: {Math.round(currentSession.targetDuration / 60)} minutes</div>
                    <Progress 
                      value={Math.min(100, (elapsedTime / (currentSession.targetDuration * 1000)) * 100)} 
                      className="h-2 w-full max-w-xs mb-4" 
                    />
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                    {currentSession.isActive ? (
                      <Button variant="outline" onClick={handlePauseSession}>
                        <Pause className="mr-2 h-4 w-4" />
                        Pause
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={handleResumeSession}>
                        <Play className="mr-2 h-4 w-4" />
                        Resume
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      onClick={handleCancelSession}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    
                    <Button onClick={() => setIsCompletingSession(true)}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Complete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
          
          {/* Focus Time Widget */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Today</CardTitle>
                <div className="text-2xl font-bold">{formatDuration(todaysDuration)}</div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-xs text-muted-foreground">
                  {todaysDuration > yesterdayDuration 
                    ? `+${formatDuration(todaysDuration - yesterdayDuration)} from yesterday`
                    : yesterdayDuration > todaysDuration 
                      ? `-${formatDuration(yesterdayDuration - todaysDuration)} from yesterday`
                      : 'Same as yesterday'
                  }
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <div className="text-2xl font-bold">{formatDuration(weekDuration)}</div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-xs text-muted-foreground">
                  {weekProgress}% of weekly goal
                </div>
                <Progress value={weekProgress} className="h-1 mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Focus Score</CardTitle>
                <div className="text-2xl font-bold">{averageFocusScore}%</div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-xs text-muted-foreground">
                  {averageFocusScore > lastWeekFocusScore 
                    ? `+${averageFocusScore - lastWeekFocusScore}% from last week`
                    : lastWeekFocusScore > averageFocusScore 
                      ? `-${lastWeekFocusScore - averageFocusScore}% from last week`
                      : 'Same as last week'
                  }
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
                <div className="text-2xl font-bold">{streakDays} days</div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-xs text-muted-foreground">
                  Best: 14 days
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Pomodoro and Summary */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Pomodoro Timer</CardTitle>
                <CardDescription>
                  Boost your productivity with focused study sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  {!currentSession.isActive ? (
                    <div className="space-y-6">
                      <div className="w-48 h-48 rounded-full border-8 border-primary/20 flex items-center justify-center mb-6">
                        <div className="text-4xl font-bold">25:00</div>
                      </div>
                      
                      <div className="space-y-4 w-full max-w-xs mx-auto">
                        {/* Subject selection */}
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Select 
                            value={subject} 
                            onValueChange={setSubject}
                          >
                            <SelectTrigger id="subject">
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Mathematics">Mathematics</SelectItem>
                              <SelectItem value="Physics">Physics</SelectItem>
                              <SelectItem value="Computer Science">Computer Science</SelectItem>
                              <SelectItem value="Biology">Biology</SelectItem>
                              <SelectItem value="Chemistry">Chemistry</SelectItem>
                              <SelectItem value="History">History</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Technique selection */}
                        <div className="space-y-2">
                          <Label htmlFor="technique">Study Technique</Label>
                          <Select 
                            value={technique}
                            onValueChange={setTechnique}
                          >
                            <SelectTrigger id="technique">
                              <SelectValue placeholder="Select technique" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pomodoro">Pomodoro Technique</SelectItem>
                              <SelectItem value="Flow State">Flow State</SelectItem>
                              <SelectItem value="Time Blocking">Time Blocking</SelectItem>
                              <SelectItem value="Feynman Technique">Feynman Technique</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="flex justify-center gap-2 mt-6">
                        <Button size="sm" onClick={handleStartNewSession}>
                          <Play className="h-4 w-4 mr-1" />
                          Start Session
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="text-xl text-primary font-medium">Session in progress</div>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsCompletingSession(true)}
                      >
                        View Active Session
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Subject Breakdown</CardTitle>
                <CardDescription>
                  Your time allocation by subject
                </CardDescription>
              </CardHeader>
              <CardContent>
                {subjectBreakdownArray.length > 0 ? (
                  <div className="space-y-4">
                    {subjectBreakdownArray.map(({ subject, duration }) => (
                      <div key={subject} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{subject}</div>
                          <div className="text-sm text-muted-foreground">{formatDuration(duration)}</div>
                        </div>
                        <Progress value={Math.round((duration / totalSubjectDuration) * 100)} className="h-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No study data available for this week</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  Based on your last 7 days of study
                </div>
              </CardFooter>
            </Card>
          </div>
          
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Study Activity</CardTitle>
              <CardDescription>
                Your study sessions from the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentSessions.length > 0 ? (
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <div className="font-medium">{session.subject}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatTimeAgo(new Date(session.date))} • {formatDuration(session.duration)}
                          </div>
                        </div>
                        <Badge className={session.focusScore >= 80 ? "bg-green-500" : session.focusScore >= 60 ? "bg-yellow-500" : "bg-red-500"}>
                          {session.focusScore}% Focus
                        </Badge>
                      </div>
                      <div className="text-sm mt-1">
                        Technique: {session.technique}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No study sessions recorded yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={handleStartNewSession}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Start Your First Session
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Study Sessions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Past Study Sessions</CardTitle>
              <CardDescription>
                Track your study history and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sessions.length > 0 ? (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{session.subject}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(new Date(session.date), 'PPP')} • {formatDuration(session.duration)} • {session.technique}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={session.focusScore >= 80 ? "bg-green-500" : session.focusScore >= 60 ? "bg-yellow-500" : "bg-red-500"}>
                          {session.focusScore}% Focus
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No study sessions recorded yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={handleStartNewSession}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Start Your First Session
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="outline">Load More</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="techniques">
          <div className="grid gap-4 md:grid-cols-2">
            {studyTechniques.map((technique) => (
              <Card key={technique.name}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {technique.icon && <technique.icon className="h-5 w-5 text-primary" />}
                    </div>
                    <CardTitle className="text-lg">{technique.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{technique.description}</p>
                  <div className="text-sm">
                    <span className="font-semibold">Best for:</span> {technique.bestFor}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      startSession(
                        "Mathematics", 
                        technique.name, 
                        technique.name === "Pomodoro Technique" ? 25 * 60 : 50 * 60
                      );
                      setActiveTab("dashboard");
                    }}
                  >
                    Start Session with {technique.name}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Complete Session Dialog */}
      <Dialog open={isCompletingSession} onOpenChange={setIsCompletingSession}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Complete Study Session</DialogTitle>
            <DialogDescription>
              Rate your focus and add notes about this session.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Focus Score: {focusScore}%</span>
                <span className="text-sm font-medium">
                  {focusScore >= 80 ? "Excellent" : focusScore >= 60 ? "Good" : "Needs improvement"}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={focusScore}
                onChange={(e) => setFocusScore(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Session Notes</Label>
              <textarea
                id="notes"
                placeholder="What did you study? What went well? What could improve?"
                className="w-full min-h-[100px] p-2 border rounded-md"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Session Summary</Label>
              <div className="p-3 bg-muted rounded-md text-sm">
                <div className="flex justify-between mb-1">
                  <span>Subject:</span>
                  <span className="font-semibold">{currentSession.subject}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Technique:</span>
                  <span className="font-semibold">{currentSession.technique}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Duration:</span>
                  <span className="font-semibold">{formatElapsedTime(elapsedTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-semibold">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsCompletingSession(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteSession}>
              Complete Session
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 