import { Metadata } from "next"
import { CalendarDemo } from "@/components/ui/calendar-demo"

export const metadata: Metadata = {
  title: "Calendar | Atena",
  description: "Plan and track your study activities with week and day views.",
}

export default function CalendarPage() {
  return (
    <div className="h-full">
      <CalendarDemo />
    </div>
  )
} 