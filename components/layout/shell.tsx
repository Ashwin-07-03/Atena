"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { cn } from "@/lib/utils"

interface ShellProps {
  children: React.ReactNode
  className?: string
}

export function Shell({ children, className }: ShellProps) {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div 
        className={cn(
          "fixed inset-0 z-50 bg-background lg:hidden",
          showMobileSidebar ? "block" : "hidden"
        )}
      >
        <Sidebar className="w-full" />
        <div 
          className="absolute right-4 top-4 cursor-pointer" 
          onClick={() => setShowMobileSidebar(false)}
        >
          <div className="rounded-sm p-1 hover:bg-accent">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-6 w-6"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-1">
        <Sidebar className="hidden lg:flex w-64 flex-col" />
        <main className="flex-1 flex flex-col">
          <Header onMenuClick={() => setShowMobileSidebar(true)} />
          <div className={cn("flex-1 overflow-auto p-4 lg:p-6", className)}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 