"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster 
      position="top-right" 
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: '8px',
        },
      }}
    />
  );
} 