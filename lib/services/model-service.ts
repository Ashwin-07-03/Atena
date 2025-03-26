"use client";

import { 
  generateChatResponse as generateGeminiResponse,
  isGeminiInitialized,
  initializeGeminiAPI,
  resetGeminiAPI 
} from './gemini-service';

import { 
  generateChatResponse as generateOpenAIResponse,
  isOpenAIInitialized,
  initializeOpenAIAPI,
  resetOpenAIAPI 
} from './openai-service';

import { 
  generateChatResponse as generateAnthropicResponse,
  isAnthropicInitialized,
  initializeAnthropicAPI,
  resetAnthropicAPI 
} from './anthropic-service';

// Supported AI model providers
export type ModelProvider = 'gemini' | 'openai' | 'anthropic';

// Models available for each provider
export const availableModels = {
  gemini: [
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Advanced model for complex tasks' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Fast and efficient' }
  ],
  openai: [
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Most advanced OpenAI model' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Efficient and cost-effective' }
  ],
  anthropic: [
    { id: 'claude-3-opus', name: 'Claude 3 Opus', description: 'Most powerful Claude model' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', description: 'Balance of intelligence and speed' },
    { id: 'claude-3-haiku', name: 'Claude 3 Haiku', description: 'Fast and efficient' }
  ]
};

// Default model for each provider
export const defaultModels: Record<ModelProvider, string> = {
  gemini: 'gemini-1.5-pro',
  openai: 'gpt-4-turbo',
  anthropic: 'claude-3-opus'
};

// Storage keys
const PROVIDER_STORAGE_KEY = 'atena-ai-model-provider';
const MODEL_STORAGE_KEY = 'atena-ai-model-selection';

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
 * Get the current model ID for a provider
 */
export function getCurrentModel(provider: ModelProvider): string {
  if (typeof window === 'undefined') return defaultModels[provider];
  
  const storedModels = localStorage.getItem(MODEL_STORAGE_KEY);
  if (!storedModels) return defaultModels[provider];
  
  try {
    const models = JSON.parse(storedModels);
    return models[provider] || defaultModels[provider];
  } catch (error) {
    console.error('Error parsing stored models:', error);
    return defaultModels[provider];
  }
}

/**
 * Set the current model ID for a provider
 */
export function setCurrentModel(provider: ModelProvider, modelId: string): void {
  if (typeof window === 'undefined') return;
  
  const storedModels = localStorage.getItem(MODEL_STORAGE_KEY);
  let models: Record<ModelProvider, string> = {
    gemini: defaultModels.gemini,
    openai: defaultModels.openai,
    anthropic: defaultModels.anthropic
  };
  
  if (storedModels) {
    try {
      models = { ...models, ...JSON.parse(storedModels) };
    } catch (error) {
      console.error('Error parsing stored models:', error);
    }
  }
  
  models[provider] = modelId;
  localStorage.setItem(MODEL_STORAGE_KEY, JSON.stringify(models));
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
 * Initialize a provider's API
 */
export function initializeProviderAPI(provider: ModelProvider, key: string): boolean {
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