"use client";

import { useState, useEffect } from "react";
import { 
  BarChart, 
  Clock, 
  Calendar, 
  Brain, 
  TrendingUp, 
  Target, 
  Zap, 
  Award, 
  BookOpen, 
  LineChart, 
  PieChart, 
  Download, 
  Filter,
  ChevronDown 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { 
  StudyTimeChart, 
  FocusLineChart, 
  SubjectPieChart, 
  ProgressChart, 
  TaskBreakdownChart, 
  Recommendations,
  type SubjectData
} from "@/components/analytics";

import { 
  getAnalyticsData, 
  updateAnalyticsData,
  type AnalyticsData
} from "@/lib/services/analytics-service";

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(() => getAnalyticsData());
  const [showPrevWeek, setShowPrevWeek] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<('studyHours' | 'grade' | 'performance')[]>(['studyHours', 'grade']);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'semester'>('month');
  const [isClient, setIsClient] = useState(false);
  
  // Make sure we're rendering on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Functions to handle data updates
  const handleCompareToggle = () => {
    setShowPrevWeek(!showPrevWeek);
  };
  
  const handleMetricToggle = (metric: 'studyHours' | 'grade' | 'performance') => {
    if (selectedMetrics.includes(metric)) {
      // Don't remove the last metric
      if (selectedMetrics.length > 1) {
        setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
      }
    } else {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };
  
  const handleTimeframeChange = (newTimeframe: 'week' | 'month' | 'semester') => {
    setTimeframe(newTimeframe);
  };
  
  const handleDownloadData = () => {
    try {
      const dataStr = JSON.stringify(analyticsData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportName = 'atena_analytics_export.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportName);
      linkElement.click();
    } catch (error) {
      console.error('Error exporting analytics data:', error);
      alert('Failed to export data. Please try again.');
    }
  };
  
  if (!isClient) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    );
  }

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
          <Button variant="outline" onClick={handleDownloadData}>
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
                  <h3 className="text-2xl font-bold">{analyticsData.studyStats.totalHours.toFixed(1)}</h3>
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
                  <h3 className="text-2xl font-bold">{analyticsData.studyStats.averageFocus}%</h3>
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
                  <h3 className="text-2xl font-bold">{analyticsData.studyStats.currentStreak}</h3>
                  <p className="text-sm text-muted-foreground">days</p>
                </div>
                <p className="text-xs text-green-500">Your best: {analyticsData.studyStats.bestStreak} days</p>
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
                  <h3 className="text-2xl font-bold">{analyticsData.studyStats.completedSessions}</h3>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList>
            <TabsTrigger value="time">Study Time</TabsTrigger>
            <TabsTrigger value="focus">Focus Score</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCompareToggle}
              className={showPrevWeek ? "bg-muted" : ""}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {showPrevWeek ? "Hide Comparison" : "Compare with Previous"}
            </Button>
          </div>
        </div>
        
        <TabsContent value="time" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Weekly Study Time</CardTitle>
              <CardDescription>Hours spent studying each day</CardDescription>
            </CardHeader>
            <CardContent>
              <StudyTimeChart 
                data={analyticsData.weeklyData} 
                showPreviousWeek={showPrevWeek}
                previousWeekData={analyticsData.prevWeeklyData}
              />
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex items-center justify-between w-full text-sm">
                <div className="text-muted-foreground">
                  Weekly total: <span className="font-medium">{analyticsData.studyStats.totalHours.toFixed(1)} hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                    This Week
                  </Badge>
                  {showPrevWeek && (
                    <Badge variant="outline" className="bg-slate-500/10 text-slate-500">
                      Previous Week
                    </Badge>
                  )}
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
              <FocusLineChart 
                data={analyticsData.weeklyData} 
                showPreviousWeek={showPrevWeek}
                previousWeekData={analyticsData.prevWeeklyData}
              />
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex items-center justify-between w-full text-sm">
                <div className="text-muted-foreground">
                  Average focus: <span className="font-medium">{analyticsData.studyStats.averageFocus}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    This Week
                  </Badge>
                  {showPrevWeek && (
                    <Badge variant="outline">
                      Previous Week
                    </Badge>
                  )}
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
                  {analyticsData.subjectData.map((subject: SubjectData) => (
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
                <SubjectPieChart 
                  data={analyticsData.subjectData} 
                  centerText={{
                    primary: analyticsData.studyStats.totalHours.toFixed(1),
                    secondary: "Total Hours"
                  }}
                />
                
                <div className="flex-1 grid gap-4">
                  {analyticsData.subjectData.map((subject: SubjectData) => (
                    <div key={subject.name} className="flex items-center gap-3">
                      <div className={`w-3 h-10 ${subject.color} rounded-sm`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">{subject.name}</p>
                          <p className="font-medium">{subject.hours} hours</p>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress: {subject.progress}%</span>
                          <span>{Math.round((subject.hours / analyticsData.studyStats.totalHours) * 100)}% of total</span>
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
        
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Progress Over Time</CardTitle>
                  <CardDescription>Track your performance trends</CardDescription>
                </div>
                
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        <Filter className="h-3.5 w-3.5 mr-2" />
                        Metrics
                        <ChevronDown className="h-3.5 w-3.5 ml-2" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-3">
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Select metrics to display</h4>
                        <Separator />
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="study-hours" 
                              checked={selectedMetrics.includes("studyHours")} 
                              onCheckedChange={() => handleMetricToggle("studyHours")}
                            />
                            <Label htmlFor="study-hours">Study Hours</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="grades" 
                              checked={selectedMetrics.includes("grade")} 
                              onCheckedChange={() => handleMetricToggle("grade")}
                            />
                            <Label htmlFor="grades">Grades</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="performance" 
                              checked={selectedMetrics.includes("performance")} 
                              onCheckedChange={() => handleMetricToggle("performance")}
                            />
                            <Label htmlFor="performance">Performance</Label>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        <Calendar className="h-3.5 w-3.5 mr-2" />
                        {timeframe === 'week' ? 'Weekly' : timeframe === 'month' ? 'Monthly' : 'Semester'}
                        <ChevronDown className="h-3.5 w-3.5 ml-2" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-3">
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Select timeframe</h4>
                        <Separator />
                        
                        <div className="flex flex-col gap-2">
                          <Button 
                            variant={timeframe === 'week' ? 'default' : 'ghost'} 
                            size="sm" 
                            onClick={() => handleTimeframeChange('week')}
                          >
                            Weekly
                          </Button>
                          <Button 
                            variant={timeframe === 'month' ? 'default' : 'ghost'} 
                            size="sm" 
                            onClick={() => handleTimeframeChange('month')}
                          >
                            Monthly
                          </Button>
                          <Button 
                            variant={timeframe === 'semester' ? 'default' : 'ghost'} 
                            size="sm" 
                            onClick={() => handleTimeframeChange('semester')}
                          >
                            Semester
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ProgressChart 
                data={analyticsData.progressData}
                metrics={selectedMetrics}
                timeframe={timeframe}
              />
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="text-sm text-muted-foreground">
                This visualization helps you track your progress and identify trends in your performance over time.
              </div>
            </CardFooter>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Recommendations
              studyData={analyticsData.weeklyData}
              subjectData={analyticsData.subjectData}
              customRecommendations={analyticsData.recommendations}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="tasks">
          <TaskBreakdownChart data={analyticsData.taskCategories} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 