"use client"

import { FullScreenCalendar, EventPriority } from "@/components/ui/fullscreen-calendar"

// Sample events with priority levels
const dummyEvents = [
  {
    day: new Date("2025-03-02"),
    events: [
      {
        id: 1,
        name: "Team Standup",
        time: "10:00 AM",
        datetime: "2025-03-02T10:00",
        priority: EventPriority.IMPORTANT,
      },
      {
        id: 2,
        name: "Coffee Break",
        time: "2:00 PM",
        datetime: "2025-03-02T14:00",
        priority: EventPriority.LESS_IMPORTANT,
      },
    ],
  },
  {
    day: new Date("2025-03-07"),
    events: [
      {
        id: 3,
        name: "Product Launch Meeting",
        time: "2:00 PM",
        datetime: "2025-03-07T14:00",
        priority: EventPriority.MANDATORY,
      },
      {
        id: 4,
        name: "Marketing Sync",
        time: "11:00 AM",
        datetime: "2025-03-07T11:00",
        priority: EventPriority.IMPORTANT,
      },
      {
        id: 5,
        name: "Team Lunch",
        time: "12:30 PM",
        datetime: "2025-03-07T12:30",
        priority: EventPriority.LESS_IMPORTANT,
      },
    ],
  },
  {
    day: new Date("2025-03-10"),
    events: [
      {
        id: 6,
        name: "Quarterly Review",
        time: "11:00 AM",
        datetime: "2025-03-10T11:00",
        priority: EventPriority.MANDATORY,
      },
    ],
  },
  {
    day: new Date("2025-03-15"),
    events: [
      {
        id: 7,
        name: "Budget Planning",
        time: "3:30 PM",
        datetime: "2025-03-15T15:30",
        priority: EventPriority.IMPORTANT,
      },
      {
        id: 8,
        name: "Sprint Planning",
        time: "9:00 AM",
        datetime: "2025-03-15T09:00",
        priority: EventPriority.MANDATORY,
      },
      {
        id: 9,
        name: "Design Review",
        time: "1:00 PM",
        datetime: "2025-03-15T13:00",
        priority: EventPriority.IMPORTANT,
      },
    ],
  },
  {
    day: new Date("2025-03-23"),
    events: [
      {
        id: 10,
        name: "Client Presentation",
        time: "10:00 AM",
        datetime: "2025-03-23T10:00",
        priority: EventPriority.MANDATORY,
      },
      {
        id: 11,
        name: "Team Building",
        time: "12:30 PM",
        datetime: "2025-03-23T12:30",
        priority: EventPriority.LESS_IMPORTANT,
      },
      {
        id: 12,
        name: "Project Status Update",
        time: "2:00 PM",
        datetime: "2025-03-23T14:00",
        priority: EventPriority.IMPORTANT,
      },
    ],
  },
  {
    day: new Date("2025-03-25"),
    events: [
      {
        id: 13,
        name: "System Release",
        time: "10:00 AM",
        datetime: "2025-03-25T10:00",
        priority: EventPriority.MANDATORY,
      },
    ],
  },
  {
    day: new Date("2025-03-29"),
    events: [
      {
        id: 14,
        name: "End of Month Review",
        time: "1:00 PM",
        datetime: "2025-03-29T13:00",
        priority: EventPriority.IMPORTANT,
      },
      {
        id: 15,
        name: "Team Happy Hour",
        time: "4:30 PM",
        datetime: "2025-03-29T16:30",
        priority: EventPriority.LESS_IMPORTANT,
      },
    ],
  },
]

function CalendarDemo() {
  const handleAddEvent = () => {
    console.log("Add new event clicked")
    // In a real implementation, you would open a modal or form for adding a new event
  }

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <FullScreenCalendar data={dummyEvents} onAddEvent={handleAddEvent} />
      </div>
    </div>
  )
}

export { CalendarDemo } 