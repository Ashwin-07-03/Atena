import { Metadata } from "next";
import { BarChart, Clock, Calendar, Brain, TrendingUp, Target, Zap, Award, BookOpen, LineChart, PieChart, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Analytics | Atena",
  description: "Track and analyze your study performance",
};

// Sample data for analytics
const weeklyData = [
  { day: "Mon", hours: 3.5, focus: 75 },
  { day: "Tue", hours: 4.2, focus: 82 },
  { day: "Wed", hours: 2.0, focus: 65 },
  { day: "Thu", hours: 5.0, focus: 85 },
  { day: "Fri", hours: 3.8, focus: 80 },
  { day: "Sat", hours: 1.5, focus: 70 },
  { day: "Sun", hours: 2.5, focus: 78 },
];

const subjectData = [
  { name: "Physics", hours: 8.5, progress: 78, color: "bg-blue-500" },
  { name: "Computer Science", hours: 7.2, progress: 65, color: "bg-green-500" },
  { name: "Mathematics", hours: 6.5, progress: 72, color: "bg-amber-500" },
  { name: "Literature", hours: 4.0, progress: 85, color: "bg-purple-500" },
  { name: "Biology", hours: 3.8, progress: 60, color: "bg-rose-500" },
];

const streakData = [
  { date: "Mar 20", count: 3.5 },
  { date: "Mar 21", count: 4.2 },
  { date: "Mar 22", count: 0 },
  { date: "Mar 23", count: 5.0 },
  { date: "Mar 24", count: 3.8 },
  { date: "Mar 25", count: 1.5 },
  { date: "Mar 26", count: 2.5 },
  { date: "Mar 27", count: 4.0 },
  { date: "Mar 28", count: 3.2 },
  { date: "Mar 29", count: 0 },
  { date: "Mar 30", count: 0 },
  { date: "Mar 31", count: 2.8 },
  { date: "Apr 1", count: 3.5 },
  { date: "Apr 2", count: 4.2 },
];

