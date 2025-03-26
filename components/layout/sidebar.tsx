"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  BookOpen, 
  BrainCircuit, 
  CalendarClock, 
  ChevronRight, 
  FileText, 
  Gauge, 
  Settings, 
  Users, 
  Zap,
  MessageSquare 
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Gauge },
  { name: "Flashcards", href: "/dashboard/flashcards", icon: FileText },
  { name: "Schedule", href: "/dashboard/schedule", icon: CalendarClock },
  { name: "Study Sessions", href: "/dashboard/study", icon: BookOpen },
  { name: "AI Assistant", href: "/dashboard/ai", icon: BrainCircuit },
  { name: "Study Chatbot", href: "/dashboard/chatbot", icon: MessageSquare },
  { name: "Analytics", href: "/dashboard/analytics", icon: Zap },
  { name: "Collaboration", href: "/dashboard/collaborate", icon: Users },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("flex h-full flex-col border-r bg-background", className)}>
      <div className="px-3 py-2 flex items-center h-14 border-b">
        <span className="font-semibold text-lg leading-none tracking-tight">Atena</span>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1">{item.name}</span>
                <ChevronRight 
                  className={cn(
                    "h-4 w-4 opacity-0 transition-all",
                    isActive ? "opacity-100" : "group-hover:opacity-70"
                  )}
                />
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto p-2">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium",
            pathname === "/dashboard/settings"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
          )}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  )
} 