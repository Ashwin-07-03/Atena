"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { 
  getCurrentProvider,
  isProviderInitialized,
  initializeProviderAPI,
  resetProviderAPI,
  getStoredApiKey
} from "@/lib/services/model-service";
import { BrainCircuit, Sparkles, Zap } from "lucide-react";

interface ApiSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApiSettings({ isOpen, onClose }: ApiSettingsProps) {
  const [apiKey, setApiKey] = useState<string>('');
  const [connectedKey, setConnectedKey] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [keyError, setKeyError] = useState<string>('');
  const [currentProvider, setCurrentProvider] = useState<'gemini' | 'openai' | 'anthropic'>('gemini');

  useEffect(() => {
    if (isOpen) {
      // Get current provider and check if initialized
      const provider = getCurrentProvider();
      setCurrentProvider(provider);
      
      // Check if this provider is initialized
      const initialized = isProviderInitialized(provider);
      setIsInitialized(initialized);
      
      // Get stored API key if available
      const storedKey = getStoredApiKey(provider);
      if (storedKey) {
        const maskedKey = storedKey.substring(0, 4) + '...' + storedKey.substring(storedKey.length - 4);
        setConnectedKey(maskedKey);
      } else {
        setConnectedKey('');
      }
    }
  }, [isOpen]);

  // Handle API key submission
  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) {
      setKeyError('API key cannot be empty');
      return;
    }

    const success = initializeProviderAPI(currentProvider, apiKey);
    if (success) {
      setIsInitialized(true);
      // Store masked version of API key for display
      const maskedKey = apiKey.substring(0, 4) + '...' + apiKey.substring(apiKey.length - 4);
      setConnectedKey(maskedKey);
      setApiKey('');
      setKeyError('');
      onClose();
    } else {
      setKeyError('Invalid API key or initialization failed');
    }
  };

  // Handle API key reset
  const handleApiKeyReset = () => {
    resetProviderAPI(currentProvider);
    setIsInitialized(false);
    setApiKey('');
    setConnectedKey('');
    setKeyError('');
  };

  // Get provider info
  const getProviderInfo = () => {
    switch (currentProvider) {
      case 'gemini':
        return {
          name: 'Google Gemini',
          icon: <Sparkles className="h-5 w-5 text-blue-500" />,
          description: 'Use your Google AI Studio API key'
        };
      case 'openai':
        return {
          name: 'OpenAI',
          icon: <Zap className="h-5 w-5 text-green-500" />,
          description: 'Use your OpenAI API key'
        };
      case 'anthropic':
        return {
          name: 'Anthropic Claude',
          icon: <BrainCircuit className="h-5 w-5 text-purple-500" />,
          description: 'Use your Anthropic API key'
        };
      default:
        return {
          name: 'AI Provider',
          icon: null,
          description: 'Enter your API key'
        };
    }
  };

  const providerInfo = getProviderInfo();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {providerInfo.icon}
            <span>{providerInfo.name} API Setup</span>
          </DialogTitle>
          <DialogDescription>
            {providerInfo.description} to enable the Study Chatbot.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>API Key</Label>
              {isInitialized ? (
                <div className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full">
                  Connected
                </div>
              ) : (
                <div className="text-xs bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded-full">
                  Not Connected
                </div>
              )}
            </div>
            
            <div className="grid gap-2">
              {isInitialized && connectedKey && (
                <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded border text-sm">
                  <span>Connected key: {connectedKey}</span>
                </div>
              )}
              
              <Input
                type="password"
                placeholder={`Enter your ${providerInfo.name} API key`}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              
              {keyError && <p className="text-sm text-red-500">{keyError}</p>}
              
              <p className="text-xs text-muted-foreground mt-1">
                Your API key is stored locally in your browser and never sent to our servers.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleApiKeyReset}
            disabled={!isInitialized}
          >
            Reset Key
          </Button>
          <Button onClick={handleApiKeySubmit}>
            Save Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 