const insightsData = [
  {
    id: "1",
    title: "Best Focus Time",
    description: "You achieve your highest focus scores between 9am-11am",
    icon: Clock,
    action: "Schedule important study sessions in the morning",
  },
  {
    id: "2",
    title: "Subject Improvement",
    description: "Your Physics performance has improved by 15% this month",
    icon: TrendingUp,
    action: "Continue with your current study approach",
  },
  {
    id: "3",
    title: "Study Consistency",
    description: "You've maintained a 5-day study streak",
    icon: Calendar,
    action: "Keep up the momentum to improve retention",
  },
  {
    id: "4",
    title: "Learning Gap",
    description: "You're behind on Computer Science algorithm topics",
    icon: Target,
    action: "Allocate 3 extra hours this week to catch up",
  },
];

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Analytics</h1>
          <p className="text-muted-foreground">
            Track your study progress and performance insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Study Time</p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-2xl font-bold">22.5</h3>
                  <p className="text-sm text-muted-foreground">hours</p>
                </div>
                <p className="text-xs text-green-500">↑ 15% from last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Focus</p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-2xl font-bold">76%</h3>
                  <p className="text-sm text-muted-foreground">score</p>
                </div>
                <p className="text-xs text-green-500">↑ 5% from last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-2xl font-bold">5</h3>
                  <p className="text-sm text-muted-foreground">days</p>
                </div>
                <p className="text-xs text-green-500">Your best: 8 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sessions Completed</p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-2xl font-bold">18</h3>
                  <p className="text-sm text-muted-foreground">this month</p>
                </div>
                <p className="text-xs text-amber-500">→ On track with your goal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main charts */}
      <Tabs defaultValue="time" className="space-y-4">
        <TabsList>
          <TabsTrigger value="time">Study Time</TabsTrigger>
          <TabsTrigger value="focus">Focus Score</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="streak">Study Streak</TabsTrigger>
        </TabsList>
        
        <TabsContent value="time" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Weekly Study Time</CardTitle>
              <CardDescription>Hours spent studying each day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                {/* This would be a real chart in production */}
                <div className="flex items-end h-64 gap-2 pt-8">
                  {weeklyData.map((day) => (
                    <div key={day.day} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-500 rounded-t-sm"
                        style={{ height: `${(day.hours / 6) * 100}%` }}
                      ></div>
                      <div className="text-xs mt-2">{day.day}</div>
                      <div className="text-xs text-muted-foreground">{day.hours}h</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex items-center justify-between w-full text-sm">
                <div className="text-muted-foreground">
                  Weekly total: <span className="font-medium">22.5 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                    This Week
                  </Badge>
                  <Badge variant="outline">
                    Previous Week
                  </Badge>
                </div>
              </div>
            </CardFooter>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Top Study Periods</CardTitle>
                <CardDescription>
                  When you spend the most time studying
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-8 bg-blue-500 rounded-sm"></div>
                      <div>
                        <p className="font-medium">Morning</p>
                        <p className="text-xs text-muted-foreground">6 AM - 12 PM</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">8.5 hours</p>
                      <p className="text-xs text-muted-foreground">38% of total time</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-8 bg-amber-500 rounded-sm"></div>
                      <div>
                        <p className="font-medium">Afternoon</p>
                        <p className="text-xs text-muted-foreground">12 PM - 6 PM</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">10.2 hours</p>
                      <p className="text-xs text-muted-foreground">45% of total time</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-8 bg-purple-500 rounded-sm"></div>
                      <div>
                        <p className="font-medium">Evening</p>
                        <p className="text-xs text-muted-foreground">6 PM - 12 AM</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">3.8 hours</p>
                      <p className="text-xs text-muted-foreground">17% of total time</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 h-4 bg-muted rounded-full overflow-hidden flex">
                  <div className="h-full bg-blue-500" style={{ width: "38%" }}></div>
                  <div className="h-full bg-amber-500" style={{ width: "45%" }}></div>
                  <div className="h-full bg-purple-500" style={{ width: "17%" }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Weekly Improvement</CardTitle>
                <CardDescription>
                  Your progress compared to previous weeks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="font-medium">Study Time</span>
                        <span className="ml-2 text-green-500">↑ 15%</span>
                      </div>
                      <span className="text-muted-foreground">22.5h vs 19.6h</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                      <div className="h-full bg-blue-200" style={{ width: "100%" }}></div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                      <div className="h-full bg-blue-500" style={{ width: "115%" }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="font-medium">Focus Score</span>
                        <span className="ml-2 text-green-500">↑ 5%</span>
                      </div>
                      <span className="text-muted-foreground">76% vs 72%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                      <div className="h-full bg-green-200" style={{ width: "72%" }}></div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                      <div className="h-full bg-green-500" style={{ width: "76%" }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="font-medium">Topics Covered</span>
                        <span className="ml-2 text-green-500">↑ 20%</span>
                      </div>
                      <span className="text-muted-foreground">24 vs 20</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                      <div className="h-full bg-purple-200" style={{ width: "100%" }}></div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                      <div className="h-full bg-purple-500" style={{ width: "120%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="focus" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Focus Score Trends</CardTitle>
              <CardDescription>How your concentration changes over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                {/* This would be a line chart in production */}
                <div className="flex flex-col h-64 w-full relative pt-8">
                  <div className="absolute inset-0 flex flex-col justify-between py-5">
                    {[100, 80, 60, 40, 20, 0].map((tick) => (
                      <div key={tick} className="w-full h-px bg-border flex items-center">
                        <span className="text-xs text-muted-foreground pr-2">{tick}%</span>
                      </div>
                    ))}
                  </div>
                  
                  <svg className="h-full w-full" viewBox="0 0 700 300" preserveAspectRatio="none">
                    <polyline
                      points="0,75 100,54 200,105 300,45 400,60 500,70 600,45 700,66"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                    />
                    <circle cx="0" cy="75" r="4" fill="hsl(var(--primary))" />
                    <circle cx="100" cy="54" r="4" fill="hsl(var(--primary))" />
                    <circle cx="200" cy="105" r="4" fill="hsl(var(--primary))" />
                    <circle cx="300" cy="45" r="4" fill="hsl(var(--primary))" />
                    <circle cx="400" cy="60" r="4" fill="hsl(var(--primary))" />
                    <circle cx="500" cy="70" r="4" fill="hsl(var(--primary))" />
                    <circle cx="600" cy="45" r="4" fill="hsl(var(--primary))" />
                    <circle cx="700" cy="66" r="4" fill="hsl(var(--primary))" />
                  </svg>
                  
                  <div className="flex justify-between text-xs text-muted-foreground px-2 mt-2">
                    {weeklyData.map((day) => (
                      <div key={day.day}>{day.day}</div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex items-center justify-between w-full text-sm">
                <div className="text-muted-foreground">
                  Average focus: <span className="font-medium">76%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    This Week
                  </Badge>
                  <Badge variant="outline">
                    Previous Week
                  </Badge>
                </div>
              </div>
            </CardFooter>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Focus by Time of Day</CardTitle>
                <CardDescription>
                  When you achieve your highest focus scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-8 bg-green-500 rounded-sm"></div>
                      <div>
                        <p className="font-medium">Morning</p>
                        <p className="text-xs text-muted-foreground">6 AM - 12 PM</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">85%</p>
                      <p className="text-xs text-green-500">Highest focus</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-8 bg-amber-500 rounded-sm"></div>
                      <div>
                        <p className="font-medium">Afternoon</p>
                        <p className="text-xs text-muted-foreground">12 PM - 6 PM</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">78%</p>
                      <p className="text-xs text-muted-foreground">Good performance</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-8 bg-red-500 rounded-sm"></div>
                      <div>
                        <p className="font-medium">Evening</p>
                        <p className="text-xs text-muted-foreground">6 PM - 12 AM</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">65%</p>
                      <p className="text-xs text-red-500">Lowest focus</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-12 gap-1 h-8">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-full rounded-sm ${
                        i < 4 ? "bg-muted" : 
                        i < 6 ? "bg-green-500" : 
                        i < 9 ? "bg-amber-500" : 
                        "bg-red-500"
                      }`}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>12 AM</span>
                  <span>6 AM</span>
                  <span>12 PM</span>
                  <span>6 PM</span>
                  <span>12 AM</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Focus by Subject</CardTitle>
                <CardDescription>
                  How your concentration varies by topic
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {subjectData.map((subject) => (
                    <div key={subject.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{subject.name}</span>
                        <span className="font-medium">{subject.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={subject.color}
                          style={{ width: `${subject.progress}%`, height: '100%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex items-center justify-center">
                  <div className="inline-flex gap-2 px-3 py-1 rounded-lg bg-muted/50">
                    <LineChart className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">
                      Highest focus: <span className="font-medium text-foreground">Literature (85%)</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="subjects">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Subject Distribution</CardTitle>
              <CardDescription>
                Time spent on each subject and your progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-64 h-64 relative flex items-center justify-center">
                  {/* This would be a pie chart in production */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="hsl(var(--muted))" strokeWidth="20" />
                    
                    {/* Physics slice */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent" 
                      stroke="#3b82f6" 
                      strokeWidth="20"
                      strokeDasharray="251.2 251.2"
                      strokeDashoffset="0"
                    />
                    
                    {/* CS slice */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent" 
                      stroke="#22c55e" 
                      strokeWidth="20"
                      strokeDasharray="251.2 251.2"
                      strokeDashoffset="188.4"
                    />
                    
                    {/* Math slice */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent" 
                      stroke="#f59e0b" 
                      strokeWidth="20"
                      strokeDasharray="251.2 251.2"
                      strokeDashoffset="125.6"
                    />
                    
                    {/* Literature slice */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent" 
                      stroke="#a855f7" 
                      strokeWidth="20"
                      strokeDasharray="251.2 251.2"
                      strokeDashoffset="75.4"
                    />
                    
                    {/* Biology slice */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent" 
                      stroke="#f43f5e" 
                      strokeWidth="20"
                      strokeDasharray="251.2 251.2"
                      strokeDashoffset="37.7"
                    />
                  </svg>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <h3 className="text-2xl font-bold">22.5</h3>
                    <p className="text-sm text-muted-foreground">Total Hours</p>
                  </div>
                </div>
                
                <div className="flex-1 grid gap-4">
                  {subjectData.map((subject) => (
                    <div key={subject.name} className="flex items-center gap-3">
                      <div className={`w-3 h-10 ${subject.color} rounded-sm`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">{subject.name}</p>
                          <p className="font-medium">{subject.hours} hours</p>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress: {subject.progress}%</span>
                          <span>{Math.round((subject.hours / 30) * 100)}% of total</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" size="sm" className="ml-auto">
                <PieChart className="mr-2 h-4 w-4" />
                View Detailed Breakdown
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="streak">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Study Streak Calendar</CardTitle>
              <CardDescription>
                Your consistency in studying over the past two weeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                {/* This would be a calendar heatmap in production */}
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-xs text-muted-foreground">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2">
                    {/* First week */}
                    {streakData.slice(0, 7).map((day, i) => (
                      <div 
                        key={i} 
                        className={`h-16 rounded-md flex items-center justify-center ${
                          day.count === 0 ? 'bg-muted' : 
                          day.count < 2 ? 'bg-green-500/20' : 
                          day.count < 4 ? 'bg-green-500/50' : 
                          'bg-green-500'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-xs font-medium">{day.date.split(' ')[1]}</div>
                          <div className={`text-xs ${day.count === 0 ? 'text-muted-foreground' : 'text-green-900'}`}>
                            {day.count > 0 ? `${day.count}h` : '-'}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Second week */}
                    {streakData.slice(7).map((day, i) => (
                      <div 
                        key={i + 7} 
                        className={`h-16 rounded-md flex items-center justify-center ${
                          day.count === 0 ? 'bg-muted' : 
                          day.count < 2 ? 'bg-green-500/20' : 
                          day.count < 4 ? 'bg-green-500/50' : 
                          'bg-green-500'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-xs font-medium">{day.date.split(' ')[1]}</div>
                          <div className={`text-xs ${day.count === 0 ? 'text-muted-foreground' : 'text-green-900'}`}>
                            {day.count > 0 ? `${day.count}h` : '-'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center mt-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-muted rounded-sm"></div>
                    <span className="text-xs text-muted-foreground">No Study</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500/20 rounded-sm"></div>
                    <span className="text-xs text-muted-foreground">{"<2 hours"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500/50 rounded-sm"></div>
                    <span className="text-xs text-muted-foreground">{"2-4 hours"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    <span className="text-xs text-muted-foreground">{">4 hours"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <div className="text-sm text-muted-foreground">
                Current streak: <span className="font-medium">5 days</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Total days studied: <span className="font-medium">11 of 14</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Insights */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>AI-Powered Insights</CardTitle>
          </div>
          <CardDescription>
            Personalized recommendations based on your study patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {insightsData.map((insight) => (
              <div key={insight.id} className="bg-card border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <insight.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {insight.description}
                    </p>
                    <div className="inline-flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                      <Zap className="h-3 w-3" />
                      {insight.action}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t border-primary/10 pt-4">
          <Button size="sm" className="ml-auto">
            <Brain className="mr-2 h-4 w-4" />
            Generate Custom Study Plan
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 