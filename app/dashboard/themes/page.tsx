"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Check, Grape, Cherry, FlameKindling, Leaf } from "lucide-react";

const themeOptions = [
  {
    value: "blackberry",
    label: "Blackberry",
    description: "Deep purple with lavender accents",
    colors: ["#5D3FD3", "#C1A7F7", "#DCD6ED", "#DBD0F5", "#180A4A"],
    icon: Grape,
  },
  {
    value: "blueberry",
    label: "Blueberry",
    description: "Deep blue with sky blue highlights",
    colors: ["#3D70D3", "#A7C1F7", "#D6E0ED", "#D0DBF5", "#0A1A4A"],
    icon: Grape,
  },
  {
    value: "pomegranate",
    label: "Pomegranate",
    description: "Rich crimson with soft pink accents",
    colors: ["#D33D4E", "#F7A7B3", "#EDD6DA", "#F5D0D8", "#4A0A15"],
    icon: FlameKindling,
  },
  {
    value: "cherry",
    label: "Cherry",
    description: "Vibrant pink with soft magenta tones",
    colors: ["#D33D9E", "#F7A7E0", "#EDD6E5", "#F5D0ED", "#4A0A3A"],
    icon: Cherry,
  },
  {
    value: "tangerine",
    label: "Tangerine",
    description: "Warm orange with golden highlights",
    colors: ["#F5AD3D", "#F9D6A7", "#EDE2D6", "#F5E2D0", "#4A290A"],
    icon: FlameKindling,
  },
  {
    value: "lime",
    label: "Lime",
    description: "Fresh green with bright highlights",
    colors: ["#8DD33D", "#D3F7A7", "#E1EDD6", "#E8F5D0", "#0B4A0A"],
    icon: Leaf,
  },
];

export default function ThemesPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-8">
      <div className="text-center mb-12 relative">
        <h1 className="text-4xl font-light tracking-wide mb-3 relative inline-block">
          Fruit-Inspired Color Themes
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 animate-pulse-juice"></div>
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Choose from a variety of delicious fruit-inspired palettes to customize your experience
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {themeOptions.map((option) => {
          const OptionIcon = option.icon || Grape;
          const isActive = theme === option.value;
          
          return (
            <Card 
              key={option.value} 
              className={`overflow-hidden transition-all duration-500 hover:scale-105 ${isActive ? 'ring-2 ring-primary shadow-juice' : 'hover:shadow-juice'}`}
            >
              <CardHeader className="pb-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 -mt-10 -mr-10 opacity-10">
                  <OptionIcon size={128} className="text-primary animate-float-bubble" />
                </div>
                <CardTitle className="flex items-center gap-3">
                  <OptionIcon className="h-6 w-6 text-primary" />
                  {option.label}
                </CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 mb-6">
                  {option.colors.map((color, i) => (
                    <div 
                      key={i}
                      className="w-10 h-10 rounded-xl shadow-juice transition-all hover:scale-125 hover:rotate-12"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="p-5 border rounded-xl bg-card/50 aspect-video flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-32 h-32 animate-gentle-rotate" style={{animationDuration: '30s'}}>
                      <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill={option.colors[0]} />
                      </svg>
                    </div>
                    <div className="absolute bottom-4 left-4 w-24 h-24 animate-gentle-rotate" style={{animationDuration: '40s', animationDirection: 'reverse'}}>
                      <svg viewBox="0 0 100 100">
                        <rect x="20" y="20" width="60" height="60" fill={option.colors[1]} rx="8" ry="8" />
                      </svg>
                    </div>
                  </div>
                  <div className="z-10 text-center">
                    <span className="font-medium tracking-wide text-lg" style={{ color: option.colors[0] }}>
                      {option.label} Theme
                    </span>
                    <div className="text-sm text-muted-foreground mt-1">
                      Juicy & Refreshing
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => setTheme(option.value)} 
                  variant={isActive ? "default" : "outline"}
                  className={`w-full rounded-xl transition-all duration-500 ${isActive ? 'bg-primary hover:scale-105' : 'hover:bg-primary/10'}`}
                >
                  {isActive ? (
                    <>
                      <Check className="mr-2 h-4 w-4 animate-wiggle" />
                      Current Theme
                    </>
                  ) : (
                    "Apply Theme"
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 