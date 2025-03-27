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
          "flex flex-col space-y-2 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 shadow-zen relative",
          "after:absolute after:bottom-0 after:left-[-8px] after:w-4 after:h-4 after:bg-gradient-to-br after:from-primary/5 after:to-primary/10 after:border-l after:border-b after:border-primary/20 after:rounded-bl-xl",
          className
        )}>
          {children}
        </div>
      ) : (
        <div className={cn(
          "flex flex-col space-y-2 p-4 rounded-xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 shadow-zen relative",
          "after:absolute after:bottom-0 after:right-[-8px] after:w-4 after:h-4 after:bg-gradient-to-br after:from-accent/5 after:to-accent/10 after:border-r after:border-b after:border-accent/20 after:rounded-br-xl",
          className
        )}>
          {children}
        </div>
      )}
    </>
  );
} 