"use client";

import { useEffect } from "react";
import { useSettingsStore, applyTheme, applyFontSize, applyHighContrast } from "@/lib/services/settings-service";

export function ThemeInitializer() {
  const settings = useSettingsStore((state) => state.settings);

  useEffect(() => {
    // Apply theme settings on initial load
    applyTheme(settings.appearance.theme);
    applyFontSize(settings.appearance.fontSize);
    applyHighContrast(settings.appearance.highContrastMode);
    
    // Also apply reduced motion if needed
    if (settings.accessibility.reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    }
    
    // Apply large text if enabled
    if (settings.accessibility.largeText) {
      document.documentElement.classList.add('large-text');
    }
  }, [settings]);

  return null;
} 