"use client";

import { 
  generateChatResponse as generateGeminiResponse,
  isGeminiInitialized,
  initializeGeminiAPI,
  resetGeminiAPI,
  getGeminiApiKey
} from './gemini-service';

import { 
  generateChatResponse as generateOpenAIResponse,
  isOpenAIInitialized,
  initializeOpenAIAPI,
  resetOpenAIAPI,
  getOpenAIApiKey
} from './openai-service';

import { 
  generateChatResponse as generateAnthropicResponse,
  isAnthropicInitialized,
  initializeAnthropicAPI,
  resetAnthropicAPI,
  getAnthropicApiKey
} from './anthropic-service';

// Supported AI model providers
export type ModelProvider = 'gemini' | 'openai' | 'anthropic';

// Storage keys
const PROVIDER_STORAGE_KEY = 'atena-ai-model-provider';

/**
 * Get the current model provider
 */
export function getCurrentProvider(): ModelProvider {
  if (typeof window === 'undefined') return 'gemini';
  
  const storedProvider = localStorage.getItem(PROVIDER_STORAGE_KEY);
  return (storedProvider as ModelProvider) || 'gemini';
}

/**
 * Set the current model provider
 */
export function setCurrentProvider(provider: ModelProvider): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(PROVIDER_STORAGE_KEY, provider);
}

/**
 * Check if a provider's API is initialized
 */
export function isProviderInitialized(provider: ModelProvider): boolean {
  switch (provider) {
    case 'gemini':
      return isGeminiInitialized();
    case 'openai':
      return isOpenAIInitialized();
    case 'anthropic':
      return isAnthropicInitialized();
    default:
      return false;
  }
}

/**
 * Get the stored API key for a provider
 */
export function getStoredApiKey(provider: ModelProvider): string | null {
  switch (provider) {
    case 'gemini':
      return getGeminiApiKey();
    case 'openai':
      return getOpenAIApiKey();
    case 'anthropic':
      return getAnthropicApiKey();
    default:
      return null;
  }
}

/**
 * Initialize a provider's API
 */
export function initializeProviderAPI(provider: ModelProvider, key: string): boolean {
  // First try to set the current provider
  setCurrentProvider(provider);
  
  // Then initialize the API
  switch (provider) {
    case 'gemini':
      return initializeGeminiAPI(key);
    case 'openai':
      return initializeOpenAIAPI(key);
    case 'anthropic':
      return initializeAnthropicAPI(key);
    default:
      return false;
  }
}

/**
 * Reset a provider's API
 */
export function resetProviderAPI(provider: ModelProvider): void {
  switch (provider) {
    case 'gemini':
      resetGeminiAPI();
      break;
    case 'openai':
      resetOpenAIAPI();
      break;
    case 'anthropic':
      resetAnthropicAPI();
      break;
  }
}

/**
 * Generate a chat response using the specified provider
 */
export async function generateAIResponse(
  provider: ModelProvider,
  messages: { role: string; content: string }[]
): Promise<string> {
  switch (provider) {
    case 'gemini':
      return generateGeminiResponse(messages);
    case 'openai':
      return generateOpenAIResponse(messages);
    case 'anthropic':
      return generateAnthropicResponse(messages);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

/**
 * Generate a chat response using the current provider
 */
export async function generateResponse(
  messages: { role: string; content: string }[]
): Promise<string> {
  const provider = getCurrentProvider();
  
  try {
    if (!isProviderInitialized(provider)) {
      // Try to use a different initialized provider
      const providers: ModelProvider[] = ['gemini', 'openai', 'anthropic'];
      const availableProvider = providers.find(p => p !== provider && isProviderInitialized(p));
      
      if (availableProvider) {
        console.log(`Primary provider ${provider} not initialized. Using ${availableProvider} instead.`);
        return generateAIResponse(availableProvider, messages);
      }
      
      throw new Error(`No initialized AI provider available. Please add an API key in settings.`);
    }
    
    return generateAIResponse(provider, messages);
  } catch (error) {
    console.error('Error generating response:', error);
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }
    return 'An unknown error occurred while generating a response.';
  }
} 