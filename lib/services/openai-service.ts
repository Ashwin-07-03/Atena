"use client";

import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

// Generation configuration
const generationConfig = {
  temperature: 0.7,
  max_tokens: 1024,
  top_p: 0.95,
};

// Storage key
const API_KEY_STORAGE_KEY = 'atena-openai-api-key';

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
export function isOpenAIInitialized(): boolean {
  return isInitialized;
}

/**
 * Get the stored API key
 */
export function getOpenAIApiKey(): string | null {
  return apiKey;
}

/**
 * Initialize the API with an API key
 */
export function initializeOpenAIAPI(key: string): boolean {
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
    console.error('Error initializing OpenAI API:', error);
    return false;
  }
}

/**
 * Reset the API
 */
export function resetOpenAIAPI(): void {
  apiKey = null;
  isInitialized = false;
  
  // Remove from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
}

/**
 * Generate a response using the OpenAI API
 */
export async function generateChatResponse(
  messages: { role: string; content: string }[]
): Promise<string> {
  if (!isInitialized || !apiKey) {
    throw new Error('OpenAI API not initialized');
  }
  
  try {
    // Format messages for OpenAI API - they already have the right format
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'system' ? 'system' : msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 4000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    // Extract the response text
    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content;
    } else {
      throw new Error('No valid response from OpenAI API');
    }
  } catch (error) {
    console.error('Error generating OpenAI response:', error);
    throw error;
  }
}

// Get API key
export function getApiKey(): string {
  return apiKey || '';
}

/**
 * Try to initialize OpenAI API from stored key
 */
export function initializeFromStoredKey(): boolean {
  if (typeof window !== 'undefined') {
    const storedKey = localStorage.getItem('openai-api-key');
    if (storedKey) {
      return initializeOpenAIAPI(storedKey);
    }
  }
  return false;
} 