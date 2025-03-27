"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        outline:
          "border border-primary/30 bg-background shadow-sm hover:border-primary/50 hover:bg-primary/10 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
        ghost: "hover:bg-primary/10 hover:text-primary-foreground hover:scale-[1.02] active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline",
        subtle: "bg-muted/50 text-foreground hover:bg-muted/80 hover:scale-[1.02] active:scale-[0.98] shadow-sm",
        flat: "border border-primary/20 bg-transparent hover:bg-primary/10 hover:border-primary/30 hover:scale-[1.02] active:scale-[0.98]",
        icon: "h-9 w-9 p-0 hover:bg-primary/10 hover:scale-[1.05] active:scale-[0.95]",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 rounded-full px-3.5 text-xs",
        lg: "h-11 rounded-full px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
