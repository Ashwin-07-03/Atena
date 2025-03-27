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
          "flex flex-col space-y-2 p-5 rounded-md bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 shadow-zen relative transition-all duration-300",
          "hover:-translate-y-1 hover:shadow-washi",
          "after:absolute after:bottom-0 after:left-[-10px] after:w-5 after:h-5 after:bg-gradient-to-br after:from-primary/10 after:to-primary/5 after:border-l after:border-b after:border-primary/20 after:rounded-bl-xl",
          className
        )}>
          <div className="animate-fade-in">{children}</div>
        </div>
      ) : (
        <div className={cn(
          "flex flex-col space-y-2 p-5 rounded-md bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 shadow-zen relative transition-all duration-300",
          "hover:-translate-y-1 hover:shadow-washi",
          "after:absolute after:bottom-0 after:right-[-10px] after:w-5 after:h-5 after:bg-gradient-to-br after:from-accent/10 after:to-accent/5 after:border-r after:border-b after:border-accent/20 after:rounded-br-xl",
          className
        )}>
          <div className="animate-fade-in">{children}</div>
        </div>
      )}
    </>
  );
} 