"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface ScheduleEventFormProps {
  event?: {
    id?: string
    title: string
    start: Date | string
    end: Date | string
    allDay: boolean
    location?: string
    description?: string
    color?: string
    reminders?: {
      id: string
      time: number // Minutes before event
    }[]
  }
  isEditing?: boolean
  onSave: (event: any) => void
  onCancel: () => void
  onDelete?: () => void
}

export function ScheduleEventForm({
  event,
  isEditing = false,
  onSave,
  onCancel,
  onDelete
}: ScheduleEventFormProps) {
  const defaultEvent = {
    title: "",
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
    allDay: false,
    location: "",
    description: "",
    color: "primary",
    reminders: []
  }

  const [formData, setFormData] = useState(event || defaultEvent)
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  // Convert Date to string format for input fields
  const dateToInputDateTime = (date: Date | string | null | undefined): string => {
    if (!date) {
      return "";
    }
    
    try {
      const dateObject = date instanceof Date ? date : new Date(date);
      
      // Check if date is valid
      if (isNaN(dateObject.getTime())) {
        console.error('Invalid date:', date);
        return "";
      }
      
      return dateObject.toISOString().slice(0, 16);
    } catch (error) {
      console.error('Error converting date to input format:', error);
      return "";
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          placeholder="Add title"
          value={formData.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("title", e.target.value)}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Time</Label>
          <Input
            id="startDate"
            type="datetime-local"
            value={dateToInputDateTime(formData.start)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.value) {
                handleInputChange("start", new Date(e.target.value))
              }
            }}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">End Time</Label>
          <Input
            id="endDate"
            type="datetime-local"
            value={dateToInputDateTime(formData.end)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.value) {
                handleInputChange("end", new Date(e.target.value))
              }
            }}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="allDay"
          checked={formData.allDay}
          onCheckedChange={(checked) => handleInputChange("allDay", checked)}
        />
        <Label htmlFor="allDay">All day event</Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="Add location"
          value={formData.location || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("location", e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Add description"
          value={formData.description || ""}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("description", e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={formData.color}
          onValueChange={(value) => handleInputChange("color", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Mathematics</SelectItem>
            <SelectItem value="blue">Physics</SelectItem>
            <SelectItem value="green">Biology</SelectItem>
            <SelectItem value="yellow">Languages</SelectItem>
            <SelectItem value="purple">Computer Science</SelectItem>
            <SelectItem value="orange">History</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Reminder</Label>
        <Select
          value={formData.reminders && formData.reminders.length > 0 ? formData.reminders[0].time.toString() : "none"}
          onValueChange={(value) => {
            const minutes = parseInt(value)
            if (isNaN(minutes)) {
              // If "none" is selected or parsing fails
              handleInputChange("reminders", [])
            } else {
              handleInputChange("reminders", [{ id: "1", time: minutes }])
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Set a reminder" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="10">10 minutes before</SelectItem>
            <SelectItem value="30">30 minutes before</SelectItem>
            <SelectItem value="60">1 hour before</SelectItem>
            <SelectItem value="1440">1 day before</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-between pt-4 border-t">
        <div>
          {isEditing && onDelete && (
            <Button variant="destructive" type="button" onClick={onDelete}>
              Delete
            </Button>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Save Changes" : "Create Event"}
          </Button>
        </div>
      </div>
    </form>
  )
} 