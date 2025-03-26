"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  availableModels, 
  getCurrentProvider, 
  setCurrentProvider, 
  getCurrentModel, 
  setCurrentModel,
  isProviderInitialized,
  initializeProviderAPI,
  resetProviderAPI,
  ModelProvider
} from "@/lib/services/model-service";

// Icons for different model providers
import { BrainCircuit, Sparkles, Zap } from "lucide-react";

export function ModelSettings() {
  const [selectedProvider, setSelectedProvider] = useState<ModelProvider>('gemini');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [keyError, setKeyError] = useState<string>('');

  useEffect(() => {
    // Get current provider on mount
    const provider = getCurrentProvider();
    setSelectedProvider(provider);
    
    // Get current model for this provider
    const model = getCurrentModel(provider);
    setSelectedModel(model);
    
    // Check if this provider is initialized
    const initialized = isProviderInitialized(provider);
    setIsInitialized(initialized);
  }, []);

  // When provider changes, update the selected model
  useEffect(() => {
    const model = getCurrentModel(selectedProvider);
    setSelectedModel(model);
    
    // Check if this provider is initialized
    const initialized = isProviderInitialized(selectedProvider);
    setIsInitialized(initialized);
    setKeyError('');
  }, [selectedProvider]);

  // Handle provider change
  const handleProviderChange = (value: ModelProvider) => {
    setSelectedProvider(value);
    setCurrentProvider(value);
  };

  // Handle model change
  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    setCurrentModel(selectedProvider, value);
  };

  // Handle API key submission
  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) {
      setKeyError('API key cannot be empty');
      return;
    }

    const success = initializeProviderAPI(selectedProvider, apiKey);
    if (success) {
      setIsInitialized(true);
      setApiKey('');
      setKeyError('');
    } else {
      setKeyError('Invalid API key or initialization failed');
    }
  };

  // Handle API key reset
  const handleApiKeyReset = () => {
    resetProviderAPI(selectedProvider);
    setIsInitialized(false);
    setApiKey('');
    setKeyError('');
  };

  // Get provider icon
  const getProviderIcon = (provider: ModelProvider) => {
    switch (provider) {
      case 'gemini':
        return <Sparkles className="h-4 w-4" />;
      case 'openai':
        return <Zap className="h-4 w-4" />;
      case 'anthropic':
        return <BrainCircuit className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Model Settings</CardTitle>
        <CardDescription>
          Configure your preferred AI model providers and models
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Provider Selection */}
        <div className="space-y-3">
          <Label>Model Provider</Label>
          <RadioGroup 
            value={selectedProvider} 
            onValueChange={(value) => handleProviderChange(value as ModelProvider)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="gemini" id="gemini" />
              <Label htmlFor="gemini" className="flex items-center gap-2 cursor-pointer">
                <Sparkles className="h-4 w-4" /> Google Gemini
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="openai" id="openai" />
              <Label htmlFor="openai" className="flex items-center gap-2 cursor-pointer">
                <Zap className="h-4 w-4" /> OpenAI
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="anthropic" id="anthropic" />
              <Label htmlFor="anthropic" className="flex items-center gap-2 cursor-pointer">
                <BrainCircuit className="h-4 w-4" /> Anthropic Claude
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Model Selection */}
        <div className="space-y-3">
          <Label>Model</Label>
          <Select value={selectedModel} onValueChange={handleModelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {availableModels[selectedProvider].map(model => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name} - {model.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* API Key */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>API Key</Label>
            {isInitialized ? (
              <div className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full">
                Initialized
              </div>
            ) : (
              <div className="text-xs bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded-full">
                Not Initialized
              </div>
            )}
          </div>
          
          <div className="grid gap-2">
            <Input
              type="password"
              placeholder={`Enter your ${selectedProvider} API key`}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            {keyError && <p className="text-sm text-red-500">{keyError}</p>}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
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
      </CardFooter>
    </Card>
  );
} 