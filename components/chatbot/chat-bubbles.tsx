import { cn } from "@/lib/utils";
import React from "react";

interface ChatBubbleProps {
  role: "user" | "assistant";
  children: React.ReactNode;
  className?: string;
}

export function ChatBubble({ role, children, className }: ChatBubbleProps) {
  return (
    <>
      {role === "assistant" ? (
        <div className={cn(
          "flex flex-col space-y-2 p-5 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 shadow-juice relative transition-all duration-300",
          "hover:-translate-y-2 hover:scale-[1.02]",
          "after:absolute after:bottom-0 after:left-[-12px] after:w-6 after:h-6 after:bg-gradient-to-br after:from-primary/15 after:to-primary/5 after:border-l after:border-b after:border-primary/20 after:rounded-bl-xl",
          className
        )}>
          <div className="animate-fade-in">{children}</div>
          <div className="absolute -right-6 -top-4 opacity-10 w-16 h-16 pointer-events-none">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="currentColor" className="text-primary animate-pulse-juice" />
            </svg>
          </div>
        </div>
      ) : (
        <div className={cn(
          "flex flex-col space-y-2 p-5 rounded-2xl bg-gradient-to-br from-accent/15 to-accent/5 border border-accent/20 shadow-juice relative transition-all duration-300",
          "hover:-translate-y-2 hover:scale-[1.02]",
          "after:absolute after:bottom-0 after:right-[-12px] after:w-6 after:h-6 after:bg-gradient-to-br after:from-accent/15 after:to-accent/5 after:border-r after:border-b after:border-accent/20 after:rounded-br-xl",
          className
        )}>
          <div className="animate-fade-in">{children}</div>
          <div className="absolute -left-6 -top-4 opacity-10 w-16 h-16 pointer-events-none">
            <svg viewBox="0 0 100 100">
              <rect x="20" y="20" width="60" height="60" rx="15" ry="15" fill="currentColor" className="text-accent animate-pulse-juice" />
            </svg>
          </div>
        </div>
      )}
    </>
  );
} 