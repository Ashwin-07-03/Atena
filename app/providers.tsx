"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/ui/toast-provider";
import { ThemeInitializer } from "@/components/theme-initializer";

// Create a client
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ThemeInitializer />
        {children}
        <Toaster />
        <ToastProvider />
      </ThemeProvider>
    </QueryClientProvider>
  );
} 