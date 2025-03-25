import { Metadata } from "next"
import { CalendarDemo } from "@/components/ui/calendar-demo"

export const metadata: Metadata = {
  title: "Calendar | Atena",
  description: "Plan and visualize your study schedule with color-coded events.",
}

export default function CalendarPage() {
  return (
    <div className="flex flex-col h-screen p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      <p className="text-muted-foreground mb-6">
        Plan your study sessions and track important events with color-coded priorities.
      </p>
      <div className="flex-1">
        <CalendarDemo />
      </div>
    </div>
  )
} 