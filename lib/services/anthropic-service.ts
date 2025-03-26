"use client";

import Anthropic from '@anthropic-ai/sdk';

// Generation configuration
const generationConfig = {
  temperature: 0.7,
  max_tokens: 1024,
  top_p: 0.95,
};

// Storage key
const API_KEY_STORAGE_KEY = 'atena-anthropic-api-key';

let isInitialized = false;
let apiKey: string | null = null;

// Initialize the API on client-side mount
if (typeof window !== 'undefined') {
  // Try to load from localStorage
  const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (storedKey) {
    apiKey = storedKey;
    isInitialized = true;
  }
}

/**
 * Check if the API is initialized
 */
export function isAnthropicInitialized(): boolean {
  return isInitialized;
}

/**
 * Get the stored API key
 */
export function getAnthropicApiKey(): string | null {
  return apiKey;
}

/**
 * Initialize the API with an API key
 */
export function initializeAnthropicAPI(key: string): boolean {
  if (!key) return false;
  
  try {
    apiKey = key;
    isInitialized = true;
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing Anthropic API:', error);
    return false;
  }
}

/**
 * Reset the API
 */
export function resetAnthropicAPI(): void {
  apiKey = null;
  isInitialized = false;
  
  // Remove from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
}

/**
 * Generate a response using the Anthropic API
 */
export async function generateChatResponse(
  messages: { role: string; content: string }[]
): Promise<string> {
  if (!isInitialized || !apiKey) {
    throw new Error('Anthropic API not initialized');
  }
  
  try {
    // Format messages for Anthropic API
    const formattedMessages = messages.map(msg => {
      if (msg.role === 'system') {
        return { role: 'system', content: msg.content };
      } else if (msg.role === 'user') {
        return { role: 'user', content: msg.content };
      } else {
        return { role: 'assistant', content: msg.content };
      }
    });
    
    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        messages: formattedMessages,
        max_tokens: 4000,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Anthropic API error:', errorData);
      throw new Error(`Anthropic API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    // Extract the response text
    if (data.content && data.content[0]?.text) {
      return data.content[0].text;
    } else {
      throw new Error('No valid response from Anthropic API');
    }
  } catch (error) {
    console.error('Error generating Anthropic response:', error);
    throw error;
  }
}

// Get API key
export function getApiKey(): string {
  return apiKey || '';
}

/**
 * Try to initialize Anthropic API from stored key
 */
export function initializeFromStoredKey(): boolean {
  if (typeof window !== 'undefined') {
    const storedKey = localStorage.getItem('anthropic-api-key');
    if (storedKey) {
      return initializeAnthropicAPI(storedKey);
    }
  }
  return false;
} 