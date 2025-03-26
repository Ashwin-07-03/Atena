"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Key, Save, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { initializeGeminiAPI, isGeminiInitialized, getApiKey, resetGeminiAPI } from "@/lib/services/gemini-service";
import { AIAssistantService } from "@/lib/services/ai-assistant-service";
import Link from "next/link";

export default function AISettingsPage() {
  const [apiKey, setApiKey] = useState<string>("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load saved API key on mount
  useEffect(() => {
    // Check if Gemini is already initialized
    setIsInitialized(isGeminiInitialized());
    
    // Set the API key from the service (if any)
    const savedKey = getApiKey();
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  // Handle saving the API key
  const handleSaveApiKey = () => {
    try {
      if (!apiKey.trim()) {
        setSaveStatus("error");
        setStatusMessage("Please enter a valid API key.");
        return;
      }

      // Initialize Gemini with the new API key
      const success = initializeGeminiAPI(apiKey.trim());
      
      if (success) {
        setSaveStatus("success");
        setStatusMessage("API key saved successfully. Your AI assistant is now using Gemini.");
        setIsInitialized(true);
      } else {
        setSaveStatus("error");
        setStatusMessage("Failed to initialize Gemini API. Please check your API key.");
      }
    } catch (error) {
      setSaveStatus("error");
      setStatusMessage("An error occurred. Please try again.");
      console.error("Error saving API key:", error);
    }
  };

  // Clear all stored data
  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all AI assistant data? This will remove all chat history and settings.")) {
      // Clear all data from AI Assistant Service
      AIAssistantService.clearAllData();
      
      // Reset Gemini API (clears both localStorage and in-memory state)
      resetGeminiAPI();
      
      // Update UI state
      setApiKey("");
      setIsInitialized(false);
      setSaveStatus("success");
      setStatusMessage("All data cleared successfully.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI Assistant Settings</h1>
          <p className="text-muted-foreground">Configure your AI assistant</p>
        </div>
        <Link href="/dashboard/ai">
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Chat
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {/* API Key Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Gemini API Configuration
            </CardTitle>
            <CardDescription>
              Configure your AI assistant to use the Gemini API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="apiKey">Gemini API Key</Label>
                {isInitialized && (
                  <span className="text-xs flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    Connected
                  </span>
                )}
              </div>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>

            {saveStatus !== "idle" && (
              <Alert variant={saveStatus === "success" ? "default" : "destructive"}>
                <div className="flex items-center gap-2">
                  {saveStatus === "success" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {saveStatus === "success" ? "Success" : "Error"}
                  </AlertTitle>
                </div>
                <AlertDescription>{statusMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1">
              <h4 className="text-sm font-medium">How to get a Gemini API key:</h4>
              <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
                <li>Go to <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a></li>
                <li>Sign in with your Google account</li>
                <li>Navigate to the API keys section</li>
                <li>Create a new API key</li>
                <li>Copy and paste it here</li>
              </ol>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" onClick={handleClearData} className="text-destructive hover:text-destructive">
              Clear All Data
            </Button>
            <Button onClick={handleSaveApiKey} className="gap-1">
              <Save className="h-4 w-4" />
              Save API Key
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 