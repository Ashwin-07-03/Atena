"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Check, ChevronDown } from "lucide-react";
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
    value: "traditional",
    label: "Traditional",
    description: "Classic Japanese colors with Indigo blue and warm accents",
  },
  {
    value: "sado",
    label: "Tea Ceremony",
    description: "Warm earth tones inspired by the art of tea ceremony",
  },
  {
    value: "zen",
    label: "Zen Garden",
    description: "Minimalist monochrome palette inspired by rock gardens",
  },
  {
    value: "sakura",
    label: "Cherry Blossom",
    description: "Soft pink hues celebrating the beauty of sakura",
  },
  {
    value: "sometsuke",
    label: "Porcelain",
    description: "Blue and white inspired by traditional porcelain",
  },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  
  // Find the current theme option based on the active theme
  const currentTheme = themeOptions.find(
    (option) => option.value === theme
  ) || themeOptions[0];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-1 px-3 py-2 rounded-sm border border-accent/10 shadow-zen"
        >
          <span className="hidden md:inline-block">{currentTheme.label}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] rounded-sm">
        {themeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={cn(
              "flex items-center gap-2 cursor-pointer rounded-sm py-2",
              theme === option.value && "bg-accent/10"
            )}
          >
            <div className="flex flex-col flex-1">
              <span className="text-sm font-medium">{option.label}</span>
              <span className="text-xs text-muted-foreground">{option.description}</span>
            </div>
            {theme === option.value && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 