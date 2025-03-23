import { Metadata } from 'next';
import { Clock, BarChart3, Brain, Plus, Calendar, BookOpen, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Study Sessions | Atena',
  description: 'Track and manage your study sessions with Pomodoro timer',
};

// Sample past sessions data
const pastSessions = [
  {
    id: '1',
    date: 'Today',
    subject: 'Computer Science',
    duration: '2h 15m',
    focusScore: 85,
    technique: 'Pomodoro',
    completed: true
  },
  {
    id: '2',
    date: 'Yesterday',
    subject: 'Mathematics',
    duration: '1h 45m',
    focusScore: 70,
    technique: 'Flow State',
    completed: true
  },
  {
    id: '3',
    date: 'Mar 18, 2024',
    subject: 'Physics',
    duration: '2h 30m',
    focusScore: 60,
    technique: 'Time Blocking',
    completed: true
  }
];

// Sample study techniques
const studyTechniques = [
  {
    id: '1',
    name: 'Pomodoro Technique',
    description: '25-minute focused work sessions with 5-minute breaks',
    bestFor: 'Maintaining focus and avoiding burnout',
    icon: Clock
  },
  {
    id: '2',
    name: 'Active Recall',
    description: 'Testing yourself on material rather than passive review',
    bestFor: 'Long-term retention of information',
    icon: Brain
  },
  {
    id: '3',
    name: 'Spaced Repetition',
    description: 'Reviewing material at increasing intervals',
    bestFor: 'Memorization and retention',
    icon: Calendar
  },
  {
    id: '4',
    name: 'Feynman Technique',
    description: 'Explaining concepts in simple terms to identify knowledge gaps',
    bestFor: 'Deep understanding of complex topics',
    icon: BookOpen
  }
];

export default function StudySessionsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Study Sessions</h1>
          <p className="text-muted-foreground">
            Track your study time and boost productivity with the Pomodoro timer
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Start New Session
        </Button>
      </div>

      {/* Main content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Current session / Pomodoro timer */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Current Study Session</CardTitle>
            <CardDescription>
              Use the Pomodoro technique to maintain focus and track your progress
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {/* Pomodoro Timer */}
            <div className="w-48 h-48 relative flex items-center justify-center mb-6">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-muted stroke-current"
                  strokeWidth="4"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-primary stroke-current"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                  style={{
                    strokeDasharray: "283",
                    strokeDashoffset: "100",
                  }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-bold">18:42</span>
                <span className="text-muted-foreground text-sm">Focus Time</span>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex gap-3 mb-6">
              <Button variant="outline" size="sm">
                Start
              </Button>
              <Button variant="outline" size="sm">
                Pause
              </Button>
              <Button variant="outline" size="sm">
                Reset
              </Button>
            </div>

            {/* Session Details */}
            <div className="w-full max-w-md space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Subject</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option>Computer Science</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>Literature</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Technique</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option>Pomodoro (25/5)</option>
                    <option>Long Pomodoro (50/10)</option>
                    <option>Time Blocking</option>
                    <option>Flow State</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Session Goal</label>
                <textarea 
                  className="w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="What do you want to accomplish in this session?"
                ></textarea>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Today's total: </span>
              <span className="font-medium">2h 15m</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Focus level:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div
                    key={n}
                    className={`w-2 h-6 rounded-sm ${
                      n <= 3 ? "bg-primary" : "bg-muted"
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* AI Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
            <CardDescription>
              Personalized study techniques and insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Optimized Study Schedule</h4>
                  <p className="text-sm text-muted-foreground">
                    Based on your focus patterns, your optimal study time is between 9:00 AM and 11:00 AM.
                  </p>
                  <Button variant="link" className="text-xs p-0 h-auto mt-1">Learn more</Button>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Focus Improvement</h4>
                  <p className="text-sm text-muted-foreground">
                    Your focus score has improved by 15% over the last week. Keep up the good work!
                  </p>
                  <Button variant="link" className="text-xs p-0 h-auto mt-1">View analytics</Button>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Recommended Technique</h4>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">Pomodoro Technique</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                For your Computer Science sessions, try 25-minute focused intervals with 5-minute breaks to maximize retention.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Apply Technique
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Session History */}
        <Card>
          <CardHeader>
            <CardTitle>Session History</CardTitle>
            <CardDescription>
              Review your recent study sessions and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastSessions.map((session) => (
                <div 
                  key={session.id} 
                  className="flex items-start justify-between p-3 bg-muted/40 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{session.subject}</div>
                      <div className="text-sm text-muted-foreground">
                        {session.date} • {session.duration}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          {session.technique}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-sm font-medium">
                      Focus Score: {session.focusScore}%
                    </div>
                    <Progress value={session.focusScore} className="w-20 h-1.5 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" size="sm" className="w-full">
              View All History
            </Button>
          </CardFooter>
        </Card>

        {/* Study Techniques */}
        <Card>
          <CardHeader>
            <CardTitle>Study Techniques</CardTitle>
            <CardDescription>
              Effective methods to enhance your study sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pomodoro">
              <TabsList className="grid grid-cols-4 mb-4">
                {studyTechniques.map((technique) => (
                  <TabsTrigger key={technique.id} value={technique.name.toLowerCase().replace(/\s+/g, '-')}>
                    {technique.name.split(' ')[0]}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {studyTechniques.map((technique) => (
                <TabsContent key={technique.id} value={technique.name.toLowerCase().replace(/\s+/g, '-')}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <technique.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium">{technique.name}</h3>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {technique.description}
                    </p>
                    
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-sm font-medium mb-1">Best for</div>
                      <div className="text-sm text-muted-foreground">
                        {technique.bestFor}
                      </div>
                    </div>
                    
                    <Button size="sm" className="w-full">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Use This Technique
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 