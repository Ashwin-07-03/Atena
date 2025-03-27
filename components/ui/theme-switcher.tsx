"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Check, ChevronDown, Grape, Cherry, FlameKindling, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const themeOptions = [
  {
    value: "blackberry",
    label: "Blackberry",
    description: "Deep purple with lavender accents",
    icon: Grape,
  },
  {
    value: "blueberry",
    label: "Blueberry",
    description: "Deep blue with sky blue highlights",
    icon: Grape,
  },
  {
    value: "pomegranate",
    label: "Pomegranate",
    description: "Rich crimson with soft pink accents",
    icon: FlameKindling,
  },
  {
    value: "cherry",
    label: "Cherry",
    description: "Vibrant pink with soft magenta tones",
    icon: Cherry,
  },
  {
    value: "tangerine",
    label: "Tangerine",
    description: "Warm orange with golden highlights",
    icon: FlameKindling,
  },
  {
    value: "lime",
    label: "Lime",
    description: "Fresh green with bright highlights",
    icon: Leaf,
  },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  
  // Find the current theme option based on the active theme
  const currentTheme = themeOptions.find(
    (option) => option.value === theme
  ) || themeOptions[0];

  const Icon = currentTheme.icon || Grape;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-primary/20 shadow-juice transition-all duration-300 hover:scale-105"
        >
          <Icon className="h-4 w-4 text-primary animate-wiggle" />
          <span className="hidden md:inline-block">{currentTheme.label}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px] rounded-xl p-2 bg-card/95 backdrop-blur-md border border-primary/20 shadow-juice">
        {themeOptions.map((option) => {
          const OptionIcon = option.icon || Grape;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={cn(
                "flex items-center gap-3 cursor-pointer rounded-lg py-3 px-2 mb-1 transition-all duration-300 hover:scale-105",
                theme === option.value ? "bg-primary/15 text-primary font-medium" : "hover:bg-primary/5"
              )}
            >
              <OptionIcon className="h-5 w-5 text-primary" />
              <div className="flex flex-col flex-1">
                <span className="text-sm font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.description}</span>
              </div>
              {theme === option.value && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 