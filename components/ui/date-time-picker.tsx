"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DateTimePickerProps {
  value: Date
  onChange: (date: Date) => void
  granularity?: "day" | "hour" | "minute" | "second"
  className?: string
}

export function DateTimePicker({
  value,
  onChange,
  granularity = "minute",
  className,
}: DateTimePickerProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date>(value || new Date())
  
  // Format the time portion for the time input field
  const formatTimeForInput = (date: Date) => {
    if (granularity === "day") return ""
    const time = format(date, granularity === "hour" 
      ? "HH:00" 
      : granularity === "minute" 
        ? "HH:mm" 
        : "HH:mm:ss")
    return time
  }
  
  // Initial time value
  const [timeString, setTimeString] = React.useState(formatTimeForInput(value || new Date()))
  
  // Update the parent component when date or time changes
  React.useEffect(() => {
    const currentDate = new Date(date)
    
    if (granularity !== "day" && timeString) {
      const [hours, minutes, seconds] = timeString.split(':').map(Number)
      currentDate.setHours(hours || 0)
      
      if (granularity !== "hour") {
        currentDate.setMinutes(minutes || 0)
        
        if (granularity === "second") {
          currentDate.setSeconds(seconds || 0)
        } else {
          currentDate.setSeconds(0)
        }
      } else {
        currentDate.setMinutes(0)
        currentDate.setSeconds(0)
      }
    }
    
    onChange(currentDate)
  }, [date, timeString, granularity, onChange])
  
  // Update internal state when the value prop changes
  React.useEffect(() => {
    if (value) {
      setDate(value)
      setTimeString(formatTimeForInput(value))
    }
  }, [value])
  
  // Handle time string changes
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeString(e.target.value)
  }
  
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP p") : <span>Pick a date and time</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(day: Date | undefined) => {
              setDate(day || new Date())
              if (granularity === "day") {
                setIsPopoverOpen(false)
              }
            }}
            initialFocus
          />
          {granularity !== "day" && (
            <div className="p-3 border-t">
              <Input
                type="time"
                value={timeString}
                onChange={handleTimeChange}
                step={granularity === "second" ? 1 : granularity === "minute" ? 60 : 3600}
              />
              <div className="flex justify-end mt-2">
                <Button 
                  size="sm" 
                  onClick={() => setIsPopoverOpen(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
} 