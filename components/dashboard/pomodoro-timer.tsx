"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  BrainCircuit
} from "lucide-react"
import { cn, formatTime } from "@/lib/utils"

interface PomodoroTimerProps {
  className?: string
  defaultFocusTime?: number
  defaultBreakTime?: number
}

type TimerState = "focus" | "break" | "idle"

export function PomodoroTimer({
  className,
  defaultFocusTime = 25 * 60, // 25 minutes in seconds
  defaultBreakTime = 5 * 60, // 5 minutes in seconds
}: PomodoroTimerProps) {
  const [focusTime, setFocusTime] = useState(defaultFocusTime)
  const [breakTime, setBreakTime] = useState(defaultBreakTime)
  const [timeLeft, setTimeLeft] = useState(focusTime)
  const [timerState, setTimerState] = useState<TimerState>("idle")
  const [isRunning, setIsRunning] = useState(false)
  const [currentSubject, setCurrentSubject] = useState<string>("Mathematics")
  const [difficultyLevel, setDifficultyLevel] = useState<number>(3)
  const [energyLevel, setEnergyLevel] = useState<number>(4)
  
  // Mock AI recommendations based on user inputs
  const getAIRecommendation = useCallback(() => {
    // Mock calculation based on subject, difficulty, and energy
    let recommendedFocusMinutes = 25
    let recommendedBreakMinutes = 5
    
    if (difficultyLevel >= 4) {
      recommendedFocusMinutes = 20 // Shorter sessions for difficult subjects
      recommendedBreakMinutes = 7  // Longer breaks
    } else if (difficultyLevel <= 2) {
      recommendedFocusMinutes = 30 // Longer sessions for easier subjects
    }
    
    if (energyLevel <= 2) {
      recommendedFocusMinutes = Math.max(15, recommendedFocusMinutes - 5) // Even shorter if low energy
      recommendedBreakMinutes = Math.min(10, recommendedBreakMinutes + 2)  // Even longer breaks
    }
    
    // Subject-specific adjustments (simplified mock)
    if (currentSubject === "Mathematics") {
      recommendedFocusMinutes = Math.min(30, recommendedFocusMinutes + 5)
    } else if (currentSubject === "Languages") {
      recommendedBreakMinutes = Math.min(10, recommendedBreakMinutes + 2)
    }
    
    return {
      focusTime: recommendedFocusMinutes * 60,
      breakTime: recommendedBreakMinutes * 60
    }
  }, [currentSubject, difficultyLevel, energyLevel])
  
  const applyAIRecommendation = () => {
    const { focusTime: newFocusTime, breakTime: newBreakTime } = getAIRecommendation()
    setFocusTime(newFocusTime)
    setBreakTime(newBreakTime)
    setTimeLeft(newFocusTime)
    setTimerState("idle")
    setIsRunning(false)
  }
  
  const toggleTimer = () => {
    if (timerState === "idle") {
      setTimerState("focus")
    }
    setIsRunning(prev => !prev)
  }
  
  const resetTimer = () => {
    setTimeLeft(timerState === "focus" ? focusTime : breakTime)
    setIsRunning(false)
  }
  
  const switchMode = () => {
    if (timerState === "focus") {
      setTimerState("break")
      setTimeLeft(breakTime)
    } else {
      setTimerState("focus")
      setTimeLeft(focusTime)
    }
    setIsRunning(false)
  }
  
  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            // Time's up, switch modes
            setIsRunning(false)
            if (timerState === "focus") {
              setTimerState("break")
              return breakTime
            } else {
              setTimerState("focus")
              return focusTime
            }
          }
          return prevTime - 1
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timerState, focusTime, breakTime])
  
  // Format time for display
  const formatTimeDisplay = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }
  
  const subjects = ["Mathematics", "Physics", "Chemistry", "Languages", "Computer Science", "History"]
  
  return (
    <div className={cn("flex flex-col", className)}>
      {/* Timer Display */}
      <div className="flex justify-center items-center flex-col mb-6">
        <div 
          className={cn(
            "text-5xl font-semibold mb-2 font-mono",
            timerState === "focus" ? "text-foreground" : "text-primary"
          )}
        >
          {formatTimeDisplay(timeLeft)}
        </div>
        <div className="text-sm text-muted-foreground">
          {timerState === "focus" ? "Focus Time" : timerState === "break" ? "Break Time" : "Ready to Start"}
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex justify-center gap-2 mb-6">
        <Button
          onClick={toggleTimer}
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <Button
          onClick={resetTimer}
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={switchMode}
          variant="outline"
          className="h-10 rounded-full"
        >
          {timerState === "focus" ? "Switch to Break" : "Switch to Focus"}
        </Button>
      </div>
      
      {/* Study Context */}
      <div className="space-y-4 border-t pt-4">
        <h4 className="text-sm font-medium">Study Context</h4>
        
        {/* Subject Selection */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Subject</label>
          <div className="grid grid-cols-3 gap-2">
            {subjects.map(subject => (
              <Button
                key={subject}
                variant={currentSubject === subject ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() => setCurrentSubject(subject)}
              >
                {subject}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Difficulty Level */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-xs text-muted-foreground">Difficulty</label>
            <span className="text-xs font-medium">{difficultyLevel}/5</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(level => (
              <Button
                key={level}
                variant="ghost"
                size="sm"
                className={cn(
                  "flex-1 p-0 h-8",
                  difficultyLevel >= level ? "bg-primary/10 hover:bg-primary/20" : ""
                )}
                onClick={() => setDifficultyLevel(level)}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Energy Level */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-xs text-muted-foreground">Energy Level</label>
            <span className="text-xs font-medium">{energyLevel}/5</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(level => (
              <Button
                key={level}
                variant="ghost"
                size="sm"
                className={cn(
                  "flex-1 p-0 h-8",
                  energyLevel >= level ? "bg-primary/10 hover:bg-primary/20" : ""
                )}
                onClick={() => setEnergyLevel(level)}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>
        
        {/* AI Button */}
        <Button 
          onClick={applyAIRecommendation} 
          className="w-full mt-4 gap-2"
        >
          <BrainCircuit className="h-4 w-4" />
          Get Smart Recommendation
        </Button>
      </div>
    </div>
  )
} 