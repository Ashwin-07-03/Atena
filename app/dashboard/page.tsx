import { Metadata } from "next"
import { 
  ChevronRight, 
  Clock, 
  ClockIcon, 
  LineChart, 
  BrainCircuit, 
  Trophy, 
  BookOpen, 
  CalendarDays 
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PomodoroTimer } from "@/components/dashboard/pomodoro-timer"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your learning dashboard",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Dashboard</h1>
          <p className="text-muted-foreground">{formatDate(new Date())}</p>
        </div>
        <Button variant="outline" className="gap-1">
          <Clock className="h-4 w-4" />
          Focus Mode
        </Button>
      </div>
      
      {/* Main content grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Today's Progress</CardTitle>
            <CardDescription>You've studied 2.5 hours today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Physics</span>
                <span className="font-medium">45m</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "30%" }}></div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Mathematics</span>
                <span className="font-medium">1h 15m</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "50%" }}></div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Computer Science</span>
                <span className="font-medium">30m</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "20%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Your next few deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              {[
                { title: "Physics Lab Report", subject: "Physics", dueDate: "Tomorrow", urgent: true },
                { title: "Algorithms Assignment", subject: "Computer Science", dueDate: "3 days", urgent: false },
                { title: "Calculus Problem Set", subject: "Mathematics", dueDate: "5 days", urgent: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.subject}</p>
                  </div>
                  <span className={`text-sm ${item.urgent ? "text-destructive" : "text-muted-foreground"}`}>
                    {item.dueDate}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Study Streak */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Study Streak</CardTitle>
            <CardDescription>Your current study streak</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-24 h-24 flex items-center justify-center mb-3">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <path
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      strokeDasharray="85, 100"
                    />
                  </svg>
                </div>
                <div className="text-3xl font-bold">12</div>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Trophy className="w-4 h-4 text-primary" />
                <span>Days in a row</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">Best: 18 days</div>
            </div>
            
            <div className="flex justify-between mt-2">
              {[
                { day: "M", active: true },
                { day: "T", active: true },
                { day: "W", active: true },
                { day: "T", active: true },
                { day: "F", active: true },
                { day: "S", active: true },
                { day: "S", active: false },
              ].map((day, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="text-xs text-muted-foreground">{day.day}</div>
                  <div className={`w-2 h-2 rounded-full mt-1 ${day.active ? "bg-primary" : "bg-muted"}`}></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Pomodoro and Smart Tasks */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Pomodoro Timer */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Focus Timer</CardTitle>
            <CardDescription>Use AI-optimized Pomodoro sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <PomodoroTimer />
          </CardContent>
        </Card>
        
        {/* Smart Tasks */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Smart Tasks</CardTitle>
            <CardDescription>AI-recommended tasks for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              {[
                { title: "Review Physics Formulas", duration: "20 min", ai: true },
                { title: "Practice Calculus Problems", duration: "45 min", ai: true },
                { title: "Read CS Research Paper", duration: "30 min", ai: false },
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`task-${i}`}
                    className="h-4 w-4 rounded-sm border-gray-300 text-primary focus:ring-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <label htmlFor={`task-${i}`} className="font-medium cursor-pointer">
                      {task.title}
                    </label>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <ClockIcon className="w-3 h-3" />
                      <span>{task.duration}</span>
                      {task.ai && (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                          <BrainCircuit className="w-3 h-3 mr-1" />
                          AI Optimized
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" size="sm" className="w-full mt-4">
                View All Tasks
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Weekly Analytics */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Weekly Analytics</CardTitle>
              <CardDescription>Your study patterns this week</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <LineChart className="mr-1 h-4 w-4" />
              Full Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full flex items-end justify-between gap-2 border-b pb-2">
            {[40, 30, 60, 80, 50, 70, 45].map((value, i) => (
              <div key={i} className="relative flex flex-1 flex-col items-center">
                <div 
                  className="w-full bg-primary rounded-t-sm" 
                  style={{ height: `${value}%` }}
                ></div>
                <span className="absolute -bottom-6 text-xs text-muted-foreground">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                </span>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Total Hours</span>
              <span className="text-2xl font-semibold">17.5</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Sessions</span>
              <span className="text-2xl font-semibold">28</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Focus Rate</span>
              <span className="text-2xl font-semibold">85%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 