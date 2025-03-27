"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="blackberry"
      themes={["blackberry", "blueberry", "pomegranate", "cherry", "tangerine", "lime"]}
      enableSystem={false}
      value={{
        blackberry: "theme-blackberry",
        blueberry: "theme-blueberry",
        pomegranate: "theme-pomegranate", 
        cherry: "theme-cherry",
        tangerine: "theme-tangerine",
        lime: "theme-lime",
        dark: "dark",
        light: "light",
      }}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
} 