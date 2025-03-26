"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, Bell, Lock, Shield, Palette, Brain, Moon, Sun, LogOut, Save, Settings as SettingsIcon,
  Check, ChevronRight, ChevronLeft, Computer, Plus, Minus, PenLine, Trash, Eye, EyeOff, RefreshCw
} from "lucide-react";
import { toast } from "sonner";

// UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Settings Service
import { 
  useSettingsStore, 
  applyTheme, 
  applyFontSize, 
  applyHighContrast,
  ThemeType,
  StudySessionDuration,
  StudySessionFormat,
  AIPersona,
  NotificationLevel
} from "@/lib/services/settings-service";

export default function SettingsPage() {
  // Get settings from store
  const { 
    settings, 
    updateProfile, 
    updateAppearance, 
    updateStudyPreferences, 
    updateAIAssistant, 
    updateNotifications, 
    updatePrivacy,
    updateConnected,
    updateAccessibility,
    resetSettings
  } = useSettingsStore();
  
  // Local form state
  const [activeTab, setActiveTab] = useState("profile");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [profileForm, setProfileForm] = useState(settings.profile);
  const router = useRouter();

  // Apply current settings on initial load
  useEffect(() => {
    applyTheme(settings.appearance.theme);
    applyFontSize(settings.appearance.fontSize);
    applyHighContrast(settings.appearance.highContrastMode);
  }, [settings.appearance.theme, settings.appearance.fontSize, settings.appearance.highContrastMode]);

  // Save all changes
  const handleSaveChanges = () => {
    // Update all settings at once
    updateProfile(profileForm);
    
    // Apply visual changes
    applyTheme(settings.appearance.theme);
    applyFontSize(settings.appearance.fontSize);
    applyHighContrast(settings.appearance.highContrastMode);
    
    // Reset unsaved changes flag
    setHasUnsavedChanges(false);
    toast.success("Your settings have been saved successfully");
  };

  // Reset all settings to defaults
  const handleResetSettings = () => {
    resetSettings();
    setProfileForm(settings.profile);
    setHasUnsavedChanges(false);
    setShowResetDialog(false);
    toast.info("All settings have been reset to defaults");
  };

  // Update profile form
  const handleProfileChange = (field: string, value: string) => {
    setProfileForm({ ...profileForm, [field]: value });
    setHasUnsavedChanges(true);
  };

  // Update appearance settings
  const handleAppearanceChange = <K extends keyof typeof settings.appearance>(
    field: K, 
    value: typeof settings.appearance[K]
  ) => {
    updateAppearance({ [field]: value });
    setHasUnsavedChanges(true);
  };

  // Update study preferences
  const handleStudyPreferencesChange = <K extends keyof typeof settings.studyPreferences>(
    field: K, 
    value: typeof settings.studyPreferences[K]
  ) => {
    updateStudyPreferences({ [field]: value });
    setHasUnsavedChanges(true);
  };

  // Update AI assistant settings
  const handleAIAssistantChange = <K extends keyof typeof settings.aiAssistant>(
    field: K, 
    value: typeof settings.aiAssistant[K]
  ) => {
    updateAIAssistant({ [field]: value });
    setHasUnsavedChanges(true);
  };

  // Update notifications
  const handleNotificationsChange = <K extends keyof typeof settings.notifications>(
    field: K, 
    value: typeof settings.notifications[K]
  ) => {
    updateNotifications({ [field]: value });
    setHasUnsavedChanges(true);
  };

  // Update privacy settings
  const handlePrivacyChange = <K extends keyof typeof settings.privacy>(
    field: K, 
    value: typeof settings.privacy[K]
  ) => {
    updatePrivacy({ [field]: value });
    setHasUnsavedChanges(true);
  };

  // Update connected accounts
  const handleConnectedChange = <K extends keyof typeof settings.connected>(
    field: K, 
    value: typeof settings.connected[K]
  ) => {
    updateConnected({ [field]: value });
    setHasUnsavedChanges(true);
  };

  // Update accessibility settings
  const handleAccessibilityChange = <K extends keyof typeof settings.accessibility>(
    field: K, 
    value: typeof settings.accessibility[K]
  ) => {
    updateAccessibility({ [field]: value });
    setHasUnsavedChanges(true);
  };

  return (
    <div className="container mx-auto max-w-screen-xl py-6">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar */}
        <div className="hidden md:block space-y-6">
          <div className="flex flex-col space-y-1">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            
            <Button 
              variant={activeTab === "profile" ? "default" : "ghost"} 
              className="justify-start" 
              onClick={() => setActiveTab("profile")}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            
            <Button 
              variant={activeTab === "appearance" ? "default" : "ghost"} 
              className="justify-start" 
              onClick={() => setActiveTab("appearance")}
            >
              <Palette className="mr-2 h-4 w-4" />
              Appearance
            </Button>
            
            <Button 
              variant={activeTab === "studyPreferences" ? "default" : "ghost"} 
              className="justify-start" 
              onClick={() => setActiveTab("studyPreferences")}
            >
              <Brain className="mr-2 h-4 w-4" />
              Study Preferences
            </Button>
            
            <Button 
              variant={activeTab === "aiAssistant" ? "default" : "ghost"} 
              className="justify-start" 
              onClick={() => setActiveTab("aiAssistant")}
            >
              <Brain className="mr-2 h-4 w-4" />
              AI Assistant
            </Button>
            
            <Button 
              variant={activeTab === "notifications" ? "default" : "ghost"} 
              className="justify-start" 
              onClick={() => setActiveTab("notifications")}
            >
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
            
            <Button 
              variant={activeTab === "privacy" ? "default" : "ghost"} 
              className="justify-start" 
              onClick={() => setActiveTab("privacy")}
            >
              <Lock className="mr-2 h-4 w-4" />
              Privacy
            </Button>
            
            <Button 
              variant={activeTab === "connected" ? "default" : "ghost"} 
              className="justify-start" 
              onClick={() => setActiveTab("connected")}
            >
              <Shield className="mr-2 h-4 w-4" />
              Connected Accounts
            </Button>
            
            <Button 
              variant={activeTab === "accessibility" ? "default" : "ghost"} 
              className="justify-start" 
              onClick={() => setActiveTab("accessibility")}
            >
              <SettingsIcon className="mr-2 h-4 w-4" />
              Accessibility
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex flex-col space-y-4">
            <Button 
              variant="destructive" 
              className="justify-start" 
              onClick={() => setShowResetDialog(true)}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Settings
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start text-destructive"
              onClick={() => router.push("/auth/logout")}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Mobile Tabs - Only visible on small screens */}
        <div className="md:hidden">
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="appearance">Look</TabsTrigger>
              <TabsTrigger value="notifications">Alerts</TabsTrigger>
              <TabsTrigger value="more">More</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {activeTab === "more" && (
            <div className="flex flex-wrap gap-2 mb-4">
              <Button size="sm" variant="outline" onClick={() => setActiveTab("studyPreferences")}>
                Study
              </Button>
              <Button size="sm" variant="outline" onClick={() => setActiveTab("aiAssistant")}>
                AI
              </Button>
              <Button size="sm" variant="outline" onClick={() => setActiveTab("privacy")}>
                Privacy
              </Button>
              <Button size="sm" variant="outline" onClick={() => setActiveTab("connected")}>
                Accounts
              </Button>
              <Button size="sm" variant="outline" onClick={() => setActiveTab("accessibility")}>
                Access
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowResetDialog(true)}>
                Reset
              </Button>
            </div>
          )}
        </div>

        {/* Main content area */}
        <div className="space-y-6">
          {/* Floating save changes bar */}
          {hasUnsavedChanges && (
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border rounded-lg p-4 mb-4 flex items-center justify-between">
              <p>You have unsaved changes</p>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => router.refresh()}>
                  Cancel
                </Button>
                <Button onClick={handleSaveChanges}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* Profile Settings */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Profile Settings</h1>
                <Button onClick={handleSaveChanges} disabled={!hasUnsavedChanges}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your profile details and account information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center gap-3">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profileForm.avatar} alt="Profile" />
                        <AvatarFallback>
                          {profileForm.firstName[0]}{profileForm.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Change
                        </Button>
                        <Button variant="ghost" size="sm">
                          Remove
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex-1 grid gap-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            value={profileForm.firstName}
                            onChange={(e) => handleProfileChange('firstName', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            value={profileForm.lastName}
                            onChange={(e) => handleProfileChange('lastName', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={profileForm.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Write a short bio about yourself"
                      value={profileForm.bio}
                      onChange={(e) => handleProfileChange('bio', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This will be displayed on your public profile
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="school">School/University</Label>
                      <Input 
                        id="school" 
                        value={profileForm.school}
                        onChange={(e) => handleProfileChange('school', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="major">Major/Field of Study</Label>
                      <Input 
                        id="major" 
                        value={profileForm.major}
                        onChange={(e) => handleProfileChange('major', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4 bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                  <CardDescription>
                    View your account information and status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Status</h3>
                      <div className="bg-green-500/10 text-green-500 flex items-center gap-2 py-2 px-3 rounded-md">
                        <Shield className="h-4 w-4" />
                        <span>Your account is active and in good standing</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Subscription</h3>
                      <div className="bg-primary/10 text-primary flex items-center gap-2 py-2 px-3 rounded-md">
                        <Brain className="h-4 w-4" />
                        <span>Pro Plan - Renews on May 1, 2023</span>
                      </div>
                      <Button variant="outline" size="sm" className="mt-3">
                        Manage Subscription
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Appearance</h1>
                <Button onClick={handleSaveChanges} disabled={!hasUnsavedChanges}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Theme Settings</CardTitle>
                  <CardDescription>
                    Customize the look and feel of the application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div 
                        className={`relative flex aspect-square flex-col items-center justify-center rounded-xl border-2 bg-background p-2 hover:border-primary ${settings.appearance.theme === 'light' ? 'border-primary' : 'border-border'}`}
                        onClick={() => handleAppearanceChange('theme', 'light')}
                      >
                        <div className="mb-2 rounded-md border bg-white p-2 shadow-sm">
                          <div className="space-y-2">
                            <div className="h-2 w-8 rounded-lg bg-gray-400" />
                            <div className="h-2 w-16 rounded-lg bg-gray-300" />
                          </div>
                        </div>
                        <span className="text-xs font-medium">Light</span>
                        {settings.appearance.theme === 'light' && (
                          <div className="absolute right-2 top-2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                      
                      <div 
                        className={`relative flex aspect-square flex-col items-center justify-center rounded-xl border-2 bg-background p-2 hover:border-primary ${settings.appearance.theme === 'dark' ? 'border-primary' : 'border-border'}`}
                        onClick={() => handleAppearanceChange('theme', 'dark')}
                      >
                        <div className="mb-2 rounded-md border bg-gray-900 p-2 shadow-sm">
                          <div className="space-y-2">
                            <div className="h-2 w-8 rounded-lg bg-gray-700" />
                            <div className="h-2 w-16 rounded-lg bg-gray-800" />
                          </div>
                        </div>
                        <span className="text-xs font-medium">Dark</span>
                        {settings.appearance.theme === 'dark' && (
                          <div className="absolute right-2 top-2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                      
                      <div 
                        className={`relative flex aspect-square flex-col items-center justify-center rounded-xl border-2 bg-background p-2 hover:border-primary ${settings.appearance.theme === 'system' ? 'border-primary' : 'border-border'}`}
                        onClick={() => handleAppearanceChange('theme', 'system')}
                      >
                        <div className="mb-2 rounded-md border bg-gradient-to-br from-white to-gray-900 p-2 shadow-sm">
                          <div className="space-y-2">
                            <div className="h-2 w-8 rounded-lg bg-gray-500" />
                            <div className="h-2 w-16 rounded-lg bg-gray-600" />
                          </div>
                        </div>
                        <span className="text-xs font-medium">System</span>
                        {settings.appearance.theme === 'system' && (
                          <div className="absolute right-2 top-2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Font Size</h3>
                    <div className="flex flex-col space-y-2">
                      <div className="grid grid-cols-3 gap-4">
                        <Button 
                          variant={settings.appearance.fontSize === "small" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleAppearanceChange('fontSize', 'small')}
                        >
                          Small
                        </Button>
                        <Button 
                          variant={settings.appearance.fontSize === "medium" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleAppearanceChange('fontSize', 'medium')}
                        >
                          Medium
                        </Button>
                        <Button 
                          variant={settings.appearance.fontSize === "large" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleAppearanceChange('fontSize', 'large')}
                        >
                          Large
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Preview: 
                        <span className={settings.appearance.fontSize === "small" ? "text-sm" : 
                                        settings.appearance.fontSize === "medium" ? "text-base" : 
                                        "text-lg"}>
                          This is how your text will appear
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Animations</h3>
                        <p className="text-sm text-muted-foreground">
                          Enable or disable UI animations
                        </p>
                      </div>
                      <Switch 
                        checked={settings.appearance.enableAnimations}
                        onCheckedChange={(checked) => handleAppearanceChange('enableAnimations', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Compact Sidebar</h3>
                        <p className="text-sm text-muted-foreground">
                          Use a more compact sidebar for navigation
                        </p>
                      </div>
                      <Switch 
                        checked={settings.appearance.compactSidebar}
                        onCheckedChange={(checked) => handleAppearanceChange('compactSidebar', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">High Contrast Mode</h3>
                        <p className="text-sm text-muted-foreground">
                          Increases contrast for better visibility
                        </p>
                      </div>
                      <Switch 
                        checked={settings.appearance.highContrastMode}
                        onCheckedChange={(checked) => handleAppearanceChange('highContrastMode', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Study Preferences */}
          {activeTab === "studyPreferences" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Study Preferences</h1>
                <Button onClick={handleSaveChanges} disabled={!hasUnsavedChanges}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Study Session Settings</CardTitle>
                  <CardDescription>
                    Customize your study sessions and timing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Default Session Duration</h3>
                    <RadioGroup 
                      value={String(settings.studyPreferences.defaultSessionDuration)} 
                      onValueChange={(value: string) => handleStudyPreferencesChange('defaultSessionDuration', Number(value) as StudySessionDuration)}
                      className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                    >
                      <div>
                        <RadioGroupItem value="25" id="duration-25" className="peer sr-only" />
                        <Label
                          htmlFor="duration-25"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span className="text-2xl font-bold">25</span>
                          <span className="text-sm">minutes</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem value="30" id="duration-30" className="peer sr-only" />
                        <Label
                          htmlFor="duration-30"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span className="text-2xl font-bold">30</span>
                          <span className="text-sm">minutes</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem value="45" id="duration-45" className="peer sr-only" />
                        <Label
                          htmlFor="duration-45"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span className="text-2xl font-bold">45</span>
                          <span className="text-sm">minutes</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem value="60" id="duration-60" className="peer sr-only" />
                        <Label
                          htmlFor="duration-60"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span className="text-2xl font-bold">60</span>
                          <span className="text-sm">minutes</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Session Format</h3>
                    <RadioGroup 
                      value={settings.studyPreferences.sessionFormat} 
                      onValueChange={(value: string) => handleStudyPreferencesChange('sessionFormat', value as StudySessionFormat)}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                    >
                      <div>
                        <RadioGroupItem value="pomodoro" id="format-pomodoro" className="peer sr-only" />
                        <Label
                          htmlFor="format-pomodoro"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary h-full"
                        >
                          <span className="font-bold">Pomodoro</span>
                          <span className="text-sm text-center mt-2">Alternating study sessions and breaks</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem value="fixed" id="format-fixed" className="peer sr-only" />
                        <Label
                          htmlFor="format-fixed"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary h-full"
                        >
                          <span className="font-bold">Fixed</span>
                          <span className="text-sm text-center mt-2">Single session with fixed duration</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem value="flexible" id="format-flexible" className="peer sr-only" />
                        <Label
                          htmlFor="format-flexible"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary h-full"
                        >
                          <span className="font-bold">Flexible</span>
                          <span className="text-sm text-center mt-2">Open-ended sessions with no fixed duration</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Reminder Interval</h3>
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[settings.studyPreferences.reminderInterval]}
                        min={1}
                        max={15}
                        step={1}
                        onValueChange={(value) => handleStudyPreferencesChange('reminderInterval', value[0])}
                        disabled={!settings.studyPreferences.enableReminders}
                        className="w-full"
                      />
                      <div className="w-12 text-center">{settings.studyPreferences.reminderInterval} min</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Enable Reminders</h3>
                        <p className="text-sm text-muted-foreground">
                          Get notified when it's time to take a break
                        </p>
                      </div>
                      <Switch 
                        checked={settings.studyPreferences.enableReminders}
                        onCheckedChange={(checked) => handleStudyPreferencesChange('enableReminders', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Auto-start Breaks</h3>
                        <p className="text-sm text-muted-foreground">
                          Automatically start break timer after study session ends
                        </p>
                      </div>
                      <Switch 
                        checked={settings.studyPreferences.autoStartBreaks}
                        onCheckedChange={(checked) => handleStudyPreferencesChange('autoStartBreaks', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Show Progress Stats</h3>
                        <p className="text-sm text-muted-foreground">
                          Display progress statistics during study sessions
                        </p>
                      </div>
                      <Switch 
                        checked={settings.studyPreferences.showProgressStats}
                        onCheckedChange={(checked) => handleStudyPreferencesChange('showProgressStats', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* AI Assistant Settings */}
          {activeTab === "aiAssistant" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">AI Assistant</h1>
                <Button onClick={handleSaveChanges} disabled={!hasUnsavedChanges}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>AI Behavior Settings</CardTitle>
                  <CardDescription>
                    Customize how the AI assistant interacts with you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Assistant Persona</h3>
                    <RadioGroup 
                      value={settings.aiAssistant.persona} 
                      onValueChange={(value: string) => handleAIAssistantChange('persona', value as AIPersona)}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <RadioGroupItem value="tutor" id="persona-tutor" className="peer sr-only" />
                        <Label
                          htmlFor="persona-tutor"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary h-full"
                        >
                          <span className="font-bold">Tutor</span>
                          <span className="text-sm text-center mt-2">Focuses on explaining concepts clearly and directly</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem value="mentor" id="persona-mentor" className="peer sr-only" />
                        <Label
                          htmlFor="persona-mentor"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary h-full"
                        >
                          <span className="font-bold">Mentor</span>
                          <span className="text-sm text-center mt-2">Guides your learning with real-world examples</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem value="coach" id="persona-coach" className="peer sr-only" />
                        <Label
                          htmlFor="persona-coach"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary h-full"
                        >
                          <span className="font-bold">Coach</span>
                          <span className="text-sm text-center mt-2">Motivational style focused on building confidence</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem value="friend" id="persona-friend" className="peer sr-only" />
                        <Label
                          htmlFor="persona-friend"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary h-full"
                        >
                          <span className="font-bold">Friend</span>
                          <span className="text-sm text-center mt-2">Casual, conversational learning partner</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Response Length</h3>
                    <RadioGroup 
                      value={settings.aiAssistant.responseLength} 
                      onValueChange={(value: string) => handleAIAssistantChange('responseLength', value as typeof settings.aiAssistant.responseLength)}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="concise" id="length-concise" />
                        <Label htmlFor="length-concise">Concise - Brief, to-the-point answers</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="detailed" id="length-detailed" />
                        <Label htmlFor="length-detailed">Detailed - Comprehensive explanations with examples</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="comprehensive" id="length-comprehensive" />
                        <Label htmlFor="length-comprehensive">Comprehensive - In-depth analysis with multiple perspectives</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Enable Suggestions</h3>
                        <p className="text-sm text-muted-foreground">
                          Allow AI to proactively suggest study topics
                        </p>
                      </div>
                      <Switch 
                        checked={settings.aiAssistant.enableSuggestions}
                        onCheckedChange={(checked) => handleAIAssistantChange('enableSuggestions', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Voice Interaction</h3>
                        <p className="text-sm text-muted-foreground">
                          Enable voice commands and responses
                        </p>
                      </div>
                      <Switch 
                        checked={settings.aiAssistant.voiceInteraction}
                        onCheckedChange={(checked) => handleAIAssistantChange('voiceInteraction', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Save Conversation History</h3>
                        <p className="text-sm text-muted-foreground">
                          Store your AI conversations for future reference
                        </p>
                      </div>
                      <Switch 
                        checked={settings.aiAssistant.saveHistory}
                        onCheckedChange={(checked) => handleAIAssistantChange('saveHistory', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Notifications Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Notifications</h1>
                <Button onClick={handleSaveChanges} disabled={!hasUnsavedChanges}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage what notifications you receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Level</h3>
                    <RadioGroup 
                      value={settings.notifications.notificationLevel} 
                      onValueChange={(value: string) => handleNotificationsChange('notificationLevel', value as NotificationLevel)}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="level-all" />
                        <Label htmlFor="level-all">All Notifications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="important" id="level-important" />
                        <Label htmlFor="level-important">Important Only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="none" id="level-none" />
                        <Label htmlFor="level-none">None</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Study Reminders</h3>
                        <p className="text-sm text-muted-foreground">
                          Scheduled study session notifications
                        </p>
                      </div>
                      <Switch 
                        checked={settings.notifications.studyReminders}
                        onCheckedChange={(checked) => handleNotificationsChange('studyReminders', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Session Summaries</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive study session reports
                        </p>
                      </div>
                      <Switch 
                        checked={settings.notifications.sessionSummaries}
                        onCheckedChange={(checked) => handleNotificationsChange('sessionSummaries', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Friend Requests</h3>
                        <p className="text-sm text-muted-foreground">
                          Notifications for new friend requests
                        </p>
                      </div>
                      <Switch 
                        checked={settings.notifications.friendRequests}
                        onCheckedChange={(checked) => handleNotificationsChange('friendRequests', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Group Messages</h3>
                        <p className="text-sm text-muted-foreground">
                          Notifications for study group chats
                        </p>
                      </div>
                      <Switch 
                        checked={settings.notifications.groupMessages}
                        onCheckedChange={(checked) => handleNotificationsChange('groupMessages', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Resource Sharing</h3>
                        <p className="text-sm text-muted-foreground">
                          When someone shares study materials with you
                        </p>
                      </div>
                      <Switch 
                        checked={settings.notifications.resourceSharing}
                        onCheckedChange={(checked) => handleNotificationsChange('resourceSharing', checked)}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch 
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationsChange('emailNotifications', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Privacy Settings */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Privacy Settings</h1>
                <Button onClick={handleSaveChanges} disabled={!hasUnsavedChanges}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Profile Privacy</CardTitle>
                  <CardDescription>
                    Control who can see your profile and activity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Profile Visibility</h3>
                    <RadioGroup 
                      value={settings.privacy.profileVisibility} 
                      onValueChange={(value: string) => handlePrivacyChange('profileVisibility', value as typeof settings.privacy.profileVisibility)}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="visibility-public" />
                        <Label htmlFor="visibility-public">Public - Anyone can view your profile</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="friends" id="visibility-friends" />
                        <Label htmlFor="visibility-friends">Friends Only - Only your connections can view your profile</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="visibility-private" />
                        <Label htmlFor="visibility-private">Private - Your profile is not visible to others</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Show Activity Status</h3>
                        <p className="text-sm text-muted-foreground">
                          Show when you're online or studying
                        </p>
                      </div>
                      <Switch 
                        checked={settings.privacy.activityStatus}
                        onCheckedChange={(checked) => handlePrivacyChange('activityStatus', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Share Study Statistics</h3>
                        <p className="text-sm text-muted-foreground">
                          Allow others to see your study progress
                        </p>
                      </div>
                      <Switch 
                        checked={settings.privacy.shareStudyStats}
                        onCheckedChange={(checked) => handlePrivacyChange('shareStudyStats', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Allow Friend Requests</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive connection requests from other users
                        </p>
                      </div>
                      <Switch 
                        checked={settings.privacy.allowFriendRequests}
                        onCheckedChange={(checked) => handlePrivacyChange('allowFriendRequests', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Allow Group Invites</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive invitations to join study groups
                        </p>
                      </div>
                      <Switch 
                        checked={settings.privacy.allowGroupInvites}
                        onCheckedChange={(checked) => handlePrivacyChange('allowGroupInvites', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Data Settings</CardTitle>
                  <CardDescription>
                    Manage your data and privacy preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Data Collection</h3>
                      <p className="text-sm text-muted-foreground">
                        Allow anonymous usage data collection to improve our services
                      </p>
                    </div>
                    <Switch 
                      checked={settings.privacy.dataCollection}
                      onCheckedChange={(checked) => handlePrivacyChange('dataCollection', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Data Management</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button variant="outline">
                        <PenLine className="mr-2 h-4 w-4" />
                        Request My Data
                      </Button>
                      <Button variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Account deletion will permanently remove all your data and cannot be undone.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Connected Accounts */}
          {activeTab === "connected" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Connected Accounts</h1>
                <Button onClick={handleSaveChanges} disabled={!hasUnsavedChanges}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Linked Accounts</CardTitle>
                  <CardDescription>
                    Manage your connected third-party accounts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#4285F4] flex items-center justify-center">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Google</p>
                          <p className="text-xs text-muted-foreground">
                            {settings.connected.google ? "Connected" : "Not connected"}
                          </p>
                        </div>
                      </div>
                      {settings.connected.google ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleConnectedChange('google', false)}
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleConnectedChange('google', true)}
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#24292F] flex items-center justify-center">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">GitHub</p>
                          <p className="text-xs text-muted-foreground">
                            {settings.connected.github ? "Connected" : "Not connected"}
                          </p>
                        </div>
                      </div>
                      {settings.connected.github ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleConnectedChange('github', false)}
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleConnectedChange('github', true)}
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#0078D4] flex items-center justify-center">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M11.5 3.968c2.09 0 3.202.576 4.246 1.4 1.043.825 1.59 1.94 1.59 3.131 0 1.394-.51 2.489-1.414 3.32-.904.833-2.174 1.26-3.698 1.26h-3.66V19H5.5V4.25a.24.24 0 0 1 .079-.182.254.254 0 0 1 .177-.079h5.744v-.021zm-.084 6.594c.961 0 1.688-.201 2.172-.606.483-.403.726-.999.726-1.778 0-.826-.28-1.463-.837-1.901-.559-.439-1.344-.66-2.348-.66H8.526v4.945h2.89z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Microsoft</p>
                          <p className="text-xs text-muted-foreground">
                            {settings.connected.microsoft ? "Connected" : "Not connected"}
                          </p>
                        </div>
                      </div>
                      {settings.connected.microsoft ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleConnectedChange('microsoft', false)}
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleConnectedChange('microsoft', true)}
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center">
                          <svg width="18" height="22" viewBox="0 0 16 20" fill="white">
                            <path d="M13.623 10.121c-.021-2.044 1.674-3.025 1.75-3.074-0.957-1.396-2.443-1.587-2.97-1.603-1.253-0.132-2.455 0.745-3.094 0.745-0.649 0-1.639-0.731-2.698-0.709-1.367 0.021-2.648 0.81-3.354 2.044-1.443 2.499-0.368 6.185 1.026 8.209 0.689 0.987 1.502 2.095 2.57 2.054 1.036-0.044 1.424-0.662 2.674-0.662 1.235 0 1.599 0.662 2.684 0.638 1.112-0.021 1.813-1.001 2.486-1.995 0.794-1.143 1.114-2.255 1.126-2.315-0.021-0.022-2.155-0.825-2.178-3.287zM11.549 4.261c0.563-0.693 0.946-1.642 0.84-2.601-0.814 0.033-1.827 0.545-2.414 1.232-0.521 0.606-0.984 1.588-0.863 2.521 0.91 0.071 1.837-0.464 2.438-1.158z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Apple</p>
                          <p className="text-xs text-muted-foreground">
                            {settings.connected.apple ? "Connected" : "Not connected"}
                          </p>
                        </div>
                      </div>
                      {settings.connected.apple ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleConnectedChange('apple', false)}
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleConnectedChange('apple', true)}
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Active Sessions</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-md border">
                          <div>
                            <p className="font-medium">Current Session</p>
                            <p className="text-xs text-muted-foreground">
                              macOS • Chrome • Last active now
                            </p>
                          </div>
                          <Badge>Current</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 rounded-md border">
                          <div>
                            <p className="font-medium">iPhone 13</p>
                            <p className="text-xs text-muted-foreground">
                              iOS • Safari • Last active 2 hours ago
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">Log Out</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Accessibility Settings */}
          {activeTab === "accessibility" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Accessibility</h1>
                <Button onClick={handleSaveChanges} disabled={!hasUnsavedChanges}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Accessibility Settings</CardTitle>
                  <CardDescription>
                    Customize the app for better accessibility
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Screen Reader Support</h3>
                        <p className="text-sm text-muted-foreground">
                          Enhanced support for screen readers
                        </p>
                      </div>
                      <Switch 
                        checked={settings.accessibility.screenReader}
                        onCheckedChange={(checked) => handleAccessibilityChange('screenReader', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Reduced Motion</h3>
                        <p className="text-sm text-muted-foreground">
                          Minimize animations and motion effects
                        </p>
                      </div>
                      <Switch 
                        checked={settings.accessibility.reducedMotion}
                        onCheckedChange={(checked) => handleAccessibilityChange('reducedMotion', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">High Contrast</h3>
                        <p className="text-sm text-muted-foreground">
                          Increase contrast for better visibility
                        </p>
                      </div>
                      <Switch 
                        checked={settings.accessibility.highContrast}
                        onCheckedChange={(checked) => handleAccessibilityChange('highContrast', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Large Text</h3>
                        <p className="text-sm text-muted-foreground">
                          Use larger text throughout the app
                        </p>
                      </div>
                      <Switch 
                        checked={settings.accessibility.largeText}
                        onCheckedChange={(checked) => handleAccessibilityChange('largeText', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Keyboard Navigation</CardTitle>
                  <CardDescription>
                    Keyboard shortcuts and navigation options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <p>Navigate to Dashboard</p>
                      <kbd className="px-2 py-1 rounded bg-muted border text-xs">Alt + D</kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <p>Navigate to Settings</p>
                      <kbd className="px-2 py-1 rounded bg-muted border text-xs">Alt + S</kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <p>Start/Pause Study Session</p>
                      <kbd className="px-2 py-1 rounded bg-muted border text-xs">Space</kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <p>Quick Search</p>
                      <kbd className="px-2 py-1 rounded bg-muted border text-xs">Ctrl + K</kbd>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Reset Settings Dialog */}
          <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset all settings?</DialogTitle>
                <DialogDescription>
                  This will reset all your settings to their default values. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowResetDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleResetSettings}>
                  Reset All Settings
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
} 