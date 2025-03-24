import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, formatStr: string = "PPP"): string {
  const dateObj = date instanceof Date ? date : new Date(date)
  return format(dateObj, formatStr)
}

export function formatTimeAgo(date: Date | string): string {
  const dateObj = date instanceof Date ? date : new Date(date)
  
  if (isToday(dateObj)) {
    return "Today"
  } else if (isYesterday(dateObj)) {
    return "Yesterday"
  } else {
    return formatDistanceToNow(dateObj, { addSuffix: true })
  }
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`
  } else {
    return `${remainingMinutes}m`
  }
}

export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.substring(0, length)}...` : str
}

export function generateId(length = 6): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
