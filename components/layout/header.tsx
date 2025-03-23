"use client"

import Link from "next/link"
import { useState } from "react"
import { Bell, Menu, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import Image from "next/image"

interface HeaderProps {
  className?: string
  onMenuClick?: () => void
}

export function Header({ className, onMenuClick }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false)

  return (
    <header className={cn("flex h-14 items-center border-b px-4 lg:px-6", className)}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="mr-2 lg:hidden" 
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      
      {showSearch ? (
        <div className="flex-1 flex items-center">
          <Search className="h-4 w-4 mr-2 text-muted-foreground" />
          <input 
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground" 
            placeholder="Search..." 
            autoFocus
          />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowSearch(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close search</span>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowSearch(true)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon"
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full overflow-hidden"
              asChild
            >
              <Link href="/profile">
                <Image
                  src="/placeholder-user.jpg"
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="sr-only">Profile</span>
              </Link>
            </Button>
          </div>
        </>
      )}
    </header>
  )
} 