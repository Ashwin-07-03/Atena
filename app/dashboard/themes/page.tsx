"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Check } from "lucide-react";
import DashboardLayout from '@/components/dashboard-layout';

const themeOptions = [
  {
    value: "traditional",
    label: "Traditional",
    description: "Classic Japanese colors with Indigo blue and warm accents",
    colors: ["#3B5D7A", "#EBBFC4", "#C6DACA", "#EBDBB8", "#24426A"],
  },
  {
    value: "sado",
    label: "Tea Ceremony",
    description: "Warm earth tones inspired by the art of tea ceremony",
    colors: ["#73573F", "#EBC4AF", "#DDD4BE", "#CCB173", "#AD6E51"],
  },
  {
    value: "zen",
    label: "Zen Garden",
    description: "Minimalist monochrome palette inspired by rock gardens",
    colors: ["#4D4D4D", "#CDC0B5", "#D9D9D9", "#A99E91", "#666666"],
  },
  {
    value: "sakura",
    label: "Cherry Blossom",
    description: "Soft pink hues celebrating the beauty of sakura",
    colors: ["#A24057", "#EAAFC3", "#E5D2CA", "#E4B9AE", "#7B4857"],
  },
  {
    value: "sometsuke",
    label: "Porcelain",
    description: "Blue and white inspired by traditional porcelain",
    colors: ["#234173", "#A9B4D6", "#C7D4DE", "#8FC6D9", "#172F52"],
  },
];

export default function ThemesPage() {
  const { theme, setTheme } = useTheme();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-light tracking-wide">Japanese Color Themes</h1>
          <p className="text-muted-foreground mt-2">
            Choose from a variety of traditional Japanese color palettes for your study experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themeOptions.map((option) => (
            <Card key={option.value} className={`overflow-hidden ${theme === option.value ? 'ring-2 ring-primary' : ''}`}>
              <CardHeader className="pb-2">
                <CardTitle>{option.label}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 mb-4">
                  {option.colors.map((color, i) => (
                    <div 
                      key={i}
                      className="w-8 h-8 rounded-sm shadow-zen transition-all hover:scale-110"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="p-4 border rounded-sm bg-background/50 aspect-video flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-32 h-32">
                      <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill={option.colors[0]} />
                      </svg>
                    </div>
                    <div className="absolute bottom-4 left-4 w-24 h-24">
                      <svg viewBox="0 0 100 100">
                        <rect x="20" y="20" width="60" height="60" fill={option.colors[2]} />
                      </svg>
                    </div>
                  </div>
                  <div className="z-10 text-center">
                    <span className="font-medium tracking-wide" style={{ color: option.colors[0] }}>
                      {option.label} Theme
                    </span>
                    <div className="text-sm text-muted-foreground mt-1">
                      和の美しさ
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => setTheme(option.value)} 
                  variant={theme === option.value ? "default" : "outline"}
                  className="w-full"
                >
                  {theme === option.value ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Current Theme
                    </>
                  ) : (
                    "Apply Theme"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
} 