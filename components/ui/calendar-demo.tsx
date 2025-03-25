"use client"

import { UnifiedCalendar } from "@/components/ui/unified-calendar"

function CalendarDemo() {
  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden h-full">
        <UnifiedCalendar initialView="week" />
      </div>
    </div>
  )
}

export { CalendarDemo } 