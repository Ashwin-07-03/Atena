"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-normal tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-zen hover:bg-primary/90 active:translate-y-0.5 rounded-sm border border-transparent",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:translate-y-0.5 rounded-sm border border-transparent",
        outline:
          "border border-input bg-background/50 hover:bg-accent/10 hover:border-accent/50 hover:text-accent-foreground active:translate-y-0.5 rounded-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 active:translate-y-0.5 rounded-sm border border-transparent",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground active:translate-y-0.5",
        link: "text-primary underline-offset-4 hover:underline",
        subtle: "bg-sky/10 text-foreground hover:bg-sky/20 active:translate-y-0.5 rounded-sm border border-transparent",
        flat: "border border-input bg-transparent hover:bg-sky/10 hover:border-sky/30 active:translate-y-0.5 rounded-sm",
        icon: "h-9 w-9 p-0 rounded-sm hover:bg-accent/10 hover:text-accent-foreground hover:border-accent/20",
      },
      size: {
        default: "h-10 px-6 py-2.5",
        sm: "h-8 px-4 py-2 text-xs",
        lg: "h-11 px-8 py-3 text-base",
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
