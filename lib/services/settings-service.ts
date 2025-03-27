import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the types for user settings
export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  bio: string;
  school: string;
  major: string;
}

export type ThemeType = 'system';
export type StudySessionDuration = 25 | 30 | 45 | 60;
export type StudySessionFormat = 'pomodoro' | 'fixed' | 'flexible';
export type AIPersona = 'tutor' | 'mentor' | 'coach' | 'friend';
export type NotificationLevel = 'all' | 'important' | 'none';

export interface UserSettings {
  profile: UserProfile;
  appearance: {
    theme: ThemeType;
    enableAnimations: boolean;
    compactSidebar: boolean;
    fontSize: 'small' | 'medium' | 'large';
    highContrastMode: boolean;
  };
  studyPreferences: {
    defaultSessionDuration: StudySessionDuration;
    sessionFormat: StudySessionFormat;
    enableReminders: boolean;
    reminderInterval: number;
    autoStartBreaks: boolean;
    showProgressStats: boolean;
  };
  aiAssistant: {
    persona: AIPersona;
    enableSuggestions: boolean;
    voiceInteraction: boolean;
    responseLength: 'concise' | 'detailed' | 'comprehensive';
    saveHistory: boolean;
  };
  notifications: {
    studyReminders: boolean;
    sessionSummaries: boolean;
    friendRequests: boolean;
    groupMessages: boolean;
    resourceSharing: boolean;
    emailNotifications: boolean;
    notificationLevel: NotificationLevel;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    activityStatus: boolean;
    shareStudyStats: boolean;
    allowFriendRequests: boolean;
    allowGroupInvites: boolean;
    dataCollection: boolean;
  };
  connected: {
    google: boolean;
    github: boolean;
    microsoft: boolean;
    apple: boolean;
  };
  accessibility: {
    screenReader: boolean;
    reducedMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
  };
}

// Default settings
const defaultSettings: UserSettings = {
  profile: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    avatar: '/avatars/user-avatar.jpg',
    bio: 'Computer Science student interested in machine learning and web development.',
    school: 'Stanford University',
    major: 'Computer Science'
  },
  appearance: {
    theme: 'system',
    enableAnimations: true,
    compactSidebar: false,
    fontSize: 'medium',
    highContrastMode: false
  },
  studyPreferences: {
    defaultSessionDuration: 25,
    sessionFormat: 'pomodoro',
    enableReminders: true,
    reminderInterval: 5,
    autoStartBreaks: false,
    showProgressStats: true
  },
  aiAssistant: {
    persona: 'tutor',
    enableSuggestions: true,
    voiceInteraction: false,
    responseLength: 'detailed',
    saveHistory: true
  },
  notifications: {
    studyReminders: true,
    sessionSummaries: true,
    friendRequests: true,
    groupMessages: true,
    resourceSharing: true,
    emailNotifications: false,
    notificationLevel: 'important'
  },
  privacy: {
    profileVisibility: 'friends',
    activityStatus: true,
    shareStudyStats: true,
    allowFriendRequests: true,
    allowGroupInvites: true,
    dataCollection: true
  },
  connected: {
    google: true,
    github: true,
    microsoft: false,
    apple: false
  },
  accessibility: {
    screenReader: false,
    reducedMotion: false,
    highContrast: false,
    largeText: false
  }
};

// Create a store with Zustand for managing settings
export const useSettingsStore = create(
  persist<{
    settings: UserSettings;
    updateProfile: (profile: Partial<UserProfile>) => void;
    updateAppearance: (appearance: Partial<typeof defaultSettings.appearance>) => void;
    updateStudyPreferences: (preferences: Partial<typeof defaultSettings.studyPreferences>) => void;
    updateAIAssistant: (aiSettings: Partial<typeof defaultSettings.aiAssistant>) => void;
    updateNotifications: (notifications: Partial<typeof defaultSettings.notifications>) => void;
    updatePrivacy: (privacy: Partial<typeof defaultSettings.privacy>) => void;
    updateConnected: (connected: Partial<typeof defaultSettings.connected>) => void;
    updateAccessibility: (accessibility: Partial<typeof defaultSettings.accessibility>) => void;
    resetSettings: () => void;
  }>(
    (set) => ({
      settings: defaultSettings,
      updateProfile: (profile) =>
        set((state) => ({
          settings: {
            ...state.settings,
            profile: { ...state.settings.profile, ...profile }
          }
        })),
      updateAppearance: (appearance) =>
        set((state) => ({
          settings: {
            ...state.settings,
            appearance: { ...state.settings.appearance, ...appearance }
          }
        })),
      updateStudyPreferences: (preferences) =>
        set((state) => ({
          settings: {
            ...state.settings,
            studyPreferences: { ...state.settings.studyPreferences, ...preferences }
          }
        })),
      updateAIAssistant: (aiSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            aiAssistant: { ...state.settings.aiAssistant, ...aiSettings }
          }
        })),
      updateNotifications: (notifications) =>
        set((state) => ({
          settings: {
            ...state.settings,
            notifications: { ...state.settings.notifications, ...notifications }
          }
        })),
      updatePrivacy: (privacy) =>
        set((state) => ({
          settings: {
            ...state.settings,
            privacy: { ...state.settings.privacy, ...privacy }
          }
        })),
      updateConnected: (connected) =>
        set((state) => ({
          settings: {
            ...state.settings,
            connected: { ...state.settings.connected, ...connected }
          }
        })),
      updateAccessibility: (accessibility) =>
        set((state) => ({
          settings: {
            ...state.settings,
            accessibility: { ...state.settings.accessibility, ...accessibility }
          }
        })),
      resetSettings: () => set({ settings: defaultSettings })
    }),
    {
      name: 'atena-settings',
      getStorage: () => localStorage,
    }
  )
);

// Helper functions to work with settings
export function applyTheme(theme: 'system'): void {
  // No-op function to maintain compatibility
  return;
}

// Utility function to update font size
export function applyFontSize(size: 'small' | 'medium' | 'large'): void {
  if (typeof window === 'undefined') return;
  
  const root = window.document.documentElement;
  
  switch (size) {
    case 'small':
      root.style.fontSize = '14px';
      break;
    case 'medium':
      root.style.fontSize = '16px';
      break;
    case 'large':
      root.style.fontSize = '18px';
      break;
  }
}

// Utility function for handling high contrast mode
export function applyHighContrast(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  
  const root = window.document.documentElement;
  
  if (enabled) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }
}

// Export a function that initializes the theme based on stored settings
export function initializeTheme(): void {
  const settings = useSettingsStore.getState().settings;
  applyFontSize(settings.appearance.fontSize);
  applyHighContrast(settings.appearance.highContrastMode);
} 