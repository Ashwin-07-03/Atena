"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Check } from "lucide-react";
import DashboardLayout from '@/components/dashboard-layout';

const themeOptions = [
  {
    value: "ethereal",
    label: "Ethereal Japanese",
    description: "Wabi-sabi cream, matcha green and cherry blossom accents",
    colors: ["#60A77B", "#E3ACAC", "#A5C4D1", "#D4C4A8", "#F5EFE0"],
  },
  {
    value: "vibrant",
    label: "Vibrant",
    description: "Bold Japanese colors with bright blues and pinks",
    colors: ["#1C6DD0", "#F86E8B", "#C9EED3", "#F8C651", "#1340B6"],
  },
  {
    value: "traditional",
    label: "Traditional",
    description: "Classic Japanese colors with Indigo blue and warm accents",
    colors: ["#226A9F", "#F7A8AC", "#A9E0B8", "#F9D675", "#1B4080"],
  },
  {
    value: "sakura",
    label: "Cherry Blossom",
    description: "Soft pink hues celebrating the beauty of sakura",
    colors: ["#D51E62", "#F992CC", "#F0CAB9", "#F5937D", "#A02654"],
  },
  {
    value: "kyoto",
    label: "Kyoto Garden",
    description: "Fresh green palette inspired by moss gardens",
    colors: ["#0D9B63", "#F2D04B", "#C2E8E4", "#ECA23E", "#0F6647"],
  },
  {
    value: "sometsuke",
    label: "Porcelain",
    description: "Blue and white inspired by traditional porcelain",
    colors: ["#0A43A6", "#8C9FE6", "#A7D6EB", "#48C7E6", "#0A2A61"],
  },
  {
    value: "sado",
    label: "Tea Ceremony",
    description: "Warm earth tones inspired by the art of tea ceremony",
    colors: ["#8F471C", "#F9B186", "#E5CA89", "#E9B939", "#AD6E51"],
  },
  {
    value: "zen",
    label: "Zen Garden",
    description: "Minimalist monochrome palette inspired by rock gardens",
    colors: ["#404040", "#CFBFB1", "#E6E6E6", "#B39B87", "#262626"],
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