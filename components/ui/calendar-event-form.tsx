"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarEvent, EventPriority } from "@/lib/services/calendar-service";

interface CalendarEventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (event: Omit<CalendarEvent, "id">) => void;
  initialEvent?: Partial<CalendarEvent>;
}

export function CalendarEventForm({
  open,
  onOpenChange,
  onSave,
  initialEvent = {
    title: "",
    start: new Date(),
    end: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    priority: EventPriority.IMPORTANT,
    description: "",
    location: "",
  },
}: CalendarEventFormProps) {
  const [event, setEvent] = React.useState<Partial<CalendarEvent>>(initialEvent);

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      setEvent(initialEvent);
    }
  }, [open, initialEvent]);

  const handleChange = (field: keyof CalendarEvent, value: any) => {
    setEvent((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !event.title ||
      !event.start ||
      !event.end ||
      !event.priority
    ) {
      return;
    }
    
    onSave(event as Omit<CalendarEvent, "id">);
    onOpenChange(false);
  };

  // Helper to format datetime-local input value
  const formatDateTimeLocal = (date: Date) => {
    return date.toISOString().slice(0, 16);
  };

  // Helper to parse datetime-local input value
  const parseDateTimeLocal = (value: string) => {
    return new Date(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialEvent.id ? "Edit Event" : "Add New Event"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={event.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Event title"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="start">Start Time</Label>
              <Input
                id="start"
                type="datetime-local"
                value={event.start ? formatDateTimeLocal(event.start) : ""}
                onChange={(e) => handleChange("start", parseDateTimeLocal(e.target.value))}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="end">End Time</Label>
              <Input
                id="end"
                type="datetime-local"
                value={event.end ? formatDateTimeLocal(event.end) : ""}
                onChange={(e) => handleChange("end", parseDateTimeLocal(e.target.value))}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={event.priority}
                onValueChange={(value) => handleChange("priority", value)}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EventPriority.LESS_IMPORTANT}>
                    Less Important
                  </SelectItem>
                  <SelectItem value={EventPriority.IMPORTANT}>
                    Important
                  </SelectItem>
                  <SelectItem value={EventPriority.MANDATORY}>
                    Mandatory
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                value={event.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Location"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={event.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Add a description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 